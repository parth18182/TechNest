import nodemailer from 'nodemailer';
import 'dotenv/config';

const verifyEmail = async (token, email) => {
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
        subject: 'Email Verification - Ekart',
        html: `hi! there, you have been recently visited our website and
        entered your emai. please follow the given link to verify your email.
        http://localhost:5173/verify/${token}
        Thank you!`
    };

    transporter.sendMail(mailConfiguration, function (error, info) {
        if (error) throw Error(error);
        console.log('Email sent successfully');
        console.log(info);
    }
    );
}

export default verifyEmail;