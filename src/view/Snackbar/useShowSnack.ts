import { SnackbarContext } from '@/view/Snackbar/Context';
import { useContext } from 'react';

function useShowSnack() {
  const snackbarContext = useContext(SnackbarContext);
  return snackbarContext.showSnack;
}

export { useShowSnack };
