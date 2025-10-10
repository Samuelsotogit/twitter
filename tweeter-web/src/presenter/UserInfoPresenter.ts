import { FollowService } from "../mode.service/FollowService";

export interface UserInfoView {}

export class UserInfoPresenter {
  private service: FollowService;
  private _view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.service = new FollowService();
    this._view = view;
  }

  
}
