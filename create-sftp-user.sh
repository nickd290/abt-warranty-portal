#!/bin/bash
# ABT Warranty Portal - Create SFTP User Script
# Usage: ./create-sftp-user.sh <username> <password>

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    echo "Example: $0 abt_client SecurePass123"
    exit 1
fi

USERNAME=$1
PASSWORD=$2

echo "Creating SFTP user: $USERNAME"

# Create user with no shell access
useradd -m -d /sftp/$USERNAME -s /usr/sbin/nologin -G sftpusers $USERNAME

# Set password
echo "$USERNAME:$PASSWORD" | chpasswd

# Create directory structure
mkdir -p /sftp/$USERNAME/uploads
mkdir -p /sftp/$USERNAME/uploads/buckslips
mkdir -p /sftp/$USERNAME/uploads/letters
mkdir -p /sftp/$USERNAME/uploads/envelopes
mkdir -p /sftp/$USERNAME/uploads/maillists

# Set ownership
chown root:root /sftp/$USERNAME
chmod 755 /sftp/$USERNAME

chown -R $USERNAME:sftpusers /sftp/$USERNAME/uploads
chmod 755 /sftp/$USERNAME/uploads

echo ""
echo "✓ SFTP user created successfully!"
echo "  Username: $USERNAME"
echo "  Password: $PASSWORD"
echo "  SFTP Host: 134.199.195.90"
echo "  Port: 22"
echo "  Upload Directory: /uploads"
echo ""
echo "Test with: sftp $USERNAME@134.199.195.90"
echo ""
