import { BaseApiService } from './BaseApiService';
import Employee from '../models/employee.model';

export class EmployeeService extends BaseApiService {
    constructor() {
        super();
        this.apiPrefix = '/api/Employee';
    }

    async getAllEmployees() {
        const data = await this.get(this.apiPrefix);
        return data.map(emp => Employee.fromJson(emp));
    }

    async getEmployeeById(id) {
        const data = await this.get(`${this.apiPrefix}/${id}`);
        return Employee.fromJson(data);
    }

    async createEmployee(employee) {
        const data = await this.post(this.apiPrefix, employee);
        return Employee.fromJson(data);
    }

    async updateEmployee(id, employee) {
        const formattedEmployee = {
            ...employee,
            departmentId: Number(employee.departmentId),
            salary: Number(employee.salary),
            trainingRequired: Boolean(employee.trainingRequired)
        };
        
        const data = await this.put(`${this.apiPrefix}/${id}`, formattedEmployee);
        return Employee.fromJson(data);
    }

    async deleteEmployee(id) {
        return await this.delete(`${this.apiPrefix}/${id}`);
    }
}
