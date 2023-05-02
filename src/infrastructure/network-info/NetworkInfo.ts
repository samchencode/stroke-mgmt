interface NetworkInfo {
  isInternetReachable(): Promise<boolean>;
}

export type { NetworkInfo };
