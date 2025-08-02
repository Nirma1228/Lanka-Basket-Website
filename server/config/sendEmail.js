import { Resend } from 'resend';

const sendEmail = async({sendTo, subject, html })=>{
    try {
        if(!process.env.RESEND_API){
            console.log("Provide RESEND_API in side the .env file");
            return { error: "Email service not configured" };
        }

        const resend = new Resend(process.env.RESEND_API);

        console.log(`Attempting to send email to: ${sendTo}`);
        console.log(`Email subject: ${subject}`);

        const { data, error } = await resend.emails.send({
            from: 'Lanka Basket <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API error:', error);
            return { error };
        }

        console.log('Email sent successfully:', data);
        return data
    } catch (error) {
        console.error('SendEmail function error:', error);
        return { error: error.message };
    }
}

export default sendEmail
