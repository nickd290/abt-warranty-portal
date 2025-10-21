import { emailService } from './services/emailService.js';
import 'dotenv/config';

async function sendOneTestEmail() {
  console.log('🚀 Sending single test email...');
  console.log('');

  try {
    await emailService.sendCampaignCreatedEmail({
      campaignName: 'January 2025 Extended Warranty',
      campaignId: 'test-campaign-123',
      filesCount: 6,
      createdBy: 'Sarah Designer',
      creatorEmail: 'sarah@jdgraphic.com',
    });
    console.log('✅ Email sent!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

sendOneTestEmail();
