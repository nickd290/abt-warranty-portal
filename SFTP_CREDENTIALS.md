# ABT Warranty Portal - SFTP Server Credentials

## Production SFTP Server

**Server IP:** 134.199.195.90
**Port:** 22
**Protocol:** SFTP (SSH File Transfer Protocol)

## Test User Account

**Username:** abt_client
**Password:** TestPass123
**Home Directory:** /sftp/abt_client
**Upload Directory:** /uploads

### Directory Structure
```
/uploads/
├── buckslips/
├── letters/
├── envelopes/
└── maillists/
```

## Testing with FileZilla

1. Open FileZilla
2. Click **File** → **Site Manager**
3. Click **New Site**
4. Enter the following:
   - **Protocol:** SFTP - SSH File Transfer Protocol
   - **Host:** 134.199.195.90
   - **Port:** 22
   - **Logon Type:** Normal
   - **User:** abt_client
   - **Password:** TestPass123
5. Click **Connect**

You should see the `/uploads` directory with subdirectories for each file type.

## Testing with Command Line

```bash
sftp abt_client@134.199.195.90
# Enter password: TestPass123
# Then type: ls
# You should see: buckslips  envelopes  letters  maillists
```

## Creating Additional SFTP Users

SSH into the server:
```bash
ssh root@134.199.195.90
```

Run the user creation script:
```bash
bash /root/create-sftp-user.sh <username> <password>
```

Example:
```bash
bash /root/create-sftp-user.sh client_acme SecurePass456
```

## Security Notes

- Users are chroot-jailed to their home directory (cannot access other files)
- Users cannot SSH into the server (SFTP only)
- Firewall is configured to allow only SSH/SFTP (port 22)
- Each user has their own isolated upload directory

## Integration with Web Portal

Update your backend `.env` file with these SFTP credentials so the portal can connect to the SFTP server for file management and validation.

```env
SFTP_HOST=134.199.195.90
SFTP_PORT=22
```

Individual client credentials will be stored in the database and managed through the web portal's SFTP Management page.
