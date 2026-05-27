"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-white px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Có lỗi xảy ra</h2>
          <p className="mt-1 text-sm text-gray-500">
            {this.state.error?.message || "Đã xảy ra lỗi không mong muốn"}
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-6 flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label="Thử lại"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
