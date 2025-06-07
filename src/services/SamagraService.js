import { BaseApiService } from "./BaseApiService";

export class SamagraService extends BaseApiService {
  constructor() {
    super();
    this.apiPrefix = "/api/Samagra"; // Use full URL as requested
  }

  async getSamagraData(samagraId) {
    return await this.post(`${this.apiPrefix}/GetSamagraData`, { samagraId });
  }
}

export default new SamagraService();
