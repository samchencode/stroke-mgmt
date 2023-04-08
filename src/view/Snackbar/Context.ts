import { createContext } from 'react';
import type { Snack } from '@/view/Snackbar/Snack';

type ContextContent = {
  snacks: Snack[];
  showSnack: (snack: Snack) => void;
};

const SnackbarContext = createContext<ContextContent>({
  snacks: [],
  showSnack: () => {},
});

export type { Snack };
export { SnackbarContext };
