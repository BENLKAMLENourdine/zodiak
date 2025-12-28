import { Request, Response } from "express";
import { Injectable } from "../../core/@Injectbale";
import { UserService } from "../services/user/user.service";

@Injectable()
export class UserController {
    constructor(private userService: UserService) {}
    
    getUser(req: Request, res: Response) {
        const userInfo = this.userService.getUser();
        res.json(userInfo);
    }
}