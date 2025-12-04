import React, { useState, useRef, useEffect } from 'react';
import { PolicyModal } from './components/PolicyModal';
import { getPolicyRecommendation } from './services/geminiService';
import { PolicyConfig, AppState } from './types';
import { 
  Braces, 
  Sparkles, 
  LayoutGrid, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Settings,
  ArrowRightLeft
} from 'lucide-react';

// Default mock policy to show initially
const DEFAULT_POLICY: PolicyConfig = {
  storageName: "dpswl057.drm.lab.emc.com",
  storageUnit: "jinru-app-dpswl098-d104a",
  spaceUsedPercent: 18,
  totalSpaceGB: 388.7,
  location: "Boston DC",
  networkInterface: "dpswl057.drm.lab.emc.com",
  retentionLock: false,
  schedule: {
    type: "synthetic full",
    frequency: "Day",
    retentionDays: 2,
    windowStart: "9:44 AM",
    windowEnd: "9:46 AM",
    description: "Daily synthetic full backup retained for 2 days."
  }
};

const DEFAULT_CONTEXT = `{
  "assetType": "VMWARE_VIRTUAL_MACHINE",
  "id": "0b21f24c-8bdb-4aaa-8e1b-57c68c03ce53",
  "name": "auto create test policy 2025-12-03 15:39:01.949867",
  "description": null,
  "purpose": "CENTRALIZED",
  "disabled": false,
  "criticality": 2,
  "createdAt": "2025-12-03T07:37:48.686Z",
  "updatedAt": "2025-12-03T07:37:48.686Z",
  "objectives": [
    {
      "id": "a90b0477-4702-5f07-bf85-1074197f3fe4",
      "type": "BACKUP",
      "operations": [
        {
          "id": "df4f6583-5daf-50a0-b7c9-61c73973e798",
          "backupLevel": "FULL",
          "triggerType": "ON_SCHEDULE",
          "schedule": {
            "recurrence": {
              "type": "DAILY"
            },
            "window": {
              "startTime": "2025-12-03T14:17:00Z",
              "duration": "PT7H"
            }
          },
          "actionOnWindowExceeded": [
            {
              "state": "QUEUED",
              "action": "CANCEL_WITH_ALERT"
            }
          ]
        }
      ],
      "target": {
        "storageContainerId": "3759b25d-ea57-4634-8e54-6cb6c41b43c0",
        "storageTargetId": "ff3a378c-5bff-4084-b427-62cc6678b6e8"
      },
      "retentions": [
        {
          "id": "d9c088f8-4716-5859-b3c4-d4a82b3cac0b",
          "time": [
            {
              "unitValue": 11,
              "unitType": "DAY",
              "type": "RETENTION"
            }
          ]
        }
      ],
      "config": {
        "dataConsistency": "CRASH_CONSISTENT",
        "backupMechanism": "VADP"
      }
    }
  ]
}`;

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [policy, setPolicy] = useState<PolicyConfig>(DEFAULT_POLICY);
  const [contextJson, setContextJson] = useState(DEFAULT_CONTEXT);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePredict = async () => {
    if (!contextJson.trim()) return;
    
    setAppState(AppState.ANALYZING);
    try {
      const recommendedPolicy = await getPolicyRecommendation(contextJson);
      setPolicy(recommendedPolicy);
      setAppState(AppState.RECOMMENDING);
      setShowModal(true);
    } catch (e) {
      console.error(e);
      setAppState(AppState.ERROR);
    }
  };

  const handleApply = () => {
    setShowModal(false);
    setAppState(AppState.IDLE);
    // In a real app, this would save to backend
    alert("Policy Configuration Saved Successfully.");
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setShowModal(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7]">
      
      {/* Enterprise Header */}
      <header className="bg-[#1b2a32] text-white h-14 flex items-center px-4 shadow-sm z-30 flex-shrink-0">
        <div className="font-bold text-lg tracking-tight flex items-center gap-2">
           <ShieldCheck className="text-blue-400" />
           DataGuard <span className="font-light opacity-70">Enterprise Manager</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm font-light text-gray-300">
           <span>Administrator</span>
           <Settings size={18} />
        </div>
      </header>

      {/* Sub Header / Breadcrumbs */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center text-sm text-gray-600 shadow-sm z-20">
        <span className="text-blue-600 cursor-pointer hover:underline">Protection Policies</span>
        <ChevronRight size={14} className="mx-2 text-gray-400" />
        <span className="text-gray-800 font-medium">Policy Recommendation Engine</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
          <div className="p-4">
             <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-md flex items-center gap-3 text-sm font-medium border border-blue-100">
               <Sparkles size={16} />
               AI Assistant
             </div>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {['Dashboard', 'Policies', 'Storage Units', 'Assets', 'Jobs'].map(item => (
              <div key={item} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md text-sm cursor-pointer flex items-center gap-3">
                 <LayoutGrid size={16} className="text-gray-400" />
                 {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Workspace */}
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          
          <div className="p-8 max-w-6xl mx-auto w-full">
            
            {/* Input Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-md">
                  <Braces className="text-gray-600" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Backend Context API</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Provide the raw JSON context from the backend API. The AI engine will parse the schema, resolve IDs to simulated asset names, and map configurations to the UI.
                  </p>
                </div>
              </div>

              <div className="relative mt-2">
                <div className="absolute top-0 right-0 p-2 bg-gray-800 text-gray-400 text-xs rounded-tr-md rounded-bl-md font-mono">
                  JSON / Python Dict
                </div>
                <textarea
                  ref={inputRef}
                  value={contextJson}
                  onChange={(e) => setContextJson(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-4 text-green-400 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-[400px] resize-y shadow-inner scrollbar-thin scrollbar-thumb-gray-600"
                  spellCheck="false"
                  disabled={appState === AppState.ANALYZING}
                />
              </div>

              <div className="flex justify-end pt-2">
                 {appState === AppState.ERROR && (
                   <span className="text-red-500 text-sm flex items-center px-3 mr-auto">Error processing context. Check JSON format.</span>
                 )}
                 <button
                  onClick={handlePredict}
                  disabled={!contextJson || appState === AppState.ANALYZING}
                  className={`
                    px-6 py-2 rounded-md font-medium text-white shadow-md transition-all flex items-center gap-2
                    ${!contextJson || appState === AppState.ANALYZING 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'}
                  `}
                >
                  {appState === AppState.ANALYZING ? (
                    <>
                      <Activity className="animate-spin" size={18} />
                      Mapping Configuration...
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft size={18} />
                      Analyze & Recommend Policy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Background Data Mockup (to show simulated environment behind modal) */}
            <div className="opacity-50 pointer-events-none filter blur-[1px]">
               <div className="flex justify-between items-center mb-4">
                  <div className="text-sm font-bold text-gray-700">Existing Policies</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border rounded text-xs">Edit</button>
                    <button className="px-3 py-1 bg-white border rounded text-xs">Clone</button>
                  </div>
               </div>
               <div className="bg-white border rounded h-64 w-full p-4">
                  <div className="flex gap-8 text-xs text-gray-500 border-b pb-2 mb-2">
                     <span className="w-1/4">Name</span>
                     <span className="w-1/4">Type</span>
                     <span className="w-1/4">Status</span>
                     <span className="w-1/4">Last Run</span>
                  </div>
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-8 text-xs text-gray-800 py-3 border-b border-gray-100">
                       <span className="w-1/4 font-medium">Policy-Prod-DB-00{i}</span>
                       <span className="w-1/4">VMware Image</span>
                       <span className="w-1/4 text-green-600">Compliant</span>
                       <span className="w-1/4">Today, 2:00 AM</span>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* The Modal Overlay - replicates the screenshot */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <PolicyModal 
            policy={policy} 
            onClose={reset}
            onApply={handleApply}
          />
        </div>
      )}

    </div>
  );
}