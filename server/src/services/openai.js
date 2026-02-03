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

export const generateEmailContent = async (offerText) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert career coach acting as a professional copywriter. 
                    Your task is to write a cold email application based on a job offer text and the CANDIDATE PROFILE provided below.
                    
                    CANDIDATE PROFILE:
                    ${CANDIDATE_PROFILE}

                    The output must be a JSON object with three fields: 
                    - 'subject' (email subject line)
                    - 'htmlBody' (email body in HTML format, with <br> for line breaks)
                    - 'textBody' (same email body in plain text format, no HTML tags)
                    - always start with Bonjour and not (Madame, Monsieur or somthing else)
                    
                    IMPORTANT INSTRUCTIONS:
                    1. The email MUST be written in FRENCH.
                    2. STRICTLY ADHERE to the CANDIDATE PROFILE. Do NOT invent skills.
                       - If the job offer asks for a skill present in the profile (e.g., Node.js, React), emphasize it strongly.
                       - If the job offer asks for a skill NOT in the profile (e.g., Java, Python, Angular), DO NOT claim to master it. Instead, focus on the candidate's solid engineering background (Full Stack, logic, adaptation) and ability to learn quickly, or highlight the equivalent technology in the profile (e.g. "Expert en Node.js, je m'adapte rapidement aux autres environnements backend").
                    3. DO NOT MENTION specific years of experience (e.g. "5 ans d'expérience") unless it's to say "Expérimenté en...". Keep it qualitative ("solide expérience", "expertise confirmée") rather than quantitative to avoid inaccuracies.
                    4. The tone should be professional, confident, yet concise.
                    5. Sign the email with the name: "Salahdine Daha".
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
