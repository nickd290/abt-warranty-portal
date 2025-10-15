# ABT Warranty Portal - Complete Setup Guide

## 🎯 System Overview

The ABT Warranty Portal is a complete web application with:
- **Frontend**: React + TypeScript (Port 5000)
- **Backend API**: Express.js (Port 3001)
- **SFTP Server**: Dedicated file upload server (Port 2222)
- **Database**: SQLite with Prisma ORM

## 📋 Prerequisites

- Node.js 18+ and npm
- Terminal/Command line access

## 🚀 Quick Start (Development)

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file (already exists)
# Review server/.env and update if needed

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed database with sample data
npm run db:seed

# Start backend server
npm run dev
```

**Backend will run on:**
- API: http://localhost:3001
- SFTP: localhost:2222

### 2. Frontend Setup

```bash
# From project root
npm install

# Start frontend
npm run dev
```

**Frontend will run on:** http://localhost:5000

## 🔐 Default Login Credentials

### Web Portal Access

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@abtwarranty.com | admin123 |
| **Staff** | staff@abtwarranty.com | staff123 |
| **Client** | client@abtelectronics.com | client123 |

### SFTP Access (For File Uploads)

```
Host: localhost
Port: 2222
Username: abt_uploads
Password: abt_sftp_2024
```

## 📁 SFTP Client Setup

Your customers can upload PDF files using any SFTP client:

### Option 1: FileZilla (Recommended - Windows/Mac/Linux)

1. Download from https://filezilla-project.org/
2. Open FileZilla
3. Go to File → Site Manager
4. Click "New Site"
5. Configure:
   - **Protocol**: SFTP - SSH File Transfer Protocol
   - **Host**: localhost (or your server IP)
   - **Port**: 2222
   - **Logon Type**: Normal
   - **User**: abt_uploads (or their username)
   - **Password**: abt_sftp_2024 (or their password)
6. Click "Connect"
7. Drag and drop PDF files to upload

### Option 2: WinSCP (Windows)

1. Download from https://winscp.net/
2. Open WinSCP
3. Click "New Site"
4. Configure:
   - **File protocol**: SFTP
   - **Host name**: localhost
   - **Port number**: 2222
   - **User name**: abt_uploads
   - **Password**: abt_sftp_2024
5. Click "Login"
6. Upload files via drag-and-drop

### Option 3: Cyberduck (Mac/Windows)

1. Download from https://cyberduck.io/
2. Open Cyberduck
3. Click "Open Connection"
4. Select "SFTP (SSH File Transfer Protocol)"
5. Enter:
   - **Server**: localhost
   - **Port**: 2222
   - **Username**: abt_uploads
   - **Password**: abt_sftp_2024
6. Click "Connect"
7. Upload files

### Option 4: Command Line (Mac/Linux)

```bash
sftp -P 2222 abt_uploads@localhost
# Enter password: abt_sftp_2024

# Once connected:
put my-file.pdf
ls
exit
```

## 🏗️ Project Structure

```
abt-warranty-portal/
├── server/                 # Backend API & SFTP Server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API endpoints
│   │   ├── sftp/           # SFTP server
│   │   ├── middleware/     # Auth, etc.
│   │   └── index.ts        # Server entry
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── uploads/            # File storage
│   │   └── [username]/     # Per-user folders
│   ├── server_key          # SSH private key
│   └── .env                # Environment config
│
└── src/                    # Frontend React App
    ├── components/         # Reusable components
    ├── pages/              # Page components
    ├── services/           # API service
    └── store/              # State management
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `PATCH /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files/job/:jobId` - Get job files
- `GET /api/files/:id` - Download file
- `DELETE /api/files/:id` - Delete file

### SFTP Credentials
- `GET /api/sftp/credentials` - List credentials
- `POST /api/sftp/credentials` - Create credential
- `PATCH /api/sftp/credentials/:id` - Update credential
- `DELETE /api/sftp/credentials/:id` - Delete credential

## 🔧 Configuration

### Backend (.env)

```env
# Database
DATABASE_URL="file:./dev.db"

# Server
PORT=3001
NODE_ENV=development

# JWT Authentication
JWT_SECRET="abt-warranty-portal-secret-key-2024"
JWT_EXPIRES_IN="7d"

# SFTP Server
SFTP_PORT=2222
SFTP_HOST=0.0.0.0

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=52428800

# CORS
CORS_ORIGIN="http://localhost:5000"
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
VITE_SFTP_HOST=localhost
VITE_SFTP_PORT=2222
```

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Staff/Client)

### SFTP Security
- SSH key-based encryption
- Per-user isolated directories
- Password-protected access
- Activity logging
- Automatic credential management

### File Security
- Size limits (50MB default)
- File type validation
- User-specific file access
- Organized storage by job

## 🧪 Testing the System

### 1. Test Web Portal

```bash
# Visit http://localhost:5000
# Login with: client@abtelectronics.com / client123
# Navigate through:
# - Campaigns (view jobs)
# - SFTP Upload (manage credentials)
# - Create new campaign
```

### 2. Test API

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@abtelectronics.com","password":"client123"}'
```

### 3. Test SFTP

```bash
# Connect via command line
sftp -P 2222 abt_uploads@localhost
# Password: abt_sftp_2024

# Or use FileZilla/WinSCP/Cyberduck
```

## 📝 Workflow

### For ABT Staff:

1. Login to web portal
2. Create new campaign (month, year, name)
3. Create SFTP credential for customer
4. Send SFTP credentials to customer
5. Customer uploads files via SFTP
6. Review uploaded files
7. Generate proof
8. Customer approves proof
9. Generate invoice
10. Mark campaign complete

### For Customers (via SFTP):

1. Receive SFTP credentials from ABT
2. Open SFTP client (FileZilla, WinSCP, Cyberduck)
3. Connect to server
4. Upload PDF files:
   - Buckslip 1
   - Buckslip 2
   - Buckslip 3
   - Letter reply template
   - Outer envelope design
   - Mail list (CSV/Excel)
5. Files automatically linked to their account
6. ABT staff processes and creates proof

## 🚨 Troubleshooting

### Backend won't start

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Restart backend
cd server && npm run dev
```

### SFTP connection refused

```bash
# Check if server is running
lsof -i :2222

# Verify SSH key exists
ls -la server/server_key

# Regenerate if needed
ssh-keygen -t rsa -b 4096 -f server/server_key -N ""
```

### Frontend API errors

```bash
# Verify .env file exists in root
cat .env

# Should contain:
# VITE_API_URL=http://localhost:3001

# Restart frontend
npm run dev
```

### Database errors

```bash
cd server

# Reset database
npx prisma db push --force-reset

# Reseed
npm run db:seed
```

## 🚀 Production Deployment

### 1. Environment Setup

Update environment variables for production:

```env
# Backend .env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
NODE_ENV="production"
JWT_SECRET="CHANGE-TO-STRONG-SECRET"
SFTP_HOST="sftp.yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"
```

### 2. Database Migration

```bash
# Switch to PostgreSQL
# Update DATABASE_URL in .env
cd server
npx prisma migrate deploy
npm run db:seed
```

### 3. Build Frontend

```bash
npm run build
# Deploy dist/ folder to hosting
```

### 4. Deploy Backend

```bash
cd server
npm run build
npm start
```

### 5. SFTP Server

- Set up domain name (sftp.yourdomain.com)
- Configure firewall for port 2222
- Use strong SSH keys
- Enable SSL/TLS

## 📞 Support

For issues or questions:
- Check logs: `server/logs/combined.log`
- Review error messages in browser console
- Check API responses in Network tab

## 📄 License

Proprietary - ABT Electronics
