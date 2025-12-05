'use client';

import React, { useState } from 'react';
import { seedDatabase, clearDatabase } from '../utils/seedData';

const SeedData = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSeedData = async () => {
    setLoading(true);
    setMessage('🌱 Seeding database with dummy data...');
    setMessageType('');

    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage('✅ Database seeded successfully! Check the dashboard to see the data.');
        setMessageType('success');
        // Auto-refresh the page after 2 seconds to show the new data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage('❌ Error seeding database. Please check the console for details.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('❌ Error seeding database. Please check the console for details.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (window.confirm('⚠️ Are you sure you want to clear all data? This action cannot be undone.')) {
      setLoading(true);
      setMessage('🗑️ Clearing database...');
      setMessageType('');

      try {
        const result = await clearDatabase();
        if (result.success) {
          setMessage('✅ Database cleared successfully!');
          setMessageType('success');
          // Auto-refresh the page after 2 seconds
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setMessage('❌ Error clearing database. Please check the console for details.');
          setMessageType('error');
        }
      } catch (error) {
        setMessage('❌ Error clearing database. Please check the console for details.');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    }
  };

  const getMessageClass = () => {
    const baseClass = "p-4 rounded-xl mb-5 flex items-center gap-3 font-medium border";

    if (messageType === 'success') {
      return `${baseClass} bg-green-100 text-green-800 border-green-200`;
    } else if (messageType === 'error') {
      return `${baseClass} bg-red-100 text-red-800 border-red-200`;
    } else {
      return `${baseClass} bg-blue-100 text-blue-800 border-blue-200`;
    }
  };

  return (
    <div className="card fade-in">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🎯</span>
        <h2 className="m-0">Database Management</h2>
      </div>

      <p className="text-secondary mb-6 leading-relaxed">
        Use these buttons to populate or clear the database with test data. This is perfect for testing and demonstration purposes.
      </p>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={handleSeedData}
          disabled={loading}
          className="btn btn-primary min-w-[160px]"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Seeding...
            </>
          ) : (
            <>
              🌱 Seed Database
            </>
          )}
        </button>

        <button
          onClick={handleClearData}
          disabled={loading}
          className="btn btn-danger min-w-[160px]"
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Clearing...
            </>
          ) : (
            <>
              🗑️ Clear Database
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={getMessageClass()}>
          <span className="text-xl">
            {messageType === 'success' ? '✅' : messageType === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span>{message}</span>
        </div>
      )}

      <div className="bg-gradient-gray p-5 rounded-xl border-gray">
        <h4 className="flex items-center gap-2 mb-4 text-gray-700 m-0">
          📋 What will be added:
        </h4>
        <div className="grid grid-cols-auto-fit gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">👮</span>
            <div>
              <strong>5 Officers</strong>
              <div className="text-xs text-secondary">Parking enforcement officers</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <div>
              <strong>8 Vehicles</strong>
              <div className="text-xs text-secondary">Various makes and models</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎫</span>
            <div>
              <strong>8 Tickets</strong>
              <div className="text-xs text-secondary">Different violation types</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedData;
