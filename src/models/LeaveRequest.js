export class LeaveRequest {
    constructor(data = {}) {
        this.leaveId = data.leaveId || 0;
        this.userId = data.userId || '';
        this.leaveType = data.leaveType || '';
        this.startDate = data.startDate ? new Date(data.startDate) : new Date();
        this.endDate = data.endDate ? new Date(data.endDate) : new Date();
        this.status = data.status || 'PENDING';
    }
}
