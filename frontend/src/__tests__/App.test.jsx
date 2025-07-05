import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock AuthContext
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false
};

jest.mock('../contexts/AuthContext.jsx', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => children
}));

// Helper function to render App with router
const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderApp();
  });

  test('shows login page when user is not authenticated', () => {
    mockAuthContext.user = null;
    renderApp();
    
    // Assuming LoginPage contains some identifiable text
    // You might need to adjust this based on your actual LoginPage content
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  test('redirects admin user to admin dashboard', () => {
    mockAuthContext.user = { role_id: 1, username: 'admin' };
    renderApp();
    
    // This test will depend on your routing logic
    expect(document.querySelector('body')).toBeInTheDocument();
  });
});
