
import React, { useState } from 'react';
import { AlertTriangle, Clock, Shield, Check, X } from 'lucide-react';

const ActivityCard = ({ 
  activity,
  onInvestigate,
  onFlag,
  isInvestigated,
  isFlagged,
  isAnalyzed,
  onAnalyze
}) => {
  const { icon: Icon } = activity;
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnalyze = () => {
    setShowFeedback(true);
    onAnalyze(activity.id, isFlagged);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            activity.riskScore > 70 ? 'bg-red-100' :
            activity.riskScore > 40 ? 'bg-yellow-100' :
            'bg-green-100'
          }`}>
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <div>
            <h3 className="font-semibold">{activity.employee}</h3>
            <p className="text-sm text-gray-600">{activity.department} • {activity.accessLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{activity.timestamp}</span>
        </div>
      </div>

      <p className="text-sm mb-4">{activity.details}</p>

      {activity.flags && isFlagged && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activity.flags.map((flag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              {flag}
            </span>
          ))}
        </div>
      )}

      {!showFeedback ? (
        <div className="flex justify-between">
          <button
            onClick={() => onInvestigate(activity.id)}
            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
          >
            Investigate
          </button>
          <button
            onClick={() => onFlag(activity.id)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              isFlagged 
                ? 'bg-red-100 text-red-700' 
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            {isFlagged ? 'Flagged as Suspicious' : 'Flag as Suspicious'}
          </button>
          <button
            onClick={handleAnalyze}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
          >
            Complete Analysis
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${
            (activity.isSuspicious && isFlagged) || (!activity.isSuspicious && !isFlagged)
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {(activity.isSuspicious && isFlagged) || (!activity.isSuspicious && !isFlagged) ? (
                <Check className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {activity.isSuspicious ? 'This was suspicious activity!' : 'This was normal activity.'}
                </p>
                <p className="text-sm mt-1">
                  {activity.isSuspicious
                    ? isFlagged
                      ? 'Good catch! You correctly identified the suspicious behavior.'
                      : 'You missed some suspicious indicators. Always investigate unusual patterns.'
                    : isFlagged
                      ? 'This was a false positive. Be careful not to over-flag normal activities.'
                      : 'Correct! This activity follows normal patterns.'
                  }
                </p>
              </div>
            </div>
            
            {activity.isSuspicious && (
              <div className="mt-3">
                <p className="font-medium text-sm">Key Indicators:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  {activity.flags?.map((flag, index) => (
                    <li key={index} className="text-gray-700">{flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;