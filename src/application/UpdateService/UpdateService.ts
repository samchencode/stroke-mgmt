import type { Version } from '@/application/UpdateService/Version';
import type { VersionRepository } from '@/application/UpdateService/VersionRepository';
import type {
  PostUpdateChange,
  PostUpdateChangeClass,
} from '@/application/UpdateService/post-update';
import type { Injector } from 'didi';

class UpdateService {
  constructor(
    private readonly postUpdateChanges: PostUpdateChangeClass[],
    private readonly currentVersion: Version,
    private readonly versionRepository: VersionRepository,
    private readonly injector: Injector
  ) {}

  static $inject = [
    'postUpdateChanges',
    'currentVersion',
    'versionRepository',
    'injector',
  ];

  async performPostUpdateChangesIfNecessary(): Promise<void> {
    if (!(await this.shouldPerformPostUpdateChanges())) return;
    await this.performNecessaryPostUpdateChanges();
  }

  private async shouldPerformPostUpdateChanges() {
    const versionDuringPreviousRun =
      await this.versionRepository.getLastUsedVersion();
    return versionDuringPreviousRun.isLessThan(this.currentVersion);
  }

  private async performNecessaryPostUpdateChanges() {
    const versionDuringPreviousRun =
      await this.versionRepository.getLastUsedVersion();

    // eslint-disable-next-line no-restricted-syntax
    for (const postUpdateClass of this.postUpdateChanges) {
      if (versionDuringPreviousRun.isLessThan(postUpdateClass.version)) {
        // eslint-disable-next-line no-await-in-loop
        await this.applyPostUpdateChange(postUpdateClass);
      }
    }

    await this.versionRepository.update(this.currentVersion);
  }

  private async applyPostUpdateChange(
    postUpdateChangeClass: PostUpdateChangeClass
  ) {
    const change = this.injector.instantiate<PostUpdateChange>(
      postUpdateChangeClass as never
    );
    await change.apply();
  }
}

export { UpdateService };
