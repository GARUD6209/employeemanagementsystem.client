import { BaseApiService } from './BaseApiService';
import EmployeeSchedule from '../models/employeeSchedule.model';

export class EmployeeScheduleService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/EmployeeSchedule';
    }

    async getAllSchedules() {
        const data = await this.get(this.apiPrefix);
        return data.map(schedule => EmployeeSchedule.fromJson(schedule));
    }

    async getScheduleById(id) {
        const data = await this.get(`${this.apiPrefix}/${id}`);
        return EmployeeSchedule.fromJson(data);
    }

    async createSchedule(schedule) {
        const data = await this.post(this.apiPrefix, schedule);
        return EmployeeSchedule.fromJson(data);
    }

    async updateSchedule(id, schedule) {
        const formattedSchedule = {
            scheduleId: id,
            title: schedule.title,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            location: schedule.location,
            employeeId: schedule.employeeId
        };

        const data = await this.put(`${this.apiPrefix}/${id}`, formattedSchedule);
        return EmployeeSchedule.fromJson(data);
    }

    async deleteSchedule(id) {
        return await this.delete(`${this.apiPrefix}/${id}`);
    }
}
