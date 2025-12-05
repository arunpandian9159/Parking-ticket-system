'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable, Badge, Button } from './ui/DataTable';
import {
  Users,
  PlusCircle,
  X,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  UserPlus,
  BadgeCheck,
  Trash2
} from 'lucide-react';

const OfficerList = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedOfficers, setSelectedOfficers] = useState([]);
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

  const deleteOfficers = async (officersList) => {
    try {
      const ids = officersList.map(o => o.id);
      const { error } = await supabase
        .from('officers')
        .delete()
        .in('id', ids);

      if (error) throw error;
      fetchOfficers();
    } catch (error) {
      console.error('Error deleting officers:', error);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'badge_number',
      header: 'Badge',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BadgeCheck className="h-5 w-5 text-blue-600" />
          </div>
          <strong className="font-mono text-gray-900 font-bold">
            {row.original.badge_number}
          </strong>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Officer',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.original.first_name} {row.original.last_name}
          </div>
          <div className="text-xs text-gray-500">Enforcement Officer</div>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'Contact Information',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <a href={`mailto:${row.original.email}`} className="hover:text-violet-600 transition-colors">
              {row.original.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <a href={`tel:${row.original.phone}`} className="hover:text-violet-600 transition-colors">
              {row.original.phone}
            </a>
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: () => (
        <Badge variant="success">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ row }) => (
        <span className="text-gray-500 text-sm">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ], []);

  const bulkActions = [
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'destructive',
      onClick: deleteOfficers,
    },
  ];

  return (
    <div className="fade-in space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="text-violet-600" size={32} />
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
        <div className="card bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6 animate-fade-in">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 -mt-6 -mx-6 mb-6 rounded-t-2xl" />
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <UserPlus size={24} className="text-violet-600" /> Add New Officer
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

      <DataTable
        data={officers}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search officers by badge, name, email..."
        paginated={true}
        pageSize={10}
        selectable={true}
        onSelectionChange={setSelectedOfficers}
        bulkActions={bulkActions}
        exportable={true}
        exportFilename="parking_officers"
        columnToggle={true}
        onRefresh={fetchOfficers}
        emptyMessage="No Officers Found"
        emptyDescription="No enforcement officers have been added yet. Add your first officer to get started."
        emptyIcon={Users}
      />
    </div>
  );
};

export default OfficerList;
