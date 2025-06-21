import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    license_plate: '',
    vehicle_make: '',
    vehicle_model: '',
    vehicle_color: '',
    violation_type: '',
    violation_description: '',
    location: '',
    fine_amount: '',
    officer_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ticketData = {
        ...formData,
        fine_amount: parseFloat(formData.fine_amount),
        issued_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'pending'
      };

      const { error } = await supabase
        .from('parking_tickets')
        .insert([ticketData]);

      if (error) throw error;

      alert('Ticket created successfully!');
      navigate('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Create New Parking Ticket</h1>
        <div className="actions">
          <button
            onClick={() => navigate('/tickets')}
            className="btn btn-secondary"
          >
            ← Back to Tickets
          </button>
        </div>
      </div>
      
      <div className="card">
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
              <label className="form-label">Vehicle Make *</label>
              <input
                type="text"
                name="vehicle_make"
                value={formData.vehicle_make}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Toyota"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Vehicle Model *</label>
              <input
                type="text"
                name="vehicle_model"
                value={formData.vehicle_model}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Camry"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Vehicle Color *</label>
              <input
                type="text"
                name="vehicle_color"
                value={formData.vehicle_color}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Blue"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Violation Type *</label>
              <select
                name="violation_type"
                value={formData.violation_type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select violation type</option>
                <option value="No Parking">No Parking</option>
                <option value="Expired Meter">Expired Meter</option>
                <option value="Handicap Zone">Handicap Zone</option>
                <option value="Fire Hydrant">Fire Hydrant</option>
                <option value="Double Parking">Double Parking</option>
                <option value="Blocking Driveway">Blocking Driveway</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Fine Amount ($) *</label>
              <input
                type="number"
                name="fine_amount"
                value={formData.fine_amount}
                onChange={handleChange}
                className="form-input"
                required
                min="0"
                step="0.01"
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="123 Main Street, City, State"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Violation Description</label>
            <textarea
              name="violation_description"
              value={formData.violation_description}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
              placeholder="Additional details about the violation..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Officer ID *</label>
            <input
              type="text"
              name="officer_id"
              value={formData.officer_id}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="OFF001"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/tickets')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Creating...' : '✅ Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
