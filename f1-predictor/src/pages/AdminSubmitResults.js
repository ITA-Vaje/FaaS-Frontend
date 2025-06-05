import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles';

const AdminSubmitResults = () => {
  const [races, setRaces] = useState([]);
  const [raceId, setRaceId] = useState('');
  const [results, setResults] = useState({ p1: '', p2: '', p3: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();

          const res = await fetch(
            'http://localhost:5001/faas-ita/us-central1/getRaces',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();
          if (res.ok) {
            setRaces(data.races || []);
          } else {
            console.error(data.error || 'Failed to fetch races');
          }
        } catch (err) {
          console.error('Error fetching races:', err);
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
          body: JSON.stringify({ raceId, results }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Race results submitted!');
      } else {
        setStatus(`❌ ${data.error || 'Error submitting results'}`);
      }
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div style={submitStyles.container}>
      <h2 style={submitStyles.heading}>Submit Race Results</h2>

      <select
        value={raceId}
        onChange={(e) => setRaceId(e.target.value)}
        style={submitStyles.input}
      >
        <option value="">Select a race</option>
        {races.map((race) => {
          const date = race.raceDate && typeof race.raceDate._seconds === 'number'
            ? new Date(race.raceDate._seconds * 1000)
            : new Date(race.raceDate);

          return (
            <option key={race.id} value={race.id}>
              {race.raceName} ({isNaN(date) ? 'Invalid Date' : date.toLocaleDateString()})
            </option>
          );
        })}
      </select>

      <input
        placeholder="P1 Driver"
        value={results.p1}
        onChange={(e) => setResults({ ...results, p1: e.target.value })}
        style={submitStyles.input}
      />
      <input
        placeholder="P2 Driver"
        value={results.p2}
        onChange={(e) => setResults({ ...results, p2: e.target.value })}
        style={submitStyles.input}
      />
      <input
        placeholder="P3 Driver"
        value={results.p3}
        onChange={(e) => setResults({ ...results, p3: e.target.value })}
        style={submitStyles.input}
      />

      <button onClick={handleSubmit} style={submitStyles.button}>
        Submit Results
      </button>

      {status && <p style={submitStyles.status}>{status}</p>}
    </div>
  );
};

export default AdminSubmitResults;
