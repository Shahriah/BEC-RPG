import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Clock, TrendingUp, AlertTriangle, Activity, Info } from 'lucide-react';
import TimelineAnalysisView from '../../components/insider-threat/TimelineAnalysisView';

// Mock Lucide icons 
jest.mock('lucide-react', () => ({
  Clock: ({ className, ...props }) => (
    <svg data-testid="clock-icon" className={className} {...props} />
  ),
  TrendingUp: ({ className, ...props }) => (
    <svg data-testid="trending-up-icon" className={className} {...props} />
  ),
  AlertTriangle: ({ className, ...props }) => (
    <svg data-testid="alert-triangle-icon" className={className} {...props} />
  ),
  Activity: ({ className, ...props }) => (
    <svg data-testid="activity-icon" className={className} {...props} />
  ),
  Info: ({ className, ...props }) => (
    <svg data-testid="info-icon" className={className} {...props} />
  ),
}));

describe('TimelineAnalysisView Component', () => {
  const mockActivity = {
    employee: 'John Doe',
    department: 'IT Security',
    normalPattern: 'Regular 9-5 work hours, local network access',
    timeline: [
      {
        date: '2023-06-15',
        time: '09:30',
        action: 'Login',
        details: 'Normal workstation login',
        location: 'Office Main Campus',
        isNormal: true
      },
      {
        date: '2023-06-15',
        time: '22:45',
        action: 'Network Access',
        details: 'Accessed restricted database',
        location: 'Remote',
        isNormal: false,
        alerts: [
          'Unusual access time',
          'Unauthorized database query'
        ]
      }
    ]
  };

  const renderComponent = (props = {}) => {
    const defaultProps = {
      activity: mockActivity
    };
    return render(<TimelineAnalysisView {...defaultProps} {...props} />);
  };

  // Rendering Tests
  describe('Rendering', () => {
    test('does not explicitly render employee and department', () => {
      renderComponent();

      // Since the component doesn't explicitly render employee/department, 
      // we'll check they are not breaking anything
      expect(screen.getByText('Historical Activity Pattern')).toBeInTheDocument();
    });

    test('renders normal pattern', () => {
      renderComponent();

      expect(screen.getByText('Normal Pattern: Regular 9-5 work hours, local network access')).toBeInTheDocument();
    });
  });

  // Timeline Rendering Tests
  describe('Timeline Rendering', () => {
    test('renders all timeline activities', () => {
      renderComponent();

      // Normal activity details
      expect(screen.getByText('2023-06-15 at 09:30')).toBeInTheDocument();
      expect(screen.getByText('Login: Normal workstation login')).toBeInTheDocument();
      expect(screen.getByText('Location: Office Main Campus')).toBeInTheDocument();

      // Abnormal activity details
      expect(screen.getByText('2023-06-15 at 22:45')).toBeInTheDocument();
      expect(screen.getByText('Network Access: Accessed restricted database')).toBeInTheDocument();
      expect(screen.getByText('Location: Remote')).toBeInTheDocument();
    });

    test('applies correct styling for normal and abnormal activities', () => {
      const { container } = renderComponent();

      // Check timeline items
      const timelineItems = container.querySelectorAll('.border-l-2');
      expect(timelineItems[0]).toHaveClass('border-blue-200');
      expect(timelineItems[1]).toHaveClass('border-red-200');

      // Check timeline item indicators
      const indicators = container.querySelectorAll('.w-4.h-4.rounded-full');
      expect(indicators[0]).toHaveClass('bg-blue-100 border-blue-400');
      expect(indicators[1]).toHaveClass('bg-red-100 border-red-400');
    });
  });

  // Abnormal Activities Tests
  describe('Abnormal Activities', () => {
    test('renders abnormal activities section', () => {
      renderComponent();

      expect(screen.getByText('Abnormal Activities Detected')).toBeInTheDocument();
    });

    test('renders alerts for abnormal activities', () => {
      renderComponent();

      expect(screen.getByText('Unusual access time')).toBeInTheDocument();
      expect(screen.getByText('Unauthorized database query')).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('handles activity with no timeline', () => {
      const activityWithoutTimeline = {
        employee: 'Jane Smith',
        department: 'HR'
      };

      renderComponent({ activity: activityWithoutTimeline });

      expect(screen.getByText('Normal Pattern: No established normal pattern')).toBeInTheDocument();
    });

    test('handles activity with only normal or only abnormal activities', () => {
      const onlyNormalActivities = {
        ...mockActivity,
        timeline: [mockActivity.timeline[0]]
      };

      const { queryByText } = renderComponent({ activity: onlyNormalActivities });

      // Check normal activity is rendered
      expect(screen.getByText('Login: Normal workstation login')).toBeInTheDocument();
      
      // Abnormal activities section should not be present
      expect(queryByText('Abnormal Activities Detected')).not.toBeInTheDocument();
    });

    test('handles missing employee and department', () => {
      const incompleteActivity = {
        timeline: []
      };

      renderComponent({ activity: incompleteActivity });

      expect(screen.getByText('Normal Pattern: No established normal pattern')).toBeInTheDocument();
    });
  });

  // Styling Tests
  describe('Styling Consistency', () => {
    test('uses consistent section styling', () => {
      const { container } = renderComponent();

      const sections = container.querySelectorAll('.bg-blue-50.p-4.rounded-lg, .bg-red-50.p-4.rounded-lg');
      expect(sections.length).toBe(2);
    });

    test('applies correct text styling for normal and abnormal activities', () => {
      renderComponent();

      const normalActivityText = screen.getByText('Login: Normal workstation login');
      const abnormalActivityText = screen.getByText('Network Access: Accessed restricted database');

      expect(normalActivityText).toHaveClass('text-gray-600');
      expect(abnormalActivityText).toHaveClass('text-red-600 font-medium');
    });
  });
});