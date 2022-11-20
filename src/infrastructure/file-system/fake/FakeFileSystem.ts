import type { FileSystem } from '@/application/ports/FileSystem';

type StubbedFiles = { [path: number]: string };

class FakeFileSystem implements FileSystem {
  files: StubbedFiles = {};

  constructor(stubbedFiles: StubbedFiles) {
    this.files = stubbedFiles;
  }

  async getAssetAsString(virtualAssetModule: number): Promise<string> {
    return this.files[virtualAssetModule];
  }
}

export { FakeFileSystem };
