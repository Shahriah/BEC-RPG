
import React, { useState } from 'react';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

const InteractiveEmail = ({ email, onAnalysisComplete }) => {
  const [selectedFlags, setSelectedFlags] = useState(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [analysisScore, setAnalysisScore] = useState(0);

  const identifyRedFlags = (email) => {
    const redFlags = new Map();

    
    if (!email.from.endsWith('@company.com')) {
      redFlags.set('domain', {
        text: email.from,
        category: 'Suspicious Domain',
        explanation: 'Email from unofficial or modified domain'
      });
    }

    
    const urgencyWords = ['urgent', 'asap', 'immediately', 'today', 'quick'];
    urgencyWords.forEach(word => {
      if (email.content.toLowerCase().includes(word)) {
        redFlags.set('urgency', {
          text: word,
          category: 'Urgency Pressure',
          explanation: 'Creating time pressure to force quick action'
        });
      }
    });

    
    const moneyPattern = /\$[\d,]+(\.\d{2})?/g;
    const moneyMatches = email.content.match(moneyPattern);
    if (moneyMatches) {
      redFlags.set('financial', {
        text: moneyMatches[0],
        category: 'Financial Request',
        explanation: 'Suspicious payment or transfer request'
      });
    }

    
    const secrecyPhrases = [
      'confidential',
      'don\'t discuss',
      'only through this email',
      'reply only',
      'keep this private'
    ];
    secrecyPhrases.forEach(phrase => {
      if (email.content.toLowerCase().includes(phrase)) {
        redFlags.set('secrecy', {
          text: phrase,
          category: 'Communication Limitation',
          explanation: 'Attempting to limit verification channels'
        });
      }
    });

    
    const bankingPhrases = [
      'new account',
      'update bank',
      'change account',
      'alternate account',
      'banking issue'
    ];
    bankingPhrases.forEach(phrase => {
      if (email.content.toLowerCase().includes(phrase)) {
        redFlags.set('banking', {
          text: phrase,
          category: 'Account Changes',
          explanation: 'Suspicious request to modify payment details'
        });
      }
    });

    return redFlags;
  };

  const suspiciousElements = identifyRedFlags(email);

  const calculateScore = () => {
    let correctSelections = 0;
    let totalFlags = suspiciousElements.size;

    selectedFlags.forEach(flag => {
      for (const [_, element] of suspiciousElements) {
        if (flag.toLowerCase().includes(element.text.toLowerCase())) {
          correctSelections++;
          break;
        }
      }
    });

    return Math.round((correctSelections / totalFlags) * 100);
  };

  const handleWordClick = (word) => {
    if (showFeedback) return;

    setSelectedFlags(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(word)) {
        newFlags.delete(word);
      } else {
        newFlags.add(word);
      }
      return newFlags;
    });
  };

  const renderContent = (text) => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className={`cursor-pointer ${selectedFlags.has(word) ? 'bg-yellow-100' : ''}`}
        onClick={() => handleWordClick(word)}
      >
        {word}{' '}
      </span>
    ));
  };



  const handleSubmitAnalysis = () => {
    const score = calculateScore();
    setAnalysisScore(score);
    setShowFeedback(true);
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="border rounded-lg p-4 mb-4 max-h-[500px] overflow-y-auto">
        {/* Email Header */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="space-y-2 font-mono text-sm">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <span className="text-gray-600">From:</span>
              <span 
                className={`cursor-pointer ${selectedFlags.has(email.from) ? 'bg-yellow-100' : ''}`}
                onClick={() => handleWordClick(email.from)}
              >
                {email.from}
              </span>
              <span className="text-gray-600">Subject:</span>
              <span>{email.subject}</span>
              <span className="text-gray-600">Date:</span>
              <span>{email.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          <p className="mb-4">Dear {renderContent("Finance Team")},</p>
          <p className="mb-4">
            {renderContent(email.content)}
          </p>
          <p className="mb-4">Thanks,</p>
          <p>
            Sarah Johnson<br />
            Accounts Receivable
          </p>
        </div>
      </div>

      {/* Controls and Feedback */}
      <div className="space-y-4">
        {!showFeedback ? (
          <>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                {showHints ? 'Hide Hints' : 'Need Hints?'}
              </button>
              <button
                onClick={handleSubmitAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Analysis
              </button>
            </div>

            {showHints && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Analysis Tips:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Click on suspicious words or phrases in the email</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Look for unusual urgency or pressure tactics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Check for suspicious email domains and requests</span>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {/* Score Display */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Analysis Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Your Score:</span>
                  <span className="text-2xl font-bold text-blue-700">{analysisScore}%</span>
                </div>
                <div className="text-sm text-blue-600">
                  You found {selectedFlags.size} suspicious elements
                </div>
              </div>
            </div>

            {/* Identified Red Flags */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-red-800">Red Flags Found:</h3>
              <ul className="space-y-1">
                {Array.from(selectedFlags).map((flag, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onAnalysisComplete(analysisScore)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue to Response Phase
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveEmail;