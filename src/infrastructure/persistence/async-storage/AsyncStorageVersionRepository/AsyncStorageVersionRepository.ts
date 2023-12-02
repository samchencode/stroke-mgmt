import type { VersionRepository } from '@/application/UpdateService';
import { Version } from '@/application/UpdateService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@AsyncStorageVersionRepository-v1';

class AsyncStorageVersionRepository implements VersionRepository {
  constructor(private readonly currentVersion: Version) {}

  static $inject = ['currentVersion'];

  async getLastUsedVersion(): Promise<Version> {
    const result = await AsyncStorage.getItem(STORAGE_KEY);
    if (result === null) {
      const isInitialInstall = (await AsyncStorage.getAllKeys()).length === 0; // V1.0.0 uses other async storage keys
      return isInitialInstall ? this.currentVersion : Version.DEFAULT_VERSION; // V1.0.0 doesn't have version saved.
    }
    return Version.deserialize(result);
  }

  async update(v: Version): Promise<void> {
    return AsyncStorage.setItem(STORAGE_KEY, v.serialize());
  }
}

export { AsyncStorageVersionRepository };
