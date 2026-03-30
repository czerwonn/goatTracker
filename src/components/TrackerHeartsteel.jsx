import { getItemIconUrl } from '../api/riot';

const HEARTSTEEL_ID = 3084;

export default function TrackerHeartsteel({ heartsteelCount }) {
  return (
    <div className="heartsteel-tracker">
      <img
        src={getItemIconUrl(HEARTSTEEL_ID)}
        alt="Heartsteel"
        className="heartsteel-icon"
      />
      <div className="heartsteel-info">
        <span className="heartsteel-label">Heartsteel zbudowany</span>
        <span className="heartsteel-count">
          {heartsteelCount === null ? '...' : heartsteelCount.count} razy
        </span>
        <span className="heartsteel-sub">
          {heartsteelCount
            ? `w ostatnich ${heartsteelCount.matchesChecked} meczach`
            : 'liczenie...'}
        </span>
      </div>
    </div>
  );
}
