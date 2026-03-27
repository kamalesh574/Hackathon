import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, User, MapPin, CreditCard, TrendingUp, Info, CheckCircle, 
  AlertTriangle, Clock, Activity, Mail, Target, Bot, Check, ArrowRight, 
  ShieldAlert, Zap, History, DollarSign, RefreshCw
} from 'lucide-react';
import api from '../lib/api';

const Customer360 = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('id') || '';
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      searchCustomer(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length >= 2) {
        try {
          const res = await api.get(`/customers/search?q=${query}`);
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch (err) {}
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const timeoutId = setTimeout(() => fetchSuggestions(), 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const searchCustomer = async (customerId: string) => {
    if (!customerId) return;
    try {
      const res = await api.get(`/customers/${customerId}`);
      setData(res.data);
    } catch (err) {
      setData(null);
      alert("Customer intelligence profile not found");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      setShowSuggestions(false);
      searchCustomer(query);
      navigate(`?id=${query}`);
    }
  };

  const executeAction = (actionName: string) => {
    setIsExecuting(true);
    setTimeout(() => {
       setIsExecuting(false);
       setActionSuccess(actionName);
       setTimeout(() => setActionSuccess(null), 4000);
    }, 1500);
  };

  const sendEmail = async () => {
    setIsExecuting(true);
    try {
      await api.post("/send-email", {
        email: data?.profile?.email || "testmail@gmail.com",
        name: data?.profile?.customer_name || "Enterprise Client",
        risk: data?.prediction?.churn_probability || 0.85
      });
      setIsExecuting(false);
      setActionSuccess("Email Dispatched successfully");
      setTimeout(() => setActionSuccess(null), 4000);
    } catch(e) {
      setIsExecuting(false);
      alert("Failed to send email");
    }
  };

  // Deterministic Timeline Mock
  const generateTimeline = (id: string) => [
     { date: '14 Days Ago', event: 'Active usage normal', type: 'neutral', icon: <CheckCircle size={14}/> },
     { date: '8 Days Ago', event: 'Login frequency dropped by 42%', type: 'warning', icon: <Activity size={14}/> },
     { date: '3 Days Ago', event: 'Payment sequence failed', type: 'critical', icon: <CreditCard size={14}/> },
     { date: 'Today', event: 'Escalated to High-Risk Action Queue', type: 'critical', icon: <Target size={14}/> }
  ];

  if (!data && !query) {
     return (
        <div className="p-8 max-w-7xl mx-auto min-h-[80vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-700">
           <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner"><User size={40} className="text-slate-300"/></div>
           <h2 className="text-3xl font-black text-slate-900 mb-2">Customer Intelligence Engine</h2>
           <p className="text-slate-500 font-medium max-w-md mb-8">Search for a customer ID to initialize the deep insight prediction sequence and AI execution panel.</p>
           
           <form onSubmit={handleSearch} className="w-full max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                 value={query} onChange={(e) => setQuery(e.target.value)}
                 onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                 type="text" placeholder="Search Customer ID (e.g. CUST-0044)..." 
                 className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-xl"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
                  {suggestions.map((s, i) => (
                    <div 
                      key={i} className="px-6 py-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 hover:bg-primary/5 transition-colors"
                      onMouseDown={(e) => { e.preventDefault(); setQuery(s.customer_id); searchCustomer(s.customer_id); navigate(`?id=${s.customer_id}`); }}
                    >
                      <p className="text-sm font-bold text-slate-900 flex justify-between">{s.customer_name || 'Enterprise Client'} <span className="text-slate-400 font-normal">{s.customer_id}</span></p>
                    </div>
                  ))}
                </div>
              )}
           </form>
           
           <div className="mt-12 flex items-center gap-4 text-sm font-bold text-slate-400">
              <span>Quick test:</span>
              <button onClick={() => {setQuery('CUST-0044'); searchCustomer('CUST-0044'); navigate(`?id=CUST-0044`);}} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-lg transition-colors">CUST-0044</button>
           </div>
        </div>
     );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-32">
      
      {/* 1. Global Search Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
           <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3"><Zap className="text-primary"/> Action Profile Engine</h2>
           <p className="text-slate-500 font-medium">Single-account predictive telemetry & execution</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            value={query} onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            type="text" placeholder="Search another ID..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm font-bold focus:outline-none focus:border-primary transition-all shadow-sm"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden text-left">
               {suggestions.map((s, i) => (
               <div 
                  key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                  onMouseDown={(e) => { e.preventDefault(); setQuery(s.customer_id); searchCustomer(s.customer_id); navigate(`?id=${s.customer_id}`); }}
               >
                  <p className="text-sm font-bold text-slate-900">{s.customer_name} <span className="text-slate-400 font-normal ml-2">{s.customer_id}</span></p>
               </div>
               ))}
            </div>
          )}
        </form>
      </header>

      {/* Dynamic Toasts */}
      {isExecuting && (
         <div className="fixed top-6 right-6 bg-slate-900 text-white font-bold p-4 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-right-10">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            Deploying neural schema action...
         </div>
      )}
      {actionSuccess && (
         <div className="fixed top-6 right-6 bg-emerald-600 border border-emerald-500 text-white font-bold p-4 px-6 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-right-10 zoom-in">
            <CheckCircle size={20}/>
            [Success] {actionSuccess}
         </div>
      )}

      {data && (
        <div className="grid grid-cols-12 gap-6">
           
           {/* 🧩 SECTION 1: Customer Overview Header */}
           <div className="col-span-12 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              
              <div className="flex items-center gap-6 relative z-10 w-full mb-6 md:mb-0">
                 <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200">
                    <User size={36} className="text-slate-400"/>
                 </div>
                 <div className="w-full">
                    <div className="flex items-center gap-3 mb-1">
                       <h1 className="text-3xl font-black text-slate-900">{data.profile.customer_name || 'Enterprise Client'}</h1>
                       <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1
                          ${data.prediction?.churn_probability > 0.8 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                          {data.prediction?.churn_probability > 0.8 ? <AlertTriangle size={12}/> : <ShieldAlert size={12}/>} 
                          {data.prediction?.churn_probability > 0.8 ? 'Needs Attention 🔴' : 'At Risk 🟠'}
                       </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                       <span className="flex items-center gap-1.5"><MapPin size={14}/> {data.profile.customer_id}</span>
                       <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                       <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><DollarSign size={14}/> {(data.profile.lifetime_value || 0).toLocaleString()} (LTV)</span>
                       <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                       <span className="flex items-center gap-1.5"><Activity size={14}/> {data.profile.plan_type} Tier</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0 w-full md:w-auto mt-4 md:mt-0 relative z-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Defection Probability</span>
                 <div className="text-4xl font-black text-rose-600 flex items-end gap-1">
                    {(data.prediction?.churn_probability * 100).toFixed(0)}<span className="text-2xl">%</span>
                 </div>
                 <span className="text-xs font-bold text-rose-400 mt-1">Status: HIGH</span>
              </div>
           </div>

           {/* LEFT COLUMN */}
           <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* 🧩 SECTION 2: AI Risk Explanation (CORE FEATURE) */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-slate-50">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                 
                 <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                       <Bot className="text-primary"/> AI Risk Diagnostic
                    </h3>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Gen AI Copilot</span>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div>
                       <p className="text-slate-500 text-sm font-bold mb-3 uppercase tracking-widest">Why is this customer at risk?</p>
                       <div className="space-y-3">
                          {data.prediction?.churn_reasons.replace(/[\[\]"]/g, '').split(',').map((reason: string, i: number) => (
                             <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
                                <div className="mt-0.5"><AlertTriangle size={16} className="text-amber-500"/></div>
                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{reason.trim()}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                       <div className="bg-white p-2 border border-primary/10 shadow-sm rounded-xl text-primary"><Target size={20}/></div>
                       <div>
                          <h4 className="font-bold text-slate-900 mb-1 text-sm uppercase tracking-widest">Calculated AI Impact</h4>
                          <p className="text-slate-600 text-sm font-medium leading-relaxed">High probability of total defection in the next 7 days based on concurrent behavioral triggers. Intervention is recommended immediately.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* 🧩 SECTION 4 & 5: Metrics + Transactions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Engagement Metrics */}
                 <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                       <Activity size={16} className="text-indigo-500"/> Engagement Signals
                    </h3>
                    <div className="space-y-5">
                       <div className="flex justify-between items-center group">
                          <div><p className="text-xs font-bold text-slate-500">Login Frequency</p><p className="text-lg font-black text-slate-900">{data.profile.login_frequency} / mo</p></div>
                          <div className="bg-rose-50 text-rose-600 font-bold text-xs px-2 py-1 rounded flex items-center gap-1 group-hover:scale-110 transition-transform">↓ 40%</div>
                       </div>
                       <div className="flex justify-between items-center group">
                          <div><p className="text-xs font-bold text-slate-500">Session Duration</p><p className="text-lg font-black text-slate-900">{data.profile.session_duration.toFixed(1)} mins</p></div>
                          <div className="bg-amber-50 text-amber-600 font-bold text-xs px-2 py-1 rounded flex items-center gap-1 group-hover:scale-110 transition-transform">↓ 15%</div>
                       </div>
                       <div className="flex justify-between items-center group">
                          <div><p className="text-xs font-bold text-slate-500">Email Open Rate</p><p className="text-lg font-black text-slate-900">{(data.profile.email_open_rate * 100).toFixed(0)}%</p></div>
                          <div className="bg-rose-50 text-rose-600 font-bold text-xs px-2 py-1 rounded flex items-center gap-1 group-hover:scale-110 transition-transform">↓ 22%</div>
                       </div>
                    </div>
                 </div>

                 {/* Transaction Insights */}
                 <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                       <CreditCard size={16} className="text-emerald-500"/> Financial Matrix
                    </h3>
                    <div className="space-y-5">
                       <div className="flex justify-between items-center">
                          <div><p className="text-xs font-bold text-slate-500">Total Spend</p><p className="text-lg font-black text-emerald-600">₹{(data.profile.total_spend || 0).toLocaleString()}</p></div>
                       </div>
                       <div className="flex justify-between items-center">
                          <div><p className="text-xs font-bold text-slate-500">Last Purchase</p><p className="text-lg font-black text-slate-900">{data.profile.last_purchase_days || 30} days ago</p></div>
                          <AlertTriangle size={16} className="text-amber-500"/>
                       </div>
                       <div className="flex justify-between items-center">
                          <div><p className="text-xs font-bold text-slate-500">Refunds / Errors</p><p className="text-lg font-black text-rose-600">{data.profile.payment_failures || 0} issues</p></div>
                          <ShieldAlert size={16} className="text-rose-500"/>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN */}
           <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* 🧩 SECTION 7 & 8: Recommendations & Simulation */}
              <div className="bg-white rounded-3xl p-6 border-2 border-primary/20 shadow-sm relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Zap size={16} className="text-amber-500 fill-amber-500"/> Action Protocol
                 </h3>
                 
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 mt-4">Simulation Preview</p>
                 <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                       60%
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-800 leading-tight mb-1">Retention Win Chance</p>
                       <p className="text-xs font-medium text-emerald-600">₹{((data.profile.lifetime_value || 1500)*0.6).toLocaleString()} revenue saved</p>
                    </div>
                 </div>

                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Recommended Actions</p>
                 <div className="space-y-2 mb-8">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                       <span className="text-sm font-bold text-primary flex items-center gap-2">1. Send 20% Discount <span className="text-lg">🎁</span></span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                       <span className="text-sm font-bold text-slate-600 flex items-center gap-2">2. Assign VIP Agent <span className="text-lg">🤝</span></span>
                    </div>
                 </div>

                 {/* 🧩 SECTION 10: Action Buttons Panel */}
                 <div className="space-y-3">
                    <button onClick={() => executeAction("Action Executed Successfully")} className="w-full bg-primary hover:bg-accent text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                       <Zap size={18} fill="currentColor"/> Execute Action
                    </button>
                    <div className="flex gap-3">
                       <button onClick={sendEmail} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <Mail size={16}/> Email
                       </button>
                       <button onClick={() => executeAction("Added to Campaign Array")} className="flex-1 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                          <Target size={16}/> Target
                       </button>
                    </div>
                 </div>
              </div>

              {/* 🧩 SECTION 3: Behavior Timeline */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                    <History size={16} className="text-indigo-500"/> Behavior Timeline
                 </h3>
                 <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-4">
                    {generateTimeline(data.profile.customer_id).map((item, idx) => (
                       <div key={idx} className="relative pl-6">
                          <div className={`absolute -left-[13px] top-0.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white
                             ${item.type === 'critical' ? 'bg-rose-500' : item.type === 'warning' ? 'bg-amber-500' : 'bg-slate-300'}`}>
                             {item.icon}
                          </div>
                          <p className="text-xs font-bold text-slate-400 mb-0.5 uppercase tracking-widest">{item.date}</p>
                          <p className={`text-sm font-bold ${item.type === 'critical' ? 'text-rose-700' : 'text-slate-700'}`}>{item.event}</p>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default Customer360;
