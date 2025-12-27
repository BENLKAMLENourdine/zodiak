
import express from 'express';
import 'dotenv/config';

import { UserController } from './controllers/user.controller';

import container from '../core/index';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/user-info', (req, res) => {
    const userController = container.resolve<UserController>('UserController');
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