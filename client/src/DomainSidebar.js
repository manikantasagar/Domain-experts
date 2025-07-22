import React from 'react';

function DomainSidebar({ domains, selectedDomain, setSelectedDomain }) {
  return (
    <aside className="sidebar">
      <h3>Domains</h3>
      <ul className="domain-list">
        {domains.map(domain => (
          <li key={domain}>
            <button
              onClick={() => setSelectedDomain(domain)}
              className={`domain-btn${selectedDomain === domain ? ' selected' : ''}`}
            >
              {domain}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default DomainSidebar; 