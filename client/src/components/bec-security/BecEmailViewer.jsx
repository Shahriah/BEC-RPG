import React from 'react';
import { 
  Mail, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Search, 
  Phone, 
  AlertCircle,
  CheckCircle, 
  XCircle, 
  Info,
  LucideFileSpreadsheet 
} from 'lucide-react';

import { 
  RedFlags, 
  SecurityBehaviors, 
  VerificationSteps 
} from '../../types/becSecurityTypes';

export const EmailViewer = ({ email }) => {
  if (!email) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-gray-500" />
          <div>
            <div className="font-medium">From: {email.emailContent.from}</div>
            <div className="text-gray-600">Subject: {email.emailContent.subject}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {email.emailContent.timestamp}
        </div>
      </div>
      
      <div className="whitespace-pre-wrap font-mono text-sm">
        {email.emailContent.content}
      </div>
    </div>
  );
};

export const ActionPanel = ({ onAction, onVerify, verificationSteps = [], disabled = false }) => {
  return (
    <div className="space-y-4">
      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onAction('flag')}
          disabled={disabled}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-4 h-4" />
          Flag as Suspicious
        </button>
        <button
          onClick={() => onAction('process')}
          disabled={disabled}
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Process Request
        </button>
      </div>

      {/* Verification Steps */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium mb-2">Verification Steps</h4>
        <div className="space-y-2">
          {Object.entries(VerificationSteps).map(([key, step]) => (
            <button
              key={key}
              onClick={() => onVerify(key)}
              disabled={verificationSteps.includes(key) || disabled}
              className={`w-full px-3 py-2 text-left rounded-lg flex items-center gap-2
                ${verificationSteps.includes(key)
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
                } disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200`}
            >
              <div>
                <div className="font-medium">{step.label}</div>
                <div className="text-xs opacity-75">
                  Time: {step.timeRequired}s • Points: {step.points}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FeedbackPanel = ({
  email,
  verificationSteps,
  expectedSteps,
  isCorrect,
  onContinue
}) => {
  const calculateScore = () => {
    let score = 0;
    // Points for correct verification steps
    expectedSteps.forEach(step => {
      if (verificationSteps.includes(step)) {
        score += VerificationSteps[step].points;
      }
    });
    // Points for demonstrated behaviors
    if (verificationSteps.length > 0) {
      score += SecurityBehaviors.VERIFICATION_REQUESTED.points;
    }
    if (verificationSteps.length === expectedSteps.length) {
      score += SecurityBehaviors.PROCEDURE_FOLLOWED.points;
    }
    return score;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Result Header */}
      <div className="flex items-center gap-2 mb-4">
        {isCorrect ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600" />
        )}
        <h3 className="text-lg font-semibold">
          {isCorrect ? 'Correct Response!' : 'Incorrect Response'}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Analysis */}
        <div className={`p-4 rounded-lg ${
          isCorrect ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h4 className="font-medium mb-2">Analysis:</h4>
          <p>{email.fraudType ? `This was a ${email.fraudType} attempt.` : 'This was a legitimate request.'}</p>
          <p className="mt-2">{email.securityProtocol}</p>
        </div>

        {/* Verification Steps Review */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium flex items-center gap-2 mb-2">
            <Info className="w-4 h-4" />
            Verification Steps Taken:
          </h4>
          <ul className="space-y-2">
            {expectedSteps.map((step) => (
              <li key={step} className="flex items-center gap-2">
                {verificationSteps.includes(step) ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">
                  {VerificationSteps[step].label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Score Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Score Summary:</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Verification Steps:</span>
              <span>{verificationSteps.length} of {expectedSteps.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Behaviors:</span>
              <span>{verificationSteps.length > 0 ? 'Demonstrated' : 'Not Demonstrated'}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Points:</span>
              <span>{calculateScore()}</span>
            </div>
          </div>
        </div>

        {/* Learning Points */}
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Learning Points:</h4>
          <ul className="list-disc list-inside space-y-1">
            {email.learningPoints.map((point, index) => (
              <li key={index} className="text-sm">{point}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={onContinue}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default {
  EmailViewer,
  ActionPanel,
  FeedbackPanel
};