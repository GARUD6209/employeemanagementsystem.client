import Department from '../models/department.model';

export class DepartmentService {
    constructor() {
        this.apiPrefix = '/api/Department';
    }

    async getAllDepartments() {
        const response = await fetch(this.apiPrefix);
        const data = await response.json();
        return data.map(dept => Department.fromJson(dept));
    }

    async getDepartmentById(id) {
        const response = await fetch(`${this.apiPrefix}/${id}`);
        const data = await response.json();
        return Department.fromJson(data);
    }

    async createDepartment(departmentName) {
        const response = await fetch(this.apiPrefix, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ departmentName })
        });
        const data = await response.json();
        return Department.fromJson(data);
    }

    async updateDepartment(id, departmentName) {
        const response = await fetch(`${this.apiPrefix}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ departmentId: id, departmentName })
        });
        const data = await response.json();
        return Department.fromJson(data);
    }

    async deleteDepartment(id) {
        await fetch(`${this.apiPrefix}/${id}`, { method: 'DELETE' });
    }
}
