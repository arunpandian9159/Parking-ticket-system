'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users,
  PlusCircle,
  X,
  Search,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  UserPlus,
  BadgeCheck
} from 'lucide-react';

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
      <div className="fade-in p-8 flex justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner border-primary-600 border-t-transparent w-12 h-12"></div>
          <p className="text-gray-500 font-medium">Loading Officers...</p>
        </div>
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
    <div className="fade-in space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-primary" size={32} />
          Parking Enforcement Officers
        </h1>
        <div className="actions">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
          >
            {showForm ? <><X size={18} /> Cancel</> : <><UserPlus size={18} /> Add Officer</>}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserPlus size={24} className="text-primary" /> Add New Officer
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Badge Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="badge_number"
                    value={formData.badge_number}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="OFF001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="John"
                />
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-input w-full"
                  required
                  placeholder="Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="john.doe@city.gov"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10 w-full"
                    required
                    placeholder="(555) 123-4567"
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
                <PlusCircle size={18} /> Add Officer
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
                placeholder="Search officers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
            <div className="text-secondary text-sm font-medium">
              {filteredOfficers.length} officer{filteredOfficers.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {filteredOfficers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Officer</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Information</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <BadgeCheck size={20} className="text-blue-600" />
                        </div>
                        <strong className="font-mono text-gray-900 font-bold">
                          {officer.badge_number}
                        </strong>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{officer.first_name} {officer.last_name}</div>
                        <div className="text-xs text-gray-500">
                          Enforcement Officer
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <a href={`mailto:${officer.email}`} className="hover:text-primary transition-colors">
                            {officer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400" />
                          <a href={`tel:${officer.phone}`} className="hover:text-primary transition-colors">
                            {officer.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(officer.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 bg-gray-50 rounded-full">
              <Users className="text-gray-400" size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Officers Found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm
                ? 'No officers match your search criteria. Try adjusting your search term.'
                : 'No enforcement officers have been added yet. Add your first officer to get started.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary flex items-center gap-2 mt-2"
              >
                <PlusCircle size={18} /> Add First Officer
              </button>
            )}
          </div>
        )}

        {filteredOfficers.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500 bg-gray-50/50">
            Showing {filteredOfficers.length} of {officers.length} officers
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerList;
