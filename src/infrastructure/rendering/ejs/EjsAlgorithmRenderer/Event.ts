type SwitchChangedEvent = {
  readonly type: 'switchchanged';
  content: {
    id: string;
    active: boolean;
  };
};

type LayoutEvent = {
  readonly type: 'layout';
  content: {
    width: number;
    height: number;
  };
};

type ErrorEvent = {
  readonly type: 'error';
  content: {
    name: string;
    message: string;
  };
};

type OutcomeSelectedEvent = {
  readonly type: 'outcomeselected';
  content: {
    id: string;
  };
};

export type Event =
  | SwitchChangedEvent
  | LayoutEvent
  | ErrorEvent
  | OutcomeSelectedEvent;
