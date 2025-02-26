class Feedback {
    constructor(feedbackId = 0, title, content, createdAt, employeeId) {
        this.feedbackId = feedbackId;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt || new Date().toISOString();
        this.employeeId = employeeId;
    }

    static fromJson(json) {
        return new Feedback(
            json.feedbackId,
            json.title,
            json.content,
            json.createdAt,
            json.employeeId
        );
    }
}

export default Feedback;
