import React, { useState, useRef, useEffect } from 'react';
import { PolicyModal } from './components/PolicyModal';
import { getPolicyRecommendation } from './services/geminiService';
import { PolicyConfig, AppState } from './types';
import { 
  Bot, 
  Sparkles, 
  LayoutGrid, 
  HardDrive, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Search,
  Settings
} from 'lucide-react';

// Default mock policy to show initially or as fallback
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

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [policy, setPolicy] = useState<PolicyConfig>(DEFAULT_POLICY);
  const [prompt, setPrompt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePredict = async () => {
    if (!prompt.trim()) return;
    
    setAppState(AppState.ANALYZING);
    try {
      const recommendedPolicy = await getPolicyRecommendation(prompt);
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
    setPrompt("");
    // In a real app, this would save to backend
    alert("Policy Configuration Saved Successfully.");
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setShowModal(false);
  }

  // Auto-resize textarea
  useEffect(() => {
    if(inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [prompt]);

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
          
          <div className="p-8 max-w-5xl mx-auto w-full">
            
            {/* Input Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                  <Bot className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Policy Architect</h1>
                  <p className="text-gray-500 mt-1">
                    Describe your data protection requirements. Our engine will analyze infrastructure availability and compliance rules to recommend the optimal configuration.
                  </p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., I need a high-performance backup for my production Oracle databases. They are 500GB in size. We need aggressive retention for 7 years for compliance, and the backup window is tight (2am to 4am)."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px] resize-none text-base shadow-inner"
                  disabled={appState === AppState.ANALYZING}
                />
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                   {appState === AppState.ERROR && (
                     <span className="text-red-500 text-sm flex items-center px-3">Failed to generate. Try again.</span>
                   )}
                   <button
                    onClick={handlePredict}
                    disabled={!prompt || appState === AppState.ANALYZING}
                    className={`
                      px-6 py-2 rounded-md font-medium text-white shadow-md transition-all flex items-center gap-2
                      ${!prompt || appState === AppState.ANALYZING 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'}
                    `}
                  >
                    {appState === AppState.ANALYZING ? (
                      <>
                        <Activity className="animate-spin" size={18} />
                        Analyzing Infrastructure...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Generate Recommendation
                      </>
                    )}
                  </button>
                </div>
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