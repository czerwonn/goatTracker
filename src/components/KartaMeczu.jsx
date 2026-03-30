import { getChampionIconUrl, getItemIconUrl, getSummonerSpellIconUrl } from '../api/riot';

export default function KartaMeczu({ match, puuid }) {
  const participant = match.info.participants.find((p) => p.puuid === puuid);
  if (!participant) return null;

  const win = participant.win;
  const kda = `${participant.kills}/${participant.deaths}/${participant.assists}`;
  const kdaRatio =
    participant.deaths === 0
      ? 'Perfect'
      : ((participant.kills + participant.assists) / participant.deaths).toFixed(2);
  const cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
  const gameDuration = Math.floor(match.info.gameDuration / 60);
  const csPerMin = (cs / (match.info.gameDuration / 60)).toFixed(1);

  const items = [
    participant.item0,
    participant.item1,
    participant.item2,
    participant.item3,
    participant.item4,
    participant.item5,
    participant.item6,
  ];

  const queueNames = {
    420: 'Rankingowa Solo/Duo',
    440: 'Rankingowa Flex',
    400: 'Normal Draft',
    430: 'Normal Blind',
    450: 'ARAM',
  };
  const queueName = queueNames[match.info.queueId] || 'Inny tryb';

  const timeAgo = getTimeAgo(match.info.gameEndTimestamp);

  return (
    <div className={`match-card ${win ? 'win' : 'loss'}`}>
      <div className="match-champion">
        <img
          src={getChampionIconUrl(participant.championName)}
          alt={participant.championName}
          className="champion-icon"
        />
        <div className="summoner-spells">
          <img src={getSummonerSpellIconUrl(participant.summoner1Id)} alt="spell1" className="spell-icon" />
          <img src={getSummonerSpellIconUrl(participant.summoner2Id)} alt="spell2" className="spell-icon" />
        </div>
      </div>

      <div className="match-stats">
        <div className="kda">
          <span className="kda-score">{kda}</span>
          <span className="kda-ratio"> {kdaRatio} KDA</span>
        </div>
        <div className="cs">
          {cs} CS ({csPerMin}/min)
        </div>
      </div>

      <div className="match-items">
        {items.map((item, i) => (
          <span key={i} className="item-slot">
            {item ? (
              <img src={getItemIconUrl(item)} alt={`item ${item}`} className="item-icon" />
            ) : (
              <span className="empty-item" />
            )}
          </span>
        ))}
      </div>

      <div className="match-meta">
        <span className={`result ${win ? 'win' : 'loss'}`}>
          {win ? 'Wygrana' : 'Przegrana'}
        </span>
        <span className="queue">{queueName}</span>
        <span className="duration">{gameDuration} min</span>
        <span className="time-ago">{timeAgo}</span>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} dni temu`;
  if (hours > 0) return `${hours} godz. temu`;
  return `${minutes} min temu`;
}
