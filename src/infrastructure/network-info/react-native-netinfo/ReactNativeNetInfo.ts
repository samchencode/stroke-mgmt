import NetInfo from '@react-native-community/netinfo';
import type { NetworkInfo } from '@/infrastructure/network-info/NetworkInfo';

class ReactNativeNetInfo implements NetworkInfo {
  async isInternetReachable(): Promise<boolean> {
    const info = await NetInfo.fetch();
    return !!info.isInternetReachable;
  }
}

export { ReactNativeNetInfo };
