import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MiniGameManager from '../../components/bec-security/MiniGameManager';

// Mock entire module before any imports
jest.mock('../../types/becSecurityTypes', () => {
  const mockVerificationGameType = {
    CHECK_SENDER: 'check_sender',
    VERIFY_POLICY: 'verify_policy',
    CONTACT_SUPERVISOR: 'contact_supervisor'
  };

  const mockVerificationGameStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed'
  };

  const mockVerificationSteps = {
    [mockVerificationGameType.CHECK_SENDER]: {
      id: 'check_sender',
      title: 'Check Sender Details',
      description: 'Verify the authenticity of email senders',
      icon: jest.fn(() => <div data-testid="search-icon" />),
      requiredScore: 70,
      maxScore: 100
    },
    [mockVerificationGameType.VERIFY_POLICY]: {
      id: 'verify_policy',
      title: 'Verify Security Policy',
      description: 'Ensure requests comply with security protocols',
      icon: jest.fn(() => <div data-testid="shield-icon" />),
      requiredScore: 70,
      maxScore: 100
    },
    [mockVerificationGameType.CONTACT_SUPERVISOR]: {
      id: 'contact_supervisor',
      title: 'Contact Supervisor',
      description: 'Follow proper escalation procedures',
      icon: jest.fn(() => <div data-testid="phone-icon" />),
      requiredScore: 70,
      maxScore: 100
    }
  };

  return {
    VerificationGameType: mockVerificationGameType,
    VerificationGameStatus: mockVerificationGameStatus,
    VerificationSteps: mockVerificationSteps
  };
});

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Trophy: jest.fn(() => <div data-testid="trophy-icon" />),
  ArrowRight: jest.fn(() => <div data-testid="arrow-right-icon" />)
}));

// Explicit game component mocks
jest.mock('../../components/bec-security/CheckSenderGame', () => {
  return function MockCheckSenderGame({ onComplete }) {
    return (
      <div data-testid="check-sender-game">
        <button onClick={() => onComplete(80)}>
          Submit Sender Check
        </button>
      </div>
    );
  };
});

jest.mock('../../components/bec-security/PolicyVerificationGame', () => {
  return function MockPolicyVerificationGame({ onComplete }) {
    return (
      <div data-testid="policy-verification-game">
        <button onClick={() => onComplete(70)}>
          Submit Policy Check
        </button>
      </div>
    );
  };
});

jest.mock('../../components/bec-security/ContactSupervisorGame', () => {
  return function MockContactSupervisorGame({ onComplete }) {
    return (
      <div data-testid="contact-supervisor-game">
        <button onClick={() => onComplete(90)}>
          Submit Supervisor Contact
        </button>
      </div>
    );
  };
});

describe('MiniGameManager Component', () => {
  const mockEmail = {
    emailContent: 'Test email content'
  };
  const mockOnComplete = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      email: mockEmail,
      onComplete: mockOnComplete
    };
    return render(<MiniGameManager {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    test('renders verification steps', () => {
      renderComponent();

      expect(screen.getByText('Check Sender Details')).toBeInTheDocument();
      expect(screen.getByText('Verify Security Policy')).toBeInTheDocument();
      expect(screen.getByText('Contact Supervisor')).toBeInTheDocument();
    });

    test('renders initial check sender game', () => {
      renderComponent();

      const checkSenderGame = screen.getByTestId('check-sender-game');
      expect(checkSenderGame).toBeInTheDocument();
    });
  });

  describe('Game Progression', () => {
    test('moves to policy verification after check sender', async () => {
      renderComponent();

      // Find and click game submission button
      const checkSenderSubmitButton = screen.getByText('Submit Sender Check');
      fireEvent.click(checkSenderSubmitButton);

      // Wait for and click continue button
      await waitFor(() => {
        const continueButton = screen.getByText('Continue to Next Step');
        fireEvent.click(continueButton);
      });

      // Check policy verification game is rendered
      expect(screen.getByTestId('policy-verification-game')).toBeInTheDocument();
    });
  });

  describe('Scoring', () => {
    test('calculates total score on final game completion', async () => {
      renderComponent();

      // Complete all games
      const checkSenderSubmitButton = screen.getByText('Submit Sender Check');
      fireEvent.click(checkSenderSubmitButton);

      await waitFor(() => {
        const continueButton1 = screen.getByText('Continue to Next Step');
        fireEvent.click(continueButton1);
      });

      const policySubmitButton = screen.getByText('Submit Policy Check');
      fireEvent.click(policySubmitButton);

      await waitFor(() => {
        const continueButton2 = screen.getByText('Continue to Next Step');
        fireEvent.click(continueButton2);
      });

      const supervisorSubmitButton = screen.getByText('Submit Supervisor Contact');
      fireEvent.click(supervisorSubmitButton);

      // Check onComplete was called with final game type and calculated score
      // (80 + 70 + 90) / 3 = 80
      expect(mockOnComplete).toHaveBeenCalledWith(
        'contact_supervisor', 
        80
      );
    });
  });

  describe('Progress Tracker', () => {
    test('updates progress tracker styling based on game state', async () => {
      renderComponent();

      // Initial state - first step should be highlighted
      const initialFirstStep = screen.getByText('Check Sender Details')
        .closest('[class*="p-4 rounded-lg"]');
      
      expect(initialFirstStep).toHaveClass('border-blue-500');
      expect(initialFirstStep).toHaveClass('bg-blue-50');

      // Complete first game
      const checkSenderSubmitButton = screen.getByText('Submit Sender Check');
      fireEvent.click(checkSenderSubmitButton);

      await waitFor(() => {
        const continueButton = screen.getByText('Continue to Next Step');
        fireEvent.click(continueButton);
      });

      // Reselect steps after state change
      const completedFirstStep = screen.getByText('Check Sender Details')
        .closest('[class*="p-4 rounded-lg"]');
      const currentSecondStep = screen.getByText('Verify Security Policy')
        .closest('[class*="p-4 rounded-lg"]');

      expect(completedFirstStep).toHaveClass('border-green-200');
      expect(completedFirstStep).toHaveClass('bg-green-50');
      expect(currentSecondStep).toHaveClass('border-blue-500');
      expect(currentSecondStep).toHaveClass('bg-blue-50');
    });
  });
});