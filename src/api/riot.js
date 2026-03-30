import axios from 'axios';

const API_BASE = 'https://goat-tracker-ten.vercel.app/api/riot';

const riotApi = (params) => axios.get(API_BASE, { params }).then((r) => r.data);

export const getAccount = (gameName, tagLine) =>
  riotApi({ action: 'account', gameName, tagLine });

export const getSummoner = (puuid) =>
  riotApi({ action: 'summoner', puuid });

export const getRankedStats = (puuid) =>
  riotApi({ action: 'ranked', puuid });

export const getMatchIds = (puuid, count = 20) =>
  riotApi({ action: 'matches', puuid, count });

export const getMatchDetails = (matchId) =>
  riotApi({ action: 'match', matchId });

export const getHeartsteelCount = (puuid, count = 100) =>
  riotApi({ action: 'heartsteel', puuid, count });

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
