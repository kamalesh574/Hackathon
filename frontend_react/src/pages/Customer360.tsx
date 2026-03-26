import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, User, MapPin, CreditCard, TrendingUp, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

const Customer360 = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';
  const [query, setQuery] = useState(initialQuery);
  const [data, setData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      alert("Customer not found");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      setShowSuggestions(false);
      searchCustomer(query);
    }
  };

  const handleSelectSuggestion = (customerId: string) => {
    setQuery(customerId);
    setShowSuggestions(false);
    searchCustomer(customerId);
  };

  return (
    <div className="p-8 space-y-8 animate-in zoom-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Customer 360 Profile</h2>
        <p className="text-slate-500">Deep-dive intelligence for individual retention strategy</p>
      </header>

      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            type="text" 
            placeholder="Search Customer ID or Name (e.g. Karthik)..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all shadow-xl"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <div 
                  key={i}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-100 transition-colors"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(s.customer_id);
                  }}
                >
                  <p className="text-sm font-bold text-slate-900">{s.customer_name || 'Enterprise Client'}</p>
                  <p className="text-xs text-slate-500">{s.customer_id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="bg-primary hover:bg-accent text-slate-900 px-6 py-2 rounded-xl text-sm font-semibold transition-all">
          Search Intelligence
        </button>
      </form>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Main Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${data.prediction?.risk_level === 'High risk' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                  {data.prediction?.risk_level?.toUpperCase()}
                </span>
              </div>
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <User size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold">{data.profile.customer_name || 'Enterprise Client'}</h3>
              <p className="text-slate-500 font-medium mb-1">ID: {data.profile.customer_id}</p>
              <p className="text-slate-500 text-sm mb-6">{data.profile.plan_type} Subscription</p>
              
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-500" /> {data.profile.region}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <CreditCard size={16} className="text-slate-500" /> ₹{data.profile.total_spend.toLocaleString()} Total Spend
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                   <TrendingUp size={16} className="text-slate-500" /> {data.profile.purchase_count} Total Purchases
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl bg-primary/5 border-primary/20">
               <h4 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">Recommended Action</h4>
               <p className="text-slate-900 font-medium mb-4">{data.action?.action_type || 'Monitor Behavior'}</p>
               <button className="w-full bg-slate-900 text-white text-sm font-bold py-2 rounded-lg hover:bg-slate-200 transition-colors">
                 Execute Action Plan
               </button>
            </div>
          </div>

          {/* Insights */}
          <div className="lg:col-span-2 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl">
                   <p className="text-slate-500 text-xs font-bold uppercase mb-2">Churn Probability</p>
                   <p className="text-3xl font-black text-slate-900">{(data.prediction?.churn_probability * 100).toFixed(1)}%</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                   <p className="text-slate-500 text-xs font-bold uppercase mb-2">Priority Score</p>
                   <p className="text-3xl font-black text-primary">{data.prediction?.priority_score.toFixed(1)}</p>
                </div>
             </div>

             <div className="glass p-8 rounded-3xl">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <Info size={20} className="text-primary" /> Why is this customer at risk?
                </h4>
                <div className="space-y-4">
                   {data.prediction?.churn_reasons.split(';').map((reason: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl bg-white shadow-sm border border-slate-200 border border-slate-200 items-start">
                         <div className="mt-1"><AlertTriangle size={16} className="text-orange-400" /></div>
                         <p className="text-sm text-slate-600">{reason.trim()}</p>
                      </div>
                   ))}
                </div>
             </div>

             <div className="glass p-8 rounded-3xl">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <CheckCircle size={20} className="text-green-400" /> Action History
                </h4>
                <div className="text-center py-8">
                   <p className="text-slate-500 text-sm italic">No past actions recorded for this customer.</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer360;
