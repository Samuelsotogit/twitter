import { Buffer } from "buffer";
import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  // public async login(
  //   alias: string,
  //   password: string
  // ): Promise<[User, AuthToken]> {
  //   // TODO: Replace with the result of calling the server
  //   const user = FakeData.instance.firstUser;

  //   if (user === null) {
  //     throw new Error("Invalid alias or password");
  //   }

  //   return [user, FakeData.instance.authToken];
  // }

    // public async register(
    //   firstName: string,
    //   lastName: string,
    //   alias: string,
    //   password: string,
    //   userImageBytes: Uint8Array,
    //   imageFileExtension: string
    // ): Promise<[User, AuthToken]> {
    //   const imageStringBase64: string =
    //     Buffer.from(userImageBytes).toString("base64");
    //   const user = FakeData.instance.firstUser;
  
    //   if (user === null) {
    //     throw new Error("Invalid registration");
    //   }
  
    //   return [user, FakeData.instance.authToken];
    // };

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
}
