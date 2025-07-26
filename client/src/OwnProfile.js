import React, { useEffect, useState } from 'react';
import './App.css';

export const OwnProfile = () => {
    const [data, setData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = sessionStorage.getItem('user-mail');
                const res = await fetch('http://localhost:8000/home/own-profile?email=' + email);
                const json = await res.json();
                setData(json);
                setForm(json);
            } catch (error) {
                setMessage('Error fetching data');
            }
        };
        fetchData();
    }, []);

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
    const handleSave = async () => {
        try {
            const email = sessionStorage.getItem('user-mail');
            const res = await fetch('http://localhost:8000/home/own-profile?email=' + email, {
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
                setMessage(result.error || 'Update failed');
            }
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    if (!data || data.error) return <div>{data.error || 'Loading...'}</div>;

    // Profile fields for display and edit
    const fields = {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        city: 'City',
        state: 'State',
        zip: 'Zip',
        country: 'Country',
        domain: 'Domain',
        experience: 'Experience',
        location: 'Location',
        price: 'Price',
        rating: 'Rating',
        reviews: 'Reviews',
        availability: 'Availability',
        availability_days: 'Availability Days',
        
    };

    return (
        <div className="ownprofile-container">
            {/* Sidebar */}
            <div className="ownprofile-sidebar">
                <div className="ownprofile-sidebar-title">My Menu</div>
                <button
                    onClick={() => setEditMode(true)}
                    className={`ownprofile-sidebar-btn${editMode ? ' editing' : ''}`}
                    disabled={editMode}
                >
                    Edit Profile
                </button>
                {editMode && (
                    <button
                        onClick={handleCancel}
                        className="ownprofile-sidebar-btn cancel"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Main Profile Area */}
            <div className="ownprofile-main">
                <div className="ownprofile-card">
                    <div className="ownprofile-header">
                        <div className="ownprofile-avatar">
                            {/* Profile image or initials */}
                            {data.image ? (
                                <img src={data.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span>{data.name ? data.name[0].toUpperCase() : '?'}</span>
                            )}
                        </div>
                        <div className="ownprofile-header-info">
                            <div className="ownprofile-header-name">{data.name}</div>
                            <div className="ownprofile-header-email">{data.email}</div>
                            <div className="ownprofile-header-domain">{data.domain}</div>
                        </div>
                    </div>
                    {message && <div className={`ownprofile-message${message.includes('success') ? ' success' : ' error'}`}>{message}</div>}
                    {editMode ? (
                        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
                            {Object.entries(fields).map(([key, label]) => (
                                <div key={key} className="ownprofile-form-row">
                                    <label className="ownprofile-form-label">{label}:</label>
                                    {key === 'email' ? (
                                        <input name={key} value={form[key] || ''} disabled className="ownprofile-form-input" />
                                    ) : key === 'availability' ? (
                                        <input type="checkbox" name={key} checked={!!form[key]} disabled={!editMode} onChange={handleChange} />
                                    ) : key === 'description' ? (
                                        <textarea name={key} value={form[key] || ''} disabled={!editMode} onChange={handleChange} className="ownprofile-form-description" />
                                    ) : (
                                        <input name={key} value={form[key] || ''} disabled={!editMode} onChange={handleChange} className="ownprofile-form-input" />
                                    )}
                                </div>
                            ))}
                            <button type="submit" className="ownprofile-form-btn">Save</button>
                        </form>
                    ) : (
                        <div>
                            {Object.entries(fields).map(([key, label]) => (
                                <div key={key} className="ownprofile-form-row" style={{ display: key === 'description' ? 'block' : 'flex', alignItems: 'center' }}>
                                    <div className="ownprofile-form-label" style={{ color: '#636e72' }}>{label}:</div>
                                    <div className={key === 'description' ? 'ownprofile-form-description' : ''} style={key === 'description' ? {} : { fontSize: 17, color: '#2d3436', marginLeft: 12, width: 320 }}>
                                        {key === 'availability' ? (data[key] ? 'Available' : 'Not Available') : data[key]}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
