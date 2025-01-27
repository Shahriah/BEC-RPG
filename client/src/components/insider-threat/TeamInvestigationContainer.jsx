import React, { useState } from 'react';
import { MessageSquare, Shield, FileText, AlertTriangle } from 'lucide-react';
import { Departments } from '../../types/insiderThreatTypes';
import SuspiciousCommunications from './SuspiciousCommunciation';
import InvestigationPanel from './InvestigationPanel';
import TeamNotes from './TeamNotes';

const TeamInvestigationContainer = ({ 
  currentRole,
  activity,
  onInvestigationUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('communications');

  const handleCommunicationAnalyzed = (messageId) => {
    onInvestigationUpdate?.({
      type: 'COMMUNICATION_ANALYZED',
      messageId
    });
  };

  const handleStageComplete = (stageId, allApprovals) => {
    onInvestigationUpdate?.({
      type: 'STAGE_COMPLETE',
      stageId,
      approvals: allApprovals
    });
  };

  const handleNoteAdded = (note) => {
    onInvestigationUpdate?.({
      type: 'NOTE_ADDED',
      note
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab('communications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'communications' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-white text-gray-600'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Suspicious Communications
        </button>
        <button
          onClick={() => setActiveTab('investigation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'investigation' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-white text-gray-600'
          }`}
        >
          <Shield className="w-4 h-4" />
          Investigation
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'notes' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-white text-gray-600'
          }`}
        >
          <FileText className="w-4 h-4" />
          Analysis Notes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'communications' && (
        <SuspiciousCommunications
          currentRole={currentRole}
          onAnalyzed={handleCommunicationAnalyzed}
        />
      )}

      {activeTab === 'investigation' && (
        <InvestigationPanel
          currentRole={currentRole}
          onStageComplete={handleStageComplete}
        />
      )}

      {activeTab === 'notes' && (
        <TeamNotes
          currentRole={currentRole}
          onNoteAdded={handleNoteAdded}
        />
      )}

      {/* Activity Context Panel */}
      {activity && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Current Investigation</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-yellow-700">Employee:</span>
              <span className="font-medium">{activity.employee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-700">Department:</span>
              <span className="font-medium">{activity.department}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-700">Activity Type:</span>
              <span className="font-medium">{activity.activityType}</span>
            </div>
            <div className="text-sm text-yellow-700 mt-2">
              <p className="font-medium mb-1">Details:</p>
              <p>{activity.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamInvestigationContainer;