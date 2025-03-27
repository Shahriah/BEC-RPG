
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScenarioCard, ChoiceSelector, FeedbackPanel } from '../../components/data-security/DataSecurityScenarioCard';

describe('ScenarioCard Component', () => {
  const sampleScenario = {
    title: 'Test Scenario Title',
    dataType: 'Confidential',
    content: 'This is the content of the test scenario.',
  };

  test('renders scenario details correctly with default icon', () => {
    render(<ScenarioCard scenario={sampleScenario} />);
    expect(screen.getByText(sampleScenario.title)).toBeInTheDocument();
    expect(screen.getByText(`Data Type: ${sampleScenario.dataType}`)).toBeInTheDocument();
    expect(screen.getByText(sampleScenario.content)).toBeInTheDocument();
    
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  test('renders custom icon when provided', () => {
    
    const DummyIcon = () => <svg data-testid="dummy-icon" />;
    const customScenario = { ...sampleScenario, icon: DummyIcon };
    render(<ScenarioCard scenario={customScenario} />);
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });
});

describe('ChoiceSelector Component', () => {
  const options = {
    option1: { value: 'value1', label: 'Option 1', description: 'Description 1' },
    option2: { value: 'value2', label: 'Option 2', description: 'Description 2' },
  };

  // DummyIcon component for testing
  const DummyIcon = () => <svg data-testid="dummy-icon" />;

  test('renders title and options correctly', () => {
    render(
      <ChoiceSelector
        title="Test Title"
        icon={DummyIcon}
        options={options}
        selected=""
        onChange={jest.fn()}
        disabled={false}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByTestId('dummy-icon')).toBeInTheDocument();
  });

  test('calls onChange with correct value when an option is clicked', () => {
    const handleChange = jest.fn();
    render(
      <ChoiceSelector
        title="Test Title"
        icon={DummyIcon}
        options={options}
        selected=""
        onChange={handleChange}
        disabled={false}
      />
    );
    fireEvent.click(screen.getByText('Option 1'));
    expect(handleChange).toHaveBeenCalledWith('value1');
  });

  test('disables option buttons when disabled prop is true', () => {
    render(
      <ChoiceSelector
        title="Test Title"
        icon={DummyIcon}
        options={options}
        selected=""
        onChange={jest.fn()}
        disabled={true}
      />
    );
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('applies selected styling to the selected option', () => {
    render(
      <ChoiceSelector
        title="Test Title"
        icon={DummyIcon}
        options={options}
        selected="value2"
        onChange={jest.fn()}
        disabled={false}
      />
    );
    
    const option2Button = screen.getByText('Option 2').closest('button');
    expect(option2Button).toHaveClass('border-blue-500');
    expect(option2Button).toHaveClass('bg-blue-50');
  });
});

describe('FeedbackPanel Component', () => {
  // choice setting
  const choices = {
    classification: 'option1',
    access: 'optionA',
    security: 'optionX',
  };
  const correctChoices = {
    classification: 'option1', 
    access: 'optionB',         
    security: 'optionX',       
  };
  const explanations = {
    classification: 'Classification explanation',
    access: 'Access explanation',
    security: 'Security explanation',
  };
  const securityTips = ['Tip 1', 'Tip 2'];

  test('renders feedback panel with correct analysis and icons', () => {
    render(
      <FeedbackPanel
        choices={choices}
        correctChoices={correctChoices}
        explanations={explanations}
        securityTips={securityTips}
        onNext={jest.fn()}
      />
    );
    
    expect(screen.getByText('Analysis & Feedback')).toBeInTheDocument();

    
    expect(screen.getByText('Classification explanation')).toBeInTheDocument();
    expect(screen.getByText('Access explanation')).toBeInTheDocument();
    expect(screen.getByText('Security explanation')).toBeInTheDocument();

    
    expect(screen.getByText('classification')).toBeInTheDocument();
    expect(screen.getByText('access')).toBeInTheDocument();
    expect(screen.getByText('security')).toBeInTheDocument();

    
    expect(screen.getByText('Security Tips')).toBeInTheDocument();
    expect(screen.getByText('Tip 1')).toBeInTheDocument();
    expect(screen.getByText('Tip 2')).toBeInTheDocument();
  });

  test('calls onNext when Continue button is clicked', () => {
    const handleNext = jest.fn();
    render(
      <FeedbackPanel
        choices={choices}
        correctChoices={correctChoices}
        explanations={explanations}
        securityTips={securityTips}
        onNext={handleNext}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(handleNext).toHaveBeenCalled();
  });

  test('does not render security tips section when securityTips is not provided', () => {
    render(
      <FeedbackPanel
        choices={choices}
        correctChoices={correctChoices}
        explanations={explanations}
        securityTips={null}
        onNext={jest.fn()}
      />
    );
    expect(screen.queryByText('Security Tips')).toBeNull();
  });
});
