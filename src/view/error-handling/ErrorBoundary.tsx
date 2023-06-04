import { ScreenErrorView } from '@/view/error-handling/ScreenErrorView';
import React from 'react';

type Props = {
  children: React.ReactNode;
};
type State = {
  error: unknown;
  hasError: boolean;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: unknown) {
    return { error, hasError: true };
  }

  render() {
    const { children } = this.props;
    const { error, hasError } = this.state;

    if (hasError) return <ScreenErrorView error={error} showRestartButton />;
    return children;
  }
}

export { ErrorBoundary };
