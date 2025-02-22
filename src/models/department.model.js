export default class Department {
    constructor() {
        this.departmentId = 0;
        this.departmentName = '';
    }

    static fromJson(json) {
        const department = new Department();
        Object.assign(department, json);
        return department;
    }
}
