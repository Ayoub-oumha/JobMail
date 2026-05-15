import { generateEmailContent } from '../services/openai.js';
import { sendApplicationEmail } from '../services/mailer.js';
import Email from '../models/Email.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSETS_DIR = path.join(__dirname, '../../assets');

const TEMPLATES = {
    php: {
        subject: "Candidature — Développeur Full Stack / PHP (Laravel & Symfony)",
        textBody: `Bonjour,

Je m’appelle Ayoub Oumha et je suis développeur Full Stack. Passionné par la création de solutions web performantes, je maîtrise aussi bien le Frontend (React Js, Tailwind) que le Backend (PHP, Laravel, Symfony). Mon expertise inclut également des compétences en DevOps (Docker, CI/CD) et la gestion de bases de données relationnelles.

J’ai eu l’opportunité de mettre mes compétences en pratique lors de stages concrets et de projets ambitieux, notamment en remportant le Premier Prix du Hackathon Sofrecom. Ces expériences m’ont appris à être réactif, créatif et à m’adapter rapidement aux besoins d’une équipe technique.

Actuellement à la recherche d’une opportunité professionnelle sur des technologies PHP, Symfony ou Laravel, je suis disponible immédiatement et très motivé à l'idée de rejoindre votre équipe.

Vous trouverez mon CV ci-joint pour plus de détails sur mon parcours. Je reste à votre entière disposition pour un échange ou un entretien.

Cordialement,

Ayoub Oumha`,
        cvFile: 'PHP.pdf'
    },
    mern: {
        subject: "Candidature — Développeur Full Stack (Node.js / React / NestJS)",
        textBody: `Bonjour,

Je m’appelle Ayoub Oumha et je suis développeur Full Stack. Passionné par la création de solutions web modernes, je maîtrise parfaitement les technologies JavaScript/TypeScript, notamment avec React Js en Frontend et Node.js, Express ou NestJS en Backend.

Mon expertise technique s'appuie sur des réalisations concrètes, comme mon projet E-MARKET, où j'ai mis en place une architecture modulaire avec React Query, Redux Toolkit et MongoDB, tout en intégrant des tests automatisés et une CI/CD via GitHub Actions. J'ai également remporté le Premier Prix du Hackathon Sofrecom pour le développement d'une plateforme d'analyse intelligente du CO 2.

Ces expériences, ainsi que mon parcours chez YouCode (OCP / UM6P) , m'ont permis de devenir réactif, créatif et capable de m'intégrer rapidement dans une équipe technique utilisant les méthodes agiles.

Actuellement à la recherche d’une opportunité professionnelle sur la Stack MERN ou des environnements NestJS / Next.js, je suis disponible immédiatement et très motivé à l'idée de contribuer à vos projets.

Vous trouverez mon CV ci-joint pour plus de détails sur mon parcours. Je reste à votre entière disposition pour un échange ou un entretien.

Cordialement,

Ayoub Oumha`,
        cvFile: 'MERN STACK.pdf'
    },
    default: {
        cvFile: 'cv.pdf'
    }
}

export const applyForJob = async (req, res) => {
    try {

        const { email, offerText, stack } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Split emails by comma and clean whitespace
        const emailList = email.split(',').map(e => e.trim()).filter(e => e.length > 0);

        if (emailList.length === 0) {
            return res.status(400).json({ error: 'No valid email provided' });
        }

        // Determine Stack configuration
        const stackKey = stack && (stack === 'php' || stack === 'mern') ? stack : 'default';
        const templateConfig = TEMPLATES[stackKey];
        // Ensure cvPath is absolute
        const cvPath = path.join(ASSETS_DIR, templateConfig.cvFile);
        
        console.log(`Using stack: ${stackKey}, CV: ${templateConfig.cvFile}`);

        let generatedContent;

        if (offerText && offerText.trim().length > 10) {
            // 1a. Generate email content via AI if offer exists
            console.log('Generating customized email content via AI...');
            // Pass the template text as reference if not default
            const referenceTemplate = stackKey !== 'default' ? templateConfig.textBody : "";
            generatedContent = await generateEmailContent(offerText, referenceTemplate);
        } else {
             // 1b. Use standard templates
             if (stackKey !== 'default') {
                console.log(`Using standard ${stackKey} application template...`);
                // Simple HTML conversion: Replace newlines with <br/> to avoid double spacing from <p> tags
                const htmlBody = templateConfig.textBody.replace(/\n/g, '<br/>');
                
                generatedContent = {
                    subject: templateConfig.subject,
                    textBody: templateConfig.textBody,
                    htmlBody: htmlBody
                };
            } else {
                // Use standard spontaneous application template
                console.log('Using standard spontaneous application template...');
                generatedContent = {
                    subject: "Candidature au poste de Développeur Full Stack",
                    htmlBody: `
                        <p>Bonjour,</p>
                        <p>Je me permets de vous contacter afin de vous proposer mon profil pour d’éventuelles opportunités au sein de votre entreprise.</p>
                        <p>Développeur Full Stack, je dispose d’une expérience en développement d’applications web modernes, aussi bien côté frontend que backend. J’ai travaillé avec des technologies telles que Java, Spring Boot, Angular, React, Next.js, Node.js, PHP, Laravel, ainsi que sur des environnements DevOps incluant Docker et CI/CD.</p>
                        <p>Curieux, motivé et doté d’un bon esprit d’équipe, je suis toujours intéressé par de nouveaux défis techniques et par la contribution à des projets à forte valeur ajoutée.</p>
                        <p>Je me tiens à votre disposition pour toute information complémentaire et serais ravi d’échanger avec vous.</p>
                        <p>Cordialement,<br>Ayoub Oumha</p>
                    `,
                    textBody: `Bonjour,

                        Je me permets de vous contacter afin de vous proposer mon profil pour d’éventuelles opportunités au sein de votre entreprise.
                        
                        Développeur Full Stack, je dispose d’une expérience en développement d’applications web modernes, aussi bien côté frontend que backend. J’ai travaillé avec des technologies telles que Java, Spring Boot, Angular, React, Next.js, Node.js, PHP, Laravel, ainsi que sur des environnements DevOps incluant Docker et CI/CD.
                        
                        Curieux, motivé et doté d’un bon esprit d’équipe, je suis toujours intéressé par de nouveaux défis techniques et par la contribution à des projets à forte valeur ajoutée.
                        
                        Je me tiens à votre disposition pour toute information complémentaire et serais ravi d’échanger avec vous.
                        
                        Cordialement,
                        Ayoub Oumha`
                };
            }
        }
        
        // Attach the correct CV path to the content object
        generatedContent.cvPath = cvPath;
        
        // Use Promise.all to send efficiently in parallel (or mostly parallel)
        const sendPromises = emailList.map(recipient => sendApplicationEmail(recipient, generatedContent));
        const results = await Promise.allSettled(sendPromises);

        // Analyze results
        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');
        
        // Mark successfully sent emails as "sent" in database to avoid duplicates from scheduler
        for (let i = 0; i < emailList.length; i++) {
            if (results[i].status === 'fulfilled') {
                await Email.updateOne(
                    { email: emailList[i] },
                    { 
                        $set: { 
                            status: 'sent',
                            sentAt: new Date()
                        }
                    },
                    { upsert: false } // Don't create if doesn't exist
                ).catch(err => console.log('Note: Email not in DB:', emailList[i]));
            }
        }

        if (successful.length === 0 && failed.length > 0) {
            // If ALL failed, throw the error of the first one to trigger catch block
            throw failed[0].reason;
        }

        return res.status(200).json({ 
            success: true, 
            message: `Applications sent successfully to ${successful.length} out of ${emailList.length} recipients.`,
            details: {
                subject: generatedContent.subject,
                failedCount: failed.length
            }
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Application sent successfully',
            details: {
                subject: generatedContent.subject
            }
        });

    } catch (error) {
        console.error('Error in applyForJob:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || 'Internal server error',
            stack: error.stack // Ajout temporaire pour débug
        });
    }
};
