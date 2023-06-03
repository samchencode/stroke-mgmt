import React, { useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import type { ListRenderItemInfo } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import { ArticleListColumn } from '@/view/HomeScreen/components/ArticleList/ArticleListColumn';
import { ListEmptyComponent } from '@/view/HomeScreen/components/ArticleList/ListEmptyComponent';

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

  return (
    <FlatList
      data={batchedData}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}

export { ArticleListCarousel };
