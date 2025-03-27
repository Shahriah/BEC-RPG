import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataSecurityGame from '../../components/data-security/DataSecurityGame';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  MemoryRouter: ({ children }) => <div>{children}</div>,
}));

// mock DataSecurityScenarioCard component
jest.mock('../../components/data-security/DataSecurityScenarioCard', () => ({
  ScenarioCard: ({ scenario }) => (
    <div data-testid="scenario-card">{scenario.question}</div>
  ),
  ChoiceSelector: ({ title, selected, onChange, options, disabled }) => (
    <div>
      <label>{title}</label>
      {options.map(option => (
        <button key={option} onClick={() => onChange(option)} disabled={disabled}>
          {option}
        </button>
      ))}
    </div>
  ),
  FeedbackPanel: ({ onNext }) => (
    <div data-testid="feedback-panel">
      <div>Feedback Panel</div>
      <button onClick={onNext}>Next</button>
    </div>
  ),
}));

jest.mock('../../data/dataSecurityScenarios', () => ({

  // mock scenarios
  scenarios: [
    {
      question: 'Test Scenario 1',
      correctChoices: { classification: 'Option1', access: 'OptionA', security: 'OptionX' },
      explanation: 'Explanation 1',
      securityTips: 'Tip 1',
    },
    {
      question: 'Test Scenario 2',
      correctChoices: { classification: 'Option2', access: 'OptionB', security: 'OptionY' },
      explanation: 'Explanation 2',
      securityTips: 'Tip 2',
    },
  ],
}));

jest.mock('../../types/dataSecurityTypes', () => ({
  DataClassification: ['Option1', 'Option2'],
  AccessLevels: ['OptionA', 'OptionB'],
  SecurityMeasures: ['OptionX', 'OptionY'],
}));

describe('DataSecurityGame Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial UI correctly', () => {
    render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );

    // check header and score
    expect(screen.getByRole('heading', { name: /Data Guardian/i })).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();

    // check that the first scenario is displayed
    expect(screen.getByTestId('scenario-card')).toHaveTextContent('Test Scenario 1');

    // check that the ChoiceSelectors render their labels
    expect(screen.getByText('Data Classification')).toBeInTheDocument();
    expect(screen.getByText('Access Level')).toBeInTheDocument();
    expect(screen.getByText('Security Measures')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Submit Decisions/i })).toBeDisabled();
  });

  test('navigates back to missions when Back to Missions button is clicked', () => {
    render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );
    const backButton = screen.getByRole('button', { name: /Back to Missions/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('submit button is disabled until all choices are selected', () => {
    render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /Submit Decisions/i });
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByText('Option1')); // For Data Classification
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByText('OptionA')); // For Access Level
    expect(submitButton).toBeDisabled();

    fireEvent.click(screen.getByText('OptionX')); // For Security Measures
    expect(submitButton).not.toBeDisabled();
  });

  test('shows feedback panel after submitting decisions', async () => {
    render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Option1'));
    fireEvent.click(screen.getByText('OptionA'));
    fireEvent.click(screen.getByText('OptionX'));

    const submitButton = screen.getByRole('button', { name: /Submit Decisions/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('feedback-panel')).toBeInTheDocument();
    });
  });

  test('proceeds to next scenario when clicking Next in feedback panel', async () => {
    render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );

    // complete first scenario
    fireEvent.click(screen.getByText('Option1'));
    fireEvent.click(screen.getByText('OptionA'));
    fireEvent.click(screen.getByText('OptionX'));
    fireEvent.click(screen.getByRole('button', { name: /Submit Decisions/i }));

    await waitFor(() => screen.getByTestId('feedback-panel'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // the ScenarioCard should now show the second scenario's question
    expect(screen.getByTestId('scenario-card')).toHaveTextContent('Test Scenario 2');

    const progressBar = document.querySelector('div.bg-blue-600');
    expect(progressBar).toHaveStyle('width: 100%');
  });

  test('calls fetch and shows completion modal on last scenario submission', async () => {
    const fakeResponse = {
      pointsEarned: 10,
      totalPoints: 100,
      rank: 'Novice',
    };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue(fakeResponse),
    });

    render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );
    // scneario 1
    fireEvent.click(screen.getByText('Option1'));
    fireEvent.click(screen.getByText('OptionA'));
    fireEvent.click(screen.getByText('OptionX'));
    fireEvent.click(screen.getByRole('button', { name: /Submit Decisions/i }));

    await waitFor(() => screen.getByTestId('feedback-panel'));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    
    // scenario 2
    fireEvent.click(screen.getByText('Option2'));
    fireEvent.click(screen.getByText('OptionB'));
    fireEvent.click(screen.getByText('OptionY'));
    fireEvent.click(screen.getByRole('button', { name: /Submit Decisions/i }));

    await waitFor(() => {
      expect(screen.getByText('Mission Complete!')).toBeInTheDocument();
      expect(screen.getByText(/Final Score:/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('progress bar width updates correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <DataSecurityGame />
      </MemoryRouter>
    );

    let progressBar = container.querySelector('div.bg-blue-600');
    expect(progressBar).toHaveStyle('width: 50%');

    // complete first scenario to move to the next
    fireEvent.click(screen.getByText('Option1'));
    fireEvent.click(screen.getByText('OptionA'));
    fireEvent.click(screen.getByText('OptionX'));
    fireEvent.click(screen.getByRole('button', { name: /Submit Decisions/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    progressBar = container.querySelector('div.bg-blue-600');
    expect(progressBar).toHaveStyle('width: 100%');
  });
});
