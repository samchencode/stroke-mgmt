import React, { useCallback, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Snack } from '@/view/Snackbar/Snack';
import { SnackbarContext } from '@/view/Snackbar/Context';
import { Snackbar } from '@/view/Snackbar/Snackbar';

type Props = {
  children: ReactNode;
};

function SnackbarProvider({ children }: Props) {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [lastTimeout, setLastTimeout] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const shiftSnack = useCallback(() => {
    const newSnacks = snacks.slice();
    newSnacks.shift();
    setSnacks(newSnacks);
    setLastTimeout(undefined);
  }, [snacks]);

  const showSnack = useCallback(
    (snack: Snack) => {
      const newSnacks = snacks.slice();
      newSnacks.push(snack);
      setSnacks(newSnacks);
    },
    [snacks]
  );

  useEffect(() => {
    if (snacks.length === 0) return;
    const snack = snacks[0];
    const timeout = setTimeout(shiftSnack, snack.dwellMilliseconds);
    setLastTimeout(timeout);
  }, [shiftSnack, snacks]);

  const dismissSnackEarly = useCallback(() => {
    clearTimeout(lastTimeout);
    shiftSnack();
  }, [lastTimeout, shiftSnack]);

  const contextContent = useMemo(
    () => ({
      snacks,
      showSnack,
    }),
    [snacks, showSnack]
  );

  return (
    <SnackbarContext.Provider value={contextContent}>
      {children}
      {snacks[0] && (
        <Snackbar
          message={snacks[0].message}
          action={snacks[0].action}
          dismiss={dismissSnackEarly}
        />
      )}
    </SnackbarContext.Provider>
  );
}

export { SnackbarProvider };
