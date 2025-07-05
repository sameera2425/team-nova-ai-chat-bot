import React from 'react';
import { Search, Home, FileText, PenTool, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SetGoalChat from './SetGoalChat';

const navItems = [
  { icon: Home, text: 'Default Project', active: false },
  { icon: FileText, text: 'My Content' },
  { icon: PenTool, text: 'Writing Style' },
];

const SetGoalPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <div className="w-64 bg-blue-50 border-r border-blue-100 px-6 py-6 flex flex-col fixed inset-y-0 left-0 z-30 h-full">
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
        <nav className="space-y-2 flex flex-col items-center">
          {navItems.map((item, i) => (
            <button
              key={item.text}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale ${item.active ? 'bg-blue-200 text-blue-900 font-medium' : 'text-blue-700 hover:bg-blue-100'}`}
              aria-label={item.text}
              onClick={() => navigate('/')}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </button>
          ))}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale mt-4 bg-green-200 text-green-800 font-semibold cursor-not-allowed"
            aria-label="Set Goal"
            disabled
          >
            <Target className="w-5 h-5" />
            <span>Set Goal</span>
          </button>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
        {/* Header - Fixed */}
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-4">
          <p className="text-lg text-gray-600 animate-fade-in">Set Your Goal</p>
        </div>
        {/* Conversational SetGoalChat */}
        <div className="flex-1 flex flex-col">
          <SetGoalChat />
        </div>
      </div>
    </div>
  );
};

export default SetGoalPage; 