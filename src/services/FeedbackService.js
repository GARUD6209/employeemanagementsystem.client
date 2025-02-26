import { BaseApiService } from './BaseApiService';
import Feedback from '../models/feedback.model';

export class FeedbackService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/Feedback';
    }

    async getAllFeedbacks() {
        const data = await this.get(this.apiPrefix);
        return data.map(feedback => Feedback.fromJson(feedback));
    }

    async getFeedbackById(id) {
        const data = await this.get(`${this.apiPrefix}/${id}`);
        return Feedback.fromJson(data);
    }

    async createFeedback(feedback) {
        try {
            const data = await this.post(this.apiPrefix, {
                feedbackId: feedback.feedbackId,
                title: feedback.title,
                content: feedback.content,
                createdAt: feedback.createdAt,
                employeeId: Number(feedback.employeeId)
            });
            return Feedback.fromJson(data);
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    }

    
}
