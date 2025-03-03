import Attendance from '../models/Attendance.model';
import { BaseApiService } from './BaseApiService';

export class AttendanceService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/Attendance';
    }

    async createAttendance(attendance) {
        const data = await this.post(this.apiPrefix, attendance);
        return Attendance.fromJson(data);
    }

    async getAttendanceByEmployeeId(employeeId) {
        try {
            const response = await this.get(`${this.apiPrefix}/employee/${employeeId}`);
            console.log('Raw API response:', response); // Debug log

            // Handle different response structures
            let attendanceData;
            if (response?.data) {
                attendanceData = response.data;
            } else if (Array.isArray(response)) {
                attendanceData = response;
            } else if (response) {
                attendanceData = [response];
            } else {
                throw new Error('Invalid response format');
            }

            // Ensure we have an array
            const dataArray = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
            
            // Map to Attendance model
            return dataArray.map(att => Attendance.fromJson(att));
        } catch (error) {
            console.error('Detailed error:', error);
            throw new Error(`Failed to fetch attendance: ${error.message}`);
        }
    }

    async getAttendanceByDay(day) {
        const data = await this.get(`${this.apiPrefix}/day/${day}`);
        return data.map(att => Attendance.fromJson(att));
    }

    async updateCheckOutStatus(id, checkOut) {
        const data = await this.put(`${this.apiPrefix}/${id}/checkout`, checkOut);
        return Attendance.fromJson(data);
    }

    async getTodayAttendance(employeeId) {
        const data = await this.getAttendanceByEmployeeId(employeeId);
        const today = new Date().toDateString();
        return data.find(att => new Date(att.checkIn).toDateString() === today);
    }
}

export default AttendanceService;
