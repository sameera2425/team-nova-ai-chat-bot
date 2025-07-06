// Streaming RAG Answer API Types

export interface RAGStreamRequest {
    query: string;
}

export interface Goal {
    id: number;
    title: string;
    description: string;
    deadline: string; // ISO 8601 format
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_at?: string;
}

export interface GoalsListResponse {
    goals: Goal[];
    total_count: number;
}

export interface GlobalMemoryResponse {
    preferences: string;
}

// Quiz-related types
export interface QuizQuestion {
    id: number;
    question_text: string;
    options: string[];
    correct_answer: string;
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    session_id?: number;
    created_at?: string;
    question_count?: number;
    linked_message_id?: number;
    questions?: QuizQuestion[];
}

export interface GenerateQuizResponse {
    message: string;
    quiz_id: number;
    title: string;
    description: string;
    questions: QuizQuestion[];
}

export interface QuizzesListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Quiz[];
}

export interface ChatMessage {
    id?: number;
    message: string;
    is_user: boolean;
    created_at: string;
    quiz?: Quiz | null;
}

export interface ChatHistoryResponse {
    messages: ChatMessage[];
    pdf_uploaded: boolean;
}

export interface ChatSession {
    id: number;
    created_at: string;
}

export interface SessionsListResponse {
    sessions: ChatSession[];
}

export interface PDFUploadResponse {
    message: string;
}

export interface RAGStreamMetadata {
    goals_created: Goal[];
    memory_saved: boolean;
    memory_content?: string;
    new_message_id?: number;
}

export interface RAGStreamChunk {
    chunk: string;
    done: boolean;
    metadata?: RAGStreamMetadata;
    error?: string;
}

// Session types for context
export interface Session {
    id: string;
    created_at: string;
    updated_at: string;
}

// Error response type
export interface RAGStreamError {
    chunk: string;
    done: true;
    error: string;
}

// Event Source configuration type
export interface RAGStreamConfig {
    sessionId: string;
    onChunk?: (chunk: string) => void;
    onComplete?: (metadata: RAGStreamMetadata) => void;
    onError?: (error: string) => void;
}
