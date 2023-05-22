import { useCallback, useRef } from 'react';
import type {
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';

export function useScrollBehavior() {
  const scrollView = useRef<ScrollView>(null);
  const scrollToEnd = useCallback(() => {
    scrollView.current?.scrollToEnd({ animated: true });
  }, []);
  const handleScroll = useHeaderScrollResponder<
    NativeSyntheticEvent<NativeScrollEvent>
  >(useCallback((e) => e.nativeEvent.contentOffset.y, []));
  return { scrollToEnd, scrollView, handleScroll };
}
