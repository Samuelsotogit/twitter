import { User, AuthToken } from "tweeter-shared";
import {
  AuthenticatePresenter,
} from "./AuthenticatePresenter";

export class LoginPresenter extends AuthenticatePresenter {
  public async doAuthenticate(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  }
}
