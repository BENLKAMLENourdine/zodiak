import { Injectable } from "../../../core/@Injectbale";
import { AppError, HTTP_ERRORS } from "../../../core/utils/errors";
import { AuthService } from "../auth/auth.service";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date(),
    },
  ];

  constructor(private authService: AuthService) {}

  getUsers(): User[] {
    if (this.authService.isAuthenticated(true)) {
      return this.users;
    }
    throw new AppError(
      HTTP_ERRORS.UNAUTHORIZED.message,
      HTTP_ERRORS.UNAUTHORIZED.status,
      "Unauthorized access to user data",
    );
  }

  createUser(userData: Partial<User>): User {
    if (!this.authService.isAuthenticated(true)) {
      throw new AppError(
        HTTP_ERRORS.UNAUTHORIZED.message,
        HTTP_ERRORS.UNAUTHORIZED.status,
        "Unauthorized access to create user",
      );
    }

    if (userData.email === undefined || userData.email.trim() === "") {
      throw new AppError(
        HTTP_ERRORS.BAD_REQUEST.message,
        HTTP_ERRORS.BAD_REQUEST.status,
        "User creation failed due to missing email",
      );
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name || "Unnamed",
      email: userData.email,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(userId: string | undefined, updateData: Partial<User>): User {
    if (!this.authService.isAuthenticated(true)) {
      throw new AppError(
        HTTP_ERRORS.UNAUTHORIZED.message,
        HTTP_ERRORS.UNAUTHORIZED.status,
        "Unauthorized access to create user",
      );
    }
    if (!userId) {
      throw new AppError(
        HTTP_ERRORS.BAD_REQUEST.message,
        HTTP_ERRORS.BAD_REQUEST.status,
        "User ID is required for update",
      );
    }
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new AppError(
        HTTP_ERRORS.BAD_REQUEST.message,
        HTTP_ERRORS.BAD_REQUEST.status,
        "Invalid user ID",
      );
    }
    const user = this.users.find((u) => u.id === id);
    if (user) {
      Object.assign(user, updateData);
      return user;
    } else {
      throw new AppError(
        HTTP_ERRORS.NOT_FOUND.message,
        HTTP_ERRORS.NOT_FOUND.status,
        "User not found",
      );
    }
  }

  deleteUser(userId: string | undefined): void {
    if (!this.authService.isAuthenticated(true)) {
      throw new AppError(
        HTTP_ERRORS.UNAUTHORIZED.message,
        HTTP_ERRORS.UNAUTHORIZED.status,
        "Unauthorized access to delete user",
      );
    }
    if (!userId) {
      throw new AppError(
        HTTP_ERRORS.BAD_REQUEST.message,
        HTTP_ERRORS.BAD_REQUEST.status,
        "User ID is required for deletion",
      );
    }
    const id = parseInt(userId, 10);

    if (isNaN(id)) {
      throw new AppError(
        HTTP_ERRORS.BAD_REQUEST.message,
        HTTP_ERRORS.BAD_REQUEST.status,
        "Invalid user ID",
      );
    }

    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    } else {
      throw new AppError(
        HTTP_ERRORS.NOT_FOUND.message,
        HTTP_ERRORS.NOT_FOUND.status,
        "User not found",
      );
    }
  }
}
