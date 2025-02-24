import { BaseApiService } from './BaseApiService';

export class ChatService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/Chat';
    }

    async getChatRooms() {
        return await this.get(`${this.apiPrefix}/rooms`);
    }

    async createChatRoom(name) {
        return await this.post(`${this.apiPrefix}/rooms`, name);
    }

    async getChatMessages(roomId) {
        return await this.get(`${this.apiPrefix}/rooms/${roomId}/messages`);
    }

    async sendMessage(roomId, message) {
        return await this.post(`${this.apiPrefix}/rooms/${roomId}/messages`, message);
    }
}
