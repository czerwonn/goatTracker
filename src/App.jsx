import { useEffect, useRef, useState } from 'react';
import InfoRangi from './components/InfoRangi';
import HistoriaMeczow from './components/HistoriaMeczow';
import TrackerHeartsteel from './components/TrackerHeartsteel';
import TrackerMordekaiser from './components/TrackerMordekaiser';
import SekretnaSiatka from './components/SekretnaSiatka';
import Stopka from './components/Stopka';
import { usePlayerUUID } from './hooks/usePlayerUUID';
import './App.css';

function App() {
  const {
    account,
    summoner,
    ranked,
    matches,
    heartsteelCount,
    mordeLosses,
    fetchedAt,
    loading,
    error,
    fetchData,
    fetchKokos,
  } = usePlayerUUID();
  const hasFetched = useRef(false);
  const [przejscie, setPrzejscie] = useState(false);
  const [kokosMode, setKokosMode] = useState(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, []);

  const odblokujKokosa = () => {
    setPrzejscie(true);
    setKokosMode(true);
    fetchKokos();
    setTimeout(() => setPrzejscie(false), 2000);
  };

  return (
    <div className="app">
      {przejscie && (
        <div className="przejscie-overlay">
          <div className="przejscie-glitch" data-tekst="drugi goat">
            drugi goat
          </div>
        </div>
      )}

      <aside className="sidebar-left">
        {ranked.length > 0 && <InfoRangi ranked={ranked} />}
        {kokosMode ? (
          <TrackerMordekaiser mordeLosses={mordeLosses} />
        ) : (
          <TrackerHeartsteel heartsteelCount={heartsteelCount} />
        )}
      </aside>

      <div className="main-content">
        <header className="app-header">
          <h1>GOAT Tracker</h1>
          {fetchedAt && (
            <span className="fetched-at">
              dane z{' '}
              {new Date(fetchedAt).toLocaleString('pl-PL', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </header>

        <main>
          {error && <div className="error">{error}</div>}

          {loading && <div className="loading">Ładowanie danych...</div>}

          {!loading && summoner && (
            <HistoriaMeczow matches={matches.slice(0, 10)} puuid={account?.puuid} />
          )}
        </main>

        <SekretnaSiatka onOdblokowanie={odblokujKokosa} />
      </div>

      <Stopka />
    </div>
  );
}

export default App;
