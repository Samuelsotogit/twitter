import { User } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { FollowService } from "../mode.service/FollowService";

export abstract class UserItemPresenter extends PagedItemPresenter<
  User,
  FollowService
> {
  protected serviceFactory(): FollowService {
    return new FollowService();
  }
}
