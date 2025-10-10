import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollower: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastFollower, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  // public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
  //   try {
  //     setFollowerCount(await getFollowerCount(authToken, displayedUser));
  //   } catch (error) {
  //     displayErrorMessage(
  //       `Failed to get followers count because of exception: ${error}`
  //     );
  //   }
  // }

  // public async follow(
  //   authToken: AuthToken,
  //   userToFollow: User
  // ): Promise<[followerCount: number, followeeCount: number]> {
  //   // Pause so we can see the follow message. Remove when connected to the server
  //   await new Promise((f) => setTimeout(f, 2000));

  //   // TODO: Call the server

  //   const followerCount = await getFollowerCount(authToken, userToFollow);
  //   const followeeCount = await getFolloweeCount(authToken, userToFollow);

  //   return [followerCount, followeeCount];
  // }

  // public async unfollow(
  //   authToken: AuthToken,
  //   userToUnfollow: User
  // ): Promise<[followerCount: number, followeeCount: number]> {
  //   // Pause so we can see the unfollow message. Remove when connected to the server
  //   await new Promise((f) => setTimeout(f, 2000));

  //   // TODO: Call the server

  //   const followerCount = await getFollowerCount(authToken, userToUnfollow);
  //   const followeeCount = await getFolloweeCount(authToken, userToUnfollow);

  //   return [followerCount, followeeCount];
  // }
}
