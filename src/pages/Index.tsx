
import React, { useState, useEffect } from 'react';
import { Search, Home, FileText, PenTool, Video, Map, Calendar, Clipboard, Send, Plus } from 'lucide-react';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Happy late night";
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/c5d5e601-2da5-47ee-8dfa-80eb7846f070.png" 
            alt="Teslearn Logo" 
            className="w-8 h-8 rounded-lg"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Teslearn</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            {getGreeting()}, Teen!
          </p>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Upgrade
          </button>
          <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 bg-blue-50 border-r border-blue-100 p-6 flex flex-col">
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
            <NavItem icon={Home} text="Default Project" active />
            <NavItem icon={FileText} text="My Content" />
            <NavItem icon={PenTool} text="Writing Style" />
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {/* AI Assistant Visual */}
          <div className="flex justify-center mb-8">
            <div className="relative animate-scale-in">
              <img 
                src="/lovable-uploads/3f58ef97-c625-4645-88d5-da172422adac.png" 
                alt="AI Assistant" 
                className="w-24 h-24"
              />
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-semibold text-blue-900 mb-2">
              Hey there! I'm Tesla.
            </h2>
            <h3 className="text-4xl font-bold text-gray-800">
              What do you want to learn today?
            </h3>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          {/* Chat Interface */}
          <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Input Box with Gradient Border */}
            <div className="relative">
              {/* Gradient Border Container */}
              <div className="p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl">
                <div className="bg-white rounded-2xl p-6">
                  {/* Tags Inside */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Input Row */}
                  <div className="flex items-center gap-4">
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <Plus className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything — videos, quizzes, mindmaps or your doubts!"
                      className="flex-1 text-lg placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                    <button className="p-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
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
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </button>
);

const FeatureCard = ({ feature, index }) => (
  <div
    className="bg-white rounded-lg p-6 border border-gray-100 hover:shadow-sm transition-all duration-200 cursor-pointer animate-fade-in"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
      <feature.icon className="w-5 h-5 text-gray-500" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      {feature.title}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed">
      {feature.description}
    </p>
  </div>
);

export default Index;
