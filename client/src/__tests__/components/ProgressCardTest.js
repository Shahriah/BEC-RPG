
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressCard from '../../components/ProgressCard.jsx';

describe('ProgressCard Component', () => {
  test('renders mission progress title and points', () => {
    render(<ProgressCard progress={75.6} points={300} />);
    expect(screen.getByText('Mission Progress')).toBeInTheDocument();
    expect(screen.getByText('300 Points')).toBeInTheDocument();
  });

  test('renders progress bar with correct width style', () => {
    const progress = 50;
    const { container } = render(<ProgressCard progress={progress} points={200} />);
    
    const progressBar = container.querySelector('div.bg-blue-600');
    expect(progressBar).toHaveStyle(`width: ${progress}%`);
  });

  test('displays rounded percentage of missions complete', () => {
    render(<ProgressCard progress={33.7} points={100} />);
    expect(screen.getByText('34% Missions Complete')).toBeInTheDocument();
  });

  test('displays points to next rank for low points', () => {
    
    
    render(<ProgressCard progress={80} points={300} />);
    expect(screen.getByText('200 points to Trainee')).toBeInTheDocument();
  });

  test('displays points to next rank for mid-range points', () => {
    
    
    render(<ProgressCard progress={60} points={800} />);
    expect(screen.getByText('700 points to Defender')).toBeInTheDocument();
  });

  test('does not display next rank message when maximum rank achieved', () => {
    
    
    render(<ProgressCard progress={100} points={5000} />);
    expect(screen.queryByText(/points to Maximum Rank Achieved/)).toBeNull();
  });
});
