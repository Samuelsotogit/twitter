import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../mode.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return this.service.getIsFollowerStatus(authToken, user, selectedUser);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return this.service.getFolloweeCount(authToken, user);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return this.service.getFollowerCount(authToken, user);
  }

  public async loadUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await Promise.all([
      this.setIsFollowerStatus(authToken, currentUser, displayedUser),
      this.setNumbFollowees(authToken, displayedUser),
      this.setNumbFollowers(authToken, displayedUser),
    ]);
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.service.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
        this.view.setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser)
      );
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser)
      );
    }, "get followers count");
  }

  private async changeFollowStatus(
    authToken: AuthToken,
    targetUser: User,
    action: "follow" | "unfollow",
    message: string,
    serviceMethod: (
      authToken: AuthToken,
      user: User
    ) => Promise<[number, number]>,
    isFollower: boolean
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        const toastId = this.view.displayInfoMessage(message, 0);

        const [followerCount, followeeCount] = await serviceMethod(
          authToken!,
          targetUser!
        );

        this.view.setIsFollower(isFollower);
        this.view.setFollowerCount(followerCount);
        this.view.setFolloweeCount(followeeCount);
        this.view.deleteMessage(toastId);
      },
      `${action} user`,
      this.view.setIsLoading
    );
  }

  public async followUser(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<void> {
    await this.changeFollowStatus(
      authToken,
      userToFollow,
      "follow",
      `Following ${userToFollow!.name}...`,
      this.service.follow.bind(this.service),
      true
    );
  }

  public async unfollowUser(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<void> {
    await this.changeFollowStatus(
      authToken,
      userToUnfollow,
      "unfollow",
      `Unfollowing ${userToUnfollow!.name}...`,
      this.service.unfollow.bind(this.service),
      false
    );
  }
}
