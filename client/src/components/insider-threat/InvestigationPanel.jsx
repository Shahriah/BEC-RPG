import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import TimelineAnalysisView from '../insider-threat/TimelineAnalysisView';

const InvestigationPanel = ({ 
  activity, 
  onClose, 
  onFlagActivity,  // Add this prop
  investigatedActivities  // Add this prop to track investigated activities
}) => {
  if (!activity) return null;

  // Ensure the activity has the required structure
  const preparedActivity = {
    ...activity,
    suspiciousFactors: activity.timeline
      .filter(item => !item.isNormal)
      .flatMap(item => item.alerts || []),
    id: activity.id || 'unknown-activity'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold">{activity.employee || 'Employee'}</h2>
              <p className="text-sm text-gray-600">{activity.department || 'Department'}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Timeline Analysis View */}
          <TimelineAnalysisView activity={preparedActivity} />

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close Investigation
            </button>
            {!investigatedActivities?.has(activity.id) && (
              <>
                <button
                  onClick={() => onFlagActivity(activity.id, true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Flag as Suspicious
                </button>
                <button
                  onClick={() => onFlagActivity(activity.id, false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Normal
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationPanel;