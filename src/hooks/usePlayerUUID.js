import { useState } from 'react';

export function usePlayerUUID() {
  const [account, setAccount] = useState(null);
  const [summoner, setSummoner] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [matches, setMatches] = useState([]);
  const [heartsteelCount, setHeartsteelCount] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data.json`);
      if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
      const data = await res.json();

      setAccount(data.account);
      setSummoner(data.summoner);
      setRanked(data.ranked);
      setMatches(data.matches);
      setHeartsteelCount(data.heartsteelCount);
      setFetchedAt(data.fetchedAt);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { account, summoner, ranked, matches, heartsteelCount, fetchedAt, loading, error, fetchData };
}
