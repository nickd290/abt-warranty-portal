import sgMail from '@sendgrid/mail';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (!sendgridApiKey) {
  console.error('❌ SENDGRID_API_KEY not found in environment variables');
  process.exit(1);
}

sgMail.setApiKey(sendgridApiKey);

const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'noreply@abtwarranty.com';
const fromName = process.env.NOTIFICATION_FROM_NAME || 'ABT Warranty Portal';

// Test email recipients - all will be CC'd
const testRecipients = [
  'nicole.wittman@abt.com',
  'nick@jdgraphic.com',
  'ayang@abt.com',
];

// Load ABT Electronics logo
let logoPath: string | null = null;
try {
  const testLogoPath = path.join(process.cwd(), '..', 'public', 'Abt-Electronics.png');
  if (fs.existsSync(testLogoPath)) {
    logoPath = testLogoPath;
    console.log('✅ ABT Electronics logo loaded');
  } else {
    console.warn('⚠️  Logo not found - email will not include logo');
  }
} catch (error) {
  console.error('❌ Error loading logo:', error);
}

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    .test-badge {
      background: #e8e8e8;
      border-left: 4px solid #4a4a4a;
      color: #1a1a1a;
      margin-bottom: 20px;
    }
    .file-preview {
      text-align: center;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .file-icon {
      font-size: 48px;
      color: #6c757d;
      margin: 10px 0;
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
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .badge-sftp { background: #1a1a1a; color: white; }
    .badge-web { background: #555555; color: white; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      ${logoPath ? `<div class="logo-container">
        <img src="cid:abt-logo" alt="ABT Electronics" />
      </div>` : ''}

      <div class="header">
        <h1>File Upload Notification - TEST</h1>
        <p>A new file has been uploaded to the Warranty Portal</p>
      </div>

      <div class="content">
        <div class="notification-badge test-badge">
          <strong>🧪 TEST EMAIL:</strong> Notification system is working correctly
        </div>

        <div class="notification-badge">
          <strong>📋 New Upload:</strong> test-warranty-mailer.pdf
        </div>

        <div class="file-preview">
          <div class="file-icon">📄</div>
          <p style="margin: 10px 0 0; color: #6c757d; font-size: 13px;">Buckslip #1</p>
        </div>

        <div class="info-card">
          <div class="info-grid">
            <div class="info-row">
              <div class="info-label">Campaign</div>
              <div class="info-value">January 2025 Extended Warranty</div>
            </div>
            <div class="info-row">
              <div class="info-label">File Name</div>
              <div class="info-value">test-warranty-mailer.pdf</div>
            </div>
            <div class="info-row">
              <div class="info-label">File Size</div>
              <div class="info-value">2.4 MB</div>
            </div>
            <div class="info-row">
              <div class="info-label">Uploaded By</div>
              <div class="info-value">Admin User</div>
            </div>
            <div class="info-row">
              <div class="info-label">Upload Method</div>
              <div class="info-value">
                <span class="badge badge-web">Web Portal</span>
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
          <a href="http://localhost:5174/campaigns" class="button">View in Portal →</a>
          <p style="margin: 15px 0 0; color: #6c757d; font-size: 13px;">
            Click to review and manage this upload
          </p>
        </div>
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

const plainTextContent = `
TEST EMAIL - New File Upload - ABT Warranty Portal

This is a test email to verify the notification system is working.

File Name: test-warranty-mailer.pdf
File Type: Buckslip #1
File Size: 2.4 MB
Campaign: January 2025 Extended Warranty
Uploaded By: Admin User (admin@abtwarranty.com)
Upload Method: Web Portal
Time: ${new Date().toLocaleString()}

View Campaign: http://localhost:5174/campaigns

---
You're receiving this email because you're an admin or staff member at ABT Warranty Portal.
`;

async function sendTestEmails() {
  try {
    console.log('🚀 Sending test email...');
    console.log(`From: ${fromName} <${fromEmail}>`);

    // Use verified sender as "from", remove them from CC to avoid duplicates
    const ccRecipients = testRecipients.filter(email => email !== fromEmail);
    console.log(`From/To: ${fromEmail}`);
    console.log(`CC: ${ccRecipients.join(', ')}`);
    console.log('');

    const message: any = {
      to: fromEmail, // Use verified sender as "to"
      cc: ccRecipients, // CC other recipients (excluding from email)
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: '🧪 TEST - New Campaign Created - January 2025 Extended Warranty',
      text: plainTextContent,
      html: htmlContent,
    };

    // Attach the logo as an inline image with CID
    if (logoPath) {
      const logoBuffer = fs.readFileSync(logoPath);
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

    await sgMail.send(message);

    console.log('✅ Test email sent successfully!');
    console.log(`\n📧 Check the following inboxes (all CC'd):`);
    testRecipients.forEach(email => {
      console.log(`   📋 ${email}`);
    });
    console.log('\n💡 Note: It may take a few minutes for the email to arrive.');
    console.log('💡 All recipients can see each other in the CC line.');

  } catch (error: any) {
    console.error('❌ Error sending test emails:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

sendTestEmails();
