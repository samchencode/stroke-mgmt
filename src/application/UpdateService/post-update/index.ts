import { PostV1_1_0 } from '@/application/UpdateService/post-update/PostV1_1_0';
import type {
  PostUpdateChangeClass,
  PostUpdateChange,
} from '@/application/UpdateService/post-update/PostUpdateChange';

export const postUpdateChanges: PostUpdateChangeClass[] = [PostV1_1_0];
export { PostUpdateChangeClass, PostUpdateChange };
