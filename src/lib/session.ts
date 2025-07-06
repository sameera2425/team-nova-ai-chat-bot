import { CreateSessionRequest, CreateSessionResponse } from "@/types/session";
import { BaseAPIClient } from "./base";

/**
 * Session management API client
 */
export class SessionAPI extends BaseAPIClient {
    constructor(baseUrl: string = '/api') {
        super(baseUrl);
    }

    /**
     * Creates a new chat session
     * @returns The ID of the newly created session
     */
    async createSession(): Promise<number> {
        const endpoint = '/session/create/';
        const request: CreateSessionRequest = {};

        const data: CreateSessionResponse = await this.post(endpoint, request);
        return data.session_id;
    }
}

