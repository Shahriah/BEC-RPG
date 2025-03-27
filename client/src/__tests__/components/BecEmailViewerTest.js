import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EmailViewer, ActionPanel, FeedbackPanel } from '../../components/bec-security/BecEmailViewer'; 


// mock data types for testing
jest.mock('../../types/becSecurityTypes', () => ({
  RedFlags: {},
  SecurityBehaviors: {
    VERIFICATION_REQUESTED: { points: 10 },
    PROCEDURE_FOLLOWED: { points: 20 },
  },
  VerificationSteps: {
    step1: { label: 'Verify Sender', timeRequired: 5, points: 5 },
    step2: { label: 'Check Link', timeRequired: 10, points: 10 },
  },
}));

afterEach(cleanup);


describe('EmailViewer Component', () => {
  test('renders nothing when no email is provided', () => {
    const { container } = render(<EmailViewer />);
    expect(container.firstChild).toBeNull();
  });

  test('renders email details correctly', () => {
    const email = {
      emailContent: {
        from: 'alice@example.com',
        subject: 'Test Subject',
        timestamp: '2025-02-23 12:34',
        content: 'This is a test email content.'
      }
    };

    render(<EmailViewer email={email} />);
    // expected email details
    expect(screen.getByText(/From: alice@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Subject: Test Subject/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-02-23 12:34/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a test email content./i)).toBeInTheDocument();
  });
});

describe('ActionPanel Component', () => {
  test('renders main action buttons and calls onAction with correct values', () => {
    const onAction = jest.fn();
    const onVerify = jest.fn();
    // render panel details
    render(
      <ActionPanel
        onAction={onAction}
        onVerify={onVerify}
        verificationSteps={[]}
        disabled={false}
      />
    );

    const flagButton = screen.getByText(/Flag as Suspicious/i);
    const processButton = screen.getByText(/Process Request/i);
    expect(flagButton).toBeInTheDocument();
    expect(processButton).toBeInTheDocument();

    // click flag and process buttons
    fireEvent.click(flagButton);
    expect(onAction).toHaveBeenCalledWith('flag');

    fireEvent.click(processButton);
    expect(onAction).toHaveBeenCalledWith('process');
  });

  test('renders verification steps and calls onVerify when clicked', () => {
    const onAction = jest.fn();
    const onVerify = jest.fn();
    render(
      <ActionPanel
        onAction={onAction}
        onVerify={onVerify}
        verificationSteps={[]}
        disabled={false}
      />
    );

    const verifySenderButton = screen.getByText(/Verify Sender/i);
    const checkLinkButton = screen.getByText(/Check Link/i);
    expect(verifySenderButton).toBeInTheDocument();
    expect(checkLinkButton).toBeInTheDocument();

    fireEvent.click(verifySenderButton);
    expect(onVerify).toHaveBeenCalledWith('step1');

    fireEvent.click(checkLinkButton);
    expect(onVerify).toHaveBeenCalledWith('step2');
  });

  test('disables verification step buttons if already verified or panel is disabled', () => {
    const onAction = jest.fn();
    const onVerify = jest.fn();
    const { rerender } = render(
      <ActionPanel
        onAction={onAction}
        onVerify={onVerify}
        verificationSteps={['step1']}
        disabled={false}
      />
    );
    const verifySenderButton = screen.getByRole('button', { name: /Verify Sender/i });
    const checkLinkButton = screen.getByRole('button', { name: /Check Link/i });
  
    expect(verifySenderButton).toBeDisabled();
    expect(checkLinkButton).not.toBeDisabled();
  
    rerender(
      <ActionPanel
        onAction={onAction}
        onVerify={onVerify}
        verificationSteps={[]}
        disabled={true}
      />
    );
    const flagButton = screen.getByRole('button', { name: /Flag as Suspicious/i });
    const processButton = screen.getByRole('button', { name: /Process Request/i });
    expect(flagButton).toBeDisabled();
    expect(processButton).toBeDisabled();
  });
  
});

describe('FeedbackPanel Component', () => {
  const dummyEmail = {
    fraudType: 'phishing',
    securityProtocol: "Please verify the sender's email domain.",
    learningPoints: [
      'Always check the sender\'s email address.',
      'Do not click on suspicious links.'
    ]
  };

  test('displays correct header and analysis for a correct response', () => {
    const onContinue = jest.fn();
    render(
      <FeedbackPanel
        email={dummyEmail}
        verificationSteps={['step1', 'step2']}
        expectedSteps={['step1', 'step2']}
        isCorrect={true}
        onContinue={onContinue}
      />
    );

    expect(screen.getByText(/Correct Response!/i)).toBeInTheDocument();
    expect(screen.getByText(/This was a phishing attempt\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please verify the sender's email domain\./i)).toBeInTheDocument();
  });

  test('displays correct header and analysis for an incorrect response', () => {
    const onContinue = jest.fn();
    const legitEmail = {
      securityProtocol: 'This is a normal request.',
      learningPoints: ['Check for authenticity.']
    };

    render(
      <FeedbackPanel
        email={legitEmail}
        verificationSteps={[]}
        expectedSteps={['step1', 'step2']}
        isCorrect={false}
        onContinue={onContinue}
      />
    );

    expect(screen.getByText(/Incorrect Response/i)).toBeInTheDocument();
    expect(screen.getByText(/This was a legitimate request\./i)).toBeInTheDocument();
  });

  test('renders verification steps review with correct status icons', () => {
    const onContinue = jest.fn();
    render(
      <FeedbackPanel
        email={dummyEmail}
        verificationSteps={['step1']} 
        expectedSteps={['step1', 'step2']}
        isCorrect={false}
        onContinue={onContinue}
      />
    );

    expect(screen.getByText(/Verify Sender/i)).toBeInTheDocument();
    expect(screen.getByText(/Check Link/i)).toBeInTheDocument();
  });

  test('calculates score correctly for complete verification', () => {
    const onContinue = jest.fn();

    render(
      <FeedbackPanel
        email={dummyEmail}
        verificationSteps={['step1', 'step2']}
        expectedSteps={['step1', 'step2']}
        isCorrect={true}
        onContinue={onContinue}
      />
    );
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  test('calculates score correctly for partial verification', () => {
    const onContinue = jest.fn();

    render(
      <FeedbackPanel
        email={dummyEmail}
        verificationSteps={['step1']}
        expectedSteps={['step1', 'step2']}
        isCorrect={true}
        onContinue={onContinue}
      />
    );
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('renders learning points and calls onContinue when Continue is clicked', () => {
    const onContinue = jest.fn();
    render(
      <FeedbackPanel
        email={dummyEmail}
        verificationSteps={['step1']}
        expectedSteps={['step1', 'step2']}
        isCorrect={false}
        onContinue={onContinue}
      />
    );


    dummyEmail.learningPoints.forEach(point => {
      expect(screen.getByText(point)).toBeInTheDocument();
    });

    const continueButton = screen.getByText(/Continue/i);
    fireEvent.click(continueButton);
    expect(onContinue).toHaveBeenCalled();
  });
});
