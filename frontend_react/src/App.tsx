import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import RiskTable from './pages/RiskTable';
import Customer360 from './pages/Customer360';
import FeatureInsights from './pages/FeatureInsights';
import Simulator from './pages/Simulator';
import UploadPage from './pages/Upload';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen text-slate-800">
        <Sidebar />
        <main className="ml-64 flex-1">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/risk-table" element={<RiskTable />} />
            <Route path="/customer-360" element={<Customer360 />} />
            <Route path="/insights" element={<FeatureInsights />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
