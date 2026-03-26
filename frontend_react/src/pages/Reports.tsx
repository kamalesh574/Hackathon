import React from 'react';
import { FileText, Download, PieChart, Database, BarChart } from 'lucide-react';
import api from '../lib/api';

const Reports = () => {
  const handleExport = async () => {
    try {
      await api.get('/reports/powerbi-export');
      alert("Power BI export snapshot generated! You can now download the CSV.");
    } catch (e) {}
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom duration-700 max-w-6xl mx-auto">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Reporting Layer</h2>
        <p className="text-slate-500">Live BI dashboards and high-fidelity dataset exports</p>
      </header>

      {/* Dual Power BI Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 glass p-10 rounded-[40px] space-y-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-2">
              <PieChart size={40} className="text-primary" />
          </div>
          <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-900">Power BI Desktop Setup</h3>
          <p className="text-slate-500 max-w-xl text-md mt-2">
            Your organization's Power BI environment reads directly from the ChurnSense reporting namespace. 
            Generate a fresh dataset snapshot below.
          </p>
          <button 
            onClick={handleExport}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-primary hover:bg-accent text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-primary/30 text-sm"
          >
            <Database size={18} /> Sync BI Dataset
          </button>
        </div>

        <div className="lg:col-span-2 glass rounded-[40px] overflow-hidden border border-slate-200 relative min-h-[400px]">
          <iframe 
             title="ChurnSense Customer BI" 
             width="100%" 
             height="100%" 
             className="absolute inset-0"
             /* Deep Embedded Microsoft Power BI Sample */
             src="https://app.powerbi.com/view?r=eyJrIjoiMDg4ZDFiOGMtMjRmMC00YWZkLWE1NTQtZjVjODBhMjRiMzdjIiwidCI6Ijc3YTcxOGMwLTUzMDMtNDExNy1iZDkwLTkwMGQ2NGNjY2NiMSIsImMiOjZ9" 
             frameBorder="0" 
             allowFullScreen={true}>
          </iframe>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
           <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BarChart size={20} className="text-primary" /> Generated Snapshots
           </h4>
           <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-xl bg-white shadow-sm border border-slate-200">
                 <div className="flex gap-4 items-center">
                    <Download size={18} className="text-slate-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">customer_predictions_snapshot.csv</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">Auto-Synced Today</p>
                    </div>
                 </div>
                 <a 
                   href="http://127.0.0.1:8000/reports/download-predictions" 
                   target="_blank" rel="noopener noreferrer" 
                   className="text-xs font-bold text-primary hover:underline"
                 >
                   Download
                 </a>
              </div>
           </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
           <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-2">
              <FileText size={32} className="text-accent" />
           </div>
           <h3 className="text-xl font-bold text-slate-900">Executive PDF Pack</h3>
           <p className="text-sm text-slate-500 max-w-xs">A comprehensive summary slide of Churn KPIs, Revenue at Risk, and Model Performance.</p>
           <a 
             href="http://127.0.0.1:8000/reports/download-pdf"
             target="_blank" rel="noopener noreferrer"
             className="block w-full text-center bg-slate-900 text-white font-bold py-3 mt-4 rounded-xl hover:bg-slate-800 transition-colors"
           >
             DOWNLOAD PDF PACK
           </a>
        </div>
      </div>
    </div>
  );
};

export default Reports;
