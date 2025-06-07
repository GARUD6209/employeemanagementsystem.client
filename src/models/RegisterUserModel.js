export class RegisterUserModel {
  constructor(
    firstName = "",
    lastName = "",
    email = "",
    address = "",
    contact = "",
    salary = 0,
    jobRole = "",
    departmentId = null,
    trainingRequired = false,
    role = "",
    samagraId = 0,
    FatherName = "",
    MotherName = "",
    Gender = "",
    MaritalStatus = "",
    DOB = "",
    District = ""
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.contact = contact;
    this.salary = salary;
    this.jobRole = jobRole;
    this.departmentId = departmentId;
    this.trainingRequired = trainingRequired;
    this.role = role;
    this.samagraId = samagraId;
    this.FatherName = FatherName;
    this.MotherName = MotherName;
    this.Gender = Gender;
    this.MaritalStatus = MaritalStatus;
    this.DOB = DOB;
    this.District = District;
  }
}
