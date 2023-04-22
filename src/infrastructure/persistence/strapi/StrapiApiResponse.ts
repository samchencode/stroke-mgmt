export type StrapiArticleData = {
  id: number;
  attributes: {
    Title: string;
    Body: string;
    Designation: 'Article' | 'Stroke Facts' | 'Stroke Signs' | 'Disclaimer';
    ArticleId: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

export type StrapiAlgorithmData = {
  id: number;
  attributes: {
    Title: string;
    Summary: string;
    Body: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    AlgorithmId: string;
    outcomes: {
      id: number;
      Title: string;
      Body: string;
      next: {
        data: { id: number } | null;
      };
      criterion?:
        | {
            id: number;
            Type: 'LessThan' | 'GreaterThan';
            Value: number;
          }
        | { id: number; Type: 'None'; Value: null };
    }[];
    switches: {
      id: number;
      Label: string;
      Description: string | null;
      levels: {
        id: number;
        Label: string;
        Value: number;
      }[];
    }[];
  };
};

export type StrapiImageFormat = {
  name: string;
  hash: string;
  ext: string;
  mime: 'image/jpeg' | 'image/png';
  path: null;
  width: number;
  height: number;
  size: number;
  url: string;
};

export type StrapiImage = {
  id: number;
  attributes: {
    name: string;
    alternativeText: null;
    caption: null;
    width: number;
    height: number;
    formats: {
      thumbnail: StrapiImageFormat;
      large: StrapiImageFormat;
      small: StrapiImageFormat;
      medium: StrapiImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: null;
    provider: string;
    provider_metadata: null;
    createdAt: string;
    updatedAt: string;
  };
};

export type StrapiPlaceholderImageData = {
  id: 1;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Images: {
      data: StrapiImage[];
    };
  };
};

export type StrapiApiResponse<Data> = {
  data: Data | Data[];
  meta: {
    pagination: {
      page: 1;
      pageSize: 25;
      pageCount: 1;
      total: 1;
    };
  };
};

export type StrapiErrorResponse = {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
};
