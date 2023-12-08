import { useCallback, useRef } from 'react';
import type {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useHeaderScrollResponder } from '@/view/Router/HeaderScrollContext';

export function useScrollBehavior() {
  const flatList = useRef<FlatList>(null);
  const scrollToEnd = useCallback(() => {
    flatList.current?.scrollToEnd({ animated: true });
  }, []);
  const handleScroll = useHeaderScrollResponder<
    NativeSyntheticEvent<NativeScrollEvent>
  >(useCallback((e) => e.nativeEvent.contentOffset.y, []));
  return { scrollToEnd, flatList, handleScroll };
}
