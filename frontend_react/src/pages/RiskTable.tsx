import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, ArrowUpRight } from 'lucide-react';
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

  const getRiskBadge = (level: string) => {
    const styles = {
      'High risk': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Medium risk': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'Low risk': 'bg-green-500/10 text-green-500 border-green-500/20',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[level as keyof typeof styles] || ''}`}>
        {level.toUpperCase()}
      </span>
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
          <button className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-slate-50 transition-colors">
            <Download size={16} /> Export Report
          </button>
        </div>
      </header>

      <div className="flex gap-4 items-center bg-white shadow-sm border border-slate-200 p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text" 
            placeholder="Search by Customer ID or Name..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-4 text-sm focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="High risk">High Risk</option>
            <option value="Medium risk">Medium Risk</option>
            <option value="Low risk">Low Risk</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white shadow-sm border border-slate-200 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Churn Probability</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Level</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((c, i) => (
              <tr key={i} className="hover:bg-white shadow-sm border border-slate-200 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.customer_id}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-600">{c.customer_name || 'Enterprise'}</td>
                <td className="px-6 py-4 text-sm font-mono">{c.churn_probability.toFixed(2)}</td>
                <td className="px-6 py-4">{getRiskBadge(c.risk_level)}</td>
                <td className="px-6 py-4 text-sm font-bold text-primary">{c.priority_score.toFixed(1)}</td>
                <td className="px-6 py-4 text-sm">
                  <button 
                    onClick={() => navigate(`/customer-360?id=${c.customer_id}`)}
                    className="text-slate-500 flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    View 360 <ArrowUpRight size={14} />
                  </button>
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
