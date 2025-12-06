"use client"
import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="bg-[#1e1814] border border-[#3d2e23] rounded-lg p-8 max-w-md w-full text-center">
                        <AlertTriangle className="mx-auto mb-4 text-red-400" size={48} />
                        <h2 className="text-2xl font-bold text-[#e6d2c0] mb-2">Something went wrong</h2>
                        <p className="text-[#a18072] mb-6">We encountered an unexpected error. Please try refreshing the page.</p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left text-xs text-[#a18072] mb-4 bg-[#2a211c] p-4 rounded">
                                <summary className="cursor-pointer mb-2 font-medium">Error details</summary>
                                <pre className="whitespace-pre-wrap break-words">{this.state.error.message}{'\n\n'}{this.state.error.stack}</pre>
                            </details>
                        )}
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-[#c38e70] text-[#1e1814] font-medium rounded-full hover:bg-opacity-90 transition-colors">Refresh Page</button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;