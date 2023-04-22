import { createContext, useState } from 'react';

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

export { useHeaderScrollData, HeaderScrollContext };
