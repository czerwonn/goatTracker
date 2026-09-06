import { writeFileSync } from 'fs';
import { execSync } from 'child_process';

const API_KEY = process.env.RIOT_API_KEY;
const HEARTSTEEL_ID = 3084;
const MORDEKAISER = 'Mordekaiser';

const PLAYERS = [
  { gameName: 'Tilis', tagLine: 'PLEU', matchCount: 100, out: 'data.json' },
  { gameName: 'kokos2008', tagLine: 'huko', matchCount: 20, out: 'kokos.json' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function riotFetch(url) {
  const res = await fetch(url, {
    headers: { 'X-Riot-Token': API_KEY },
  });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') || '5');
    console.log(`Rate limited, waiting ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return riotFetch(url);
  }

  if (!res.ok) {
    throw new Error(`Riot API ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

async function fetchPlayer({ gameName, tagLine, matchCount }) {
  console.log(`Fetching data for ${gameName}#${tagLine}...`);

  const account = await riotFetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`
  );
  console.log('Account:', account.puuid.substring(0, 20) + '...');

  await sleep(100);

  const summoner = await riotFetch(
    `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`
  );
  console.log('Summoner level:', summoner.summonerLevel);

  await sleep(100);

  const ranked = await riotFetch(
    `https://eun1.api.riotgames.com/lol/league/v4/entries/by-puuid/${account.puuid}`
  );
  console.log('Ranked queues:', ranked.length);

  await sleep(100);

  const matchIds = await riotFetch(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${account.puuid}/ids?count=${matchCount}`
  );
  console.log('Match IDs:', matchIds.length);

  const matches = [];
  let heartsteelCount = 0;
  let mordeLosses = 0;

  for (let i = 0; i < matchIds.length; i++) {
    await sleep(1300);
    try {
      const match = await riotFetch(
        `https://europe.api.riotgames.com/lol/match/v5/matches/${matchIds[i]}`
      );
      matches.push(match);

      const participant = match.info.participants.find((p) => p.puuid === account.puuid);
      if (participant) {
        const items = [
          participant.item0, participant.item1, participant.item2,
          participant.item3, participant.item4, participant.item5, participant.item6,
        ];
        if (items.includes(HEARTSTEEL_ID)) heartsteelCount++;
        if (participant.championName === MORDEKAISER && !participant.win) mordeLosses++;
      }

      console.log(`Match ${i + 1}/${matchIds.length} fetched`);
    } catch (err) {
      console.log(`Match ${i + 1} failed: ${err.message}`);
    }
  }

  console.log(`${gameName}: Heartsteel ${heartsteelCount}, Morde losses ${mordeLosses} / ${matchIds.length}`);

  return {
    fetchedAt: new Date().toISOString(),
    account,
    summoner,
    ranked,
    matches: matches.slice(0, 10),
    heartsteelCount: { count: heartsteelCount, matchesChecked: matchIds.length },
    mordeLosses: { count: mordeLosses, matchesChecked: matchIds.length },
  };
}

async function main() {
  const results = [];
  for (const player of PLAYERS) {
    results.push([player.out, await fetchPlayer(player)]);
  }

  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  for (const [out, data] of results) {
    writeFileSync(`dist/${out}`, JSON.stringify(data));
  }
  writeFileSync('dist/CNAME', 'goat.czerw.dev');
  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
