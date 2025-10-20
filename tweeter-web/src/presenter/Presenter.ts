export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => string;
  deleteMessage: (messageId: string) => void;
}

export interface LoadingView extends View {
  setIsLoading: (isLoading: boolean) => void;
}

export interface NavigateView extends View {
  navigate: (path: string) => void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  protected async doFailureReportingOperation(
    operation: () => Promise<void>,
    operationDescription: string,
    setLoading?: (isLoading: boolean) => void
  ) {
    if (setLoading) setLoading(true);
    try {
      await operation();
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`
      );
    } finally {
      if (setLoading) setLoading(false);
    }
  }
}
