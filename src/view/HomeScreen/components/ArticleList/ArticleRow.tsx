import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import { theme } from '@/view/theme';
import type { ArticleId } from '@/domain/models/Article';

type ArticleRowProps = {
  id: ArticleId;
  title: string;
  onSelectArticle: (id: ArticleId) => void;
};

function ArticleRow({ id, title, onSelectArticle }: ArticleRowProps) {
  const handleSelectArticle = useCallback(
    () => onSelectArticle(id),
    [id, onSelectArticle]
  );

  return (
    <TouchableHighlight
      underlayColor={theme.colors.surfaceVariant}
      onPress={handleSelectArticle}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: 'https://plchldr.co/i/300x200?&bg=54e73f&fc=fff&text=image',
          }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 12,
    height: 64 + 12 * 2,
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    marginRight: theme.spaces.md,
    height: 64,
    width: 96,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    ...theme.fonts.bodyLarge,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    ...theme.fonts.bodyMedium,
  },
});

export { ArticleRow };
