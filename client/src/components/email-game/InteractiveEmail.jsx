import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, HelpCircle } from 'lucide-react';

const InteractiveEmail = ({ email, onAnalysisComplete }) => {
  const [selectedFlags, setSelectedFlags] = useState(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [analysisScore, setAnalysisScore] = useState(0);

  // this sets what is considered a red flag in an email
  const identifyRedFlags = (email) => {
    const suspiciousWords = new Map();
    
    // Domain check
    if (!email.from.endsWith('@company.com')) {
      const domain = email.from.split('@')[1];
      suspiciousWords.set(domain, {
        category: 'Suspicious Domain',
        explanation: 'Email from unofficial domain'
      });
    }
  
    const suspiciousPatterns = [
      // urgency patterns
      { words: ['urgent', 'immediate', 'quickly', 'asap', 'critical', 'emergency', 'hours', 'today'], 
        category: 'Urgency Pressure' },
      
      // financial terms
      { words: ['payment', 'wire', 'bank', 'transfer', 'escrow', 'account', 'funds', 'invoice'], 
        category: 'Financial Request' },
      
      // secrecy patterns
      { words: ['confidential', 'only', 'secret', 'private', 'discreet', 'confirm only via this email'], 
        category: 'Communication Limitation' },
      
      // action requests
      { words: ['proceed', 'approve', 'agreement', 'preliminary', 'action'], 
        category: 'Action Request' }
    ];
    
    // lowercase the entire content for easier checking
    const content = email.content.toLowerCase();
    
    // check for each pattern
    suspiciousPatterns.forEach(pattern => {
      pattern.words.forEach(word => {
        // check if the word exists in the content
        if (content.includes(word.toLowerCase())) {
          suspiciousWords.set(word, {
            category: pattern.category,
            explanation: `Potentially suspicious ${pattern.category.toLowerCase()}`
          });
        }
      });
    });
    
    const phrases = [
      { phrase: "confirm only via this email", category: "Communication Limitation" },
      { phrase: "within 2 hours", category: "Urgency Pressure" }
    ];
    
    phrases.forEach(({ phrase, category }) => {
      if (content.includes(phrase.toLowerCase())) {
        suspiciousWords.set(phrase, {
          category,
          explanation: `Suspicious communication pattern`
        });
      }
    });
    
    console.log("Identified suspicious elements:", Array.from(suspiciousWords.keys()));
    
    return suspiciousWords;
  };

  const suspiciousElements = identifyRedFlags(email);

const calculateScore = () => {
  const suspiciousElements = identifyRedFlags(email);
  console.log(suspiciousElements);
  
  let foundCorrectWords = 0;
  let incorrectSelections = 0;
  
  // convert selected flags to an array
  const selectedFlagsArray = Array.from(selectedFlags);
  
  // for each selection the user made
  selectedFlagsArray.forEach(flag => {
    const normalizedFlag = flag.toLowerCase().trim().replace(/[.,!?]/g, '');
    
    // check if the user's selection is in the suspicious elements list
    if (suspiciousElements.has(normalizedFlag)) {
      foundCorrectWords++;
      console.log(`Found match: ${normalizedFlag}`);
    } else {
      // if we get here, the user selected something that's not suspicious
      incorrectSelections++;
      console.log(`Incorrect selection: ${normalizedFlag}`);
    }
  });
  
  const totalSuspiciousWords = suspiciousElements.size;
  
  // simple scoring formula based on percentage found
  let score = 0;
  if (totalSuspiciousWords > 0) {
    score = Math.round((foundCorrectWords / totalSuspiciousWords) * 100);
    
    score = Math.max(0, score - (incorrectSelections * 2));
  }
  
  console.log('score calculation:');
  console.log('total suspicious elements:', totalSuspiciousWords);
  console.log('found correct elements:', foundCorrectWords);
  console.log('incorrect selections:', incorrectSelections);
  console.log('final score:', score);
  
  return score;
}

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
        className={`cursor-pointer ${selectedFlags.has(word) ? 'bg-amber-400' : ''}`}
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
        {/* header of email */}
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

        {/* body of email */}
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
            {/* score */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Analysis Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800">Your Score:</span>
                  <span className="text-2xl font-bold text-blue-700">{analysisScore}%</span>
                </div>
              </div>
            </div>

            {/* red flags found */}
            <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-red-800">Red Flags Found:</h3>
            <ul className="space-y-1">
              {Array.from(selectedFlags)
                .filter(flag => {
                  const suspiciousElements = identifyRedFlags(email);
                  const normalizedFlag = flag.toLowerCase().trim().replace(/[.,!?]/g, '');
                  return suspiciousElements.has(normalizedFlag);
                })
                .map((flag, index) => (
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