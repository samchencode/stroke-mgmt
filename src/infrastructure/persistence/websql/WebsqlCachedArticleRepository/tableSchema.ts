export type CachedArticleRow = {
  id: string;
  title: string;
  html: string;
  summary: string | null;
  designation: string;
  thumbnailUri: string;
  tagsJson: string;
  lastUpdatedTimestamp: number;
  shouldshowOnHomeScreen: number;
};

export type TagsJson = {
  name: string;
  description: string;
}[];
