import { BaseApiService } from './BaseApiService';
import TaskAssignment from '../models/taskAssignment.model';

export class TaskAssignmentService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/TaskAssignments';
    }

    async getAllTasks() {
        const data = await this.get(`${this.apiPrefix}/all`);
        return data.map(task => TaskAssignment.fromJson(task));
    }

    async getTasksByEmployee(employeeId) {
        const data = await this.get(`${this.apiPrefix}/employee/${employeeId}`);
        return data.map(task => TaskAssignment.fromJson(task));
    }

    async assignTask(task) {
        const response = await this.postFormData(
            `${this.apiPrefix}/assign`, 
            task.toAssignmentRequest()
        );
        return response ? TaskAssignment.fromJson(response) : null;
    }

    async updateTaskStatus(task) {
        const response = await this.putFormData(
            `${this.apiPrefix}/update-status`, 
            task.toStatusUpdate()
        );
        return response ? TaskAssignment.fromJson(response) : null;
    }
}
