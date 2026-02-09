import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Assets are in server/assets, relative to src/services/mailer.js which is ../../assets
const DEFAULT_CV_PATH = path.join(__dirname, '../../assets/cv.pdf');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

export const sendApplicationEmail = async (toEmail, content) => {
    try {
        // Use htmlBody if available, fallback to body (for backward compatibility if needed)
        const htmlContent = content.htmlBody || content.body;
        const textContent = content.textBody || "Veuillez consulter la version HTML de ce message.";
        const cvPath = content.cvPath || DEFAULT_CV_PATH;

        const info = await transporter.sendMail({
            from: `"Salahdine Daha" <${process.env.SMTP_USER}>`, // Sender address with real name
            to: toEmail, // Recruiter's email
            // bcc: process.env.SMTP_USER, // Optional: Receive a copy
            subject: content.subject,
            text: textContent, // Plain text version (Crucial for Anti-Spam)
            html: htmlContent, // HTML version
            attachments: [
                {
                    filename: 'CV - Salahdine Daha.pdf', // Professional filename
                    path: cvPath
                }
            ]
        });
        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Nodemailer Error Detail:", error);
        // On renvoie l'erreur originale pour la voir dans la réponse API
        throw error;
    }
};
