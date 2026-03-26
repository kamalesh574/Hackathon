import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit } from 'lucide-react';

const data = [
  { feature: 'App Activity Score', importance: 0.85 },
  { feature: 'Time Since Last Login', importance: 0.72 },
  { feature: 'Total Spend (₹)', importance: 0.64 },
  { feature: 'Customer Support Tickets', importance: 0.51 },
  { feature: 'Discount Usage Rate', importance: 0.43 },
  { feature: 'Account Age (Months)', importance: 0.31 },
];

const FeatureInsights = () => {
  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom duration-500 max-w-6xl mx-auto">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-900">Feature Insights</h2>
        <p className="text-slate-500">Machine learning model interpretability and churn drivers</p>
      </header>

      <div className="glass p-8 rounded-3xl">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-8">
          <BrainCircuit className="text-primary" /> Global Feature Importance
        </h3>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="feature" type="category" stroke="#64748b" width={150} tick={{ fontSize: 13, fill: '#0f172a', fontWeight: 500 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#8a2be2', fontWeight: 'bold' }}
              />
              <Bar dataKey="importance" fill="#8a2be2" radius={[0, 6, 6, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FeatureInsights;
