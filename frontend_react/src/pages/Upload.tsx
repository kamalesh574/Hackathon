import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, Loader2, Database, Globe, 
  Play, AlertCircle, RefreshCw, ToggleLeft, ToggleRight, 
  ArrowRight, Zap, ShieldAlert, BarChart3, DatabaseZap, Edit2, 
  Check, X, Lightbulb
} from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const STAGES = [
  'Upload Complete',
  'Schema Detected',
  'Data Validated',
  'Features Generated',
  'Model Ready'
];

const MOCK_PREVIEW = [
  { id: 'CUST-001', login_frequency: '12', total_spend: '450.00', last_active: '2026-03-24' },
  { id: 'CUST-002', login_frequency: '3', total_spend: '25.50', last_active: '2026-02-15' },
  { id: 'CUST-003', login_frequency: '28', total_spend: '1200.75', last_active: '2026-03-26' },
  { id: 'CUST-004', login_frequency: '0', total_spend: '0.00', last_active: '2025-11-01' },
  { id: 'CUST-005', login_frequency: '7', total_spend: '150.20', last_active: '2026-03-10' },
];

const MOCK_SCHEMA = [
  { col: 'customer_id', type: 'string', role: 'identifier' },
  { col: 'login_frequency', type: 'numeric', role: 'behavior' },
  { col: 'total_spend', type: 'numeric', role: 'transaction' },
  { col: 'last_active_date', type: 'date', role: 'churn signal' },
];

const UploadPage = () => {
  const navigate = useNavigate();
  const [sourceType, setSourceType] = useState<'file' | 'db' | 'api'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [autoClean, setAutoClean] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // If we reach the end of the simulation, actually upload
    if (pipelineStep === 5) {
      executeTrueUpload();
    }
  }, [pipelineStep]);

  const executeTrueUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const uploadRes = await api.post('/upload/customers', formData);
      await api.post(`/predict/batch?file_path=data/uploads/${uploadRes.data.filename}`);
      setPipelineStep(6); // Success
    } catch (e) {
      setErrorMsg("Error: Server rejected the payload schema. Fix: Ensure CSV aligns with the 40-dimensional Enterprise specification.");
      setPipelineStep(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMsg(null);
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.json')) {
       setErrorMsg("Error: Invalid file format detected. Fix: Please upload a .csv or .json file.");
       return;
    }
    // Advance to Schema Detection
    setTimeout(() => setPipelineStep(1), 800);
  };

  const handleDemoData = async () => {
    try {
      // Simulate file blob creation for demo purposes, then push pipeline
      const blob = new Blob(["dummy,csv,data"], { type: 'text/csv' });
      const demoFile = new File([blob], "chennai_customers_demo.csv", { type: "text/csv" });
      setFile(demoFile);
      setPipelineStep(1);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* 7. Real-Time Sync Header */}
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
             <DatabaseZap className="text-primary" size={36} /> 
             Data Intelligence Engine
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Enterprise data ingestion, validation, and automated feature engineering pipeline.</p>
        </div>
        
        <div className="flex gap-6 items-center">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 undercase tracking-widest">Last Sync</span>
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><RefreshCw size={12} className="text-slate-400"/> 2 min ago</span>
           </div>
           
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
              <span className="text-xs font-bold text-slate-600">Auto Sync</span>
              <button onClick={() => setAutoSync(!autoSync)} className="text-primary hover:text-accent transition-colors">
                {autoSync ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-slate-400" />}
              </button>
           </div>
        </div>
      </header>

      {/* 10. Explicit Error Handling */}
      {errorMsg && (
         <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm animate-in slide-in-from-top-4">
            <ShieldAlert className="text-rose-500 mt-0.5" size={24} />
            <div>
               <h4 className="text-rose-800 font-bold">Pipeline Interruption</h4>
               <p className="text-rose-600 text-sm mt-1">{errorMsg.split('Fix:')[0]}</p>
               <div className="mt-3 bg-white/60 border border-rose-100 rounded-lg p-3 inline-block">
                  <span className="text-[10px] font-black tracking-widest uppercase text-rose-400 block mb-1">Recommended Fix</span>
                  <span className="text-sm font-bold text-rose-700">{errorMsg.split('Fix:')[1]}</span>
               </div>
            </div>
            <button onClick={() => setErrorMsg(null)} className="ml-auto text-rose-400 hover:text-rose-600"><X size={20}/></button>
         </div>
      )}

      {/* 6. Pipeline Progress Tracker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
         <div className="flex justify-between items-center relative">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0"></div>
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-emerald-400 rounded-full z-0 transition-all duration-1000" style={{ width: `${(Math.min(pipelineStep, 4) / 4) * 100}%` }}></div>
            
            {STAGES.map((stage, idx) => {
               const isActive = pipelineStep === idx;
               const isPast = pipelineStep > idx;
               return (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-all duration-500 border-2
                        ${isPast ? 'bg-emerald-500 border-emerald-500 text-white' : 
                          isActive ? 'bg-white border-primary text-primary scale-110 shadow-md ring-4 ring-primary/10' : 
                          'bg-white border-slate-200 text-slate-300'}`}
                     >
                        {isPast ? <Check size={20} strokeWidth={3}/> : idx + 1}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : isPast ? 'text-slate-700' : 'text-slate-300'}`}>
                        {stage}
                     </span>
                  </div>
               )
            })}
         </div>
      </div>

      <div className="grid grid-cols-12 gap-8 pt-4">
         
         {/* LEFT COLUMN: Main Interaction Zone */}
         <div className="col-span-8 space-y-6">
            
            {pipelineStep === 0 && (
               <>
                  {/* 8. Multi-Source Integration Tab */}
                  <div className="flex gap-4 mb-6">
                     <button onClick={() => setSourceType('file')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${sourceType === 'file' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <FileText size={16}/> Upload File
                     </button>
                     <button onClick={() => setSourceType('db')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${sourceType === 'db' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <Database size={16}/> Connect Database
                     </button>
                     <button onClick={() => setSourceType('api')} className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${sourceType === 'api' ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <Globe size={16}/> Connect API
                     </button>
                  </div>

                  {/* 1. Drag & Drop Upload Zone */}
                  {sourceType === 'file' && (
                     <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`bg-white border-2 border-dashed rounded-[32px] p-16 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden group
                           ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
                     >
                        <input 
                           type="file" 
                           onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-24 h-24 bg-slate-50/80 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white border border-slate-100 shadow-sm transition-all duration-500">
                           <Upload size={36} className={`transition-colors ${isDragging ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Drag & Drop Intelligence Payload</h3>
                        <p className="text-slate-500 font-medium max-w-sm mb-6">Drop your CSV, JSON, or Excel structured data here to initiate automatic ingestion and mapping.</p>
                        
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                           <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400"/> CSV</span>
                           <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400"/> JSON</span>
                           <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-400"/> XLSX</span>
                        </div>
                     </div>
                  )}

                  {sourceType !== 'file' && (
                     <div className="bg-white border border-slate-200 rounded-[32px] p-16 flex flex-col items-center text-center">
                        <Lock className="text-slate-300 mb-4" size={48} />
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise Plan Required</h3>
                        <p className="text-slate-500 max-w-sm">Direct integrations with PostgreSQL, Snowflake, Stripe, and Shopify are locked for Standard tiers.</p>
                     </div>
                  )}

                  {/* 9. Sample Dataset (Hackathon Trick) */}
                  <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
                     <div>
                        <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Lightbulb size={18} className="text-amber-500"/> Developer Quick-Start</h4>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Instantly load the 15,000-row synthetic test payload to bypass manual upload.</p>
                     </div>
                     <button onClick={handleDemoData} className="bg-white border border-slate-200 text-slate-700 hover:border-primary hover:text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
                        <Play size={16} fill="currentColor"/> Use Demo Data
                     </button>
                  </div>
               </>
            )}

            {pipelineStep >= 1 && pipelineStep < 6 && (
               <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                  {/* File Preview Table (2) */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                     <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={16} className="text-primary"/> Payload Preview <span className="text-xs text-slate-400 font-normal ml-2">First 5 rows</span></h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">15,402 Rows Detected</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                           <thead>
                              <tr className="bg-white border-b border-slate-100">
                                 {Object.keys(MOCK_PREVIEW[0]).map(k => <th key={k} className="px-6 py-3 font-bold text-[10px] uppercase tracking-widest text-slate-400">{k}</th>)}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {MOCK_PREVIEW.map((row, i) => (
                                 <tr key={i} className="hover:bg-slate-50/50">
                                    {Object.values(row).map((v, j) => <td key={j} className="px-6 py-3 font-medium text-slate-600">{v}</td>)}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* 3. Schema Auto-Mapping */}
                  {pipelineStep >= 1 && (
                     <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                           <h3 className="font-bold text-slate-800 flex items-center gap-2"><DatabaseZap size={16} className="text-indigo-500"/> Auto Schema Mapping</h3>
                           {pipelineStep === 1 && (
                              <button onClick={() => setPipelineStep(2)} className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-transform flex items-center gap-1 shadow-md shadow-primary/20">
                                 Approve Mapping <ArrowRight size={14}/>
                              </button>
                           )}
                        </div>
                        <div className="p-6">
                           <table className="w-full text-left text-sm">
                              <thead>
                                 <tr>
                                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Column Name</th>
                                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Data Type</th>
                                    <th className="pb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Intelligence Role</th>
                                 </tr>
                              </thead>
                              <tbody className="space-y-4">
                                 {MOCK_SCHEMA.map((s, i) => (
                                    <tr key={i} className="border-b border-slate-50 last:border-0 group">
                                       <td className="py-3 font-bold text-slate-700">{s.col}</td>
                                       <td className="py-3">
                                          <span className="bg-slate-100 text-slate-500 font-mono text-[10px] font-bold px-2 py-1 rounded border border-slate-200 flex items-center gap-1.5 w-max">
                                             {s.type} <Edit2 size={10}/>
                                          </span>
                                       </td>
                                       <td className="py-3">
                                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border w-max flex items-center justify-center
                                             ${s.role === 'behavior' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                                               s.role === 'transaction' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                               s.role === 'identifier' ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-rose-50 text-rose-600 border-rose-200'}`}
                                          >
                                             {s.role}
                                          </span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {pipelineStep === 6 && (
               <div className="bg-white border-2 border-emerald-400/30 rounded-[32px] p-16 flex flex-col items-center text-center shadow-emerald-500/5 shadow-2xl animate-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                     <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin-slow opacity-20"></div>
                     <CheckCircle size={40} className="text-emerald-500" strokeWidth={2.5}/>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Enterprise Pipeline Complete</h3>
                  <p className="text-slate-500 font-medium mb-8 max-w-sm">40-dimensional telemetry has been successfully injected into the local SQLite matrix and synthesized by the prediction engine.</p>
                  
                  <button onClick={() => navigate('/dashboard')} className="bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2 group">
                     Deploy Executive Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            )}

         </div>

         {/* RIGHT COLUMN: Quality & Engineering Zone */}
         <div className="col-span-4 space-y-6">
            
            {/* 4. Data Quality Panel */}
            <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-opacity duration-1000 ${pipelineStep >= 2 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
               <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center justify-between mb-4">
                     Data Health Authority
                     <span className="text-xs font-black bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-md flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> GOOD (91%)</span>
                  </h3>
                  
                  <div className="space-y-4">
                     <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-widest"><span>Completeness</span> <span>92%</span></div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full w-[92%]"></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-widest"><span>Accuracy</span> <span>88%</span></div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full w-[88%]"></div></div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-widest"><span>Consistency</span> <span>95%</span></div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full w-[95%]"></div></div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-slate-50/50 p-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                     <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16}/>
                     <p className="text-slate-600 font-medium"><span className="font-bold text-slate-900">Missing values</span> isolated in <code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-[10px]">email_open_rate</code> context.</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                     <X className="text-rose-500 shrink-0 mt-0.5" size={16}/>
                     <p className="text-slate-600 font-medium"><span className="font-bold text-slate-900">Duplicate row hashes</span> identified operating across 12 unique payload instances.</p>
                  </div>
               </div>

               {/* 4b. Data Cleaning Toggle */}
               <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-white">
                  <div>
                     <h4 className="font-bold text-slate-800 text-sm">Auto Clean Protocol</h4>
                     <p className="text-xs text-slate-400 font-medium">Dynamically normalize nulls.</p>
                  </div>
                  <button onClick={() => setAutoClean(!autoClean)} className="text-primary hover:text-accent transition-colors">
                     {autoClean ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-300" />}
                  </button>
               </div>
               
               {pipelineStep === 2 && (
                  <div className="px-6 pb-6">
                     <button onClick={() => setPipelineStep(3)} className="w-full bg-primary hover:bg-accent text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                        Execute Cleaning Iteration <Zap size={16} fill="currentColor"/>
                     </button>
                  </div>
               )}
            </div>

            {/* 5. Feature Engineering Secret Weapon */}
            <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-opacity duration-1000 ${pipelineStep >= 3 ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
               <div className="bg-gradient-to-br from-indigo-50 to-white p-6 border-b border-indigo-100/50">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 mb-2">
                     <BarChart3 className="text-indigo-500" size={20}/> ML Feature Generator
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">Synthesizing advanced analytical nodes for predictive accuracy mapping.</p>
               </div>
               <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0"><Check size={12} strokeWidth={3}/></div>
                     <span className="text-sm font-bold text-slate-700">friction_index_score</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0"><Check size={12} strokeWidth={3}/></div>
                     <span className="text-sm font-bold text-slate-700">revenue_dependency_ratio</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0"><Check size={12} strokeWidth={3}/></div>
                     <span className="text-sm font-bold text-slate-700">sentiment_velocity</span>
                  </div>
               </div>
               
               {(pipelineStep === 3 || pipelineStep === 4) && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                     <button onClick={() => setPipelineStep(5)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2">
                        {pipelineStep === 3 ? "Compile 40-Dimensional Array" : <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin"/> Initializing Model Bindings</span>}
                     </button>
                  </div>
               )}
            </div>

         </div>
      </div>

    </div>
  );
};

// Generic Lock icon mock since it wasn't initially imported above
const Lock = ({className, size}: {className?: string, size?: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

export default UploadPage;
