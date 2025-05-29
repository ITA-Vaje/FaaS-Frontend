// src/pages/AddRace.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import submitStyles from '../styles/SubmitPredictionStyles';

const AddRace = () => {
  const [formData, setFormData] = useState({
    raceName: '',
    raceDate: '',
    location: '',
    round: ''
  });

  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('Submitting...');

    try {
      const token = await auth.currentUser.getIdToken();

      const raceData = {
        raceName: formData.raceName,
        raceDate: new Date(formData.raceDate),
        location: formData.location || null,
        round: formData.round || null,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5001/faas-ita/us-central1/addRace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(raceData)
      });

      if (!response.ok) throw new Error('Failed to add race.');
      setStatus('Race successfully added!');
      navigate('/');
    } catch (err) {
      setError(err.message);
      setStatus('');
    }
  };

  return (
    <div style={submitStyles.container}>
      <h2 style={submitStyles.heading}>Add New Race</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="raceName"
          placeholder="Race Name"
          value={formData.raceName}
          onChange={handleChange}
          style={submitStyles.input}
          required
        />
        <input
          type="date"
          name="raceDate"
          placeholder="Race Date"
          value={formData.raceDate}
          onChange={handleChange}
          style={submitStyles.input}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          style={submitStyles.input}
        />
        <input
          type="number"
          name="round"
          placeholder="Round"
          value={formData.round}
          onChange={handleChange}
          style={submitStyles.input}
        />
        <button type="submit" style={submitStyles.button}>Add Race</button>
      </form>
      {error && <p style={{ ...submitStyles.status, color: 'red' }}>{error}</p>}
      {status && !error && <p style={submitStyles.status}>{status}</p>}
    </div>
  );
};

export default AddRace;
