import { Injectable } from "../../../core/@Injectbale";
import { User } from "../../../src/controllers/dto/response/get-user-info.dto";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserService {
    private readonly users: User[] = [{
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                createdAt: new Date(),
            }];

    constructor(private authService: AuthService) {}

    getUsers(): User[] {
        if (this.authService.isAuthenticated(true)) {
            return this.users
        }
        throw new Error("User not authenticated");
    }

    createUser(userData: Partial<User>): User {
        const newUser: User = {
            id: this.users.length + 1,
            name: userData.name || "Unnamed",
            email: userData.email || "<EMAIL>",
            createdAt: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(userId: string | undefined, updateData: Partial<User>): User {

        if(!this.authService.isAuthenticated(true)) {
            throw new Error("User not authenticated");
        }
        if(!userId) {
            throw new Error("User ID is required");
        }
        const id = parseInt(userId, 10);
        if(isNaN(id)) {
            throw new Error("Invalid user ID");
        }
        if (id <= 0 || id > this.users.length) {
            throw new Error("User not found");
        }
        const user = this.users.find(u => u.id === id);
        if (user) {
            Object.assign(user, updateData);
            return user
        } else {
            throw new Error("User not found");
        }
    }

    deleteUser(userId: string | undefined): void {
        if(!this.authService.isAuthenticated(true)) {
            throw new Error("User not authenticated");
        }
        if(!userId) {
            throw new Error("User ID is required");
        }
        const id = parseInt(userId, 10);

        if(isNaN(id)) {
            throw new Error("Invalid user ID");
        }
        if (id <= 0 || id > this.users.length) {
            throw new Error("User not found");
        }

        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
        } else
        {
            throw new Error("User not found");
        }
    }
}