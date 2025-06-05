import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles';

const AdminSubmitResults = () => {
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [raceId, setRaceId] = useState('');
  const [results, setResults] = useState({ p1: '', p2: '', p3: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();

          // Fetch races
          const racesRes = await fetch(
            'http://localhost:5001/faas-ita/us-central1/getRaces',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const racesData = await racesRes.json();
          if (racesRes.ok) {
            setRaces(racesData.races || []);
          } else {
            console.error(racesData.error || 'Failed to fetch races');
          }

          // Fetch drivers
          const driversRes = await fetch(
            'http://localhost:5001/faas-ita/us-central1/getDrivers',
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const driversData = await driversRes.json();
          if (driversRes.ok) {
            setDrivers(driversData.drivers || []);
          } else {
            console.error(driversData.error || 'Failed to fetch drivers');
          }
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

    const handleSubmit = async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        const idToken = await user.getIdToken();

        const res = await fetch(
        'http://localhost:5001/faas-ita/us-central1/updateRaceResult',
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ raceId, result: results }), // ✅ FIXED HERE
        }
        );

        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
            setStatus('✅ Race results submitted!');
            setRaceId('');
            setResults({ p1: '', p2: '', p3: '' });
        } else {
            setStatus(`❌ ${data.error || 'Error submitting results'}`);
        }
        } else {
        // Non-JSON response (probably an error message)
        const text = await res.text();
        setStatus(`❌ Server error: ${text}`);
        }
    } catch (err) {
        setStatus(`❌ ${err.message}`);
    }
    };


  return (
    <div style={submitStyles.container}>
      <h2 style={submitStyles.heading}>Submit Race Results</h2>

      {/* Race select */}
      <select
        value={raceId}
        onChange={(e) => setRaceId(e.target.value)}
        style={submitStyles.input}
      >
        <option value="">Select a race</option>
        {races.map((race) => {
          const date =
            race.raceDate && typeof race.raceDate._seconds === 'number'
              ? new Date(race.raceDate._seconds * 1000)
              : new Date(race.raceDate);

          return (
            <option key={race.id} value={race.id}>
              {race.raceName} ({isNaN(date) ? 'Invalid Date' : date.toLocaleDateString()})
            </option>
          );
        })}
      </select>

      {/* Results driver selects */}
      {['p1', 'p2', 'p3'].map((pos) => (
        <select
          key={pos}
          value={results[pos]}
          onChange={(e) => setResults({ ...results, [pos]: e.target.value })}
          style={submitStyles.input}
        >
          <option value="">Select {pos.toUpperCase()} Driver</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>
      ))}

      <button onClick={handleSubmit} style={submitStyles.button}>
        Submit Results
      </button>

      {status && <p style={submitStyles.status}>{status}</p>}
    </div>
  );
};

export default AdminSubmitResults;
