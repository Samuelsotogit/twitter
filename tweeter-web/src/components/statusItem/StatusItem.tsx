import { Link } from "react-router-dom";
import Post from "./Post";
import { Status, User } from "tweeter-shared";
import { useUserNavigation } from "../userItem/UserNavigationHook";

interface Props {
  user: User;
  formattedDate: string;
  status: Status;
  featurePath: string;
}

const StatusItem = (props: Props) => {
  const { navigateToUser } = useUserNavigation({
    featurePath: props.featurePath,
  });

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link to={`/feed/${props.user.alias}`} onClick={navigateToUser}>
                {props.user.alias}
              </Link>
            </h2>
            {props.formattedDate}
            <br />
            <Post status={props.status} featurePath="/feed" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
