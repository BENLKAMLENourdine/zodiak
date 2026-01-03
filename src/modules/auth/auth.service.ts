import { Injectable } from "../../../core/@Injectbale";

@Injectable()
export class AuthService {
  isAuthenticated(authenticated: boolean): boolean {
    return authenticated;
  }
}
