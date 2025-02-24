import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock the entire module to control its behavior
jest.mock('../../data/insiderThreatScenarios', () => ({
  InsiderScenarios: {
    IT: [
      {
        title: 'IT Security Scenario',
        description: 'Test IT scenario description',
        activities: [
          {
            id: 'activity1',
            employee: 'John Doe',
            department: 'IT',
            details: 'Unusual login activity',
            icon: jest.fn(),
            timeline: [{ isNormal: false }]
          }
        ]
      }
    ]
  }
}));

jest.mock('../../data/insiderThreatEducation', () => ({
  getInsiderThreatFeedback: jest.fn(() => ({
    isCorrect: true,
    feedbackSections: [{ title: 'Good Job', content: 'Excellent analysis' }]
  }))
}));

// Mock child components and dependencies
jest.mock('../../components/insider-threat/TimelineAnalysisView', () => {
  return jest.fn(() => <div data-testid="timeline-analysis-view">Mocked Timeline View</div>);
});

jest.mock('../../components/insider-threat/InsiderThreatFeedbackModal', () => {
  return jest.fn(({ onClose }) => (
    <div data-testid="insider-threat-feedback-modal">
      <button onClick={onClose}>Close Feedback</button>
    </div>
  ));
});

// Import the actual component after mocking
import InsiderThreatGame from '../../components/insider-threat/InsiderThreatGame';

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock location reload
Object.defineProperty(window, 'location', {
  value: { reload: jest.fn() },
  writable: true
});

// Helper to render component with location state passed correctly
const renderComponent = (initialEntries = ['/game'], locationState = {}) => {
  const entries = initialEntries.map((path) => ({ pathname: path, state: locationState }));
  return render(
    <MemoryRouter initialEntries={entries} initialIndex={0}>
      <Routes>
        <Route path="/game" element={<InsiderThreatGame />} />
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );
};

// Helper to dismiss the tutorial modal
const dismissTutorial = async () => {
  const beginButton = await screen.findByRole('button', {
    name: /Begin Insider Threat Investigation/i,
  });
  fireEvent.click(beginButton);
};

describe('InsiderThreatGame Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Routing and Initialization Tests
  describe('Routing and Initialization', () => {
    test('redirects to dashboard when no role is provided', async () => {
      renderComponent(['/game']);
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });

    test('renders game interface with correct role', async () => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      // The tutorial modal is expected on initial render
      await waitFor(() => {
        expect(screen.getByText(/Insider Threat Simulator/i)).toBeInTheDocument();
      });
      // Dismiss the tutorial to view underlying content
      await dismissTutorial();
      await waitFor(() => {
        // Check for a unique header and scenario title
        expect(screen.getByText(/Insider Threat Monitor/i)).toBeInTheDocument();
        expect(screen.getByText(/IT Security Scenario/i)).toBeInTheDocument();
      });
    });

    test('displays tutorial modal on initial render', async () => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      await waitFor(() => {
        expect(screen.getByText(/Insider Threat Simulator/i)).toBeInTheDocument();
        expect(screen.getByText(/Begin Insider Threat Investigation/i)).toBeInTheDocument();
      });
    });
  });



  // Game Progression Tests
  describe('Game Progression', () => {
    beforeEach(async () => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      await dismissTutorial();
    });

    test('completes scenario when activities are investigated', async () => {
      // Flag the activity to mark it as investigated
      await waitFor(() => {
        const flagButton = screen.getByRole('button', { name: /Flag Suspicious/i });
        fireEvent.click(flagButton);
      });

      // Advance timers to trigger the setTimeout in handleFlagActivity
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Verify that the completion modal appears
      await waitFor(() => {
        expect(screen.getByText(/Mission Complete!/i)).toBeInTheDocument();
      });
    });

    test('calculates final score', async () => {
      // Flag the activity
      await waitFor(() => {
        const flagButton = screen.getByRole('button', { name: /Flag Suspicious/i });
        fireEvent.click(flagButton);
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Verify that the final score display appears in the completion modal
      await waitFor(() => {
        expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
      });
    });
  });

  // Navigation Tests
  describe('Navigation', () => {
    beforeEach(async () => {
      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      await dismissTutorial();
    });

    test('returns to dashboard', async () => {
      // Click the "Back to Missions" button
      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /Back to Missions/i });
        fireEvent.click(backButton);
      });

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('allows retry on completion', async () => {
      // Flag the activity to trigger completion
      await waitFor(() => {
        const flagButton = screen.getByRole('button', { name: /Flag Suspicious/i });
        fireEvent.click(flagButton);
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Click the "Try Again" button in the completion modal
      await waitFor(() => {
        const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
        fireEvent.click(tryAgainButton);
      });

      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('handles no scenarios', async () => {
      // Directly override the IT property to an empty array
      const insiderScenarios = require('../../data/insiderThreatScenarios').InsiderScenarios;
      insiderScenarios.IT = [];

      renderComponent(['/game'], { roleId: 'IT', roleName: 'IT Security' });
      expect(screen.getByText(/No Scenarios Available/i)).toBeInTheDocument();
    });
  });
});
