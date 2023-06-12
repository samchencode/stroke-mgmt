import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CachedIntroSequenceRepository,
  IntroSequence,
} from '@/domain/models/IntroSequence';
import { CachedIntroSequenceNotFoundError } from '@/domain/models/IntroSequence';
import {
  deserializeIntroSequence,
  serializeIntroSequence,
} from '@/infrastructure/persistence/async-storage/AsyncStorageCachedIntroSequenceRepository/serializer';

const STORAGE_KEY = '@AsyncStorageCachedIntroSequenceRepository-v1';

class AsyncStorageCachedIntroSequenceRepository
  implements CachedIntroSequenceRepository
{
  async save(v: IntroSequence): Promise<void> {
    const jsonString = serializeIntroSequence(v);
    return AsyncStorage.setItem(STORAGE_KEY, jsonString);
  }

  async clearCache(): Promise<void> {
    return AsyncStorage.removeItem(STORAGE_KEY);
  }

  async isEmpty(): Promise<boolean> {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    return storedValue === null;
  }

  async get(): Promise<IntroSequence> {
    const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonString === null) throw new CachedIntroSequenceNotFoundError();
    return deserializeIntroSequence(jsonString);
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

export { AsyncStorageCachedIntroSequenceRepository };
