type IdExtractor<T> = (v: T) => string;

type Versioned = {
  getLastUpdated: () => Date;
};

type ToChange<T> = {
  toCreate: T[];
  toUpdate: T[];
  toDelete: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GroupedData<T, SNull = any, CNull = any> = {
  source: SNull extends false ? T : null;
  cache: CNull extends false ? T : null;
};

type DataGroupedById<T> = Record<string, GroupedData<T>>;

function shouldDelete<T>(g: GroupedData<T>): g is GroupedData<T, true, false> {
  return g.source === null && g.cache !== null;
}

function shouldCreate<T>(g: GroupedData<T>): g is GroupedData<T, false, true> {
  return g.source !== null && g.cache === null;
}

function areMatched<T>(g: GroupedData<T>): g is GroupedData<T, false, false> {
  return g.source !== null && g.cache !== null;
}

function determineCacheOperations<T extends Versioned>(
  sourceData: T[],
  cacheData: T[],
  getId: IdExtractor<T>
): ToChange<T> {
  let resultsById = sourceData.reduce((ag, v) => {
    const key = getId(v);
    // eslint-disable-next-line no-param-reassign
    ag[key] = { source: v, cache: null };
    return ag;
  }, {} as DataGroupedById<T>);
  resultsById = cacheData.reduce((ag, v) => {
    const key = getId(v);
    const s = ag[key]?.source ?? null;
    // eslint-disable-next-line no-param-reassign
    ag[key] = { source: s, cache: v };
    return ag;
  }, resultsById);

  const articles = Object.values(resultsById);
  const toDelete = articles.filter(shouldDelete).map((v) => getId(v.cache));
  const toCreate = articles.filter(shouldCreate).map((v) => v.source);
  const toUpdate = articles
    .filter(areMatched)
    .filter((v) => v.source.getLastUpdated() > v.cache.getLastUpdated())
    .map((v) => v.source);

  return { toDelete, toCreate, toUpdate };
}

export { determineCacheOperations };
