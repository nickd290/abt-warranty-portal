import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export async function uploadFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { jobId, fileType } = req.body;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Verify job exists and user has permission
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    if (userRole === 'CLIENT' && job.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Create file record
    const file = await prisma.file.create({
      data: {
        jobId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        uploadedVia: 'WEB',
      },
    });

    // Update job status if all required files are uploaded
    const fileCount = await prisma.file.count({
      where: { jobId },
    });

    if (fileCount >= 6 && job.status === 'DRAFT') {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'ASSETS_UPLOADED' },
      });
    }

    logger.info(`File uploaded: ${file.id} for job ${jobId}`);

    res.status(201).json({ file });
  } catch (error) {
    logger.error('Upload file error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        job: {
          select: { userId: true },
        },
      },
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    if (userRole === 'CLIENT' && file.job.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Send file
    if (fs.existsSync(file.filePath)) {
      res.download(file.filePath, file.originalName);
    } else {
      res.status(404).json({ error: 'File not found on disk' });
    }
  } catch (error) {
    logger.error('Get file error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const file = await prisma.file.findUnique({
      where: { id },
      include: {
        job: {
          select: { userId: true },
        },
      },
    });

    if (!file) {
      res.status(404).json({ error: 'File not found' });
      return;
    }

    if (userRole === 'CLIENT' && file.job.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete file from disk
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete record
    await prisma.file.delete({
      where: { id },
    });

    logger.info(`File deleted: ${id}`);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    logger.error('Delete file error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getJobFiles(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { jobId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    if (userRole === 'CLIENT' && job.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const files = await prisma.file.findMany({
      where: { jobId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ files });
  } catch (error) {
    logger.error('Get job files error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
