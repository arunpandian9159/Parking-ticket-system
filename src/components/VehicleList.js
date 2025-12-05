'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Car,
  PlusCircle,
  X,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  Palette,
  FileText
} from 'lucide-react';

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
      <div className="fade-in p-8 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner border-primary-600 border-t-transparent w-12 h-12"></div>
          <p className="text-gray-500 font-medium">Loading Vehicles...</p>
        </div>
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
    <div className="fade-in space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Car className="text-primary" size={32} />
          Vehicle Registry
        </h1>
        <div className="actions">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
          >
            {showForm ? <><X size={18} /> Cancel</> : <><PlusCircle size={18} /> Add Vehicle</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Car size={24} className="text-primary" /> Add New Vehicle
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">License Plate *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-gray-400" />
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
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Make *</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="Toyota"
                />
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="Camry"
                />
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Color *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Palette size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="Blue"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Year *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2020"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="owner_name"
                    value={formData.owner_name}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Owner Phone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="owner_phone"
                    value={formData.owner_phone}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Owner Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="owner_email"
                    value={formData.owner_email}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="john.doe@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
              >
                <PlusCircle size={18} /> Add Vehicle
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="text-secondary text-sm font-medium">
              {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">License Plate</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehicle Details</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner Information</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <Car size={20} className="text-indigo-600" />
                        </div>
                        <strong className="font-mono text-lg text-gray-900 font-bold">
                          {vehicle.license_plate}
                        </strong>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block w-3 h-3 rounded-full border border-gray-200`} style={{ backgroundColor: vehicle.color }}></span>
                          <span className="text-xs text-gray-500 capitalize">
                            {vehicle.color}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{vehicle.owner_name}</div>
                        <div className="text-xs text-gray-500">
                          Vehicle Owner
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <a href={`tel:${vehicle.owner_phone}`} className="hover:text-primary transition-colors">
                            {vehicle.owner_phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <a href={`mailto:${vehicle.owner_email}`} className="hover:text-primary transition-colors">
                            {vehicle.owner_email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(vehicle.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <Car className="text-gray-400" size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Vehicles Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm
                ? 'No vehicles match your search criteria. Try adjusting your search term.'
                : 'No vehicles have been registered yet. Add your first vehicle to get started.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary flex items-center gap-2 mt-2"
              >
                <PlusCircle size={18} /> Add First Vehicle
              </button>
            )}
          </div>
        )}

        {filteredVehicles.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500 bg-gray-50/50">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
