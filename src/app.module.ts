import { Module } from "../core/@Module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule {}
