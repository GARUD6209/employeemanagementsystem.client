export default class EmployeeSchedule {
    constructor(scheduleId, title, startTime, endTime, location, employeeId) {
        this.scheduleId = scheduleId;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.employeeId = employeeId;
    }

    static fromJson(json) {
        return new EmployeeSchedule(
            json.scheduleId,
            json.title,
            new Date(json.startTime),
            new Date(json.endTime),
            json.location,
            json.employeeId
        );
    }
}

