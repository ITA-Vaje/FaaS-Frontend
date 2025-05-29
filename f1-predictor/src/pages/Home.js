// src/pages/Home.js
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

const Home = () => {
  const logout = () => {
    auth.signOut().then(() => alert('Logged out!'));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🏁 F1 Prediction App</h1>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/submit">Submit Prediction</Link>
        <Link style={styles.link} to="/leaderboard">View Leaderboard</Link>
      </nav>

      <button style={styles.button} onClick={logout}>Logout</button>
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
