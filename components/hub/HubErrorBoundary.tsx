"use client";

import React from "react";

export default class HubErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Hub Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white p-12 font-mono flex flex-col items-center justify-center">
          <h1 className="text-2xl text-rose-500 mb-6">CRITICAL_SYSTEM_FAILURE</h1>
          <div className="max-w-4xl w-full bg-zinc-900 p-8 border border-rose-900/30 overflow-auto">
             <p className="text-rose-400 mb-4 font-bold">ERROR: {this.state.error?.message}</p>
             <pre className="text-[10px] opacity-40 leading-loose">
               {this.state.error?.stack}
             </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 border border-white/20 hover:bg-white/5 uppercase tracking-[0.4em] text-[10px]"
          >
            Attempt System Re-initialization
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
