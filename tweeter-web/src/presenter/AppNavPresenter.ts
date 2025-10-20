import { AuthToken } from "tweeter-shared";
import { UserService } from "../mode.service/UserService";
import { MessageView, NavigateView, Presenter } from "./Presenter";

export interface AppNavView extends MessageView, NavigateView {
  clearUserInfo: () => void;
  logout: (authToken: AuthToken) => Promise<void>;
}

export class AppNavPresenter extends Presenter<AppNavView> {
  private service: UserService;

  public constructor(view: AppNavView) {
    super(view);
    this.service = new UserService();
  }

  public async logout(authToken: AuthToken) {
    await this.doFailureReportingOperation(async () => {
      const loggingOutToastId = this.view.displayInfoMessage(
        "Logging Out...",
        0
      );

      await this.service.logout(authToken);

      this.view.deleteMessage(loggingOutToastId);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
  }
}
