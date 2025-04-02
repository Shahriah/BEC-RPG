import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('React Router')) return;
  if (args[0]?.includes?.('babel-preset-react-app')) return;
  if (args[0]?.includes?.('punycode')) return;
  originalWarn(...args);
};

window.fs = {
  readFile: jest.fn().mockImplementation(() => Promise.resolve(new Uint8Array())),
};

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