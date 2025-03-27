import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveEmail from '../../components/email-game/InteractiveEmail';

jest.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
  CheckCircle: () => <span data-testid="check-icon">Check</span>,
  HelpCircle: () => <span data-testid="help-icon">Help</span>,
  CircleHelp: () => <span data-testid="circle-help-icon">CircleHelp</span>,
}));

// function to escape regex special characters
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('InteractiveEmail', () => {
  const sampleEmail = {
    from: "attacker@fake.com",
    subject: "Urgent Transfer Request",
    timestamp: "10:00 AM",
    content: "This is an urgent request to transfer $500 immediately. Please keep this confidential."
  };

  test('renders email header and content correctly', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText(sampleEmail.from)).toBeInTheDocument();
    expect(screen.getByText('Subject:')).toBeInTheDocument();
    expect(screen.getByText(sampleEmail.subject)).toBeInTheDocument();
    expect(screen.getByText('Date:')).toBeInTheDocument();
    expect(screen.getByText(sampleEmail.timestamp)).toBeInTheDocument();

    // check for suspicious elements
    const urgentElements = screen.getAllByText(/urgent/i);
    expect(urgentElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText('$500')).toBeInTheDocument();
    expect(screen.getByText('immediately.')).toBeInTheDocument();
    expect(screen.getByText('confidential.')).toBeInTheDocument();
  });

  test('allows word selection and highlights selected words', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    const word = screen.getByText('$500');
    // word should be clickable
    expect(word).toHaveClass('cursor-pointer');
    
    // expect the highlight class ("bg-amber-400")
    fireEvent.click(word);
    expect(word).toHaveClass('bg-amber-400');
    
    // click again to unselect
    fireEvent.click(word);
    expect(word).not.toHaveClass('bg-amber-400');
  });

  test('toggles analysis hints visibility', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    expect(screen.queryByText('Analysis Tips:')).not.toBeInTheDocument();
    
    const hintsButton = screen.getByText(/need hints/i);
    fireEvent.click(hintsButton);
    expect(screen.getByText('Analysis Tips:')).toBeInTheDocument();
    
    const hideButton = screen.getByText(/hide hints/i);
    fireEvent.click(hideButton);
    expect(screen.queryByText('Analysis Tips:')).not.toBeInTheDocument();
  });

  test('calculates score based on selected suspicious elements', async () => {
    const mockOnAnalysisComplete = jest.fn();
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={mockOnAnalysisComplete} />);
    
    // adjust regex to allow trailing whitespace.
    const suspiciousWords = [
      'urgent',
      '$500',
      'immediately.',
      'confidential.'
    ];

    suspiciousWords.forEach(wordText => {
      const escapedWord = escapeRegex(wordText);
      const elements = screen.getAllByText(new RegExp(`^${escapedWord}\\s*$`, 'i'));
      const element = elements.find(el => el.className.includes('cursor-pointer'));
      if (element) fireEvent.click(element);
    });

    const submitButton = screen.getByText('Submit Analysis');
    fireEvent.click(submitButton);
    
    const continueButton = await screen.findByRole('button', { name: /continue to response phase/i });
    fireEvent.click(continueButton);
    expect(mockOnAnalysisComplete).toHaveBeenCalled();
  });

  test('disables word selection after analysis submission', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    const word = screen.getByText('$500');
    fireEvent.click(word);
    expect(word).toHaveClass('bg-amber-400');
    
    const submitButton = screen.getByText('Submit Analysis');
    fireEvent.click(submitButton);
    
    // further clicks should not change selection.
    const urgentElements = screen.getAllByText(/urgent/i);
    const clickableUrgent = urgentElements.find(el => el.className.includes('cursor-pointer'));
    if (clickableUrgent) {
      fireEvent.click(clickableUrgent);
      expect(clickableUrgent).not.toHaveClass('bg-amber-400');
    }
  });

  test('renders help section with correct tips', () => {
    render(<InteractiveEmail email={sampleEmail} onAnalysisComplete={jest.fn()} />);
    
    const hintsButton = screen.getByText(/need hints/i);
    fireEvent.click(hintsButton);
    
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
