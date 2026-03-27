import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, ArrowUpRight, Mail, CheckSquare, Square, Play, ShieldAlert, CheckCircle2, Loader2, Sparkles, AlertTriangle, UserCheck, Flame, Clock, Navigation, Check, Tag, X, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const RiskTable = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  
  // Filtering & Search
  const [riskFilter, setRiskFilter] = useState('All');
  const [ltvFilter, setLtvFilter] = useState(false);
  const [inactiveFilter, setInactiveFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Workflow States
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [workflowStatusMap, setWorkflowStatusMap] = useState<Record<string, string>>({});
  
  // Bulk Execution
  const [isExecutingBulk, setIsExecutingBulk] = useState(false);
  const [bulkActionSuccess, setBulkActionSuccess] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers/priority');
        const enriched = res.data.map((c: any) => {
           // Deterministic Mock Generation
           let hash = 0;
           for (let i = 0; i < c.customer_id.length; i++) hash = c.customer_id.charCodeAt(i) + ((hash << 5) - hash);
           hash = Math.abs(hash);
           
           const ltv = (hash % 85000) + 7500;
           const daysInactive = (hash % 45);
           
           let drivers = c.churn_probability > 0.8 ? ["Payment Failure", "No Logins"] : c.churn_probability > 0.5 ? ["NPS Dropped", "Low Sessions"] : ["Stable", "Recent Activity"];
           let recommendedAction = c.churn_probability > 0.8 ? "Send Max Discount" : c.churn_probability > 0.5 ? "Priority CRM Route" : "Monitor Health";
           
           return {
             ...c,
             ltv,
             daysInactive,
             drivers,
             recommendedAction,
             priority_score: c.churn_probability * ltv 
           };
        });
        
        enriched.sort((a: any, b: any) => b.priority_score - a.priority_score);
        setCustomers(enriched);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCustomers();
  }, []);

  const augmentedCustomers = customers.map(c => ({
    ...c,
    status: workflowStatusMap[c.customer_id] || 'New'
  }));

  const filtered = augmentedCustomers.filter(c => {
    const riskMatch = riskFilter === 'All' || c.risk_level === riskFilter;
    const ltvMatch = !ltvFilter || c.ltv > 40000;
    const inactiveMatch = !inactiveFilter || c.daysInactive > 25;
    const searchMatch = !searchTerm || 
      c.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.customer_name && c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return riskMatch && searchMatch && ltvMatch && inactiveMatch;
  });

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedUsers(newSet);
  };
  
  const toggleSelectAll = () => {
    if (selectedUsers.size === filtered.length && filtered.length > 0) setSelectedUsers(new Set());
    else setSelectedUsers(new Set(filtered.map(c => c.customer_id)));
  };

    const targetEmail = customer.email || "testmail@gmail.com";

    const loadingToast = document.createElement('div');
    loadingToast.innerHTML = '<div class="fixed top-4 right-4 bg-slate-900 border border-slate-700 text-white px-6 py-4 rounded-xl shadow-2xl z-[200] font-bold text-sm flex items-center gap-3"><div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> Dispatching real email to ' + targetEmail + '...</div>';
    document.body.appendChild(loadingToast);
    
    try {
      await api.post("/send-email", {
        email: targetEmail,
        name: customer.customer_name || "Enterprise Client",
        risk: customer.churn_probability
      });
      loadingToast.innerHTML = '<div class="fixed top-4 right-4 bg-emerald-600 border border-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[200] font-bold text-sm flex items-center gap-3">✅ Email sent successfully 🚀</div>';
      setTimeout(() => { if (document.body.contains(loadingToast)) document.body.removeChild(loadingToast); }, 3500);
    } catch(e) {
      console.error(e);
      loadingToast.innerHTML = '<div class="fixed top-4 right-4 bg-rose-600 border border-rose-500 text-white px-6 py-4 rounded-xl shadow-2xl z-[200] font-bold text-sm flex items-center gap-3">❌ Failed to send email. Check backend credentials.</div>';
      setTimeout(() => { if (document.body.contains(loadingToast)) document.body.removeChild(loadingToast); }, 3500);
    }
  };

  const executeBulkAction = (actionType: string, inlineId?: string) => {
    setIsExecutingBulk(true);
    
    // If an inlineId is passed from the row button, use it directly bypassing the async React selectedUsers state
    const targetSet = inlineId ? new Set([inlineId]) : selectedUsers;
    
    setTimeout(() => {
       const newStatuses = { ...workflowStatusMap };
       targetSet.forEach(id => {
         newStatuses[id] = actionType === 'Discount' ? 'Action Taken' : actionType === 'Support' ? 'In Progress' : 'Retained';
       });
       setWorkflowStatusMap(newStatuses);
       setIsExecutingBulk(false);
       setBulkActionSuccess(`Successfully deployed [${actionType}] protocol to ${targetSet.size} account(s).`);
       setTimeout(() => {
         setBulkActionSuccess('');
         if (!inlineId) setSelectedUsers(new Set());
       }, 4000);
    }, 2800);
  };

  const exportToCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const headers = ['Customer ID', 'Customer Name', 'LTV (INR)', 'Churn Prob', 'Priority Matrix', 'Risk Level', 'Days Inactive', 'Workflow Status'];
    const rows = filtered.map(c => [
      c.customer_id,
      `"${c.customer_name || 'Enterprise'}"`,
      c.ltv,
      c.churn_probability?.toFixed(2) || '0.00',
      c.priority_score?.toFixed(0) || '0',
      c.risk_level,
      c.daysInactive,
      c.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `action_queue_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUrgencyBadge = (prob: number) => {
    if (prob > 0.8) return <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shadow-sm w-max"><Flame size={12} strokeWidth={3}/> Immediate</span>;
    if (prob > 0.5) return <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm w-max">Moderate</span>;
    return <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-sm w-max">Low Priority</span>;
  };

  const getStatusBadge = (status: string) => {
    const map: any = {
      'New': 'bg-slate-100 text-slate-600 border-slate-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse',
      'Action Taken': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Retained': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return <span className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${map[status] || map['New']}`}>
       {status === 'New' ? <AlertTriangle size={12}/> : status === 'In Progress' ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={12}/>}
       {status}
    </span>;
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-32">
       
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
             <Inbox className="text-primary" size={32} /> 
             Action Queue Engine
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Decision & Execution Workspace. Prioritized by LTV × Risk Vector.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportToCSV} className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-all shadow-sm active:scale-95">
            <Download size={16} strokeWidth={2.5}/> Export Execution Report
          </button>
        </div>
      </header>

      {/* 🧩 Section 1: Filters + Search */}
      <div className="flex flex-col xl:flex-row gap-4 items-center bg-white shadow-sm border border-slate-200 p-4 rounded-2xl w-full">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text" 
            placeholder="Search action queue by ID or Name..." 
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-700 placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
           {/* Quick Toggles */}
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
              <button onClick={() => setLtvFilter(!ltvFilter)} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${ltvFilter ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                 <UserCheck size={14}/> High LTV Only
              </button>
              <button onClick={() => setInactiveFilter(!inactiveFilter)} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${inactiveFilter ? 'bg-rose-100 text-rose-700 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                 <Clock size={14}/> Inactive &gt;25d
              </button>
           </div>
           
           <div className="w-[1px] h-8 bg-slate-200 hidden xl:block"></div>

           {/* Risk Override */}
           <div className="flex items-center gap-2 w-full sm:w-auto">
             <Filter size={18} className="text-slate-400 shrink-0" />
             <select 
               value={riskFilter} 
               onChange={(e) => setRiskFilter(e.target.value)}
               className="w-full sm:w-auto bg-slate-50/50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary font-bold text-slate-600 appearance-none cursor-pointer"
             >
               <option value="All">All Intelligence</option>
               <option value="High risk">Immediate Risk</option>
               <option value="Medium risk">Moderate Trajectory</option>
               <option value="Low risk">Safe Accounts</option>
             </select>
           </div>
        </div>
      </div>

      {/* 🧩 Section 2: Smart Risk Table */}
      <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-sm relative z-10 w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-6 py-5 pl-8 w-12 text-center">
                 <button onClick={toggleSelectAll} className="opacity-70 hover:opacity-100 text-slate-400 transition-colors">
                    {selectedUsers.size === filtered.length && filtered.length > 0 ? <CheckSquare size={20} className="text-primary"/> : <Square size={20}/>}
                 </button>
              </th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Customer Matrix</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Risk Assessment</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">AI Intelligence</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Workflow</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Inline Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c, i) => (
              <tr key={i} className={`group transition-colors ${selectedUsers.has(c.customer_id) ? 'bg-primary/5' : 'hover:bg-slate-50/80'}`}>
                <td className="px-6 py-5 pl-8 text-center text-slate-400">
                   <button onClick={() => toggleSelect(c.customer_id)} className="opacity-70 group-hover:opacity-100 transition-opacity">
                      {selectedUsers.has(c.customer_id) ? <CheckSquare size={20} className="text-primary"/> : <Square size={20}/>}
                   </button>
                </td>
                
                {/* 1. Customer Matrix */}
                <td className="px-6 py-5 border-r border-slate-100/50">
                   <div className="flex flex-col gap-1.5">
                      <span className="text-base font-black text-slate-900 flex items-center gap-2">{c.customer_name || 'Enterprise Hub'} <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded font-bold">{c.customer_id}</span></span>
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">₹{c.ltv.toLocaleString()} <span className="font-medium text-slate-400 text-xs">(LTV)</span></span>
                   </div>
                </td>
                
                {/* 2. Risk Assessment */}
                <td className="px-6 py-5 border-r border-slate-100/50">
                   <div className="flex flex-col gap-3">
                      {getUrgencyBadge(c.churn_probability)}
                      <div className="space-y-1 group">
                         <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span>Defection Prob</span>
                            <span className="text-rose-600">{(c.churn_probability * 100).toFixed(0)}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${c.churn_probability > 0.8 ? 'bg-rose-500' : c.churn_probability > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{width: `${c.churn_probability * 100}%`}}/>
                         </div>
                      </div>
                   </div>
                </td>
                
                {/* 3. AI Intelligence */}
                <td className="px-6 py-5 border-r border-slate-100/50">
                   <div className="flex flex-col gap-2 relative">
                      {/* Risk Reason Tooltip Target */}
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-1">
                          <Tag size={12}/> Root Drivers <span className="text-slate-300 ml-auto lowercase opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-b border-dashed border-slate-300">hover</span>
                      </span>
                      <div className="flex items-start gap-1 text-xs font-bold text-rose-600 pl-1"><div className="w-1 h-1 bg-rose-400 rounded-full mt-1.5 shrink-0"/> {c.drivers[0]}</div>
                      <div className="flex items-start gap-1 text-xs font-bold text-rose-600 pl-1"><div className="w-1 h-1 bg-rose-400 rounded-full mt-1.5 shrink-0"/> {c.drivers[1]}</div>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] font-black uppercase text-amber-500 bg-amber-50 px-2 py-1 rounded w-max">
                         <Clock size={12}/> Inactive {c.daysInactive}d
                      </div>
                   </div>
                </td>
                
                {/* 4. Workflow */}
                <td className="px-6 py-5 border-r border-slate-100/50">
                   <div className="flex flex-col gap-3 items-start">
                      {getStatusBadge(c.status)}
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-sm"><Sparkles size={10}/> {c.recommendedAction}</span>
                   </div>
                </td>
                
                {/* 5. Direct Actions */}
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2 transition-all duration-300">
                    <button onClick={() => navigate(`/customer-360?id=${c.customer_id}`)} className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-[11px] rounded-xl flex items-center gap-1.5 hover:bg-indigo-100 hover:text-indigo-700 transition-all border border-indigo-100/50 active:scale-95 shadow-sm whitespace-nowrap">
                      <Search size={14} strokeWidth={2.5} /> Audit 360
                    </button>
                    <button onClick={() => executeBulkAction('Discount', c.customer_id)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-[11px] rounded-xl flex items-center gap-1.5 hover:bg-slate-200 transition-all active:scale-95 shadow-sm whitespace-nowrap">
                      <Play size={14} strokeWidth={2.5}/> Deploy
                    </button>
                    <button onClick={() => sendEmail(c)} className="px-4 py-2 bg-slate-900 text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 hover:bg-primary transition-all active:scale-95 shadow-sm border border-slate-800 whitespace-nowrap hover:scale-105">
                      <Mail size={14} strokeWidth={2.5}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
           <div className="p-16 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Inbox size={48} strokeWidth={1} />
              <p className="font-bold text-sm">No customers align with active filter parameters.</p>
           </div>
        )}
      </div>

      {/* 🧩 Section 3: Bulk Actions Bar (Floating bottom) */}
      {selectedUsers.size > 0 && (
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/95 backdrop-blur-md p-2 pl-6 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-6 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3">
               <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/50 text-primary font-black text-xs">
                  {selectedUsers.size}
               </div>
               <span className="text-white font-bold text-sm">Accounts Target-Locked</span>
            </div>
            
            <div className="w-[1px] h-8 bg-slate-700"></div>
            
            <div className="flex items-center gap-2">
               {isExecutingBulk ? (
                  <div className="flex items-center gap-3 px-6 py-2.5">
                     <Loader2 size={18} className="text-primary animate-spin"/>
                     <span className="text-primary font-bold text-sm">Executing Multi-Thread CRM Subroutine...</span>
                  </div>
               ) : bulkActionSuccess ? (
                  <div className="flex items-center gap-3 px-6 py-2.5">
                     <CheckCircle2 size={18} className="text-emerald-400"/>
                     <span className="text-emerald-400 font-bold text-sm">{bulkActionSuccess}</span>
                  </div>
               ) : (
                  <>
                     <button onClick={() => executeBulkAction('Discount')} className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <Tag size={16}/> Push Max Discount
                     </button>
                     <button onClick={() => executeBulkAction('Support')} className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                        <UserCheck size={16}/> Assign VIP Support
                     </button>
                     <button onClick={() => setSelectedUsers(new Set())} className="text-slate-400 hover:text-white p-2.5 ml-2 transition-colors">
                        <X size={18}/>
                     </button>
                  </>
               )}
            </div>
         </div>
      )}

    </div>
  );
};

export default RiskTable;
