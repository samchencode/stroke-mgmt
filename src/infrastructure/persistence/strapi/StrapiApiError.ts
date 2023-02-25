import type { StrapiErrorResponse } from '@/infrastructure/persistence/strapi/StrapiApiResponse';

class StrapiApiError extends Error {
  name = 'StrapiApiError';

  constructor(errorResponse: StrapiErrorResponse) {
    super();
    const statusCode = errorResponse?.error?.status;
    const errorMessage = errorResponse?.error?.message;
    const errorName = errorResponse?.error?.name;

    this.message = `${statusCode} - ${errorMessage} (${errorName})`;
  }
}

export { StrapiApiError };
