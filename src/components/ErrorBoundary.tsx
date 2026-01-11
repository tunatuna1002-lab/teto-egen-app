import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', textAlign: 'center', color: '#333' }}>
                    <h1>오류가 발생했습니다</h1>
                    <p>페이지를 새로고침 해보세요.</p>
                    <pre style={{
                        marginTop: '20px',
                        padding: '10px',
                        background: '#f1f1f1',
                        borderRadius: '5px',
                        overflow: 'auto',
                        textAlign: 'left',
                        fontSize: '12px'
                    }}>
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
