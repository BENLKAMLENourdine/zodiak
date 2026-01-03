import { Request } from "express";
import { UserService } from "./user.service";
import { Delete, Get, Post, Put } from "../../../core/@Route";
import { Controller } from "../../../core/@Controller";

@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/")
  getUsers() {
    return this.userService.getUsers();
  }

  @Post("/")
  createUser(req: Request) {
    const userData = req.body;
    return this.userService.createUser(userData);
  }

  @Put("/:id")
  updateUser(req: Request) {
    const userId = req.params.id;
    const updateData = req.body;
    return this.userService.updateUser(userId, updateData);
  }

  @Delete("/:id")
  deleteUser(req: Request) {
    const userId = req.params.id;
    return this.userService.deleteUser(userId);
  }

}
