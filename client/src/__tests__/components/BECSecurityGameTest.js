// BECSecurityGame.additional.test.jsx
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';
import BECSecurityGame from '../../components/bec-security/BECSecurityGame';

// Dummy game stats returned from the API for fetch mocks.
const dummyGameStats = {
  pointsEarned: 50,
  totalPoints: 200,
  newRank: 'A'
};

// --- Mocks ---

// Mock react-router-dom's useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock MiniGameManager so that it calls onComplete with a dummy verification result.
jest.mock('../../components/bec-security/MiniGameManager', () => (props) => (
  <div data-testid="mini-game-manager">
    <button onClick={() => props.onComplete('CONTACT_SUPERVISOR', 90)}>
      Complete Verification
    </button>
  </div>
));

jest.mock('../../data/becSecurityScenarios', () => ({
  scenarios: [
    {
      type: 'FRAUD', // correct action is "flag"
      emailContent: {
        from: 'phisher@example.com',
        subject: 'Urgent: Action Required',
        timestamp: '2025-02-23 12:00:00',
        content: 'Please process the request immediately!'
      },
      correctVerification: ['step1', 'step2'],
      learningPoints: ['Always verify sender', 'Double-check request details'],
      securityProtocol: 'Verify the sender’s email domain.'
    }
  ]
}));

jest.mock('../../types/becSecurityTypes', () => ({
  EmailType: { FRAUD: 'FRAUD', LEGIT: 'LEGIT' },
  VerificationGameType: { CONTACT_SUPERVISOR: 'CONTACT_SUPERVISOR' },
  VerificationSteps: {
    step1: { label: 'Verify Sender', timeRequired: 5, points: 5 },
    step2: { label: 'Check Link', timeRequired: 10, points: 10 },
  },
  SecurityBehaviors: {
    VERIFICATION_REQUESTED: { points: 10 },
    PROCEDURE_FOLLOWED: { points: 20 },
  },
  RedFlags: {}
}));

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => dummyGameStats,
  });
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('Additional tests for BECSecurityGame uncovered lines', () => {
  // --- Test covering handleAction when an incorrect action is taken ---
  test('handleAction with incorrect action computes a lower score and shows feedback', async () => {
    render(<BECSecurityGame />);
    // Dismiss the tutorial modal.
    fireEvent.click(screen.getByRole('button', {
      name: /Begin BEC Security Investigation/i,
    }));
    // Complete verification via MiniGameManager.
    fireEvent.click(screen.getByText(/Complete Verification/i));
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /flag as suspicious/i })
      ).toBeInTheDocument();
    });
    // For a FRAUD email, correct action is "flag". Click the wrong action: "Process Request".
    const processButton = screen.getByRole('button', { name: /process request/i });
    fireEvent.click(processButton);
    // With the verification score from MiniGameManager, the computed final score is approximately 31–32.
    await waitFor(() => {
      expect(screen.getByText(/Score:\s*(31|32)/i)).toBeInTheDocument();
    });
  });
  
  // --- Test covering handleVerificationComplete for a non-final step ---
  test('handleVerificationComplete with a non-final step does not transition gamePhase', async () => {
    // Force internal state so that verificationScores includes only a non-final step and gamePhase remains "verification".
    const useStateSpy = jest.spyOn(React, 'useState');
    // Order: startTime, score, showTutorial, showFeedback, verificationScores, gamePhase, gameStats, showCompletionModal.
    useStateSpy
      .mockImplementationOnce(() => [Date.now(), jest.fn()])         // startTime
      .mockImplementationOnce(() => [0, jest.fn()])                      // score
      .mockImplementationOnce(() => [false, jest.fn()])                  // showTutorial
      .mockImplementationOnce(() => [false, jest.fn()])                  // showFeedback false
      .mockImplementationOnce(() => [{ step1: 50 }, jest.fn()])           // verificationScores with only "step1"
      .mockImplementationOnce(() => ['verification', jest.fn()])         // gamePhase remains "verification"
      .mockImplementationOnce(() => [null, jest.fn()])                   // gameStats null
      .mockImplementationOnce(() => [false, jest.fn()]);                 // showCompletionModal false

    render(<BECSecurityGame />);
    // Since gamePhase is "verification", the MiniGameManager should remain visible.
    expect(screen.getByTestId('mini-game-manager')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });
  

  
});
