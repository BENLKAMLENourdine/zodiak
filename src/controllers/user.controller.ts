import { Request, Response } from "express";
import { Injectable } from "../../core/@Injectbale";
import { UserService } from "../services/user/user.service";

@Injectable()
export class UserController {
    constructor(private userService: UserService) {}
    
    getUsers(req: Request, res: Response) {
        const users = this.userService.getUsers();
        res.status(200).send({
            success: true,
            data: users
        });
    }

    createUser(req: Request, res: Response) {
        const userData = req.body;
        const newUser = this.userService.createUser(userData);
        res.status(201).send({
            success: true,
            data: newUser
        });
    }

    updateUser(req: Request, res: Response) {
        const userId = req.params.id;
        const updateData = req.body;
        const user = this.userService.updateUser(userId, updateData);
        res.status(200).send({
            success: true,
            data: user
        });
    }

    deleteUser(req: Request, res: Response) {
        const userId = req.params.id;
        this.userService.deleteUser(userId);
        res.status(200).send({
            success: true,
        });
    }
}