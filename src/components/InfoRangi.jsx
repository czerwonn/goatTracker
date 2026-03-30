import { getRankIconUrl } from '../api/riot';

export default function InfoRangi({ ranked }) {
  const soloQueue = ranked.find((q) => q.queueType === 'RANKED_SOLO_5x5');
  const flexQueue = ranked.find((q) => q.queueType === 'RANKED_FLEX_SR');

  return (
    <div className="ranked-info">
      {soloQueue && <RankedBadge label="Solo/Duo" data={soloQueue} />}
      {flexQueue && <RankedBadge label="Flex" data={flexQueue} />}
      {!soloQueue && !flexQueue && (
        <p className="unranked">Brak danych rankingowych</p>
      )}
    </div>
  );
}

function RankedBadge({ label, data }) {
  const winrate = ((data.wins / (data.wins + data.losses)) * 100).toFixed(1);

  return (
    <div className="ranked-badge">
      <img
        src={getRankIconUrl(data.tier)}
        alt={data.tier}
        className="rank-icon"
      />
      <h3>{label}</h3>
      <div className="rank">
        {data.tier} {data.rank} - {data.leaguePoints} LP
      </div>
      <div className="winrate">
        {data.wins}W / {data.losses}L ({winrate}%)
      </div>
    </div>
  );
}
