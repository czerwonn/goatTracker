import { useState } from 'react';
import {
  getAccount,
  getSummoner,
  getRankedStats,
  getMatchIds,
  getMatchDetails,
} from '../api/riot';

const HEARTSTEEL_ID = 3084;

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  const worker = async () => {
    while (idx < items.length) {
      const cur = idx++;
      results[cur] = await fn(items[cur], cur);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export function usePlayerUUID() {
  const [account, setAccount] = useState(null);
  const [summoner, setSummoner] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [matches, setMatches] = useState([]);
  const [heartsteelCount, setHeartsteelCount] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyLive = async (gameName, tagLine, matchCount) => {
    const acc = await getAccount(gameName, tagLine);

    const [summ, rank, matchIds] = await Promise.all([
      getSummoner(acc.puuid),
      getRankedStats(acc.puuid),
      getMatchIds(acc.puuid, matchCount),
    ]);

    const details = await mapLimit(matchIds, 4, (id) =>
      getMatchDetails(id).catch(() => null)
    );
    const matchDetails = details.filter(Boolean);

    const hsCount = matchDetails.filter((m) => {
      const p = m.info.participants.find((x) => x.puuid === acc.puuid);
      if (!p) return false;
      return [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].includes(
        HEARTSTEEL_ID
      );
    }).length;

    setAccount(acc);
    setSummoner(summ);
    setRanked(rank);
    setMatches(matchDetails);
    setHeartsteelCount({ count: hsCount, matchesChecked: matchDetails.length });
    setFetchedAt(Date.now());
  };

  const fetchLive = async (gameName, tagLine, matchCount = 20) => {
    setLoading(true);
    setError(null);
    try {
      await applyLive(gameName, tagLine, matchCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}data.json`);
      const contentType = res.headers.get('content-type') || '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        setAccount(data.account);
        setSummoner(data.summoner);
        setRanked(data.ranked);
        setMatches(data.matches);
        setHeartsteelCount(data.heartsteelCount);
        setFetchedAt(data.fetchedAt);
        return;
      }

      await applyLive('Tilis', 'EUPL', 10);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    account,
    summoner,
    ranked,
    matches,
    heartsteelCount,
    fetchedAt,
    loading,
    error,
    fetchData,
    fetchLive,
  };
}
