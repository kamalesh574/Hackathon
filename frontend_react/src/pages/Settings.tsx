import { Shield, Sliders, Bell } from 'lucide-react';

const Settings = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Platform Settings</h2>
        <p className="text-slate-500">Global configurations for risk thresholds and intelligence engines</p>
      </header>

      <div className="space-y-8 pb-20">
        <section className="glass p-8 rounded-3xl space-y-6">
           <h4 className="text-lg font-bold flex items-center gap-2 border-b border-slate-200 pb-4">
              <Sliders size={20} className="text-primary" /> Risk Thresholds
           </h4>
           <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>HIGH RISK PROBABILITY</span>
                   <span className="text-primary">0.70</span>
                </div>
                <input type="range" className="w-full accent-primary" defaultValue={70} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                   <span>MEDIUM RISK PROBABILITY</span>
                   <span className="text-primary">0.40</span>
                </div>
                <input type="range" className="w-full accent-primary" defaultValue={40} />
              </div>
           </div>
        </section>

        <section className="glass p-8 rounded-3xl space-y-6">
           <h4 className="text-lg font-bold flex items-center gap-2 border-b border-slate-200 pb-4">
              <Bell size={20} className="text-accent" /> Alert Configurations
           </h4>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-sm font-bold text-slate-900">Critical Churn Spike Alerts</p>
                    <p className="text-xs text-slate-500 mt-0.5">Push notification when high-risk count increases by 10%</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                 </div>
              </div>
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-sm font-bold text-slate-900">Revenue Exposure Notifications</p>
                    <p className="text-xs text-slate-500 mt-0.5">Email alert when individual customer value &gt; $5,000</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                 </div>
              </div>
           </div>
        </section>

        <section className="glass p-8 rounded-3xl space-y-6 opacity-50 pointer-events-none">
           <h4 className="text-lg font-bold flex items-center gap-2 border-b border-slate-200 pb-4">
              <Shield size={20} className="text-blue-400" /> API & Integrations
           </h4>
           <div className="space-y-4">
              <div className="space-y-2 text-sm">
                 <p className="text-slate-500 font-bold uppercase text-[10px]">FastAPI Endpoint</p>
                 <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-200 text-slate-500 font-mono">
                    http://127.0.0.1:8000
                 </div>
              </div>
           </div>
        </section>

        <button className="w-full bg-primary hover:bg-accent text-slate-900 font-bold py-4 rounded-xl shadow-2xl shadow-primary/20 transition-all">
           Save Platform Logic
        </button>
      </div>
    </div>
  );
};

export default Settings;
