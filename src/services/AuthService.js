import { BaseApiService } from './BaseApiService';
import Auth from '../models/auth.model';

export class AuthService extends BaseApiService {
    async login(email, password, role, rememberMe = false) {
        const loginUrl = rememberMe
            ? `/login?useCookies=true&role=${role}`
            : `/login?useSessionCookies=true&role=${role}`;

        await this.post(loginUrl, { email, password });
        return true;
    }

    async checkAuth() {
        const data = await this.get('/pingauth');
        return Auth.fromJson(data);
    }

    async logout() {
        await this.post('/logout');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        return true;
    }

    async verifyRole(expectedRole) {
        try {
            const authData = await this.checkAuth();
            return authData.role.toLowerCase() === expectedRole.toLowerCase();
        } catch (error) {
            console.error('Role verification failed:', error);
            return false;
        }
    }
}
