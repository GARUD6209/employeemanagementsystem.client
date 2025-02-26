import { BaseApiService } from './BaseApiService';

export class UserService extends BaseApiService {
  constructor() {
    super();
    this.baseUrl = '/api/User';
  }

  async registerUser(registerUserModel) {
    try {
      const response = await this.post(`${this.baseUrl}/create`, registerUserModel);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  // https://localhost:7216/api/User/count/Admin
  async countAdmin() {
    try {
      const response = await this.get(`${this.baseUrl}/count/Admin`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
}
