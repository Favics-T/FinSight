import React from 'react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' };
  }

  componentDidCatch(error) {
    console.error('Boundary error:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass rounded-xl border border-red-400/40 p-6 max-w-lg mx-auto mt-10">
          <h2 className="text-lg font-semibold">Unexpected error</h2>
          <p className="text-sm text-muted mt-2">{this.state.message}</p>
          <Button className="mt-4" onClick={this.handleReset}>Try again</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
