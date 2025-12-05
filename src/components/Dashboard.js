import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SeedData from './SeedData';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    paidTickets: 0,
    totalOfficers: 0,
    totalVehicles: 0,
    totalRevenue: 0
  });

  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('parking_tickets')
        .select('*');

      if (ticketsError) throw ticketsError;

      // Fetch officers
      const { data: officers, error: officersError } = await supabase
        .from('officers')
        .select('*');

      if (officersError) throw officersError;

      // Fetch vehicles
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*');

      if (vehiclesError) throw vehiclesError;

      // Calculate statistics
      const totalTickets = tickets?.length || 0;
      const pendingTickets = tickets?.filter(t => t.status === 'pending').length || 0;
      const paidTickets = tickets?.filter(t => t.status === 'paid').length || 0;
      const totalRevenue = tickets?.filter(t => t.status === 'paid')
        .reduce((sum, ticket) => sum + ticket.fine_amount, 0) || 0;

      setStats({
        totalTickets,
        pendingTickets,
        paidTickets,
        totalOfficers: officers?.length || 0,
        totalVehicles: vehicles?.length || 0,
        totalRevenue
      });

      // Get recent tickets
      const recent = tickets?.slice(0, 5) || [];
      setRecentTickets(recent);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1>Dashboard</h1>
          <div className="actions">
            <button onClick={handleRefresh} className="btn btn-secondary" disabled>
              <span className="loading-spinner"></span>
              Loading...
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="dashboard-card opacity-60">
              <div className="skeleton h-5 mb-4" style={{ height: '20px' }}></div>
              <div className="skeleton h-10" style={{ height: '40px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1>Dashboard</h1>
          <div className="actions">
            <button onClick={handleRefresh} className="btn btn-primary">
              🔄 Retry
            </button>
          </div>
        </div>

        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={handleRefresh} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Dashboard</h1>
        <div className="actions">
          <button onClick={handleRefresh} className="btn btn-secondary">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Tickets</h3>
          <div className="number">{stats.totalTickets.toLocaleString()}</div>
          <div className="trend">📊 All time</div>
        </div>

        <div className="dashboard-card">
          <h3>Pending Tickets</h3>
          <div className="number">{stats.pendingTickets.toLocaleString()}</div>
          <div className="trend">⏳ Awaiting payment</div>
        </div>

        <div className="dashboard-card">
          <h3>Paid Tickets</h3>
          <div className="number">{stats.paidTickets.toLocaleString()}</div>
          <div className="trend">✅ Completed</div>
        </div>

        <div className="dashboard-card">
          <h3>Total Officers</h3>
          <div className="number">{stats.totalOfficers.toLocaleString()}</div>
          <div className="trend">👮 Active enforcement</div>
        </div>

        <div className="dashboard-card">
          <h3>Total Vehicles</h3>
          <div className="number">{stats.totalVehicles.toLocaleString()}</div>
          <div className="trend">🚗 Registered</div>
        </div>

        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <div className="number">${stats.totalRevenue.toLocaleString()}</div>
          <div className="trend">💰 Collected</div>
        </div>
      </div>

      {stats.totalTickets === 0 && (
        <SeedData />
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>Recent Tickets</h2>
          {recentTickets.length > 0 && (
            <span className="text-secondary text-sm">
              Showing {recentTickets.length} of {stats.totalTickets} tickets
            </span>
          )}
        </div>
        {recentTickets.length > 0 ? (
          <div className="recent-tickets-table-wrapper">
            <table className="recent-tickets-table">
              <thead>
                <tr>
                  <th>License Plate</th>
                  <th>Vehicle</th>
                  <th>Violation</th>
                  <th>Location</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚗</span>
                        <strong className="text-primary">{ticket.license_plate}</strong>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{ticket.vehicle_make} {ticket.vehicle_model}</strong>
                        <div className="text-xs text-secondary">
                          {ticket.vehicle_color}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="violation-pill">
                        {ticket.violation_type}
                      </span>
                    </td>
                    <td className="truncate max-w-[180px] text-primary">
                      📍 {ticket.location}
                    </td>
                    <td className="text-primary font-bold">
                      ${ticket.fine_amount.toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge status-${ticket.status}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="font-medium text-primary-dark">
                      {new Date(ticket.issued_date).toLocaleDateString()}
                    </td>
                    <td>
                      <a
                        href={`/tickets/${ticket.id}`}
                        className="btn recent-tickets-view-btn"
                      >
                        👁️ View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No Tickets Found</h3>
            <p>Start by creating your first parking ticket or seeding the database with sample data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
