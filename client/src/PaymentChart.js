import React, { useState, useEffect } from 'react';

function PaymentChart({ coachId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (coachId) {
      fetchPaymentStats();
    }
  }, [coachId]);

  const fetchPaymentStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/home/payment-stats/?coach_id=${coachId}`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        setError(data.error || 'Failed to load payment stats');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading payment stats...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>{error}</div>;
  }

  if (!stats) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>No payment data available</div>;
  }

  // Find the maximum amount for scaling
  const maxAmount = Math.max(...stats.monthly_data.map(d => d.amount));
  const maxMonths = Math.max(...stats.monthly_data.map(d => d.months_paid));

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', margin: '1rem 0' }}>
      <h3 style={{ marginBottom: '1rem', color: '#333' }}>💰 Payment Statistics</h3>
      
      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
            ${stats.total_revenue.toFixed(2)}
          </div>
          <div style={{ color: '#666' }}>Total Revenue</div>
        </div>
        
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
            {stats.total_payments}
          </div>
          <div style={{ color: '#666' }}>Total Payments</div>
        </div>
        
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
            ${stats.avg_monthly_revenue.toFixed(2)}
          </div>
          <div style={{ color: '#666' }}>Avg Monthly Revenue</div>
        </div>
        
        <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
            ${stats.coach_price}
          </div>
          <div style={{ color: '#666' }}>Price per Month</div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>📈 Monthly Revenue</h4>
        <div style={{ display: 'flex', alignItems: 'end', height: '200px', gap: '2px', padding: '1rem 0' }}>
          {stats.monthly_data.map((month, index) => (
            <div key={month.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: `${(month.amount / maxAmount) * 150}px`,
                  backgroundColor: month.amount > 0 ? '#28a745' : '#e9ecef',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px'
                }}
                title={`${month.month}: $${month.amount}`}
              />
              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', transform: 'rotate(-45deg)' }}>
                {month.month.slice(-2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Subscriptions Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>👥 Monthly Subscriptions</h4>
        <div style={{ display: 'flex', alignItems: 'end', height: '200px', gap: '2px', padding: '1rem 0' }}>
          {stats.monthly_data.map((month, index) => (
            <div key={month.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: '100%',
                  height: `${(month.months_paid / maxMonths) * 150}px`,
                  backgroundColor: month.months_paid > 0 ? '#007bff' : '#e9ecef',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px'
                }}
                title={`${month.month}: ${month.months_paid} months`}
              />
              <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px', transform: 'rotate(-45deg)' }}>
                {month.month.slice(-2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stability Indicator */}
      <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>📊 Coach Stability</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              backgroundColor: '#e9ecef', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${Math.min((stats.avg_monthly_revenue / stats.coach_price) * 100, 100)}%`,
                height: '100%',
                backgroundColor: stats.avg_monthly_revenue > stats.coach_price ? '#28a745' : '#ffc107',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            {stats.avg_monthly_revenue > stats.coach_price ? 'Stable' : 'Growing'}
          </div>
        </div>
        <small style={{ color: '#666' }}>
          Based on average monthly revenue vs. price per month
        </small>
      </div>
    </div>
  );
}

export default PaymentChart; 