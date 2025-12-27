
import express from 'express';
import 'dotenv/config';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user/user.service';

import container from '../core/index';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/user-info', (req, res) => {
    const userService = container.resolve<UserService>('UserService');
    const userController = new UserController(userService);
    try {
        const userInfo = userController.getUser();
        res.json(userInfo);
    } catch (error) {
        res.status(401).json({ message: error });
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});