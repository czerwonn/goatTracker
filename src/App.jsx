import { useEffect, useRef } from 'react';
import InfoRangi from './components/InfoRangi';
import HistoriaMeczow from './components/HistoriaMeczow';
import TrackerHeartsteel from './components/TrackerHeartsteel';
import Stopka from './components/Stopka';
import { usePlayerUUID } from './hooks/usePlayerUUID';
import './App.css';

function App() {
  const { account, summoner, ranked, matches, heartsteelCount, fetchedAt, loading, error, fetchData } =
    usePlayerUUID();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchData();
    }
  }, []);

  return (
    <div className="app">
      <aside className="sidebar-left">
        {ranked.length > 0 && <InfoRangi ranked={ranked} />}
        <TrackerHeartsteel heartsteelCount={heartsteelCount} />
      </aside>

      <div className="main-content">
        <header className="app-header">
          <h1>GOAT Tracker</h1>
          {fetchedAt && (
            <span className="fetched-at">
              dane z {new Date(fetchedAt).toLocaleDateString('pl-PL')}
            </span>
          )}
        </header>

        <main>
          {error && <div className="error">{error}</div>}

          {loading && <div className="loading">Ładowanie danych...</div>}

          {!loading && summoner && (
            <HistoriaMeczow matches={matches} puuid={account?.puuid} />
          )}
        </main>
      </div>

      <Stopka />
    </div>
  );
}

export default App;
