import { BaseApiService } from './BaseApiService';
import Department from '../models/department.model';

export class DepartmentService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/Department';
    }

    async getAllDepartments() {
        const data = await this.get(this.apiPrefix);
        return data.map(dept => Department.fromJson(dept));
    }

    async getDepartmentById(id) {
        const data = await this.get(`${this.apiPrefix}/${id}`);
        return Department.fromJson(data);
    }

    async createDepartment(departmentName) {
        const data = await this.post(this.apiPrefix, { departmentName });
        return Department.fromJson(data);
    }

    async updateDepartment(id, departmentName) {
        const data = await this.put(`${this.apiPrefix}/${id}`, { 
            departmentId: id, 
            departmentName 
        });
        return Department.fromJson(data);
    }

    async deleteDepartment(id) {
        return await this.delete(`${this.apiPrefix}/${id}`);
    }
}
