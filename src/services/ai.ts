import { useStore } from '../store';

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

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput,
        context: {
          tasks: context.tasks.length,
          events: context.events.length,
          notes: context.notes.length,
          currentView: context.currentView
        }
      })
    });

    if (!res.ok) {
      throw new Error((await res.json()).error || 'Network error');
    }

    const data = await res.json();

    if (data.type === 'function_call') {
      const call = data.call;
      const args = call.args;

      // Execute local state changes
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

      // Fetch follow up from server
      const followUpRes = await fetch('/api/chat/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          call: data.call
        })
      });

      if (!followUpRes.ok) {
        return "Task successfully added, but I couldn't generate a confirmation message.";
      }

      const followUpData = await followUpRes.json();
      return followUpData.text || "I've taken care of that for you.";
    }

    return data.text || "I'm sorry, I couldn't understand that request.";
    
  } catch (err: any) {
    console.error("AI Service Error:", err);
    throw new Error('Failed to generate response.');
  }
}
