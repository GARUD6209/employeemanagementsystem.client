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
        const data = await this.get(`${this.apiPrefix}/employee/${employeeId}`);
        return data.map(att => Attendance.fromJson(att));
    }

    async getAttendanceByDay(day) {
        const data = await this.get(`${this.apiPrefix}/day/${day}`);
        return data.map(att => Attendance.fromJson(att));
    }
}

export default AttendanceService;
