import cron from 'node-cron';
import Email from '../models/Email.js';
import { sendApplicationEmail } from './mailer.js';

// Standard content for spontaneous application
const STANDARD_CONTENT = {
    subject: "Développeur Full Stack – Opportunités professionnelles",
    htmlBody: `
        <p>Bonjour,</p>
        <p>Je me permets de vous contacter afin de vous proposer mon profil pour d’éventuelles opportunités au sein de votre entreprise.</p>
        <p>Développeur Full Stack, je dispose d’une expérience en développement d’applications web modernes, aussi bien côté frontend que backend. J’ai travaillé avec des technologies telles que React, Next.js, Node.js, PHP, Symfony, ainsi que sur des environnements DevOps incluant Docker et CI/CD.</p>
        <p>Curieux, motivé et doté d’un bon esprit d’équipe, je suis toujours intéressé par de nouveaux défis techniques et par la contribution à des projets à forte valeur ajoutée.</p>
        <p>Je me tiens à votre disposition pour toute information complémentaire et serais ravi d’échanger avec vous.</p>
        <p>Cordialement,<br>Salahdine Daha</p>
    `,
    textBody: `Bonjour,

        Je me permets de vous contacter afin de vous proposer mon profil pour d’éventuelles opportunités au sein de votre entreprise.
        
        Développeur Full Stack, je dispose d’une expérience en développement d’applications web modernes, aussi bien côté frontend que backend. J’ai travaillé avec des technologies telles que React, Next.js, Node.js, PHP, Symfony, ainsi que sur des environnements DevOps incluant Docker et CI/CD.
        
        Curieux, motivé et doté d’un bon esprit d’équipe, je suis toujours intéressé par de nouveaux défis techniques et par la contribution à des projets à forte valeur ajoutée.
        
        Je me tiens à votre disposition pour toute information complémentaire et serais ravi d’échanger avec vous.
        
        Cordialement,
        Salahdine Daha`
};

const sendNextEmail = async () => {
    try {
        console.log('Scheduler: Checking for pending emails...');
        
        // Use findOneAndUpdate to atomically mark as "processing" to avoid race condition
        const emailToSend = await Email.findOneAndUpdate(
            { status: 'pending' },
            { $set: { status: 'processing' } },
            { sort: { createdAt: 1 }, new: true }
        );

        if (!emailToSend) {
            console.log('Scheduler: No pending emails found.');
            return;
        }

        console.log(`Scheduler: Sending email to ${emailToSend.email}...`);

        try {
            await sendApplicationEmail(emailToSend.email, STANDARD_CONTENT);
            
            // Mark as sent
            await Email.updateOne(
                { _id: emailToSend._id },
                { 
                    $set: { 
                        status: 'sent',
                        sentAt: new Date()
                    }
                }
            );
            
            console.log(`Scheduler: Email sent successfully to ${emailToSend.email}`);
        } catch (err) {
            console.error(`Scheduler: Failed to send email to ${emailToSend.email}`, err);
            
            // Mark as failed
            await Email.updateOne(
                { _id: emailToSend._id },
                { 
                    $set: { 
                        status: 'failed',
                        error: err.message
                    }
                }
            );
        }

    } catch (error) {
        console.error('Scheduler: Error in job', error);
    }
};

// Schedule: Every 10 minutes, from 8-11 and 14-16
// Cron format: minute hour day-of-month month day-of-week
const initScheduler = () => {
    // 8-11 means 8,9,10,11. 
    // 14-16 means 14,15,16.
    // 17h is end of work day, so we stop at 16:50.
    cron.schedule('*/10 8-11,14-16 * * *', () => {
        console.log(`Scheduler: Triggered at ${new Date().toISOString()}`);
        sendNextEmail();
    });
    console.log('Scheduler initialized: Runs every 10 mins (8h-11h, 14h-16h).');
};

export default initScheduler;
