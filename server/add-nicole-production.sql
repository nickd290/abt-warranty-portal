-- Add nicole.wittman@abt.com to production database
-- Run this in Railway PostgreSQL console

-- First check if user exists
SELECT * FROM "User" WHERE email = 'nicole.wittman@abt.com';

-- If user doesn't exist, insert them
-- Note: Password is bcrypt hash of 'nicole123' (temporary password - should be changed on first login)
INSERT INTO "User" (id, email, name, password, role, active, "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  'nicole.wittman@abt.com',
  'Nicole Wittman',
  '$2b$10$WP8.vHJB0BcZl/h9vktf9.IRnCusKGVsP6zagUenSSPd81a3h1MN2', -- bcrypt hash of 'nicole123'
  'STAFF',
  true,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "User" WHERE email = 'nicole.wittman@abt.com'
);

-- Verify
SELECT email, name, role, active FROM "User" WHERE email IN ('nicole.wittman@abt.com', 'nick@jdgraphic.com', 'ayang@abt.com');
