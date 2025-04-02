import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as router from 'react-router-dom';
import EmailGame from '../../components/email-game/EmailGame';

global.fetch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  MemoryRouter: ({ children }) => <div>{children}</div>
}));

jest.mock('../../data/emailScenarios', () => ({
  EmailScenarios: {
    ADMIN: [
      {
        title: 'Test Scenario',
        context: 'Test Context',
        educationalPoints: ['Point 1', 'Point 2'],
        initialSituation: {
          from: 'test@example.com',
          subject: 'Test Subject',
          content: 'Test Content',
          timestamp: '10:00 AM'
        },
        options: [
          { text: 'Option 1', correct: true, points: 80, feedback: 'Good job!' },
          { text: 'Option 2', correct: false, points: 40, feedback: 'Try again!' }
        ]
      }
    ]
  }
}));

jest.mock('../../components/email-game/InteractiveEmail', () => {
  return function MockInteractiveEmail({ onAnalysisComplete }) {
    return (
      <div data-testid="interactive-email">
        <div className="bg-white rounded-lg">
          <button onClick={() => onAnalysisComplete(80)}>Submit Analysis</button>
        </div>
      </div>
    );
  };
});

describe('EmailGame Component', () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockReset();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          pointsEarned: 100,
          totalPoints: 500,
          rank: 'Expert'
        })
    });
    
    router.useNavigate.mockImplementation(() => mockNavigate);
    router.useLocation.mockImplementation(() => ({
      state: { roleId: 'admin', roleName: 'Administrator' }
    }));
  });
  
  // helper function now accepts a flag to optionally complete the full modal flow.
  const completeGameFlow = async (fullFlow = true) => {
    const submitButton = screen.getByText(/Submit Analysis/i);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Option 1'));
    
    if (fullFlow) {
      await waitFor(() => {
        expect(screen.getByText('View Performance')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('View Performance'));
      
      await waitFor(() => {
        expect(screen.getByText('Continue')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Continue'));
    }
  };

  test('handles missing role ID', () => {
    router.useLocation.mockImplementation(() => ({ state: {} }));
    render(<EmailGame />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('completes game flow and shows completion modal', async () => {
    render(<EmailGame />);
    await completeGameFlow();

    await waitFor(() => {
      expect(screen.getByText('Mission Complete!')).toBeInTheDocument();
      expect(screen.getByText(/Points Earned: 100/)).toBeInTheDocument();
    });
  });

  test('shows try again button in completion modal', async () => {
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
  
    render(<EmailGame />);
    await completeGameFlow();
  
    await waitFor(() => {
      expect(screen.getByText('Mission Complete!')).toBeInTheDocument();
    });
  
    const retryButton = screen.getByText('Try Again', { exact: true });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
  
    expect(mockReload).toHaveBeenCalled();
  });
  
  test('handles API errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<EmailGame />);
    await completeGameFlow(false);
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error saving progress:',
        expect.any(Error)
      );
    });
  
    consoleSpy.mockRestore();
  });
});
