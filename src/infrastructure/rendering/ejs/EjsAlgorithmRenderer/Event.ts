export type SwitchChangedEvent = {
  readonly type: 'switchchanged';
  content: {
    id: string;
    active: boolean;
  };
};

export type LayoutEvent = {
  readonly type: 'layout';
  content: {
    width: number;
    height: number;
  };
};

export type ErrorEvent = {
  readonly type: 'error';
  content: {
    name: string;
    message: string;
  };
};

export type OutcomeSelectedEvent = {
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
