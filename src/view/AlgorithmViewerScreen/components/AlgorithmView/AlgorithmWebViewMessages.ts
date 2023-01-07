type LayoutMessage = {
  type: 'layout';
  content: { height: number; width: number };
};

type SwitchChangedMessage = {
  type: 'switchchanged';
  content: { id: string; active: boolean };
};

type ErrorMessage = {
  type: 'error';
  content: { type: string; message: string };
};

type OutcomeSelected = {
  type: 'outcomeselected';
  content: { title: string };
};

export type Message =
  | LayoutMessage
  | SwitchChangedMessage
  | ErrorMessage
  | OutcomeSelected;
