import { BaseApiService } from "./BaseApiService";
import Employee from "../models/employee.model";

export class EmployeeService extends BaseApiService {
  #fullNameCache;

  constructor() {
    super();
    this.apiPrefix = "/api/Employee";
    this.#fullNameCache = new Map();
  }

  async getAllEmployees() {
    const data = await this.get(this.apiPrefix);
    return data.map((emp) => Employee.fromJson(emp));
  }

  async getEmployeeById(id) {
    const data = await this.get(`${this.apiPrefix}/${id}`);
    console.log("Fetched employee data from employee service:", data);
    return Employee.fromJson(data);
  }

  async createEmployee(employee) {
    console.log("Employee payload:", employee);
    const data = await this.post(this.apiPrefix, employee);
    console.log("Created employee data:", data);
    if (!data) {
      throw new Error("Failed to create employee");
    }

    return Employee.fromJson(data);
  }

  async updateEmployee(id, employee) {
    // Build a payload with all required fields and correct types
    const {
      employeeId = 0,
      firstName = "",
      lastName = "",
      photo = "",
      email = "",
      address = "",
      contact = "",
      emergencyContact = "",
      salary = 0,
      jobRole = "",
      departmentId = 0,
      trainingRequired = false,
      userId = "",
      samagraId = 0,
      fatherName = "",
      motherName = "",
      gender = "",
      maritalStatus = "",
      dob = "",
      district = "",
    } = employee;

    const payload = {
      employeeId: Number(employeeId),
      firstName: String(firstName),
      lastName: String(lastName),
      photo: String(photo),
      email: String(email),
      address: String(address),
      contact: String(contact),
      emergencyContact: String(emergencyContact),
      salary: Number(salary),
      jobRole: String(jobRole),
      departmentId: Number(departmentId),
      trainingRequired: Boolean(trainingRequired),
      userId: String(userId),
      samagraId: Number(samagraId),
      fatherName: String(fatherName),
      motherName: String(motherName),
      gender: String(gender),
      maritalStatus: String(maritalStatus),
      dob: dob
        ? dob.length > 10
          ? new Date(dob).toISOString()
          : new Date(dob + "T00:00:00").toISOString()
        : new Date().toISOString(),
      district: String(district),
    };

    // Remove any undefined or empty string fields if backend allows, else send all fields
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });
    const data = await this.put(`${this.apiPrefix}/${id}`, payload);
    return Employee.fromJson(data);
  }

  async deleteEmployee(id) {
    return await this.delete(`${this.apiPrefix}/${id}`);
  }

  async getEmployeeIdByUserId(userId) {
    const emp = await this.get(`${this.apiPrefix}/user/${userId}`);

    return emp;
  }

  async getEmployeeFullNameByUserId(userId) {
    if (!userId) return "";

    if (this.#fullNameCache.has(userId)) {
      return this.#fullNameCache.get(userId);
    }

    try {
      const response = await this.get(`${this.apiPrefix}/fullname/${userId}`);
      this.#fullNameCache.set(userId, response);
      return response;
    } catch (error) {
      console.error("Error fetching employee name:", error);
      return "Unknown User";
    }
  }

  async prefetchUserNames(userIds) {
    const uniqueIds = [...new Set(userIds)];
    const promises = uniqueIds
      .filter((id) => !this.#fullNameCache.has(id))
      .map((id) => this.getEmployeeFullNameByUserId(id));
    await Promise.all(promises);
  }
}
