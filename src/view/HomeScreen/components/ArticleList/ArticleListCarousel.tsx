import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleListColumn } from '@/view/HomeScreen/components/ArticleList/ArticleListColumn';
import { CarouselPaginationControls } from '@/view/HomeScreen/components/ArticleList/CarouselPaginationControl';
import { ListEmptyComponent } from '@/view/HomeScreen/components/ArticleList/ListEmptyComponent';
import { useCarouselPaginationControls } from '@/view/HomeScreen/components/ArticleList/useCarouselPaginationControls';
import React, { useCallback, useMemo } from 'react';
import type { ListRenderItemInfo } from 'react-native';
import { FlatList, View } from 'react-native';

type Props = {
  maxItemsPerPage?: number;
  data: Article[];
  onSelectArticle: (id: ArticleId) => void;
  listWidth: number;
};

function arrayToBatches<T>(elementsPerBatch: number, arr: T[]): T[][] {
  if (elementsPerBatch < 1)
    throw Error(`cannot make batches with ${elementsPerBatch} elements`);
  const numBatches = Math.ceil(arr.length / elementsPerBatch);
  const indicies = new Array(numBatches)
    .fill(undefined)
    .map((_, i) => [
      i * elementsPerBatch,
      Math.min((i + 1) * elementsPerBatch, arr.length),
    ]);

  return indicies.map((is) => arr.slice(is[0], is[1]));
}

function ArticleListCarousel({
  maxItemsPerPage = 5,
  data,
  onSelectArticle,
  listWidth,
}: Props) {
  const batchedData = useMemo(
    () => arrayToBatches(maxItemsPerPage, data),
    [data, maxItemsPerPage]
  );
  const totalPages = batchedData.length;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Article[]>) => (
      <ArticleListColumn
        data={item}
        onSelectArticle={onSelectArticle}
        maxRows={maxItemsPerPage}
        columnWidth={listWidth}
      />
    ),
    [listWidth, maxItemsPerPage, onSelectArticle]
  );

  const {
    flatListRef,
    handleScroll,
    handlePressLeft,
    handlePressRight,
    activePageIdx,
  } = useCarouselPaginationControls(listWidth, totalPages);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={batchedData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        onScroll={handleScroll}
        ListEmptyComponent={ListEmptyComponent}
      />
      <CarouselPaginationControls
        pageIdx={activePageIdx}
        totalPages={totalPages}
        onPressLeft={handlePressLeft}
        onPressRight={handlePressRight}
      />
    </View>
  );
}

export { ArticleListCarousel };
