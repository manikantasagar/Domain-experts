import React, { useState } from 'react';

function PaymentModal({ coach, isOpen, onClose, onPaymentSuccess }) {
  const [paymentData, setPaymentData] = useState({
    amount: coach?.price || 0,
    payment_method: 'bank'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userEmail = sessionStorage.getItem('user-mail');
      const userType = sessionStorage.getItem('user-type');
      
      if (userType !== 'user') {
        setError('Only users can make payments');
        return;
      }

      // In a real app, you'd get the user ID from the backend
      // For now, we'll use a placeholder
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/make-payment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coach_id: coach.id,
          user_id: 1, // This should be the actual user ID
          amount: parseFloat(paymentData.amount),
          payment_method: paymentData.payment_method
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(data.message);
        onPaymentSuccess(data);
        onClose();
      } else {
        setError(data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isFree = coach?.price === 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Payment for {coach?.name}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {isFree ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>🎉 Free Coaching!</h3>
            <p>This coach offers free coaching sessions.</p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem'
              }}
            >
              {loading ? 'Processing...' : 'Get Free Coaching'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Amount ($):</label>
              <input
                type="number"
                name="amount"
                value={paymentData.amount}
                onChange={handleInputChange}
                min={coach?.price}
                step={coach?.price}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <small>
                Price: ${coach?.price}/month. 
                {paymentData.amount > coach?.price && 
                  ` You'll get ${Math.floor(paymentData.amount / coach?.price)} month(s) of coaching.`
                }
              </small>
            </div>

                         <div style={{ marginBottom: '1rem' }}>
               <label>Payment Method:</label>
               <div style={{
                 padding: '8px',
                 marginTop: '4px',
                 border: '1px solid #ddd',
                 borderRadius: '4px',
                 backgroundColor: '#f8f9fa',
                 color: '#6c757d'
               }}>
                 Bank Transfer
               </div>
             </div>

            {error && (
              <div style={{ color: 'red', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default PaymentModal; 