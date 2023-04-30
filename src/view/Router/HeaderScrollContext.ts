import { useFocusEffect } from '@react-navigation/native';
import { createContext, useCallback, useContext, useState } from 'react';

type HeaderScrollState = {
  scrolledToTop: boolean;
  setScrolledToTop: (v: boolean) => void;
};

const HeaderScrollContext = createContext<HeaderScrollState>({
  scrolledToTop: true,
  setScrolledToTop: () => {},
});

function useHeaderScrollData() {
  const [scrolledToTop, setScrolledToTop] = useState(true);

  return {
    scrolledToTop,
    setScrolledToTop,
  };
}

function useHeaderScrollResponder<Event>(
  getHeightFromScrollEvent: (e: Event) => number
) {
  const headerScrollState = useContext(HeaderScrollContext);

  const [elementScrollHeight, setElementScrollHeight] = useState(0);

  const handleScroll = useCallback(
    (e: Event) => {
      const scrollHeight = getHeightFromScrollEvent(e);
      setElementScrollHeight(scrollHeight);
      headerScrollState.setScrolledToTop(scrollHeight === 0);
    },
    [getHeightFromScrollEvent, headerScrollState]
  );

  useFocusEffect(
    useCallback(() => {
      const scrollHeight = elementScrollHeight;
      headerScrollState.setScrolledToTop(scrollHeight === 0);
    }, [elementScrollHeight, headerScrollState])
  );

  return handleScroll;
}

export { useHeaderScrollData, HeaderScrollContext, useHeaderScrollResponder };
