'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable, Badge, Button } from './ui/DataTable';
import {
  Car,
  PlusCircle,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Palette,
  FileText,
  Trash2
} from 'lucide-react';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
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

  const deleteVehicles = async (vehiclesList) => {
    try {
      const ids = vehiclesList.map(v => v.id);
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .in('id', ids);

      if (error) throw error;
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicles:', error);
    }
  };

  const getColorBadge = (color) => {
    const colorMap = {
      'black': 'bg-gray-900 text-white',
      'white': 'bg-gray-100 text-gray-800 border border-gray-300',
      'red': 'bg-red-500 text-white',
      'blue': 'bg-blue-500 text-white',
      'silver': 'bg-gray-400 text-white',
      'gray': 'bg-gray-500 text-white',
      'green': 'bg-green-500 text-white',
      'yellow': 'bg-yellow-400 text-gray-900',
      'orange': 'bg-orange-500 text-white',
      'brown': 'bg-amber-700 text-white',
    };
    const colorClass = colorMap[color?.toLowerCase()] || 'bg-gray-200 text-gray-700';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}>
        <Palette className="h-3 w-3" />
        {color}
      </span>
    );
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'license_plate',
      header: 'License Plate',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Car className="h-5 w-5 text-indigo-600" />
          </div>
          <strong className="font-mono text-gray-900 font-bold text-lg">
            {row.original.license_plate}
          </strong>
        </div>
      ),
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">
            {row.original.make} {row.original.model}
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {row.original.year}
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'color',
      header: 'Color',
      cell: ({ row }) => getColorBadge(row.original.color),
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded-full">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <span className="font-medium text-gray-900">{row.original.owner_name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <a href={`tel:${row.original.owner_phone}`} className="hover:text-violet-600 transition-colors">
              {row.original.owner_phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3.5 w-3.5 text-gray-400" />
            <a href={`mailto:${row.original.owner_email}`} className="hover:text-violet-600 transition-colors">
              {row.original.owner_email}
            </a>
          </div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: 'Registered',
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
      onClick: deleteVehicles,
    },
  ];

  return (
    <div className="fade-in space-y-6">
      <div className="page-header flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Car className="text-violet-600" size={32} />
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
        <div className="card bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6 animate-fade-in">
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 -mt-6 -mx-6 mb-6 rounded-t-2xl" />
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Car size={24} className="text-violet-600" /> Add New Vehicle
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

      <DataTable
        data={vehicles}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search vehicles by plate, make, model, owner..."
        paginated={true}
        pageSize={10}
        selectable={true}
        onSelectionChange={setSelectedVehicles}
        bulkActions={bulkActions}
        exportable={true}
        exportFilename="vehicle_registry"
        columnToggle={true}
        onRefresh={fetchVehicles}
        emptyMessage="No Vehicles Found"
        emptyDescription="No vehicles have been registered yet. Add your first vehicle to get started."
        emptyIcon={Car}
      />
    </div>
  );
};

export default VehicleList;
