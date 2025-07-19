// Import necessary testing utilities
import '@testing-library/jest-dom';

// Mock any global objects or functions needed for testing
global.console = {
  ...console,
  // Override console methods if needed
  // error: jest.fn(),
  // warn: jest.fn(),
};

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.NODE_ENV = 'test';

// Add any global test setup here
beforeEach(() => {
  // Reset mocks or other setup before each test
  jest.clearAllMocks();
});
