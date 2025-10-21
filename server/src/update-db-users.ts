import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function updateUsers() {
  console.log('🔄 Updating users via Prisma...');

  try {
    // Update ADMIN user
    const admin = await prisma.user.updateMany({
      where: { role: 'ADMIN' },
      data: {
        email: 'nick@jdgraphic.com',
        name: 'Nick @ JD Graphic',
      },
    });
    console.log(`✅ Updated ${admin.count} ADMIN user(s)`);

    // Update STAFF user
    const staff = await prisma.user.updateMany({
      where: { role: 'STAFF' },
      data: {
        email: 'ayang@abt.com',
        name: 'Angela Yang',
      },
    });
    console.log(`✅ Updated ${staff.count} STAFF user(s)`);

    // Verify updates
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'STAFF'] },
        active: true,
      },
      select: {
        email: true,
        name: true,
        role: true,
      },
    });

    console.log('');
    console.log('📋 Current ADMIN/STAFF users:');
    users.forEach(user => {
      console.log(`   ${user.role}: ${user.name} <${user.email}>`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUsers();
