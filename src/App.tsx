import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Reviews from './pages/Reviews';
import Loyalty from './pages/Loyalty';
import Analytics from './pages/Analytics';
import NFCManagement from './pages/NFCManagement';
import Settings from './pages/Settings';
import Support from './pages/Support';

export default function App() {
  return (
    <Router>
      <div className="flex bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/nfc-management" element={<NFCManagement />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}