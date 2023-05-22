import { AlgorithmNotFoundError } from '@/domain/models/Algorithm';
import { ArticleNotFoundError } from '@/domain/models/Article';
import type { Getter } from '@/domain/services/Cache/Getter';

export async function retryUntilSuccess<T>(
  getter: Getter<T>,
  maxRetries = 3
): Promise<T> {
  try {
    const result = await getter();
    return result;
  } catch (e) {
    if (e instanceof ArticleNotFoundError) throw e;
    if (e instanceof AlgorithmNotFoundError) throw e;
    if (maxRetries !== 0) return retryUntilSuccess(getter, maxRetries - 1);
    throw e;
  }
}
