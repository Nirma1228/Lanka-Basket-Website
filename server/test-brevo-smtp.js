import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testBrevoSMTP = async () => {
    try {
        console.log('Testing Brevo SMTP connection...');
        console.log('SMTP Host:', process.env.BREVO_SMTP_HOST);
        console.log('SMTP Port:', process.env.BREVO_SMTP_PORT);
        console.log('SMTP User:', process.env.BREVO_SMTP_USER);
        console.log('SMTP Pass:', process.env.BREVO_SMTP_PASS ? 'Present' : 'Missing');
        console.log('Sender Email:', process.env.BREVO_SENDER_EMAIL);

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST,
            port: parseInt(process.env.BREVO_SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS
            }
        });

        console.log('Verifying SMTP connection...');
        
        // Verify connection
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully!');

        // Send test email
        const mailOptions = {
            from: {
                name: 'Lanka Basket Test',
                address: process.env.BREVO_SENDER_EMAIL
            },
            to: process.env.BREVO_SENDER_EMAIL, // Send to yourself
            subject: 'Test Email from Lanka Basket - Brevo SMTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">SMTP Test Email</h2>
                    <p>This is a test email to verify Brevo SMTP integration is working correctly.</p>
                    <p>If you receive this email, the Brevo SMTP configuration is successful!</p>
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
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        
    } catch (error) {
        console.error('❌ Error with Brevo SMTP:');
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your SMTP credentials.');
        } else if (error.code === 'ECONNECTION') {
            console.error('Connection failed. Please check your SMTP host and port.');
        }
    }
};

testBrevoSMTP();
