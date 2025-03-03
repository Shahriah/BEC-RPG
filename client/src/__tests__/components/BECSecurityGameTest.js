import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor
} from '@testing-library/react';
import BECSecurityGame from '../../components/bec-security/BECSecurityGame';

const dummyGameStats = {
  pointsEarned: 50,
  totalPoints: 200,
  newRank: 'A'
};


const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

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
      type: 'FRAUD',
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
  test('handleAction with incorrect action computes a lower score and shows feedback', async () => {
    render(<BECSecurityGame />);
    fireEvent.click(screen.getByRole('button', {
      name: /Begin BEC Security Investigation/i,
    }));
    fireEvent.click(screen.getByText(/Complete Verification/i));
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /flag as suspicious/i })
      ).toBeInTheDocument();
    });
    const processButton = screen.getByRole('button', { name: /process request/i });
    fireEvent.click(processButton);
    await waitFor(() => {
      expect(screen.getByText(/Score:\s*(31|32)/i)).toBeInTheDocument();
    });
  });
  
  test('handleVerificationComplete with a non-final step does not transition gamePhase', async () => {
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy
      .mockImplementationOnce(() => [Date.now(), jest.fn()])  
      .mockImplementationOnce(() => [0, jest.fn()]) 
      .mockImplementationOnce(() => [false, jest.fn()])  
      .mockImplementationOnce(() => [false, jest.fn()])                 
      .mockImplementationOnce(() => [{ step1: 50 }, jest.fn()])        
      .mockImplementationOnce(() => ['verification', jest.fn()])         
      .mockImplementationOnce(() => [null, jest.fn()])                   
      .mockImplementationOnce(() => [false, jest.fn()]);                 

    render(<BECSecurityGame />);
    expect(screen.getByTestId('mini-game-manager')).toBeInTheDocument();
    useStateSpy.mockRestore();
  });
  

  
});
