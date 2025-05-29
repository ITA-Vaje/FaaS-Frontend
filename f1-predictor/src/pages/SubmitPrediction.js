import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles';

const SubmitPrediction = () => {
  const [raceId, setRaceId] = useState('');
  const [races, setRaces] = useState([]);
  const [prediction, setPrediction] = useState({ p1: '', p2: '', p3: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Listen to auth state changes
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
            setRaces(data.races || []); // <-- fix: data.races instead of data
          } else {
            console.error(data.error || 'Failed to fetch races');
          }
        } catch (err) {
          console.error('Error fetching races:', err);
        }
      } else {
        // No user logged in
        setRaces([]);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const idToken = await user.getIdToken();

      const res = await fetch(
        'http://localhost:5001/faas-ita/us-central1/submitPrediction',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ raceId, prediction }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Prediction submitted!');
      } else {
        setStatus(`❌ ${data.error || 'Error submitting prediction'}`);
      }
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div style={submitStyles.container}>
      <h2 style={submitStyles.heading}>Submit Your Race Prediction</h2>

      {/* Dropdown for race selection */}
      <select
        value={raceId}
        onChange={(e) => setRaceId(e.target.value)}
        style={submitStyles.input}
      >
        <option value="">Select a race</option>
        {races.map((race) => {
        console.log('raceDate raw:', race.raceDate);
        const date = race.raceDate?.toDate
                    ? race.raceDate.toDate()
                    : race.raceDate?.seconds
                    ? new Date(race.raceDate.seconds * 1000)
                    : new Date(race.raceDate);
        console.log('Parsed date:', date);

        return (
            <option key={race.id} value={race.id}>
            {race.raceName} ({isNaN(date) ? 'Invalid Date' : date.toLocaleDateString()})
            </option>
        );
        })}

      </select>

      <input
        placeholder="P1 Driver"
        value={prediction.p1}
        onChange={(e) => setPrediction({ ...prediction, p1: e.target.value })}
        style={submitStyles.input}
      />
      <input
        placeholder="P2 Driver"
        value={prediction.p2}
        onChange={(e) => setPrediction({ ...prediction, p2: e.target.value })}
        style={submitStyles.input}
      />
      <input
        placeholder="P3 Driver"
        value={prediction.p3}
        onChange={(e) => setPrediction({ ...prediction, p3: e.target.value })}
        style={submitStyles.input}
      />

      <button onClick={handleSubmit} style={submitStyles.button}>
        Submit Prediction
      </button>

      {status && <p style={submitStyles.status}>{status}</p>}
    </div>
  );
};

export default SubmitPrediction;
