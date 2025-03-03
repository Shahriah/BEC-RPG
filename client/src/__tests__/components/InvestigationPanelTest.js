import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AlertTriangle, Info, X } from 'lucide-react';
import InvestigationPanel from '../../components/insider-threat/InvestigationPanel';


jest.mock('lucide-react', () => ({
  AlertTriangle: ({ className, ...props }) => (
    <svg data-testid="alert-triangle-icon" className={className} {...props} />
  ),
  Info: ({ className, ...props }) => (
    <svg data-testid="info-icon" className={className} {...props} />
  ),
  X: ({ className, ...props }) => (
    <svg data-testid="x-icon" className={className} {...props} />
  ),
}));


jest.mock('../../components/insider-threat/TimelineAnalysisView', () => {
  return function MockTimelineAnalysisView({ activity }) {
    return (
      <div data-testid="timeline-analysis-view">
        <div>{activity.employee} Timeline</div>
      </div>
    );
  };
});

describe('InvestigationPanel Component', () => {
  const mockActivity = {
    id: 'activity-1',
    employee: 'John Doe',
    department: 'IT Security',
    timeline: [
      { 
        isNormal: false, 
        alerts: ['Unusual login time', 'Access from unknown location'] 
      },
      { 
        isNormal: true 
      }
    ]
  };

  const defaultProps = {
    activity: mockActivity,
    onClose: jest.fn(),
    onFlagActivity: jest.fn(),
    investigatedActivities: new Set()
  };

  const renderComponent = (props = {}) => {
    const combinedProps = { ...defaultProps, ...props };
    return render(<InvestigationPanel {...combinedProps} />);
  };

  
  describe('Rendering', () => {
    test('renders nothing when no activity is provided', () => {
      const { container } = render(<InvestigationPanel activity={null} onClose={() => {}} />);
      expect(container.firstChild).toBeNull();
    });

    test('renders activity details correctly', () => {
      renderComponent();

      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('IT Security')).toBeInTheDocument();
    });

    test('renders TimelineAnalysisView with prepared activity', () => {
      renderComponent();

      
      const timelineView = screen.getByTestId('timeline-analysis-view');
      expect(timelineView).toBeInTheDocument();
      expect(timelineView).toHaveTextContent('John Doe Timeline');
    });
  });

  
  describe('Button Interactions', () => {
    test('calls onClose when Close Investigation button is clicked', () => {
      renderComponent();
      
      const closeButton = screen.getByText('Close Investigation');
      fireEvent.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when X button is clicked', () => {
      renderComponent();
      
      const xButton = screen.getByTestId('x-icon').closest('button');
      fireEvent.click(xButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onFlagActivity with correct parameters when Flag as Suspicious is clicked', () => {
      renderComponent();
      
      const flagButton = screen.getByText('Flag as Suspicious');
      fireEvent.click(flagButton);
      
      expect(defaultProps.onFlagActivity).toHaveBeenCalledWith('activity-1', true);
    });

    test('calls onFlagActivity with correct parameters when Mark as Normal is clicked', () => {
      renderComponent();
      
      const normalButton = screen.getByText('Mark as Normal');
      fireEvent.click(normalButton);
      
      expect(defaultProps.onFlagActivity).toHaveBeenCalledWith('activity-1', false);
    });
  });

  
  describe('Conditional Rendering', () => {
    test('does not show flag buttons when activity is already investigated', () => {
      const investigatedActivities = new Set(['activity-1']);
      const { queryByText } = renderComponent({ investigatedActivities });

      expect(queryByText('Flag as Suspicious')).not.toBeInTheDocument();
      expect(queryByText('Mark as Normal')).not.toBeInTheDocument();
    });

    test('shows flag buttons when activity is not investigated', () => {
      renderComponent();

      expect(screen.getByText('Flag as Suspicious')).toBeInTheDocument();
      expect(screen.getByText('Mark as Normal')).toBeInTheDocument();
    });
  });

  
  describe('Prepared Activity', () => {
    test('prepares activity with suspicious factors', () => {
      renderComponent();

      
      const timelineView = screen.getByTestId('timeline-analysis-view');
      expect(timelineView).toHaveTextContent('John Doe Timeline');
    });

    test('handles activity with missing properties', () => {
      const incompleteActivity = {
        
        timeline: []
      };

      const { getByText } = renderComponent({ activity: incompleteActivity });

      expect(getByText('Employee')).toBeInTheDocument();
      expect(getByText('Department')).toBeInTheDocument();
    });
  });

  
  describe('Styling and Accessibility', () => {
    test('modal covers full screen with background overlay', () => {
      const { container } = renderComponent();
      
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto');
    });

    test('close button has hover effect', () => {
      renderComponent();
      
      const closeIconButton = screen.getByTestId('x-icon').closest('button');
      expect(closeIconButton).toHaveClass('text-gray-500 hover:text-gray-700');
    });
  });
});