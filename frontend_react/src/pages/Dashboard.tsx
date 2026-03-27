import React, { useEffect, useState, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, LineChart, Line, Legend, ComposedChart 
} from 'recharts';
import { 
  Users, AlertTriangle, TrendingDown, IndianRupee, Activity, 
  MapPin, Smartphone, CreditCard, Clock, Lightbulb, BrainCircuit, 
  ArrowRight, ShieldAlert, Sparkles, Crosshair, Play, Info, Target, Calendar, Zap,
  X, CheckCircle2, Loader2, Bot, MessageSquare
} from 'lucide-react';
import api from '../lib/api';

const Dashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [revAtRisk, setRevAtRisk] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  
  // Custom states for interactive elements
  const [forecastScenario, setForecastScenario] = useState<'baseline' | 'optimized'>('baseline');
  const [activeSegment, setActiveSegment] = useState<'location' | 'plan' | 'device'>('plan');

  // ACTION ENGINE STATES
  const [isInterrogating, setIsInterrogating] = useState(false);
  const [isExecutingProtocol, setIsExecutingProtocol] = useState(false);
  const [protocolStep, setProtocolStep] = useState(0);
  const [metricsUpdated, setMetricsUpdated] = useState(false);

  // CHAT COPILOT ENGINE
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'ai', content: <p>I am the <strong>ChurnSense Intelligence Engine</strong>. I synthesize live telemetry to predict defection and prescribe rescue strategies. How can I augment your operations today?</p> }
  ]);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    const fetchData = async () => {
      try {
         const [sRes, rRes, tRes] = await Promise.all([
           api.get('/analytics/executive-summary'),
           api.get('/analytics/revenue-at-risk'),
           api.get('/analytics/deep-telemetry').catch(() => ({ data: { sentiment: {}, financial: {} } }))
         ]);
         setSummary(sRes.data);
         setRevAtRisk(rRes.data);
         setTelemetry(tRes.data);
      } catch (e) {
         console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleExecuteProtocol = () => {
     setIsExecutingProtocol(true);
     setProtocolStep(1);
     setTimeout(() => setProtocolStep(2), 1500); // Campaign deploy
     setTimeout(() => setProtocolStep(3), 3200); // VIP Support bind
     setTimeout(() => {
        setProtocolStep(4); // Success
        setMetricsUpdated(true); // Mutate numbers
     }, 4800);
  };

  const handleChatSubmit = (e: any, presetText: string | null = null) => {
     if (e) e.preventDefault();
     const text = presetText || chatInput;
     if (!text.trim()) return;

     setChatMessages(prev => [...prev, { role: 'user', content: <p>{text}</p>}]);
     setChatInput('');
     setIsTyping(true);

     setTimeout(() => {
        const lower = text.toLowerCase();
        let matched = <p>Processing complete. Command sequence unverified. Please rephrase your operational query regarding <strong className="text-slate-800">Churn</strong>, <strong className="text-slate-800">Revenue Risk</strong>, or the <strong className="text-slate-800">Premium Cohort</strong>.</p>;
        
        if (lower.includes('churn') || lower.includes('premium')) {
            matched = (
              <>
                 <p>I have isolated two major statistical anomalies driving the defection velocity in Premium accounts:</p>
                 <ul className="space-y-2 font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 my-3">
                    <li className="flex items-start gap-2"><TrendingDown className="text-rose-500 shrink-0 mt-0.5" size={16}/> Low app activity dropped by -30% over the last 14 days.</li>
                    <li className="flex items-start gap-2"><AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16}/> Open support tickets increased by +22% following the v4.2 update.</li>
                 </ul>
                 <p className="mb-3 font-medium text-slate-600">I recommend aggressively targeting the 59 localized high-risk users with priority support routing and an automated 20% rescue incentive campaign.</p>
                 <button onClick={() => {setIsInterrogating(false); handleExecuteProtocol();}} className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm text-xs cursor-pointer active:scale-95">
                    <Target size={14}/> Execute AI Recommendation
                 </button>
              </>
            );
        } else if (lower.includes('revenue') || lower.includes('forecast') || lower.includes('impact')) {
            matched = (
              <>
                <p>Based on the predictive cohort model, current <strong className="text-rose-600">₹65,405</strong> in capital is at severe risk across our Tier-1 and Android origins.</p>
                <p className="mt-2 text-slate-600">However, executing the <strong className="text-slate-800">Optimized Scenario strategy</strong> will stabilize vector deviations, structurally recovering up to <strong className="text-emerald-600">₹41,859 (64% recovery rate)</strong> by the end of Q2.</p>
              </>
            );
        } else if (lower.includes('nps') || lower.includes('sentiment') || lower.includes('score')) {
            matched = (
              <>
                <p>The total NPS index has decayed significantly to <strong>5.6/100</strong>.</p>
                <p className="mt-2 text-rose-600 font-medium">Sentiment constraint analysis on recent App Store reviews indicates major demographic frustration with UI freezes in iOS version 4.2.</p>
                <p className="mt-2 font-bold text-slate-800">Rollback to stable v4.1 or immediate hotfix deployment is strictly advised to protect the LTV pipeline.</p>
              </>
            );
        }

        setChatMessages(prev => [...prev, { role: 'ai', content: matched }]);
        setIsTyping(false);
     }, 1200);
  };

  // Mutable UI Metrics overriding the API backend when Protocol Success is triggered
  const currentRiskAccounts = metricsUpdated ? Math.max(0, (summary?.high_risk_customers || 59) - 14) : (summary?.high_risk_customers || 59);
  const currentChurnRate = metricsUpdated ? Math.max(10.1, (summary?.estimated_churn_rate || 18.4) - 8.3).toFixed(1) : (summary?.estimated_churn_rate || '18.4');

  // Mock Forecast Data representing Baseline vs Optimized scenarios
  const forecastData = [
    { month: 'Jan', baseline: 12, optimized: 12, actual: 12 },
    { month: 'Feb', baseline: 14, optimized: 14, actual: 14 },
    { month: 'Mar', baseline: 18, optimized: 18, actual: 18 },
    { month: 'Apr', baseline: 21, optimized: 15, actual: null },
    { month: 'May', baseline: 24, optimized: 13, actual: null },
    { month: 'Jun', baseline: 25, optimized: 12, actual: null },
  ];

  const rootCauses = [
    { driver: "Low App Activity", impact: -30, color: "bg-rose-500" },
    { driver: "High Support Complaints", impact: +22, color: "bg-orange-500" },
    { driver: "Payment Gateway Failures", impact: -18, color: "bg-amber-500" },
    { driver: "Competitor Promo Pricing", impact: +15, color: "bg-indigo-500" },
  ];

  const riskSegments = {
    location: [{ name: 'Tier 2 Cities', risk: 85 }, { name: 'Tier 1 Metro', risk: 45 }, { name: 'International', risk: 20 }],
    plan: [{ name: 'Monthly Basic', risk: 92 }, { name: 'Annual Pro', risk: 34 }, { name: 'Enterprise', risk: 12 }],
    device: [{ name: 'Android OS', risk: 78 }, { name: 'iOS App', risk: 41 }, { name: 'Web Portal', risk: 22 }]
  };

  const recoverableRev = revAtRisk ? Math.floor(revAtRisk.revenue_at_risk * 0.64) : 42000;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24 relative">
      
      {/* HEADER & BENCHMARKING */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 relative z-10 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
             <BrainCircuit className="text-primary" size={36} /> 
             AI Command Center
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Predictive synthesis and prescriptive execution engine.</p>
        </div>
        
        <div className="flex w-full md:w-auto bg-slate-50/50 border border-slate-200 rounded-2xl p-4 gap-8">
           <div className="flex-1 md:flex-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Churn Rate</span>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">
                 {currentChurnRate}% 
                 {metricsUpdated && <span className="text-xs text-emerald-500 bg-emerald-50 px-2 rounded font-bold animate-pulse">↓ Fixed</span>}
              </div>
           </div>
           <div className="w-[1px] bg-slate-200"></div>
           <div className="flex-1 md:flex-none">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry Avg</span>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">12.0% <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full mt-0.5 hidden sm:inline-flex">⚠ High Risk</span></div>
           </div>
        </div>
      </header>

      {/* 2. DYNAMIC AI INSIGHT BANNER */}
      <div className={`border rounded-[32px] shadow-sm relative overflow-hidden group transition-all duration-1000 ${metricsUpdated ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' : 'bg-gradient-to-r from-rose-50 to-indigo-50 border-slate-200'}`}>
         <div className={`absolute top-0 right-0 w-96 h-96 opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 z-0 transition-colors duration-1000 ${metricsUpdated ? 'bg-teal-500' : 'bg-rose-500'}`}></div>
         <div className={`absolute bottom-0 left-0 w-96 h-96 opacity-5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 z-0 transition-colors duration-1000 ${metricsUpdated ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
         
         <div className="relative z-10 p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start gap-8 xl:gap-12">
            <div className="flex-1 space-y-5 w-full">
               
               {metricsUpdated ? (
                  <div className="flex items-center gap-3 text-emerald-700 font-bold bg-emerald-100/80 border border-emerald-200 w-max max-w-full text-sm sm:text-base px-5 py-2 rounded-full shadow-sm animate-in zoom-in duration-500">
                     <CheckCircle2 size={18} className="text-emerald-600 shrink-0"/> <span className="truncate">Retention Campaign Successfully Deployed</span>
                  </div>
               ) : (
                  <div className="flex items-center gap-3 text-rose-600 font-bold bg-rose-100/50 border border-rose-200 w-max max-w-full text-sm sm:text-base px-4 py-1.5 rounded-full shadow-sm">
                     <ShieldAlert size={18} className="text-rose-500 shrink-0"/> <span className="truncate">Churn Spike Detected in Premium Cohorts</span>
                  </div>
               )}
               
               {metricsUpdated ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-medium animate-in fade-in duration-700">
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">Resolved Vectors</span>
                        <ul className="space-y-2 text-slate-700">
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div> VIP Routing active for 59 accounts</li>
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div> 20% rescue incentive distributed</li>
                        </ul>
                     </div>
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 block mb-2">Next Milestone</span>
                        <ul className="space-y-2 text-slate-800 font-bold">
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 shrink-0"></div> Awaiting user engagement telemetry</li>
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-teal-400 rounded-full mt-2 shrink-0"></div> Forecast model stabilization</li>
                        </ul>
                     </div>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-medium">
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Identified Root Causes</span>
                        <ul className="space-y-2 text-slate-700">
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 shrink-0"></div> Core NPS dropped by 18%</li>
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-2 shrink-0"></div> API payment failures increased</li>
                        </ul>
                     </div>
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">AI Prescribed Strategy</span>
                        <ul className="space-y-2 text-slate-800 font-bold">
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div> Deploy dynamic retention discount</li>
                           <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div> Route VIPs to Priority Support</li>
                        </ul>
                     </div>
                  </div>
               )}
            </div>
            
            <div className="flex flex-col sm:flex-row xl:flex-col gap-4 w-full xl:w-auto xl:min-w-[200px]">
               {metricsUpdated ? (
                  <button disabled className="w-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm opacity-80 cursor-not-allowed">
                     <CheckCircle2 size={18}/> Strategy Active
                  </button>
               ) : (
                  <>
                     <button onClick={handleExecuteProtocol} className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                        <Play size={16} fill="currentColor"/> Execute Plan
                     </button>
                     <button onClick={() => setIsInterrogating(true)} className="w-full bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                        <Sparkles size={16} className="text-amber-500 shrink-0"/> Interrogate AI
                     </button>
                  </>
               )}
            </div>
         </div>
      </div>

      {/* 9. TIMELINE INTELLIGENCE */}
      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl overflow-x-auto hide-scrollbar relative shadow-inner">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap sticky left-0 bg-slate-50 px-2 flex items-center gap-2 z-10">
            <Calendar size={12}/> Event Chain
         </span>
         
         <div className="flex items-center gap-4 min-w-max text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> <span className="text-slate-400 font-bold mx-1">Feb 10:</span> App update v4.2 released</div> <ArrowRight size={14} className="text-slate-300"/>
            <div className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-amber-400"></div> <span className="text-slate-400 font-bold mx-1">Feb 15:</span> Complaints increased +12%</div> <ArrowRight size={14} className="text-slate-300"/>
            <div className="flex items-center gap-2 text-rose-600 font-bold"><div className="w-2 h-2 rounded-full bg-rose-500"></div> <span className="text-rose-400 font-bold mx-1">Feb 20:</span> Churn spike detected</div>
            {metricsUpdated && (
               <>
                 <ArrowRight size={14} className="text-slate-300"/>
                 <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full"><Sparkles size={12}/> AI Intervention Executed</div>
               </>
            )}
         </div>
      </div>

      {/* 1. SMART KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
        {[
          { label: 'Critical Risk Accounts', value: currentRiskAccounts, delta: metricsUpdated ? '↓ 14 (Saved)' : '↑ 12%', icon: AlertTriangle, color: 'rose', insight: '+12% increase due to drop in engagement', action: 'Trigger win-back email sequence.' },
          { label: 'Active Cohorts', value: summary?.total_customers?.toLocaleString() || '15,402', delta: '↓ 0.4%', icon: Users, color: 'indigo', insight: 'Growth plateauing in Tier 2 sectors.', action: 'Review latest acquisition funnels.' },
          { label: 'Customer LTV Trajectory', value: `₹${telemetry?.financial?.lifetime_value_avg?.toLocaleString() || '34.2K'}`, delta: metricsUpdated ? '↑ 2.8%' : '↑ 2.1%', icon: IndianRupee, color: 'blue', insight: 'Upsells successfully masking churn losses.', action: 'Expand recent upsell campaigns.' },
          { label: 'Overall NPS Index', value: `${telemetry?.sentiment?.nps_score || '34'}/100`, delta: '↓ 4pts', icon: Lightbulb, color: 'amber', insight: 'Recent app crashes degrading UX.', action: 'Deploy hotfix v4.2.1 immediately.' },
        ].map((card, i) => (
          <div key={i} className={`bg-white border p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative ${metricsUpdated && i === 0 ? 'border-emerald-300 ring-4 ring-emerald-500/10' : 'border-slate-200'}`}>
             <div className="flex justify-between items-start mb-6">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{card.label}</h4>
                    <span className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors flex items-center gap-3">
                       {card.value}
                       {metricsUpdated && i === 0 && <span className="text-xs bg-emerald-100 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-full flex items-center font-bold tracking-widest uppercase">Safe</span>}
                    </span>
                 </div>
                 <span className={`text-${card.color}-500 bg-${card.color}-50 border border-${card.color}-100 p-2.5 rounded-xl font-bold flex items-center justify-center`}>
                    <card.icon size={20} />
                 </span>
             </div>
             
             {/* Hidden Smart Expansion */}
             <div className="h-0 opacity-0 overflow-hidden group-hover:h-32 group-hover:opacity-100 group-hover:mt-4 transition-all duration-500 border-t border-slate-100 flex flex-col justify-end pt-4">
               <div className="flex items-start gap-2 text-xs font-medium text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Info size={14} className="text-slate-400 shrink-0 mt-0.5"/> {card.insight}
               </div>
               <div className="flex items-start gap-2 text-xs font-bold text-primary bg-primary/5 p-2.5 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
                  <Target size={14} className="shrink-0 mt-0.5"/> {card.action}
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* 3. FORECAST & ROOT CAUSES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
         {/* Predictive Forecast */}
         <div className="lg:col-span-8 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Target className="text-indigo-500"/> Predictive Churn Forecast</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Projecting retention trajectory over 3-month horizon.</p>
               </div>
               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                  <button onClick={() => setForecastScenario('baseline')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${forecastScenario === 'baseline' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>Baseline (No Action)</button>
                  <button onClick={() => setForecastScenario('optimized')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${forecastScenario === 'optimized' ? 'bg-primary text-white shadow shadow-primary/20' : 'text-slate-500'}`}>Optimized Scenario</button>
               </div>
            </div>
            
            <div className="h-[300px] w-full">
               <ResponsiveContainer>
                  <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `${val}%`} />
                     <Tooltip 
                       contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       itemStyle={{ fontWeight: 700 }}
                     />
                     <Line type="monotone" dataKey="actual" name="Historical Actuals" stroke="#0f172a" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                     {forecastScenario === 'baseline' ? (
                        <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={4} dot={{r: 4, fill: '#f43f5e'}} />
                     ) : (
                        <Line type="monotone" dataKey="optimized" name="Optimized" stroke="#10b981" strokeDasharray="5 5" strokeWidth={4} dot={{r: 4, fill: '#10b981'}} />
                     )}
                     <Area type="monotone" dataKey={forecastScenario} fill={forecastScenario === 'baseline' ? '#f43f5e' : '#10b981'} fillOpacity={0.05} stroke="none" />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Root Cause Analysis Panel */}
         <div className="lg:col-span-4 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2"><Activity className="text-rose-500"/> Root Cause Extraction</h3>
            <p className="text-sm font-medium text-slate-500 mb-8">Variables driving current vector deviations.</p>
            
            <div className="flex-1 space-y-6 flex flex-col justify-center">
               {rootCauses.map((rc, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><div className="w-5 h-5 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">{i+1}</div> {rc.driver}</span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded border ${rc.impact < 0 ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                           {rc.impact < 0 ? `${rc.impact}%` : `+${rc.impact}%`}
                        </span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${rc.color} rounded-full transition-all`} style={{width: `${Math.abs(rc.impact) * 2}%`}}></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 4. REVENUE & RISK DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
         {/* Revenue Breakdown */}
         <div className="lg:col-span-4 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500 opacity-[0.03] rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000 z-0"></div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-8 relative z-10"><TrendingDown className="text-emerald-500"/> Capital at Risk</h3>
            
            <div className="space-y-8 relative z-10">
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Risk Exposure</span>
                  <div className="text-5xl font-black text-rose-500 tracking-tighter">₹{(revAtRisk?.revenue_at_risk || 65405).toLocaleString()}</div>
               </div>
               
               <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex justify-between items-center shadow-inner">
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">Recoverable Pipeline</span>
                     <div className="text-2xl font-black text-emerald-600">₹{recoverableRev.toLocaleString()}</div>
                  </div>
                  <Sparkles size={32} className="text-emerald-300"/>
               </div>
            </div>
         </div>

         {/* Distribution Heatmap */}
         <div className="lg:col-span-4 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
            <div className="flex justify-between items-start mb-6">
               <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1"><Crosshair className="text-blue-500"/> Distribution Heatmap</h3>
                  <p className="text-xs text-slate-500 font-medium">Risk isolated by granular topology.</p>
               </div>
            </div>
            
            <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-6 bg-slate-50 p-1.5 rounded-xl border border-slate-100 overflow-x-auto">
               <button onClick={() => setActiveSegment('location')} className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-colors ${activeSegment === 'location' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><MapPin size={12}/> Geocode</button>
               <button onClick={() => setActiveSegment('plan')} className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-colors ${activeSegment === 'plan' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><CreditCard size={12}/> Tier</button>
               <button onClick={() => setActiveSegment('device')} className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-colors ${activeSegment === 'device' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><Smartphone size={12}/> Origin</button>
            </div>
            
            <div className="space-y-4">
               {riskSegments[activeSegment].map((seg, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors cursor-pointer group">
                     <div className="flex-1">
                        <h4 className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">{seg.name}</h4>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                           <div className="h-full bg-slate-800 rounded-full" style={{width: `${seg.risk}%`}}></div>
                        </div>
                     </div>
                     <div className="w-12 text-right font-black text-rose-500">{seg.risk}%</div>
                  </div>
               ))}
            </div>
         </div>

         {/* 5. DECISION PANEL (MUST ADD) */}
         <div className="lg:col-span-4 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
            
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 relative z-10"><Zap className="text-amber-500"/> Operational Command</h3>
            
            <div className="space-y-6 relative z-10">
               <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-inner">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Recommended Sequence</span>
                  <ul className="space-y-3">
                     <li className="flex gap-3 text-sm font-bold text-slate-700"><div className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center text-xs mt-0.5 shrink-0 shadow-sm">1</div> Isolate {summary?.high_risk_customers || 59} critical entities.</li>
                     <li className="flex gap-3 text-sm font-bold text-slate-700"><div className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center text-xs mt-0.5 shrink-0 shadow-sm">2</div> Deploy 20% rescue incentive.</li>
                     <li className="flex gap-3 text-sm font-bold text-slate-700"><div className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center text-xs mt-0.5 shrink-0 shadow-sm">3</div> Bind VIPs to Tier-1 Support.</li>
                  </ul>
               </div>
               
               <div className="flex bg-amber-50 border border-amber-100 p-5 rounded-2xl items-center gap-4 shadow-sm">
                  <Target size={32} className="text-amber-500 shrink-0"/>
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">Expected Financial Impact</span>
                     <div className="text-sm font-medium text-slate-600">Sustain <strong className="text-slate-900">14 cohorts</strong> & protect <strong className="text-slate-900">₹3,693</strong> in baseline capital constraint.</div>
                  </div>
               </div>
               
               <button disabled={metricsUpdated} onClick={handleExecuteProtocol} className={`w-full font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 ${metricsUpdated ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'}`}>
                  {metricsUpdated ? <><CheckCircle2 size={18}/> Strategy Locked & Active</> : <>Execute Strategy Protocol <ArrowRight size={18}/></>}
               </button>
            </div>
         </div>
      </div>

      {/* OVERLAY: EXECUTE STRATEGY MODAL */}
      {isExecutingProtocol && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300 p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsExecutingProtocol(false)}></div>
            <div className="relative z-10 bg-white border border-slate-200 w-full max-w-md p-6 sm:p-8 rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
               
               {protocolStep < 4 ? (
                 <>
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin opacity-50"></div>
                      <Zap size={32} className="text-primary"/>
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 mb-2">Executing Intelligence Plan</h2>
                   <p className="text-slate-500 font-medium mb-8">Deploying prescriptive analytics to the live grid.</p>
                   
                   <div className="w-full space-y-4 text-left bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                      <div className="flex items-center gap-3">
                         {protocolStep >= 2 ? <CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> : protocolStep === 1 ? <Loader2 className="text-primary animate-spin shrink-0" size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>}
                         <span className={`text-sm font-bold truncate ${protocolStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Segmenting 59 high-risk users...</span>
                      </div>
                      <div className="flex items-center gap-3">
                         {protocolStep >= 3 ? <CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> : protocolStep === 2 ? <Loader2 className="text-primary animate-spin shrink-0" size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>}
                         <span className={`text-sm font-bold truncate ${protocolStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Deploying discount campaigns...</span>
                      </div>
                      <div className="flex items-center gap-3">
                         {protocolStep >= 4 ? <CheckCircle2 className="text-emerald-500 shrink-0" size={20}/> : protocolStep === 3 ? <Loader2 className="text-primary animate-spin shrink-0" size={20}/> : <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0"></div>}
                         <span className={`text-sm font-bold truncate ${protocolStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>Assigning priority support tickets...</span>
                      </div>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="w-24 h-24 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                        <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2.5}/>
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 mb-2">Strategy Executed Successfully</h2>
                   <p className="text-emerald-600 font-bold mb-8 text-sm">Retention structurally improved by 8%.</p>
                   
                   <div className="w-full flex gap-4 text-left">
                       <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-1">Users Saved</span>
                          <span className="text-xl font-black text-slate-900">14 Active</span>
                       </div>
                       <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                          <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-1">Protected</span>
                          <span className="text-xl font-black text-emerald-600 flex items-center justify-center">₹3,693</span>
                       </div>
                   </div>
                   
                   <button onClick={() => { setIsExecutingProtocol(false); setProtocolStep(0); }} className="mt-8 w-full bg-slate-900 text-white hover:bg-slate-800 font-bold px-8 py-3.5 rounded-xl transition-all shadow-xl active:scale-95 cursor-pointer relative z-20">
                      Acknowledge & Sync Dashboard
                   </button>
                 </>
               )}
            </div>
         </div>
      )}

      {/* OVERLAY: INTERROGATE AI SLIDE-OVER */}
      {isInterrogating && (
         <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-[100] animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full bg-slate-50/50">
               {/* AI Header */}
               <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white shadow-sm z-10">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Bot className="text-primary"/> AI Copilot</h3>
                  <button onClick={() => setIsInterrogating(false)} className="text-slate-400 hover:text-rose-500 transition-colors bg-slate-100 p-1.5 rounded-md active:scale-95"><X size={16}/></button>
               </div>
               
               {/* Chat History */}
               <div className="flex-1 overflow-y-auto p-4 space-y-4 md:p-6 md:space-y-6">
                  {chatMessages.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-3'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        {msg.role === 'ai' && (
                           <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm mt-1">
                              <Bot size={16} className="text-primary"/>
                           </div>
                        )}
                        <div className={`${msg.role === 'user' ? 'bg-slate-900 text-white rounded-2xl rounded-tr-sm px-5 py-3' : 'bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-5'} text-sm font-medium shadow-sm max-w-[90%]`}>
                           {msg.content}
                        </div>
                     </div>
                  ))}
                  
                  {isTyping && (
                     <div className="flex gap-3 animate-in fade-in duration-300">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm mt-1">
                           <Bot size={16} className="text-primary"/>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 text-sm font-medium shadow-sm flex items-center gap-1.5 w-max h-12">
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite]"></div>
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                           <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
                        </div>
                     </div>
                  )}
                  <div ref={chatEndRef}></div>
               </div>
               
               {/* Input Box */}
               <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] z-10">
                  <div className="flex gap-2 relative overflow-x-auto hide-scrollbar pb-1 z-10 w-full snap-x">
                     <button onClick={() => handleChatSubmit(null, 'Why is churn increasing in the Premium cohort?')} className="snap-start shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap active:scale-95 cursor-pointer shadow-sm">Why is churn increasing?</button>
                     <button onClick={() => handleChatSubmit(null, 'What is the projected revenue impact?')} className="snap-start shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap active:scale-95 cursor-pointer shadow-sm">Forecast Revenue Risk</button>
                     <button onClick={() => handleChatSubmit(null, 'Analyze latest NPS sentiment data.')} className="snap-start shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap active:scale-95 cursor-pointer shadow-sm">Extract NPS Sentiments</button>
                  </div>
                  <form onSubmit={handleChatSubmit} className="relative z-10">
                     <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                     <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Command the intelligence engine..." className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans shadow-inner" />
                  </form>
                  <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-0 flex items-center justify-center gap-1.5"><Sparkles size={10} className="text-amber-500"/> Powered By Gemini AI</p>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Dashboard;
