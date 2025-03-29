import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressCard from '../../components/ProgressCard.jsx';

describe('ProgressCard Component', () => {
  test('renders mission progress title and points', () => {
    render(<ProgressCard progress={75.6} points={300} />);
    expect(screen.getByText('Mission Progress')).toBeInTheDocument();
    expect(screen.getByText('300 Points')).toBeInTheDocument();
  });

  test('renders progress bar with correct width style based on points', () => {
    // for points=200, threshold is 500 so width = (200/500)*100 = 40%
    const { container } = render(<ProgressCard progress={50} points={200} />);
    const progressBar = container.querySelector('div.bg-blue-600');
    expect(progressBar).toHaveStyle('width: 40%');
  });

  test('displays rounded percentage and rank message correctly', () => {
    // for points=100, threshold is 500 so percentage = Math.round((100/500)*100)=20%
    render(<ProgressCard progress={33.7} points={100} />);
    expect(screen.getByText('20% to Trainee')).toBeInTheDocument();
  });

  test('displays points needed to next rank for low points', () => {
    render(<ProgressCard progress={80} points={300} />);
    expect(screen.getByText('60% to Trainee')).toBeInTheDocument();
    expect(screen.getByText('200 points needed')).toBeInTheDocument();
  });

  test('displays points needed to next rank for mid-range points', () => {
    render(<ProgressCard progress={60} points={800} />);
    expect(screen.getByText('53% to Defender')).toBeInTheDocument();
    expect(screen.getByText('700 points needed')).toBeInTheDocument();
  });

  test('displays maximum rank achieved message when applicable', () => {
    render(<ProgressCard progress={100} points={5000} />);
    expect(screen.getByText('Maximum Rank Achieved')).toBeInTheDocument();
    // Ensure no "points needed" message is rendered.
    expect(screen.queryByText(/points needed/)).toBeNull();
  });
});
