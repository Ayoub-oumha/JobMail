import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const CANDIDATE_PROFILE = `
Name: Salahdine Daha
Role: Développeur Full Stack
Core Stack: 
Développement Frontend : : Html - Css - Javascript - React Js - TailwindCss.
Développement Backend :  Php - Typescript - NodeJs - MySql - MongoDB - PostgreSQL.
Frameworks : : NextJs- NestJs - Express.js - Laravel - Symfony.
DevOps & Outils  : : Docker - GIT - Gitlab - Github - Aws - Heroku - Postman - Jira
Experience:
- Development of modern web and mobile applications (Frontend/Backend).
- Backend optimization and admin dashboard creation.
- Integration of payment modules, wallet systems, KTC, and marketplaces.
Soft Skills: Agilité, Créativité, Esprit d'équipe, Communication, Initiative, Adaptation
`;

export const generateEmailContent = async (offerText, referenceTemplate = "") => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a professional developer applying for a job.
                    Your task is to write a SIMPLE, DIRECT, and CONCISE email application based on a job offer text and the CANDIDATE PROFILE provided below.
                    
                    CANDIDATE PROFILE:
                    ${CANDIDATE_PROFILE}

                    ${referenceTemplate ? `
                    REFERENCE TEMPLATE:
                    Use the following text as a STRICT style guide. Keep the structure and simplicity of this text. Only adapt the technical parts to match the specific requirements of the job offer.
                    """
                    ${referenceTemplate}
                    """
                    ` : ""}

                    The output must be a JSON object with three fields: 
                    - 'subject' (email subject line)
                    - 'htmlBody' (email body in HTML format, use <br><br> between paragraphs to create visible separation)
                    - 'textBody' (same email body in plain text format, use double newlines \\n\\n between paragraphs)
                    - always start with Bonjour and not (Madame, Monsieur or somthing else)
                    
                    IMPORTANT INSTRUCTIONS:
                    1. The email MUST be written in FRENCH.
                    2. TONE: Simple, direct, and humble. DO NOT use overly expressive language.
                    3. BANNED PHRASES: Do NOT use words like "maîtrise parfaitement", "expert", "solide expérience", "prestigieux", "incroyable". Just say "je maîtrise" or "j'utilise".
                    4. CONTENT:
                       - Mention your motivation for this specific offer.
                       - Highlight the skills from the CANDIDATE PROFILE that are relevant to the Job Offer.
                       - Mentions soft skills (adaptability, quick learning) if the offer requires a stack you don't fully have.
                    5. RESTRICTIONS:
                       - DO NOT mention specific years of experience.
                       - DO NOT mention diplomas or school names.
                    6. LENGTH: The body of the email MUST be very short (less than 10 lines). Keep it concise.
                    7. Sign the email with the name: "Salahdine Daha".
                    `
                },
                {
                    role: "user",
                    content: `Here is the job offer: "${offerText}". \n\nGenerate the email application in French.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = JSON.parse(completion.choices[0].message.content);
        return content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        // Fallback en cas d'erreur
        return {
            subject: "Candidature pour le poste",
            htmlBody: "<p>Bonjour.</p><p>Suite à votre offre qui a retenu toute mon attention, je vous adresse ma candidature.</p>",
            textBody: "Bonjour,\n\nSuite à votre offre qui a retenu toute mon attention, je vous adresse ma candidature."
        };
    }
};
