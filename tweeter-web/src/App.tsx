import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { RegisterPresenter } from "./presenter/RegiterPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import ItemScroller from "./components/mainLayout/ItemScroller";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  const itemComponentFactory = (item: User | Status, featurePath: string) => {
    if (item instanceof Status) {
      return (
        <StatusItem
          status={item}
          user={item.user}
          formattedDate={item.formattedDate}
          featurePath={featurePath}
        />
      );
    }
    return <UserItem user={item} featurePath={featurePath} />;
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
        <Route
          path="feed/:displayedUser"
          element={
            <ItemScroller<Status>
              key={`feed-${displayedUser!.alias}`}
              featurePath="/feed"
              presenterFactory={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
              itemComponentFactory={itemComponentFactory}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <ItemScroller<Status>
              key={`story-${displayedUser!.alias}`}
              featurePath="/story"
              presenterFactory={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
              itemComponentFactory={itemComponentFactory}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <ItemScroller<User>
              key={`followees-${displayedUser!.alias}`}
              featurePath="/followees"
              presenterFactory={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
              itemComponentFactory={itemComponentFactory}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <ItemScroller<User>
              key={`followers-${displayedUser!.alias}`}
              featurePath="/followers"
              presenterFactory={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
              itemComponentFactory={itemComponentFactory}
            />
          }
        />

        <Route path="logout" element={<Navigate to="/login" />} />
        <Route
          path="*"
          element={<Navigate to={`/feed/${displayedUser!.alias}`} />}
        />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterFactory={(view) => new LoginPresenter(view)}
            originalUrl={location.pathname}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Register presenterFactory={(view) => new RegisterPresenter(view)} />
        }
      />
      <Route
        path="*"
        element={
          <Login
            presenterFactory={(view) => new LoginPresenter(view)}
            originalUrl={location.pathname}
          />
        }
      />
    </Routes>
  );
};

export default App;
