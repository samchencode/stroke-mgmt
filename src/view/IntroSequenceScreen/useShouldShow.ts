import {
  reconcileDontShowValue,
  useShouldShowStrokeFactsAndSigns,
} from '@/view/lib/shouldShowStrokeFactsAndSigns';
import { useCallback, useEffect, useState } from 'react';

function useShouldShow() {
  const shouldShowValueFromStorage = useShouldShowStrokeFactsAndSigns();
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
