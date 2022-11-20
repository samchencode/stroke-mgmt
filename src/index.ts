import registerRootComponent from 'expo/build/launch/registerRootComponent';
import type { Type as App } from '@/view/App';
import { container } from '@/di';

const Root = container.get<App>('App');

registerRootComponent(Root);
