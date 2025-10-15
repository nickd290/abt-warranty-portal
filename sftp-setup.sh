#!/bin/bash
# ABT Warranty Portal - SFTP Server Setup Script
# Run this on your DigitalOcean droplet as root

echo "=== ABT Warranty Portal SFTP Server Setup ==="
echo "Starting configuration..."

# Update system
echo "1. Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "2. Installing required packages..."
apt install -y openssh-server ufw

# Configure firewall
echo "3. Configuring firewall..."
ufw allow OpenSSH
ufw allow 22/tcp
ufw --force enable

# Create SFTP group
echo "4. Creating SFTP group..."
groupadd sftpusers

# Create SFTP base directory
echo "5. Creating SFTP base directory..."
mkdir -p /sftp

# Configure SSH for SFTP
echo "6. Backing up SSH config..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

echo "7. Configuring SFTP in SSH..."
cat >> /etc/ssh/sshd_config << 'EOF'

# SFTP Configuration for ABT Warranty Portal
Match Group sftpusers
    ChrootDirectory /sftp/%u
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    PasswordAuthentication yes
EOF

# Restart SSH service
echo "8. Restarting SSH service..."
systemctl restart sshd

echo ""
echo "=== SFTP Server Base Configuration Complete! ==="
echo ""
echo "Next steps:"
echo "1. Run the user creation script to add SFTP users"
echo "2. Test SFTP connection with FileZilla"
echo ""
