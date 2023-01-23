import * as Linking from 'expo-linking';

export async function openUrl(url: string) {
  return Linking.openURL(url);
}
