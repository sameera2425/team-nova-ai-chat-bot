import React, { useState, useEffect } from 'react';
import { Home, FileText, PenTool, Search, Target, User, Bell, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { icon: Home, text: 'Default Project', path: '/' },
  { icon: FileText, text: 'My Content', path: '/' },
  { icon: PenTool, text: 'Writing Style', path: '/' },
  { icon: Target, text: 'Set a Goal', path: '/set-goal' },
];
const profileAvatar = 'https://api.dicebear.com/7.x/thumbs/svg?seed=Jane';

const quizData = {
  title: 'Quiz: Total Internal Reflection',
  subheading: 'Answer the following questions to check your understanding.',
  questions: [
    {
      id: 1,
      topic: 'Critical Angle',
      text: 'What is the critical angle for glass-air interface?',
      options: ['42 degrees', '60 degrees', '90 degrees', '30 degrees'],
      correct: 0,
      explanation: 'The critical angle for glass-air interface is approximately 42 degrees due to the refractive index of glass (~1.5). Angles higher than this will cause total internal reflection.'
    },
    {
      id: 2,
      topic: 'Refraction',
      text: 'Which law governs the bending of light as it passes from one medium to another?',
      options: ['Snell\'s Law', 'Newton\'s Law', 'Ohm\'s Law', 'Hooke\'s Law'],
      correct: 0,
      explanation: 'Snell\'s Law describes how light bends (refracts) when passing between different media.'
    },
    {
      id: 3,
      topic: 'TIR Application',
      text: 'Total internal reflection can only occur when:',
      options: [
        'Light travels from a denser to a rarer medium',
        'Light travels from a rarer to a denser medium',
        'The angle of incidence is less than the critical angle',
        'The media have the same refractive index'
      ],
      correct: 0,
      explanation: 'TIR occurs only when light moves from a denser to a rarer medium and the angle of incidence exceeds the critical angle.'
    }
  ]
};

const understandingTopics = [
  { label: 'Critical Angle', key: 'Critical Angle' },
  { label: 'Refraction', key: 'Refraction' },
  { label: 'TIR Application', key: 'TIR Application' },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(quizData.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

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

  // Calculate progress
  const answeredCount = answers.filter(a => a !== null).length;
  const total = quizData.questions.length;

  // Calculate results
  const correctCount = answers.filter((a, i) => a === quizData.questions[i].correct).length;
  const topicScores = understandingTopics.map(topic => {
    const topicQuestions = quizData.questions.filter(q => q.topic === topic.key);
    const correct = topicQuestions.filter((q, i) => answers[quizData.questions.indexOf(q)] === q.correct).length;
    return {
      ...topic,
      percent: topicQuestions.length ? Math.round((correct / topicQuestions.length) * 100) : 0
    };
  });
  const lowTopics = topicScores.filter(t => t.percent < 70);

  // Handlers
  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers(a => a.map((v, i) => (i === qIdx ? optIdx : v)));
  };
  const handleSubmit = () => {
    setFadeOut(true);
    setTimeout(() => {
      setSubmitted(true);
      setFadeOut(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };
  const handleRetake = () => {
    setAnswers(Array(quizData.questions.length).fill(null));
    setSubmitted(false);
    setFadeOut(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="flex-1 overflow-auto">
        {/* Header - Steady */}
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-2 flex items-center justify-between">
          <p className="text-lg text-gray-600 animate-fade-in">
            Quiz
          </p>
          <button onClick={() => navigate('/profile')} className="ml-4 flex items-center gap-2 bg-white border border-blue-100 rounded-full px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200">
            <img src={profileAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          </button>
        </div>
        {/* Top Section: Title, Subheading, Progress Bar - Sticky */}
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center px-4 sticky top-[56px] z-10 bg-gray-50 pt-6 pb-4" style={{transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.02)'}}>
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-blue-900 mb-2">{quizData.title}</h1>
          <div className="text-base text-gray-500 text-center mb-6">{quizData.subheading}</div>
          {/* Progress Bar */}
          <div className="w-full mb-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-600">Progress: {answeredCount} of {total} answered</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        {/* Quiz Questions or Results */}
        <div className="w-full max-w-2xl mx-auto flex-1 px-4 pb-16">
          {/* Questions Section */}
          {!submitted && (
            <div className={`space-y-6 transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {quizData.questions.map((q, qIdx) => (
                <div key={q.id} className="bg-white rounded-xl shadow p-6 md:p-8 flex flex-col gap-4">
                  <div className="text-lg font-semibold text-blue-900 mb-2">
                    {qIdx + 1} {q.text}
                  </div>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, optIdx) => (
                      <label
                        key={optIdx}
                        className={`flex items-center gap-3 px-3 py-2 rounded transition-all duration-150 cursor-pointer ${answers[qIdx] === optIdx ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                      >
                        <input
                          type="radio"
                          name={`q${qIdx}`}
                          checked={answers[qIdx] === optIdx}
                          onChange={() => handleSelect(qIdx, optIdx)}
                          className="accent-blue-600 w-4 h-4"
                        />
                        <span className="text-gray-800 text-base">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-4">
                <button
                  className={`px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105 ${answeredCount !== total ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={answeredCount !== total}
                  onClick={handleSubmit}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          )}
          {/* Results Section */}
          {submitted && (
            <div className="space-y-8 animate-fade-in">
              {/* Score Summary */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">🎉 You scored {correctCount}/{total}</div>
              </div>
              {/* Understanding Chart */}
              <div className="bg-white rounded-xl shadow p-6">
                <div className="text-lg font-semibold text-blue-900 mb-4">Understanding by Topic</div>
                <div className="space-y-4">
                  {topicScores.map((t, i) => (
                    <div key={t.key} className="flex items-center gap-4">
                      <span className="w-40 text-gray-700 text-sm font-medium">{t.label}</span>
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-4 rounded-full ${t.percent >= 70 ? 'bg-green-400' : 'bg-orange-400'}`}
                          style={{ width: `${t.percent}%`, transition: 'width 1s' }}
                        />
                      </div>
                      <span className={`text-sm font-semibold ${t.percent >= 70 ? 'text-green-700' : 'text-orange-700'}`}>{t.percent}% Understood</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Question-by-Question Review */}
              <div className="space-y-6">
                {quizData.questions.map((q, qIdx) => {
                  const userCorrect = answers[qIdx] === q.correct;
                  return (
                    <div key={q.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                      <div className={`text-base font-semibold ${userCorrect ? 'text-green-700' : 'text-red-600'}`}>{userCorrect ? '✔️' : '❌'} Question {qIdx + 1} — {userCorrect ? 'Correct' : 'Incorrect'}</div>
                      <div className="text-gray-800 text-base mb-1">{q.text}</div>
                      <div className="text-sm text-gray-700 mb-1">Your Answer: <span className="font-semibold">{q.options[answers[qIdx]]}</span></div>
                      <div className="text-sm text-blue-700 mb-1">Correct Answer: <span className="font-semibold">{q.options[q.correct]}</span></div>
                      <div className="text-xs text-gray-600 italic pl-2 border-l-4 border-blue-200 mt-1">Why this answer is correct: {q.explanation}</div>
                    </div>
                  );
                })}
              </div>
              {/* Areas to Improve */}
              {lowTopics.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="text-lg font-semibold text-orange-700 mb-2 flex items-center gap-2">📌 Areas to Improve:</div>
                  <ul className="list-disc pl-6 text-sm text-orange-700">
                    {lowTopics.map(t => (
                      <li key={t.key}>{t.label}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Retake Quiz Button */}
              <div className="flex justify-center pt-4">
                <button
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  onClick={handleRetake}
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          )}
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

export default QuizPage; 