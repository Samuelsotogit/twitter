import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../mode.service/UserService";
import { NavigateView, Presenter } from "./Presenter";

export interface UseNavigateView extends NavigateView {
  setDisplayedUser: (user: User) => void;
}

export class UseNavigatePresenter extends Presenter<UseNavigateView> {
  private service: UserService;

  public constructor(view: UseNavigateView) {
    super(view);
    this.service = new UserService();
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(
    eventTarget: string,
    currentDisplayedUser: User | null,
    authToken: AuthToken,
    featurePath: string
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(eventTarget);

      if (!alias) {
        this.view.displayErrorMessage("Invalid user alias");
        return;
      }

      const toUser = await this.service.getUser(authToken, alias);

      if (toUser) {
        if (!currentDisplayedUser || !toUser.equals(currentDisplayedUser)) {
          this.view.setDisplayedUser(toUser);
          this.view.navigate(`${featurePath}/${toUser.alias}`);
        }
      } else {
        this.view.displayErrorMessage("User not found");
      }
    }, "get user");
  }
}
