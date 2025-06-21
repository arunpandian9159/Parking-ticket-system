import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    license_plate: '',
    make: '',
    model: '',
    color: '',
    year: '',
    owner_name: '',
    owner_phone: '',
    owner_email: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year)
      };

      const { error } = await supabase
        .from('vehicles')
        .insert([vehicleData]);

      if (error) throw error;

      setFormData({
        license_plate: '',
        make: '',
        model: '',
        color: '',
        year: '',
        owner_name: '',
        owner_phone: '',
        owner_email: ''
      });
      setShowForm(false);
      fetchVehicles();
    } catch (error) {
      console.error('Error creating vehicle:', error);
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
        <h2>Loading Vehicles...</h2>
      </div>
    );
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.license_plate.toLowerCase().includes(searchLower) ||
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchLower) ||
      vehicle.color.toLowerCase().includes(searchLower) ||
      vehicle.owner_name.toLowerCase().includes(searchLower) ||
      vehicle.owner_email.toLowerCase().includes(searchLower) ||
      vehicle.year.toString().includes(searchLower)
    );
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Vehicle Registry</h1>
        <div className="actions">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Cancel' : '🚗 Add Vehicle'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h2>Add New Vehicle</h2>
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">License Plate *</label>
                <input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="ABC123"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Make *</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Toyota"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Camry"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Blue"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="2020"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  name="owner_name"
                  value={formData.owner_name}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Owner Phone *</label>
                <input
                  type="tel"
                  name="owner_phone"
                  value={formData.owner_phone}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Owner Email *</label>
                <input
                  type="email"
                  name="owner_email"
                  value={formData.owner_email}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="john.doe@email.com"
                />
              </div>
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
                Add Vehicle
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
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="table-filters">
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>License Plate</th>
                  <th>Vehicle Details</th>
                  <th>Owner Information</th>
                  <th>Contact</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🚗</span>
                        <strong style={{ fontFamily: 'monospace', fontSize: '16px' }}>
                          {vehicle.license_plate}
                        </strong>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '4px'
                        }}>
                          <span style={{
                            display: 'inline-block',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: vehicle.color.toLowerCase() === 'white' ? '#f3f4f6' :
                                           vehicle.color.toLowerCase() === 'black' ? '#1f2937' :
                                           vehicle.color.toLowerCase() === 'red' ? '#ef4444' :
                                           vehicle.color.toLowerCase() === 'blue' ? '#3b82f6' :
                                           vehicle.color.toLowerCase() === 'green' ? '#10b981' :
                                           vehicle.color.toLowerCase() === 'yellow' ? '#f59e0b' :
                                           vehicle.color.toLowerCase() === 'silver' ? '#9ca3af' :
                                           vehicle.color.toLowerCase() === 'gray' ? '#6b7280' : '#8b5cf6',
                            border: vehicle.color.toLowerCase() === 'white' ? '1px solid #d1d5db' : 'none'
                          }}></span>
                          <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                            {vehicle.color}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{vehicle.owner_name}</strong>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Vehicle Owner
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <span>📞</span>
                          <a href={`tel:${vehicle.owner_phone}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            {vehicle.owner_phone}
                          </a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📧</span>
                          <a href={`mailto:${vehicle.owner_email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                            {vehicle.owner_email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="date">
                      {new Date(vehicle.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🚗</div>
            <h3>No Vehicles Found</h3>
            <p>
              {searchTerm
                ? 'No vehicles match your search criteria. Try adjusting your search term.'
                : 'No vehicles have been registered yet. Add your first vehicle to get started.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Add First Vehicle
              </button>
            )}
          </div>
        )}

        {filteredVehicles.length > 0 && (
          <div className="table-info">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
