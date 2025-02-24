// __tests__/InteractiveEmail.test.jsx
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveEmail from '../../components/email-game/InteractiveEmail';

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
  CheckCircle: () => <span data-testid="check-icon">Check</span>,
  HelpCircle: () => <span data-testid="help-icon">Help</span>,
  CircleHelp: () => <span data-testid="circle-help-icon">CircleHelp</span>,
}));

describe('InteractiveEmail', () => {
  const sampleEmail = {
    from: "attacker@fake.com",
    subject: "Urgent Transfer Request",
    timestamp: "10:00 AM",
    content: "This is an urgent request to transfer $500 immediately. Please keep this confidential."
  };

  test('renders email header and content correctly', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    // Check header fields
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText(sampleEmail.from)).toBeInTheDocument();
    expect(screen.getByText('Subject:')).toBeInTheDocument();
    expect(screen.getByText(sampleEmail.subject)).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText(sampleEmail.timestamp)).toBeInTheDocument();

    // Verify content parts
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('immediately.')).toBeInTheDocument();
    expect(screen.getByText('confidential.')).toBeInTheDocument();
  });

  test('allows word selection and highlights selected words', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    const word = screen.getByText('$500');
    expect(word).toHaveClass('cursor-pointer');
    
    fireEvent.click(word);
    expect(word).toHaveClass('bg-yellow-100');
    
    fireEvent.click(word);
    expect(word).not.toHaveClass('bg-yellow-100');
  });

  test('toggles analysis hints visibility', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    expect(screen.queryByText('Analysis Tips:')).not.toBeInTheDocument();
    
    const hintsButton = screen.getByText(/need hints/i);
    fireEvent.click(hintsButton);
    expect(screen.getByText('Analysis Tips:')).toBeInTheDocument();
    
    // Now should show "Hide Hints"
    const hideButton = screen.getByText(/hide hints/i);
    fireEvent.click(hideButton);
    expect(screen.queryByText('Analysis Tips:')).not.toBeInTheDocument();
  });

  test('calculates score based on selected suspicious elements', async () => {
    const mockOnAnalysisComplete = jest.fn();
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={mockOnAnalysisComplete} />);

    // Click suspicious elements
    const suspiciousWords = [
      'urgent',
      '$500',
      'immediately.',
      'confidential.'
    ];

    suspiciousWords.forEach(word => {
      const element = screen.getByText(word);
      fireEvent.click(element);
    });

    const submitButton = screen.getByText('Submit Analysis');
    fireEvent.click(submitButton);

    // Complete the analysis
    const continueButton = screen.getByRole('button', { name: /continue to response phase/i });
    fireEvent.click(continueButton);
    expect(mockOnAnalysisComplete).toHaveBeenCalled();
  });

  test('disables word selection after analysis submission', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    const word = screen.getByText('$500');
    fireEvent.click(word);
    expect(word).toHaveClass('bg-yellow-100');
    
    const submitButton = screen.getByText('Submit Analysis');
    fireEvent.click(submitButton);
    
    const anotherWord = screen.getByText('urgent');
    fireEvent.click(anotherWord);
    expect(anotherWord).not.toHaveClass('bg-yellow-100');
  });

  test('renders help section with correct tips', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    const hintsButton = screen.getByText(/need hints/i);
    fireEvent.click(hintsButton);
    
    // Check for actual tips shown in the component
    const expectedTips = [
      'Click on suspicious words or phrases in the email',
      'Look for unusual urgency or pressure tactics',
      'Check for suspicious email domains and requests'
    ];
    
    expectedTips.forEach(tip => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });
});