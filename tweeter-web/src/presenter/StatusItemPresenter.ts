import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../mode.service/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected serviceFactory(): StatusService {
    return new StatusService();
  }
}
