import 'reflect-metadata';

import express from 'express';
import 'dotenv/config';

import { UserController } from './controllers/user.controller';

import {Container} from '../core/container';

const container = new Container();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Controllers
const userController = container.get(UserController);

app.get('/user-info', userController.getUser.bind(userController));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});