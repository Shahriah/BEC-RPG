import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookOpen, X } from 'lucide-react';
import InsiderThreatFeedbackModal from '../../components/insider-threat/InsiderThreatFeedbackModal';


jest.mock('lucide-react', () => ({
  BookOpen: ({ className, ...props }) => (
    <svg data-testid="book-open-icon" className={className} {...props} />
  ),
  X: ({ className, ...props }) => (
    <svg data-testid="x-icon" className={className} {...props} />
  ),
}));

describe('InsiderThreatFeedbackModal Component', () => {
  const mockFeedback = {
    isCorrect: true,
    feedbackSections: [
      {
        title: 'First Insight',
        content: 'Detailed explanation of the first insight.'
      },
      {
        title: 'Second Insight',
        content: 'Additional details about the second insight.'
      }
    ]
  };

  const mockOnClose = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      feedback: mockFeedback,
      onClose: mockOnClose
    };
    return render(<InsiderThreatFeedbackModal {...defaultProps} {...props} />);
  };

  
  describe('Rendering', () => {
    test('renders nothing when no feedback is provided', () => {
      const { container } = render(<InsiderThreatFeedbackModal feedback={null} onClose={() => {}} />);
      expect(container.firstChild).toBeNull();
    });

    test('renders modal with correct title for correct insight', () => {
      renderComponent();
      expect(screen.getByText('Excellent Insight!')).toBeInTheDocument();
      expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
    });

    test('renders modal with correct title for incorrect insight', () => {
      const incorrectFeedback = {
        ...mockFeedback,
        isCorrect: false
      };
      renderComponent({ feedback: incorrectFeedback });
      expect(screen.getByText('Learning Opportunity')).toBeInTheDocument();
    });
  });

  
  describe('Content Rendering', () => {
    test('renders all feedback sections', () => {
      renderComponent();
      
      
      expect(screen.getByText('First Insight')).toBeInTheDocument();
      expect(screen.getByText('Detailed explanation of the first insight.')).toBeInTheDocument();
      
      
      expect(screen.getByText('Second Insight')).toBeInTheDocument();
      expect(screen.getByText('Additional details about the second insight.')).toBeInTheDocument();
    });

    test('alternates background colors for feedback sections', () => {
      const { container } = renderComponent();
      
      const sections = container.querySelectorAll('[class*="bg-blue-50"], [class*="bg-yellow-50"]');
      expect(sections).toHaveLength(2);
      
      
      expect(sections[0]).toHaveClass('bg-blue-50');
      
      
      expect(sections[1]).toHaveClass('bg-yellow-50');
    });
  });

  
  describe('Interactions', () => {
    test('calls onClose when close button is clicked', () => {
      renderComponent();
      
      const closeButton = screen.getByTestId('x-icon').closest('button');
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Continue Investigation button is clicked', () => {
      renderComponent();
      
      const continueButton = screen.getByText('Continue Investigation');
      fireEvent.click(continueButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  
  describe('Message Rendering', () => {
    test('renders correct message for correct insight', () => {
      renderComponent();
      
      expect(screen.getByText('Great job identifying potential insider threats!')).toBeInTheDocument();
    });

    test('renders correct message for incorrect insight', () => {
      const incorrectFeedback = {
        ...mockFeedback,
        isCorrect: false
      };
      renderComponent({ feedback: incorrectFeedback });
      
      expect(screen.getByText('Every investigation is a learning opportunity to improve security awareness.')).toBeInTheDocument();
    });
  });

  
  describe('Accessibility and Styling', () => {
    test('modal covers full screen with background overlay', () => {
      const { container } = renderComponent();
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50');
    });

    test('close button has hover effect', () => {
      renderComponent();
      
      const closeButton = screen.getByTestId('x-icon').closest('button');
      expect(closeButton).toHaveClass('text-gray-500 hover:text-gray-700');
    });
  });
});