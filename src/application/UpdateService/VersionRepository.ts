import type { Version } from '@/application/UpdateService/Version';

interface VersionRepository {
  getLastUsedVersion(): Promise<Version>;
  update(v: Version): Promise<void>;
}

export type { VersionRepository };
