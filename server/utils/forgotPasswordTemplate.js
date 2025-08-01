const forgotPasswordTemplate = ({ name, otp })=>{
    return `
<div>
    <p>Dear, ${name}</p>
    <p>You've requested a password reset. Please use the following OTP code to reset your password.</p>
    <div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
        ${otp}
    </div>
    <p>This OTP is valid for 1 hour only. Enter this OTP in the Lanka Basket website to proceed with resetting your password.</p>
    <br/>
    </br>
    <p>Thanks</p>
    <p>Lanka Basket</p>
</div>
    `
}

export default forgotPasswordTemplate