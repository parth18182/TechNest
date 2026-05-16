import nodemailer from 'nodemailer';
import 'dotenv/config';

const sendOTPmail = async (otp, email) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { 
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    
    const mailConfiguration = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        html: `<P>YOUR OTP FOR PASSWORD RESET IS <b> ${otp} </b> . This OTP is valid for 10 minutes only.</P>`
    };

    transporter.sendMail(mailConfiguration, function(error, info){
        if (error) throw Error(error);
        console.log('Otp sent successfully');
        console.log(info);
    }
    );
}

export default sendOTPmail;