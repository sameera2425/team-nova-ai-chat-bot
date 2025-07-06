import { GoalsListResponse, GlobalMemoryResponse, ChatHistoryResponse, SessionsListResponse, PDFUploadResponse, GenerateQuizResponse, QuizzesListResponse, Quiz, QuizSubmissionResponse } from '@/types/api';

/**
 * Base HTTP client class for making API requests
 */
export class BaseAPIClient {
    protected baseUrl: string;
    protected defaultHeaders: Record<string, string>;

    constructor(baseUrl: string = '/api', defaultHeaders: Record<string, string> = {}) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...defaultHeaders
        };
    }

    /**
     * Get CSRF token from cookies
     */
    protected getCSRFToken(): string | null {
        const name = 'csrftoken';
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    /**
     * Fetch CSRF token from server if not in cookies
     */
    private async fetchCSRFToken(): Promise<string | null> {
        try {
            const response = await fetch(`${this.baseUrl}/csrf/`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.csrfToken || null;
            }
        } catch (error) {
            console.warn('Failed to fetch CSRF token:', error);
        }
        return null;
    }

    /**
     * Get headers with CSRF token for state-changing requests
     */
    private async getHeadersWithCSRF(headers: Record<string, string> = {}): Promise<Record<string, string>> {
        let csrfToken = this.getCSRFToken();
        
        // If no CSRF token in cookies, try to fetch it
        if (!csrfToken) {
            csrfToken = await this.fetchCSRFToken();
        }
        
        return {
            ...this.defaultHeaders,
            ...(csrfToken && { 'X-CSRFToken': csrfToken }),
            ...headers
        };
    }

    /**
     * Make a GET request
     */
    async get<T = any>(
        endpoint: string, 
        headers: Record<string, string> = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                ...this.defaultHeaders,
                ...headers
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Make a POST request
     */
    async post<T = any>(
        endpoint: string, 
        data: any = null, 
        headers: Record<string, string> = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: await this.getHeadersWithCSRF(headers),
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Make a PUT request
     */
    async put<T = any>(
        endpoint: string, 
        data: any = null, 
        headers: Record<string, string> = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: await this.getHeadersWithCSRF(headers),
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Make a DELETE request
     */
    async delete<T = any>(
        endpoint: string, 
        headers: Record<string, string> = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: await this.getHeadersWithCSRF(headers)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Make a PATCH request
     */
    async patch<T = any>(
        endpoint: string, 
        data: any = null, 
        headers: Record<string, string> = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            credentials: 'include',
            headers: await this.getHeadersWithCSRF(headers),
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    /**
     * Make a streaming request that returns a Response object
     */
    async stream(
        endpoint: string, 
        data: any = null, 
        headers: Record<string, string> = {}
    ): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: await this.getHeadersWithCSRF(headers),
            body: data ? JSON.stringify(data) : null
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    }
}

/**
 * Goals and Memory API client
 */
export class GoalsMemoryAPI extends BaseAPIClient {
    constructor(baseUrl: string = '/api') {
        super(baseUrl);
    }

    /**
     * Get list of all goals
     */
    async getGoals(): Promise<GoalsListResponse> {
        return this.get<GoalsListResponse>('/goals/');
    }

    /**
     * Get global memory preferences
     */
    async getGlobalMemory(): Promise<GlobalMemoryResponse> {
        return this.get<GlobalMemoryResponse>('/memory/');
    }
}

/**
 * Chat History API client
 */
export class ChatHistoryAPI extends BaseAPIClient {
    constructor(baseUrl: string = '/api') {
        super(baseUrl);
    }

    /**
     * Get chat history for a specific session
     */
    async getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
        return this.get<ChatHistoryResponse>(`/session/${sessionId}/memory/`);
    }
}

/**
 * Convenience function for getting chat history
 */
export async function getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
    const api = new ChatHistoryAPI();
    return api.getChatHistory(sessionId);
}

/**
 * Hook-friendly chat history function
 */
export function useChatHistory() {
    return {
        getHistory: async (sessionId: string) => {
            return getChatHistory(sessionId);
        }
    };
}

/**
 * Sessions API client
 */
export class SessionsAPI extends BaseAPIClient {
    constructor(baseUrl: string = '/api') {
        super(baseUrl);
    }

    /**
     * Get list of all chat sessions
     */
    async getSessions(): Promise<SessionsListResponse> {
        return this.get<SessionsListResponse>('/sessions/');
    }

    /**
     * Upload PDF for a specific session
     */
    async uploadPDF(sessionId: string, file: File): Promise<PDFUploadResponse> {
        const formData = new FormData();
        formData.append('pdf', file);
        
        const url = `${this.baseUrl}/session/${sessionId}/upload/`;
        
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                // Don't set Content-Type for FormData, let browser set it with boundary
                'X-CSRFToken': this.getCSRFToken() || ''
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
}

/**
 * Convenience function for getting sessions list
 */
export async function getSessions(): Promise<SessionsListResponse> {
    const api = new SessionsAPI();
    return api.getSessions();
}

/**
 * Hook-friendly sessions function
 */
export function useSessions() {
    return {
        getSessions: async () => {
            return getSessions();
        }
    };
}

/**
 * Quiz API client
 */
export class QuizAPI extends BaseAPIClient {
    constructor(baseUrl: string = '/api') {
        super(baseUrl);
    }

    /**
     * Generate a quiz from a specific message
     */
    async generateQuiz(messageId: number): Promise<GenerateQuizResponse> {
        return this.post<GenerateQuizResponse>(`/message/${messageId}/generate-quiz/`);
    }

    /**
     * Get list of all quizzes
     */
    async getQuizzes(page: number = 1): Promise<QuizzesListResponse> {
        return this.get<QuizzesListResponse>(`/quiz/?page=${page}`);
    }

    /**
     * Get a specific quiz by ID
     */
    async getQuiz(quizId: number): Promise<Quiz> {
        return this.get<Quiz>(`/quiz/${quizId}/`);
    }

    async submitQuiz(quizId: number, data: { answers: { question_id: number; user_answer: string }[] }): Promise<QuizSubmissionResponse> {
        const response = await this.post<QuizSubmissionResponse>(`/quiz/${quizId}/submit/`, data);

        if (!response || !response.results) {
            throw new Error('Invalid response format from server');
        }

        return response;
    }
}

/**
 * Convenience function for getting quizzes list
 */
export async function getQuizzes(page: number = 1): Promise<QuizzesListResponse> {
    const api = new QuizAPI();
    return api.getQuizzes(page);
}

/**
 * Convenience function for generating a quiz
 */
export async function generateQuiz(messageId: number): Promise<GenerateQuizResponse> {
    const api = new QuizAPI();
    return api.generateQuiz(messageId);
}

/**
 * Convenience function for getting a specific quiz
 */
export async function getQuiz(quizId: number): Promise<Quiz> {
    const api = new QuizAPI();
    return api.getQuiz(quizId);
}
