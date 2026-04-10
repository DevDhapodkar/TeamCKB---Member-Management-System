import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    background: 'radial-gradient(circle at 50% 50%, #1a0f0a 0%, #0d0705 100%)',
                    color: '#f5ebe0',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    <div className="glass-panel" style={{
                        maxWidth: '500px',
                        padding: '48px',
                        border: '1px solid rgba(212,163,115,0.1)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'rgba(255,100,100,0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px'
                        }}>
                            <ShieldAlert size={40} color="#ff8080" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>System Interruption</h1>
                        <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '32px' }}>
                            An unexpected error has occurred. Our security protocols have intercepted the crash to protect your data.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="glass-button primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <RefreshCw size={18} /> Reload System
                            </button>
                            <button 
                                onClick={() => window.location.href = '/'} 
                                className="glass-button"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Home size={18} /> Return Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div style={{
                                marginTop: '32px',
                                padding: '16px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '12px',
                                fontSize: '0.8rem',
                                textAlign: 'left',
                                overflow: 'auto',
                                maxHeight: '200px',
                                color: '#ff8080',
                                border: '1px solid rgba(255,100,100,0.1)'
                            }}>
                                <code>{this.state.error?.toString()}</code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
