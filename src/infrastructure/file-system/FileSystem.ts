interface FileSystem {
  getAssetAsString(virtualAssetModule: number): Promise<string>;
}

export { FileSystem };
