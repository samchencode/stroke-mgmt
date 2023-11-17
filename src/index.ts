import 'react-native-gesture-handler';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import type { Type as App } from '@/view/App/App';
import { container } from '@/di';
// crypto.getRandomValues polyfill for React Native for uuid package
import 'react-native-get-random-values';
import '@/promisePolyfill';

const Root = container.get<App>('App');

registerRootComponent(Root);
