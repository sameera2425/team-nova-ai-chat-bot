import React, { useState, useEffect } from 'react';
import { Home, FileText, PenTool, Search, User, Target, Edit, Plus, Calendar, Clock, CheckCircle, AlertCircle, Bell, ChevronRight, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, text: 'Default Project', active: false },
  { icon: FileText, text: 'My Content' },
  { icon: PenTool, text: 'Writing Style' },
  { icon: Target, text: 'Set a Goal', active: true },
];

const goalCategories = [
  'Complete a Course',
  'Improve Weak Areas',
  'Build Consistency',
  'Prepare for a Test',
];

const subjects = [
  'Math',
  'Science',
  'History',
  'English',
  'Computer Science',
  'Others',
];

const timeframes = [
  '1 Week',
  '2 Weeks',
  '1 Month',
  'Custom Date',
];

const dailyCommitments = [
  '15 min',
  '30 min',
  '1 hour',
  '2+ hours',
];

const priorities = [
  { label: 'Low', color: 'green' },
  { label: 'Medium', color: 'yellow' },
  { label: 'High', color: 'red' },
];

const profileAvatar = 'https://api.dicebear.com/7.x/thumbs/svg?seed=Jane';

const SetGoalPage = () => {
  const navigate = useNavigate();
  // State for all sections
  const [category, setCategory] = useState(goalCategories[0]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [timeframe, setTimeframe] = useState(timeframes[0]);
  const [customDate, setCustomDate] = useState('');
  const [daily, setDaily] = useState(dailyCommitments[0]);
  const [priority, setPriority] = useState(priorities[1].label);
  const [notify, setNotify] = useState('daily');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  // Previous chats logic
  const [previousChats, setPreviousChats] = useState(() => {
    const stored = localStorage.getItem('previousChats');
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem('previousChats', JSON.stringify(previousChats));
  }, [previousChats]);
  const handleOpenChat = (chat) => {
    // For demo: do nothing or set a state
  };
  const handleDeleteChat = (id) => {
    setPreviousChats(previousChats.filter(c => c.id !== id));
  };

  // Handlers
  const handleSubjectClick = (subj) => {
    setSelectedSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };
  const handleAddCustom = () => {
    if (customSubject.trim()) {
      setSelectedSubjects((prev) => [...prev, customSubject.trim()]);
      setCustomSubject('');
      setShowCustomInput(false);
    }
  };
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <div className="w-64 bg-blue-50 border-r border-blue-100 p-6 flex flex-col fixed inset-y-0 left-0 z-30 h-full">
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
        {/* Other Navigation */}
        <nav className="space-y-2 flex flex-col items-center mb-4">
          <NavItem icon={Home} text="Default Project" onClick={() => navigate('/')} />
          <NavItem icon={FileText} text="My Content" onClick={() => navigate('/')} />
          <NavItem icon={PenTool} text="Writing Style" onClick={() => navigate('/')} />
        </nav>
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

      {/* Main Content - with left margin for sidebar */}
      <div style={{ marginLeft: '16rem' }} className="flex-1 flex flex-col min-h-screen">
        {/* Header - Steady */}
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-2 flex items-center justify-between flex-shrink-0">
          <p className="text-lg text-gray-600 animate-fade-in">
            Set Your Learning Goal
          </p>
          <button onClick={() => navigate('/profile')} className="ml-4 flex items-center gap-2 bg-white border border-blue-100 rounded-full px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200">
            <img src={profileAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          </button>
        </div>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto mt-8 space-y-8 px-6 pt-6">
            {/* Section 1: Goal Category */}
            <Card title="Choose Goal Category">
              <div className="flex flex-wrap gap-4">
                {goalCategories.map((cat) => (
                  <label key={cat} className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${category === cat ? 'bg-blue-100 border-blue-600 text-blue-900 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'}`}>
                    <input type="radio" name="goal-category" className="hidden" checked={category === cat} onChange={() => setCategory(cat)} />
                    {cat}
                  </label>
                ))}
              </div>
            </Card>

            {/* Section 2: Subjects */}
            <Card title="Select Topics/Subjects">
              <div className="flex flex-wrap gap-3 mb-2">
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${selectedSubjects.includes(subj) ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => handleSubjectClick(subj)}
                    type="button"
                  >
                    {subj}
                  </button>
                ))}
                <button
                  className="px-3 py-2 rounded-full text-sm font-medium border border-dashed border-blue-400 bg-white text-blue-600 flex items-center gap-1 hover:bg-blue-50"
                  onClick={() => setShowCustomInput(true)}
                  type="button"
                >
                  <Plus className="w-4 h-4" /> Add Custom
                </button>
              </div>
              {showCustomInput && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={e => setCustomSubject(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter custom topic"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors" onClick={handleAddCustom} type="button">
                    Add
                  </button>
                  <button className="px-2 py-2 text-gray-500 hover:text-red-500" onClick={() => setShowCustomInput(false)} type="button">Cancel</button>
                </div>
              )}
            </Card>

            {/* Section 3: Timeframe */}
            <Card title="Set Timeframe">
              <div className="flex flex-wrap gap-4 items-center">
                {timeframes.map((tf) => (
                  <label key={tf} className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${timeframe === tf ? 'bg-blue-100 border-blue-600 text-blue-900 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'}`}>
                    <input type="radio" name="goal-timeframe" className="hidden" checked={timeframe === tf} onChange={() => setTimeframe(tf)} />
                    {tf}
                  </label>
                ))}
                {timeframe === 'Custom Date' && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={e => setCustomDate(e.target.value)}
                    className="ml-2 px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Select date"
                  />
                )}
              </div>
            </Card>

            {/* Section 4: Daily Commitment */}
            <Card title="Daily Commitment">
              <div className="flex flex-wrap gap-4">
                {dailyCommitments.map((d) => (
                  <label key={d} className={`cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${daily === d ? 'bg-blue-100 border-blue-600 text-blue-900 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'}`}>
                    <input type="radio" name="goal-daily" className="hidden" checked={daily === d} onChange={() => setDaily(d)} />
                    {d}
                  </label>
                ))}
              </div>
            </Card>

            {/* Section 5: Priority Level */}
            <Card title="Priority Level">
              <div className="flex gap-6">
                {priorities.map((p) => {
                  const colorMap = {
                    green: 'border-green-500 text-green-700 bg-green-50',
                    yellow: 'border-yellow-500 text-yellow-700 bg-yellow-50',
                    red: 'border-red-500 text-red-700 bg-red-50',
                  };
                  const dotMap = {
                    green: 'bg-green-500',
                    yellow: 'bg-yellow-400',
                    red: 'bg-red-500',
                  };
                  const selected = priority === p.label;
                  return (
                    <label
                      key={p.label}
                      className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg border transition-all duration-200 text-base font-medium shadow-sm ${selected ? colorMap[p.color] + ' font-bold border-2' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'}`}
                      style={{ minWidth: 90, justifyContent: 'center' }}
                    >
                      <input type="radio" name="goal-priority" className="hidden" checked={selected} onChange={() => setPriority(p.label)} />
                      <span className={`w-3 h-3 rounded-full ${dotMap[p.color]} inline-block`}></span>
                      {p.label}
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Section 6: Notification Preference */}
            <Card title="Notification Preference">
              <div className="flex gap-6 items-center">
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 ${notify === 'daily' ? 'bg-blue-100 border-blue-600 text-blue-900 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'}`}>
                  <input type="radio" name="goal-notify" className="hidden" checked={notify === 'daily'} onChange={() => setNotify('daily')} />
                  <Bell className="w-4 h-4" /> Remind me daily
                </label>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-all duration-200 ${notify === 'weekly' ? 'bg-blue-100 border-blue-600 text-blue-900 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50'}`}>
                  <input type="radio" name="goal-notify" className="hidden" checked={notify === 'weekly'} onChange={() => setNotify('weekly')} />
                  <Bell className="w-4 h-4" /> Remind me weekly
                </label>
              </div>
            </Card>

            {/* Section 7: Additional Notes */}
            <Card title="Additional Notes (Optional)">
              <textarea
                className="w-full min-h-[60px] px-3 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Anything else you'd like to add?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </Card>

            {/* Section 8: Goal Summary Preview */}
            <Card title="Goal Summary Preview">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold">
                  <Target className="w-5 h-5" /> {category}
                  <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>Edit</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Subjects:</span>
                  {selectedSubjects.length === 0 ? <span className="text-gray-400">None</span> : selectedSubjects.map(s => <span key={s} className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold mr-1">{s}</span>)}
                  <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:400,behavior:'smooth'})}>Edit</button>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Timeframe:</span> {timeframe === 'Custom Date' ? customDate || 'Not set' : timeframe}
                  <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:800,behavior:'smooth'})}>Edit</button>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Daily:</span> {daily}
                  <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:1200,behavior:'smooth'})}>Edit</button>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Priority:</span> {priority}
                  <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:1400,behavior:'smooth'})}>Edit</button>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-700">Notify:</span> {notify === 'daily' ? 'Daily' : 'Weekly'}
                  <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:1600,behavior:'smooth'})}>Edit</button>
                </div>
                {notes && (
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-700">Notes:</span> {notes}
                    <button className="ml-2 text-blue-500 hover:underline text-xs" onClick={() => window.scrollTo({top:1800,behavior:'smooth'})}>Edit</button>
                  </div>
                )}
              </div>
            </Card>

            {/* Section 9: Save Goal */}
            <div className="flex flex-col items-center">
              <button
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition-all flex items-center gap-2"
                onClick={handleSave}
              >
                <CheckCircle className="w-6 h-6" /> Save Goal
              </button>
              {saved && (
                <div className="mt-4 text-green-600 font-semibold flex items-center gap-2 animate-bounce">
                  🎯 Your goal has been set!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition-all duration-200">
    <div className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
      {title}
    </div>
    {children}
  </div>
);

const NavItem = ({ icon: Icon, text, active = false, onClick }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale ${
      active
        ? 'bg-blue-200 text-blue-900 font-medium'
        : 'text-blue-700 hover:bg-blue-100'
    }`}
    aria-label={text}
    onClick={onClick}
  >
    <Icon className="w-5 h-5" />
    <span>{text}</span>
  </button>
);

export default SetGoalPage; 