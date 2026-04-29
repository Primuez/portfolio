'use client';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="w-full h-[400px] border border-cyan/20 rounded-xl overflow-hidden relative flex items-center justify-center bg-bg">
          <p className="font-mono text-xs text-text-muted">3D viewer unavailable</p>
        </div>
      );
    }
    return this.props.children;
  }
}
