import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import TimelineAnalysisView from '../insider-threat/TimelineAnalysisView';

const InvestigationPanel = ({ 
  activity, 
  onClose, 
  onFlagActivity,  
  investigatedActivities  
}) => {
  if (!activity) return null;

  const preparedActivity = {
    ...activity,
    suspiciousFactors: activity.timeline
      .filter(item => !item.isNormal)
      .flatMap(item => item.alerts || []),
    id: activity.id || 'unknown-activity'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* header */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold">
                {activity.employee || 'Employee'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {activity.department || 'Department'}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* timeline analysis view */}
          <TimelineAnalysisView activity={preparedActivity} />

          {/* buttons to toggle pop ups */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Close Investigation
            </button>
            {!investigatedActivities?.has(activity.id) && (
              <>
                <button
                  onClick={() => onFlagActivity(activity.id, true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                >
                  Flag as Suspicious
                </button>
                <button
                  onClick={() => onFlagActivity(activity.id, false)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
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
