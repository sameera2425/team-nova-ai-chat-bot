// api end

import { RAGStreamRequest, RAGStreamChunk, RAGStreamMetadata, RAGStreamError, RAGStreamConfig } from "@/types/api";
import { BaseAPIClient } from "./base";

/**
 * Streaming RAG Answer API endpoint
 * Provides real-time streaming responses using RAG with memory extraction and goal tracking
 */
export class RAGStreamAPI extends BaseAPIClient {
    constructor(baseUrl: string = '/api') {
        super(baseUrl);
    }

    /**
     * Stream RAG response for a given session and query
     */
    async streamRAGResponse(
        sessionId: string,
        request: RAGStreamRequest,
        config: RAGStreamConfig
    ): Promise<void> {
        const endpoint = `/session/${sessionId}/rag/stream/`;

        try {
            const response = await this.stream(endpoint, request);

            if (!response.body) {
                throw new Error('Response body is null');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data: RAGStreamChunk = JSON.parse(line.slice(6));

                            if (data.error) {
                                config.onError?.(data.error);
                                return;
                            }

                            if (data.done) {
                                if (data.metadata) {
                                    config.onComplete?.(data.metadata);
                                }
                                return;
                            } else {
                                config.onChunk?.(data.chunk);
                            }
                        } catch (parseError) {
                            console.error('Failed to parse SSE data:', parseError);
                        }
                    }
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            config.onError?.(errorMessage);
        }
    }

    /**
     * Alternative method using EventSource (if supported by your backend)
     */
    streamRAGResponseWithEventSource(
        sessionId: string,
        request: RAGStreamRequest,
        config: RAGStreamConfig
    ): EventSource {
        const url = `${this.baseUrl}/session/${sessionId}/rag/stream/`;

        // Create EventSource with POST method (requires custom implementation)
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            try {
                const data: RAGStreamChunk = JSON.parse(event.data);

                if (data.error) {
                    config.onError?.(data.error);
                    eventSource.close();
                    return;
                }

                if (data.done) {
                    if (data.metadata) {
                        config.onComplete?.(data.metadata);
                    }
                    eventSource.close();
                    return;
                } else {
                    config.onChunk?.(data.chunk);
                }
            } catch (parseError) {
                console.error('Failed to parse SSE data:', parseError);
                config.onError?.('Failed to parse response data');
            }
        };

        eventSource.onerror = (error) => {
            config.onError?.('EventSource error occurred');
            eventSource.close();
        };

        return eventSource;
    }
}

/**
 * Convenience function for streaming RAG responses
 */
export async function streamRAGResponse(
    sessionId: string,
    query: string,
    callbacks: {
        onChunk?: (chunk: string) => void;
        onComplete?: (metadata: RAGStreamMetadata) => void;
        onError?: (error: string) => void;
    }
): Promise<void> {
    const api = new RAGStreamAPI();
    const request: RAGStreamRequest = { query };
    const config: RAGStreamConfig = { sessionId, ...callbacks };

    return api.streamRAGResponse(sessionId, request, config);
}

/**
 * Hook-friendly streaming function that returns a promise
 */
export function useRAGStream() {
    return {
        stream: async (
            sessionId: string,
            query: string,
            callbacks: {
                onChunk?: (chunk: string) => void;
                onComplete?: (metadata: RAGStreamMetadata) => void;
                onError?: (error: string) => void;
            }
        ) => {
            return streamRAGResponse(sessionId, query, callbacks);
        }
    };
}

