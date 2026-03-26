import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'predicting' | 'success'>('idle');

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const uploadRes = await api.post('/upload/customers', formData);
      setStatus('predicting');
      await api.post(`/predict/batch?file_path=data/uploads/${uploadRes.data.filename}`);
      setStatus('success');
    } catch (e) {
      alert("Pipeline failed");
      setStatus('idle');
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Upload size={32} className="text-primary" />
        </div>
        <h2 className="text-4xl font-black text-slate-900">Enterprise Data Ingestion</h2>
        <p className="text-slate-500">Upload customer attributes and transactions for real-time risk scoring</p>
      </header>

      <div className="glass p-12 rounded-[40px] border-dashed border-slate-200 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
        {status === 'idle' ? (
          <>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-24 h-24 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center border border-slate-200">
               <FileText size={40} className="text-slate-500" />
            </div>
            <div className="text-center">
               <p className="text-lg font-bold text-slate-900">{file ? file.name : 'Select or drag CSV file'}</p>
               <p className="text-xs text-slate-500 mt-1">Maximum file size: 200MB</p>
            </div>
            {file && (
               <button 
                 onClick={handleUpload}
                 className="relative z-10 pointer-events-auto bg-primary hover:bg-accent text-slate-900 font-bold py-3 px-10 rounded-xl transition-all shadow-xl shadow-primary/20"
               >
                 Initialize Pipeline
               </button>
            )}
          </>
        ) : (
          <div className="text-center space-y-6">
             {status === 'success' ? (
                <div className="animate-in zoom-in duration-500">
                  <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Platform Synced</h3>
                  <p className="text-slate-500 mt-2">Latest predictions are now live on the dashboard.</p>
                  <button onClick={() => window.location.href = '/'} className="mt-8 text-primary font-bold text-sm">View Insights</button>
                </div>
             ) : (
                <div className="space-y-4">
                   <Loader2 size={64} className="text-primary animate-spin mx-auto" />
                   <h3 className="text-2xl font-bold">{status === 'uploading' ? 'Ingesting Data...' : 'Calculating Intelligence...'}</h3>
                   <p className="text-slate-500">Applying behavioral models and priority scoring logic.</p>
                </div>
             )}
          </div>
        )}
      </div>

      <div className="flex justify-center gap-12 pt-8">
         <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-slate-900">10s</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg Sync Speed</p>
         </div>
         <div className="w-[1px] bg-white shadow-sm border border-slate-200"></div>
         <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-slate-900">99.2%</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Precision</p>
         </div>
         <div className="w-[1px] bg-white shadow-sm border border-slate-200"></div>
         <div className="text-center space-y-1">
            <p className="text-2xl font-bold text-slate-900">2.4m</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Load Rows</p>
         </div>
      </div>
    </div>
  );
};

export default UploadPage;
