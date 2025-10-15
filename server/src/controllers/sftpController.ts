import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/crypto.js';
import { AuthRequest } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

export async function createSftpCredential(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const userId = req.user!.id;

    // Check if username already exists
    const existing = await prisma.sftpCredential.findUnique({
      where: { username },
    });

    if (existing) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create SFTP credential
    const credential = await prisma.sftpCredential.create({
      data: {
        userId,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        active: true,
        createdAt: true,
        lastUsed: true,
      },
    });

    logger.info(`SFTP credential created for user: ${userId}, username: ${username}`);

    res.status(201).json({ credential });
  } catch (error) {
    logger.error('Create SFTP credential error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getSftpCredentials(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Admin/Staff can see all credentials, Clients see only their own
    const where = userRole === 'CLIENT' ? { userId } : {};

    const credentials = await prisma.sftpCredential.findMany({
      where,
      select: {
        id: true,
        username: true,
        active: true,
        createdAt: true,
        lastUsed: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ credentials });
  } catch (error) {
    logger.error('Get SFTP credentials error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateSftpCredential(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { password, active } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Check if credential exists
    const existing = await prisma.sftpCredential.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ error: 'Credential not found' });
      return;
    }

    // Check permissions
    if (userRole === 'CLIENT' && existing.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const updateData: any = {};

    if (password) {
      updateData.password = await hashPassword(password);
    }

    if (typeof active === 'boolean') {
      updateData.active = active;
    }

    const credential = await prisma.sftpCredential.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        active: true,
        createdAt: true,
        lastUsed: true,
      },
    });

    logger.info(`SFTP credential updated: ${id}`);

    res.json({ credential });
  } catch (error) {
    logger.error('Update SFTP credential error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteSftpCredential(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const credential = await prisma.sftpCredential.findUnique({
      where: { id },
    });

    if (!credential) {
      res.status(404).json({ error: 'Credential not found' });
      return;
    }

    if (userRole === 'CLIENT' && credential.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.sftpCredential.delete({
      where: { id },
    });

    logger.info(`SFTP credential deleted: ${id}`);

    res.json({ message: 'Credential deleted successfully' });
  } catch (error) {
    logger.error('Delete SFTP credential error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
