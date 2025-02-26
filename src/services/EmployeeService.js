import { BaseApiService } from './BaseApiService';
import Employee from '../models/employee.model';

export class EmployeeService extends BaseApiService {
    #fullNameCache;

    constructor() {
        super();
        this.apiPrefix = '/api/Employee';
        this.#fullNameCache = new Map();
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

    async getEmployeeIdByUserId(userId) {
        const emp = await this.get(`${this.apiPrefix}/user/${userId}`)
      

        return emp; 
    }

    async getEmployeeFullNameByUserId(userId) {
        if (!userId) return '';
        
        if (this.#fullNameCache.has(userId)) {
            return this.#fullNameCache.get(userId);
        }

        try {
            const response = await this.get(`${this.apiPrefix}/fullname/${userId}`);
            this.#fullNameCache.set(userId, response);
            return response;
        } catch (error) {
            console.error('Error fetching employee name:', error);
            return 'Unknown User';
        }
    }


    async prefetchUserNames(userIds) {
        const uniqueIds = [...new Set(userIds)];
        const promises = uniqueIds
            .filter(id => !this.#fullNameCache.has(id))
            .map(id => this.getEmployeeFullNameByUserId(id));
        await Promise.all(promises);
    }
}
