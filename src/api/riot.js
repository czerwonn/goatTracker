import axios from 'axios';

const API_BASE = '/api';

export const getAccount = async (gameName, tagLine) => {
  const { data } = await axios.get(`${API_BASE}/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
  return data;
};

export const getSummoner = async (puuid) => {
  const { data } = await axios.get(`${API_BASE}/summoner/${puuid}`);
  return data;
};

export const getRankedStats = async (puuid) => {
  const { data } = await axios.get(`${API_BASE}/ranked/${puuid}`);
  return data;
};

export const getMatchIds = async (puuid, count = 20) => {
  const { data } = await axios.get(`${API_BASE}/matches/${puuid}?count=${count}`);
  return data;
};

export const getMatchDetails = async (matchId) => {
  const { data } = await axios.get(`${API_BASE}/match/${matchId}`);
  return data;
};

export const getHeartsteelCount = async (puuid, count = 100) => {
  const { data } = await axios.get(`${API_BASE}/heartsteel-count/${puuid}?count=${count}`);
  return data;
};

// Data Dragon helpers
const DDRAGON_VERSION = '16.6.1';
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;

export const getChampionIconUrl = (championName) =>
  `${DDRAGON_BASE}/img/champion/${championName}.png`;

export const getItemIconUrl = (itemId) =>
  itemId ? `${DDRAGON_BASE}/img/item/${itemId}.png` : null;

const SUMMONER_SPELL_NAMES = {
  1: 'SummonerBoost', 3: 'SummonerExhaust', 4: 'SummonerFlash',
  6: 'SummonerHaste', 7: 'SummonerHeal', 11: 'SummonerSmite',
  12: 'SummonerTeleport', 13: 'SummonerMana', 14: 'SummonerDot',
  21: 'SummonerBarrier', 32: 'SummonerSnowball',
};

export const getSummonerSpellIconUrl = (spellId) =>
  `${DDRAGON_BASE}/img/spell/${SUMMONER_SPELL_NAMES[spellId] || 'SummonerFlash'}.png`;

export const getRankIconUrl = (tier) =>
  `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/${tier.toLowerCase()}.png`;
