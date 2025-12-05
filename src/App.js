import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import CreateTicket from './components/CreateTicket';
import TicketDetail from './components/TicketDetail';
import OfficerList from './components/OfficerList';
import VehicleList from './components/VehicleList';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}>
        <div className="min-h-screen flex flex-col bg-gradient-gray relative">
          <Navbar />
          <main className="flex-1 py-8 animate-fade-in">
            <div className="max-w-[1200px] mx-auto px-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tickets" element={<TicketList />} />
                <Route path="/tickets/create" element={<CreateTicket />} />
                <Route path="/tickets/:id" element={<TicketDetail />} />
                <Route path="/officers" element={<OfficerList />} />
                <Route path="/vehicles" element={<VehicleList />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
