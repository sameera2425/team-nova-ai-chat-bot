import React from 'react';
import { Home, FileText, PenTool, Search, User, Edit, LogOut, BookOpen, Video, BarChart2, Award, Bell, Star, TrendingUp, BadgeCheck, ChevronRight, Target, MessageSquare, Trash2, CheckCircle, Clock, AlertCircle, Brain, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoalsMemoryAPI, getQuizzes } from '@/lib/base';
import { Goal, GlobalMemoryResponse, Quiz } from '@/types/api';

const navItems = [
  { icon: Home, text: 'Default Project', path: '/' },
  { icon: FileText, text: 'My Content', path: '/' },
  { icon: PenTool, text: 'Writing Style', path: '/' },
  { icon: Target, text: 'Set a Goal', path: '/set-goal' },
];

const dummyUser = {
  name: 'Maria Kevin',
  email: 'maria.kevin@somaiya.edu',
  grade: 'Grade 12',
  avatar: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Maria',
};


const performance = {
  score: 78,
  strengths: ['Math', 'Science'],
  improve: ['Essay Writing', 'History'],
};

const recentActivity = [
  { type: 'Video', label: 'Watched: Linear Regression', icon: Video },
  { type: 'Quiz', label: 'Quiz: Algebra Basics', icon: BarChart2 },
  { type: 'Notes', label: 'Created Notes: Photosynthesis', icon: BookOpen },
  { type: 'Video', label: "Watched: Newton's Laws", icon: Video },
  { type: 'Quiz', label: 'Quiz: World War II', icon: BarChart2 },
];

const badges = [
  { label: '7-Day Streak', icon: TrendingUp },
  { label: 'Quiz Master', icon: Award },
  { label: 'Note Taker', icon: BookOpen },
  { label: 'Video Buff', icon: Video },
];

const recommendations = [
  { label: 'Watch: Probability Basics', icon: Video },
  { label: 'Quiz: Geometry Challenge', icon: BarChart2 },
  { label: 'Mindmap: Cell Structure', icon: BookOpen },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [globalMemory, setGlobalMemory] = React.useState<string>('');
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [quizzesLoading, setQuizzesLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // API client instance
  const api = React.useMemo(() => new GoalsMemoryAPI(), []);

  // Fetch goals and memory on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch goals and memory in parallel
        const [goalsResponse, memoryResponse] = await Promise.all([
          api.getGoals(),
          api.getGlobalMemory()
        ]);
        
        setGoals(goalsResponse.goals);
        setGlobalMemory(memoryResponse.preferences);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api]);

  // Fetch quizzes on component mount
  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setQuizzesLoading(true);
        const response = await getQuizzes();
        setQuizzes(response.results);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      } finally {
        setQuizzesLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleTakeQuiz = (quizId: number) => {
    navigate(`/quiz/${quizId}`);
  };

  // Previous chats logic
  const [previousChats, setPreviousChats] = React.useState(() => {
    const stored = localStorage.getItem('previousChats');
    return stored ? JSON.parse(stored) : [];
  });
  React.useEffect(() => {
    localStorage.setItem('previousChats', JSON.stringify(previousChats));
  }, [previousChats]);
  const handleOpenChat = (chat) => {
    // For demo: navigate to chat page and set input (if needed)
    navigate('/chat');
  };
  const handleDeleteChat = (id) => {
    setPreviousChats(previousChats.filter(c => c.id !== id));
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
      <div className="flex-1 overflow-auto" style={{ marginLeft: '16rem' }}>
        {/* Header */}
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-2 flex items-center justify-between mb-8">
          <p className="text-lg text-gray-600 animate-fade-in">
            Profile
          </p>
          <button
            className="ml-4 flex items-center gap-2 bg-white border border-blue-100 rounded-full px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => navigate('/profile')}
          >
            <img src={dummyUser.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 px-6">
          <div className="flex flex-col items-center bg-white rounded-2xl shadow p-8 w-full md:w-1/3 hover:shadow-lg transition-all duration-200">
            <img src={dummyUser.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4" />
            <div className="text-xl font-bold text-blue-900 mb-1">{dummyUser.name}</div>
            <div className="text-gray-500 mb-1">{dummyUser.email}</div>
            <div className="text-blue-600 font-medium mb-4">{dummyUser.grade}</div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          </div>

          {/* Learning Goals */}
          <div className="flex-1 bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-blue-900">Learning Goals</div>
              <button className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1" onClick={() => navigate('/set-goal')}>
                <Edit className="w-4 h-4" /> Edit Goals
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : goals.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No goals set yet. Create your first learning goal!</div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {goal.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {goal.status === 'in_progress' && <Clock className="w-5 h-5 text-yellow-500" />}
                        {goal.status === 'pending' && <AlertCircle className="w-5 h-5 text-gray-400" />}
                        {goal.status === 'cancelled' && <AlertCircle className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{goal.title}</h4>
                        <p className="text-gray-600 text-xs mb-2">{goal.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Deadline: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                            goal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                            goal.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {goal.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Memory Preferences */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 px-6">
          <div className="flex-1 bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
              <div className="text-lg font-semibold text-blue-900">AI Learning Preferences</div>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : globalMemory ? (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="space-y-2">
                  {globalMemory.split('\n').map((preference, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{preference.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">No learning preferences set yet.</div>
            )}
          </div>
        </div>

        {/* Quizzes Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 px-6">
          <div className="flex-1 bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <div className="text-lg font-semibold text-blue-900">My Quizzes</div>
              </div>
              <span className="text-sm text-gray-500">{quizzes.length} quizzes</span>
            </div>
            {quizzesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No quizzes created yet. Start a chat to generate quizzes!</div>
            ) : (
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{quiz.title}</h4>
                        <p className="text-gray-600 text-xs mb-2">{quiz.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Session #{quiz.session_id}</span>
                          <span>{quiz.question_count} questions</span>
                          {quiz.created_at && (
                            <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleTakeQuiz(quiz.id)}
                        className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        Take Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 px-6">
          <div className="flex-1 bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-all duration-200 flex flex-col items-center">
            <div className="text-lg font-semibold text-blue-900 mb-4">Performance Overview</div>
            {/* Donut Chart Dummy */}
            <div className="w-32 h-32 mb-4 flex items-center justify-center relative">
              <svg width="100" height="100" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="#e0e7ff" />
                <circle cx="18" cy="18" r="16" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="78, 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">{performance.score}%</span>
              </div>
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex-1 bg-blue-50 rounded-xl p-4 flex flex-col items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-blue-600" />
                <div className="font-semibold text-blue-900 text-sm">Strengths</div>
                {performance.strengths.map((s) => (
                  <div key={s} className="text-blue-700 text-xs">{s}</div>
                ))}
              </div>
              <div className="flex-1 bg-red-50 rounded-xl p-4 flex flex-col items-center gap-2">
                <Star className="w-6 h-6 text-red-400" />
                <div className="font-semibold text-red-600 text-sm">To Improve</div>
                {performance.improve.map((s) => (
                  <div key={s} className="text-red-500 text-xs">{s}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex-1 bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-blue-900">Recent Activity</div>
              <button className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
                View All Activity <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-48 pr-2">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
                  <a.icon className="w-5 h-5 text-blue-600" />
                  <div className="text-gray-700 text-sm">{a.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Settings & Account */}
        <div className="flex flex-col md:flex-row gap-8 mb-8 px-6">
          <div className="flex-1 bg-white rounded-2xl shadow p-8 hover:shadow-lg transition-all duration-200 flex flex-col">
            <div className="text-lg font-semibold text-blue-900 mb-4">Settings & Account</div>
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Learning Style: <span className="font-semibold text-blue-900">Visual</span></span>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Notifications: <span className="font-semibold text-blue-900">Enabled</span></span>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center gap-2 w-max">
              <LogOut className="w-4 h-4" /> Logout
            </button>
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

export default ProfilePage; 