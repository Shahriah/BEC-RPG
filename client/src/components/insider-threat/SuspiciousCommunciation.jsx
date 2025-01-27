import React, { useState } from 'react';
import { Mail, MessageSquare, AlertTriangle, Flag, Eye, Check, X } from 'lucide-react';

const SuspiciousCommunications = ({ currentRole }) => {
  const [analyzedMessages, setAnalyzedMessages] = useState(new Set());
  
  // Sample suspicious communications data
  const communications = [
    {
      id: 1,
      type: 'email',
      sender: 'john.doe@company.com',
      recipient: 'external.contact@vendor.com',
      timestamp: '2024-01-15 23:45',
      subject: 'Database Access Request',
      content: 'Can you give me access to the customer database? Need it urgently for a special project. Will explain later.',
      flags: ['After Hours', 'Urgency', 'Vague Justification'],
      riskLevel: 'high'
    },
    {
      id: 2,
      type: 'chat',
      sender: 'alice.smith',
      recipient: 'team-general',
      timestamp: '2024-01-16 14:20',
      content: 'Does anyone have the admin password for the file server? The IT team is not responding and I need to access some files immediately.',
      flags: ['Password Request', 'Bypassing IT', 'Urgency'],
      riskLevel: 'medium'
    },
    {
      id: 3,
      type: 'email',
      sender: 'mark.wilson@company.com',
      recipient: 'personal.email@gmail.com',
      timestamp: '2024-01-17 18:30',
      subject: 'Important Documents',
      content: 'Sending these files to my personal email to work on them from home this weekend.',
      flags: ['Data Exfiltration', 'Personal Email Usage'],
      riskLevel: 'high'
    },
    {
      id: 4,
      type: 'chat',
      sender: 'sarah.jones',
      recipient: 'jane.brown',
      timestamp: '2024-01-18 10:15',
      content: 'I noticed you have access to the financial reports. Could you download the Q4 summary for me? My access seems to be broken.',
      flags: ['Unauthorized Access Request', 'Suspicious Behavior'],
      riskLevel: 'medium'
    }
  ];

  const handleAnalyzeMessage = (messageId) => {
    setAnalyzedMessages(prev => new Set([...prev, messageId]));
  };

  const MessageCard = ({ message }) => {
    const [showAnalysis, setShowAnalysis] = useState(false);
    const isAnalyzed = analyzedMessages.has(message.id);

    return (
      <div className="border rounded-lg p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {message.type === 'email' ? (
              <Mail className="w-4 h-4 text-blue-600" />
            ) : (
              <MessageSquare className="w-4 h-4 text-green-600" />
            )}
            <div>
              <div className="text-sm font-medium">
                From: {message.sender}
                {message.subject && ` - ${message.subject}`}
              </div>
              <div className="text-xs text-gray-500">
                To: {message.recipient}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">{message.timestamp}</div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
          {message.content}
        </p>

        {/* Risk Level */}
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-4 h-4 ${
            message.riskLevel === 'high' ? 'text-red-500' : 'text-yellow-500'
          }`} />
          <span className={`text-sm font-medium ${
            message.riskLevel === 'high' ? 'text-red-700' : 'text-yellow-700'
          }`}>
            {message.riskLevel.charAt(0).toUpperCase() + message.riskLevel.slice(1)} Risk
          </span>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {message.flags.map((flag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs flex items-center gap-1"
              >
                <Flag className="w-3 h-3" />
                {flag}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              <Eye className="w-4 h-4" />
            </button>
            {!isAnalyzed && (
              <button
                onClick={() => handleAnalyzeMessage(message.id)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
              >
                Analyze
              </button>
            )}
          </div>
        </div>

        {/* Analysis Section */}
        {showAnalysis && (
          <div className="border-t pt-3 mt-3 space-y-2">
            <h4 className="font-medium text-sm">Risk Analysis:</h4>
            <div className="space-y-2">
              {message.flags.map((flag, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div>
                    <span className="font-medium">{flag}:</span>
                    <p className="text-gray-600">
                      {getAnalysisForFlag(flag)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getAnalysisForFlag = (flag) => {
    const analysisMap = {
      'After Hours': 'Suspicious timing outside normal business hours may indicate attempts to avoid detection.',
      'Urgency': 'Creating time pressure to bypass normal security procedures.',
      'Vague Justification': 'Lack of specific details may indicate attempt to obscure true intentions.',
      'Password Request': 'Direct password requests violate security protocols.',
      'Bypassing IT': 'Attempting to circumvent established security channels.',
      'Data Exfiltration': 'Potential unauthorized data transfer outside secure environment.',
      'Personal Email Usage': 'Use of personal email for company data violates security policy.',
      'Unauthorized Access Request': 'Attempting to gain access through unofficial channels.',
      'Suspicious Behavior': 'Pattern indicates potential security policy violation.'
    };
    
    return analysisMap[flag] || 'This behavior requires further investigation.';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Suspicious Communications</h3>
        <div className="text-sm text-gray-600">
          Analyzed: {analyzedMessages.size}/{communications.length}
        </div>
      </div>

      <div className="space-y-4">
        {communications.map(message => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};

export default SuspiciousCommunications;