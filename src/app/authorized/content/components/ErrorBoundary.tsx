import React, {ReactNode} from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // clear all
        // delete session storage
        // delete cookies

        sessionStorage.clear();
        console.error('Ein Fehler ist aufgetreten:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h1>Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.</h1>

                </div>
            );
        }

        return this.props.children;
    }
}


export default ErrorBoundary;