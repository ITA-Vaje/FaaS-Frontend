import { useEffect, useState } from 'react';
import leaderboardStyles from '../styles/LeaderboardStyles';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const loadScores = async () => {
      const res = await fetch(
        'http://localhost:5001/faas-ita/us-central1/getLeaderboard'
      );
      const data = await res.json();
      setScores(data);
    };
    loadScores();
  }, []);

  return (
    <div style={leaderboardStyles.container}>
      <h2 style={leaderboardStyles.heading}>Leaderboard</h2>
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
              <td>{s.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
