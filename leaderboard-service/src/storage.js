const fs = require("node:fs");
const path = require("node:path");

const dataPath =
  process.env.DB_PATH || path.join(__dirname, "..", "data", "players.json");

let data = null;

function loadData() {
  if (data) return data;

  fs.mkdirSync(path.dirname(dataPath), { recursive: true });

  if (fs.existsSync(dataPath)) {
    const raw = fs.readFileSync(dataPath, "utf8");
    data = JSON.parse(raw);
  }

  return data;
}

function saveData() {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
}

const queries = {
  getLeaderboard() {
    const users = loadData().users;
    return users
      .map((user, index) => ({
        userId: user.id,
        name: user.name,
        score: user.score,
        rank: index + 1,
      }))
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  },

  getUsers() {
    return loadData().users.sort((a, b) => a.id - b.id);
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
};

const mutations = {
  createUser(userData) {
    const users = loadData().users;
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const { firstName, lastName, score = 0, address = "", email = "", phone = "", website = "", company = "" } = userData;
    const newUser = {
      id: newId,
      name: `${firstName} ${lastName}`,
      score,
      firstName,
      lastName,
      address,
      email,
      phone,
      website,
      company,
    };
    users.push(newUser);
    saveData();
    return newUser;
  },

  updateUser(id, userData) {
    const users = loadData().users;
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) return null;

    const existing = users[index];
    const updated = { ...existing, ...userData };

    if (userData.firstName || userData.lastName) {
      updated.name = `${updated.firstName} ${updated.lastName}`;
    }

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
