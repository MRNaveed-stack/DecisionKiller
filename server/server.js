import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/analyze', async (req, res) => {
    try {
        const { dilemma, userProfile } = req.body;

        if (!dilemma) {
            return res.status(400).json({ error: 'Dilemma is required.' });
        }

        const systemPrompt = `
      You are an elite, analytical decision engine. 
      You will be provided with a dilemma (two opposing options) and optionally a user profile consisting of qualitative traits.
      You must respond IN STRICT JSON FORMAT exactly matching the schema below. Do not use markdown wrappers, just raw JSON.
      
      Your goal is to evaluate the two options across 5 criteria: "Time to Competence", "Income Potential", "Difficulty", "Risk Level", "Long-Term Growth".
      Assign logical, realistic scores from 0-100 for each criteria.
      If a userProfile is provided, intelligently shift the weights based on their specific profile (e.g., beginner = higher difficulty, high math = higher long term growth for engineering, high financial pressure = lower risk tolerance, etc.).
      
      Generate exactly 1-3 intelligent insights explaining WHY you shifted the weights and recommended the winner based on their profile.
      Also pick 1-2 cognitive biases that they should watch out for based on the clarity score magnitude and their profile.
      Finally, generate a professional 7-day execution protocol for the winning option.

      REQUIRED JSON SCHEMA:
      {
        "optionA": "Name of Option A",
        "optionB": "Name of Option B",
        "criteria": [
          { "subject": "Time to Competence", "A": number, "B": number },
          { "subject": "Income Potential", "A": number, "B": number },
          { "subject": "Difficulty", "A": number, "B": number },
          { "subject": "Risk Level", "A": number, "B": number },
          { "subject": "Long-Term Growth", "A": number, "B": number }
        ],
        "totalA": number (normalized 0-100 overall score),
        "totalB": number (normalized 0-100 overall score),
        "clarityScore": number (absolute difference between totalA and totalB),
        "recommendation": "Name of winning option or 'It's a tie. Flip a coin.'",
        "riskLevel": "Low" | "Medium" | "High",
        "biases": ["Bias 1", "Bias 2"],
        "insights": ["Insight 1", "Insight 2"],
        "actionPlan": [
           { "day": 1, "title": "...", "desc": "..." },
           ... exactly 7 items
        ]
      }
    `;

        const userPrompt = `
      Dilemma: ${dilemma}
      User Profile: ${userProfile ? JSON.stringify(userProfile) : 'None provided'}
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { role: 'user', parts: [{ text: userPrompt }] }
            ],
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                temperature: 0.2
            }
        });

        const parsedResponse = JSON.parse(response.text);

        // Transform criteria array into scoresA/scoresB objects for existing frontend compatibility map
        const scoresA = {};
        const scoresB = {};
        parsedResponse.criteria.forEach(c => {
            scoresA[c.subject] = c.A;
            scoresB[c.subject] = c.B;
        });

        // Provide the exact layout the existing frontend expects
        const payload = {
            scoresA,
            scoresB,
            totalA: parsedResponse.totalA,
            totalB: parsedResponse.totalB,
            clarityScore: parsedResponse.clarityScore,
            recommendation: parsedResponse.recommendation,
            riskLevel: parsedResponse.riskLevel,
            winner: parsedResponse.totalA > parsedResponse.totalB ? "A" : "B",
            biases: parsedResponse.biases,
            insights: parsedResponse.insights,
            radarData: parsedResponse.criteria, // Pass raw array for radar
            actionPlan: parsedResponse.actionPlan
        };

        res.json(payload);

    } catch (error) {
        console.error('LLM API Error:', error);
        res.status(500).json({ error: 'Analysis failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend proxy running on http://localhost:${PORT}`);
});
