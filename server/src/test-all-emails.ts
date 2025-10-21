import { emailService } from './services/emailService.js';
import 'dotenv/config';

const testRecipients = [
  'nick@jdgraphic.com',
  'ayang@abt.com',
];

async function sendAllTestEmails() {
  console.log('🚀 Sending all test emails to:', testRecipients.join(', '));
  console.log('');

  try {
    // Test Email #1: Campaign Created
    console.log('📧 Sending Test Email #1: Campaign Created...');
    await emailService.sendCampaignCreatedEmail({
      campaignName: 'January 2025 Extended Warranty',
      campaignId: 'test-campaign-123',
      filesCount: 6,
      createdBy: 'Sarah Designer',
      creatorEmail: 'sarah@jdgraphic.com',
    });
    console.log('✅ Campaign Created email sent!');
    console.log('');

    // Wait 2 seconds between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test Email #2: Data Files Uploaded
    console.log('📧 Sending Test Email #2: Data Files Uploaded...');
    await emailService.sendDataFilesUploadedEmail({
      campaignName: 'January 2025 Extended Warranty',
      campaignId: 'test-campaign-123',
      fileName: 'customer-data-january.csv',
      uploadedBy: 'Mike Data Specialist',
      uploaderEmail: 'mike@abt.com',
      fileSize: 2457600, // ~2.4 MB
    });
    console.log('✅ Data Files Uploaded email sent!');
    console.log('');

    // Wait 2 seconds between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test Email #3: Proofs Uploaded
    console.log('📧 Sending Test Email #3: Proofs Uploaded...');
    await emailService.sendProofsUploadedEmail({
      campaignName: 'January 2025 Extended Warranty',
      campaignId: 'test-campaign-123',
      proofFilesCount: 3,
      uploadedBy: 'Nick @ JD',
      uploaderEmail: 'nick@jdgraphic.com',
      clientEmail: 'john.client@abt.com',
      clientName: 'John Client',
    });
    console.log('✅ Proofs Uploaded email sent!');
    console.log('');

    // Wait 2 seconds between emails
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test Email #4: Proofs Approved
    console.log('📧 Sending Test Email #4: Proofs Approved...');
    await emailService.sendProofsApprovedEmail({
      campaignName: 'January 2025 Extended Warranty',
      campaignId: 'test-campaign-123',
      approvedBy: 'John Client',
      approverEmail: 'john.client@abt.com',
      approvedAt: new Date(),
    });
    console.log('✅ Proofs Approved email sent!');
    console.log('');

    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ All 4 test emails sent successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📧 Check the following inboxes:');
    console.log('   ✉️  To: nick@jdgraphic.com');
    console.log('   📋 CC: ayang@abt.com');
    console.log('');
    console.log('📬 You should receive 4 emails:');
    console.log('   1️⃣  New Campaign Created - January 2025 Extended Warranty');
    console.log('   2️⃣  Data Files Uploaded - January 2025 Extended Warranty Ready for Proofing');
    console.log('   3️⃣  Proofs Ready for Review - January 2025 Extended Warranty');
    console.log('   4️⃣  Proofs Approved - January 2025 Extended Warranty');
    console.log('');
    console.log('💡 Note: It may take a few minutes for the emails to arrive.');
    console.log('');

  } catch (error: any) {
    console.error('❌ Error sending test emails:');
    console.error('Message:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

sendAllTestEmails();
