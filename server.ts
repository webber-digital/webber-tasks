import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });

// The definition of tools we expose to the AI
const tools = [
  {
    name: 'createTask',
    description: 'Creates a new task in the user\'s to-do list.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'The main title/name of the task' },
        description: { type: Type.STRING, description: 'Detailed description of the task (optional)' },
        priority: { type: Type.STRING, enum: ['low', 'medium', 'high'], description: 'Priority level. Default is medium.' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Relevant category tags (e.g., ["work", "errand"]).' },
        folder: { type: Type.STRING, description: 'Folder or project name to group the task in (optional).' },
        dueDateRaw: { type: Type.STRING, description: 'Due date in ISO format, e.g., 2026-05-14T18:00:00Z. Omit if not specified.' },
      },
      required: ['title'],
    }
  },
  {
    name: 'createEvent',
    description: 'Adds an event to the user\'s calendar.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Title of the event' },
        dateRaw: { type: Type.STRING, description: 'Date in ISO format, e.g., 2026-05-15T00:00:00Z.' },
        time: { type: Type.STRING, description: 'Time of the event, e.g., "14:00".' },
        location: { type: Type.STRING, description: 'Location of the event (optional)' },
      },
      required: ['title', 'dateRaw'],
    }
  },
  {
    name: 'createNote',
    description: 'Creates a quick note for the user.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Title or quick summary of the note' },
        content: { type: Type.STRING, description: 'The main body of the note' },
        tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Tags to categorize the note.' },
      },
      required: ['title', 'content'],
    }
  }
];

// API endpoint to handle chat interaction securely
app.post("/api/chat", async (req, res) => {
  try {
    const { userInput, context } = req.body;

    if (!userInput || !context) {
      return res.status(400).json({ error: "Missing userInput or context." });
    }

    const systemInstruction = `
      You are OmniTask AI, a helpful productivity assistant designed to help the user manage their life. 
      The current date and time is ${new Date().toISOString()}.
      
      You have tools to create tasks, events, and notes. Be extremely concise in your answers. 
      When creating objects, you must call the correct function (tool). 
      After successfully calling a function, briefly tell the user it was created and mention key details.
      
      Here is a brief summary of the user's current data for context:
      - Tasks: ${context.tasks}
      - Events: ${context.events}
      - Notes: ${context.notes}
      - Current View: ${context.currentView}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: tools }],
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const args = call.args;
      
      // We send the function call back to the client to execute the state change
      res.json({
        type: 'function_call',
        call: {
          name: call.name,
          args: args
        }
      });
      return;
    }

    res.json({ type: 'text', text: response.text || "I'm sorry, I couldn't understand that request." });

  } catch (error: any) {
    console.error("AI Service Error:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

// Follow-up API endpoint
app.post("/api/chat/followup", async (req, res) => {
  try {
    const { userInput, call } = req.body;

    const systemInstruction = `
      You are OmniTask AI, a helpful productivity assistant designed to help the user manage their life. 
      The current date and time is ${new Date().toISOString()}.
    `;

    const followUp = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: userInput }] },
        { role: 'model', parts: [{ functionCall: call }] },
        { role: 'user', parts: [{ functionResponse: { name: call.name, response: { success: true } } }] }
      ],
      config: { systemInstruction }
    });

    res.json({ type: 'text', text: followUp.text || "I've taken care of that for you." });
  } catch (error: any) {
    console.error("AI Follow-up Error:", error);
    res.status(500).json({ error: "Failed to generate follow-up." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
