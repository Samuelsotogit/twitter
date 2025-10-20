import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import AuthFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { AuthenticateView } from "../../../presenter/AuthenticatePresenter";
import { RegisterPresenter } from "../../../presenter/RegiterPresenter";

interface RegisterProps {
  originalUrl?: string;
  presenterFactory: (listener: AuthenticateView) => RegisterPresenter;
}

const Register = (props: RegisterProps) => {
  const [currentAlias, setCurrentAlias] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: AuthenticateView = {
    setIsLoading: (isLoading: boolean) => setIsLoading(isLoading),
    updateUserInfo: (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean
    ) => updateUserInfo(currentUser, displayedUser, authToken, remember),
    setCurrentAlias: (alias: string) => setCurrentAlias(alias),
    setCurrentPassword: (password: string) => setCurrentPassword(password),
    navigate: (url: string) => navigate(url),
    displayErrorMessage: (message: string) => displayErrorMessage(message),
  };

  const presenterRef = useRef<RegisterPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const handleSubmit = () => {
    if (!checkSubmitButtonStatus()) {
      presenterRef.current!.authenticateUser(
        currentAlias,
        currentPassword,
        rememberMe,
        props.originalUrl ?? "",
        firstName,
        lastName,
        imageBytes,
        imageFileExtension
      );
    }
  };

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !imageUrl ||
      !imageFileExtension ||
      !currentAlias ||
      !currentPassword
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleImageFile(file);
  };

  const handleImageFile = async (file: File | undefined) => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

      await presenterRef.current!.processImageFile(
        file,
        (bytes: Uint8Array, extension: string) => {
          setImageBytes(bytes);
          setImageFileExtension(extension);
        },
        (error: string) => {
          displayErrorMessage(error);
          setImageUrl("");
        }
      );
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
      setImageFileExtension("");
    }
  };

  const handleFieldChange = (alias: string, password: string) => {
    presenterRef.current!.handleFieldChange(alias, password);
  };

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthFields onSubmit={handleSubmit} onFieldChange={handleFieldChange} />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onChange={handleFileChange}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img
                src={imageUrl}
                className="img-thumbnail"
                alt="User preview"
              />
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={handleSubmit}
    />
  );
};

export default Register;
