import React, { useState } from 'react';
import { BookOpen, Calendar, ArrowLeft, ChevronRight } from 'lucide-react';
import { AdSenseBlock } from '../components/AdSenseBlock';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'The Ultimate Guide to Productivity: How to Get More Done in Less Time',
    excerpt: 'Discover actionable strategies to boost your productivity, manage your time effectively, and achieve your goals with less stress. Learn how Wavedo can be your secret weapon.',
    content: `
      <h2>The Productivity Paradox</h2>
      <p>We all have the same 24 hours in a day, yet some people seem to accomplish so much more. The secret isn't working harder; it's working smarter. True productivity is about maximizing your impact while minimizing wasted effort.</p>
      
      <h2>1. The Power of Time Blocking</h2>
      <p>One of the most effective ways to manage your day is time blocking. Instead of working from a never-ending to-do list, schedule specific blocks of time for specific tasks. This prevents Parkinson's Law (work expands to fill the time available) and keeps you focused.</p>
      <p>Use the calendar feature in Wavedo to block out deep work sessions, meetings, and even breaks. Treat these blocks as immutable appointments with yourself.</p>

      <h2>2. Embrace the Pomodoro Technique</h2>
      <p>Focus fatigue is real. The Pomodoro Technique combats this by breaking work into intervals, traditionally 25 minutes in length, separated by short breaks. This trains your brain to focus for short bursts and helps you stay fresh.</p>
      <p>Wavedo includes a built-in Focus Timer perfectly optimized for Pomodoro sessions. Give it a try, and you'll be amazed at how much you can achieve without burning out.</p>

      <h2>3. The Two-Minute Rule</h2>
      <p>If a task takes less than two minutes to complete, do it immediately. Don't add it to your list, don't schedule it for later. Just do it. This simple rule prevents small tasks from piling up and overwhelming you.</p>

      <h2>4. Prioritize Ruthlessly</h2>
      <p>Not all tasks are created equal. Identify the 20% of tasks that will yield 80% of your results (the Pareto Principle). Focus your energy on these high-impact tasks. Wavedo allows you to categorize and prioritize tasks so you always know what's most important.</p>

      <h2>Conclusion</h2>
      <p>Productivity is a journey, not a destination. By implementing these strategies and leveraging the right tools like Wavedo, you can take control of your time, reduce stress, and achieve your goals faster than you ever thought possible.</p>
    `,
    date: '2026-05-15',
    author: 'Wavedo Team',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Why You Need a Second Brain: Master Your Focus and Ideas',
    excerpt: 'Stop trying to remember everything. Learn how combining task management, a focus timer, and quick notes creates a powerful "Second Brain" to clear your mind and increase creativity.',
    content: `
      <h2>Your Brain is for Having Ideas, Not Holding Them</h2>
      <p>David Allen, the creator of Getting Things Done (GTD), famously said that your mind is for having ideas, not for holding them. When you rely solely on your memory to track tasks, ideas, and appointments, you increase cognitive load and stress levels.</p>
      
      <h2>Building Your Second Brain with Wavedo</h2>
      <p>A "Second Brain" is an external, centralized system where you store your ideas, to-dos, and knowledge. With Wavedo, you have all the tools necessary in one dashboard.</p>
      
      <h3>1. Capture Everything Instantly</h3>
      <p>The moment an idea strikes or a new task is assigned, log it. Wavedo allows you to quickly add tasks with priorities or jot down unstructured thoughts in the Notes section. This frees up your mental RAM for actual problem-solving and deep work.</p>

      <h3>2. Execute with Pomodoro Focus</h3>
      <p>Once your tasks are captured and organized, it's time to execute. The Pomodoro technique isn't just about managing time; it's about managing your attention span. Our built-in Focus Timer lets you zone in on a single task from your list without distractions.</p>

      <h2>The Result: Flow State</h2>
      <p>When you trust your external system (Wavedo) to hold your responsibilities, you can fully immerse yourself in the present moment. This immersion is the key to achieving the elusive "Flow State," where your best work happens effortlessly.</p>
    `,
    date: '2026-05-20',
    author: 'Wavedo Team',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'How to Build Morning Routines that Stick',
    excerpt: 'Win the morning to win the day. A comprehensive look into designing morning routines that actually work for you, using Wavedo.',
    content: `
      <h2>The Foundation of a Good Day</h2>
      <p>Your morning routine sets the tone for the rest of your day. Without structure, you're reacting to the world. With a strong routine, you dictate your own progress.</p>
      
      <h2>Start Small</h2>
      <p>Don't try to implement ten new habits at once. Pick one or two—like drinking a glass of water, followed by a 10-minute focus block on your biggest task using the Wavedo Pomodoro timer.</p>
      
      <h2>Sync Your Calendar</h2>
      <p>Review your day before the day begins. By checking the Wavedo Calendar every morning, you prepare yourself mentally for the meetings and deep work sessions ahead.</p>
      
      <h2>The Power of Consistency</h2>
      <p>Motivation gets you started; habit keeps you going. Track your streaks and watch your productivity compound over time!</p>
    `,
    date: '2026-05-22',
    author: 'Wavedo Team',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export function BlogsView() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const selectedPost = BLOG_POSTS.find(post => post.id === selectedPostId);

  if (selectedPost) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="flex items-center px-6 py-4 border-b border-slate-200">
          <button 
            onClick={() => setSelectedPostId(null)}
            className="p-2 -ml-2 mr-4 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 truncate">Back to Blogs</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              {selectedPost.title}
            </h1>
            
            <div className="flex items-center text-sm text-slate-500 mb-8 space-x-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(selectedPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span>{selectedPost.readTime}</span>
              <span>•</span>
              <span>By {selectedPost.author}</span>
            </div>
            
            {selectedPost.imageUrl && (
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title} 
                className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 shadow-sm"
              />
            )}
            
            <div 
              className="prose prose-slate prose-lg md:prose-xl max-w-none 
                         prose-headings:font-bold prose-headings:text-slate-900
                         prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />
            
            <div className="mt-12 pt-8 border-t border-slate-200 pb-8">
              <div className="bg-slate-50 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to boost your productivity?</h3>
                <p className="text-slate-600 mb-6">Start using Wavedo today and take control of your time.</p>
                <AdSenseBlock className="w-full max-w-2xl min-h-[90px] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden" format="auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      <header className="px-6 py-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Blogs</h1>
              <p className="text-slate-500 mt-1">Insights, tips, and guides for maximum productivity</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {BLOG_POSTS.map(post => (
            <div 
              key={post.id} 
              onClick={() => setSelectedPostId(post.id)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col md:flex-row group"
            >
              {post.imageUrl && (
                <div className="md:w-1/3 h-48 md:h-auto shrink-0 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex items-center text-xs font-medium text-slate-500 mb-3 space-x-3">
                  <span className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    Productivity
                  </span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-slate-600 mb-6 line-clamp-2 md:line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                  Read article <ChevronRight className="w-5 h-5 ml-1" />
                </div>
              </div>
            </div>
          ))}

          <div className="mt-12 flex justify-center">
             <AdSenseBlock className="w-full max-w-3xl min-h-[90px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" format="auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
