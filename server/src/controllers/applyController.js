import { generateEmailContent } from '../services/openai.js';
import { sendApplicationEmail } from '../services/mailer.js';

export const applyForJob = async (req, res) => {
    try {

        const { email, offerText } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Split emails by comma and clean whitespace
        const emailList = email.split(',').map(e => e.trim()).filter(e => e.length > 0);

        if (emailList.length === 0) {
            return res.status(400).json({ error: 'No valid email provided' });
        }

        let generatedContent;

        if (offerText && offerText.trim().length > 10) {
            // 1a. Generate email content via AI if offer exists
            console.log('Generating customized email content via AI...');
            generatedContent = await generateEmailContent(offerText);
        } else {
            // 1b. Use standard spontaneous application template
            console.log('Using standard spontaneous application template...');
            generatedContent = {
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
        }
        
        // Use Promise.all to send efficiently in parallel (or mostly parallel)
        const sendPromises = emailList.map(recipient => sendApplicationEmail(recipient, generatedContent));
        const results = await Promise.allSettled(sendPromises);

        // Analyze results
        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');

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
