'use client';

import React, { useState } from 'react';
import { seedDatabase, clearDatabase } from '../utils/seedData';
import {
  Database,
  Trash2,
  Sprout,
  CheckCircle2,
  XCircle,
  Info,
  List,
  Users,
  Car,
  Ticket,
  Loader2
} from 'lucide-react';

const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('Seeding database with dummy data...');
    setMessageType('');

    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage('Database seeded successfully! Check the dashboard to see the data.');
        setMessageType('success');
        // Auto-refresh the page after 2 seconds to show the new data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage('Error seeding database. Please check the console for details.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error seeding database. Please check the console for details.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setLoading(true);
      setMessage('Clearing database...');
      setMessageType('');

      try {
        const result = await clearDatabase();
        if (result.success) {
          setMessage('Database cleared successfully!');
          setMessageType('success');
          // Auto-refresh the page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setMessage('Error clearing database. Please check the console for details.');
          setMessageType('error');
        }
      } catch (error) {
        setMessage('Error clearing database. Please check the console for details.');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    }
  };

  const getMessageClass = () => {
    const baseClass = "p-4 rounded-xl mb-5 flex items-center gap-3 font-medium border";

    if (messageType === 'success') {
      return `${baseClass} bg-green-50 text-green-800 border-green-100`;
    } else if (messageType === 'error') {
      return `${baseClass} bg-red-50 text-red-800 border-red-100`;
    } else {
      return `${baseClass} bg-blue-50 text-blue-800 border-blue-100`;
    }
  };

  return (
    <div className="card bg-white rounded-xl shadow-sm border border-gray-100 p-8 fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-50 rounded-lg">
          <Database size={24} className="text-purple-600" />
        </div>
        <h2 className="m-0 text-xl font-bold text-gray-800">Database Management</h2>
      </div>

      <p className="text-gray-500 mb-8 leading-relaxed max-w-2xl">
        Use these buttons to populate or clear the database with test data. This is perfect for testing and demonstration purposes.
      </p>

      <div className="flex gap-4 mb-8 flex-wrap">
        <button
          onClick={handleSeedData}
          disabled={loading}
          className="btn btn-primary min-w-[180px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Seeding...
            </>
          ) : (
            <>
              <Sprout size={18} /> Seed Database
            </>
          )}
        </button>

        <button
          onClick={handleClearData}
          disabled={loading}
          className="btn btn-danger min-w-[180px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Clearing...
            </>
          ) : (
            <>
              <Trash2 size={18} /> Clear Database
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={getMessageClass()}>
          <span className="text-xl">
            {messageType === 'success' ? <CheckCircle2 size={20} /> : messageType === 'error' ? <XCircle size={20} /> : <Info size={20} />}
          </span>
          <span>{message}</span>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h4 className="flex items-center gap-2 mb-4 text-gray-700 font-semibold m-0">
          <List size={18} /> What will be added:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="p-2 bg-blue-50 rounded-full">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <strong className="block text-gray-900">5 Officers</strong>
              <div className="text-xs text-gray-500">Parking enforcement officers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="p-2 bg-indigo-50 rounded-full">
              <Car size={20} className="text-indigo-600" />
            </div>
            <div>
              <strong className="block text-gray-900">8 Vehicles</strong>
              <div className="text-xs text-gray-500">Various makes and models</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div className="p-2 bg-green-50 rounded-full">
              <Ticket size={20} className="text-green-600" />
            </div>
            <div>
              <strong className="block text-gray-900">8 Tickets</strong>
              <div className="text-xs text-gray-500">Different violation types</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedData;
