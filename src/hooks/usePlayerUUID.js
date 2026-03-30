import { useState } from 'react';
import { getAccount, getSummoner, getRankedStats, getMatchIds, getMatchDetails, getHeartsteelCount } from '../api/riot';

export function usePlayerUUID() {
  const [account, setAccount] = useState(null);
  const [summoner, setSummoner] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [matches, setMatches] = useState([]);
  const [heartsteelCount, setHeartsteelCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (gameName, tagLine) => {
    if (!gameName || !tagLine) return;

    setLoading(true);
    setError(null);

    try {
      const acc = await getAccount(gameName, tagLine);
      setAccount(acc);

      const [summ, rankedData, matchIds] = await Promise.all([
        getSummoner(acc.puuid),
        getRankedStats(acc.puuid),
        getMatchIds(acc.puuid, 10),
      ]);

      setSummoner(summ);
      setRanked(rankedData);

      const matchDetails = await Promise.all(
        matchIds.map((id) => getMatchDetails(id))
      );
      setMatches(matchDetails);

      getHeartsteelCount(acc.puuid, 100).then((hs) => {
        setHeartsteelCount(hs);
      });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { account, summoner, ranked, matches, heartsteelCount, loading, error, fetchData };
}
