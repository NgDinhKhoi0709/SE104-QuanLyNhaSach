import '@testing-library/jest-dom';

// Mock fetch API
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeEach(() => {
  // Reset fetch mock before each test
  fetch.mockClear();
  
  // Mock console methods but allow important errors through
  console.error = jest.fn((message) => {
    if (message.includes('Not implemented: HTMLCanvasElement') || 
        message.includes('fetch is not defined') ||
        message.includes('Error fetching') ||
        message.includes('Warning: An update to') ||
        message.includes('not wrapped in act')) {
      return; // Suppress these specific errors
    }
    originalConsoleError(message);
  });
  
  console.warn = jest.fn((message) => {
    if (message.includes('React Router Future Flag Warning')) {
      return; // Suppress React Router warnings
    }
    originalConsoleWarn(message);
  });
  
  console.log = jest.fn(); // Suppress all console.log in tests
});

afterEach(() => {
  // Restore console methods after each test
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});
