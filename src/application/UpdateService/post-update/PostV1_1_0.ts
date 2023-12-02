import type { ClearCacheAction } from '@/application/ClearCacheAction';
import { Version } from '@/application/UpdateService/Version';
import type {
  PostUpdateChange,
  PostUpdateChangeClass,
} from '@/application/UpdateService/post-update/PostUpdateChange';

const PostV1_1_0: PostUpdateChangeClass = class implements PostUpdateChange {
  static version = new Version(1, 1, 0);

  constructor(private clearCacheAction: ClearCacheAction) {}

  static $inject: string[] = ['clearCacheAction'];

  async apply(): Promise<void> {
    await this.clearCacheAction.execute();
  }
};

export { PostV1_1_0 };
