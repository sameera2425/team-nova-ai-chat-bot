
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
      description: "Unique generated educational videos tailored to learning needs every time.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Mindmaps",
      icon: Map,
      description: "Visual learning maps that simplify complex topics. Visual learning.",
      gradient: "from-green-500 to-teal-600"
    },
    {
      title: "Smart Time-Table",
      icon: Calendar,
      description: "Unique generated educational videos tailored to your learning.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Instant Quizzes",
      icon: Clipboard,
      description: "Unique videos tailored to your learning needs every time.",
      gradient: "from-pink-500 to-rose-600"
    }
  ];

  const tags = ["Generate Notes", "AI-Video", "Mind-Maps"];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-blue-50 border-r border-blue-100 p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-blue-900 mb-1">Teslearn</h1>
          <p className="text-sm text-blue-600 font-medium">Learn Your Way.</p>
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
          <NavItem icon={Home} text="Default Project" active />
          <NavItem icon={FileText} text="My Content" />
          <NavItem icon={PenTool} text="Writing Style" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-6 animate-fade-in">
            {getGreeting()}, Teen!
          </p>

          {/* AI Assistant Visual */}
          <div className="flex justify-center mb-8">
            <div className="relative animate-scale-in">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
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
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-4">
            {tags.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200 hover-scale"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200 hover-scale">
                <Plus className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything — videos, quizzes, mindmaps or your doubts!"
                className="flex-1 text-lg placeholder-gray-400 focus:outline-none"
              />
              <button className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover-scale shadow-lg">
                <Send className="w-5 h-5" />
              </button>
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
    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in border border-gray-100 group cursor-pointer"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
      <feature.icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
      {feature.title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">
      {feature.description}
    </p>
  </div>
);

export default Index;
