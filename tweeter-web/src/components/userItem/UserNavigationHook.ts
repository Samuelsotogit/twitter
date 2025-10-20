import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  UseNavigatePresenter,
  UseNavigateView,
} from "../../presenter/UseNavigatePresenter";
import { useRef } from "react";

interface UserNavigationProps {
  featurePath: string;
}

export const useUserNavigation = ({ featurePath }: UserNavigationProps) => {
  const { displayErrorMessage } = useMessageActions();
  const { authToken, displayedUser } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();

  const listener: UseNavigateView = {
    displayErrorMessage: (message: string) => displayErrorMessage(message),
    setDisplayedUser: (user: User) => setDisplayedUser(user),
    navigate: (path: string) => navigate(path),
  };

  const presenterRef = useRef<UseNavigatePresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UseNavigatePresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const textContent = target.textContent || target.innerText || "";

    presenterRef.current!.navigateToUser(
      textContent,
      displayedUser,
      authToken!,
      featurePath
    );
  };

  return {
    navigateToUser,
  };
};
