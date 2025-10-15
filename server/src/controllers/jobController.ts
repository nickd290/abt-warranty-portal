import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

export async function getJobs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    // Admin/Staff can see all jobs, Clients see only their own
    const where = userRole === 'CLIENT' ? { userId } : {};

    const jobs = await prisma.job.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        files: true,
        _count: {
          select: { files: true, invoices: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ jobs });
  } catch (error) {
    logger.error('Get jobs error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        files: true,
        invoices: true,
        proofEvents: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Check permissions
    if (userRole === 'CLIENT' && job.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ job });
  } catch (error) {
    logger.error('Get job error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { month, year, campaignName } = req.body;
    const userId = req.user!.id;

    const job = await prisma.job.create({
      data: {
        userId,
        month,
        year: parseInt(year),
        campaignName,
        status: 'DRAFT',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    logger.info(`Job created: ${job.id} by user ${userId}`);

    res.status(201).json({ job });
  } catch (error) {
    logger.error('Create job error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const updates = req.body;

    // Check if job exists and user has permission
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    if (userRole === 'CLIENT' && existingJob.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update job
    const job = await prisma.job.update({
      where: { id },
      data: updates,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        files: true,
      },
    });

    logger.info(`Job updated: ${job.id}`);

    res.json({ job });
  } catch (error) {
    logger.error('Update job error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    if (userRole === 'CLIENT' && job.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.job.delete({
      where: { id },
    });

    logger.info(`Job deleted: ${id}`);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    logger.error('Delete job error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addProofEvent(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { jobId } = req.params;
    const { action, notes } = req.body;
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

    const proofEvent = await prisma.proofEvent.create({
      data: {
        jobId,
        action,
        notes,
      },
    });

    // Update job status based on action
    if (action === 'APPROVED') {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'APPROVED', approvedAt: new Date() },
      });
    }

    logger.info(`Proof event added: ${action} for job ${jobId}`);

    res.status(201).json({ proofEvent });
  } catch (error) {
    logger.error('Add proof event error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
