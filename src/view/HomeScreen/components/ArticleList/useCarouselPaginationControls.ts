import { useRef, useState, useCallback } from 'react';
import type {
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

function useCarouselPaginationControls(listWidth: number, totalPages: number) {
  const flatListRef = useRef<FlatList>(null);
  const [activePageIdx, setActivePageIdx] = useState(0);
  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollProgress = nativeEvent.contentOffset.x;
      const pageIdx = Math.round(scrollProgress / listWidth);
      setActivePageIdx(pageIdx);
    },
    [listWidth]
  );
  const handlePressLeft = useCallback(() => {
    if (!flatListRef.current) return;
    const destPageIdx = activePageIdx - 1;
    if (destPageIdx < 0) return;
    const destOffset = destPageIdx * listWidth;
    flatListRef.current.scrollToOffset({ offset: destOffset });
  }, [activePageIdx, listWidth]);

  const handlePressRight = useCallback(() => {
    if (!flatListRef.current) return;
    const destPageIdx = activePageIdx + 1;
    if (destPageIdx > totalPages - 1) return;
    const destOffset = destPageIdx * listWidth;
    flatListRef.current.scrollToOffset({ offset: destOffset });
  }, [activePageIdx, listWidth, totalPages]);

  return {
    flatListRef,
    handleScroll,
    handlePressLeft,
    handlePressRight,
    activePageIdx,
  };
}

export { useCarouselPaginationControls };
