import React, { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle, Info, Mail } from 'lucide-react';

const PolicyVerificationGame = ({ email, onComplete }) => {
  // Game states
  const [gameState, setGameState] = useState({
    showTutorial: true,
    selectedPolicies: new Set(),
    timeRemaining: 60,
    isComplete: false,
    score: 0
  });

  // Policies relevant to email security
  const policies = [
    {
      id: 'fin-approval',
      title: 'Financial Approval Process',
      description: 'All financial transactions over $10,000 require multiple approvers',
      category: 'Financial',
      isRelevant: true,
    },
    {
      id: 'urgency-protocol',
      title: 'Urgency Protocol',
      description: 'Urgent requests must still follow standard verification procedures',
      category: 'Process',
      isRelevant: true,
    },
    {
      id: 'vendor-change',
      title: 'Vendor Detail Changes',
      description: 'Changes to vendor information require documented verification',
      category: 'Vendor',
      isRelevant: true,
    },
    {
      id: 'data-access',
      title: 'Data Access Protocol',
      description: 'Sensitive data requests require department head approval',
      category: 'Data',
      isRelevant: false,
    },
    {
      id: 'system-maintenance',
      title: 'System Maintenance Policy',
      description: 'System updates require IT department scheduling',
      category: 'IT',
      isRelevant: false,
    },
    {
      id: 'communication-channels',
      title: 'Communication Channels',
      description: 'Critical requests must be verified through official channels',
      category: 'Communication',
      isRelevant: true,
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!gameState.showTutorial && !gameState.isComplete && gameState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.showTutorial, gameState.isComplete, gameState.timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (gameState.timeRemaining === 0) {
      handleSubmit();
    }
  }, [gameState.timeRemaining]);

  const togglePolicy = (policyId) => {
    setGameState(prev => {
      const newSelected = new Set(prev.selectedPolicies);
      if (newSelected.has(policyId)) {
        newSelected.delete(policyId);
      } else {
        newSelected.add(policyId);
      }
      return {
        ...prev,
        selectedPolicies: newSelected
      };
    });
  };

  const handleSubmit = () => {
    const relevantPolicies = policies.filter(p => p.isRelevant);
    const correctSelections = [...gameState.selectedPolicies].filter(
      id => policies.find(p => p.id === id)?.isRelevant
    ).length;
    const incorrectSelections = gameState.selectedPolicies.size - correctSelections;
    
    const score = Math.max(0, Math.min(100,
      (correctSelections / relevantPolicies.length) * 100 - (incorrectSelections * 10)
    ));
  
    setGameState(prev => ({
      ...prev,
      isComplete: true,
      score
    }));
  
    // Ensure onComplete is called with a passing score
    if (score >= 70) {
      onComplete(score);
    }
  };

  const renderEmailPreview = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">From:</span>
          </div>
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
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm whitespace-pre-wrap text-gray-800">
            {email?.content}
          </div>
        </div>
      </div>
    </div>
  );

  // Tutorial view
  if (gameState.showTutorial) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Policy Verification Training</h2>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Task:</h3>
            <p className="text-sm text-blue-800">
              Review the email and select all security policies that are relevant 
              to this situation. Be quick but thorough - you have 60 seconds!
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Scoring:</h3>
            <ul className="text-sm space-y-1">
              <li>• +20 points for each correct policy identified</li>
              <li>• -10 points for each incorrect policy selected</li>
              <li>• Time remaining adds bonus points</li>
            </ul>
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
  }

  // Game completion view
  if (gameState.isComplete) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold">Analysis Complete</h2>
          </div>
  
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Your Score: {gameState.score}%</h3>
            <div className="space-y-2">
              <p className="text-sm">Time Remaining: {gameState.timeRemaining}s</p>
              <p className="text-sm">Policies Selected: {gameState.selectedPolicies.size}</p>
            </div>
          </div>
  
          <div className="space-y-2">
            {policies.map(policy => {
              const wasSelected = gameState.selectedPolicies.has(policy.id);
              const isCorrect = wasSelected === policy.isRelevant;
  
              return (
                <div 
                  key={policy.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect 
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-medium">{policy.title}</h4>
                      <p className="text-sm text-gray-600">{policy.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
  
          <div className="flex space-x-2">
            {gameState.score >= 70 ? (
              <button
                onClick={() => onComplete(gameState.score)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue to Next Step
              </button>
            ) : (
              <button
                onClick={() => setGameState(prev => ({
                  ...prev,
                  showTutorial: false,
                  isComplete: false,
                  selectedPolicies: new Set(),
                  timeRemaining: 60
                }))}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main game view
  return (
    <div className="bg-white rounded-lg p-6">
      {/* Timer and Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Time Remaining: {gameState.timeRemaining}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium">
              Selected: {gameState.selectedPolicies.size}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2 transition-all"
            style={{ width: `${(gameState.timeRemaining / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Email Preview */}
      {renderEmailPreview()}

      {/* Policy Selection */}
      <div className="space-y-4">
        <h3 className="font-medium">Select Relevant Security Policies:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map(policy => (
            <button
              key={policy.id}
              onClick={() => togglePolicy(policy.id)}
              className={`p-4 rounded-lg border text-left transition-all
                ${gameState.selectedPolicies.has(policy.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-start gap-2">
                <Info className={`w-5 h-5 mt-0.5 ${
                  gameState.selectedPolicies.has(policy.id)
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`} />
                <div>
                  <h4 className="font-medium">{policy.title}</h4>
                  <p className="text-sm text-gray-600">{policy.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
        >
          Submit Analysis
        </button>
      </div>
    </div>
  );
};

export default PolicyVerificationGame;