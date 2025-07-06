import React, { useState, useEffect } from 'react';
import { Home, FileText, PenTool, Search, Target, User, Bell, MessageSquare, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizAPI } from '@/lib/base';
import { Quiz, QuizQuestion, QuizSubmissionResult } from '@/types/api';

const navItems = [
  { icon: Home, text: 'Default Project', path: '/' },
  { icon: FileText, text: 'My Content', path: '/' },
  { icon: PenTool, text: 'Writing Style', path: '/' },
  { icon: Target, text: 'Set a Goal', path: '/set-goal' },
];
const profileAvatar = 'https://api.dicebear.com/7.x/thumbs/svg?seed=Jane';

const QuizPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizSubmissionResult[]>([]);

  // Previous chats logic
  const [previousChats, setPreviousChats] = useState(() => {
    const stored = localStorage.getItem('previousChats');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('previousChats', JSON.stringify(previousChats));
  }, [previousChats]);

  const handleOpenChat = (chat: { id: string; text: string }) => {
    // For demo: navigate to chat page and set input (if needed)
    navigate('/chat');
  };

  const handleDeleteChat = (id: string) => {
    setPreviousChats(previousChats.filter(c => c.id !== id));
  };

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      
      try {
        setLoading(true);
        const quizApi = new QuizAPI();
        const quizData = await quizApi.getQuiz(parseInt(quizId));
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions?.length || 0).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Calculate progress
  const answeredCount = answers.filter(a => a !== null).length;
  const total = quiz?.questions?.length || 0;

  // Calculate results for display
  const topicScores = quiz?.questions?.reduce((acc, q) => {
    const topic = q.question_text.split(':')[0];
    const result = results.find(r => r.question_id === q.id);
    
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0 };
    }
    
    acc[topic].total++;
    if (result?.is_correct) {
      acc[topic].correct++;
    }
    
    return acc;
  }, {} as Record<string, { correct: number; total: number; }>) || {};

  const topicPercentages = Object.entries(topicScores).map(([topic, scores]) => ({
    label: topic,
    key: topic,
    percent: Math.round((scores.correct / scores.total) * 100)
  }));

  const lowTopics = topicPercentages.filter(t => t.percent < 70);

  // Handlers
  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers(a => a.map((v, i) => (i === qIdx ? optIdx : v)));
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.id) return;

    setFadeOut(true);
    try {
      const quizApi = new QuizAPI();
      const submitData = {
        answers: answers.map((answerIndex, questionIndex) => ({
          question_id: quiz.questions![questionIndex].id,
          user_answer: quiz.questions![questionIndex].options[answerIndex]
        }))
      };

      console.log('Submitting quiz with data:', submitData);
      const response = await quizApi.submitQuiz(quiz.id, submitData);
      console.log('Quiz submission response:', response);

      if (response && response.results) {
        setResults(response.results);
        setSubmitted(true);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit quiz. Please try again.');
      setSubmitted(false);
    } finally {
      setFadeOut(false);
    }
  };

  const handleRetake = () => {
    if (!quiz?.questions) return;
    setAnswers(new Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setFadeOut(false);
    setResults([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!quiz || !quiz.questions) {
    return <div className="min-h-screen flex items-center justify-center">Quiz not found</div>;
  }

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
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-blue-900 mb-2">{quiz.title}</h1>
          <div className="text-base text-gray-500 text-center mb-6">{quiz.description}</div>

        </div>
        {/* Quiz Questions or Results */}
        <div className="w-full max-w-2xl mx-auto flex-1 px-4 pb-16">
          {/* Questions Section */}
          {!submitted && (
            <div className={`space-y-6 transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {quiz.questions.map((q, qIdx) => (
                <div key={q.id} className="bg-white rounded-xl shadow p-6 md:p-8 flex flex-col gap-4">
                  <div className="text-lg font-semibold text-blue-900 mb-2">
                    {qIdx + 1}. {q.question_text}
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
                  onClick={() => {
                    console.log('Submit button clicked');
                    console.log('Quiz ID:', quiz?.id);
                    console.log('Answers:', answers);
                    handleSubmit();
                  }}
                  type="button"
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
                <div className="text-3xl font-bold text-green-600 mb-2">
                  You scored {results.filter(r => r.is_correct).length}/{total}
                </div>
              </div>

              {/* Question-by-Question Review */}
              <div className="space-y-6">
                {results.map((result, qIdx) => (
                  <div key={result.question_id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-3">
                    <div className={`text-base font-semibold ${result.is_correct ? 'text-green-700' : 'text-red-600'}`}>
                      Question {qIdx + 1} - {result.is_correct ? 'Correct' : 'Incorrect'}
                    </div>
                    <div className="text-gray-800 text-base">{result.question_text}</div>
                    
                    {/* Options List */}
                    <div className="space-y-2">
                      {result.options.map((option, optIdx) => (
                        <div 
                          key={optIdx} 
                          className={`px-4 py-2 rounded-lg ${
                            option === result.correct_answer 
                              ? 'bg-green-50 border border-green-200' 
                              : option === result.user_answer && option !== result.correct_answer
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {option === result.correct_answer && (
                              <span className="text-green-600">✓</span>
                            )}
                            {option === result.user_answer && option !== result.correct_answer && (
                              <span className="text-red-600">✗</span>
                            )}
                            <span className={`${
                              option === result.correct_answer 
                                ? 'text-green-700' 
                                : option === result.user_answer && option !== result.correct_answer
                                ? 'text-red-700'
                                : 'text-gray-700'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              {/* Retake Quiz Button */}
              <div className="flex justify-center pt-4">
                <button
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition-all duration-200 hover:scale-105"
                  onClick={handleRetake}
                  type="button"
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