// src/components/Navbar.js
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🏁 F1 Predictor</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/submit" style={styles.link}>Predict</Link>
        <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
        {user ? (
          <>
            <span style={styles.user}>{user.email}</span>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#111',
    color: 'white',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  user: {
    color: '#ccc',
    fontSize: '0.9rem',
  },
  button: {
    backgroundColor: '#444',
    color: 'white',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
