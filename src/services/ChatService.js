export class ChatService {
    constructor() {
        this.apiPrefix = '/api/Chat';
    }

    async getChatRooms() {
        const response = await fetch(`${this.apiPrefix}/rooms`);
        return await response.json();
    }

    async createChatRoom(name) {
        const response = await fetch(`${this.apiPrefix}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(name)
        });
        return await response.json();
    }

    async getChatMessages(roomId) {
        const response = await fetch(`${this.apiPrefix}/rooms/${roomId}/messages`);
        return await response.json();
    }

    async sendMessage(roomId, message) {
        const response = await fetch(`${this.apiPrefix}/rooms/${roomId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
        return await response.json();
    }
}
