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

  const getMessageStyle = () => {
    const baseStyle = {
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: '500',
      border: '1px solid'
    };

    if (messageType === 'success') {
      return {
        ...baseStyle,
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderColor: '#a7f3d0'
      };
    } else if (messageType === 'error') {
      return {
        ...baseStyle,
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        borderColor: '#fca5a5'
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        borderColor: '#93c5fd'
      };
    }
  };

  return (
    <div className="card fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '2rem' }}>🎯</span>
        <h2 style={{ margin: 0 }}>Database Management</h2>
      </div>
      
      <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>
        Use these buttons to populate or clear the database with test data. This is perfect for testing and demonstration purposes.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={handleSeedData}
          disabled={loading}
          className="btn btn-primary"
          style={{ minWidth: '160px' }}
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
          className="btn btn-danger"
          style={{ minWidth: '160px' }}
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
        <div style={getMessageStyle()}>
          <span style={{ fontSize: '1.2rem' }}>
            {messageType === 'success' ? '✅' : messageType === 'error' ? '❌' : 'ℹ️'}
          </span>
          <span>{message}</span>
        </div>
      )}

      <div style={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📋 What will be added:
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>👮</span>
            <div>
              <strong>5 Officers</strong>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Parking enforcement officers</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🚗</span>
            <div>
              <strong>8 Vehicles</strong>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Various makes and models</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎫</span>
            <div>
              <strong>8 Tickets</strong>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Different violation types</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeedData;
