# SFTP Server Setup for ABT Warranty Portal

The ABT Warranty Portal is designed to work with **external SFTP servers** for production use. Here are your options:

## ⭐ Recommended Option: OpenSSH SFTP (Free, Built-in)

macOS and Linux come with OpenSSH pre-installed, which includes a full-featured SFTP server.

### Setup on macOS:

```bash
# 1. Enable Remote Login (SFTP)
sudo systemsetup -setremotelogin on

# 2. Create dedicated SFTP user
sudo dseditgroup -o create sftponly
sudo sysadminctl -addUser abt_uploads -password abt_sftp_2024

# 3. Configure SFTP chroot (optional - isolates users to specific directories)
sudo nano /etc/ssh/sshd_config

# Add at the end:
Match Group sftponly
    ChrootDirectory /Users/sftpuploads/%u
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no

# 4. Restart SSH service
sudo launchctl stop com.openssh.sshd
sudo launchctl start com.openssh.sshd

# 5. Test connection
sftp abt_uploads@localhost
```

### Setup on Linux (Ubuntu/Debian):

```bash
# 1. Install OpenSSH server (if not already installed)
sudo apt update
sudo apt install openssh-server

# 2. Create SFTP user
sudo adduser abt_uploads
sudo mkdir -p /home/abt_uploads/uploads
sudo chown abt_uploads:abt_uploads /home/abt_uploads/uploads

# 3. Configure SFTP chroot
sudo nano /etc/ssh/sshd_config

# Add at the end:
Match User abt_uploads
    ChrootDirectory /home/abt_uploads
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no

# 4. Restart SSH service
sudo systemctl restart sshd

# 5. Test connection
sftp abt_uploads@localhost
```

### Customer Connection (OpenSSH):
```
Host: your-server-ip or yourdomain.com
Port: 22 (default SSH port)
Username: abt_uploads (or custom username)
Password: abt_sftp_2024 (or custom password)
Protocol: SFTP
```

---

## 🪟 Option 2: FileZilla Server (Windows)

Best for Windows servers.

### Setup:

1. **Download FileZilla Server**: https://filezilla-project.org/download.php?type=server
2. **Install** and run FileZilla Server
3. **Create User**:
   - Open FileZilla Server Interface
   - Edit → Users
   - Add user: `abt_uploads`
   - Set password: `abt_sftp_2024`
   - Set home directory: `C:\ABT-Uploads\abt_uploads`
   - Grant permissions: Read, Write, Delete, Create directories
4. **Configure Port** (default is 21 for FTP, 990 for FTPS)
5. **Save** and start server

### Customer Connection:
```
Host: your-server-ip
Port: 990 (FTPS) or 21 (FTP)
Username: abt_uploads
Password: abt_sftp_2024
Protocol: FTP over TLS (FTPS) - recommended
```

---

## ☁️ Option 3: Cloud SFTP Services

### AWS Transfer Family
- Fully managed SFTP service
- https://aws.amazon.com/aws-transfer-family/

### Microsoft Azure SFTP
- Managed SFTP for Azure Storage
- https://learn.microsoft.com/en-us/azure/storage/blobs/secure-file-transfer-protocol-support

### SFTPGo (Self-hosted)
- Modern, feature-rich SFTP server
- https://github.com/drakkan/sftpgo

---

## 🔧 Integration with ABT Portal

### The portal handles:
- ✅ SFTP credential management (username/password storage)
- ✅ User interface for creating credentials
- ✅ Tracking last used timestamps
- ✅ Enable/disable access per customer
- ✅ File metadata and job linking

### The external SFTP server handles:
- ✅ Actual file transfers
- ✅ Authentication
- ✅ Directory isolation
- ✅ Encryption (SSH/TLS)

### Connecting the Two:

1. **Create SFTP credential in web portal**:
   - Login as Staff/Admin
   - Navigate to "SFTP Upload"
   - Click "New Credential"
   - Enter username and password
   - Save

2. **Create same user on SFTP server**:
   - Use OpenSSH `adduser` or FileZilla Server user management
   - Use the **same username and password** from portal
   - Set their home directory to a dedicated folder

3. **Give customer their credentials**:
   - Host: your-server-ip or domain
   - Port: 22 (OpenSSH) or 990 (FTPS)
   - Username: (from portal)
   - Password: (from portal)

4. **File processing** (future enhancement):
   - Set up a file watcher on the SFTP server
   - When files are uploaded, call the API endpoint:
     ```bash
     POST /api/files/upload
     ```
   - Or manually link files through the portal UI

---

## 🔒 Security Best Practices

### For OpenSSH:
- ✅ Use SSH key authentication (more secure than passwords)
- ✅ Disable password authentication for SSH (but keep for SFTP)
- ✅ Use chroot to isolate users
- ✅ Enable firewall and only allow SFTP port
- ✅ Use fail2ban to prevent brute force attacks

### For FileZilla Server:
- ✅ Always use FTPS (FTP over TLS), not plain FTP
- ✅ Use strong passwords (min 12 characters)
- ✅ Set IP restrictions if possible
- ✅ Enable logging
- ✅ Regularly update software

### For All Options:
- ✅ Use strong, unique passwords per customer
- ✅ Rotate passwords regularly
- ✅ Monitor login attempts
- ✅ Back up uploaded files
- ✅ Set up alerting for failed logins

---

## 🧪 Testing

### Test with FileZilla Client:

1. Download: https://filezilla-project.org/
2. Open FileZilla
3. File → Site Manager → New Site
4. Enter:
   - Host: localhost (or your server)
   - Protocol: SFTP or FTPS
   - Port: 22 (SFTP) or 990 (FTPS)
   - Logon Type: Normal
   - User: abt_uploads
   - Password: abt_sftp_2024
5. Connect and upload test file

### Test with Command Line:

```bash
# OpenSSH SFTP
sftp abt_uploads@localhost
# or with custom port:
sftp -P 2222 abt_uploads@localhost

# Once connected:
put testfile.pdf
ls
exit
```

---

## 📝 Customer Instructions Template

```
Subject: Your ABT Warranty Mailer File Upload Access

Hello [Customer Name],

Your secure file upload access is ready!

CONNECTION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Host: uploads.abtwarranty.com
Port: 22
Username: [their_username]
Password: [their_password]
Protocol: SFTP (SSH File Transfer Protocol)

RECOMMENDED SFTP CLIENT:
FileZilla (Free): https://filezilla-project.org/

SETUP INSTRUCTIONS:
1. Download and install FileZilla
2. Open FileZilla
3. File → Site Manager → New Site
4. Enter the connection details above
5. Protocol: SFTP - SSH File Transfer Protocol
6. Click "Connect"
7. Upload your files by dragging and dropping

FILES TO UPLOAD:
• 3 Buckslip PDFs
• Letter Reply Template
• Outer Envelope Design
• Mail List (CSV/Excel)

Need help? Contact us at support@abtwarranty.com

Best regards,
ABT Warranty Team
```

---

## 🚀 Production Deployment Checklist

- [ ] Choose SFTP server solution (OpenSSH recommended)
- [ ] Set up SFTP server on production machine
- [ ] Configure user isolation (chroot)
- [ ] Set up firewall rules
- [ ] Get domain name (e.g., sftp.abtwarranty.com)
- [ ] Configure DNS A record to point to server
- [ ] Test connection from external network
- [ ] Create test user and verify upload
- [ ] Set up monitoring and alerting
- [ ] Document credentials securely
- [ ] Train staff on credential management
- [ ] Send test credentials to first customer

---

## 💡 Alternative: Web Upload Only

If SFTP setup is too complex, customers can upload files directly through the web portal:

1. Customer logs into web portal
2. Navigates to their campaign
3. Clicks "Upload Files"
4. Drags and drops files or clicks to browse
5. Files upload via secure HTTPS

**Pros**: Simpler setup, no external server needed
**Cons**: Requires customers to use web browser, less automated

---

## Need Help?

- OpenSSH docs: https://www.openssh.com/
- FileZilla Server docs: https://wiki.filezilla-project.org/
- Contact your system administrator or ABT development team
