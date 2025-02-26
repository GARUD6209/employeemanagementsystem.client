import { BaseApiService } from './BaseApiService';

export class LeaveRequestService extends BaseApiService {
    async getAllLeaveRequests() {
        return await this.get('/api/LeaveRequest');
    }

    async getUserLeaveRequests(userId) {
        return await this.get(`/api/LeaveRequest/user/${userId}`);
    }

    async createLeaveRequest(leaveRequest) {
        return await this.post('/api/LeaveRequest', leaveRequest);
    }

    async updateLeaveStatus(leaveId, status) {
        return await this.put(`/api/LeaveRequest/${leaveId}/status`, JSON.stringify(status));
    }
}

export const leaveRequestService = new LeaveRequestService();
