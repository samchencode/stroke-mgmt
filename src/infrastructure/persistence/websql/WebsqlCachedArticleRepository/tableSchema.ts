export type CachedArticleRow = {
  id: string;
  title: string;
  html: string;
  summary: string | null;
  designation: string;
  thumbnailUri: string;
  tagsJson: string;
  citationsJson: string;
  lastUpdatedTimestamp: number;
  shouldShowOnHomeScreen: number;
};

export type TagsJson = {
  name: string;
  description: string;
  lastUpdatedIsoString: string;
}[];

export type CitationsJson = { value: string }[];
