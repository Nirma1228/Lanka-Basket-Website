const verifyEmailTemplate = ({name,url})=>{
    return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Lanka Basket</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffbf00; margin: 0;">Lanka Basket</h1>
                <p style="color: #666; margin: 5px 0 0 0;">Fresh Groceries Delivered</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Welcome to Lanka Basket, ${name}!</h2>
            
            <p style="color: #555; margin-bottom: 20px;">
                Thank you for registering with Lanka Basket. To complete your registration and start shopping for fresh groceries, 
                please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="
                    background-color: #ffbf00;
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    display: inline-block;
                    margin: 10px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">
                    Verify Email Address
                </a>
            </div>
            
            <p style="color: #777; font-size: 14px; margin-top: 30px;">
                If you can't click the button above, copy and paste this link into your browser:
            </p>
            <p style="background-color: #f8f8f8; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #666;">
                ${url}
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px;">
                <p style="color: #777; font-size: 12px; margin: 0;">
                    <strong>Note:</strong> This verification link will expire in 24 hours for security reasons.
                </p>
                <p style="color: #777; font-size: 12px; margin: 10px 0 0 0;">
                    If you didn't create an account with Lanka Basket, please ignore this email.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    © Lanka Basket - Your trusted grocery partner
                </p>
            </div>
        </div>
    </body>
    </html>
    `
}

export default verifyEmailTemplate