import { User } from "../../../src/controllers/dto/response/get-user-info.dto";
import { AuthService } from "../auth/auth.service";

export class UserService {
    constructor(private authService: AuthService) {}
    getUser(): User {
        if (this.authService.isAuthenticated(true)) {
            return {
                name: "John Doe",
                email: "john@example.com",
                createdAt: new Date(),
            }
        }
        throw new Error("User not authenticated");
    }
}