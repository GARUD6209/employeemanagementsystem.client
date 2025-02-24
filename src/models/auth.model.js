export default class Auth {
    constructor() {
        this.email = '';
        this.password = '';
        this.role = '';
        this.userId = '';
        this.isAuthorized = false;
    }

    static fromJson(json) {
        const auth = new Auth();
        Object.assign(auth, {
            userId: json.userId,
            role: json.roles[0],
            isAuthorized: true
        });
        return auth;
    }
}
