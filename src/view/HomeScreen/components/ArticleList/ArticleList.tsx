import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Article, ArticleId } from '@/domain/models/Article';
import { theme } from '@/view/theme';
import { UseQueryResultView } from '@/view/lib/UseQueryResultView';
import { ArticleListFilled } from '@/view/HomeScreen/components/ArticleList/ArticleListFilled';
import { ArticleListError } from '@/view/HomeScreen/components/ArticleList/ArticleListError';
import { ArticleListLoading } from '@/view/HomeScreen/components/ArticleList/ArticleListLoading';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Tag } from '@/domain/models/Tag';
import type { TagState } from '@/view/HomeScreen/components/TagList';
import { TagList } from '@/view/HomeScreen/components/TagList';
import { filterArticlesOnHomeOrByTags } from '@/domain/services/filterArticlesOnHomeOrByTags';

type ArticleListProps = {
  getAllArticles: (cb: (as: Article[]) => void) => Promise<Article[]>;
  getAllTags: () => Promise<Tag[]>;
  onSelectArticle: (id: ArticleId) => void;
  style?: StyleProp<ViewStyle>;
};

function ArticleList({
  getAllArticles,
  getAllTags,
  onSelectArticle,
  style = {},
}: ArticleListProps) {
  const queryClient = useQueryClient();
  const onStale = (articles: Article[]) =>
    queryClient.setQueryData(['articles'], articles);

  const articleQuery = useQuery({
    queryKey: ['articles'],
    queryFn: () => getAllArticles(onStale),
    retry: false,
  });

  const [tagStates, setTagStates] = useState<TagState[]>([]);

  const tagQuery = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
    onSuccess: useCallback((tags: Tag[]) => {
      const newTagStates = tags.map((tag) => ({
        tag,
        active: false,
      }));
      setTagStates(newTagStates);
    }, []),
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
              <ArticleListFilled
                data={filteredArticles}
                onSelectArticle={onSelectArticle}
              />
            );
          },
          [activeTagFilters, onSelectArticle]
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
