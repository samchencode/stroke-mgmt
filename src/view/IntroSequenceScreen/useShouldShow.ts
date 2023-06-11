import {
  reconcileDontShowValue,
  useShouldShowIntroSequence,
} from '@/view/lib/shouldShowIntroSequence';
import { useCallback, useEffect, useState } from 'react';

function useShouldShow() {
  const shouldShowValueFromStorage = useShouldShowIntroSequence();
  const [dontShowCheckboxValue, setDontShowCheckboxValue] = useState(false);
  useEffect(() => {
    // set initial state to stated state
    if (shouldShowValueFromStorage !== 'loading')
      setDontShowCheckboxValue(shouldShowValueFromStorage === 'no');
  }, [shouldShowValueFromStorage]);

  const saveShouldShow = useCallback(() => {
    if (shouldShowValueFromStorage !== 'loading') {
      reconcileDontShowValue(
        dontShowCheckboxValue,
        shouldShowValueFromStorage === 'no'
      );
    }
  }, [dontShowCheckboxValue, shouldShowValueFromStorage]);

  return [
    dontShowCheckboxValue,
    setDontShowCheckboxValue,
    saveShouldShow,
  ] as const;
}

export { useShouldShow };
