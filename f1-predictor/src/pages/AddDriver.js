import { useState } from 'react';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles'; // Reuse styles

const AddDriver = () => {
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      const idToken = await user.getIdToken();

      const res = await fetch(
        'http://localhost:5001/faas-ita/us-central1/addDriver',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ name, team, country }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Driver added successfully!');
        setName('');
        setTeam('');
        setCountry('');
      } else {
        setStatus(`❌ ${data.error || 'Error adding driver'}`);
      }
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div style={submitStyles.container}>
      <h2 style={submitStyles.heading}>Add New Driver</h2>
      <input
        style={submitStyles.input}
        placeholder="Driver Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={submitStyles.input}
        placeholder="Team"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
      />
      <input
        style={submitStyles.input}
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={handleSubmit} style={submitStyles.button}>
        Add Driver
      </button>
      {status && <p style={submitStyles.status}>{status}</p>}
    </div>
  );
};

export default AddDriver;
