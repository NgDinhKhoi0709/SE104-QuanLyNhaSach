import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/auth/LoginPage';

// Mock the auth context
const mockLogin = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    loading: false
  })
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Helper function to render LoginPage with router
const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    renderLoginPage();
    
    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập tên đăng nhập')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập mật khẩu')).toBeInTheDocument();
    expect(screen.getByText('Quên mật khẩu?')).toBeInTheDocument();
  });

  it('switches to forgot password form when clicking forgot password link', () => {
    renderLoginPage();
    
    const forgotPasswordLink = screen.getByText('Quên mật khẩu?');
    fireEvent.click(forgotPasswordLink);
    
    expect(screen.getByText('Quên mật khẩu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập email của bạn')).toBeInTheDocument();
  });

  it('goes back to login form when clicking back button', () => {
    renderLoginPage();
    
    // Switch to forgot password
    fireEvent.click(screen.getByText('Quên mật khẩu?'));
    expect(screen.getByText('Quên mật khẩu')).toBeInTheDocument();
    
    // Go back to login - look for button with text containing the back text
    const backButton = screen.getByText(/Quay lại đăng nhập/);
    fireEvent.click(backButton);
    
    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nhập tên đăng nhập')).toBeInTheDocument();
  });

  it('submits login form with valid credentials', async () => {
    mockLogin.mockResolvedValueOnce({
      id: 1,
      username: 'testuser',
      role_id: 1
    });

    renderLoginPage();
    
    const usernameInput = screen.getByPlaceholderText('Nhập tên đăng nhập');
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu');
    const submitButton = screen.getByRole('button', { name: 'Đăng nhập' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  it('displays error message for invalid credentials', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Tên đăng nhập hoặc mật khẩu không đúng'));

    renderLoginPage();
    
    const usernameInput = screen.getByPlaceholderText('Nhập tên đăng nhập');
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu');
    const submitButton = screen.getByRole('button', { name: 'Đăng nhập' });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Tên đăng nhập hoặc mật khẩu không đúng')).toBeInTheDocument();
    });
  });

  it('displays loading state during form submission', async () => {
    // Mock delayed login response that takes longer to resolve
    let resolveLogin;
    const loginPromise = new Promise(resolve => {
      resolveLogin = resolve;
    });
    
    mockLogin.mockImplementationOnce(() => loginPromise);

    renderLoginPage();
    
    const usernameInput = screen.getByPlaceholderText('Nhập tên đăng nhập');
    const passwordInput = screen.getByPlaceholderText('Nhập mật khẩu');
    const submitButton = screen.getByRole('button', { name: 'Đăng nhập' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    // Check that the button is disabled during submission (more reliable than text check)
    expect(submitButton).toBeDisabled();
    
    // Resolve the login to clean up
    resolveLogin({
      id: 1,
      username: 'testuser',
      role_id: 1
    });
  });
});
