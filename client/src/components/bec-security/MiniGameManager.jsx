import React, { useState } from 'react';
import { VerificationGameType, VerificationGameStatus, VerificationSteps } from '../../types/becSecurityTypes';
import { Trophy, ArrowRight } from 'lucide-react';
import CheckSenderGame from './CheckSenderGame';
import PolicyVerificationGame from './PolicyVerificationGame';
import ContactSupervisorGame from './ContactSupervisorGame';

const MiniGameManager = ({ email, onComplete }) => {
  const [gameState, setGameState] = useState({
    currentStep: VerificationGameType.CHECK_SENDER,
    scores: {},
    status: VerificationGameStatus.NOT_STARTED,
    showTransition: false
  });

  const handleGameComplete = (gameType, score) => {
    const newScores = {
      ...gameState.scores,
      [gameType]: score || 0 
    };
  
    // if the game is the last step, calculate the total score and call the onComplete callback
    if (gameType === VerificationGameType.CONTACT_SUPERVISOR) {
      // ensures a valid number score
      const scoreValues = Object.values(newScores).filter(s => typeof s === "number" && !isNaN(s));
      // calculate the average score
      const totalScore = scoreValues.length > 0 
        ? Math.round(scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length) 
        : 0; 
  
      onComplete(gameType, totalScore);
    } else {
      setGameState(prev => ({
        ...prev,
        scores: newScores,
        showTransition: true
      }));
    }
  };
  

  const handleTransitionContinue = () => {
    let nextStep;
    if (gameState.currentStep === VerificationGameType.CHECK_SENDER) {
      nextStep = VerificationGameType.VERIFY_POLICY;
    } else if (gameState.currentStep === VerificationGameType.VERIFY_POLICY) {
      nextStep = VerificationGameType.CONTACT_SUPERVISOR;
    }

    setGameState(prev => ({
      ...prev,
      currentStep: nextStep,
      status: VerificationGameStatus.NOT_STARTED,
      showTransition: false
    }));
  };
  
  const renderTransitionScreen = () => {
    const currentStep = VerificationSteps[gameState.currentStep];
    const nextStep = VerificationSteps[
      gameState.currentStep === VerificationGameType.CHECK_SENDER
        ? VerificationGameType.VERIFY_POLICY
        : VerificationGameType.CONTACT_SUPERVISOR
    ];

    return (
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{currentStep.title} Complete!</h2>
            <p className="text-gray-600">
              Score: {gameState.scores[gameState.currentStep]}%
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4" />
              Next: {nextStep.title}
            </h3>
            <p className="text-sm text-blue-800">{nextStep.description}</p>
          </div>

          <button
            onClick={handleTransitionContinue}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue to Next Step
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentGame = () => {
    if (gameState.showTransition) {
      return renderTransitionScreen();
    }

    switch (gameState.currentStep) {
      case VerificationGameType.CHECK_SENDER:
        return (
          <CheckSenderGame
            email={email?.emailContent}
            onComplete={(score) => handleGameComplete(VerificationGameType.CHECK_SENDER, score)}
          />
        );
      case VerificationGameType.VERIFY_POLICY:
        return (
          <PolicyVerificationGame
            email={email?.emailContent}
            onComplete={(score) => handleGameComplete(VerificationGameType.VERIFY_POLICY, score)}
          />
        );
      case VerificationGameType.CONTACT_SUPERVISOR:
        return (
          <ContactSupervisorGame
            email={email?.emailContent}
            onComplete={(score) => handleGameComplete(VerificationGameType.CONTACT_SUPERVISOR, score)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* progress tracker */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Verification Steps</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(VerificationSteps).map(([type, step]) => {
            const Icon = step.icon;
            const isComplete = gameState.scores[type] !== undefined;
            const isCurrent = gameState.currentStep === type;

            return (
              <div
                key={type}
                className={`p-4 rounded-lg border ${
                  isCurrent 
                    ? 'border-blue-500 bg-blue-50'
                    : isComplete
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${
                    isCurrent ? 'text-blue-600' :
                    isComplete ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
                <p className="text-xs text-gray-600">{step.description}</p>
                {gameState.scores[type] !== undefined && (
                  <div className="mt-2 text-xs font-medium">
                    Score: {gameState.scores[type]}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* current game */}
      {renderCurrentGame()}
    </div>
  );
};

export default MiniGameManager;