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
      criterion?: {
        id: number;
        Type: 'LessThan' | 'GreaterThan' | 'None';
        Value: number;
      };
    }[];
    switches: {
      id: number;
      Label: string;
      Value: number;
      SwitchId: string;
    }[];
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
