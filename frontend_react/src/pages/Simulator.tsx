import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  Rocket, Lightbulb, Users, Target, DollarSign, Activity, 
  CheckCircle, History, Sliders, Gift, Mail, Phone, ArrowUpRight, Bot
} from 'lucide-react';

// Mock History
const historyData = [
  { id: 1, month: 'Feb', target: 50, retained: 12, roi: '2.8x', type: 'Discount' },
  { id: 2, month: 'Jan', target: 120, retained: 18, roi: '1.4x', type: 'Email' },
];

const Simulator = () => {
  // 🧩 Build State
  const [segment, setSegment] = useState('High Risk');
  const [campaignType, setCampaignType] = useState('Discount');
  const [budget, setBudget] = useState(1500); // INR

  // 🧩 Execution State
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);

  // 🧩 Simulation Math Engine
  const targetUsers = segment === 'High Risk' ? 59 : 142;
  const avgValue = 265; // INR LTV per month average
  
  // Base Retentions
  let retentionRate = 0;
  if (campaignType === 'Discount') retentionRate = 0.24;
  if (campaignType === 'Email') retentionRate = 0.15;
  if (campaignType === 'Support') retentionRate = 0.18;

  // Personalization Config
  const discountConfig = segment === 'High Risk' ? '20% Discount' : '10% Discount';

  const expectedRetained = Math.round(targetUsers * retentionRate);
  const revenueSaved = expectedRetained * avgValue;
  const roi = (budget > 0) ? (revenueSaved / budget).toFixed(1) : '∞';

  // Strategy Comparison Math for the specific Segment
  const stratData = [
    { name: 'Discount 🎁', retained: Math.round(targetUsers * 0.24) },
    { name: 'Support Call 🤝', retained: Math.round(targetUsers * 0.18) },
    { name: 'Email Drop 📩', retained: Math.round(targetUsers * 0.15) }
  ];

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-32">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                 <Rocket className="text-primary"/> AI Strategy Engine
              </h2>
              <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                 Simulation Layer
              </span>
           </div>
           <p className="text-slate-500 font-medium max-w-2xl">Predict, compare, and execute retention campaigns. Determine optimal ROI before allocating budget.</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-sm font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">Confidence: <span className="text-slate-900">82.4%</span></span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
         
         {/* 🧩 LEFT COLUMN: Campaign Builder & Execution */}
         <div className="col-span-12 lg:col-span-5 space-y-6">
            
            {/* BUILDER */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Sliders size={20} className="text-primary"/> Campaign Builder
               </h3>
               
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">1. Target Segment</label>
                     <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setSegment('High Risk')} className={`py-3 px-4 rounded-xl text-sm font-bold border transition-colors ${segment === 'High Risk' ? 'bg-primary/5 text-primary border-primary/30' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}>High-Risk Users</button>
                        <button onClick={() => setSegment('Medium Risk')} className={`py-3 px-4 rounded-xl text-sm font-bold border transition-colors ${segment === 'Medium Risk' ? 'bg-primary/5 text-primary border-primary/30' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'}`}>Medium-Risk Users</button>
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">2. Campaign Protocol</label>
                     <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => setCampaignType('Discount')} className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-2 transition-colors ${campaignType === 'Discount' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'} `}><Gift size={18}/> Discount</button>
                        <button onClick={() => setCampaignType('Email')} className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-2 transition-colors ${campaignType === 'Email' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'} `}><Mail size={18}/> Email Blast</button>
                        <button onClick={() => setCampaignType('Support')} className={`py-3 px-3 rounded-xl text-xs font-bold border flex flex-col items-center gap-2 transition-colors ${campaignType === 'Support' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'} `}><Phone size={18}/> Support Call</button>
                     </div>
                  </div>

                  <div>
                     <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>3. Total Budget</span> <span className="text-primary tracking-tight">₹{budget.toLocaleString()}</span></div>
                     <input type="range" min="0" max="10000" step="100" value={budget} onChange={(e) => setBudget(parseInt(e.target.value))} className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
               </div>
            </div>

            {/* EXECUTION PANEL */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-primary/20 shadow-sm relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
               {!hasExecuted ? (
                  <div className="text-center space-y-4">
                     <h3 className="text-lg font-black text-slate-900">Ready to Deploy?</h3>
                     <p className="text-sm text-slate-500 font-medium pb-2">Deploying this strategy will immediately queue the actions via backend integrators.</p>
                     <button onClick={handleExecute} disabled={isExecuting} className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                        {isExecuting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Rocket size={20}/>}
                        {isExecuting ? 'Routing Protocol...' : 'Execute Campaign'}
                     </button>
                  </div>
               ) : (
                  <div className="space-y-4 animate-in zoom-in duration-300">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><CheckCircle size={24}/></div>
                        <div>
                           <h3 className="text-lg font-black text-slate-900">Campaign Executed 🚀</h3>
                           <p className="text-xs font-bold tracking-widest uppercase text-emerald-600">Active Pipeline Link</p>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> {targetUsers} actions dispatched</div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> {expectedRetained} users expected to retain</div>
                        <div className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle size={16} className="text-emerald-500"/> ₹{revenueSaved.toLocaleString()} revenue protected</div>
                     </div>
                     <button onClick={() => setHasExecuted(false)} className="w-full mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-primary transition-colors">Reset Execution Terminal</button>
                  </div>
               )}
            </div>

         </div>

         {/* 🧩 RIGHT COLUMN: Simulation & Math */}
         <div className="col-span-12 lg:col-span-7 space-y-6">
            
            {/* SIMULATION RESULTS */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-8">
                  <Activity size={20} className="text-primary"/> Simulation Projection
               </h3>
               
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl relative overflow-hidden">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Users Targeted</span>
                     <span className="text-3xl font-black text-slate-900">{targetUsers}</span>
                     <Users className="absolute bottom-4 right-4 text-slate-200" size={32}/>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl relative overflow-hidden">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">Retained (Exp)</span>
                     <span className="text-3xl font-black text-indigo-700">{expectedRetained}</span>
                     <Target className="absolute bottom-4 right-4 text-indigo-200" size={32}/>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl relative overflow-hidden">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Rev Saved</span>
                     <span className="text-2xl font-black text-emerald-700 tracking-tight">₹{revenueSaved.toLocaleString()}</span>
                     <DollarSign className="absolute bottom-4 right-4 text-emerald-200" size={32}/>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl relative overflow-hidden">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Return (ROI)</span>
                     <span className="text-3xl font-black text-amber-700 tracking-tight">{roi}x</span>
                     <ArrowUpRight className="absolute bottom-4 right-4 text-amber-200" size={32}/>
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="bg-white p-2 border border-slate-200 shadow-sm rounded-xl text-primary"><Bot size={20}/></div>
                  <div>
                     <h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-widest">Personalization Engine</h4>
                     <p className="text-slate-600 text-sm font-medium leading-relaxed">Dynamic rules applied: Recommending <strong>{discountConfig}</strong> for the {segment} segment based on highest historical conversion elasticity.</p>
                  </div>
               </div>
            </div>

            {/* STRATEGY COMPARISON */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-2">
                  <Activity size={20} className="text-primary"/> Strategy Comparison
               </h3>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Expected Retained Users vs Control</p>
               
               <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={stratData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip 
                           cursor={{fill: '#f8fafc'}}
                           contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                           itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="retained" radius={[8, 8, 0, 0]} barSize={60}>
                           {stratData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : index === 1 ? '#34d399' : '#94a3b8'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* CAMPAIGN HISTORY */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <History size={20} className="text-slate-400"/> Execution Ledger
               </h3>
               
               <div className="space-y-3">
                  {historyData.map((record) => (
                     <div key={record.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="bg-white border border-slate-200 shadow-sm text-slate-500 text-xs font-black uppercase px-3 py-1.5 rounded-lg">{record.month}</div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 mb-0.5">{record.type} Campaign</p>
                              <p className="text-xs font-medium text-slate-500 tracking-wide">Targeted: {record.target} • Retained: {record.retained}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-emerald-600">{record.roi}</p>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ROI</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Simulator;
