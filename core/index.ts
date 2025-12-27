import { AuthService } from "../src/services/auth/auth.service";
import { UserService } from "../src/services/user/user.service";
import { Container } from "./container";

const container = new Container();

container.register('AuthService', new AuthService());
container.register('UserService', new UserService(container.resolve<AuthService>('AuthService')));

export { container as default };