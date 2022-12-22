import * as ExpoFileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';

class ExpoAssetFileSystem implements FileSystem<'expo'> {
  async getAssetAsString(virtualAssetModule: number) {
    const asset = await Asset.fromModule(virtualAssetModule).downloadAsync();
    return ExpoFileSystem.readAsStringAsync(asset.localUri as string);
  }
}

export { ExpoAssetFileSystem };
