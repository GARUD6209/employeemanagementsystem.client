export default class Announcement {
    constructor() {
        this.announcementId = 0;
        this.title = '';
        this.content = '';
        this.createdAt = new Date();
        this.createdBy = '';
    }

    toJson() {
        return {
            announcementId: this.announcementId,
            title: this.title,
            content: this.content,
            createdAt: this.createdAt.toISOString(),
            createdBy: this.createdBy
        };
    }

    static fromJson(json) {
        const announcement = new Announcement();
        announcement.announcementId = json.announcementId;
        announcement.title = json.title;
        announcement.content = json.content;
        announcement.createdAt = new Date(json.createdAt);
        announcement.createdBy = json.createdBy;
        return announcement;
    }
}
