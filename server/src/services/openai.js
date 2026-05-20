import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_API_VERSION = process.env.GEMINI_API_VERSION || 'v1beta';

const CANDIDATE_PROFILE = `
Name: Ayoub Oumha
Role: Développeur Full Stack
Core Stack: 
Développement Frontend : : Html - Css - Javascript - React Js - TailwindCss - Angular.
Développement Backend :  Php - JAVA - Typescript - NodeJs - MySql - MongoDB - PostgreSQL.
Frameworks : : NextJs-  - Express.js - Laravel - Spring Boot.
DevOps & Outils  : : Docker - GIT - Gitlab - Github - Aws - Kubernetes - Postman - Jira
Experience:
- Development of modern web and mobile applications (Frontend/Backend).
- Backend optimization and admin dashboard creation.
- Integration of payment modules, wallet systems, KTC, and marketplaces.
Soft Skills: Agilité, Créativité, Esprit d'équipe, Communication, Initiative, Adaptation
`;

const extractJsonPayload = (rawText) => {
    const cleaned = rawText
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        throw new Error('Gemini response did not contain a valid JSON object');
    }

    return cleaned.slice(jsonStart, jsonEnd + 1);
};

const getGeminiErrorMessage = (status, errorPayload) => {
    try {
        const payload = JSON.parse(errorPayload);
        const retryDelay = payload?.error?.details?.find(detail => detail.retryDelay)?.retryDelay;

        if (status === 429) {
            return retryDelay
                ? `Gemini free quota reached. Please wait ${retryDelay} and try again, or check your free-tier limits in Google AI Studio.`
                : 'Gemini free quota reached. Please try again later or check your free-tier limits in Google AI Studio.';
        }

        return payload?.error?.message || `Gemini API Error (${status})`;
    } catch {
        return `Gemini API Error (${status}): ${errorPayload}`;
    }
};

export const generateEmailContent = async (offerText, referenceTemplate = "") => {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is missing in environment variables');
        }

        const prompt = `You are a professional developer applying for a job.
Your task is to write a SIMPLE, DIRECT, and CONCISE email application based on a job offer text and the CANDIDATE PROFILE provided below.

CANDIDATE PROFILE:
${CANDIDATE_PROFILE}

${referenceTemplate ? `
REFERENCE TEMPLATE:
Use the following text as a STRICT style guide. Keep the structure and simplicity of this text. Only adapt the technical parts to match the specific requirements of the job offer.
"""
${referenceTemplate}
"""
` : ''}

The output must be a JSON object with three fields:
- "subject" (email subject line)
- "htmlBody" (email body in HTML format, use <br><br> between paragraphs to create visible separation)
- "textBody" (same email body in plain text format, use double newlines \\n\\n between paragraphs)
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
7. Sign the email with the name: "Ayoub Oumha".

Here is the job offer: "${offerText}".
Generate the email application in French.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/${GEMINI_API_VERSION}/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        maxOutputTokens: 700,
                        temperature: 0.4
                    }
                })
            }
        );

        if (!response.ok) {
            const errorPayload = await response.text();
            console.error(`❌ Gemini API failed (${response.status}):`, errorPayload);
            throw new Error(getGeminiErrorMessage(response.status, errorPayload));
        }

        const data = await response.json();
        const generatedText = data?.candidates?.[0]?.content?.parts
            ?.map(part => part.text || '')
            .join('\n')
            .trim();

        if (!generatedText) {
            throw new Error('Gemini response did not include generated content');
        }

        const content = JSON.parse(extractJsonPayload(generatedText));

        if (!content.subject || !content.htmlBody || !content.textBody) {
            throw new Error('Gemini response JSON is missing required fields');
        }

        return content;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
};
