import { useState } from 'react';
import {
  getAccount,
  getSummoner,
  getRankedStats,
  getMatchIds,
  getMatchDetails,
} from '../api/riot';

const HEARTSTEEL_ID = 3084;
const MORDEKAISER = 'Mordekaiser';

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
  const [mordeLosses, setMordeLosses] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applySnapshot = (data) => {
    setAccount(data.account);
    setSummoner(data.summoner);
    setRanked(data.ranked);
    setMatches(data.matches);
    setHeartsteelCount(data.heartsteelCount);
    setMordeLosses(data.mordeLosses ?? null);
    setFetchedAt(data.fetchedAt);
  };

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

    const parts = matchDetails
      .map((m) => m.info.participants.find((x) => x.puuid === acc.puuid))
      .filter(Boolean);

    const hsCount = parts.filter((p) =>
      [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].includes(HEARTSTEEL_ID)
    ).length;
    const mordeCount = parts.filter((p) => p.championName === MORDEKAISER && !p.win).length;

    setAccount(acc);
    setSummoner(summ);
    setRanked(rank);
    setMatches(matchDetails);
    setHeartsteelCount({ count: hsCount, matchesChecked: matchDetails.length });
    setMordeLosses({ count: mordeCount, matchesChecked: matchDetails.length });
    setFetchedAt(Date.now());
  };

  const load = async (snapshotUrl, live) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(snapshotUrl);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        applySnapshot(await res.json());
        return;
      }
      await live();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = () =>
    load(`${import.meta.env.BASE_URL}data.json`, () => applyLive('Tilis', 'EUPL', 10));

  const fetchKokos = () =>
    load(`${import.meta.env.BASE_URL}kokos.json`, () => applyLive('kokos2008', 'huko', 20));

  return {
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
  };
}
