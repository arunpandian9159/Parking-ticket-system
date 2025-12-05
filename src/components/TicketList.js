'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import {
  Ticket,
  PlusCircle,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Car,
  MapPin,
  Clock,
  MoreHorizontal,
  FileText
} from 'lucide-react';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField] = useState('created_at');
  const [sortDirection] = useState('desc');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parking_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets
    .filter(ticket => {
      // Filter by status
      if (filter !== 'all' && ticket.status !== filter) return false;

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          ticket.license_plate.toLowerCase().includes(searchLower) ||
          ticket.violation_type.toLowerCase().includes(searchLower) ||
          ticket.location.toLowerCase().includes(searchLower) ||
          `${ticket.vehicle_make} ${ticket.vehicle_model}`.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date sorting
      if (sortField === 'issued_date' || sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const { error } = await supabase
        .from('parking_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;
      fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  if (loading) {
    return (
      <div className="fade-in p-8 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner border-primary-600 border-t-transparent w-12 h-12"></div>
          <p className="text-gray-500 font-medium">Loading Tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Ticket className="text-primary" size={32} />
          Parking Tickets
        </h1>
        <div className="actions">
          <Link href="/tickets/create" className="btn btn-primary flex items-center gap-2">
            <PlusCircle size={18} /> Create New Ticket
          </Link>
        </div>
      </div>

      <div className="card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-400" size={18} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="disputed">Disputed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">License Plate</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Violation</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issued Date</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        #{ticket.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-gray-400" />
                        <strong className="text-gray-900">{ticket.license_plate}</strong>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.vehicle_make} {ticket.vehicle_model}</div>
                        <div className="text-xs text-gray-500">
                          {ticket.vehicle_color}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        {ticket.violation_type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-600 max-w-[180px] truncate">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{ticket.location}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                      ${ticket.fine_amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${ticket.status === 'paid' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'disputed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}`}>
                        {ticket.status === 'paid' && <CheckCircle2 size={12} />}
                        {ticket.status === 'pending' && <Clock size={12} />}
                        {ticket.status === 'disputed' && <AlertTriangle size={12} />}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(ticket.issued_date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        <Link href={`/tickets/${ticket.id}`} className="btn btn-sm btn-secondary flex items-center gap-1 text-xs py-1 px-2" title="View Details">
                          <Eye size={14} /> View
                        </Link>
                        {ticket.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'paid')}
                              className="btn btn-sm btn-success flex items-center gap-1 text-xs py-1 px-2"
                              title="Mark as Paid"
                            >
                              <CheckCircle2 size={14} /> Pay
                            </button>
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'disputed')}
                              className="btn btn-sm btn-danger flex items-center gap-1 text-xs py-1 px-2"
                              title="Dispute Ticket"
                            >
                              <AlertTriangle size={14} /> Dispute
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <FileText className="text-gray-400" size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Tickets Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm || filter !== 'all'
                ? 'No tickets match your current filters. Try adjusting your search or filter criteria.'
                : 'No parking tickets have been created yet. Create your first ticket to get started.'
              }
            </p>
            {(!searchTerm && filter === 'all') && (
              <Link href="/tickets/create" className="btn btn-primary flex items-center gap-2 mt-2">
                <PlusCircle size={18} /> Create First Ticket
              </Link>
            )}
          </div>
        )}

        {filteredTickets.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500 bg-gray-50/50">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
