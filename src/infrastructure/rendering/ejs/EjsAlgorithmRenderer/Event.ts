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

export type NextPressedEvent = {
  readonly type: 'nextpressed';
  content: {
    id: string;
  };
};

export type LinkPressedEvent = {
  readonly type: 'linkpressed';
  content: {
    href: string;
  };
};

export type Event =
  | SwitchChangedEvent
  | LayoutEvent
  | ErrorEvent
  | NextPressedEvent
  | LinkPressedEvent;
