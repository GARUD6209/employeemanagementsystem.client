class Attendance {
    constructor(attendanceId, employeeId, checkIn, checkOut, status) {
        this.attendanceId = attendanceId;
        this.employeeId = employeeId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.status = status;
    }

    static fromJson(json) {
        return new Attendance(
            json.attendanceId,
            json.employeeId,
            json.checkIn,
            json.checkOut,
            json.status
        );
    }
}

export default Attendance;
