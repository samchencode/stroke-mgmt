type RequireAssetModuleOnPlatform = {
  jest: string;
  expo: number;
};

type ValueOf<T> = T extends { [K in string | number | symbol]: infer R }
  ? R
  : never;

interface FileSystem<T> {
  getAssetAsString(
    virtualAssetModule: T extends keyof RequireAssetModuleOnPlatform
      ? RequireAssetModuleOnPlatform[T]
      : ValueOf<RequireAssetModuleOnPlatform>
  ): Promise<string>;
}

export { FileSystem };
