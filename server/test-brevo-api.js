import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testBrevoAPI = async () => {
    try {
        console.log('Testing Brevo API connection...');
        console.log('API Key:', process.env.BREVO_API_KEY ? 'Present' : 'Missing');
        console.log('Sender Email:', process.env.BREVO_SENDER_EMAIL);

        const emailData = {
            sender: {
                name: "Lanka Basket Test",
                email: process.env.BREVO_SENDER_EMAIL
            },
            to: [{
                email: process.env.BREVO_SENDER_EMAIL // Send test email to yourself
            }],
            subject: "Test Email from Lanka Basket",
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Test Email</h2>
                    <p>This is a test email to verify Brevo API integration is working correctly.</p>
                    <p>If you receive this email, the Brevo API configuration is successful!</p>
                    <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
                        <p style="margin: 0; color: #666;">
                            Best regards,<br>
                            Lanka Basket Team
                        </p>
                    </div>
                </div>
            `
        };

        console.log('Sending test email...');

        const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            }
        });

        console.log('✅ Test email sent successfully!');
        console.log('Response:', response.data);
        console.log('Message ID:', response.data.messageId);
        
    } catch (error) {
        console.error('❌ Error sending test email:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', error.response?.data);
        console.error('Error Message:', error.message);
    }
};

testBrevoAPI();
