export class RegisterUserModel {
  constructor(firstName = "", lastName = "", email = "", address = "", contact = "", salary = 0, jobRole = "", departmentId = null, trainingRequired = false, role = "") {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.contact = contact;
    this.salary = salary;
    this.jobRole = jobRole;
    this.departmentId = departmentId;
    this.trainingRequired = trainingRequired;
    this.role = role; // Add role property
  }
}
