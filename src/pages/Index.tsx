import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, FileText, PenTool, Video, Map, Calendar, Clipboard, Send, Plus, Target, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRAGStream } from '@/lib/stream';
import { SessionAPI } from '@/lib/session';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const profileAvatar = 'https://api.dicebear.com/7.x/thumbs/svg?seed=Jane';
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Previous chats logic
  const [previousChats, setPreviousChats] = useState(() => {
    const stored = localStorage.getItem('previousChats');
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem('previousChats', JSON.stringify(previousChats));
  }, [previousChats]);
  const handleOpenChat = (chat) => {
    // For demo: navigate to chat page and set input (if needed)
    navigate('/chat');
  };
  const handleDeleteChat = (id) => {
    setPreviousChats(previousChats.filter(c => c.id !== id));
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Happy late night";
  };

  const handleSendMessage = async () => {
    const sessionId = await new SessionAPI().createSession();
    console.log('Session ID:', sessionId);
    // navigate to chat page with session id
    navigate(`/chat?sessionId=${sessionId}`, { state: { inputValue } });
  };


  const features = [
    {
      title: "AI-Videos",
      icon: Video,
      description: "Unique generated educational videos tailored to learning needs every time."
    },
    {
      title: "Mindmaps",
      icon: Map,
      description: "Visual learning maps that simplify complex topics. Visual learning."
    },
    {
      title: "Smart Time-Table",
      icon: Calendar,
      description: "Unique generated educational videos tailored to your learning."
    },
    {
      title: "Instant Quizzes",
      icon: Clipboard,
      description: "Unique videos tailored to your learning needs every time."
    }
  ];

  const tags = ["Generate Notes", "AI-Video", "Mind-Maps"];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Reduced width */}
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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
          />
        </div>
        {/* New Chat & Set Goals */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 text-blue-700 hover:bg-blue-100"
          onClick={() => navigate('/')}
          aria-label="New Chat"
          type="button"
        >
          <MessageSquare className="w-5 h-5" />
          <span>New Chat</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-4 transition-all duration-200 text-blue-700 hover:bg-blue-100"
          onClick={() => navigate('/set-goal')}
          aria-label="Set Goals"
          type="button"
        >
          <Target className="w-5 h-5" />
          <span>Set Goals</span>
        </button>

        {/* Previous Chats Section */}
        <div className="mt-2">
          <div className="text-xs font-semibold text-blue-800 mb-2 px-2">Previous Chats</div>
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
            {previousChats.length === 0 && (
              <div className="text-xs text-gray-400 px-2">No previous chats</div>
            )}
            {previousChats.map(chat => (
              <div key={chat.id} className="flex items-center group px-2 py-1 rounded hover:bg-blue-100 cursor-pointer">
                <span className="flex-1 truncate text-sm text-blue-900" onClick={() => handleOpenChat(chat)}>{chat.text}</span>
                <button
                  className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteChat(chat.id)}
                  aria-label="Delete chat"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Greeting */}
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-2 flex items-center justify-between">
          <p className="text-lg text-gray-600 animate-fade-in">
            {getGreeting()}, Teen!
          </p>
          <button onClick={() => navigate('/profile')} className="ml-4 flex items-center gap-2 bg-white border border-blue-100 rounded-full px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200">
            <img src={profileAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          </button>
        </div>

        <div className="flex flex-col items-center w-full">
          <div className="relative animate-scale-in mb-6 pt-6">
            <img 
              src="/lovable-uploads/7285c574-a54d-4f95-ae36-27a5b52831af.png" 
              alt="AI Assistant Sphere" 
              className="w-32 h-32 object-contain"
            />
          </div>
          {/* Main Heading */}
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-blue-900 mb-2">
              Hey there! I'm Tesla.
            </h2>
            <h3 className="text-3xl font-bold text-gray-800">
              What do you want to learn today?
            </h3>
          </div>
          {/* Feature Cards - Made smaller */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 w-full max-w-6xl">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>

        {/* Chat Interface - Restructured */}
        <div className="max-w-4xl mx-auto animate-fade-in px-6">
          {/* Input Box with Gradient Border */}
          <div className="relative">
            {/* Gradient Border Container */}
            <div className="p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl">
              <div className="bg-white rounded-2xl p-5">
                {/* Main Input Text */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Add"
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                    title="Upload a file or image"
                    placeholder="Upload a file or image"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) setUploadedFile(e.target.files[0]);
                    }}
                  />
                  {uploadedFile && (
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                      {uploadedFile.type.startsWith('image') ? (
                        <img src={URL.createObjectURL(uploadedFile)} alt="preview" className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <span className="text-sm text-gray-700 max-w-[120px] truncate">{uploadedFile.name}</span>
                      )}
                      <button
                        className="ml-1 text-gray-400 hover:text-red-500"
                        onClick={() => setUploadedFile(null)}
                        aria-label="Remove file"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        if (/^quiz(ze)?$/i.test(inputValue.trim())) {
                          setInputValue('');
                          navigate('/quiz');
                        }
                      }
                    }}
                    placeholder="Ask me anything — videos, quizzes, mindmaps or your doubts!"
                    className="flex-1 text-lg placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200" onClick={handleSendMessage} aria-label="Send">
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Tags Below Input */}
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

const NavItem = ({ icon: Icon, text, onClick }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale text-blue-700 hover:bg-blue-100`}
    onClick={onClick}
    aria-label={text}
    type="button"
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </button>
);

const FeatureCard = ({ feature, index }) => (
  <div
    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
      <feature.icon className="w-4 h-4 text-gray-600" />
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-2">
      {feature.title}
    </h3>
    <p className="text-gray-600 text-xs leading-relaxed">
      {feature.description}
    </p>
  </div>
);

export default Index;
