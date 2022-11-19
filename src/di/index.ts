import { Injector } from 'didi';
import { module } from '@/di/dependencies';

const container = new Injector([module]);

export { container };
