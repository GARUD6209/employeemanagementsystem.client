import axios from 'axios';

export class BaseApiService {
    constructor(baseURL = 'https://localhost:7216') {
        this.api = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true,  // Add this to include cookies
        });
    }

    async get(url) {
        try {
            const response = await this.api.get(url);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please ensure you are logged in.');
            }
            throw error;
        }
    }

    async post(url, data) {
        const response = await this.api.post(url, data);
        return response.data;
    }

    async put(url, data) {
        const response = await this.api.put(url, data);
        return response.data;
    }

    async delete(url) {
        const response = await this.api.delete(url);
        return response.data;
    }
}
