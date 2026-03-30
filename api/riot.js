const API_KEY = process.env.RIOT_API_KEY;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function riotFetch(url) {
  const res = await fetch(url, {
    headers: { 'X-Riot-Token': API_KEY },
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: `Riot API error ${res.status}: ${text}` }), {
      status: res.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(req.url, 'http://localhost');
  const action = url.searchParams.get('action');

  if (action === 'account') {
    const gameName = url.searchParams.get('gameName');
    const tagLine = url.searchParams.get('tagLine');
    return riotFetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
  }

  if (action === 'summoner') {
    const puuid = url.searchParams.get('puuid');
    return riotFetch(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
    );
  }

  if (action === 'ranked') {
    const puuid = url.searchParams.get('puuid');
    return riotFetch(
      `https://eun1.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
    );
  }

  if (action === 'matches') {
    const puuid = url.searchParams.get('puuid');
    const count = url.searchParams.get('count') || 20;
    return riotFetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`
    );
  }

  if (action === 'match') {
    const matchId = url.searchParams.get('matchId');
    return riotFetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`
    );
  }

  if (action === 'heartsteel') {
    const puuid = url.searchParams.get('puuid');
    const count = parseInt(url.searchParams.get('count')) || 20;
    const HEARTSTEEL_ID = 3084;

    const idsRes = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`,
      { headers: { 'X-Riot-Token': API_KEY } }
    );
    if (!idsRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch match IDs' }), {
        status: idsRes.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    const matchIds = await idsRes.json();

    let heartsteelCount = 0;
    for (const matchId of matchIds) {
      try {
        const mRes = await fetch(
          `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`,
          { headers: { 'X-Riot-Token': API_KEY } }
        );
        if (!mRes.ok) continue;
        const match = await mRes.json();
        const participant = match.info.participants.find((p) => p.puuid === puuid);
        if (!participant) continue;
        const items = [
          participant.item0, participant.item1, participant.item2,
          participant.item3, participant.item4, participant.item5, participant.item6,
        ];
        if (items.includes(HEARTSTEEL_ID)) heartsteelCount++;
      } catch {
      }
    }

    return new Response(JSON.stringify({ count: heartsteelCount, matchesChecked: matchIds.length }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), {
    status: 400,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export const config = {
  runtime: 'edge',
};
