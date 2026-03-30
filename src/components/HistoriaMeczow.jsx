import KartaMeczu from './KartaMeczu';

export default function HistoriaMeczow({ matches, puuid }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div className="match-history">
      <h2>ostatnie 10 meczów bestii summoner's rifta</h2>
      <div className="match-list">
        {matches.map((match) => (
          <KartaMeczu key={match.metadata.matchId} match={match} puuid={puuid} />
        ))}
      </div>
    </div>
  );
}
