import { User, AuthToken } from "tweeter-shared";
import { LoadingView, NavigateView, Presenter } from "./Presenter";
import { UserService } from "../mode.service/UserService";

export interface AuthenticateView extends LoadingView, NavigateView {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setCurrentAlias: (alias: string) => void;
  setCurrentPassword: (password: string) => void;
}

export abstract class AuthenticatePresenter extends Presenter<AuthenticateView> {
  protected service: UserService;

  public constructor(view: AuthenticateView) {
    super(view);
    this.service = new UserService();
  }

  public async handleFieldChange(alias: string, password: string) {
    this.view.setCurrentAlias(alias);
    this.view.setCurrentPassword(password);
  }

  public abstract doAuthenticate(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    userImageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]>;

  protected requiresRegistrationFields(): boolean {
    return false;
  }

  public async authenticateUser(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl: string,
    firstName?: string,
    lastName?: string,
    userImageBytes?: Uint8Array,
    imageFileExtension?: string
  ) {
    await this.doFailureReportingOperation(
      async () => {
        if (!alias || !password) {
          this.view.displayErrorMessage(
            "Please enter both alias and password."
          );
          return;
        }
        if (
          this.requiresRegistrationFields() &&
          (!firstName || !lastName || !userImageBytes || !imageFileExtension)
        ) {
          this.view.displayErrorMessage(
            "Please fill out all fields and select an image."
          );
          return;
        }
        const [user, authToken] = await this.doAuthenticate(
          alias,
          password,
          firstName,
          lastName,
          userImageBytes,
          imageFileExtension
        );
        this.view.updateUserInfo(user, user, authToken, rememberMe);
        if (!!originalUrl) {
          this.view.navigate(originalUrl);
        } else {
          this.view.navigate(`/feed/${user.alias}`);
        }
      },
      "log user in",
      this.view.setIsLoading
    );
  }
}
