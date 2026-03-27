import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, LineChart, Line, Legend, ComposedChart 
} from 'recharts';
import { 
  Users, AlertTriangle, TrendingDown, IndianRupee, Activity, 
  MapPin, Smartphone, CreditCard, Clock, Lightbulb, BrainCircuit, 
  ArrowRight, ShieldAlert, Sparkles, Crosshair, Play, Info, Target, Calendar, Zap
} from 'lucide-react';
import api from '../lib/api';

const Dashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [revAtRisk, setRevAtRisk] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  
  // Custom states for interactive elements
  const [forecastScenario, setForecastScenario] = useState<'baseline' | 'optimized'>('baseline');
  const [activeSegment, setActiveSegment] = useState<'location' | 'plan' | 'device'>('plan');

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

  // Mock Forecast Data representing Baseline vs Optimized scenarios
  const forecastData = [
    { month: 'Jan', baseline: 12, optimized: 12, actual: 12 },
    { month: 'Feb', baseline: 14, optimized: 14, actual: 14 },
    { month: 'Mar', baseline: 18, optimized: 18, actual: 18 },
    { month: 'Apr', baseline: 21, optimized: 15, actual: null },
    { month: 'May', baseline: 24, optimized: 13, actual: null },
    { month: 'Jun', baseline: 25, optimized: 12, actual: null },
  ];

  // Mock Root Cause analysis
  const rootCauses = [
    { driver: "Low App Activity", impact: -30, color: "bg-rose-500" },
    { driver: "High Support Complaints", impact: +22, color: "bg-orange-500" },
    { driver: "Payment Gateway Failures", impact: -18, color: "bg-amber-500" },
    { driver: "Competitor Promo Pricing", impact: +15, color: "bg-indigo-500" },
  ];

  // Modular segments
  const riskSegments = {
    location: [{ name: 'Tier 2 Cities', risk: 85 }, { name: 'Tier 1 Metro', risk: 45 }, { name: 'International', risk: 20 }],
    plan: [{ name: 'Monthly Basic', risk: 92 }, { name: 'Annual Pro', risk: 34 }, { name: 'Enterprise', risk: 12 }],
    device: [{ name: 'Android OS', risk: 78 }, { name: 'iOS App', risk: 41 }, { name: 'Web Portal', risk: 22 }]
  };

  const recoverableRev = revAtRisk ? Math.floor(revAtRisk.revenue_at_risk * 0.64) : 42000;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
      
      {/* HEADER & BENCHMARKING */}
      <header className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
             <BrainCircuit className="text-primary" size={36} /> 
             AI Command Center
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Predictive synthesis and prescriptive execution engine.</p>
        </div>
        
        <div className="flex bg-slate-50/50 border border-slate-200 rounded-2xl p-4 gap-8">
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Churn Rate</span>
              <div className="text-xl font-black text-slate-800">{summary?.estimated_churn_rate || '18.4'}%</div>
           </div>
           <div className="w-[1px] bg-slate-200"></div>
           <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industry Avg</span>
              <div className="text-xl font-black text-slate-800 flex items-center gap-2">12.0% <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full mt-0.5">⚠ High Risk</span></div>
           </div>
        </div>
      </header>

      {/* 2. DYNAMIC AI INSIGHT BANNER */}
      <div className="bg-gradient-to-r from-rose-50 to-indigo-50 border border-slate-200 rounded-[32px] shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500 opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 z-0"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 opacity-5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 z-0"></div>
         
         <div className="relative z-10 p-8 flex justify-between items-start gap-12">
            <div className="flex-1 space-y-5">
               <div className="flex items-center gap-3 text-rose-600 font-bold bg-rose-100/50 border border-rose-200 w-max px-4 py-1.5 rounded-full shadow-sm">
                  <ShieldAlert size={18} className="text-rose-500"/> Churn Spike Detected in Premium Cohorts
               </div>
               
               <div className="grid grid-cols-2 gap-8 font-medium">
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Identified Root Causes</span>
                     <ul className="space-y-2 text-slate-700">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> Core NPS dropped by 18%</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div> API payment failures increased</li>
                     </ul>
                  </div>
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-2">AI Prescribed Strategy</span>
                     <ul className="space-y-2 text-slate-800 font-bold">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Deploy dynamic retention discount</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div> Route VIPs to Priority Support</li>
                     </ul>
                  </div>
               </div>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[200px]">
               <button className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                  <Play size={16} fill="currentColor"/> Execute Plan
               </button>
               <button className="w-full bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                  <Sparkles size={16} className="text-amber-500"/> Interrogate AI
               </button>
            </div>
         </div>
      </div>

      {/* 9. TIMELINE INTELLIGENCE (Compact Horizontal) */}
      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl overflow-x-auto hide-scrollbar relative shadow-inner">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap sticky left-0 bg-slate-50 px-2 flex items-center gap-2 z-10">
            <Calendar size={12}/> Event Chain
         </span>
         
         <div className="flex items-center gap-4 min-w-max text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-indigo-400"></div> <span className="text-slate-400 font-bold mx-1">Feb 10:</span> App update v4.2 released</div> <ArrowRight size={14} className="text-slate-300"/>
            <div className="flex items-center gap-2 text-slate-600"><div className="w-2 h-2 rounded-full bg-amber-400"></div> <span className="text-slate-400 font-bold mx-1">Feb 15:</span> Complaints increased +12%</div> <ArrowRight size={14} className="text-slate-300"/>
            <div className="flex items-center gap-2 text-rose-600 font-bold"><div className="w-2 h-2 rounded-full bg-rose-500"></div> <span className="text-rose-400 font-bold mx-1">Feb 20:</span> Churn spike detected</div>
         </div>
      </div>

      {/* 1. SMART KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
        {[
          { label: 'Critical Risk Accounts', value: summary?.high_risk_customers?.toLocaleString() || '59', delta: '↑ 12%', icon: AlertTriangle, color: 'rose', insight: '+12% increase due to drop in engagement', action: 'Trigger win-back email sequence.' },
          { label: 'Active Cohorts', value: summary?.total_customers?.toLocaleString() || '15,402', delta: '↓ 0.4%', icon: Users, color: 'indigo', insight: 'Growth plateauing in Tier 2 sectors.', action: 'Review latest acquisition funnels.' },
          { label: 'Customer LTV Trajectory', value: `₹${telemetry?.financial?.lifetime_value_avg?.toLocaleString() || '34.2K'}`, delta: '↑ 2.1%', icon: IndianRupee, color: 'blue', insight: 'Upsells successfully masking churn losses.', action: 'Expand recent upsell campaigns.' },
          { label: 'Overall NPS Index', value: `${telemetry?.sentiment?.nps_score || '34'}/100`, delta: '↓ 4pts', icon: Lightbulb, color: 'amber', insight: 'Recent app crashes degrading UX.', action: 'Deploy hotfix v4.2.1 immediately.' },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
             <div className="flex justify-between items-start mb-6">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{card.label}</h4>
                    <span className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">{card.value}</span>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
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
                        <Line type="monotone" dataKey="baseline" name="Baseline (Projected)" stroke="#f43f5e" strokeDasharray="5 5" strokeWidth={4} dot={{r: 4, fill: '#f43f5e'}} />
                     ) : (
                        <Line type="monotone" dataKey="optimized" name="Optimized (Projected)" stroke="#10b981" strokeDasharray="5 5" strokeWidth={4} dot={{r: 4, fill: '#10b981'}} />
                     )}
                     <Area type="monotone" dataKey={forecastScenario} fill={forecastScenario === 'baseline' ? '#f43f5e' : '#10b981'} fillOpacity={0.05} stroke="none" />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <BrainCircuit size={20} className="text-slate-400"/>
               <p className="text-sm font-bold text-slate-700">
                  {forecastScenario === 'baseline' ? 'If no action is taken → churn spikes to an unprecedented 25% by June.' : 'If retention strategy is executed → churn compresses safely to 12% by June.'}
               </p>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
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
            
            <div className="flex gap-2 mb-6 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
               <button onClick={() => setActiveSegment('location')} className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-colors ${activeSegment === 'location' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><MapPin size={12}/> Geocode</button>
               <button onClick={() => setActiveSegment('plan')} className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-colors ${activeSegment === 'plan' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><CreditCard size={12}/> Tier</button>
               <button onClick={() => setActiveSegment('device')} className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 rounded-lg transition-colors ${activeSegment === 'device' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><Smartphone size={12}/> Origin</button>
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
               
               <button className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-4 rounded-xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 active:scale-95">
                  Execute Strategy Protocol <ArrowRight size={18}/>
               </button>
            </div>
         </div>

      </div>

    </div>
  );
};

export default Dashboard;
