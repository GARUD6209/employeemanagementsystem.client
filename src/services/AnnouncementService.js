import Announcement from '../models/announcement.model';

export class AnnouncementService {
    constructor() {
        this.apiPrefix = '/api/Announcement';
    }

    async getAllAnnouncements() {
        const response = await fetch(this.apiPrefix);
        const data = await response.json();
        return data.map(ann => Announcement.fromJson(ann));
    }

    async getAnnouncementById(id) {
        const response = await fetch(`${this.apiPrefix}/${id}`);
        const data = await response.json();
        return Announcement.fromJson(data);
    }

    async createAnnouncement(announcement) {
        const response = await fetch(this.apiPrefix, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(announcement)
        });
        const data = await response.json();
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

        const response = await fetch(`${this.apiPrefix}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedAnnouncement)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to update announcement');
        }

        const data = await response.json();
        return Announcement.fromJson(data);
    }

    async deleteAnnouncement(id) {
        await fetch(`${this.apiPrefix}/${id}`, { method: 'DELETE' });
    }
}
