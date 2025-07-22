import { useState } from 'react';
import DomainSidebar from './DomainSidebar';
import { Link } from 'react-router-dom';

function ProfBox({ coaches }) {
    const [search, setSearch] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('All');
    const domains = ['All', ...Array.from(new Set(coaches.map(c => c.domain)))];

    // Filter coaches by search and selected domain
    const filteredCoaches = coaches.filter(coach => {
      const matchesDomain = selectedDomain === 'All' || coach.domain === selectedDomain;
      const matchesSearch = coach.name.toLowerCase().includes(search.toLowerCase());
      return matchesDomain && matchesSearch;
    });
    return (
      <>
    <div className="app-container">
          {/* Search Bar */}
          
          
      <header className="app-header">
        <input
          type="text"
          placeholder="Search coaches..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
            />
      </header>
        <Link to="/chat" className="chat-link">Chat</Link>
      <div className="app-body">
        {/* Sidebar */}
        <DomainSidebar domains={domains} selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />
        {/* Main Content */}
        <main className="main-content">
          <h2>Coaches {selectedDomain !== 'All' && `in ${selectedDomain}`}</h2>
          {filteredCoaches.length === 0 ? (
            <p>No coaches found.</p>
          ) : (
            <div className="coaches-list">
              {filteredCoaches.map(coach => (
                <div key={coach.id} className="coach-card">
                  <h4>{coach.name}</h4>
                  <Link to={{ pathname: "/profile", state: {coach } }}>
                    {/* {console.log(coach)} */}
                    <img src={`http://localhost:8000/${coach.image}`} alt={coach.name} />
                  </Link>
                  <span className="coach-domain">{coach.domain}</span>
                  
            
                </div>
                
              ))}
            </div>
          )}
        </main>
      </div>
            </div>
        </>
    )
}

export default ProfBox;