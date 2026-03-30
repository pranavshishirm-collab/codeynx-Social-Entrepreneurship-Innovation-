require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CodeNynx API is running smoothly.' });
});

app.post('/api/generate-scenario', async (req, res) => {
  try {
    const { missionText, stakeholders, budget } = req.body;

    if (!missionText) {
      return res.status(400).json({ error: "missionText is required" });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the backend server." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are the AI engine for 'CodeNynx', a Reflective Social Entrepreneurship Simulation Game.
The user has provided the following mission and parameters:
Mission: "${missionText}"
Stakeholders: ${stakeholders.join(', ')}
Starting Budget: ₹${Number(budget).toLocaleString()} (Do not use this for flat subtraction, use percentages).

Generate a 5-step interactive narrative scenario exactly matching the JSON schema below.
CRITICAL RULES:
1. "budgetPercentage" determines the percentage of the starting budget affected. (e.g., -10 means the player loses 10% of their starting budget; 5 means they gain 5%).
2. "impact", "risk", and "trust" are flat numbers added/subtracted (e.g., 10, -15).
3. Delayed Consequences are randomly placed. 'stepToTriggerOn' must be a later step index (2, 3, 4, or 5).
4. Return ONLY valid JSON. No markdown backticks, no markdown blocks, just the raw JSON object.

FORMAT:
{
  "id": "custom",
  "title": "A short, catchy title based on the mission",
  "description": "A 2-3 sentence overview of the challenge.",
  "stakeholders": ["the stakeholders provided"],
  "startingStats": {
    "impact": 5, "budget": 100, "risk": 20, "trust": 30
  },
  "steps": [
    {
      "id": "step_1",
      "question": "Narrative situation requiring a choice involving the mission.",
      "options": [
        {
          "id": "opt_1",
          "text": "The choice description",
          "effects": { "impact": 10, "budgetPercentage": -15, "risk": 5, "trust": 10 },
          "delayedEffect": null 
        },
        {
          "id": "opt_2",
          "text": "Another choice",
          "effects": { "impact": 5, "budgetPercentage": -5, "risk": -10, "trust": 5 },
          "delayedEffect": { "stepToTriggerOn": 3, "effect": { "impact": -10, "trust": -20, "message": "This decision angered stakeholders earlier..." } }
        }
      ]
    }
  ]
}

Ensure there are exactly 5 steps, with 2 or 3 options per step.
`;
    
    // Call Gemini!
    let parsedData;
    try {
      const result = await model.generateContent(prompt);
      let output = result.response.text();
      // Strip markdown formatting if the LLM adds it despite instructions
      output = output.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      parsedData = JSON.parse(output);
    } catch (aiError) {
      console.warn("AI Generation Failed (Quota exceeded). Falling back to Procedural Engine.");
      // Procedural Fallback Engine
      parsedData = {
        id: "fallback_01",
        title: "Procedural Mission Sandbox",
        description: `Your initiative revolves around: "${missionText}". Because the Google AI API has locked your quota, you have been dropped into the generic emergency procedural challenge!`,
        stakeholders: stakeholders,
        startingStats: { impact: 10, budget: 100, risk: 15, trust: 25 },
        steps: [
          {
            id: "step_1",
            question: "Initial phase: How do you choose to deploy your initial capital?",
            options: [
              { id: "opt_1", text: "Spend aggressively to hit immediate milestones.", effects: { impact: 20, budgetPercentage: -25, risk: 15, trust: 5 }, delayedEffect: null },
              { id: "opt_2", text: "Reserve capital and run a slow, pilot study.", effects: { impact: 5, budgetPercentage: -5, risk: -10, trust: 15 }, delayedEffect: { stepToTriggerOn: 4, effect: { impact: 15, trust: 20, message: "Your early pilot study yielded excellent long-term data!" } } }
            ]
          },
          {
            id: "step_2",
            question: `The ${stakeholders[0] || "primary stakeholder"} is demanding a change in methodology. How do you respond?`,
            options: [
              { id: "opt_1", text: "Agree to their terms immediately.", effects: { impact: -10, budgetPercentage: -10, risk: -5, trust: 25 }, delayedEffect: null },
              { id: "opt_2", text: "Push back and maintain your original vision.", effects: { impact: 15, budgetPercentage: 0, risk: 20, trust: -15 }, delayedEffect: { stepToTriggerOn: 5, effect: { risk: 20, trust: -15, message: "Ignoring the stakeholders earlier has caused escalating political tension." } } }
            ]
          },
          {
            id: "step_3",
            question: "An unexpected regulatory hurdle blocks operations.",
            options: [
              { id: "opt_1", text: "Hire expensive consultants to legally bypass it.", effects: { impact: 5, budgetPercentage: -20, risk: -20, trust: 10 }, delayedEffect: null },
              { id: "opt_2", text: "Ignore the hurdle and operate in a gray area.", effects: { impact: 20, budgetPercentage: 0, risk: 35, trust: -25 }, delayedEffect: { stepToTriggerOn: 5, effect: { budgetPercentage: -25, risk: 40, message: "Authorities hit you with a massive sub-compliance fine!" } } }
            ]
          },
          {
            id: "step_4",
            question: "Public visibility of your project has skyrocketed.",
            options: [
              { id: "opt_1", text: "Launch a massive PR campaign to capitalize on it.", effects: { impact: 30, budgetPercentage: -15, risk: 10, trust: 20 }, delayedEffect: null },
              { id: "opt_2", text: "Stay quietly focused on internal operations.", effects: { impact: 5, budgetPercentage: 0, risk: -10, trust: 5 }, delayedEffect: null }
            ]
          },
          {
            id: "step_5",
            question: "End of the simulation cycle. How do you position your startup for the future?",
            options: [
              { id: "opt_1", text: "Liquidate assets and shift execution to the community.", effects: { impact: 15, budgetPercentage: 10, risk: -20, trust: 30 }, delayedEffect: null },
              { id: "opt_2", text: "Go all-in on a massive funding round.", effects: { impact: 40, budgetPercentage: -30, risk: 40, trust: 5 }, delayedEffect: null }
            ]
          }
        ]
      };
    }
    
    res.status(200).json(parsedData);
  } catch (err) {
    console.error("AI Generation Error: ", err);
    res.status(500).json({ error: `Google API Error: ${err.message}` });
  }
});

app.post('/api/judge-action', async (req, res) => {
  try {
    const { missionText, currentQuestion, userAction } = req.body;

    if (!userAction) return res.status(400).json({ error: "userAction is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are the AI engine for 'CodeNynx', a Reflective Social Entrepreneurship Simulator.
The player has typed a custom action instead of picking standard choices. You must act as the Game Master and judge the mathematical and narrative consequences of their text.

Mission Scope: "${missionText}"
Current Scenario Question: "${currentQuestion}"
Player's Typed Action: "${userAction}"

Analyze what the player typed. If it is a good idea, reward them. If it is foolish, reckless, or unrealistic, punish them.
Strictly return a minified JSON object exactly matching this schema:
{
  "id": "custom_opt",
  "text": "[The Player's Typed Action Summarized in 1 sentence]",
  "effects": {
    "impact": [Number between -30 and 40],
    "budgetPercentage": [Number between -50 and 50 representing percentage of budget lost/gained. E.g. -10 implies they lose 10%],
    "risk": [Number between -20 and 50],
    "trust": [Number between -30 and 40]
  },
  "delayedEffect": null OR {
    "stepToTriggerOn": [Any number between 2 and 5],
    "effect": {
       "impact": [Number], "trust": [Number], "risk": [Number], "budgetPercentage": [Number],
       "message": "[A short sentence describing a future consequence of their custom action]"
    }
  }
}
CRITICAL RULE: Return ONLY valid JSON. No markdown blocks.
`;
    
    const result = await model.generateContent(prompt);
    let output = result.response.text();
    output = output.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsedData = JSON.parse(output);
    
    res.status(200).json(parsedData);
  } catch (err) {
    console.error("AI Judging Error: ", err);
    res.status(500).json({ error: `Google API Error judging choice: ${err.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server started successfully on http://localhost:${PORT}`);
});
