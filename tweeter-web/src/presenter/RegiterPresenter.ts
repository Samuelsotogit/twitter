import { Buffer } from "buffer";
import {
  AuthenticatePresenter,
} from "./AuthenticatePresenter";
import { User, AuthToken } from "tweeter-shared";

export class RegisterPresenter extends AuthenticatePresenter {
  public async doAuthenticate(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    userImageBytes?: Uint8Array,
    imageFileExtension?: string
  ): Promise<[User, AuthToken]> {
    return this.service.register(
      firstName!,
      lastName!,
      alias,
      password,
      userImageBytes!,
      imageFileExtension!
    );
  }

  protected requiresRegistrationFields(): boolean {
    return true;
  }

  public async processImageFile(
    file: File,
    onSuccess: (bytes: Uint8Array, extension: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const extension = this.getFileExtension(file);
      if (!extension) {
        onError("Invalid file extension");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const imageStringBase64 = event.target?.result as string;
          const imageStringBase64BufferContents =
            imageStringBase64.split("base64,")[1];
          const bytes: Uint8Array = Buffer.from(
            imageStringBase64BufferContents,
            "base64"
          );

          onSuccess(bytes, extension);
        } catch (error) {
          onError(`Failed to process image: ${error}`);
        }
      };

      reader.onerror = () => onError("Failed to read file");
      reader.readAsDataURL(file);
    } catch (error) {
      onError(`File processing error: ${error}`);
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
