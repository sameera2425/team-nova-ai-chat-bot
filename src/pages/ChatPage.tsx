import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, FileText, PenTool, Send, Plus, PlayCircle, User, Bot, X, Target } from 'lucide-react';
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

const goalTypes = [
  'Complete Chapter',
  'Master Topic',
  'Prepare for Exam',
  'Improve Quiz Score',
  'Build Habit',
];
const subjects = ['Math', 'Physics', 'History'];
const timeOptions = ['30 mins', '1 hr', '2 hrs'];

const ChatPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(messagesDummy);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [flowchartFullscreen, setFlowchartFullscreen] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const [goalType, setGoalType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [deadlineType, setDeadlineType] = useState('date');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');
  const [notes, setNotes] = useState('');
  const [goalSubmitted, setGoalSubmitted] = useState(false);
  const [goalSummary, setGoalSummary] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');

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
    // Trigger flowchart sidebar if message contains 'flowchart'
    if (/flowchart/i.test(input)) {
      setShowFlowchart(true);
    }
    setInput('');
  };

  const handleCloseFlowchart = () => {
    setShowFlowchart(false);
    setFlowchartFullscreen(false);
  };

  const handleFullscreenFlowchart = () => {
    setFlowchartFullscreen((prev) => !prev);
  };

  // Sidebar width logic
  const sidebarWidth = showFlowchart ? 'w-20' : 'w-64';
  const sidebarContentVisible = !showFlowchart;

  // Filtered subjects for search
  const filteredSubjects = subjects.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()));

  // Goal form submit handler
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalType || !selectedSubject || (!deadlineDate && !deadlineDays) || !timeCommitment) return;
    let summary = `You've set a goal to ${goalType.toLowerCase()} in `;
    if (deadlineType === 'date' && deadlineDate) {
      summary += `by ${deadlineDate}`;
    } else if (deadlineType === 'duration' && deadlineDays) {
      summary += `${deadlineDays} days`;
    }
    summary += `, spending ${timeCommitment}/day.`;
    if (notes) summary += `\nNotes: ${notes}`;
    setGoalSummary(summary);
    setGoalSubmitted(true);
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex relative transition-all duration-300 ${flowchartFullscreen ? 'overflow-hidden' : ''}`}> 
      {/* Left Sidebar */}
      <div className={`${sidebarWidth} bg-blue-50 border-r border-blue-100 ${showFlowchart ? 'px-2' : 'px-6'} py-6 flex flex-col fixed inset-y-0 left-0 z-30 h-full transition-all duration-300`}> 
        {/* Logo */}
        <div className={`mb-8 flex items-center gap-3 transition-all duration-300 ${sidebarContentVisible ? '' : 'justify-center'}`} style={{ minWidth: '3.5rem' }}>
          <img 
            src="/lovable-uploads/c5d5e601-2da5-47ee-8dfa-80eb7846f070.png" 
            alt="Teslearn Logo" 
            className="w-10 h-10 rounded-lg"
            style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
          />
          {sidebarContentVisible && (
            <div>
              <h1 className="text-2xl font-bold text-blue-900 mb-1">Teslearn</h1>
              <p className="text-sm text-blue-600 font-medium">Learn Your Way.</p>
            </div>
          )}
        </div>
        {/* Search Bar */}
        {sidebarContentVisible && (
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}
        {/* Navigation */}
        <nav className="space-y-2 flex flex-col items-center">
          {navItems.map((item, i) => (
            <NavItem key={item.text} icon={item.icon} text={item.text} active={item.active} mini={!sidebarContentVisible} />
          ))}
          {/* Set Goal Button */}
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale mt-4 bg-green-100 text-green-800 font-semibold`}
            onClick={() => navigate('/set-goal')}
          >
            <Target className="w-5 h-5" />
            {sidebarContentVisible && <span>Set Goal</span>}
          </button>
        </nav>
      </div>

      {/* Main Content - with left margin for sidebar and right margin for flowchart */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${flowchartFullscreen ? 'z-0' : ''}`}
        style={{
          marginLeft: showFlowchart ? '5rem' : '16rem',
          marginRight: showFlowchart && !flowchartFullscreen ? '420px' : '0',
        }}
      >
        {/* Header - Fixed */}
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-4">
          <p className="text-lg text-gray-600 animate-fade-in">
            {getGreeting()}, Teen!
          </p>
        </div>
        {/* Chat Thread */}
        {!flowchartFullscreen && (
          <div className="flex-1 flex flex-col w-full gap-10 pb-40 pt-6 px-8">
            {messages.map((msg) => (
              msg.sender === 'ai' ? (
                <div key={msg.id} className="flex items-start gap-4">
                  <img
                    src="/lovable-uploads/7285c574-a54d-4f95-ae36-27a5b52831af.png"
                    alt="Tesla AI Sphere"
                    className="w-14 h-14 rounded-full object-contain mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg text-gray-800">Tesla</span>
                      {msg.video && (
                        <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-500 rounded-md font-medium ml-2">AI-Video</span>
                      )}
                    </div>
                    <div className="text-base text-gray-800 mb-3 whitespace-pre-line">
                      {msg.text}
                    </div>
                    {msg.video && (
                      <>
                        <div className="italic text-gray-400 mb-2">Preparing Video...</div>
                        <div className="rounded-xl overflow-hidden w-[320px] h-[180px] bg-black flex items-center justify-center">
                          <button className="flex items-center justify-center w-full h-full" aria-label="Play video">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.2"/>
                              <path d="M20 17L32 24L20 31V17Z" fill="white"/>
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex items-start gap-4 justify-end">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg text-gray-800">You</span>
                    </div>
                    <div className="bg-blue-600 text-white rounded-2xl px-6 py-3 shadow-md text-base max-w-xl text-right">
                      {msg.text}
                    </div>
                  </div>
                  <img
                    src="https://api.dicebear.com/7.x/thumbs/svg?seed=teen"
                    alt="User Avatar"
                    className={`w-12 h-12 rounded-full object-cover mt-1 transition-all duration-300 ${showFlowchart && !flowchartFullscreen ? 'mr-8' : ''}`}
                  />
                </div>
              )
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
        {/* Prompt Box - Fixed at bottom */}
        <div
          className="fixed z-10 bg-transparent transition-all duration-300"
          style={{
            left: showFlowchart ? '5rem' : '16rem',
            right: showFlowchart && !flowchartFullscreen ? '420px' : '0',
            bottom: 0,
          }}
        >
          <div className="max-w-3xl mx-auto pb-6 px-8 animate-fade-in transition-all duration-300">
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

      {/* Right Sidebar (Flowchart Panel) */}
      <div
        className={`fixed top-0 right-0 h-full z-40 bg-white shadow-2xl border-l border-gray-200 transition-transform duration-300 flex flex-col ${showFlowchart ? (flowchartFullscreen ? 'w-full' : 'w-[420px]') : 'w-0 translate-x-full'} ${showFlowchart ? 'translate-x-0' : 'translate-x-full'} ${flowchartFullscreen ? 'fixed left-0 right-0' : ''}`}
        style={{ boxShadow: showFlowchart ? '0 0 32px 0 rgba(0,0,0,0.10)' : 'none' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">What is Linear Regression?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded hover:bg-gray-100"
              onClick={handleFullscreenFlowchart}
              aria-label="Fullscreen"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 8V3h5M17 12v5h-5" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3l6.5 6.5M17 17l-6.5-6.5" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <button
              className="p-2 rounded hover:bg-gray-100"
              onClick={handleCloseFlowchart}
              aria-label="Close"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 6l8 8M6 14L14 6" stroke="#222" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        {/* Flowchart Content */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
          {/* Sample static flowchart */}
          <div className="w-full max-w-md">
            <div className="font-semibold mb-4 text-center">Flowchart: What is Linear Regression?</div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
Start
 ↓
Collect Data
 ↓
Preprocess Data
 ↓
Split Data (Training / Testing)
 ↓
Train Model Using Linear Regression
 ↓
Evaluate Model on Test Data
 ↓
Is Performance Acceptable?
   ↙ Yes     ↘ No
Use Model  Adjust Model / Collect More Data
 ↓
End
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, text, active = false, mini = false }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale ${
      active
        ? 'bg-blue-200 text-blue-900 font-medium'
        : 'text-blue-700 hover:bg-blue-100'
    } ${mini ? 'justify-center px-0' : ''}`}
    aria-label={text}
  >
    <Icon className="w-5 h-5" />
    {!mini && <span>{text}</span>}
  </button>
);

export default ChatPage; 