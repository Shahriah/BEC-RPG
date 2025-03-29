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

describe('App Component', () => {
  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    );
  };

  test('renders CoverPage at root route', () => {
    renderWithRouter(['/']);
    expect(screen.getByTestId('cover-page')).toBeInTheDocument();
  });

  test('renders game components at their routes', () => {
    renderWithRouter(['/game/email']);
    expect(screen.getByTestId('email-game')).toBeInTheDocument();

    cleanup();
    renderWithRouter(['/game/bec-security']);
    expect(screen.getByTestId('bec-game')).toBeInTheDocument();

    cleanup();
    renderWithRouter(['/game/insider-threat']);
    expect(screen.getByTestId('insider-game')).toBeInTheDocument();

    cleanup();
    renderWithRouter(['/game/data-security']);
    expect(screen.getByTestId('data-game')).toBeInTheDocument();
  });

  test('redirects to CoverPage for invalid routes', () => {
    renderWithRouter(['/invalid-route']);
    expect(screen.getByTestId('cover-page')).toBeInTheDocument();
  });
});
