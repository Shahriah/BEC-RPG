// components/insider-threat/InvestigationPanel.jsx
import React, { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Departments } from '../../types/insiderThreatTypes';

const InvestigationPanel = ({ currentRole, onStageComplete }) => {
  const [approvals, setApprovals] = useState({});

  const investigationStages = [
    { 
      id: 'initial_review', 
      name: 'Initial Review', 
      requiredDept: Departments.IT,
      description: 'Technical analysis of suspicious activity'
    },
    { 
      id: 'hr_assessment', 
      name: 'HR Assessment', 
      requiredDept: Departments.HR,
      description: 'Employee behavior and history review'
    },
    { 
      id: 'financial_impact', 
      name: 'Financial Impact', 
      requiredDept: Departments.FINANCE,
      description: 'Assessment of potential financial risks'
    },
    { 
      id: 'final_decision', 
      name: 'Final Decision', 
      requiredDept: [Departments.IT, Departments.HR],
      description: 'Collaborative decision on action plan'
    }
  ];

  const handleApproval = (stageId) => {
    setApprovals(prev => {
      const newApprovals = { ...prev, [stageId]: true };
      onStageComplete?.(stageId, newApprovals);
      return newApprovals;
    });
  };

  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-600" />
        Investigation Progress
      </h3>
      
      <div className="space-y-4">
        {investigationStages.map(stage => (
          <div key={stage.id} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {approvals[stage.id] ? (
                  <Shield className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                )}
                <div>
                  <span className="font-medium">{stage.name}</span>
                  <p className="text-sm text-gray-600">{stage.description}</p>
                </div>
              </div>
              
              <div className="flex gap-1">
                {Array.isArray(stage.requiredDept) ? (
                  stage.requiredDept.map(dept => (
                    <span key={dept} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {dept}
                    </span>
                  ))
                ) : (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {stage.requiredDept}
                  </span>
                )}
              </div>
            </div>

            {(currentRole === stage.requiredDept || 
              (Array.isArray(stage.requiredDept) && stage.requiredDept.includes(currentRole))) && 
              !approvals[stage.id] && (
              <button
                onClick={() => handleApproval(stage.id)}
                className="w-full mt-2 px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm"
              >
                Approve Stage
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestigationPanel;