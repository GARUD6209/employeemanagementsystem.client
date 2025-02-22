export default class Employee {
    constructor() {
        this.employeeId = 0;
        this.firstName = '';
        this.lastName = '';
        this.photo = '';
        this.email = '';
        this.address = '';
        this.contact = '';
        this.emergencyContact = '';
        this.salary = 0;
        this.jobRole = '';
        this.departmentId = 0;
        this.trainingRequired = false;
        this.userId = '';
    }

    static fromJson(json) {
        const employee = new Employee();
        Object.assign(employee, {
            ...json,
            departmentId: Number(json.departmentId),
            salary: Number(json.salary),
            trainingRequired: Boolean(json.trainingRequired)
        });
        return employee;
    }
}
