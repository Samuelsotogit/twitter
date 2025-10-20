import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../mode.service/StatusService";
import { LoadingView, MessageView, Presenter } from "./Presenter";

export interface PostView extends MessageView, LoadingView {
  setPost: (post: string) => void;
}

export class PostPresenter extends Presenter<PostView> {
  private service: StatusService;

  public constructor(view: PostView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(
    post: string,
    currentUser: User,
    authToken: AuthToken
  ) {
    await this.doFailureReportingOperation(
      async () => {
        var postingStatusToastId = "";
        if (!post.trim()) {
          this.view.displayErrorMessage("Post cannot be empty");
          return;
        }

        if (!currentUser || !authToken) {
          this.view.displayErrorMessage("User not authenticated");
          return;
        }
        this.view.setIsLoading(true);
        postingStatusToastId = this.view.displayInfoMessage(
          "Posting status...",
          0
        );

        const status = new Status(post, currentUser, Date.now());
        await this.service.postStatus(authToken, status);
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
        if (postingStatusToastId) {
          this.view.deleteMessage(postingStatusToastId);
        }
      },
      "post the status",
      this.view.setIsLoading
    );
  }
}
