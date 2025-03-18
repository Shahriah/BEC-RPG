import React from 'react';
import { Clock, TrendingUp, AlertTriangle, Activity, Info } from 'lucide-react';

const TimelineAnalysisView = ({ activity }) => {
  
  const { 
    employee = 'Unknown Employee', 
    department = 'Unknown Department', 
    normalPattern = 'No established normal pattern', 
    timeline = [] 
  } = activity;

  // set normal activities and abnormal activities
  const normalActivities = timeline.filter(item => item.isNormal);
  const abnormalActivities = timeline.filter(item => !item.isNormal);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* historical activity timeline */}
      <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
        <h3 className="font-semibold flex items-center gap-2 mb-3 text-sm sm:text-base">
          <Activity className="w-4 h-4" />
          Historical Activity Pattern
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm">
            <p className="mb-2">Normal Pattern: {normalPattern}</p>
          </div>

          {/* previous activities timeline */}
          <div className="relative">
            {timeline.map((item, index) => (
              <div 
                key={index} 
                className={`mb-3 sm:mb-4 relative pl-6 border-l-2 ${
                  item.isNormal ? 'border-blue-200' : 'border-red-200'
                }`}
              >
                <div 
                  className={`absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full ${
                    item.isNormal 
                    ? 'bg-blue-100 border-2 border-blue-400' 
                    : 'bg-red-100 border-2 border-red-400'
                  }`} 
                />
                <div className="text-xs sm:text-sm">
                  <div className="font-medium">
                    {item.date} at {item.time}
                  </div>
                  <div className={`${!item.isNormal ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {item.action}: {item.details}
                  </div>
                  <div className="text-gray-600">
                    Location: {item.location}
                  </div>
                  {!item.isNormal && item.alerts && (
                    <div className="mt-1 space-y-1">
                      {item.alerts.map((alert, alertIndex) => (
                        <div 
                          key={alertIndex} 
                          className="flex items-center gap-2 text-red-600"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">{alert}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* abnormal activities*/}
      {abnormalActivities.length > 0 && (
        <div className="bg-red-50 p-4 sm:p-6 rounded-lg">
          <h3 className="font-semibold flex items-center gap-2 mb-3 text-sm sm:text-base">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Abnormal Activities Detected
          </h3>
          <ul className="space-y-1 sm:space-y-2">
            {abnormalActivities.map((item, index) => (
              <li key={index} className="text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <span className="font-medium">{item.date} at {item.time}: </span>
                    {item.details}
                  </div>
                </div>
                {item.alerts && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.alerts.map((alert, alertIndex) => (
                      <div key={alertIndex} className="text-xs text-red-700">
                        • {alert}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TimelineAnalysisView;
