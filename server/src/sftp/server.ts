import fs from 'fs';
import path from 'path';
import ssh2 from 'ssh2';
import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../utils/crypto.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

const { Server: SshServer } = ssh2;

const prisma = new PrismaClient();

export class SftpServer {
  private server: SshServer;
  private uploadDir: string;
  private userDirectories: Map<string, string> = new Map();

  constructor() {
    this.server = new SshServer({
      hostKeys: [fs.readFileSync(path.join(process.cwd(), 'server_key'))],
    }, this.handleConnection.bind(this));

    this.uploadDir = config.upload.dir;

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private getUserDirectory(username: string): string {
    if (!this.userDirectories.has(username)) {
      const userDir = path.join(this.uploadDir, username);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
        logger.info(`Created user directory: ${userDir}`);
      }
      this.userDirectories.set(username, userDir);
    }
    return this.userDirectories.get(username)!;
  }

  private async handleConnection(client: any) {
    logger.info('SFTP: New connection attempt');
    let authenticatedUsername: string | null = null;

    client.on('authentication', async (ctx: any) => {
      if (ctx.method === 'password') {
        try {
          // Verify SFTP credentials against database
          const credential = await prisma.sftpCredential.findUnique({
            where: { username: ctx.username, active: true },
            include: { user: true },
          });

          if (!credential) {
            logger.warn(`SFTP: Failed login attempt for user: ${ctx.username}`);
            ctx.reject();
            return;
          }

          const isValid = await comparePassword(ctx.password, credential.password);

          if (!isValid) {
            logger.warn(`SFTP: Invalid password for user: ${ctx.username}`);
            ctx.reject();
            return;
          }

          // Update last used timestamp
          await prisma.sftpCredential.update({
            where: { id: credential.id },
            data: { lastUsed: new Date() },
          });

          logger.info(`SFTP: Successful authentication for user: ${ctx.username}`);
          authenticatedUsername = ctx.username;
          ctx.accept();
        } catch (error) {
          logger.error('SFTP: Authentication error', error);
          ctx.reject();
        }
      } else {
        ctx.reject();
      }
    });

    client.on('ready', () => {
      logger.info('SFTP: Client authenticated and ready');

      client.on('session', (accept: any) => {
        const session = accept();

        session.on('sftp', (accept: any) => {
          logger.info('SFTP: SFTP session started');
          const sftp = accept();

          // Handle SFTP protocol commands with user-specific directory
          if (authenticatedUsername) {
            const userDir = this.getUserDirectory(authenticatedUsername);
            this.handleSftpSession(sftp, client, userDir, authenticatedUsername);
          } else {
            logger.error('SFTP: Session started without authentication');
          }
        });
      });
    });

    client.on('error', (err: Error) => {
      logger.error('SFTP: Client error', err);
    });

    client.on('end', () => {
      logger.info('SFTP: Client disconnected');
    });
  }

  private handleSftpSession(sftp: any, client: any, userDir: string, username: string) {
    // OPEN file
    sftp.on('OPEN', (reqid: number, filename: string, flags: number, attrs: any) => {
      logger.info(`SFTP: OPEN request - ${filename} for user ${username}`);

      const filePath = path.join(userDir, path.basename(filename));

      try {
        let handle: number;
        if (flags & 0x0001) { // Write
          handle = fs.openSync(filePath, 'w');
        } else { // Read
          handle = fs.openSync(filePath, 'r');
        }

        const handleBuffer = Buffer.alloc(4);
        handleBuffer.writeUInt32BE(handle, 0);
        sftp.handle(reqid, handleBuffer);
      } catch (err) {
        logger.error(`SFTP: Error opening file ${filename}`, err);
        sftp.status(reqid, 2); // SSH_FX_FAILURE
      }
    });

    // WRITE file
    sftp.on('WRITE', (reqid: number, handle: Buffer, offset: number, data: Buffer) => {
      const fd = handle.readUInt32BE(0);
      logger.debug(`SFTP: WRITE request - handle ${fd}, offset ${offset}, size ${data.length}`);

      try {
        fs.writeSync(fd, data, 0, data.length, offset);
        sftp.status(reqid, 0); // SSH_FX_OK
      } catch (err) {
        logger.error(`SFTP: Error writing file`, err);
        sftp.status(reqid, 2); // SSH_FX_FAILURE
      }
    });

    // READ file
    sftp.on('READ', (reqid: number, handle: Buffer, offset: number, length: number) => {
      const fd = handle.readUInt32BE(0);
      logger.debug(`SFTP: READ request - handle ${fd}, offset ${offset}, length ${length}`);

      try {
        const buffer = Buffer.alloc(length);
        const bytesRead = fs.readSync(fd, buffer, 0, length, offset);

        if (bytesRead === 0) {
          sftp.status(reqid, 1); // SSH_FX_EOF
        } else {
          sftp.data(reqid, buffer.slice(0, bytesRead));
        }
      } catch (err) {
        logger.error(`SFTP: Error reading file`, err);
        sftp.status(reqid, 2); // SSH_FX_FAILURE
      }
    });

    // CLOSE file
    sftp.on('CLOSE', (reqid: number, handle: Buffer) => {
      const fd = handle.readUInt32BE(0);
      logger.info(`SFTP: CLOSE request - handle ${fd}`);

      try {
        fs.closeSync(fd);
        sftp.status(reqid, 0); // SSH_FX_OK
      } catch (err) {
        logger.error(`SFTP: Error closing file`, err);
        sftp.status(reqid, 2); // SSH_FX_FAILURE
      }
    });

    // OPENDIR
    sftp.on('OPENDIR', (reqid: number, path: string) => {
      logger.info(`SFTP: OPENDIR request - ${path}`);

      const handleBuffer = Buffer.alloc(4);
      handleBuffer.writeUInt32BE(1, 0); // Dummy handle
      sftp.handle(reqid, handleBuffer);
    });

    // READDIR
    sftp.on('READDIR', (reqid: number, handle: Buffer) => {
      logger.info(`SFTP: READDIR request for user ${username}`);

      try {
        const files = fs.readdirSync(userDir);

        if (files.length === 0) {
          sftp.status(reqid, 1); // SSH_FX_EOF
          return;
        }

        const names = files.map(file => {
          const stats = fs.statSync(path.join(userDir, file));
          return {
            filename: file,
            longname: `${stats.isDirectory() ? 'd' : '-'}rwxr-xr-x 1 user group ${stats.size} ${new Date(stats.mtime).toISOString()} ${file}`,
            attrs: {
              mode: stats.mode,
              size: stats.size,
              atime: Math.floor(stats.atime.getTime() / 1000),
              mtime: Math.floor(stats.mtime.getTime() / 1000),
            },
          };
        });

        sftp.name(reqid, names);
      } catch (err) {
        logger.error(`SFTP: Error reading directory`, err);
        sftp.status(reqid, 2); // SSH_FX_FAILURE
      }
    });

    // STAT
    sftp.on('STAT', (reqid: number, filePath: string) => {
      logger.info(`SFTP: STAT request - ${filePath} for user ${username}`);

      try {
        const stats = fs.statSync(userDir);
        sftp.attrs(reqid, {
          mode: stats.mode,
          size: stats.size,
          atime: Math.floor(stats.atime.getTime() / 1000),
          mtime: Math.floor(stats.mtime.getTime() / 1000),
        });
      } catch (err) {
        logger.error(`SFTP: Error getting stats`, err);
        sftp.status(reqid, 2); // SSH_FX_FAILURE
      }
    });
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(config.sftp.port, config.sftp.host, () => {
        logger.info(`SFTP server listening on ${config.sftp.host}:${config.sftp.port}`);
        resolve();
      });
    });
  }

  public stop(): void {
    this.server.close();
    logger.info('SFTP server stopped');
  }
}
