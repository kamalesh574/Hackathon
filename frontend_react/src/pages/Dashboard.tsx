import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Line } from 'recharts';
import { Users, AlertTriangle, TrendingDown, IndianRupee, BrainCircuit, Activity, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../lib/api';

const Dashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [revAtRisk, setRevAtRisk] = useState<any>(null);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, rRes, dRes, drRes, fRes, aiRes, tRes] = await Promise.all([
          api.get('/analytics/executive-summary'),
          api.get('/analytics/revenue-at-risk'),
          api.get('/analytics/risk-distribution'),
          api.get('/analytics/churn-drivers'),
          api.get('/analytics/trend-forecast'),
          api.get('/analytics/ai-insight'),
          api.get('/analytics/deep-telemetry')
        ]);
        setSummary(sRes.data);
        setRevAtRisk(rRes.data);
        setDistribution(dRes.data);
        setDrivers(drRes.data);
        setForecast(fRes.data);
        setAiInsight(aiRes.data);
        setTelemetry(tRes.data);
      } catch (e) {
        console.error("API Error", e);
      }
    };
    fetchData();
  }, []);

  const COLORS = { 'High risk': '#ef4444', 'Medium risk': '#f59e0b', 'Low risk': '#10b981' };

  const renderDelta = (deltaStr: string) => {
    const isPositive = deltaStr?.startsWith('+');
    return (
      <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ChevronUp size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />} {deltaStr}
      </span>
    );
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-16">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive Intelligence</h2>
          <p className="text-slate-500 mt-2 font-medium">Advanced telemetry & predictive business health modeling</p>
        </div>
        <div className="flex bg-white shadow-sm border border-slate-200 rounded-xl p-1.5">
           <button className="px-5 py-2 text-sm font-bold bg-slate-100 rounded-lg text-slate-900 transition-colors">30D</button>
           <button className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">90D</button>
           <button className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">YTD</button>
        </div>
      </header>

      {/* AI Copilot Banner */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 rounded-2xl flex gap-5 items-start relative overflow-hidden group shadow-sm transition-all hover:border-primary/40">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary animate-pulse" />
          <div className="bg-primary/20 p-3.5 rounded-xl shadow-inner border border-primary/10">
             <BrainCircuit className="text-primary" size={26} strokeWidth={2.5} />
          </div>
          <div className="pt-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-1.5 opacity-90">Copilot Discovery</h3>
            <p className="text-slate-800 font-semibold leading-relaxed max-w-4xl text-lg">{aiInsight.insight}</p>
          </div>
        </div>
      )}

      {/* KPI Micro-Interactions */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {[
          { label: 'Total Active Cohorts', value: summary?.total_customers?.toLocaleString() || '0', delta: summary?.total_customers_delta, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Critical Risk Accounts', value: summary?.high_risk_customers?.toLocaleString() || '0', delta: summary?.high_risk_delta, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Projected Churn Velocity', value: `${summary?.estimated_churn_rate || '0'}%`, delta: summary?.churn_rate_delta, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
          { label: 'Capital At Risk (ARR)', value: `₹${(revAtRisk?.revenue_at_risk || 0).toLocaleString()}`, delta: summary?.revenue_at_risk_delta, icon: IndianRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
        ].map((card, i) => (
          <div key={i} className="bg-white border border-slate-200 p-7 rounded-[24px] shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group cursor-default relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 rounded-full group-hover:scale-[2] transition-transform duration-700 opacity-50" />
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-3">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{card.label}</p>
                <div className="flex items-end gap-3">
                   <h3 className="text-4xl font-black text-slate-900 tracking-tight">{card.value}</h3>
                   <div className="mb-1.5">{renderDelta(card.delta)}</div>
                </div>
              </div>
              <div className={`${card.bg} border p-3.5 rounded-2xl shadow-sm`}>
                 <card.icon className={card.color} size={26} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Forecasting */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xl font-bold text-slate-900">Retention vs Drop-off Forecasting Trajectory</h3>
             <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold tracking-wide">6-MONTH MOVING CUMULATIVE</span>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35}/>
                     <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dx={-5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  labelStyle={{ fontWeight: '900', color: '#0f172a', marginBottom: '8px', fontSize: '14px' }}
                  itemStyle={{ fontWeight: '600', padding: '2px 0' }}
                />
                <Area type="monotone" dataKey="historical_retention" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRetention)" name="Retention Scope %" activeDot={{r: 6, strokeWidth: 0, fill: '#10b981'}} />
                <Area type="monotone" dataKey="predicted_churn" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorChurn)" name="Predicted Churn Load %" activeDot={{r: 6, strokeWidth: 0, fill: '#ef4444'}} />
                <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, paddingBottom: '20px' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Drivers */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-10">Primary Churn Catalysts</h3>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={drivers} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="driver" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 600}} width={140} />
                <Tooltip 
                   cursor={{fill: '#f8fafc', radius: 8}} 
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                   itemStyle={{ fontWeight: 'bold', color: '#4f46e5' }}
                />
                <Bar dataKey="impact" radius={[0, 8, 8, 0]} barSize={28} name="Severity Impact">
                   {drivers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#cbd5e1'} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Donut */}
        <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Global Risk Topology</h3>
          <div className="h-[320px] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none ml-2">
               <span className="text-5xl font-black text-rose-500 tracking-tighter">{summary?.high_risk_customers || 0}</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">SLA Critical</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={110}
                  outerRadius={145}
                  paddingAngle={6}
                  dataKey="count"
                  nameKey="risk_level"
                  stroke="none"
                  cornerRadius={10}
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.risk_level as keyof typeof COLORS] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                   itemStyle={{ fontWeight: '800', padding: '4px' }}
                />
                <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontSize: '13px', fontWeight: 600, paddingTop: '20px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Impact Overlay */}
        <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-slate-900">Capital Erosion by Risk Cohort</h3>
          </div>
          <div className="h-[320px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={[
                  { segment: 'High Risk', revenue: revAtRisk?.segments?.high || 850000 },
                  { segment: 'Medium Risk', revenue: revAtRisk?.segments?.medium || 345000 },
                  { segment: 'Low Risk', revenue: revAtRisk?.segments?.low || 120000 }
               ]} margin={{ top: 20, right: 30, left: 10, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="segment" stroke="#64748b" axisLine={false} tickLine={false} dy={15} tick={{fontWeight: 600, fontSize: 13}} />
                 <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} tick={{fontWeight: 500}} dx={-10} />
                 <Tooltip 
                   cursor={{fill: '#f8fafc'}} 
                   contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                   itemStyle={{ fontWeight: '800', color: '#0f172a' }} 
                 />
                 <Bar dataKey="revenue" radius={[12, 12, 0, 0]} barSize={56} name="Liquidity at Risk">
                    {[ { segment: 'High Risk' }, { segment: 'Medium Risk' }, { segment: 'Low Risk' }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.segment === 'High Risk' ? '#ef4444' : entry.segment === 'Medium Risk' ? '#f59e0b' : '#10b981'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DEEP TELEMETRY SECTION */}
      {telemetry && telemetry.sentiment && (
        <div className="pt-10 animate-in slide-in-from-bottom duration-1000">
          <div className="mb-8">
             <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Hyper-Telemetry Framework</h2>
             <p className="text-slate-500 mt-2 font-medium">Advanced psychological profiling, sentiment topography, and micro-financial friction matrices</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* 1. Behavioral Engagement Radar */}
            <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex justify-between">Behavioral Engagement <span className="text-slate-400 text-xs mt-1 uppercase">Matrix</span></h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={telemetry.behavior.radar}>
                    <PolarGrid stroke="#e2e8f0" strokeWidth={1.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                    <Radar dataKey="A" name="Behavioral Score" stroke="#8b5cf6" strokeWidth={4} fill="#8b5cf6" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} itemStyle={{fontWeight: 800, color: '#8b5cf6'}}/>
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between items-center px-5 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <span className="text-slate-500 font-bold text-[10px] uppercase text-left tracking-widest">Avg System Load Idle Time</span>
                 <span className="text-slate-900 font-black text-xl">{telemetry.behavior.last_active_avg_days} <span className="text-slate-400 text-sm">Days</span></span>
              </div>
            </div>

            {/* 2. Customer Sentiment & Frictions */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <h3 className="text-xl font-bold text-white mb-8 relative z-10 flex justify-between">Sentiment Topography <span className="text-slate-400 text-xs mt-1 uppercase">Critical Frictions</span></h3>
              
              <div className="space-y-6 relative z-10">
                 <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-inner">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Net Promoter Score (NPS)</span>
                       <span className="text-emerald-400 font-black text-2xl">{telemetry.sentiment.nps_score}<span className="text-slate-500 text-sm">/10</span></span>
                    </div>
                    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{width: `${(telemetry.sentiment.nps_score/10)*100}%`}} />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-rose-900/40 backdrop-blur-sm border-l-4 border-l-rose-500 flex flex-col justify-center shadow-md shadow-rose-900/10 hover:shadow-rose-900/20 transition-all">
                       <span className="text-rose-400/90 font-bold text-[10px] uppercase tracking-wider block mb-1">Rage Clicks (Avg)</span>
                       <span className="text-white font-black text-3xl">{telemetry.sentiment.rage_clicks_avg}</span>
                    </div>
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-amber-900/40 backdrop-blur-sm border-l-4 border-l-amber-500 flex flex-col justify-center shadow-md shadow-amber-900/10 hover:shadow-amber-900/20 transition-all">
                       <span className="text-amber-400/90 font-bold text-[10px] uppercase tracking-wider block mb-1">Session Bounce</span>
                       <span className="text-white font-black text-3xl">{telemetry.sentiment.bounce_rate_avg}</span>
                    </div>
                 </div>
                 
                 <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 flex justify-between items-center shadow-inner">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Customer Satisfaction (CSAT)</span>
                    <span className="text-indigo-400 font-black text-2xl tracking-tight">{telemetry.sentiment.csat_score}</span>
                 </div>
              </div>
            </div>

            {/* 3. Transactional Capital */}
            <div className="bg-white border border-slate-200 p-8 rounded-[32px] shadow-sm hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex justify-between">Capital Liquidity <span className="text-slate-400 text-xs mt-1 uppercase">Metrics</span></h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col justify-center transition-colors hover:bg-emerald-100/50">
                    <span className="text-emerald-700 font-bold text-[9px] uppercase tracking-widest block mb-1">Lifetime Value (Avg)</span>
                    <span className="text-slate-900 font-black text-lg truncate" title={telemetry.transaction.kpis.lifetime_value}>{telemetry.transaction.kpis.lifetime_value}</span>
                 </div>
                 <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex flex-col justify-center transition-colors hover:bg-indigo-100/50">
                    <span className="text-indigo-700 font-bold text-[9px] uppercase tracking-widest block mb-1">Monthly MRR Base</span>
                    <span className="text-slate-900 font-black text-lg truncate" title={telemetry.transaction.kpis.monthly_mrr}>{telemetry.transaction.kpis.monthly_mrr}</span>
                 </div>
              </div>
              
              <div className="h-[150px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={telemetry.transaction.timeline} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} dy={5} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dx={-5} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar yAxisId="left" dataKey="mrr" barSize={16} fill="#10b981" name="MRR Yield" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="ltv_growth" stroke="#4f46e5" strokeWidth={3} name="LTV Velocity" activeDot={{r: 6}} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between border-t border-slate-100 pt-5">
                 <div className="text-center w-1/3 border-r border-slate-100">
                    <span className="block text-slate-400 font-bold text-[9px] uppercase mb-0.5">Discount Dep.</span>
                    <span className="text-slate-800 font-black text-sm">{telemetry.transaction.kpis.discount_usage}</span>
                 </div>
                 <div className="text-center w-1/3 border-r border-slate-100">
                    <span className="block text-slate-400 font-bold text-[9px] uppercase mb-0.5">Resolution</span>
                    <span className="text-slate-800 font-black text-sm truncate" title={telemetry.transaction.kpis.avg_resolution}>{telemetry.transaction.kpis.avg_resolution}</span>
                 </div>
                 <div className="text-center w-1/3">
                    <span className="block text-slate-400 font-bold text-[9px] uppercase mb-0.5">Tickets</span>
                    <span className="text-slate-800 font-black text-sm">{telemetry.transaction.kpis.support_tickets}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
