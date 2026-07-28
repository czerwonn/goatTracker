import { getChampionIconUrl } from '../api/riot';

export default function TrackerMordekaiser({ mordeLosses }) {
  return (
    <div className="morde-tracker">
      <img
        src={getChampionIconUrl('Mordekaiser')}
        alt="Mordekaiser"
        className="morde-icon"
      />
      <div className="morde-info">
        <span className="morde-label">przepierdolone gry na mordekaiserze</span>
        <span className="morde-count">
          {mordeLosses === null ? '...' : mordeLosses.count}
        </span>
        <span className="morde-sub">
          {mordeLosses
            ? `w ostatnich ${mordeLosses.matchesChecked} meczach`
            : 'liczenie...'}
        </span>
      </div>
    </div>
  );
}
