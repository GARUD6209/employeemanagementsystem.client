import { BaseApiService } from './BaseApiService';
import Announcement from '../models/announcement.model';

export class AnnouncementService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/Announcement';
    }

    async getAllAnnouncements() {
        const data = await this.get(this.apiPrefix);
        return data.map(ann => Announcement.fromJson(ann));
    }

    async getAnnouncementById(id) {
        const data = await this.get(`${this.apiPrefix}/${id}`);
        return Announcement.fromJson(data);
    }

    async createAnnouncement(announcement) {
        const data = await this.post(this.apiPrefix, announcement);
        return Announcement.fromJson(data);
    }

    async updateAnnouncement(id, announcement) {
        const formattedAnnouncement = {
            announcementId: id,
            title: announcement.title,
            content: announcement.content,
            createdAt: announcement.createdAt || new Date().toISOString(),
            createdBy: announcement.createdBy || localStorage.getItem("userId")
        };

        const data = await this.put(`${this.apiPrefix}/${id}`, formattedAnnouncement);
        return Announcement.fromJson(data);
    }

    async deleteAnnouncement(id) {
        return await this.delete(`${this.apiPrefix}/${id}`);
    }
}
