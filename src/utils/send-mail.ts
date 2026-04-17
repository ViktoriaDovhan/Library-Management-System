import nodemailer from "nodemailer";

type SendMailOptions = {
    to: string;
    subject: string;
    html: string;
};

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
    },
});

export async function sendMail(options: SendMailOptions) {
    await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
}