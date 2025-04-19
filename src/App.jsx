import React, { Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthorizationProvider } from './contexts/AuthorizationContext';
import AppRoutes from './routes';
import Loading from './components/common/Loading';
import { preventDropdownOverlap } from './utils/modalUtils';

// Component xử lý lỗi
class ErrorFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{
          padding: '20px',
          maxWidth: '800px',
          margin: '30px auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#d32f2f' }}>Có lỗi xảy ra</h2>
          <p>Đã có lỗi xảy ra trong ứng dụng. Vui lòng tải lại trang.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Tải lại trang
          </button>
          <details style={{ marginTop: '20px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Chi tiết lỗi</summary>
            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'auto' }}>
              <h4>Lỗi:</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error && this.state.error.toString()}</pre>
              {this.state.error && this.state.error.stack && (
                <div>
                  <h4>Stack Trace:</h4>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
                </div>
              )}
              {this.state.errorInfo && (
                <div>
                  <h4>Component Stack:</h4>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    // Khởi tạo event listener ngăn dropdown đè lên modal
    preventDropdownOverlap();
  }, []);

  return (
    <ErrorFallback>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <AuthProvider>
            <AuthorizationProvider>
              <AppRoutes />
            </AuthorizationProvider>
          </AuthProvider>
        </Suspense>
      </BrowserRouter>
    </ErrorFallback>
  );
}

export default App;
