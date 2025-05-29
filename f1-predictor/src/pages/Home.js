// src/pages/Home.js
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Home = () => {
  const [, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (!u) {
        navigate('/login'); // Redirect if not logged in
      }
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏁 F1 Prediction App</h1>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/submit">Submit Prediction</Link>
        <Link style={styles.link} to="/leaderboard">View Leaderboard</Link>
      </nav>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '3rem',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2rem',
  },
  link: {
    fontSize: '1.2rem',
    textDecoration: 'none',
    color: '#007bff',
    border: '1px solid #007bff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
  button: {
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};


export default Home;
