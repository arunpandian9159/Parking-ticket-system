import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <div className="fade-in">
        <div className="page-header">
          <h1>Loading Ticket...</h1>
        </div>
        <div className="card">
          <div className="text-center p-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p>Loading ticket details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <h1>Ticket Not Found</h1>
          <div className="actions">
            <button onClick={() => navigate('/tickets')} className="btn btn-primary">
              ← Back to Tickets
            </button>
          </div>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">🎫</div>
            <h3>Ticket Not Found</h3>
            <p>The ticket you're looking for doesn't exist or may have been deleted.</p>
            <button onClick={() => navigate('/tickets')} className="btn btn-primary">
              Back to Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Ticket Details</h1>
        <div className="actions">
          <button onClick={() => navigate('/tickets')} className="btn btn-secondary">
            ← Back to Tickets
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎫</span>
              Ticket #{ticket.id.slice(0, 8)}...
            </h2>
            <p className="m-0 text-secondary text-sm">
              Created on {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`status-badge status-${ticket.status}`}>
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-auto-fit gap-8 mb-8">
          <div className="bg-gradient-gray p-6 rounded-xl border-gray">
            <h3 className="flex items-center gap-2 mb-4">
              <span>🚗</span> Vehicle Information
            </h3>
            <div className="grid gap-3">
              <p className="m-0"><strong>License Plate:</strong> <span className="font-mono text-lg">{ticket.license_plate}</span></p>
              <p className="m-0"><strong>Make:</strong> {ticket.vehicle_make}</p>
              <p className="m-0"><strong>Model:</strong> {ticket.vehicle_model}</p>
              <p className="m-0"><strong>Color:</strong> <span className="capitalize">{ticket.vehicle_color}</span></p>
            </div>
          </div>

          <div className="bg-gradient-yellow p-6 rounded-xl border-yellow">
            <h3 className="flex items-center gap-2 mb-4">
              <span>⚠️</span> Violation Information
            </h3>
            <div className="grid gap-3">
              <p className="m-0"><strong>Type:</strong> {ticket.violation_type}</p>
              <p className="m-0"><strong>Location:</strong> {ticket.location}</p>
              <p className="m-0"><strong>Fine Amount:</strong> <span className="text-lg font-bold text-success">${ticket.fine_amount.toFixed(2)}</span></p>
              <p className="m-0"><strong>Officer ID:</strong> <span className="font-mono">{ticket.officer_id}</span></p>
            </div>
          </div>
        </div>

        {ticket.violation_description && (
          <div className="bg-white p-6 rounded-xl border-gray mb-8">
            <h3 className="flex items-center gap-2 mb-4">
              <span>📝</span> Violation Description
            </h3>
            <p className="m-0 leading-relaxed">{ticket.violation_description}</p>
          </div>
        )}

        <div className="grid grid-cols-auto-fit gap-8">
          <div className="bg-gradient-blue p-6 rounded-xl border-blue">
            <h3 className="flex items-center gap-2 mb-4">
              <span>📅</span> Important Dates
            </h3>
            <div className="grid gap-3">
              <p className="m-0"><strong>Issued:</strong> {new Date(ticket.issued_date).toLocaleDateString()}</p>
              <p className="m-0"><strong>Due:</strong> {new Date(ticket.due_date).toLocaleDateString()}</p>
              <p className="m-0"><strong>Created:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-gray">
            <h3 className="flex items-center gap-2 mb-4">
              <span>⚡</span> Actions
            </h3>
            {ticket.status === 'pending' && (
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => updateStatus('paid')}
                  className="btn btn-success"
                >
                  ✅ Mark as Paid
                </button>
                <button
                  onClick={() => updateStatus('disputed')}
                  className="btn btn-danger"
                >
                  ⚠️ Mark as Disputed
                </button>
              </div>
            )}
            {ticket.status === 'disputed' && (
              <button
                onClick={() => updateStatus('pending')}
                className="btn btn-secondary"
              >
                🔄 Reopen Ticket
              </button>
            )}
            {ticket.status === 'paid' && (
              <div className="p-4 bg-gradient-green text-green-800 rounded-lg flex items-center gap-2 font-bold">
                <span className="text-xl">✅</span>
                This ticket has been paid
              </div>
            )}
            {ticket.status === 'overdue' && (
              <div className="p-4 bg-gradient-red text-red-800 rounded-lg flex items-center gap-2 font-bold">
                <span className="text-xl">⏰</span>
                This ticket is overdue
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
