import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import { theme } from '@/view/theme';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { ArticleListError } from '@/view/HomeScreen/components/ArticleList/ArticleListError';
import { ArticleListLoading } from '@/view/HomeScreen/components/ArticleList/ArticleListLoading';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Tag } from '@/domain/models/Tag';
import type { TagState } from '@/view/HomeScreen/components/TagList';
import { TagList } from '@/view/HomeScreen/components/TagList';
import { filterArticlesOnHomeOrByTags } from '@/domain/services/filterArticlesOnHomeOrByTags';
import { DeferredPromise } from '@/view/HomeScreen/components/ArticleList/DeferredPromise';
import { ArticleListCarousel } from '@/view/HomeScreen/components/ArticleList/ArticleListCarousel';

type ArticleListProps = {
  getAllArticles: (cb: (as: Article[]) => void) => Promise<Article[]>;
  getAllTags: (cb: (ts: Tag[]) => void) => Promise<Tag[]>;
  onSelectArticle: (id: ArticleId) => void;
  listWidth: number;
  maxItemsPerPage?: number;
  style?: StyleProp<ViewStyle>;
};

let tagsQuerySucceeded = new DeferredPromise();

function ArticleList({
  getAllArticles,
  getAllTags,
  onSelectArticle,
  listWidth,
  maxItemsPerPage = 5,
  style = {},
}: ArticleListProps) {
  const queryClient = useQueryClient();
  const onArticlesStale = (articles: Article[]) =>
    queryClient.setQueryData(['articles'], articles);

  const articleQuery = useQuery({
    queryKey: ['articles'],
    queryFn: () => getAllArticles(onArticlesStale),
    retry: false,
  });

  const [tagStates, setTagStates] = useState<TagState[]>([]);

  const makeTagStates = useCallback((tags: Tag[]) => {
    const newTagStates = tags.map((tag) => ({
      tag,
      active: false,
    }));
    setTagStates(newTagStates);
  }, []);

  const onTagsStale = async (tags: Tag[]) => {
    await tagsQuerySucceeded;
    queryClient.setQueryData(['tags'], tags);
    makeTagStates(tags);
    // reset the promise in case tagQuery is refetched and cache is stale
    tagsQuerySucceeded = new DeferredPromise();
  };

  const tagQuery = useQuery({
    queryKey: ['tags'],
    queryFn: () => getAllTags(onTagsStale),
    onSuccess: (tags) => {
      tagsQuerySucceeded.resolve(undefined);
      makeTagStates(tags);
    },
  });

  const handleToggleTagStates = useCallback(
    (v: Tag) => {
      const newTagStates = tagStates.slice();
      const tagIndex = newTagStates.findIndex((ts) => ts.tag.is(v));
      if (tagIndex === -1) return;
      const newTag: TagState = { ...newTagStates[tagIndex] };
      newTag.active = !newTag.active;
      newTagStates[tagIndex] = newTag;
      setTagStates(newTagStates);
    },
    [tagStates]
  );

  const activeTagFilters = tagStates.filter((t) => t.active).map((t) => t.tag);
  return (
    <View style={style}>
      <Text style={styles.title}>Articles</Text>
      {tagQuery.isSuccess && (
        <TagList tags={tagStates} onToggle={handleToggleTagStates} />
      )}
      <UseQueryResultView
        query={articleQuery}
        renderData={useCallback(
          (data: Article[]) => {
            const filteredArticles = filterArticlesOnHomeOrByTags(
              data,
              activeTagFilters
            );
            return (
              <ArticleListCarousel
                data={filteredArticles}
                onSelectArticle={onSelectArticle}
                listWidth={listWidth}
                maxItemsPerPage={maxItemsPerPage}
              />
            );
          },
          [activeTagFilters, listWidth, maxItemsPerPage, onSelectArticle]
        )}
        renderError={useCallback(
          () => (
            <ArticleListError />
          ),
          []
        )}
        renderLoading={useCallback(
          () => (
            <ArticleListLoading />
          ),
          []
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.fonts.titleLarge,
  },
});

export { ArticleList };
