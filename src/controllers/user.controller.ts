import { UserService } from "../services/user/user.service";

export class UserController {
    constructor(private userService: UserService) {}
    
    getUser() {
        return this.userService.getUser();
    }
}