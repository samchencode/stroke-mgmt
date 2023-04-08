import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

type Props<T> = {
  query: UseQueryResult<T>;
  renderError: (e: unknown) => JSX.Element;
  renderData: (data: T) => JSX.Element;
  renderLoading: () => JSX.Element;
  children?: ReactNode;
};

function UseQueryResultView<T>({
  query,
  renderError,
  renderData,
  renderLoading,
}: Props<T>) {
  const { status, data, error } = query;
  if (status === 'loading') {
    return renderLoading();
  }
  if (status === 'error') {
    return renderError(error);
  }
  return renderData(data);
}

export { UseQueryResultView };
