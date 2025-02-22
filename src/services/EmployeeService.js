import Employee from '../models/employee.model';

export class EmployeeService {
    constructor() {
        this.apiPrefix = '/api/Employee';
    }

    async getAllEmployees() {
        const response = await fetch(this.apiPrefix);
        const data = await response.json();
        return data.map(emp => Employee.fromJson(emp));
    }

    async getEmployeeById(id) {
        const response = await fetch(`${this.apiPrefix}/${id}`);
        const data = await response.json();
        return Employee.fromJson(data);
    }

    async createEmployee(employee) {
        const response = await fetch(this.apiPrefix, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        const data = await response.json();
        return Employee.fromJson(data);
    }

    async updateEmployee(id, employee) {
        const formattedEmployee = {
            ...employee,
            departmentId: Number(employee.departmentId),
            salary: Number(employee.salary),
            trainingRequired: Boolean(employee.trainingRequired)
        };
        
        const response = await fetch(`${this.apiPrefix}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedEmployee)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to update employee');
        }

        return await response.json();
    }

    async deleteEmployee(id) {
        await fetch(`${this.apiPrefix}/${id}`, { method: 'DELETE' });
    }
}
