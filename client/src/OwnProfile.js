import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import PaymentChart from './PaymentChart';

export const OwnProfile = () => {
    const [data, setData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentChart, setShowPaymentChart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated and is a coach
        const userEmail = sessionStorage.getItem('user-mail');
        const userType = sessionStorage.getItem('user-type');
        
        if (!userEmail) {
            navigate('/logins');
            return;
        }
        
        if (userType !== 'coach') {
            navigate('/user-profile');
            return;
        }

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/own-profile?email=` + userEmail);
                const json = await res.json();
                setData(json);
                console.log(json.image);
                setForm(json);
            } catch (error) {
                setMessage('Error fetching data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setEditMode(false);
        setForm(data);
        setMessage('');
    };
    
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const email = sessionStorage.getItem('user-mail');
            
            // Create FormData if there's an image to upload
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);
                // Append other form data
                Object.keys(form).forEach(key => {
                    formData.append(key, form[key]);
                });

                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/own-profile?email=${email}`, {
                    method: 'POST',
                    body: formData, // Send as FormData
                });
                const result = await res.json();
                if (result.success) {
                    setData({ ...form, image: result.image });
                    setEditMode(false);
                    setMessage('Profile updated successfully!');
                    setSelectedImage(null);
                    setImagePreview(null);
                } else {
                    console.error(result);
                    setMessage(result.error || 'Update failed');
                }
            } else {
                // If no image to upload, proceed with regular update
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/home/own-profile?email=${email}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                });
                const result = await res.json();
                if (result.success) {
                    setData(form);
                    setEditMode(false);
                    setMessage('Profile updated successfully!');
                } else {
                    console.error(result);
                    setMessage(result.error || 'Update failed');
                }
            }
        } catch (error) {
            setMessage('Error updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !data.name) {
        return (
            <div className="ownprofile-container">
                <div className="ownprofile-main">
                    <div className="ownprzofile-card">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '24px', color: '#667eea', marginBottom: '20px' }}>Loading...</div>
                            <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data || data.error) return <div>{data.error || 'Loading...'}</div>;

    // Profile fields for display and edit
    const fields = {
        
        phone: 'Phone',
        address: 'Address',
        location: 'Location',
        price: 'Price',
        availability: 'Availability',
        availability_days: 'Availability Days',
        
    };

    // Icons for different field types
    const getFieldIcon = (fieldName) => {
        const icons = {
            phone: '📞',
            address: '📍',
            location: '🗺️',
            price: '💰',
            availability: '📅',
            availability_days: '📆',
        };
        return icons[fieldName] || '📋';
    };

    return (
        <div className="ownprofile-container">
            {/* Sidebar */}
            <div className="ownprofile-sidebar">
                <div className="ownprofile-sidebar-title">My Profile</div>
                <button
                    onClick={() => setEditMode(true)}
                    className={`ownprofile-sidebar-btn${editMode ? ' editing' : ''}`}
                    disabled={editMode}
                >
                    {editMode ? '🔄 Editing...' : '✏️ Edit Profile'}
                </button>
                {editMode && (
                    <button
                        onClick={handleCancel}
                        className="ownprofile-sidebar-btn cancel"
                    >
                        ❌ Cancel
                    </button>
                )}
                <button
                    onClick={() => {
                        sessionStorage.clear();
                        navigate('/logins');
                    }}
                    className="ownprofile-sidebar-btn"
                    style={{ backgroundColor: '#dc3545', marginTop: 'auto' }}
                >
                    🚪 Logout
                </button>
            </div>

            {/* Main Profile Area */}
            <div className="ownprofile-main">
                <div className="ownprofile-card">
                    <div className="ownprofile-header">
                        <div className="ownprofile-avatar">
                            {/* Profile image or initials */}
                            {editMode ? (
                                <label className="profile-image-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="profile-image-input"
                                    />
                                    {console.log(data.image)}
                                    <img 
                                        src={`${data.image}` }
                                        alt="Profile"
                                        className="profile-image"
                                    />
                                    <div className="image-upload-overlay">
                                        <span>Change Photo</span>
                                    </div>
                                </label>
                            ) : (
                                <img 
                                    src={`${data.image}` }
                                    alt="Profile"
                                    className="profile-image"
                                   
                                />
                            )}
                        </div>
                        <div className="ownprofile-header-info">
                            <div className="ownprofile-header-name">{data.name || 'Your Name'}</div>
                            <div className="ownprofile-header-email">{data.email || 'your.email@example.com'}</div>
                            <div className="ownprofile-header-domain">{data.domain || 'Your Domain'}</div>
                            <div className="ownprofile-header-rating">{data.rating || '0'}</div>
                        </div>
                    </div>
                    
                    {message && (
                        <div className={`ownprofile-message${message.includes('success') ? ' success' : ' error'}`}>
                            {message.includes('success') ? '✅' : '❌'} {message}
                        </div>
                    )}
                    
                    {editMode ? (
                        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                            {Object.entries(fields).map(([key, label]) => (
                                <div key={key} className="ownprofile-form-row">
                                    <label className="ownprofile-form-label">
                                        {getFieldIcon(key)} {label}:
                                    </label>
                                    { key === 'availability' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <input 
                                                type="checkbox" 
                                                name={key} 
                                                checked={!!form[key]} 
                                                disabled={!editMode} 
                                                onChange={handleChange} 
                                            />
                                            <span style={{ color: '#718096' }}>Available for coaching</span>
                                        </div>
                                    ) : key === 'description' ? (
                                        <textarea 
                                            name={key} 
                                            value={form[key] || ''} 
                                            disabled={!editMode} 
                                            onChange={handleChange} 
                                            className="ownprofile-form-description"
                                            placeholder={`Enter your ${label.toLowerCase()}`}
                                        />
                                    ) : (
                                        <input 
                                            name={key} 
                                            value={form[key] || ''} 
                                            disabled={!editMode} 
                                            onChange={handleChange} 
                                            className="ownprofile-form-input"
                                            placeholder={`Enter your ${label.toLowerCase()}`}
                                        />
                                    )}
                                </div>
                            ))}
                            <button 
                                type="submit" 
                                className="ownprofile-form-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? '⏳ Saving...' : '💾 Save Changes'}
                            </button>
                        </form>
                    ) : (
                        <div>
                            {Object.entries(fields).map(([key, label]) => (
                                <div key={key} className={`ownprofile-form-row ${key === 'description' ? 'description-mode' : 'display-mode'}`}>
                                    <div className={`ownprofile-form-label ${key !== 'description' ? 'display-mode' : ''}`}>
                                        {getFieldIcon(key)} {label}:
                                    </div>
                                    <div className={key === 'description' ? 'ownprofile-form-description' : 'ownprofile-form-description display-mode'}>
                                        {key === 'availability' ? (data[key] ? '✅ Available' : '❌ Not Available') : data[key] || 'Not specified'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Payment Statistics Section */}
                {/* <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#333', margin: 0 }}>💰 Payment Statistics</h3>
                        <button 
                            onClick={() => setShowPaymentChart(!showPaymentChart)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            {showPaymentChart ? 'Hide Chart' : 'Show Chart'}
                        </button>
                    </div>
                    {showPaymentChart && data.id && <PaymentChart coachId={data.id} />}
                </div> */}
            </div>
        </div>
    );
};

