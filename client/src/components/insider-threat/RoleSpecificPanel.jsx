import React, { useState } from 'react';
import { Shield, Lock, Users, BadgeDollarSign, AlertTriangle } from 'lucide-react';
import { Departments, AccessLevels } from '../../types/insiderThreatTypes';

const RoleSpecificPanel = ({ role, activity, onAction }) => {
  const [insights, setInsights] = useState([]);

  // Role-specific actions and insights
  const roleActions = {
    [Departments.IT]: {
      actions: [
        { 
          id: 'system_audit', 
          label: 'Run System Audit',
          icon: Shield,
          description: 'Analyze system logs and access patterns'
        },
        { 
          id: 'access_review', 
          label: 'Review Access Logs',
          icon: Lock,
          description: 'Check detailed access history'
        }
      ],
      insights: [
        'Check for unauthorized elevation of privileges',
        'Review login locations and times',
        'Monitor data transfer patterns'
      ]
    },
    [Departments.HR]: {
      actions: [
        { 
          id: 'background_check', 
          label: 'Review Personnel File',
          icon: Users,
          description: 'Check employment history and records'
        },
        { 
          id: 'behavior_pattern', 
          label: 'Analyze Behavior Pattern',
          icon: AlertTriangle,
          description: 'Review recent behavioral changes'
        }
      ],
      insights: [
        'Check for recent performance issues',
        'Review attendance and schedule patterns',
        'Monitor workplace relationships'
      ]
    },
    [Departments.FINANCE]: {
      actions: [
        { 
          id: 'transaction_audit', 
          label: 'Audit Transactions',
          icon: BadgeDollarSign,
          description: 'Review financial activities'
        },
        { 
          id: 'expense_review', 
          label: 'Review Expenses',
          icon: BadgeDollarSign,
          description: 'Check expense patterns'
        }
      ],
      insights: [
        'Monitor unusual transaction patterns',
        'Check for unauthorized approvals',
        'Review expense report anomalies'
      ]
    }
  };

  const currentRoleActions = roleActions[role] || { actions: [], insights: [] };

  const handleAction = (actionId) => {
    // Simulate action results
    const newInsight = `[${new Date().toLocaleTimeString()}] ${
      currentRoleActions.actions.find(a => a.id === actionId).label
    } completed`;
    
    setInsights(prev => [newInsight, ...prev].slice(0, 5));
    onAction(actionId);
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Role-Specific Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {currentRoleActions.actions.map(action => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleAction(action.id)}
                className="p-3 border rounded-lg hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">{action.label}</span>
                </div>
                <p className="text-xs text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Department Insights</h3>
        <div className="space-y-2">
          {currentRoleActions.insights.map((insight, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700 p-2 bg-gray-50 rounded-lg"
            >
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {insights.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Action History</h3>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg"
              >
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSpecificPanel;