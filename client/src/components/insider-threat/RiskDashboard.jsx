// components/games/components/RiskDashboard.jsx
import React from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

const RiskDashboard = ({ detectedThreats, falseAlarms, patterns }) => {
  return (
    <div className="space-y-4">
      {/* Risk Dashboard */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="font-semibold mb-3">Risk Dashboard</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Detection Accuracy</span>
            <span className="text-sm font-medium">
              {Math.round((detectedThreats / (detectedThreats + falseAlarms)) * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Current Risk Level</span>
            <span className="text-sm font-medium text-red-600">High</span>
          </div>
        </div>
      </div>

      {/* Activity Patterns */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="font-semibold mb-3">Activity Patterns</h2>
        <div className="space-y-2">
          {patterns.map((pattern, index) => (
            <div 
              key={index}
              className={`p-2 rounded border ${
                pattern.severity === 'high' 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <p className={`text-sm ${
                pattern.severity === 'high' 
                  ? 'text-red-800' 
                  : 'text-yellow-800'
              }`}>
                {pattern.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;