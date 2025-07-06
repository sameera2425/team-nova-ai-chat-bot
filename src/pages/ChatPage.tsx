import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Home, FileText, PenTool, Send, Plus, PlayCircle, User, Bot, Target, MessageSquare, Trash2, CheckCircle, Clock, AlertCircle, Brain, Calendar, Upload, FileText as FileTextIcon, HelpCircle, BookOpen, Video, Map as MapIcon, Clipboard as ClipboardIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRAGStream } from '@/lib/stream';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Goal, RAGStreamMetadata, ChatMessage, ChatSession, Quiz } from '@/types/api';
import { useChatHistory, useSessions, SessionsAPI, generateQuiz } from '@/lib/base';

const tags = ["Generate Notes", "AI-Video", "Mind-Maps"];

const ChatPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [flowchartFullscreen, setFlowchartFullscreen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recentMemory, setRecentMemory] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null);
  const [quizGenerating, setQuizGenerating] = useState<number | null>(null);
  const [quizProgress, setQuizProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const profileAvatar = 'https://api.dicebear.com/7.x/thumbs/svg?seed=Jane';
  const [fadeStates, setFadeStates] = useState({});
  const messageRefs = useRef({});
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const { stream } = useRAGStream();
  const { getHistory } = useChatHistory();
  const { getSessions } = useSessions();

  // Ref to track if sessions have been loaded
  const sessionsLoadedRef = useRef(false);

  // Previous chats logic
  const [previousChats, setPreviousChats] = useState(() => {
    const stored = localStorage.getItem('previousChats');
    return stored ? JSON.parse(stored) : [];
  });

  // Load chat history when sessionId is provided
  useEffect(() => {
    const loadChatHistory = async () => {
      if (sessionId) {
        try {
          const history = await getHistory(sessionId);
          
          // Convert chat history to message format
          const historyMessages = history.messages.map((msg: ChatMessage) => ({
            id: msg.id || Date.now() + Math.random(), // Use message ID from API or generate unique ID
            sender: msg.is_user ? 'user' : 'ai',
            text: msg.message,
            streaming: false,
            metadata: null,
            timestamp: msg.created_at,
            quiz: msg.quiz // Include quiz data from API
          }));
          
          setMessages(historyMessages);
          
          // Scroll to bottom after loading chat history
          setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } catch (error) {
          console.error('Failed to load chat history:', error);
          // Continue with empty messages if history loading fails
        }
      }
    };

    loadChatHistory();
  }, [sessionId]); // Only depend on sessionId

  // Load sessions list (only once)
  useEffect(() => {
    const loadSessions = async () => {
      if (sessionsLoadedRef.current) return; // Prevent multiple loads
      
              try {
          setSessionsLoading(true);
          const response = await getSessions();
          // Sort sessions in reverse order (newest first)
          const sortedSessions = response.sessions.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setSessions(sortedSessions);
          sessionsLoadedRef.current = true;
        } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setSessionsLoading(false);
      }
    };

    loadSessions();
  }, []); // Empty dependency array - only run once

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Happy late night";
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMessage = { id: Date.now(), sender: 'user', text: input };
    const aiMessageId = Date.now() + 1;
    const aiMessage = { id: aiMessageId, sender: 'ai', text: '', streaming: true, metadata: null };
    
    setMessages(prev => [...prev, userMessage, aiMessage]);
    
    // Trigger flowchart sidebar if message contains 'flowchart'
    if (/flowchart/i.test(input)) {
      setShowFlowchart(true);
    }
    
    const currentInput = input;
    setInput('');
    setIsStreaming(true);

    try {
      let streamedContent = '';
      
      await stream(sessionId, currentInput, {
        onChunk: (chunk) => {
          streamedContent += chunk;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: streamedContent }
                : msg
            )
          );
        },
        onComplete: (metadata) => {
          // Update the AI message with the new message ID from metadata
          const newMessageId = metadata?.new_message_id;
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    id: newMessageId || msg.id, // Use new message ID if available
                    streaming: false, 
                    metadata,
                    showQuizOption: true // Show quiz option for new messages
                  }
                : msg
            )
          );
          setIsStreaming(false);
          
          // Handle metadata (goals, memory, etc.)
          if (metadata?.goals_created?.length > 0) {
            console.log('Goals created:', metadata.goals_created);
            setGoals(prev => [...prev, ...metadata.goals_created]);
          }
          if (metadata?.memory_saved && metadata?.memory_content) {
            console.log('Memory saved:', metadata.memory_content);
            setRecentMemory(metadata.memory_content);
          }
        },
        onError: (error) => {
          console.error('Streaming error:', error);
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, text: `Error: ${error}`, streaming: false }
                : msg
            )
          );
          setIsStreaming(false);
        }
      });
    } catch (error) {
      console.error('Failed to start streaming:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, text: 'Failed to get response. Please try again.', streaming: false }
            : msg
        )
      );
      setIsStreaming(false);
    }
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

  const handleOpenChat = (chat) => {
    // For demo: just set input to chat text (replace with real chat loading logic)
    setInput(chat.text);
  };
  const handleDeleteChat = (id) => {
    setPreviousChats(previousChats.filter(c => c.id !== id));
  };

  const handleOpenSession = (sessionId: number) => {
    navigate(`/chat?sessionId=${sessionId}`);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sessionId) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    try {
      setPdfUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const sessionsAPI = new SessionsAPI();
      await sessionsAPI.uploadPDF(sessionId, file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedPdf(file.name);
      
      // Reset progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(0);
        setPdfUploading(false);
      }, 2000);
      
    } catch (error) {
      console.error('PDF upload failed:', error);
      alert('Failed to upload PDF. Please try again.');
      setPdfUploading(false);
      setUploadProgress(0);
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  function MarkdownViewer({ text }: { text: string }) {
    if (!text) return null;
    return (
      <div className="markdown-content">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  }

  const MetadataDisplay = ({ metadata }: { metadata: RAGStreamMetadata | null }) => {
    if (!metadata) return null;

    const hasGoals = metadata.goals_created && metadata.goals_created.length > 0;
    const hasMemory = metadata.memory_saved && metadata.memory_content;

    if (!hasGoals && !hasMemory) return null;

    return (
      <div className="mt-4 space-y-3">
        {hasGoals && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Goals Created</span>
              <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                {metadata.goals_created.length} new
              </span>
            </div>
            <div className="space-y-2">
              {metadata.goals_created.map((goal) => (
                <div key={goal.id} className="bg-white rounded-md p-3 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {goal.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {goal.status === 'in_progress' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {goal.status === 'pending' && <AlertCircle className="w-4 h-4 text-gray-400" />}
                      {goal.status === 'cancelled' && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{goal.title}</h4>
                      <p className="text-gray-600 text-xs mt-1">{goal.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
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
          </div>
        )}
        
        {hasMemory && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Memory Updated</span>
              <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">
                New insight saved
              </span>
            </div>
            <div className="bg-white rounded-md p-3 border border-blue-100">
              <p className="text-gray-700 text-sm">{metadata.memory_content}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleGenerateQuiz = async (messageId: number) => {
    if (quizGenerating) return;
    
    try {
      setQuizGenerating(messageId);
      setQuizProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setQuizProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await generateQuiz(messageId);
      
      clearInterval(progressInterval);
      setQuizProgress(100);
      
      // Update the message with the generated quiz
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { 
                ...msg, 
                quiz: {
                  id: response.quiz_id,
                  title: response.title,
                  description: response.description,
                  questions: response.questions
                }
              }
            : msg
        )
      );
      
      // Reset progress after 2 seconds
      setTimeout(() => {
        setQuizProgress(0);
        setQuizGenerating(null);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('Failed to generate quiz. Please try again.');
      setQuizGenerating(null);
      setQuizProgress(0);
    }
  };

  const handleTakeQuiz = (quizId: number) => {
    navigate(`/quiz/${quizId}`);
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
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200"
            />
          </div>
        )}
        {/* New Chat & Set Goals */}
        {sidebarContentVisible && (
          <>
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
          </>
        )}
        {/* Other Navigation */}

        {/* Sessions Section */}
        {sidebarContentVisible && (
          <div className="mt-2">
            <div className="text-xs font-semibold text-blue-800 mb-2 px-2">Chat Sessions</div>
            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
              {sessionsLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-xs text-gray-400 px-2">No chat sessions</div>
              ) : (
                sessions.map(session => (
                  <div 
                    key={session.id} 
                    className={`flex items-center group px-2 py-2 rounded hover:bg-blue-100 cursor-pointer transition-colors ${
                      sessionId === session.id.toString() ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleOpenSession(session.id)}
                  >
                    <Calendar className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-blue-900 font-medium truncate">
                        Session #{session.id}
                      </div>
                      <div className="text-xs text-blue-600 truncate">
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
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
        <div className="bg-white w-full z-20 sticky top-0 left-0 border-b border-blue-100 px-6 py-2 flex items-center justify-between">
          <p className="text-lg text-gray-600 animate-fade-in">
            {getGreeting()}, Teen!
          </p>
          <button onClick={() => navigate('/profile')} className="ml-4 flex items-center gap-2 bg-white border border-blue-100 rounded-full px-2 py-1 shadow-sm hover:shadow-md transition-all duration-200">
            <img src={profileAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          </button>
        </div>
        {/* Chat Thread */}
        {!flowchartFullscreen && (
          <div className="flex-1 flex flex-col w-full gap-10 pb-40 pt-6 px-8 relative chat-container overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
              // Show feature cards when no messages
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
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 w-full max-w-6xl">
                  {[
                    {
                      title: "AI-Videos",
                      icon: "Video",
                      description: "Unique generated educational videos tailored to learning needs every time."
                    },
                    {
                      title: "Mindmaps",
                      icon: "Map",
                      description: "Visual learning maps that simplify complex topics. Visual learning."
                    },
                    {
                      title: "Smart Time-Table",
                      icon: "Calendar",
                      description: "Unique generated educational videos tailored to your learning."
                    },
                    {
                      title: "Instant Quizzes",
                      icon: "Clipboard",
                      description: "Unique videos tailored to your learning needs every time."
                    }
                  ].map((feature, index) => (
                    <div
                      key={feature.title}
                      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                        {feature.icon === "Video" && <Video className="w-4 h-4 text-gray-600" />}
                        {feature.icon === "Map" && <MapIcon className="w-4 h-4 text-gray-600" />}
                        {feature.icon === "Calendar" && <Calendar className="w-4 h-4 text-gray-600" />}
                        {feature.icon === "Clipboard" && <ClipboardIcon className="w-4 h-4 text-gray-600" />}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
              msg.sender === 'ai' ? (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 transition-opacity duration-500 ${fadeStates[msg.id] ? 'opacity-40' : 'opacity-100'}`}
                  ref={el => (messageRefs.current[msg.id] = el)}
                  data-id={msg.id}
                >
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
                    <div className="text-base text-gray-800 mb-3">
                      <div className="prose prose-gray max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:p-3 prose-pre:rounded-lg">
                        <MarkdownViewer text={msg.text} />
                      </div>
                      {msg.streaming && (
                        <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse"></span>
                      )}
                    </div>
                    <MetadataDisplay metadata={msg.metadata} />
                    
                    {/* Quiz Section */}
                    {(msg.quiz || msg.showQuizOption || (msg.sender === 'ai' && !msg.quiz && msg.text.length > 200)) && (
                      <div className="mt-4">
                        {msg.quiz ? (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-800">Quiz Available</span>
                            </div>
                            <div className="bg-white rounded-md p-3 border border-blue-100 mb-3">
                              <h4 className="font-medium text-gray-900 text-sm mb-1">{msg.quiz.title}</h4>
                              <p className="text-gray-600 text-xs">{msg.quiz.description}</p>
                            </div>
                            <button
                              onClick={() => handleTakeQuiz(msg.quiz.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              <HelpCircle className="w-4 h-4" />
                              Take Quiz
                            </button>
                          </div>
                        ) : (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700">Test your knowledge</span>
                              </div>
                              {quizGenerating === msg.id ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-xs text-blue-600">Generating quiz...</span>
                                  <div className="w-16 bg-blue-200 rounded-full h-1">
                                    <div 
                                      className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                                      style={{ width: `${quizProgress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleGenerateQuiz(msg.id)}
                                  disabled={quizGenerating !== null}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    quizGenerating !== null
                                      ? 'bg-blue-200 text-blue-400 cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                                >
                                  Generate Quiz
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
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
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 justify-end transition-opacity duration-500 ${fadeStates[msg.id] ? 'opacity-40' : 'opacity-100'}`}
                  ref={el => (messageRefs.current[msg.id] = el)}
                  data-id={msg.id}
                >
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
            ))
            )}
            <div ref={chatEndRef} />
            {/* Fade-out gradient at the bottom of chat area */}
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-40 z-30" style={{background: 'linear-gradient(to top, rgba(249,250,251,0.98) 60%, transparent 100%)'}} />
            </div>
          </div>
        )}
        {/* Prompt Box - Fixed at bottom */}
        <div
          className="fixed z-40 bg-gray-50 transition-all duration-300"
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

                    {sessionId && (
                      <button 
                        className={`p-2 rounded-lg transition-colors duration-200 ${
    
                            'bg-gray-100 text-gray-600 hover:bg-blue-200'
                        }`} 
                        disabled={isStreaming || pdfUploading}
                        onClick={triggerFileUpload}
                        aria-label="Upload PDF"
                      >
                        <Upload className="w-5 h-5" />
                      </button>
                    )}
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !isStreaming && !pdfUploading && handleSend()}
                      placeholder={
                        isStreaming ? "AI is responding..." : 
                        pdfUploading ? "Uploading PDF..." :
                        "Ask me anything — videos, quizzes, mindmaps or your doubts!"
                      }
                      disabled={isStreaming || pdfUploading}
                      className={`flex-1 text-lg placeholder-gray-400 focus:outline-none bg-transparent ${(isStreaming || pdfUploading) ? 'opacity-50' : ''}`}
                    />
                    <button 
                      className={`p-3 rounded-lg transition-colors duration-200 ${
                        isStreaming || pdfUploading
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`} 
                      onClick={handleSend} 
                      disabled={isStreaming || pdfUploading}
                      aria-label="Send"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* PDF Upload Progress */}
                  {pdfUploading && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileTextIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">Uploading PDF...</span>
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Uploaded PDF Indicator */}
                  {uploadedPdf && !pdfUploading && (
                    <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                      <FileTextIcon className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">PDF uploaded: {uploadedPdf}</span>
                    </div>
                  )}
                  

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
      
      {/* Hidden file input for PDF upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />
    </div>
  );
};

const NavItem = ({ icon: Icon, text, active = false, mini = false, onClick }) => (
  <button
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-scale ${
      active
        ? 'bg-blue-200 text-blue-900 font-medium'
        : 'text-blue-700 hover:bg-blue-100'
    }`}
    aria-label={text}
    onClick={onClick}
    type="button"
  >
    <Icon className="w-5 h-5" />
    {!mini && <span>{text}</span>}
  </button>
);

export default ChatPage; 