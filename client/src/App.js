import './App.css';
import { useState, useEffect } from 'react';
import ProfBox from './ProfBox';

function App() {

  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}home/`)
      .then(response => response.json())
      .then(data => setCoaches(data))
      .catch(error => console.error('Error fetching coaches:', error));
  }, []);
  console.log(coaches);
  // Dynamically get domains from fetched coaches

  return (
    <ProfBox coaches={coaches} />
  );
}

export default App;