import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles';

const SubmitPrediction = () => {
  const [raceId, setRaceId] = useState('');
  const [races, setRaces] = useState([]);
  const [prediction, setPrediction] = useState({ p1: '', p2: '', p3: '' });
  const [status, setStatus] = useState('');
  const [drivers, setDrivers] = useState([]);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();

        try {
          const [racesRes, driversRes] = await Promise.all([
            fetch('http://localhost:5001/faas-ita/us-central1/getRaces', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('http://localhost:5001/faas-ita/us-central1/getDrivers', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const racesData = await racesRes.json();
          const driversData = await driversRes.json();

          if (racesRes.ok) setRaces(racesData.races || []);
          if (driversRes.ok) setDrivers(driversData.drivers || []);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      } else {
        setRaces([]);
        setDrivers([]);
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

      <select
        value={prediction.p1}
        onChange={(e) => setPrediction({ ...prediction, p1: e.target.value })}
        style={submitStyles.input}
      >
        <option value="">Select P1 Driver</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.team})
          </option>
        ))}
      </select>

      <select
        value={prediction.p2}
        onChange={(e) => setPrediction({ ...prediction, p2: e.target.value })}
        style={submitStyles.input}
      >
        <option value="">Select P2 Driver</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.team})
          </option> 
        ))}
      </select>

      <select
        value={prediction.p3}
        onChange={(e) => setPrediction({ ...prediction, p3: e.target.value })}
        style={submitStyles.input}
      >
        <option value="">Select P3 Driver</option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} ({d.team})
          </option>
        ))}
      </select>


      <button onClick={handleSubmit} style={submitStyles.button}>
        Submit Prediction
      </button>

      {status && <p style={submitStyles.status}>{status}</p>}
    </div>
  );
};

export default SubmitPrediction;
