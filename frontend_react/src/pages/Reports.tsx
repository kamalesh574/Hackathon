import React, { useState } from 'react';
import { 
  FileText, Download, Share2, Printer, CheckCircle, 
  Sparkles, FileBarChart, TrendingUp, AlertTriangle, 
  Clock, Calendar, Copy, Presentation
} from 'lucide-react';

const historyData = [
  { id: 1, date: '15 March 2026', type: 'Executive Summary', risk: 59, rev: '₹65K', status: 'High Alert' },
  { id: 2, date: '1 March 2026', type: 'Risk Analysis', risk: 42, rev: '₹48K', status: 'Monitoring' },
  { id: 3, date: '15 Feb 2026', type: 'Campaign Report', risk: 38, rev: '₹35K', status: 'Stable' },
];

const Reports = () => {
  const [reportType, setReportType] = useState('Executive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<{type: string, date: string} | null>(null);
  const [copyStatus, setCopyStatus] = useState('Copy Link');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setActiveReport({ type: reportType, date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) });
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy Link'), 2000);
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Type,Date,RiskUsers,RevenueAtRisk\nExecutive Summary,March 2026,59,65405";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "churnsense_executive_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-32">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                 <FileText className="text-primary"/> Executive Reporting Hub
              </h2>
           </div>
           <p className="text-slate-500 font-medium max-w-2xl">Instantly generate, export, and share AI-driven business reports mapping churn velocity and retention success.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
              <Calendar size={16}/> Scheduled: Weekly
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
         
         {/* 🧩 LEFT COLUMN: Generator & History */}
         <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* GENERATOR BUILDER */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Sparkles size={20} className="text-primary"/> Report Engine
               </h3>
               
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">1. Select Template</label>
                     <div className="space-y-2">
                        <button onClick={() => setReportType('Executive')} className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${reportType === 'Executive' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                           <div className="flex items-center gap-3 mb-1"><Presentation size={18} className={reportType === 'Executive' ? 'text-primary' : 'text-slate-400'}/> <span className="font-bold text-slate-900">Executive Summary</span></div>
                           <p className="text-xs text-slate-500 font-medium pl-8">High-level KPIs and automated AI insights.</p>
                        </button>
                        <button onClick={() => setReportType('Risk Analysis')} className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${reportType === 'Risk Analysis' ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                           <div className="flex items-center gap-3 mb-1"><AlertTriangle size={18} className={reportType === 'Risk Analysis' ? 'text-amber-500' : 'text-slate-400'}/> <span className="font-bold text-slate-900">Risk Analysis</span></div>
                           <p className="text-xs text-slate-500 font-medium pl-8">Deep dive into defection drivers and metrics.</p>
                        </button>
                     </div>
                  </div>

                  <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-80">
                     {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FileText size={20}/>}
                     {isGenerating ? 'Compiling Sources...' : 'Generate Report'}
                  </button>
               </div>
            </div>

            {/* SNAPSHOT HISTORY */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-6">
                  <Clock size={20} className="text-slate-400"/> Snapshot History
               </h3>
               
               <div className="space-y-4">
                  {historyData.map((record) => (
                     <div key={record.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors group cursor-pointer relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">{record.type}</span>
                           <span className="text-xs font-bold text-slate-500">{record.date}</span>
                        </div>
                        <div className="flex gap-4 mb-3">
                           <div>
                              <p className="text-xs font-medium text-slate-500">Risk Users</p>
                              <p className="text-sm font-black text-slate-900">{record.risk}</p>
                           </div>
                           <div>
                              <p className="text-xs font-medium text-slate-500">Rev at Risk</p>
                              <p className="text-sm font-black text-rose-600">{record.rev}</p>
                           </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span> Status: {record.status}</p>
                        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Download size={16} className="text-slate-400"/>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

         </div>

         {/* 🧩 RIGHT COLUMN: Active Report Viewer */}
         <div className="col-span-12 lg:col-span-8">
            
            {!activeReport ? (
               <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-slate-300">
                     <FileBarChart size={32}/>
                  </div>
                  <h3 className="text-xl font-black text-slate-400 mb-2">No Report Selected</h3>
                  <p className="text-slate-500 font-medium max-w-sm">Use the Report Engine on the left to generate new insights or select a snapshot from history.</p>
               </div>
            ) : (
               <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Document Header */}
                  <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Churn Summary Report</h2>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Document: {activeReport.type} • {activeReport.date}</p>
                     </div>
                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs">CS</div>
                  </div>

                  {/* Document Body */}
                  <div className="p-8 space-y-8">
                     
                     {/* AI Summary */}
                     <div className="bg-gradient-to-r from-indigo-50 leading-relaxed to-white p-6 rounded-2xl border-l-4 border-primary">
                        <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3 flex items-center gap-2"><Sparkles size={16}/> Generative AI Summary</h4>
                        <p className="text-slate-700 font-medium text-[15px]">
                           "This month shows a significant churn spike due to reduced engagement frequency across standard cohorts. However, the retention protocols executing against high-tier accounts are performing optimally. Immediate retention broadcast actions specifically targeting the lower-engagement bracket are heavily recommended."
                        </p>
                     </div>

                     {/* Report KPIs */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="border border-slate-200 p-4 rounded-2xl">
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">High Risk Users</p>
                           <p className="text-2xl font-black text-rose-600">59</p>
                        </div>
                        <div className="border border-slate-200 p-4 rounded-2xl">
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Revenue at Risk</p>
                           <p className="text-2xl font-black text-slate-900">₹65,405</p>
                        </div>
                        <div className="border border-slate-200 p-4 rounded-2xl">
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Expected Retained</p>
                           <p className="text-2xl font-black text-emerald-600">14</p>
                        </div>
                        <div className="border border-slate-200 p-4 rounded-2xl">
                           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Revenue Saved</p>
                           <p className="text-2xl font-black text-emerald-600">₹3,693</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        {/* Key Insights */}
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Key Insights</h4>
                           <ul className="space-y-3">
                              <li className="flex items-start gap-3">
                                 <TrendingUp className="text-amber-500 mt-0.5 shrink-0" size={16}/>
                                 <p className="text-sm font-medium text-slate-600 leading-relaxed">System-wide churn probability increased by <span className="font-bold text-slate-900">12%</span> this monthly cycle.</p>
                              </li>
                              <li className="flex items-start gap-3">
                                 <AlertTriangle className="text-rose-500 mt-0.5 shrink-0" size={16}/>
                                 <p className="text-sm font-medium text-slate-600 leading-relaxed">Premium bracket users are displaying the highest localized risk vectors.</p>
                              </li>
                              <li className="flex items-start gap-3">
                                 <FileBarChart className="text-indigo-500 mt-0.5 shrink-0" size={16}/>
                                 <p className="text-sm font-medium text-slate-600 leading-relaxed">Payment failures remain the primary mathematical driver of account defection.</p>
                              </li>
                           </ul>
                        </div>

                        {/* Prescriptive Recommendations */}
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Auto-Recommendations</h4>
                           <div className="space-y-3">
                              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-center gap-3">
                                 <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-black">1</span>
                                 <span className="text-sm font-bold">Target high-risk premium users immediately.</span>
                              </div>
                              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-center gap-3">
                                 <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-black">2</span>
                                 <span className="text-sm font-bold">Improve automated payment failure retries.</span>
                              </div>
                              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-center gap-3">
                                 <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-xs font-black">3</span>
                                 <span className="text-sm font-bold">Launch targeted 20% discount retention campaign.</span>
                              </div>
                           </div>
                        </div>
                     </div>

                  </div>

                  {/* Document Footer / Export Actions */}
                  <div className="bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-between">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Generated by AI Intelligence Engine
                     </div>
                     <div className="flex gap-3">
                        <button onClick={handleCopy} className="bg-white border text-slate-700 border-slate-200 hover:border-slate-300 font-bold px-4 py-2 rounded-xl text-sm transition-all focus:ring-4 ring-slate-100 flex items-center gap-2">
                           {copyStatus === 'Copied!' ? <CheckCircle size={16} className="text-emerald-500"/> : <Share2 size={16}/>} {copyStatus}
                        </button>
                        <button onClick={handleDownload} className="bg-primary hover:bg-primary/90 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center gap-2">
                           <Download size={16}/> Export Report
                        </button>
                     </div>
                  </div>

               </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default Reports;
