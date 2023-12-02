import type { Version } from '@/application/UpdateService/Version';

interface PostUpdateChange {
  apply: () => Promise<void>;
}

interface PostUpdateChangeClass {
  version: Version;
}

export type { PostUpdateChange, PostUpdateChangeClass };
