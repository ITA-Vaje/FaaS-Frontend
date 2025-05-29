import { useEffect, useState } from 'react';
import leaderboardStyles from '../styles/LeaderboardStyles';
import { getAuth } from 'firebase/auth';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError("User not authenticated");
          return;
        }

        const idToken = await user.getIdToken();

        const res = await fetch(
          'http://localhost:5001/faas-ita/us-central1/getLeaderboard',
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        setScores(data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
      }
    };

    loadScores();
  }, []);

  return (
    <div style={leaderboardStyles.container}>
      <h2 style={leaderboardStyles.heading}>Leaderboard</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={leaderboardStyles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User ID</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, index) => (
              <tr key={s.uid}>
                <td>{index + 1}</td>
                <td>{s.uid}</td>
                <td>{s.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
