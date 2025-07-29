import './App.css';
import { useState, useEffect } from 'react';
import ProfBox from './ProfBox';

function App() {

  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/home/')
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