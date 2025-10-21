import sgMail from '@sendgrid/mail';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Initialize SendGrid
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

interface CampaignCreatedData {
  campaignName: string;
  campaignId: string;
  filesCount: number;
  createdBy: string;
  creatorEmail: string;
}

interface DataFilesUploadedData {
  campaignName: string;
  campaignId: string;
  fileName: string;
  uploadedBy: string;
  uploaderEmail: string;
  fileSize: number;
}

interface ProofsUploadedData {
  campaignName: string;
  campaignId: string;
  proofFilesCount: number;
  uploadedBy: string;
  uploaderEmail: string;
  clientEmail?: string;
  clientName?: string;
}

interface ProofsApprovedData {
  campaignName: string;
  campaignId: string;
  approvedBy: string;
  approverEmail: string;
  approvedAt: Date;
}

export class EmailService {
  private fromEmail: string;
  private fromName: string;
  private appUrl: string;
  private logoPath: string | null = null;

  constructor() {
    this.fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'noreply@abtwarranty.com';
    this.fromName = process.env.NOTIFICATION_FROM_NAME || 'ABT Warranty Portal';
    this.appUrl = process.env.APP_URL || 'http://localhost:5174';
    this.loadLogo();
  }

  /**
   * Load and cache the ABT Electronics logo path
   */
  private loadLogo(): void {
    try {
      const logoPath = path.join(process.cwd(), '..', 'public', 'Abt-Electronics.png');
      if (fs.existsSync(logoPath)) {
        this.logoPath = logoPath;
        logger.info('ABT Electronics logo loaded for emails');
      } else {
        logger.warn(`Logo not found at ${logoPath} - emails will not include logo`);
      }
    } catch (error) {
      logger.error('Error loading logo for emails', error);
    }
  }

  /**
   * Get all ADMIN and STAFF users who should receive notifications
   */
  private async getNotificationRecipients(): Promise<Array<{ email: string; name: string }>> {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: {
            in: ['ADMIN', 'STAFF'],
          },
          active: true,
        },
        select: {
          email: true,
          name: true,
        },
      });
      console.log('📋 Database returned recipients:', JSON.stringify(users, null, 2));
      return users;
    } catch (error) {
      logger.error('Error fetching notification recipients', error);
      return [];
    }
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get common email styles (monochrome black/white/gray theme)
   */
  private getCommonStyles(): string {
    return `
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
        margin: 0;
        padding: 0;
        background-color: #f5f5f5;
      }
      .email-wrapper { width: 100%; background-color: #f5f5f5; padding: 20px 0; }
      .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .logo-container {
        text-align: center;
        padding: 30px 20px;
        background: white;
        border-bottom: 1px solid #e0e0e0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }
      .logo-container img { max-width: 280px; height: auto; display: inline-block; }
      .header {
        background: linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 100%);
        color: white;
        padding: 25px 30px;
        text-align: center;
      }
      .header h1 { margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; }
      .header p { margin: 8px 0 0; font-size: 14px; opacity: 0.95; }
      .content { background: white; padding: 30px; }
      .notification-badge {
        display: inline-block;
        background: #f5f5f5;
        border-left: 4px solid #1a1a1a;
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 25px;
        font-size: 14px;
        color: #1a1a1a;
        box-shadow: 0 2px 4px rgba(0,0,0,0.08);
      }
      .info-card {
        background: #fafafa;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      }
      .info-grid {
        display: table;
        width: 100%;
        border-collapse: collapse;
      }
      .info-row {
        display: table-row;
      }
      .info-row > div {
        display: table-cell;
        padding: 10px 0;
        border-bottom: 1px solid #e9ecef;
      }
      .info-row:last-child > div { border-bottom: none; }
      .info-label {
        font-weight: 600;
        color: #6c757d;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        width: 35%;
        padding-right: 15px;
      }
      .info-value {
        color: #1a1a1a;
        font-size: 15px;
        font-weight: 500;
      }
      .button {
        display: inline-block;
        background: #1a1a1a;
        color: white;
        padding: 14px 32px;
        text-decoration: none;
        border-radius: 6px;
        margin: 25px 0 10px;
        font-weight: 600;
        font-size: 15px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      .button:hover { background: #333333; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25); }
      .footer {
        text-align: center;
        color: #6c757d;
        font-size: 12px;
        padding: 25px 30px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
      }
      .footer-logo { color: #1a1a1a; font-weight: 700; font-size: 14px; margin-bottom: 8px; }
      .icon {
        font-size: 48px;
        margin: 10px 0;
      }
    </style>
    `;
  }

  /**
   * Get email wrapper with logo
   */
  private getEmailWrapper(headerTitle: string, headerSubtitle: string, content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${this.getCommonStyles()}
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      ${this.logoPath ? `<div class="logo-container">
        <img src="cid:abt-logo" alt="ABT Electronics" />
      </div>` : ''}

      <div class="header">
        <h1>${headerTitle}</h1>
        <p>${headerSubtitle}</p>
      </div>

      <div class="content">
        ${content}
      </div>

      <div class="footer">
        <div class="footer-logo">ABT ELECTRONICS</div>
        <p style="margin: 5px 0;">Warranty Mailer Portal</p>
        <p style="margin: 15px 0 5px; color: #adb5bd;">
          You're receiving this notification as an admin or staff member
        </p>
        <p style="margin: 0; color: #adb5bd;">
          &copy; ${new Date().getFullYear()} ABT Electronics. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Attach logo to email message
   */
  private attachLogo(message: any): void {
    if (this.logoPath) {
      const logoBuffer = fs.readFileSync(this.logoPath);
      message.attachments = [
        {
          content: logoBuffer.toString('base64'),
          filename: 'abt-logo.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'abt-logo',
        },
      ];
    }
  }

  /**
   * Send email to recipients
   */
  private async sendEmail(recipients: Array<{ email: string; name: string }>, subject: string, htmlContent: string, plainTextContent: string): Promise<void> {
    if (recipients.length === 0) {
      logger.warn('No recipients for email');
      return;
    }

    const [primaryRecipient, ...ccRecipients] = recipients;

    const message: any = {
      to: primaryRecipient.email,
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      subject,
      text: plainTextContent,
      html: htmlContent,
    };

    if (ccRecipients.length > 0) {
      message.cc = ccRecipients.map(r => r.email);
    }

    this.attachLogo(message);

    // Log detailed message info for debugging
    console.log('📤 Sending email via SendGrid:');
    console.log(`   To: ${message.to}`);
    console.log(`   CC: ${message.cc || 'none'}`);
    console.log(`   From: ${message.from.name} <${message.from.email}>`);
    console.log(`   Subject: ${message.subject}`);
    console.log(`   Has HTML: ${!!message.html}`);
    console.log(`   Has Text: ${!!message.text}`);
    console.log(`   Has Logo: ${!!message.attachments}`);

    const response = await sgMail.send(message);
    console.log('✅ SendGrid Response:', JSON.stringify(response, null, 2));

    logger.info(`Email sent: "${subject}" to ${recipients.length} recipient(s)`);
  }

  /**
   * EMAIL #1: Campaign Created with Art Files
   */
  async sendCampaignCreatedEmail(data: CampaignCreatedData): Promise<void> {
    if (!sendgridApiKey) {
      logger.warn('SendGrid API key not configured - skipping email notification');
      return;
    }

    try {
      const recipients = await this.getNotificationRecipients();
      if (recipients.length === 0) return;

      const campaignUrl = `${this.appUrl}/campaigns`;

      const htmlContent = this.getEmailWrapper(
        'New Campaign Created',
        'A new warranty mailer campaign has been created',
        `
        <div class="notification-badge">
          <strong>📋 New Campaign:</strong> ${data.campaignName}
        </div>

        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div class="icon">✨</div>
          <p style="margin: 10px 0 0; color: #6c757d; font-size: 13px;">${data.filesCount} art files uploaded</p>
        </div>

        <div class="info-card">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Campaign Name</div>
              <div class="info-value">${data.campaignName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Files Uploaded</div>
              <div class="info-value">${data.filesCount} files</div>
            </div>
            <div class="info-row">
              <div class="info-label">Created By</div>
              <div class="info-value">${data.createdBy}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Time</div>
              <div class="info-value">${new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</div>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${campaignUrl}" class="button">View Campaign →</a>
          <p style="margin: 15px 0 0; color: #6c757d; font-size: 13px;">
            Waiting for data files to begin proofing
          </p>
        </div>
        `
      );

      const plainTextContent = `
New Campaign Created - ABT Warranty Portal

Campaign Name: ${data.campaignName}
Files Uploaded: ${data.filesCount} files
Created By: ${data.createdBy} (${data.creatorEmail})
Time: ${new Date().toLocaleString()}

View Campaign: ${campaignUrl}

Status: Waiting for data files to begin proofing

---
You're receiving this email because you're an admin or staff member at ABT Warranty Portal.
      `;

      await this.sendEmail(recipients, `New Campaign Created - ${data.campaignName}`, htmlContent, plainTextContent);
    } catch (error: any) {
      logger.error('Error sending campaign created email', {
        error: error.message,
        response: error.response?.body,
      });
    }
  }

  /**
   * EMAIL #2: Data Files Uploaded (Ready for Proofing)
   */
  async sendDataFilesUploadedEmail(data: DataFilesUploadedData): Promise<void> {
    if (!sendgridApiKey) {
      logger.warn('SendGrid API key not configured - skipping email notification');
      return;
    }

    try {
      const recipients = await this.getNotificationRecipients();
      if (recipients.length === 0) return;

      const campaignUrl = `${this.appUrl}/campaigns/${data.campaignId}`;

      const htmlContent = this.getEmailWrapper(
        'Data Files Uploaded - Ready for Proofing',
        `${data.campaignName} is ready to begin proofing`,
        `
        <div class="notification-badge">
          <strong>✅ All Assets Ready:</strong> ${data.fileName}
        </div>

        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div class="icon">📊</div>
          <p style="margin: 10px 0 0; color: #6c757d; font-size: 13px;">Data file uploaded via SFTP</p>
        </div>

        <div class="info-card">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Campaign</div>
              <div class="info-value">${data.campaignName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Data File</div>
              <div class="info-value">${data.fileName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">File Size</div>
              <div class="info-value">${this.formatFileSize(data.fileSize)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Uploaded By</div>
              <div class="info-value">${data.uploadedBy}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Upload Method</div>
              <div class="info-value">
                <span style="display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #1a1a1a; color: white;">SFTP</span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Time</div>
              <div class="info-value">${new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</div>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${campaignUrl}" class="button">Start Proofing →</a>
          <p style="margin: 15px 0 0; color: #6c757d; font-size: 13px;">
            All assets are now available to begin the proofing process
          </p>
        </div>
        `
      );

      const plainTextContent = `
Data Files Uploaded - ABT Warranty Portal

Campaign: ${data.campaignName}
Data File: ${data.fileName}
File Size: ${this.formatFileSize(data.fileSize)}
Uploaded By: ${data.uploadedBy} (${data.uploaderEmail})
Upload Method: SFTP
Time: ${new Date().toLocaleString()}

View Campaign: ${campaignUrl}

Status: All assets ready - begin proofing process

---
You're receiving this email because you're an admin or staff member at ABT Warranty Portal.
      `;

      await this.sendEmail(recipients, `Data Files Uploaded - ${data.campaignName} Ready for Proofing`, htmlContent, plainTextContent);
    } catch (error: any) {
      logger.error('Error sending data files uploaded email', {
        error: error.message,
        response: error.response?.body,
      });
    }
  }

  /**
   * EMAIL #3: Proofs Uploaded (Ready for Review)
   */
  async sendProofsUploadedEmail(data: ProofsUploadedData): Promise<void> {
    if (!sendgridApiKey) {
      logger.warn('SendGrid API key not configured - skipping email notification');
      return;
    }

    try {
      // Get ADMIN/STAFF recipients
      const staffRecipients = await this.getNotificationRecipients();

      // Add client if provided
      const recipients = [...staffRecipients];
      if (data.clientEmail && data.clientName) {
        recipients.push({ email: data.clientEmail, name: data.clientName });
      }

      if (recipients.length === 0) return;

      const campaignUrl = `${this.appUrl}/campaigns/${data.campaignId}`;
      const proofsUrl = `${this.appUrl}/campaigns/${data.campaignId}/proofs`;

      const htmlContent = this.getEmailWrapper(
        'Proofs Ready for Review',
        `${data.campaignName} proofs are ready for customer review`,
        `
        <div class="notification-badge">
          <strong>👁️ Proofs Ready:</strong> ${data.proofFilesCount} proof files uploaded
        </div>

        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div class="icon">📄</div>
          <p style="margin: 10px 0 0; color: #6c757d; font-size: 13px;">Ready for customer review and approval</p>
        </div>

        <div class="info-card">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Campaign</div>
              <div class="info-value">${data.campaignName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Proof Files</div>
              <div class="info-value">${data.proofFilesCount} files</div>
            </div>
            <div class="info-row">
              <div class="info-label">Uploaded By</div>
              <div class="info-value">${data.uploadedBy}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Time</div>
              <div class="info-value">${new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</div>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${proofsUrl}" class="button">Review Proofs →</a>
          <p style="margin: 15px 0 0; color: #6c757d; font-size: 13px;">
            Click to review and approve the proofs
          </p>
        </div>
        `
      );

      const plainTextContent = `
Proofs Ready for Review - ABT Warranty Portal

Campaign: ${data.campaignName}
Proof Files: ${data.proofFilesCount} files
Uploaded By: ${data.uploadedBy} (${data.uploaderEmail})
Time: ${new Date().toLocaleString()}

View Proofs: ${proofsUrl}

Status: Ready for customer review and approval

---
You're receiving this email because you're an admin, staff member, or the client for this campaign.
      `;

      await this.sendEmail(recipients, `Proofs Ready for Review - ${data.campaignName}`, htmlContent, plainTextContent);
    } catch (error: any) {
      logger.error('Error sending proofs uploaded email', {
        error: error.message,
        response: error.response?.body,
      });
    }
  }

  /**
   * EMAIL #4: Proofs Approved
   */
  async sendProofsApprovedEmail(data: ProofsApprovedData): Promise<void> {
    if (!sendgridApiKey) {
      logger.warn('SendGrid API key not configured - skipping email notification');
      return;
    }

    try {
      const recipients = await this.getNotificationRecipients();
      if (recipients.length === 0) return;

      const campaignUrl = `${this.appUrl}/campaigns/${data.campaignId}`;

      const htmlContent = this.getEmailWrapper(
        'Proofs Approved - Ready for Production',
        `${data.campaignName} has been approved by the customer`,
        `
        <div class="notification-badge">
          <strong>✅ Approved:</strong> Ready for production
        </div>

        <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div class="icon">🎉</div>
          <p style="margin: 10px 0 0; color: #6c757d; font-size: 13px;">Customer has approved - ready to proceed</p>
        </div>

        <div class="info-card">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Campaign</div>
              <div class="info-value">${data.campaignName}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Approved By</div>
              <div class="info-value">${data.approvedBy}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Approval Time</div>
              <div class="info-value">${data.approvedAt.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}</div>
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${campaignUrl}" class="button">Begin Production →</a>
          <p style="margin: 15px 0 0; color: #6c757d; font-size: 13px;">
            Campaign is approved and ready for production
          </p>
        </div>
        `
      );

      const plainTextContent = `
Proofs Approved - ABT Warranty Portal

Campaign: ${data.campaignName}
Approved By: ${data.approvedBy} (${data.approverEmail})
Approval Time: ${data.approvedAt.toLocaleString()}

View Campaign: ${campaignUrl}

Status: Approved - Ready for production

---
You're receiving this email because you're an admin or staff member at ABT Warranty Portal.
      `;

      await this.sendEmail(recipients, `Proofs Approved - ${data.campaignName}`, htmlContent, plainTextContent);
    } catch (error: any) {
      logger.error('Error sending proofs approved email', {
        error: error.message,
        response: error.response?.body,
      });
    }
  }
}

export const emailService = new EmailService();
