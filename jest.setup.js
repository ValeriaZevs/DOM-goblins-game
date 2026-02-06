// jest.setup.js
import '@testing-library/jest-dom';

// Mock ��� localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock ��� requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 0);

global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Mock ��� console (�����������)
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};
