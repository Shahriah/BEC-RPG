// src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Suppress React Router warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  // Suppress React Router future warnings
  if (args[0]?.includes?.('React Router')) return;
  // Suppress Babel plugin warning
  if (args[0]?.includes?.('babel-preset-react-app')) return;
  // Suppress punycode deprecation warning
  if (args[0]?.includes?.('punycode')) return;
  originalWarn(...args);
};

// Mock window.fs for file operations
window.fs = {
  readFile: jest.fn().mockImplementation(() => Promise.resolve(new Uint8Array())),
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});