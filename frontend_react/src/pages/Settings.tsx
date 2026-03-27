import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, ShieldAlert, Cpu, Network, UserCog, 
  SlidersHorizontal, RefreshCcw, Save, CheckCircle, Zap, Globe, 
  Mail, Database, Activity, AlertCircle
} from 'lucide-react';

const Settings = () => {
  // Threshold States
  const [highRisk, setHighRisk] = useState(70);
  const [medRisk, setMedRisk] = useState(40);
  
  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  // Math simulation for Live Preview
  // Baseline users: High 59, Med 120, Low 300 (Sum = 479)
  // If highRisk drops from 70, high users go up.
  const baselineHigh = 59;
  const simulatedHigh = Math.max(10, Math.round(baselineHigh + (70 - highRisk) * 1.5));
  const simulatedMed = Math.max(10, Math.round(120 + (highRisk - 70) * 1.5 + (40 - medRisk) * 2));
  const simulatedLow = 479 - simulatedHigh - simulatedMed;

  const diffHigh = simulatedHigh - baselineHigh;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasSaved(true);
      setTimeout(() => setHasSaved(false), 3000);
    }, 1500);
  };

  const handleReset = () => {
    setHighRisk(70);
    setMedRisk(40);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-32">
      
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6 sticky top-0 bg-slate-50 z-10 pt-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                 <SettingsIcon className="text-primary"/> AI Control Hub
              </h2>
           </div>
           <p className="text-slate-500 font-medium max-w-2xl">Configure AI model parameters, manipulate risk detection thresholds, and route business logic.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={handleReset} className="bg-white border hover:bg-slate-50 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
              <RefreshCcw size={16}/> Reset Defaults
           </button>
           <button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-primary/20 min-w-[160px] justify-center disabled:opacity-80">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (hasSaved ? <CheckCircle size={16}/> : <Save size={16}/>)}
              {isSaving ? 'Recalibrating...' : (hasSaved ? 'System Updated' : 'Apply Changes')}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         
         {/* 🧩 LEFT COLUMN: Math Rules & AI */}
         <div className="col-span-12 lg:col-span-7 space-y-8">
            
            {/* 1. RISK THRESHOLD CONTROL + IMPACT PREVIEW */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 md:p-8 border-b border-slate-100">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-1">
                     <SlidersHorizontal size={20} className="text-primary"/> Risk Threshold Calibrator
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Define exactly how the neural network clusters user risk segments.</p>
               </div>
               
               <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Sliders */}
                  <div className="space-y-6">
                     <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                           <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk Baseline</span> 
                           <span className="text-rose-600">&gt; {(highRisk / 100).toFixed(2)}</span>
                        </div>
                        <input type="range" min="50" max="95" value={highRisk} onChange={(e) => setHighRisk(parseInt(e.target.value))} className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg cursor-pointer"/>
                     </div>
                     <div>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                           <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium Risk Baseline</span> 
                           <span className="text-amber-600">{(medRisk / 100).toFixed(2)} - {(highRisk / 100).toFixed(2)}</span>
                        </div>
                        <input type="range" min="15" max={highRisk - 5} value={medRisk} onChange={(e) => setMedRisk(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"/>
                     </div>
                  </div>

                  {/* Impact Preview */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={64}/></div>
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2"><Zap size={14} className="text-amber-500"/> Live Impact Preview</h4>
                     
                     <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center text-sm">
                           <span className="font-bold text-slate-700">High Risk Cohort:</span>
                           <div className="flex items-center gap-2">
                              <span className="font-black text-rose-600">{simulatedHigh} users</span>
                              {diffHigh !== 0 && (
                                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${diffHigh > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {diffHigh > 0 ? '+' : ''}{diffHigh}
                                 </span>
                              )}
                           </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="font-bold text-slate-700">Medium Risk Cohort:</span>
                           <span className="font-black text-amber-600">{simulatedMed} users</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="font-bold text-slate-700">Low Risk Cohort:</span>
                           <span className="font-black text-emerald-600">{simulatedLow} users</span>
                        </div>
                     </div>
                     
                     {diffHigh > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                           <p className="text-xs font-medium text-rose-600 flex items-start gap-1.5">
                              <AlertCircle size={14} className="shrink-0 mt-0.5"/>
                              Lowering the threshold increased high-risk volume. Expected retention campaign costs will rise.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* 2 & 3. BUSINESS RULES & CAMPAIGN CONFIG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                     <ShieldAlert size={20} className="text-indigo-500"/> Business Rules
                  </h3>
                  <div className="space-y-5">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Inactivity Definition</label>
                        <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 ring-primary/20 outline-none">
                           <option>30 Days No Login</option>
                           <option>15 Days No Login</option>
                           <option>60 Days No Login</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Defection Marker</label>
                        <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 ring-primary/20 outline-none">
                           <option>No purchase for 60 days</option>
                           <option>Subscription Canceled</option>
                           <option>Invoice 15 days overdue</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                     <UserCog size={20} className="text-emerald-500"/> Campaign Config
                  </h3>
                  <div className="space-y-5">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Default Discount Bracket</label>
                        <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 ring-primary/20 outline-none">
                           <option>Tier 1: 20% Discount</option>
                           <option>Tier 2: 15% Discount</option>
                           <option>Dynamic (AI Decides)</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Retention Assumption</label>
                        <div className="flex items-center gap-3">
                           <input type="number" defaultValue={25} className="w-20 bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 text-center focus:ring-2 ring-primary/20 outline-none"/>
                           <span className="text-sm font-medium text-slate-500">% Success Rate</span>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

         </div>

         {/* 🧩 RIGHT COLUMN: Integrations & System Parameters */}
         <div className="col-span-12 lg:col-span-5 space-y-8">
            
            {/* 4. AI MODEL SETTINGS */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white">
               <div className="absolute top-0 right-0 p-6 text-indigo-100"><Cpu size={64}/></div>
               <h3 className="text-lg font-black flex items-center gap-3 mb-6 relative z-10">
                  <Cpu size={20} className="text-primary"/> Model Parameters
               </h3>
               
               <div className="space-y-5 relative z-10">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Active Core Engine</label>
                     <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-black text-emerald-600 flex justify-between items-center shadow-sm">
                        <span>Scikit-Learn Logistic Regression</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"></span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Req Confidence</label>
                        <input type="text" readOnly value="> 80.0%" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700"/>
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Auto Retrain</label>
                        <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-primary/20">
                           <option>Enabled (Weekly)</option>
                           <option>Manual Trigger</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            {/* 5. INTEGRATIONS & ENDPOINTS */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Network size={20} className="text-amber-500"/> Integrations
               </h3>
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-lg border border-slate-200 text-rose-500"><Mail size={18}/></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Gmail SMTP Service</p>
                           <p className="text-xs font-medium text-slate-500">FastAPI Background Dispatcher</p>
                        </div>
                     </div>
                     <span className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span> Connected</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-lg border border-slate-200 text-slate-600"><Database size={18}/></div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Enterprise Database</p>
                           <p className="text-xs font-medium text-slate-500">SQLAlchemy ORM Mapping</p>
                        </div>
                     </div>
                     <span className="bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span> Synced</span>
                  </div>
               </div>
            </div>

            {/* 7. SYSTEM PREFERENCES */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
               <h3 className="text-sm font-black text-slate-900 flex items-center gap-3 mb-4 uppercase tracking-widest">
                  <Globe size={16} className="text-slate-400"/> System Preferences
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Currency</label>
                     <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Time Zone</label>
                     <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 outline-none">
                        <option>Asia/Kolkata (IST)</option>
                        <option>UTC</option>
                     </select>
                  </div>
               </div>
            </div>

         </div>

      </div>
    </div>
  );
};

export default Settings;
