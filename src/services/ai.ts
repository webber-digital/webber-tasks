import { GoogleGenAI, Type, Schema } from '@google/genai';
import { useStore } from '../store';

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });
  }
  return aiInstance;
}

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

const RATE_LIMIT_KEY = 'ai_rate_limit_timestamps';
const MAX_REQUESTS_PER_MINUTE = 3;

function checkRateLimit(): boolean {
  try {
    const rawData = localStorage.getItem(RATE_LIMIT_KEY);
    let timestamps: number[] = rawData ? JSON.parse(rawData) : [];
    
    const now = Date.now();
    // Filter timestamps within the last 1 minute (60,000 ms)
    timestamps = timestamps.filter(t => now - t < 60000);
    
    if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) {
      return false; // Rate limit exceeded
    }
    
    timestamps.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
    return true; // Allowed
  } catch (e) {
    // Fallback in case of parsing errors
    return true;
  }
}

export async function handleAiCommand(userInput: string, context: any): Promise<string> {
  if (!checkRateLimit()) {
    throw new Error("Rate limit exceeded: You can only use the AI assistant 3 times per minute. Please wait a moment and try again.");
  }

  const store = useStore.getState();
  
  const systemInstruction = `
    You are OmniTask AI, a helpful productivity assistant designed to help the user manage their life. 
    The current date and time is ${new Date().toISOString()}.
    
    You have tools to create tasks, events, and notes. Be extremely concise in your answers. 
    When creating objects, you must call the correct function (tool). 
    After successfully calling a function, briefly tell the user it was created and mention key details.
    
    Here is a brief summary of the user's current data for context:
    - Tasks: ${context.tasks.length}
    - Events: ${context.events.length}
    - Notes: ${context.notes.length}
    - Current View: ${context.currentView}
  `;

  try {
    const response = await getAi().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction,
        tools: [{ functionDeclarations: tools }],
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const args = call.args as Record<string, any>;
      
      switch (call.name) {
        case 'createTask':
          store.addTask({
            title: args.title,
            description: args.description || '',
            priority: args.priority || 'medium',
            tags: args.tags || [],
            folder: args.folder || 'Inbox',
            completed: false,
            dueDate: args.dueDateRaw ? new Date(args.dueDateRaw) : null,
          });
          break;
        case 'createEvent':
          store.addEvent({
            title: args.title,
            date: new Date(args.dateRaw),
            time: args.time || '',
            location: args.location || '',
          });
          break;
        case 'createNote':
          const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100'];
          store.addNote({
            title: args.title,
            content: args.content,
            tags: args.tags || [],
            color: colors[Math.floor(Math.random() * colors.length)]
          });
          break;
      }
      
      // Let the model finalize its answer using function response
      const followUp = await getAi().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userInput }] },
          { role: 'model', parts: [{ functionCall: call }] },
          { role: 'user', parts: [{ functionResponse: { name: call.name, response: { success: true } } }] }
        ],
        config: { systemInstruction }
      });
      return followUp.text || "I've taken care of that for you.";
    }

    return response.text || "I'm sorry, I couldn't understand that request.";
    
  } catch (err: any) {
    console.error("AI Service Error:", err);
    throw new Error('Failed to generate response.');
  }
}
