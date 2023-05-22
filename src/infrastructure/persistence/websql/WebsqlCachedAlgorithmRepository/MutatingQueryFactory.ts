import type { Query } from '@/infrastructure/persistence/websql/helpers';

interface MutatingQueryFactory {
  makeSaveQuery(): Query;
  makeUpdateQuery(): Query;
}

export type { MutatingQueryFactory };
