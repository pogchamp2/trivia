"use client"

type LeaderboardEntry = {
  name: string;
  correct: number;
  wrong: number;
};

type UserScore = {
  correct: number;
  wrong: number;
};

type ResultProps = {
  user: UserScore | null;
  leaderboard: LeaderboardEntry[] | null;
  showResults: boolean;
};

export const Result: React.FC<ResultProps> = ({ user, leaderboard, showResults }) => {
  if (!showResults) return null;

  return (
    <div id="result" className="result">
      {user && (
        <>
          <h2>Your Score:</h2>
          <p>Correct: {user.correct}, Wrong: {user.wrong}</p>
        </>
      )}
      {leaderboard && (
        <>
          <h2>Leaderboard:</h2>
          {leaderboard.map((entry, index) => (
            <p key={index}>
              {index + 1}. {entry.name} - Correct: {entry.correct}, Wrong: {entry.wrong}
            </p>
          ))}
        </>
      )}
    </div>
  );
};
