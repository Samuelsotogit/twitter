import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import AuthFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import {
  AuthenticatePresenter,
  AuthenticateView,
} from "../../../presenter/AuthenticatePresenter";
import { LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
  presenterFactory: (view: AuthenticateView) => AuthenticatePresenter;
}

const Login = (props: Props) => {
  const [currentAlias, setCurrentAlias] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
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

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory(listener);
  }

  const handleSubmit = () => {
    presenterRef.current!.authenticateUser(
      currentAlias,
      currentPassword,
      rememberMe,
      props.originalUrl || ""
    );
  };

  const handleFieldChange = (alias: string, password: string) => {
    presenterRef.current!.handleFieldChange(alias, password);
  };

  const inputFieldFactory = () => {
    return (
      <AuthFields
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange} // ✅ Properly bound
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={() => !currentAlias || !currentPassword}
      isLoading={isLoading}
      submit={handleSubmit}
    />
  );
};

export default Login;
