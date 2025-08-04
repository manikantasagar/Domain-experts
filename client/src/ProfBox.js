import { useEffect, useState } from 'react';
import DomainSidebar from './DomainSidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function ProfBox({ coaches }) {

  // let token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  let[token,setToken]=useState(sessionStorage.getItem('token'));
  useEffect(() => {
  const interval = setInterval(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      clearInterval(interval); // ✅ stop interval once token is found
    }
  }, 1000); // check every 500ms (or as needed)

  return () => clearInterval(interval); // cleanup if component unmounts
}, []);

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
            <div id='log-sign-buttons'>
              <button id="ai-button" onClick={() => navigate('/ai')}>AI</button>
              {!token && <Link to='/signup'><button id="signbut">signup</button></Link>}
              {!token && <Link to='/logins'><button id="logbut">login</button></Link>}
              {token && <Link to='/profile'><button >Profile</button></Link>}
            
            
            </div>
      </header>
        {/* <Link to="/chat" className="chat-link">Chat</Link> */}
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
                  <Link to= "/profile"  state={{coach }} >
                    {/* {console.log(coach)} */}
                    {console.log(coach.image)}
                    <img src={`${process.env.REACT_APP_SERVER_URL}/${coach.image}`} alt={coach.name} />
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