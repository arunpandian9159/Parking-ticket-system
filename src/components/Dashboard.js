'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import SeedData from './SeedData';
import {
  LayoutDashboard,
  Clock,
  CheckCircle2,
  Users,
  Car,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  ClipboardList,
  Eye,
  MapPin,
  Loader2,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

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
        <div className="page-header flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <LayoutDashboard className="text-primary" size={32} />
            Dashboard
          </h1>
          <div className="actions">
            <button className="btn btn-secondary" disabled>
              <Loader2 className="animate-spin" size={18} />
              Loading...
            </button>
          </div>
        </div>

        <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 opacity-60">
              <div className="skeleton h-5 w-1/2 mb-4 bg-gray-200 rounded"></div>
              <div className="skeleton h-10 w-3/4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fade-in">
        <div className="page-header flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="actions">
            <button onClick={handleRefresh} className="btn btn-primary flex items-center gap-2">
              <RefreshCw size={18} /> Retry
            </button>
          </div>
        </div>

        <div className="card bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="empty-state flex flex-col items-center gap-4">
            <div className="p-4 bg-red-50 rounded-full">
              <AlertTriangle className="text-red-500" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Error Loading Data</h3>
            <p className="text-gray-500">{error}</p>
            <button onClick={handleRefresh} className="btn btn-primary flex items-center gap-2">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <LayoutDashboard className="text-primary" size={32} />
          Dashboard
        </h1>
        <div className="actions">
          <button onClick={handleRefresh} className="btn btn-secondary flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      <div className="dashboard-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Total Tickets</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ClipboardList className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="number text-3xl font-bold text-gray-900 mb-2">{stats.totalTickets.toLocaleString()}</div>
          <div className="trend text-sm text-gray-500 flex items-center gap-1">
            <TrendingUp size={14} className="text-green-500" /> All time
          </div>
        </div>

        <div className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Pending Tickets</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
          </div>
          <div className="number text-3xl font-bold text-gray-900 mb-2">{stats.pendingTickets.toLocaleString()}</div>
          <div className="trend text-sm text-gray-500 flex items-center gap-1">
            <AlertCircle size={14} className="text-yellow-500" /> Awaiting payment
          </div>
        </div>

        <div className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Paid Tickets</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
          </div>
          <div className="number text-3xl font-bold text-gray-900 mb-2">{stats.paidTickets.toLocaleString()}</div>
          <div className="trend text-sm text-gray-500 flex items-center gap-1">
            <CheckCircle2 size={14} className="text-green-500" /> Completed
          </div>
        </div>

        <div className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Total Officers</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="text-purple-600" size={20} />
            </div>
          </div>
          <div className="number text-3xl font-bold text-gray-900 mb-2">{stats.totalOfficers.toLocaleString()}</div>
          <div className="trend text-sm text-gray-500 flex items-center gap-1">
            <Users size={14} className="text-purple-500" /> Active enforcement
          </div>
        </div>

        <div className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Total Vehicles</h3>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Car className="text-indigo-600" size={20} />
            </div>
          </div>
          <div className="number text-3xl font-bold text-gray-900 mb-2">{stats.totalVehicles.toLocaleString()}</div>
          <div className="trend text-sm text-gray-500 flex items-center gap-1">
            <Car size={14} className="text-indigo-500" /> Registered
          </div>
        </div>

        <div className="dashboard-card bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-500 font-medium">Total Revenue</h3>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
          </div>
          <div className="number text-3xl font-bold text-gray-900 mb-2">${stats.totalRevenue.toLocaleString()}</div>
          <div className="trend text-sm text-gray-500 flex items-center gap-1">
            <DollarSign size={14} className="text-emerald-500" /> Collected
          </div>
        </div>
      </div>

      {stats.totalTickets === 0 && (
        <SeedData />
      )}

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500" />
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="text-violet-600" size={24} />
            Recent Tickets
          </h2>
          {recentTickets.length > 0 && (
            <Link href="/tickets" className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <Eye size={14} />
            </Link>
          )}
        </div>
        {recentTickets.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
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
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-indigo-50 rounded-lg">
                          <Car size={16} className="text-indigo-600" />
                        </div>
                        <strong className="text-gray-900 font-semibold">{ticket.license_plate}</strong>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium text-gray-900">{ticket.vehicle_make} {ticket.vehicle_model}</div>
                        <div className="text-xs text-gray-500 capitalize">{ticket.vehicle_color}</div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        {ticket.violation_type}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-gray-600 max-w-[180px]">
                        <MapPin size={14} className="shrink-0 text-gray-400" />
                        <span className="truncate">{ticket.location}</span>
                      </div>
                    </td>
                    <td className="currency">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{ticket.fine_amount.toFixed(2)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${ticket.status} inline-flex items-center gap-1.5`}>
                        {ticket.status === 'paid' && <CheckCircle2 size={12} />}
                        {ticket.status === 'pending' && <Clock size={12} />}
                        {ticket.status === 'disputed' && <AlertTriangle size={12} />}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="date">
                      {new Date(ticket.issued_date).toLocaleDateString()}
                    </td>
                    <td className="actions">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="btn btn-sm text-xs bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <ClipboardList className="text-gray-400" size={48} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No Tickets Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Start by creating your first parking ticket or seeding the database with sample data.</p>
          </div>
        )}
        {recentTickets.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-center">
            <span className="text-sm text-gray-500">
              Showing {recentTickets.length} of {stats.totalTickets} tickets
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
