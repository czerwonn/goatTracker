import { getChampionIconUrl } from '../api/riot';

const CHAMPION = 'Mordekaiser';

export default function TrackerMordekaiser({ matches, puuid }) {
  const morde = (matches || [])
    .map((m) => m.info.participants.find((x) => x.puuid === puuid))
    .filter((p) => p && p.championName === CHAMPION);

  const przepierdolone = morde.filter((p) => !p.win).length;

  return (
    <div className="morde-tracker">
      <img
        src={getChampionIconUrl(CHAMPION)}
        alt="Mordekaiser"
        className="morde-icon"
      />
      <div className="morde-info">
        <span className="morde-label">przepierdolone gry na mordekaiserze</span>
        <span className="morde-count">{przepierdolone}</span>
        <span className="morde-sub">
          {morde.length > 0
            ? `na ${morde.length} gier morde (${matches.length} ostatnich meczów)`
            : 'brak gier na mordekaiserze'}
        </span>
      </div>
    </div>
  );
}
