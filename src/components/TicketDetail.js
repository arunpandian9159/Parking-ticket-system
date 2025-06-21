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
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎫</span>
              Ticket #{ticket.id.slice(0, 8)}...
            </h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
              Created on {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`status-badge status-${ticket.status}`}>
            {ticket.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '32px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🚗</span> Vehicle Information
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <p style={{ margin: 0 }}><strong>License Plate:</strong> <span style={{ fontFamily: 'monospace', fontSize: '16px' }}>{ticket.license_plate}</span></p>
              <p style={{ margin: 0 }}><strong>Make:</strong> {ticket.vehicle_make}</p>
              <p style={{ margin: 0 }}><strong>Model:</strong> {ticket.vehicle_model}</p>
              <p style={{ margin: 0 }}><strong>Color:</strong> <span style={{ textTransform: 'capitalize' }}>{ticket.vehicle_color}</span></p>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid #f59e0b'
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span> Violation Information
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <p style={{ margin: 0 }}><strong>Type:</strong> {ticket.violation_type}</p>
              <p style={{ margin: 0 }}><strong>Location:</strong> {ticket.location}</p>
              <p style={{ margin: 0 }}><strong>Fine Amount:</strong> <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>${ticket.fine_amount.toFixed(2)}</span></p>
              <p style={{ margin: 0 }}><strong>Officer ID:</strong> <span style={{ fontFamily: 'monospace' }}>{ticket.officer_id}</span></p>
            </div>
          </div>
        </div>

        {ticket.violation_description && (
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            marginBottom: '32px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📝</span> Violation Description
            </h3>
            <p style={{ margin: 0, lineHeight: '1.6' }}>{ticket.violation_description}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid #3b82f6'
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅</span> Important Dates
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <p style={{ margin: 0 }}><strong>Issued:</strong> {new Date(ticket.issued_date).toLocaleDateString()}</p>
              <p style={{ margin: 0 }}><strong>Due:</strong> {new Date(ticket.due_date).toLocaleDateString()}</p>
              <p style={{ margin: 0 }}><strong>Created:</strong> {new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡</span> Actions
            </h3>
            {ticket.status === 'pending' && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#dcfce7', 
                color: '#166534', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold'
              }}>
                <span style={{ fontSize: '20px' }}>✅</span>
                This ticket has been paid
              </div>
            )}
            {ticket.status === 'overdue' && (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fee2e2', 
                color: '#991b1b', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold'
              }}>
                <span style={{ fontSize: '20px' }}>⏰</span>
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
