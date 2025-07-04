import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, FileText, PenTool, Send, Plus, PlayCircle, User, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, text: 'Default Project', active: true },
  { icon: FileText, text: 'My Content' },
  { icon: PenTool, text: 'Writing Style' },
];

const messagesDummy = [
  {
    id: 1,
    sender: 'ai',
    text: "Welcome to Teslearn! Here's a quick video to get you started.",
    video: true,
    videoThumb: '/lovable-uploads/7285c574-a54d-4f95-ae36-27a5b52831af.png',
  },
  {
    id: 2,
    sender: 'user',
    text: "Can you explain Newton's First Law?",
  },
  {
    id: 3,
    sender: 'ai',
    text: "Absolutely! Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
  },
];

const tags = ["Generate Notes", "AI-Video", "Mind-Maps"];

const ChatPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(messagesDummy);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Happy late night";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Same as Index */}
      <div className="w-64 bg-blue-50 border-r border-blue-100 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <img 
            src="/lovable-uploads/c5d5e601-2da5-47ee-8dfa-80eb7846f070.png" 
            alt="Teslearn Logo" 
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Teslearn</h1>
            <p className="text-sm text-blue-600 font-medium">Learn Your Way.</p>
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
          />
        </div>
        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item, i) => (
            <NavItem key={item.text} icon={item.icon} text={item.text} active={item.active} />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto flex flex-col">
        {/* Greeting/Header - Same as Index */}
        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-4 animate-fade-in">
            {getGreeting()}, Teen!
          </p>
        </div>
        {/* Chat Thread */}
        <div className="flex-1 flex flex-col max-w-2xl mx-auto gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="flex items-end gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-md ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm'} flex flex-col gap-2`}>
                <span>{msg.text}</span>
                {msg.video && (
                  <div className="relative mt-2 group">
                    <img src={msg.videoThumb} alt="Video preview" className="w-48 h-28 object-cover rounded-xl" />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Play video">
                      <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                    </button>
                  </div>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="flex items-end gap-2 ml-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {/* Input Area - Styled like Index */}
        <div className="max-w-4xl mx-auto animate-fade-in mt-8 w-full">
          <div className="relative">
            <div className="p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl">
              <div className="bg-white rounded-2xl p-5">
                <div className="flex items-center gap-4 mb-4">
                  <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200" aria-label="Add">
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything — videos, quizzes, mindmaps or your doubts!"
                    className="flex-1 text-lg placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200" onClick={handleSend} aria-label="Send">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, text, active = false }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale ${
      active
        ? 'bg-blue-200 text-blue-900 font-medium'
        : 'text-blue-700 hover:bg-blue-100'
    }`}
    aria-label={text}
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </button>
);

export default ChatPage; 