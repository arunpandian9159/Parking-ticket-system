import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
      <div className="card">
        <h2>Loading Tickets...</h2>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Parking Tickets</h1>
        <div className="actions">
          <Link to="/tickets/create" className="btn btn-primary">
            ➕ Create New Ticket
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="table-controls">
          <div className="table-search">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="table-filters">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="disputed">Disputed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort('id')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Ticket ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('license_plate')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    License Plate {sortField === 'license_plate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Vehicle</th>
                  <th
                    onClick={() => handleSort('violation_type')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Violation {sortField === 'violation_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('location')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('fine_amount')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Amount {sortField === 'fine_amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    onClick={() => handleSort('issued_date')}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    Issued Date {sortField === 'issued_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="number">
                      <span style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                        {ticket.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td>
                      <strong>{ticket.license_plate}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{ticket.vehicle_make} {ticket.vehicle_model}</strong>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {ticket.vehicle_color}
                        </div>
                      </div>
                    </td>
                    <td>{ticket.violation_type}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ticket.location}
                    </td>
                    <td className="currency">
                      ${ticket.fine_amount.toFixed(2)}
                    </td>
                    <td>
                      <span className={`status-badge status-${ticket.status}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="date">
                      {new Date(ticket.issued_date).toLocaleDateString()}
                    </td>
                    <td className="actions">
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link to={`/tickets/${ticket.id}`} className="btn btn-secondary">
                          👁️ View
                        </Link>
                        {ticket.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'paid')}
                              className="btn btn-success"
                            >
                              ✅ Paid
                            </button>
                            <button
                              onClick={() => updateTicketStatus(ticket.id, 'disputed')}
                              className="btn btn-danger"
                            >
                              ⚠️ Dispute
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
          <div className="empty-state">
            <div className="empty-state-icon">🎫</div>
            <h3>No Tickets Found</h3>
            <p>
              {searchTerm || filter !== 'all'
                ? 'No tickets match your current filters. Try adjusting your search or filter criteria.'
                : 'No parking tickets have been created yet. Create your first ticket to get started.'
              }
            </p>
            {(!searchTerm && filter === 'all') && (
              <Link to="/tickets/create" className="btn btn-primary">
                Create First Ticket
              </Link>
            )}
          </div>
        )}

        {filteredTickets.length > 0 && (
          <div className="table-info">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
