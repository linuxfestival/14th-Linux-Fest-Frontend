import { Component, type ErrorInfo, type ReactNode } from "react";
import CrashFallback from "./CrashFallback";

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application rendering failed", error, info.componentStack);
  }

  render() {
    return this.state.hasError ? <CrashFallback /> : this.props.children;
  }
}
