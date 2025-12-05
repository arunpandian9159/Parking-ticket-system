'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  Save,
  Loader2,
  Car,
  MapPin,
  FileText,
  DollarSign,
  User,
  AlertCircle
} from 'lucide-react';

const CreateTicket = () => {
  const router = useRouter();
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

      // Use a toast notification in a real app, for now alert is fine but we can make it nicer later
      alert('Ticket created successfully!');
      router.push('/tickets');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Error creating ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="page-header flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 m-0">Create New Parking Ticket</h1>
        <div className="actions">
          <button
            onClick={() => router.push('/tickets')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back to Tickets
          </button>
        </div>
      </div>

      <div className="card bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Vehicle Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Car size={20} className="text-primary" /> Vehicle Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">License Plate *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">ABC</span>
                  </div>
                  <input
                    type="text"
                    name="license_plate"
                    value={formData.license_plate}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="ABC123"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Vehicle Color *</label>
                <input
                  type="text"
                  name="vehicle_color"
                  value={formData.vehicle_color}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="Blue"
                />
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Vehicle Make *</label>
                <input
                  type="text"
                  name="vehicle_make"
                  value={formData.vehicle_make}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="Toyota"
                />
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Vehicle Model *</label>
                <input
                  type="text"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="Camry"
                />
              </div>
            </div>
          </div>

          {/* Violation Details Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
              <AlertCircle size={20} className="text-red-500" /> Violation Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Violation Type *</label>
                <select
                  name="violation_type"
                  value={formData.violation_type}
                  onChange={handleChange}
                  className="form-select w-full"
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
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Fine Amount ($) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="fine_amount"
                    value={formData.fine_amount}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    min="0"
                    step="0.01"
                    placeholder="50.00"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input pl-10 w-full"
                  required
                  placeholder="123 Main Street, City, State"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">Violation Description</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText size={16} className="text-gray-400" />
                </div>
                <textarea
                  name="violation_description"
                  value={formData.violation_description}
                  onChange={handleChange}
                  className="form-textarea pl-10 w-full"
                  rows={3}
                  placeholder="Additional details about the violation..."
                />
              </div>
            </div>
          </div>

          {/* Officer Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 pb-2 border-b border-gray-100">
              <User size={20} className="text-purple-500" /> Officer Information
            </h3>

            <div className="form-group max-w-md">
              <label className="form-label block text-sm font-medium text-gray-700 mb-1">Officer ID *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="officer_id"
                  value={formData.officer_id}
                  onChange={handleChange}
                  className="form-input pl-10 w-full"
                  required
                  placeholder="OFF001"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.push('/tickets')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Creating...
                </>
              ) : (
                <>
                  <Save size={18} /> Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
