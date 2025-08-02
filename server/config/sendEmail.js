import nodemailer from 'nodemailer';

const sendEmail = async({sendTo, subject, html })=>{
    try {
        // Check for required Brevo SMTP credentials
        if(!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS){
            console.log("Provide BREVO_SMTP_USER and BREVO_SMTP_PASS in the .env file");
            return { error: "Email service not configured" };
        }

        // Create transporter using Brevo SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.BREVO_SMTP_HOST,
            port: parseInt(process.env.BREVO_SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS
            }
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        const mailOptions = {
            from: {
                name: 'Lanka Basket',
                address: process.env.BREVO_SENDER_EMAIL || 'noreply@lankabasket.com'
            },
            to: sendTo,
            subject: subject,
            html: html
        };

        console.log(`Attempting to send email via Brevo SMTP to: ${sendTo}`);
        console.log(`Email subject: ${subject}`);

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully via Brevo SMTP:', info.messageId);
        return { 
            success: true, 
            messageId: info.messageId,
            data: info 
        };
        
    } catch (error) {
        console.error('Brevo SMTP error:', error.message);
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your BREVO_SMTP_USER and BREVO_SMTP_PASS credentials.');
        }
        return { error: error.message };
    }
}

export default sendEmail
