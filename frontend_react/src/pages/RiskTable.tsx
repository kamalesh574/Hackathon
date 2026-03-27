import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, ArrowUpRight, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const RiskTable = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filter, setFilter] = useState('High risk');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get('/customers/priority');
        setCustomers(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => {
    const riskMatch = filter === 'All' || c.risk_level === filter;
    const searchMatch = !searchTerm || 
      c.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.customer_name && c.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return riskMatch && searchMatch;
  });

  const exportToCSV = () => {
    if (!filtered || filtered.length === 0) return;
    const headers = ['Customer ID', 'Customer Name', 'Churn Probability', 'Risk Level', 'Priority Score'];
    const rows = filtered.map(c => [
      c.customer_id,
      `"${c.customer_name || 'Enterprise'}"`,
      c.churn_probability?.toFixed(2) || '0.00',
      c.risk_level,
      c.priority_score?.toFixed(1) || '0.0'
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `churn_risk_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskBadge = (level: string) => {
    const styles = {
      'High risk': 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm',
      'Medium risk': 'bg-amber-50 text-amber-600 border border-amber-200 shadow-sm',
      'Low risk': 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm',
    };
    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[level as keyof typeof styles] || ''}`}>
          {level}
        </span>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-6 animate-in slide-in-from-bottom duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Customer Risk Queue</h2>
          <p className="text-slate-500">Operational action items sorted by priority score</p>
        </div>
        <div className="flex gap-4">
          <button onClick={exportToCSV} className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-primary transition-all shadow-sm active:scale-95">
            <Download size={16} strokeWidth={2.5}/> Export Report &nbsp;<span className="bg-slate-100 text-[10px] px-2 py-0.5 rounded-full text-slate-500">{filtered.length}</span>
          </button>
        </div>
      </header>

      <div className="flex gap-4 items-center bg-white shadow-sm border border-slate-200 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text" 
            placeholder="Search active intelligence matrix by ID or Name..." 
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary font-bold text-slate-600 appearance-none cursor-pointer"
          >
            <option value="All">All Intelligence</option>
            <option value="High risk">Critical Priority</option>
            <option value="Medium risk">Monitor Queue</option>
            <option value="Low risk">Safe Harbor</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest pl-8">Customer ID</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Name</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Defection Likelihood</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Risk Stage</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Friction Score</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Direct Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-6 py-5 pl-8 text-sm font-black text-slate-900">{c.customer_id}</td>
                <td className="px-6 py-5 text-sm font-bold text-slate-600">{c.customer_name || 'Enterprise Hub'}</td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900 w-10">{(c.churn_probability * 100).toFixed(0)}%</span>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                           className={`h-full rounded-full ${c.churn_probability > 0.8 ? 'bg-rose-500' : c.churn_probability > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                           style={{width: `${c.churn_probability * 100}%`}}
                         />
                      </div>
                   </div>
                </td>
                <td className="px-6 py-5">{getRiskBadge(c.risk_level)}</td>
                <td className="px-6 py-5 text-sm font-black text-indigo-500">{c.priority_score.toFixed(1)}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate(`/customer-360?id=${c.customer_id}`)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-indigo-100 hover:text-indigo-700 transition-all border border-indigo-100/50"
                    >
                      Audit 360 <ArrowUpRight size={14} strokeWidth={2.5} />
                    </button>
                    <button className="px-3 py-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all border border-slate-200">
                      <Mail size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
