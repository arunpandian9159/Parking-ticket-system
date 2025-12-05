'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Ticket,
  Car,
  AlertTriangle,
  FileText,
  Calendar,
  Zap,
  CheckCircle2,
  RefreshCw,
  Clock,
  MapPin,
  User,
  DollarSign,
  Loader2
} from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('parking_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTicket(data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!ticket) return;

    try {
      const { error } = await supabase
        .from('parking_tickets')
        .update({ status: newStatus })
        .eq('id', ticket.id);

      if (error) throw error;
      fetchTicket(); // Refresh the ticket data
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  if (loading) {
    return (
      <div className="fade-in p-8 flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-500 font-medium">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="fade-in max-w-2xl mx-auto mt-12">
        <div className="card bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="p-4 bg-gray-50 rounded-full inline-block mb-4">
            <Ticket size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket Not Found</h3>
          <p className="text-gray-500 mb-8">The ticket you're looking for doesn't exist or may have been deleted.</p>
          <button onClick={() => router.push('/tickets')} className="btn btn-primary flex items-center gap-2 mx-auto">
            <ArrowLeft size={18} /> Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in max-w-5xl mx-auto space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Ticket className="text-primary" size={32} />
          Ticket Details
        </h1>
        <div className="actions">
          <button onClick={() => router.push('/tickets')} className="btn btn-secondary flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Tickets
          </button>
        </div>
      </div>

      <div className="card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="flex items-center gap-3 mb-2 text-2xl font-bold text-gray-900">
              Ticket #{ticket.id.slice(0, 8)}
            </h2>
            <p className="m-0 text-gray-500 text-sm flex items-center gap-2">
              <Calendar size={14} /> Created on {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold capitalize shadow-sm
            ${ticket.status === 'paid' ? 'bg-green-100 text-green-800 border border-green-200' :
              ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                ticket.status === 'disputed' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-800 border border-gray-200'}`}>
            {ticket.status === 'paid' && <CheckCircle2 size={16} />}
            {ticket.status === 'pending' && <Clock size={16} />}
            {ticket.status === 'disputed' && <AlertTriangle size={16} />}
            {ticket.status}
          </span>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Vehicle Info */}
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-blue-900">
                <Car size={20} className="text-blue-600" /> Vehicle Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-600">License Plate</span>
                  <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{ticket.license_plate}</span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-600">Make</span>
                  <span className="font-medium text-gray-900">{ticket.vehicle_make}</span>
                </div>
                <div className="flex justify-between border-b border-blue-100 pb-2">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium text-gray-900">{ticket.vehicle_model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color</span>
                  <span className="font-medium text-gray-900 capitalize flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: ticket.vehicle_color }}></span>
                    {ticket.vehicle_color}
                  </span>
                </div>
              </div>
            </div>

            {/* Violation Info */}
            <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-red-900">
                <AlertTriangle size={20} className="text-red-600" /> Violation Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-red-100 pb-2">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded">{ticket.violation_type}</span>
                </div>
                <div className="flex justify-between border-b border-red-100 pb-2">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1 text-right max-w-[200px] truncate">
                    <MapPin size={14} className="text-gray-400" /> {ticket.location}
                  </span>
                </div>
                <div className="flex justify-between border-b border-red-100 pb-2">
                  <span className="text-gray-600">Fine Amount</span>
                  <span className="text-lg font-bold text-gray-900 flex items-center">
                    <DollarSign size={16} className="text-gray-400" /> {ticket.fine_amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Officer ID</span>
                  <span className="font-mono font-medium text-gray-900 flex items-center gap-1">
                    <User size={14} className="text-gray-400" /> {ticket.officer_id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {ticket.violation_description && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
              <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold text-gray-800">
                <FileText size={20} className="text-gray-500" /> Violation Description
              </h3>
              <p className="m-0 leading-relaxed text-gray-600 bg-white p-4 rounded-lg border border-gray-200">
                {ticket.violation_description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                <Calendar size={20} className="text-purple-500" /> Important Dates
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm text-gray-400">
                      <Calendar size={18} />
                    </div>
                    <span className="text-gray-600 font-medium">Issued Date</span>
                  </div>
                  <span className="font-semibold text-gray-900">{new Date(ticket.issued_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm text-red-400">
                      <Clock size={18} />
                    </div>
                    <span className="text-gray-600 font-medium">Due Date</span>
                  </div>
                  <span className="font-semibold text-red-600">{new Date(ticket.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
                <Zap size={20} className="text-yellow-500" /> Actions
              </h3>

              <div className="space-y-3">
                {ticket.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateStatus('paid')}
                      className="btn btn-success flex items-center justify-center gap-2 w-full"
                    >
                      <CheckCircle2 size={18} /> Mark as Paid
                    </button>
                    <button
                      onClick={() => updateStatus('disputed')}
                      className="btn btn-danger flex items-center justify-center gap-2 w-full"
                    >
                      <AlertTriangle size={18} /> Dispute Ticket
                    </button>
                  </div>
                )}

                {ticket.status === 'disputed' && (
                  <button
                    onClick={() => updateStatus('pending')}
                    className="btn btn-secondary flex items-center justify-center gap-2 w-full"
                  >
                    <RefreshCw size={18} /> Reopen Ticket
                  </button>
                )}

                {ticket.status === 'paid' && (
                  <div className="p-4 bg-green-50 text-green-800 rounded-lg flex items-center justify-center gap-2 font-bold border border-green-100">
                    <CheckCircle2 size={24} className="text-green-600" />
                    This ticket has been paid
                  </div>
                )}

                {ticket.status === 'overdue' && (
                  <div className="p-4 bg-red-50 text-red-800 rounded-lg flex items-center justify-center gap-2 font-bold border border-red-100">
                    <Clock size={24} className="text-red-600" />
                    This ticket is overdue
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
