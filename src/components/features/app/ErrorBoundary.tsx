import * as React from "react";

export class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }> {
  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(error, info);
  }

  render() {
    return this.props.children;
  }
}
