import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../components/CoverPage', () => () => (
  <div data-testid="cover-page">Cover Page Mock</div>
));
jest.mock('../components/Dashboard', () => () => (
  <div data-testid="dashboard">Dashboard Mock</div>
));
jest.mock('../components/email-game/EmailGame', () => () => (
  <div data-testid="email-game">Email Game Mock</div>
));
jest.mock('../components/bec-security/BECSecurityGame', () => () => (
  <div data-testid="bec-game">BEC Game Mock</div>
));
jest.mock('../components/insider-threat/InsiderThreatGame', () => () => (
  <div data-testid="insider-game">Insider Threat Mock</div>
));
jest.mock('../components/data-security/DataSecurityGame', () => () => (
  <div data-testid="data-game">Data Game Mock</div>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => children,
}));

describe('Routing Integration', () => {
  afterEach(() => {
    cleanup();
  });

  const renderWithRouter = (initialPath) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    );
  };

  test('routing to root shows Cover Page', () => {
    renderWithRouter('/');
    expect(screen.getByTestId('cover-page')).toBeInTheDocument();
  });

  test('routing to dashboard shows Dashboard', () => {
    renderWithRouter('/dashboard');
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('routing to email game', () => {
    renderWithRouter('/game/email');
    expect(screen.getByTestId('email-game')).toBeInTheDocument();
  });

  test('routing to BEC security game', () => {
    renderWithRouter('/game/bec-security');
    expect(screen.getByTestId('bec-game')).toBeInTheDocument();
  });

  test('routing to insider threat game', () => {
    renderWithRouter('/game/insider-threat');
    expect(screen.getByTestId('insider-game')).toBeInTheDocument();
  });

  test('routing to data security game', () => {
    renderWithRouter('/game/data-security');
    expect(screen.getByTestId('data-game')).toBeInTheDocument();
  });

  test('routing to invalid path redirects to Cover Page', () => {
    renderWithRouter('/invalid-path');
    expect(screen.getByTestId('cover-page')).toBeInTheDocument();
  });

  test('handles routes with query parameters', () => {
    renderWithRouter('/game/email?difficulty=hard');
    expect(screen.getByTestId('email-game')).toBeInTheDocument();
  });
});
