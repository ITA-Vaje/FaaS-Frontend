// src/pages/Home.js
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
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
    user && (
      <div style={{ padding: '2rem' }}>
        <h1>Welcome, {user.email}!</h1>
        <p>Ready to make your prediction? Head over to the Predict tab!</p>
      </div>
    )
  );
};

export default Home;
