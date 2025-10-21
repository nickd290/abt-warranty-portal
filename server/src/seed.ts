import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils/crypto.js';
import logger from './utils/logger.js';

const prisma = new PrismaClient();

async function seed() {
  try {
    logger.info('🌱 Starting database seed...');

    // Check if database is already seeded
    const existingInvoices = await prisma.invoice.count();
    if (existingInvoices > 0) {
      logger.info('✅ Database already seeded, skipping...');
      logger.info('📝 Login Credentials:');
      logger.info('Admin: admin@abtwarranty.com / admin123');
      logger.info('Staff: staff@abtwarranty.com / staff123');
      logger.info('Client: client@abtelectronics.com / client123');
      logger.info('\n🔐 SFTP Credentials:');
      logger.info('Username: abt_uploads');
      logger.info('Password: abt_sftp_2024');
      logger.info(`Host: localhost:2222\n`);
      return;
    }

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@abtwarranty.com' },
      update: {},
      create: {
        email: 'admin@abtwarranty.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
    logger.info(`✅ Created admin user: ${admin.email}`);

    // Create staff user
    const staffPassword = await hashPassword('staff123');
    const staff = await prisma.user.upsert({
      where: { email: 'staff@abtwarranty.com' },
      update: {},
      create: {
        email: 'staff@abtwarranty.com',
        password: staffPassword,
        name: 'Staff User',
        role: 'STAFF',
      },
    });
    logger.info(`✅ Created staff user: ${staff.email}`);

    // Create client user
    const clientPassword = await hashPassword('client123');
    const client = await prisma.user.upsert({
      where: { email: 'client@abtelectronics.com' },
      update: {},
      create: {
        email: 'client@abtelectronics.com',
        password: clientPassword,
        name: 'ABT Electronics',
        role: 'CLIENT',
      },
    });
    logger.info(`✅ Created client user: ${client.email}`);

    // Create SFTP credential for client
    const sftpPassword = await hashPassword('abt_sftp_2024');
    const sftpCred = await prisma.sftpCredential.upsert({
      where: { username: 'abt_uploads' },
      update: {},
      create: {
        userId: client.id,
        username: 'abt_uploads',
        password: sftpPassword,
      },
    });
    logger.info(`✅ Created SFTP credential: ${sftpCred.username}`);

    // Create sample jobs
    const job1 = await prisma.job.create({
      data: {
        userId: client.id,
        month: 'December',
        year: 2024,
        campaignName: 'Holiday Warranty Push',
        status: 'DRAFT',
      },
    });
    logger.info(`✅ Created job: ${job1.campaignName}`);

    const job2 = await prisma.job.create({
      data: {
        userId: client.id,
        month: 'January',
        year: 2025,
        campaignName: 'New Year Extended Warranty',
        status: 'PROOFING',
        mailCount: 5000,
        ratePerPiece: 0.85,
      },
    });
    logger.info(`✅ Created job: ${job2.campaignName}`);

    const job3 = await prisma.job.create({
      data: {
        userId: client.id,
        month: 'November',
        year: 2024,
        campaignName: 'Fall Protection Plans',
        status: 'COMPLETE',
        mailCount: 4500,
        ratePerPiece: 0.85,
        totalCost: 3825.00,
        taxAmount: 344.25,
        approvedAt: new Date('2024-10-15'),
        mailedAt: new Date('2024-11-01'),
      },
    });
    logger.info(`✅ Created job: ${job3.campaignName}`);

    // Create invoice for completed job
    const invoice = await prisma.invoice.create({
      data: {
        jobId: job3.id,
        invoiceNum: 'INV-2024-001',
        amount: 3825.00,
        taxAmount: 344.25,
        totalAmount: 4169.25,
        status: 'PAID',
        paidAt: new Date('2024-11-15'),
      },
    });
    logger.info(`✅ Created invoice: ${invoice.invoiceNum}`);

    logger.info('🎉 Database seeded successfully!');
    logger.info('\n📝 Login Credentials:');
    logger.info('Admin: admin@abtwarranty.com / admin123');
    logger.info('Staff: staff@abtwarranty.com / staff123');
    logger.info('Client: client@abtelectronics.com / client123');
    logger.info('\n🔐 SFTP Credentials:');
    logger.info('Username: abt_uploads');
    logger.info('Password: abt_sftp_2024');
    logger.info(`Host: localhost:2222\n`);

  } catch (error) {
    logger.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
