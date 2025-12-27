
import express from 'express';
import 'dotenv/config';
import { UserController } from './src/controllers/user.controller';
import { UserService } from './src/services/user/user.service';
import { AuthService } from './src/services/auth/auth.service';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/user-info', (req, res) => {
    const authService = new AuthService();
    const userService = new UserService(authService);
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