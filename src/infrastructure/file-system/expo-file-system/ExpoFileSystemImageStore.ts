import type { ImageStore } from '@/domain/models/Image';
import { CachedImageMetadata } from '@/domain/models/Image';
import * as ExpoFileSystem from 'expo-file-system';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEST_DIRECTORY = `${ExpoFileSystem.cacheDirectory}/images-v1`;

const MIME_TYPES = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WEBP: 'image/webp',
  SVG: 'image/svg+xml',
  UNKNOWN: 'application/octet-stream',
};

function extToMimeType(ext: string) {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return MIME_TYPES.JPEG;
    case '.png':
      return MIME_TYPES.PNG;
    case '.gif':
      return MIME_TYPES.GIF;
    case '.webp':
      return MIME_TYPES.WEBP;
    case '.svg':
      return MIME_TYPES.SVG;
    default:
      return MIME_TYPES.UNKNOWN;
  }
}

class ExpoFileSystemImageStore implements ImageStore {
  ready: Promise<void>;

  constructor() {
    this.ready = this.prepareCacheDirectory();
  }

  private async prepareCacheDirectory() {
    const info = await ExpoFileSystem.getInfoAsync(DEST_DIRECTORY);
    if (!info.exists) await ExpoFileSystem.makeDirectoryAsync(DEST_DIRECTORY);
  }

  async getFileAsBase64Url(metadata: CachedImageMetadata): Promise<string> {
    await this.ready;
    const base64String = await ExpoFileSystem.readAsStringAsync(
      metadata.getFilePath(),
      {
        encoding: 'base64',
      }
    );
    return `data:${metadata.getMimeType()};base64,${base64String}`;
  }

  async saveFileFromUrl(url: string): Promise<CachedImageMetadata> {
    await this.ready;
    const ext = url.match(/\.[a-zA-Z]+$/)?.[0] ?? '';
    const destination = `${DEST_DIRECTORY}/${uuidv4()}${ext}`;
    const result = await ExpoFileSystem.downloadAsync(url, destination);
    return new CachedImageMetadata(url, result.uri, extToMimeType(ext));
  }

  async fileExists(path: string): Promise<boolean> {
    await this.ready;
    const info = await ExpoFileSystem.getInfoAsync(path);
    return info.exists;
  }

  async deleteAll(): Promise<void> {
    await this.ready;
    const promise = ExpoFileSystem.deleteAsync(DEST_DIRECTORY, {
      idempotent: true,
    }).then(() => this.prepareCacheDirectory());
    this.ready = promise;
    await promise;
  }
}

export { ExpoFileSystemImageStore };
