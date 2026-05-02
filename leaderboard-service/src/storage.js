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
  "score",
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

function normalizeUser(user) {
  return {
    id: Number(user.id),
    score: Number(user.score) || 0,
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
    data = { users: [], announcements: [] };
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

  if (Object.prototype.hasOwnProperty.call(payload, "score")) {
    const numericScore = Number(payload.score);

    if (!Number.isFinite(numericScore) || numericScore < 0) {
      throw new Error("score must be a non-negative number");
    }

    payload.score = Math.floor(numericScore);
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
    siteConfig = { pages: [] };
    return siteConfig;
  }

  try {
    const raw = fs.readFileSync(siteConfigPath, "utf8");
    const parsed = raw.trim() ? JSON.parse(raw) : { pages: [] };
    siteConfig = {
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
    };
  } catch (_error) {
    siteConfig = { pages: [] };
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
  getLeaderboard(options = {}) {
    const { limit } = options;
    const users = loadData().users;
    const entries = users
      .map((user, index) => ({
        userId: user.id,
        name: user.name,
        score: user.score,
        rank: index + 1,
      }))
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
    const users = loadData().users;
    const user = users.find((u) => u.id === id);

    if (!user) return null;

    const leaderboard = queries.getLeaderboard();
    const rankEntry = leaderboard.find((entry) => entry.userId === id);

    return {
      ...user,
      rank: rankEntry?.rank || null,
    };
  },

  getBusinessSnapshot() {
    const users = loadData().users;
    const leaderboard = queries.getLeaderboard();
    const totalUsers = users.length;
    const totalScore = users.reduce((sum, user) => sum + user.score, 0);

    return {
      totalUsers,
      averageScore: totalUsers ? Math.round(totalScore / totalUsers) : 0,
      topScore: leaderboard[0]?.score || 0,
      topPlayers: leaderboard.slice(0, 3),
      announcements: loadData().announcements.slice(0, 4),
    };
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
      score: 0,
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
    const updated = normalizeUser({ ...existing, ...payload });

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
