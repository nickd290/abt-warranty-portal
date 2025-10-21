import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils/crypto.js';

const prisma = new PrismaClient();

async function addNicole() {
  try {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: 'nicole.wittman@abt.com' },
    });

    if (existing) {
      console.log('✅ nicole.wittman@abt.com already exists');
      console.log(`   Role: ${existing.role}, Active: ${existing.active}`);

      // Update to ensure active and STAFF role
      if (!existing.active || existing.role !== 'STAFF') {
        await prisma.user.update({
          where: { email: 'nicole.wittman@abt.com' },
          data: {
            role: 'STAFF',
            active: true,
          },
        });
        console.log('✅ Updated nicole.wittman@abt.com to STAFF and active');
      }
      return;
    }

    // Create new user
    const hashedPassword = await hashPassword('nicole123'); // Temporary password

    const user = await prisma.user.create({
      data: {
        email: 'nicole.wittman@abt.com',
        name: 'Nicole Wittman',
        password: hashedPassword,
        role: 'STAFF',
        active: true,
      },
    });

    console.log('✅ Created user:', {
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
    });
    console.log('⚠️  Temporary password: nicole123 (should be changed on first login)');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addNicole();
