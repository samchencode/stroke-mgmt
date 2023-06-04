import { useEffect } from 'react';
import { Snack } from '@/view/Snackbar';
import { useShowSnack } from '@/view/Snackbar/useShowSnack';
import { thrownToString } from '@/view/error-handling/thrownToString';

type Props = {
  children: JSX.Element;
};

function SnackbarGlobalErrorHandler({ children }: Props) {
  const showSnack = useShowSnack();

  useEffect(() => {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      if (isFatal) return;
      const snack = new Snack(thrownToString(error));
      showSnack(snack);
    });
  }, [showSnack]);

  return children;
}

export { SnackbarGlobalErrorHandler };
