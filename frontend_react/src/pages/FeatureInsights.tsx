import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { 
  BrainCircuit, Download, Activity, Zap, TrendingUp, TrendingDown, 
  Users, Sliders, Bot, AlertTriangle, CheckCircle, Search, Share2, 
  ShieldCheck, ArrowRight, Target, DollarSign, Clock
} from 'lucide-react';

// --- DATA MOCKS ---
const globalFeatures = [
   { name: 'Last Active Date', importance: 0.88, direction: 'up', category: 'Behavior' },
   { name: 'Login Frequency', importance: 0.76, direction: 'down', category: 'Engagement' },
   { name: 'Payment Failures', importance: 0.65, direction: 'up', category: 'Transaction' },
   { name: 'Session Duration', importance: 0.54, direction: 'down', category: 'Engagement' },
   { name: 'Support Tickets', importance: 0.48, direction: 'up', category: 'Behavior' },
   { name: 'Discount Usage', importance: 0.35, direction: 'down', category: 'Transaction' },
];

const trendData = [
  { month: 'Jan', appActivity: 40, paymentIssues: 24, supportTickets: 10 },
  { month: 'Feb', appActivity: 30, paymentIssues: 35, supportTickets: 15 },
  { month: 'Mar', appActivity: 20, paymentIssues: 50, supportTickets: 30 },
  { month: 'Apr', appActivity: 10, paymentIssues: 75, supportTickets: 45 },
];

const FeatureInsights = () => {
  // Export & Share State
  const [isExporting, setIsExporting] = useState(false);
  const [shareText, setShareText] = useState('Share');

  const handleShare = () => {
     navigator.clipboard.writeText(window.location.href);
     setShareText('Copied Link!');
     setTimeout(() => setShareText('Share'), 2000);
  };

  const handleExport = () => {
     setIsExporting(true);
     setTimeout(() => {
        const csvRows = [
           "Feature,Importance,Impact,Category",
           ...globalFeatures.map(f => `${f.name},${f.importance},${f.direction === 'up' ? 'Increases Churn' : 'Reduces Churn'},${f.category}`)
        ];
        
        const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        link.href = url;
        // Explicitly set the download attribute
        link.setAttribute("download", "churnsense_feature_insights.csv");
        document.body.appendChild(link);
        
        link.click();
        
        document.body.removeChild(link);
        // Delay revocation to ensure the browser reads the filename metadata before the blob is destroyed
        setTimeout(() => URL.revokeObjectURL(url), 100);
        setIsExporting(false);
     }, 800);
  };

  // What-If Simulation State
  const [sliderInactivity, setSliderInactivity] = useState(30); // days
  const [sliderLogin, setSliderLogin] = useState(15); // per month
  const [sliderTickets, setSliderTickets] = useState(2); // open tickets
  
  // Calculate simulated churn based on sliders (Fake math for demo)
  const baseChurn = 45;
  const churnImpact = baseChurn 
     + ((sliderInactivity - 15) * 0.8) 
     - ((sliderLogin - 10) * 1.5) 
     + ((sliderTickets - 1) * 3);
  const simulatedChurn = Math.max(5, Math.min(95, churnImpact)).toFixed(1);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-32">
      
      {/* 🧩 SECTION 1 & 9 & 10: Header, ML Trust, Export */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                 <BrainCircuit className="text-primary"/> AI Explainability Engine
              </h2>
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1.5">
                 <ShieldCheck size={14}/> 94.2% ML Confidence
              </span>
           </div>
           <p className="text-slate-500 font-medium max-w-2xl">Transparent neural mapping. Understand exactly why customers churn, simulate strategic adjustments, and deploy data-driven retention protocols.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={handleShare} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm w-[110px] justify-center">
              {shareText === 'Share' ? <Share2 size={16}/> : <CheckCircle size={16} className="text-emerald-500"/>} {shareText}
           </button>
           <button onClick={handleExport} disabled={isExporting} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-slate-900/10 w-[160px] justify-center disabled:opacity-80">
              {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={16}/>} 
              {isExporting ? 'Exporting...' : 'Export Insights'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
         
         {/* 🧩 SECTION 1: Feature Importance Chart */}
         <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Activity size={20} className="text-primary"/> Global Feature Importance
               </h3>
               <p className="text-sm font-medium text-slate-500 mb-8 max-w-lg">Ranked variables driving neural network predictions. Colors indicate impact direction on total churn probability.</p>
               
               <div className="h-[360px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={globalFeatures} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis dataKey="name" type="category" stroke="#475569" width={140} tick={{ fontSize: 13, fontWeight: 700 }} tickLine={false} axisLine={false}/>
                        <RechartsTooltip 
                           cursor={{fill: '#f8fafc'}}
                           contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', borderColor: '#e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                           itemStyle={{ fontWeight: 'bold' }}
                           formatter={(value, name, props) => {
                              const dir = props.payload.direction;
                              return [value, `${dir === 'up' ? '🔴 Increases Churn' : '🟢 Reduces Churn'}`];
                           }}
                        />
                        <Bar dataKey="importance" radius={[0, 8, 8, 0]} barSize={28}>
                           {globalFeatures.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.direction === 'up' ? '#fb7185' : '#34d399'} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
               </div>

               {/* Legend Component */}
               <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-400"></div><span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Increases Risk (↑)</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-400"></div><span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Reduces Risk (↓)</span></div>
               </div>
            </div>

            {/* 🧩 SECTION 8: Feature Categories Grouping */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-4"><Clock size={20}/></div>
                  <h4 className="font-black text-slate-900 mb-1">Behavior</h4>
                  <p className="text-xs font-medium text-slate-500 mb-4">Inactivity, platform usage</p>
                  <div className="text-2xl font-black text-indigo-600 flex items-end gap-1">42<span className="text-sm pb-1">% Impact</span></div>
               </div>
               <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4"><DollarSign size={20}/></div>
                  <h4 className="font-black text-slate-900 mb-1">Transaction</h4>
                  <p className="text-xs font-medium text-slate-500 mb-4">Spend, payment health</p>
                  <div className="text-2xl font-black text-emerald-600 flex items-end gap-1">35<span className="text-sm pb-1">% Impact</span></div>
               </div>
               <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4"><Target size={20}/></div>
                  <h4 className="font-black text-slate-900 mb-1">Engagement</h4>
                  <p className="text-xs font-medium text-slate-500 mb-4">Session times, clicks</p>
                  <div className="text-2xl font-black text-blue-600 flex items-end gap-1">23<span className="text-sm pb-1">% Impact</span></div>
               </div>
            </div>

         </div>

         {/* RIGHT COLUMN */}
         <div className="col-span-12 lg:col-span-5 space-y-6">
            
            {/* 🧩 SECTION 2: AI Explanation Panel */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-slate-50">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none"></div>
               
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-6 relative z-10">
                  <Bot className="text-primary"/> AI Key Insights
               </h3>
               
               <div className="space-y-4 relative z-10">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:border-rose-200 transition-colors">
                     <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={18}/>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed">Customers <strong className="text-slate-900">inactive for 30+ days</strong> are 3.4x more likely to churn than the baseline cohort.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:border-amber-200 transition-colors">
                     <TrendingUp className="text-amber-500 shrink-0 mt-0.5" size={18}/>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed">Frequent <strong className="text-slate-900">payment failures</strong> increase immediate churn risk by 40% within the following week.</p>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-4 shadow-sm hover:border-emerald-200 transition-colors">
                     <TrendingDown className="text-emerald-500 shrink-0 mt-0.5" size={18}/>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed">High engagement (<strong className="text-slate-900">&gt;15 logins/month</strong>) reduces defection probability by 62%.</p>
                  </div>
               </div>
            </div>

            {/* 🧩 SECTION 7: What-If Analysis */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-primary/20 shadow-sm relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h3 className="text-lg font-black text-slate-900 flex items-center gap-2"><Sliders size={20} className="text-primary"/> What-If Simulator</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Test Business Scenarios</p>
                  </div>
                  <div className="bg-white border border-slate-200 py-2 px-4 rounded-xl shadow-sm text-center">
                     <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Simulated Churn</span>
                     <span className={`text-2xl font-black leading-none ${parseFloat(simulatedChurn) > 50 ? 'text-rose-600' : 'text-emerald-600'}`}>{simulatedChurn}%</span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Customer Inactivity Average</span> <span>{sliderInactivity} days</span></div>
                     <input type="range" min="1" max="60" value={sliderInactivity} onChange={(e) => setSliderInactivity(parseInt(e.target.value))} className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Monthly Logins</span> <span>{sliderLogin} / mo</span></div>
                     <input type="range" min="1" max="30" value={sliderLogin} onChange={(e) => setSliderLogin(parseInt(e.target.value))} className="w-full accent-emerald-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
                  <div>
                     <div className="flex justify-between text-sm font-bold text-slate-700 mb-2"><span>Unresolved Support Tickets</span> <span>{sliderTickets}</span></div>
                     <input type="range" min="0" max="10" value={sliderTickets} onChange={(e) => setSliderTickets(parseInt(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                  </div>
               </div>
            </div>

            {/* 🧩 SECTION 6: Business Recommendations */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Zap size={20} className="text-amber-500 fill-amber-500"/> Prescriptive Actions
               </h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors group cursor-default">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">1</div>
                        <p className="text-sm font-bold text-slate-700">Audit Payment Gateway API</p>
                     </div>
                     <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors"/>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors group cursor-default">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">2</div>
                        <p className="text-sm font-bold text-slate-700">Deploy Re-engagement Campaign</p>
                     </div>
                     <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors"/>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-slate-300 transition-colors group cursor-default">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">3</div>
                        <p className="text-sm font-bold text-slate-700">Accelerate Ticket Response Time</p>
                     </div>
                     <ArrowRight size={16} className="text-slate-300 group-hover:text-primary transition-colors"/>
                  </div>
               </div>
            </div>

         </div>
         
         {/* 🧩 BOTTOM ROW: Segments & Timeline */}
         <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
            
            {/* 🧩 SECTION 3: Segment Insights */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Users size={20} className="text-blue-500"/> Segment Driver Deviations
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                     <h4 className="text-xs font-black uppercase text-amber-700 tracking-widest mb-4">Premium Users</h4>
                     <ul className="space-y-3">
                        <li className="text-sm font-bold text-slate-700 flex justify-between">1. Feature Dropoff <span className="text-rose-500">↑ High</span></li>
                        <li className="text-sm font-bold text-slate-700 flex justify-between">2. Rating Given <span className="text-rose-500">↑ High</span></li>
                        <li className="text-sm font-bold text-slate-700 flex justify-between">3. Support Friction <span className="text-amber-500">↑ Med</span></li>
                     </ul>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                     <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-4">Standard Users</h4>
                     <ul className="space-y-3">
                        <li className="text-sm font-bold text-slate-700 flex justify-between">1. Login Frequency <span className="text-rose-500">↑ High</span></li>
                        <li className="text-sm font-bold text-slate-700 flex justify-between">2. Payment Fails <span className="text-rose-500">↑ High</span></li>
                        <li className="text-sm font-bold text-slate-700 flex justify-between">3. Cart Abandon <span className="text-amber-500">↑ Med</span></li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* 🧩 SECTION 5: Trend Impact Analysis */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                     <TrendingUp size={20} className="text-indigo-500"/> Feature Severity Trends
                  </h3>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">YTD Growth</span>
               </div>
               <div className="h-[200px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false}/>
                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}/>
                        <Area type="monotone" dataKey="paymentIssues" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorIssues)" name="Payment Fails" />
                        <Area type="monotone" dataKey="supportTickets" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorTickets)" name="Support Overhead" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
               <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-400"></div><span className="text-xs font-bold text-slate-600">Payment Escapes</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-400"></div><span className="text-xs font-bold text-slate-600">Support Load</span></div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default FeatureInsights;
