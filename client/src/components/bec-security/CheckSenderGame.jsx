import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  Search,
  Grip
} from 'lucide-react';

const CheckSenderGame = ({ email, onComplete }) => {
  const verificationSteps = [
    {
      id: 'verify-domain',
      title: 'Verify Email Domain',
      description: 'Confirm the email domain matches official company domain',
      icon: Search,
      scoreImpact: 20
    },
    {
      id: 'validate-sender',
      title: 'Validate Sender Name',
      description: 'Cross-reference sender name with known contacts',
      icon: Mail,
      scoreImpact: 20
    },
    {
      id: 'check-formatting',
      title: 'Examine Email Formatting',
      description: 'Look for suspicious or irregular email formatting',
      icon: Info,
      scoreImpact: 20
    },
    {
      id: 'contact-verify',
      title: 'Contact Verification',
      description: 'Reach out through alternative channels to confirm request',
      icon: CheckCircle,
      scoreImpact: 20
    },
    {
      id: 'policy-review',
      title: 'Review Security Policy',
      description: 'Check if the request complies with company security protocols',
      icon: AlertCircle,
      scoreImpact: 20
    }
  ];

  const [gameState, setGameState] = useState({
    step: 'intro',
    score: 0,
    mistakes: 0,
    currentSteps: [...verificationSteps],
    showTutorial: true,
    selectedStep: null,
    isComplete: false // Added isComplete state
  });

  const handleStepSelect = (stepId) => {
    setGameState(prev => ({
      ...prev,
      selectedStep: stepId
    }));
  };

  const handleStepReorder = (targetIndex) => {
    if (gameState.selectedStep === null) return;

    const currentSteps = [...gameState.currentSteps];
    const sourceIndex = currentSteps.findIndex(step => step.id === gameState.selectedStep);
    const [removedStep] = currentSteps.splice(sourceIndex, 1);
    currentSteps.splice(targetIndex, 0, removedStep);

    setGameState(prev => ({
      ...prev,
      currentSteps,
      selectedStep: null
    }));
  };

  const handleSubmitOrder = () => {
    let score = 100;
    let mistakes = 0;

    // Compare current order with correct order
    gameState.currentSteps.forEach((step, index) => {
      if (step.id !== verificationSteps[index].id) {
        score -= 20;
        mistakes++;
      }
    });

    setGameState(prev => ({
      ...prev,
      score,
      mistakes,
      isComplete: true // Set complete state
    }));

    // Pass score to parent component
    onComplete(Math.max(0, score));
  };

  const renderEmailPreview = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">From:</span>
          <span className="text-sm font-mono">{email?.from}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Subject:</span>
          <span className="text-sm">{email?.subject}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Time:</span>
          <span className="text-sm">{email?.timestamp}</span>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-600">Content:</span>
          <div className="mt-2 text-sm whitespace-pre-wrap border-t pt-2">
            {email?.content}
          </div>
        </div>
      </div>
    </div>
  );

  // Tutorial Modal
  const renderTutorial = () => (
    <div className="bg-white rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Sender Verification Training</h2>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Your Task:</h3>
          <p className="text-sm text-blue-800">
            Arrange the verification steps in the most logical order to effectively 
            verify the authenticity of an email sender.
          </p>
        </div>

        <button
          onClick={() => setGameState(prev => ({ ...prev, showTutorial: false }))}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Start Training
        </button>
      </div>
    </div>
  );

  // Completion Screen
  const renderCompletion = () => (
    <div className="bg-white rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {gameState.score >= 70 ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <h2 className="text-xl font-bold">
            {gameState.score >= 70 ? 'Great Job!' : 'Keep Practicing'}
          </h2>
        </div>

        <div className={`p-4 rounded-lg ${
          gameState.score >= 70 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <p className="font-medium">Your Score: {gameState.score}%</p>
          <p className="text-sm mt-1">Mistakes: {gameState.mistakes}</p>
        </div>

        <div className="space-y-2">
          {verificationSteps.map((step, index) => (
            <div 
              key={step.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded"
            >
              <span className="font-medium">{index + 1}.</span>
              <step.icon className="w-4 h-4" />
              <span>{step.title}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          {gameState.score >= 70 ? (
            <button
              onClick={() => onComplete(gameState.score)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue to Next Step
            </button>
          ) : (
            <button
              onClick={() => setGameState(prev => ({ ...prev, isComplete: false }))}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Game Interface
  const renderGame = () => (
    <div>
      {renderEmailPreview()}

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {gameState.currentSteps.map((step, index) => (
          <div 
            key={step.id}
            draggable
            onDragStart={() => handleStepSelect(step.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleStepReorder(index)}
            className={`
              flex flex-col items-center p-2 rounded-lg border 
              cursor-move transition-all 
              ${gameState.selectedStep === step.id ? 'opacity-50' : 'opacity-100'}
              hover:bg-gray-50
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{index + 1}.</span>
              <step.icon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-center font-medium">{step.title}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmitOrder}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-4"
      >
        Submit Order
      </button>
    </div>
  );

  // If no email is provided, show an error state
  if (!email) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <p className="text-red-800">No email data available for verification</p>
      </div>
    );
  }

  if (gameState.showTutorial) {
    return renderTutorial();
  }

  if (gameState.isComplete) {
    return renderCompletion();
  }

  return renderGame();
};

export default CheckSenderGame;