import fs from 'fs';
import path from 'path';
import type { FileSystem } from '@/infrastructure/file-system/FileSystem';

const readUtf8File = (p: string) =>
  new Promise<string>((resolve, reject) => {
    fs.readFile(p, 'utf-8', (err, data) => (err ? reject(err) : resolve(data)));
  });

class NodeFileSystem implements FileSystem<'jest'> {
  async getAssetAsString(aliasedFilePath: string): Promise<string> {
    const filePath = aliasedFilePath.replace(
      /^@/,
      path.resolve(__dirname, '../../..')
    );
    return readUtf8File(filePath);
  }
}

export { NodeFileSystem };
