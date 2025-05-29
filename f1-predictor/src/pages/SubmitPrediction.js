import { useState } from 'react';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles';

const SubmitPrediction = () => {
  const [raceId, setRaceId] = useState('');
  const [prediction, setPrediction] = useState({ p1: '', p2: '', p3: '' });
  const [status, setStatus] = useState('');

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

      <input
        placeholder="Race ID"
        value={raceId}
        onChange={(e) => setRaceId(e.target.value)}
        style={submitStyles.input}
      />
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
