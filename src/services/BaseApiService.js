import axios from 'axios';

export class BaseApiService {
    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized access. Please ensure you are logged in.');
                } else if (error.response?.status === 403) {
                    throw new Error('Forbidden access. Please ensure you have proper permissions.');
                }
                throw error;
            }
        );
    }

    async get(url) {
        try {
            const response = await this.api.get(url);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please ensure you are logged in.');
            } else if (error.response?.status === 403) {
                throw new Error('Forbidden access. Please ensure you are logged in.');
            }
            throw error;
        }

    }

    async post(url, data) {
        try{
        const response = await this.api.post(url, data);
        return response.data; } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please ensure you are logged in.');
            } else if (error.response?.status === 403) {
                throw new Error('Forbidden access. Please ensure you are logged in.');
            }
            throw error;
        }
    }

    async put(url, data) {
        try{
            const response = await this.api.put(url, data);
            return response.data; } catch (error) {
                if (error.response?.status === 401) {
                    throw new Error('Unauthorized access. Please ensure you are logged in.');
                } else if (error.response?.status === 403) {
                    throw new Error('Forbidden access. Please ensure you are logged in.');
                }
                throw error;
            }
    }

    async delete(url) {
        try{
        const response = await this.api.delete(url);
        return response.data;} catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please ensure you are logged in.');
            } else if (error.response?.status === 403) {
                throw new Error('Forbidden access. Please ensure you are logged in.');
            }
            throw error;
        }
    }

    async postFormData(url, formData) {
        try {
            const response = await this.api.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please ensure you are logged in.');
            } else if (error.response?.status === 403) {
                throw new Error('Forbidden access. Please ensure you are logged in.');
            }
            throw error;
        }
    }

    async putFormData(url, formData) {
        try {
            const response = await this.api.put(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please ensure you are logged in.');
            } else if (error.response?.status === 403) {
                throw new Error('Forbidden access. Please ensure you are logged in.');
            }
            throw error;
        }
    }
}
