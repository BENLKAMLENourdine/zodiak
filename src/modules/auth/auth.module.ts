import { Module } from "../../../core/@Module";
import { AuthService } from "./auth.service";

@Module({
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
