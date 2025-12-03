import React from 'react';
import { PolicyConfig } from '../types';
import { X, Calendar, Database, Server, Clock } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

interface PolicyModalProps {
  policy: PolicyConfig;
  onClose: () => void;
  onApply: () => void;
  isLoading?: boolean;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policy, onClose, onApply, isLoading }) => {
  // Mock function to simulate local state changes in the UI before applying
  const [localPolicy, setLocalPolicy] = React.useState<PolicyConfig>(policy);

  React.useEffect(() => {
    setLocalPolicy(policy);
  }, [policy]);

  const handleRetentionToggle = (val: boolean) => {
    setLocalPolicy(prev => ({ ...prev, retentionLock: val }));
  };

  const usedPercentage = localPolicy.spaceUsedPercent;
  const barColor = usedPercentage > 80 ? 'bg-red-500' : usedPercentage > 50 ? 'bg-yellow-500' : 'bg-[#0076CE]'; // Dell/VMware blueish

  return (
    <div className="bg-white rounded shadow-2xl w-full max-w-[1100px] flex flex-col overflow-hidden animate-fade-in border border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 bg-white">
        <h2 className="text-xl text-[#333] font-normal">Primary Backup</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row p-8 gap-12 bg-white">
        
        {/* Left Column: Target Configuration */}
        <div className="flex-1 space-y-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Target</h3>
          
          <div className="grid grid-cols-[140px_1fr] gap-y-5 items-start text-sm">
            
            <div className="text-gray-500 font-medium pt-1">Storage Name:</div>
            <div className="text-gray-800">{localPolicy.storageName}</div>

            <div className="text-gray-500 font-medium pt-1">Storage Unit:</div>
            <div className="text-gray-800">{localPolicy.storageUnit}</div>

            <div className="text-gray-500 font-medium pt-1">Space:</div>
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-full max-w-[200px] bg-gray-200 rounded-sm overflow-hidden">
                  <div className={`h-full ${barColor}`} style={{ width: `${usedPercentage}%` }}></div>
                </div>
                <span className="text-gray-600 text-xs">{Math.round(usedPercentage)}% of {localPolicy.totalSpaceGB} GB</span>
              </div>
            </div>

            <div className="text-gray-500 font-medium pt-1">Location:</div>
            <div className="text-gray-800">{localPolicy.location || "N/A"}</div>

            <div className="text-gray-500 font-medium pt-1">Network Interface:</div>
            <div className="text-gray-800">{localPolicy.networkInterface}</div>

            <div className="text-gray-500 font-medium pt-1">Retention Lock:</div>
            <div>
              <ToggleSwitch 
                checked={localPolicy.retentionLock} 
                onChange={handleRetentionToggle}
                label={localPolicy.retentionLock ? "On" : "Off"}
              />
            </div>

            <div className="text-gray-500 font-medium pt-1">SLA:</div>
            <div className="text-gray-800">{localPolicy.sla || "None"}</div>
          </div>
        </div>

        {/* Right Column: Schedule Configuration */}
        <div className="flex-1 space-y-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Schedule</h3>

          {/* Schedule Card */}
          <div className="border border-gray-200 rounded p-5 flex gap-4 bg-white hover:border-blue-400 transition-colors cursor-default">
            <div className="mt-1">
               <div className="w-6 h-6 bg-gray-700 text-white flex items-center justify-center rounded-sm text-xs font-bold">
                 F
               </div>
            </div>
            <div className="text-sm text-gray-800 leading-relaxed">
              Create a <strong>{localPolicy.schedule.type}</strong> backup every <strong>{localPolicy.schedule.frequency}</strong>. 
              Retain for <strong>{localPolicy.schedule.retentionDays} Days</strong>. 
              Back up <strong>between {localPolicy.schedule.windowStart} and {localPolicy.schedule.windowEnd}</strong>.
              <div className="mt-1 text-gray-500">
                Cancel queued jobs that do not complete within the schedule window.
              </div>
            </div>
          </div>
          
          {/* Decorative placeholders for other schedule options */}
           <div className="opacity-40 pointer-events-none border border-gray-100 p-4 rounded text-sm text-gray-400">
              + Add Replication Schedule
           </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="bg-gray-50 px-8 py-4 flex justify-end gap-3 border-t border-gray-200">
         <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">
           Cancel
         </button>
         <button 
           onClick={onApply} 
           disabled={isLoading}
           className="px-5 py-2 text-sm font-medium text-white bg-[#0076CE] rounded hover:bg-[#005c9e] shadow-sm flex items-center gap-2"
         >
           {isLoading ? 'Processing...' : 'OK'}
         </button>
      </div>
    </div>
  );
};