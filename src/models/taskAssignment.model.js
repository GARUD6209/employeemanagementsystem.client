export const TaskStatus = {
    Pending: 'Pending',
    InProgress: 'InProgress',
    Completed: 'Completed'
};

export default class TaskAssignment {
    constructor() {
        this.id = 0;
        this.employeeId = 0;
        this.description = '';
        this.deadline = new Date();
        this.applicationUserId = '';
        this.status = 'Pending';
        this.inputFile = null;
        this.outputFile = null;
    }

    static fromJson(json) {
        return Object.assign(new TaskAssignment(), {
            ...json,
            deadline: new Date(json.deadline),
            employeeId: Number(json.employeeId)
        });
    }

    toAssignmentRequest() {
        const formData = new FormData();
        formData.append('EmployeeId', this.employeeId.toString());
        formData.append('ApplicationUserId', this.applicationUserId);
        formData.append('Description', this.description);
        formData.append('Deadline', this.deadline.toISOString());
        if (this.inputFile) {
            formData.append('InputFile', this.inputFile);
        }
        return formData;
    }

    toStatusUpdate() {
        const formData = new FormData();
        formData.append('TaskId', this.id.toString());
        formData.append('Status', this.status);
        if (this.outputFile instanceof File) {
            formData.append('OutputFile', this.outputFile);
        }
        return formData;
    }
}
