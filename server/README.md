# ABT Warranty Portal - Backend API & SFTP Server

Complete backend system with REST API and dedicated SFTP server for secure file uploads.

## 🚀 Features

### REST API
- **Authentication** - JWT-based with role-based access control (Admin/Staff/Client)
- **Job Management** - Create, update, track warranty mailer campaigns
- **File Management** - Upload, download, delete campaign assets
- **SFTP Credentials** - Manage customer SFTP accounts
- **Proof Events** - Track approval workflow
- **Invoicing** - Generate and manage invoices

### SFTP Server
- **Dedicated SFTP** - Runs on port 2222
- **Password-Protected** - Secure credentials per customer
- **Auto-Processing** - Files uploaded via SFTP automatically linked to jobs
- **Activity Tracking** - Last used timestamps for each credential

## 📦 Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Language**: TypeScript (ESM)
- **Database**: SQLite (Prisma ORM) - easily switchable to PostgreSQL
- **Authentication**: JWT + bcrypt
- **SFTP**: ssh2 library
- **Logging**: Winston
- **File Uploads**: Multer

## 🏗️ Project Structure

```
server/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── config/            # Configuration
│   ├── controllers/       # Route controllers
│   │   ├── authController.ts
│   │   ├── jobController.ts
│   │   ├── sftpController.ts
│   │   └── fileController.ts
│   ├── middleware/        # Auth middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── sftp/              # SFTP server implementation
│   ├── utils/             # Utilities (crypto, logger)
│   ├── index.ts           # Main server entry
│   └── seed.ts            # Database seeding
├── uploads/               # File storage
├── logs/                  # Application logs
├── server_key             # SFTP SSH private key
├── server_key.pub         # SFTP SSH public key
└── .env                   # Environment variables
```

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register  - Register new user
POST   /api/auth/login     - Login and get JWT token
GET    /api/auth/me        - Get current user info
```

### Jobs
```
GET    /api/jobs           - Get all jobs (filtered by role)
POST   /api/jobs           - Create new job
GET    /api/jobs/:id       - Get job details
PATCH  /api/jobs/:id       - Update job
DELETE /api/jobs/:id       - Delete job
POST   /api/jobs/:jobId/proof-events - Add proof event (approve/reject)
```

### Files
```
POST   /api/files/upload   - Upload file (multipart/form-data)
GET    /api/files/job/:jobId - Get all files for a job
GET    /api/files/:id      - Download file
DELETE /api/files/:id      - Delete file
```

### SFTP Credentials
```
GET    /api/sftp/credentials     - Get all SFTP credentials
POST   /api/sftp/credentials     - Create new SFTP credential
PATCH  /api/sftp/credentials/:id - Update credential
DELETE /api/sftp/credentials/:id - Delete credential
```

## 🔧 Setup

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file (copy from .env.example):
```bash
cp .env.example .env
```

4. Generate SSH keys for SFTP:
```bash
ssh-keygen -t rsa -b 4096 -f server_key -N ""
```

5. Generate Prisma client:
```bash
npm run db:generate
```

6. Push database schema:
```bash
npm run db:push
```

7. Seed database with sample data:
```bash
npm run db:seed
```

8. Start development server:
```bash
npm run dev
```

The API will start on **http://localhost:3001**
The SFTP server will start on **localhost:2222**

## 🔐 Default Credentials

After seeding, you can use these accounts:

### Web Portal Login
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@abtwarranty.com | admin123 |
| Staff | staff@abtwarranty.com | staff123 |
| Client | client@abtelectronics.com | client123 |

### SFTP Access
| Field | Value |
|-------|-------|
| Host | localhost |
| Port | 2222 |
| Username | abt_uploads |
| Password | abt_sftp_2024 |

## 🧪 Testing

### Test API Health
```bash
curl http://localhost:3001/health
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@abtelectronics.com","password":"client123"}'
```

### Test SFTP Connection
```bash
sftp -P 2222 abt_uploads@localhost
# Enter password: abt_sftp_2024
```

## 📊 Database Management

```bash
# Open Prisma Studio (visual database browser)
npm run db:studio

# Create migration
npm run db:migrate

# Reset database
npm run db:push --force-reset
npm run db:seed
```

## 🔒 Security Notes

### Production Deployment
1. **Change all default passwords**
2. **Set strong JWT_SECRET** in .env
3. **Use PostgreSQL** instead of SQLite
4. **Enable HTTPS/TLS** for API
5. **Use SFTP over SSH tunnel** or VPN
6. **Set up firewall rules** to restrict SFTP access
7. **Enable audit logging**
8. **Regular security updates**

### Environment Variables
```env
# CRITICAL: Change in production!
JWT_SECRET="your-super-secret-key"
DATABASE_URL="postgresql://user:pass@host:5432/db"
NODE_ENV="production"
```

## 📝 File Upload Workflow

### Via Web Portal
1. User logs in to frontend
2. Navigates to job upload page
3. Selects files (buckslips, letters, envelopes, mail list)
4. Files uploaded via `/api/files/upload`
5. Linked to job automatically

### Via SFTP
1. Customer connects to SFTP server
2. Uploads PDF files to their directory
3. Backend monitors uploads
4. Files automatically associated with customer's jobs
5. Email notification sent (optional)

## 🚀 Deployment

### Railway / Render
```bash
# Build
npm run build

# Start
npm start
```

### Environment
- Set all environment variables
- Use PostgreSQL database
- Configure file storage (S3, etc.)
- Set up logging/monitoring

## 📄 License

Proprietary - ABT Electronics

## 🤝 Support

For issues or questions, contact the development team.
# Production deployment Thu Oct 16 00:46:30 CDT 2025
