const fs = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "..", "data");
const dataPath =
  process.env.DB_PATH || path.join(dataDir, "players.json");
const siteConfigPath = path.join(dataDir, "site.json");

let data = null;
let siteConfig = null;

const allowedUserFields = new Set([
  "firstName",
  "lastName",
  "scores",
  "address",
  "email",
  "phone",
  "website",
  "company",
  "country",
  "team",
]);

function buildName(user) {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  return user.name || "Unknown Player";
}

function normalizeScores(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result = {};
  for (const [key, val] of Object.entries(raw)) {
    const n = Math.floor(Number(val));
    result[key] = Number.isFinite(n) && n >= 0 ? n : 0;
  }
  return result;
}

function normalizeUser(user) {
  const scores = normalizeScores(user.scores);
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  return {
    id: Number(user.id),
    scores,
    totalScore,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    address: user.address || "",
    email: user.email || "",
    phone: user.phone || "",
    website: user.website || "",
    company: user.company || "",
    country: user.country || "",
    team: user.team || "",
    name: buildName(user),
  };
}

function normalizeDataShape() {
  if (!data || typeof data !== "object") {
    data = { games: [], users: [], announcements: [] };
  }

  if (!Array.isArray(data.games)) {
    data.games = [];
  }

  if (!Array.isArray(data.users)) {
    data.users = [];
  }

  if (!Array.isArray(data.announcements)) {
    data.announcements = [];
  }

  data.users = data.users.map(normalizeUser);
}

function parseUserPayload(userData, isCreate) {
  const payload = {};

  Object.keys(userData || {}).forEach((key) => {
    if (allowedUserFields.has(key)) {
      payload[key] = userData[key];
    }
  });

  if (isCreate && (!payload.firstName || !payload.lastName)) {
    throw new Error("firstName and lastName are required");
  }

  if (Object.prototype.hasOwnProperty.call(payload, "scores")) {
    if (typeof payload.scores !== "object" || Array.isArray(payload.scores)) {
      throw new Error("scores must be an object mapping game IDs to non-negative integers");
    }
    payload.scores = normalizeScores(payload.scores);
  }

  return payload;
}

function loadData() {
  if (data) return data;

  fs.mkdirSync(path.dirname(dataPath), { recursive: true });

  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, "utf8");
    data = JSON.parse(raw);
  } else {
    data = { users: [], announcements: [] };
  }

  normalizeDataShape();

  return data;
}

function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
}

function loadSiteConfig() {
  if (siteConfig) return siteConfig;

  if (!fs.existsSync(siteConfigPath)) {
    siteConfig = { navigation: { primary: [], company: [], developers: [] }, pages: [] };
    return siteConfig;
  }

  try {
    const raw = fs.readFileSync(siteConfigPath, "utf8");
    const parsed = raw.trim() ? JSON.parse(raw) : { navigation: { primary: [], company: [], developers: [] }, pages: [] };
    siteConfig = {
      navigation: parsed.navigation || { primary: [], company: [], developers: [] },
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    };
  } catch (_error) {
    siteConfig = { navigation: { primary: [], company: [], developers: [] }, pages: [] };
  }

  return siteConfig;
}

function readMarkdownFile(fileName) {
  const filePath = path.join(dataDir, fileName);

  if (!fs.existsSync(filePath)) {
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

const queries = {
  getGames() {
    return loadData().games;
  },

  getLeaderboard(options = {}) {
    const { limit, gameId } = options;
    const users = loadData().users;

    const entries = users
      .map((user) => ({
        userId: user.id,
        name: user.name,
        score: gameId ? (user.scores[gameId] || 0) : user.totalScore,
        gameId: gameId || null,
      }))
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));

    if (Number.isInteger(limit) && limit > 0) {
      return entries.slice(0, limit);
    }

    return entries;
  },

  getUsers(options = {}) {
    const { q = "", sortBy = "id", order = "asc" } = options;
    const users = [...loadData().users];
    const searchTerm = q.trim().toLowerCase();

    const filtered = searchTerm
      ? users.filter((user) => {
          const haystack = [
            user.name,
            user.email,
            user.country,
            user.team,
            user.company,
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(searchTerm);
        })
      : users;

    const sorted = filtered.sort((a, b) => {
      let result = 0;

      if (sortBy === "score") {
        result = b.score - a.score;
      } else if (sortBy === "name") {
        result = a.name.localeCompare(b.name);
      } else {
        result = a.id - b.id;
      }

      return order === "desc" ? result * -1 : result;
    });

    return sorted;
  },

  getUserById(id) {
    const d = loadData();
    const user = d.users.find((u) => u.id === id);

    if (!user) return null;

    const leaderboard = queries.getLeaderboard();
    const rankEntry = leaderboard.find((entry) => entry.userId === id);

    const gameScores = d.games.map((game) => ({
      gameId: game.id,
      gameName: game.name,
      score: user.scores[game.id] || 0,
    }));

    return {
      ...user,
      rank: rankEntry?.rank || null,
      gameScores,
    };
  },

  getBusinessSnapshot() {
    const d = loadData();
    const leaderboard = queries.getLeaderboard();
    const totalUsers = d.users.length;
    const totalGames = d.games.length;

    return {
      totalUsers,
      totalGames,
      topScore: leaderboard[0]?.score || 0,
      topPlayers: leaderboard.slice(0, 3),
      announcements: d.announcements.slice(0, 4),
    };
  },

  getSiteNavigation() {
    return loadSiteConfig().navigation;
  },

  getSitePages() {
    return loadSiteConfig().pages;
  },

  getContentPage(slug) {
    const page = queries.getSitePages().find((entry) => entry.slug === slug);

    if (!page) {
      return null;
    }

    return {
      ...page,
      markdown: readMarkdownFile(page.file),
    };
  },
};

const mutations = {
  createUser(userData) {
    const users = loadData().users;
    const payload = parseUserPayload(userData, true);
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

    const newUser = normalizeUser({
      id: newId,
      scores: {},
      ...payload,
    });

    users.push(newUser);
    saveData();
    return newUser;
  },

  updateUser(id, userData) {
    const users = loadData().users;
    const payload = parseUserPayload(userData, false);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) return null;

    if (Object.keys(payload).length === 0) {
      throw new Error("No valid update fields provided");
    }

    const existing = users[index];
    // Deep-merge scores so a partial {scores: {"apex-arena": 999}} doesn't wipe other games.
    const mergedScores = payload.scores
      ? { ...existing.scores, ...payload.scores }
      : existing.scores;
    const updated = normalizeUser({ ...existing, ...payload, scores: mergedScores });

    users[index] = updated;
    saveData();
    return updated;
  },

  deleteUser(id) {
    const users = loadData().users;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) return false;

    users.splice(index, 1);
    saveData();
    return true;
  },
};

module.exports = {
  queries,
  mutations,
};
