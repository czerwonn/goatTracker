import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;
const API_KEY = process.env.RIOT_API_KEY;

app.use(cors());

const riotFetch = async (url) => {
  const res = await fetch(url, {
    headers: { 'X-Riot-Token': API_KEY },
  });
  if (!res.ok) {
    const text = await res.text();
    const error = new Error(`Riot API error ${res.status}: ${text}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
};

app.get('/api/account/:gameName/:tagLine', async (req, res) => {
  try {
    const { gameName, tagLine } = req.params;
    const data = await riotFetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/api/summoner/:puuid', async (req, res) => {
  try {
    const data = await riotFetch(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${req.params.puuid}`
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/api/ranked/:puuid', async (req, res) => {
  try {
    const data = await riotFetch(
      `https://eun1.api.riotgames.com/lol/league/v4/entries/by-puuid/${req.params.puuid}`
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/api/matches/:puuid', async (req, res) => {
  try {
    const { puuid } = req.params;
    const count = req.query.count || 20;
    const data = await riotFetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/api/match/:matchId', async (req, res) => {
  try {
    const data = await riotFetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/${req.params.matchId}`
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.get('/api/heartsteel-count/:puuid', async (req, res) => {
  try {
    const { puuid } = req.params;
    const count = parseInt(req.query.count) || 20;
    const HEARTSTEEL_ID = 3084;

    const matchIds = await riotFetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`
    );

    let heartsteelCount = 0;

    for (const matchId of matchIds) {
      try {
        const match = await riotFetch(
          `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`
        );
        const participant = match.info.participants.find((p) => p.puuid === puuid);
        if (!participant) continue;

        const items = [
          participant.item0, participant.item1, participant.item2,
          participant.item3, participant.item4, participant.item5, participant.item6,
        ];
        if (items.includes(HEARTSTEEL_ID)) {
          heartsteelCount++;
        }
      } catch {
      }
    }

    res.json({ count: heartsteelCount, matchesChecked: matchIds.length });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
