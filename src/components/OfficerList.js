import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const OfficerList = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    badge_number: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('officers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOfficers(data || []);
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('officers')
        .insert([formData]);

      if (error) throw error;

      setFormData({
        badge_number: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
      });
      setShowForm(false);
      fetchOfficers();
    } catch (error) {
      console.error('Error creating officer:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Loading Officers...</h2>
      </div>
    );
  }

  const filteredOfficers = officers.filter(officer => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      officer.badge_number.toLowerCase().includes(searchLower) ||
      `${officer.first_name} ${officer.last_name}`.toLowerCase().includes(searchLower) ||
      officer.email.toLowerCase().includes(searchLower) ||
      officer.phone.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Parking Enforcement Officers</h1>
        <div className="actions">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Cancel' : '👮 Add Officer'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>Add New Officer</h2>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Badge Number *</label>
                <input
                  type="text"
                  name="badge_number"
                  value={formData.badge_number}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="OFF001"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="John"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Doe"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="john.doe@city.gov"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="(555) 123-4567"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Add Officer
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-controls">
          <div className="table-search">
            <input
              type="text"
              placeholder="Search officers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="table-filters">
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {filteredOfficers.length} officer{filteredOfficers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {filteredOfficers.length > 0 ? (
          <div className="recent-tickets-table-wrapper">
            <table className="recent-tickets-table">
              <thead>
                <tr>
                  <th>Badge</th>
                  <th>Officer</th>
                  <th>Contact Information</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px', color: '#2563eb' }}>👮</span>
                        <strong style={{ fontFamily: 'monospace', color: '#2563eb' }}>
                          {officer.badge_number}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{officer.first_name} {officer.last_name}</strong>
                        <div style={{ fontSize: '12px', color: '#60a5fa' }}>
                          Enforcement Officer
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <span>📧</span>
                          <a href={`mailto:${officer.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            {officer.email}
                          </a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📞</span>
                          <a href={`tel:${officer.phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            {officer.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        padding: '6px 12px',
                        background: 'linear-gradient(90deg, #dbeafe 0%, #3b82f6 100%)',
                        color: '#1e3a8a',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ✅ Active
                      </span>
                    </td>
                    <td style={{ color: '#1e40af', fontWeight: 500 }}>
                      {new Date(officer.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👮</div>
            <h3>No Officers Found</h3>
            <p>
              {searchTerm
                ? 'No officers match your search criteria. Try adjusting your search term.'
                : 'No enforcement officers have been added yet. Add your first officer to get started.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Add First Officer
              </button>
            )}
          </div>
        )}

        {filteredOfficers.length > 0 && (
          <div className="table-info">
            Showing {filteredOfficers.length} of {officers.length} officers
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerList;
