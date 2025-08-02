import * as brevo from '@getbrevo/brevo';

const sendEmailWithBrevoAPI = async({sendTo, subject, html}) => {
    try {
        // Check for required Brevo API key
        if (!process.env.BREVO_API_KEY) {
            console.log("Provide BREVO_API_KEY in the .env file");
            return { error: "Email service not configured" };
        }

        // Configure Brevo API
        let defaultClient = brevo.ApiClient.instance;
        let apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        let apiInstance = new brevo.TransactionalEmailsApi();

        // Email content
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = { 
            "name": "Lanka Basket", 
            "email": process.env.BREVO_SENDER_EMAIL || "noreply@lankabasket.com"
        };
        sendSmtpEmail.to = [{ 
            "email": sendTo 
        }];

        console.log(`Attempting to send email via Brevo API to: ${sendTo}`);
        console.log(`Email subject: ${subject}`);

        // Send email
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log('Email sent successfully via Brevo API:', data);
        return { 
            success: true, 
            messageId: data.messageId,
            data: data 
        };
        
    } catch (error) {
        console.error('Brevo API error:', error);
        return { error: error.message };
    }
}

export default sendEmailWithBrevoAPI;
