import { useState } from 'react';
import { Zap, TrendingUp, Calculator } from 'lucide-react';
import api from '../lib/api';

const Simulator = () => {
  const [config, setConfig] = useState({
    target_group: 'All Risk Categories',
    campaign_type: 'Email Outreach',
    discount_percent: 15,
    expected_retention_rate: 0.25,
    budget: 5000
  });
  const [results, setResults] = useState<any>(null);

  const handleRun = async () => {
    try {
      const res = await api.post('/campaigns/simulate', config);
      setResults(res.data);
    } catch (e) {
      alert("Simulation failed");
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Campaign Simulator</h2>
        <p className="text-slate-500">A/B test retention strategies and ROI before deployment</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 glass p-8 rounded-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Target Group</label>
            <select 
              value={config.target_group}
              onChange={(e) => setConfig({...config, target_group: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary"
            >
              <option>All Risk Categories</option>
              <option>High Risk</option>
              <option>Medium Risk</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Campaign Type</label>
            <select 
              value={config.campaign_type}
              onChange={(e) => setConfig({...config, campaign_type: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary"
            >
              <option>Email Outreach</option>
              <option>Discount / Coupon</option>
              <option>Support Callback</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Discount % ({config.discount_percent}%)</label>
            <input 
              type="range" min="0" max="50" step="5"
              value={config.discount_percent}
              onChange={(e) => setConfig({...config, discount_percent: parseInt(e.target.value)})}
              className="w-full accent-primary" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Expected Retention ({ (config.expected_retention_rate * 100).toFixed(0)}%)</label>
            <input 
              type="range" min="0" max="1" step="0.05"
              value={config.expected_retention_rate}
              onChange={(e) => setConfig({...config, expected_retention_rate: parseFloat(e.target.value)})}
              className="w-full accent-primary" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Campaign Budget (₹)</label>
            <input 
              type="number"
              value={config.budget}
              onChange={(e) => setConfig({...config, budget: parseInt(e.target.value)})}
              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <button 
            onClick={handleRun}
            className="w-full bg-gradient-to-r from-primary to-accent py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-primary/20"
          >
            <Zap size={20} /> RUN SIMULATION
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-8">
           {results ? (
             <div className="space-y-8 animate-in zoom-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="glass p-6 rounded-2xl border-slate-200">
                   <p className="text-slate-500 text-xs font-bold mb-1">TARGETED</p>
                   <p className="text-3xl font-black">{results.targeted_customers}</p>
                 </div>
                 <div className="glass p-6 rounded-2xl border-slate-200">
                   <p className="text-slate-500 text-xs font-bold mb-1">SAVED</p>
                   <p className="text-3xl font-black text-green-400">{results.expected_saved}</p>
                 </div>
                 <div className="glass p-6 rounded-2xl border-slate-200">
                   <p className="text-slate-500 text-xs font-bold mb-1">REVENUE PROTECTED</p>
                   <p className="text-3xl font-black text-primary">₹{results.revenue_protected.toLocaleString()}</p>
                 </div>
               </div>

               <div className="glass p-10 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${results.roi_percent > 0 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                    <TrendingUp size={48} />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black">ROI {results.roi_percent}%</h3>
                    <p className="text-slate-500 mt-2">Estimated profitability of strategy vs projected cost</p>
                 </div>
                 <div className="flex gap-8 pt-6">
                    <div className="text-center">
                       <p className="text-xs font-bold text-slate-500 mb-1">ESTIMATED COST</p>
                       <p className="text-xl font-bold">₹{results.estimated_cost.toLocaleString()}</p>
                    </div>
                    <div className="w-[1px] bg-slate-50"></div>
                    <div className="text-center">
                       <p className="text-xs font-bold text-slate-500 mb-1">PROTECTED REV</p>
                       <p className="text-xl font-bold">₹{results.revenue_protected.toLocaleString()}</p>
                    </div>
                 </div>
               </div>
             </div>
           ) : (
             <div className="h-full glass rounded-3xl border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12">
               <Calculator size={64} className="text-slate-900/10 mb-6" />
               <h3 className="text-xl font-bold text-slate-900/40">Ready for Simulation</h3>
               <p className="text-slate-600 max-w-xs mt-2">Configure strategy on the left and run to see ROI impact and protected revenue.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
