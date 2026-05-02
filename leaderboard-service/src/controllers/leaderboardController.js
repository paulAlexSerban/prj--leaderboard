const { queries } = require("../storage");

function getNavData() {
  const nav = queries.getSiteNavigation();
  return {
    primaryNav: nav.primary || [],
    companyNav: nav.company || [],
    developerNav: nav.developers || [],
  };
}

exports.getHome = (_req, res) => {
  const page = queries.getContentPage("home");
  const leaderboard = queries.getLeaderboard({ limit: 10 });

  res.render("home", {
    title: page?.title || "Home",
    page,
    leaderboard,
    games: queries.getGames(),
    ...getNavData(),
  });
};

exports.getLeaderboard = (req, res) => {
  const games = queries.getGames();
  const gameId = req.query.game || null;
  const currentGame = gameId ? games.find((g) => g.id === gameId) || null : null;
  const leaderboard = queries.getLeaderboard({ gameId });
  const snapshot = queries.getBusinessSnapshot();

  res.render("leaderboard", {
    title: currentGame ? `${currentGame.name} Leaderboard` : "Overall Leaderboard",
    leaderboard,
    snapshot,
    games,
    currentGame,
    ...getNavData(),
  });
};

exports.getLeaderboardApi = (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : null;

  if (req.query.limit && (!Number.isInteger(limit) || limit < 1)) {
    return res.status(400).json({ error: "limit must be a positive integer" });
  }

  const gameId = req.query.game || null;

  if (gameId) {
    const games = queries.getGames();
    const validGame = games.find((g) => g.id === gameId);
    if (!validGame) {
      return res.status(400).json({ error: `Unknown game: ${gameId}` });
    }
  }

  const leaderboard = queries.getLeaderboard({ limit, gameId });

  res.json({
    gameId: gameId || "overall",
    entries: leaderboard,
    lastUpdated: new Date().toISOString(),
  });
};

exports.getGames = (_req, res) => {
  const games = queries.getGames();
  const snapshot = queries.getBusinessSnapshot();

  res.render("games", {
    title: "Games",
    games,
    snapshot,
    ...getNavData(),
  });
};

exports.getGamesApi = (_req, res) => {
  res.json(queries.getGames());
};

exports.getAbout = (_req, res) => {
  const page = queries.getContentPage("about");
  const snapshot = queries.getBusinessSnapshot();

  res.render("markdown-page", {
    title: page?.title || "About",
    page,
    snapshot,
    ...getNavData(),
  });
};

exports.getContentPage = (req, res, next) => {
  // Keep /home consistent with / even when matched by the generic slug route.
  if (req.params.slug === "home") {
    return exports.getHome(req, res);
  }

  const page = queries.getContentPage(req.params.slug);

  if (!page) {
    return next();
  }

  const snapshot = queries.getBusinessSnapshot();

  return res.render("markdown-page", {
    title: page.title,
    page,
    snapshot,
    games: queries.getGames(),
    ...getNavData(),
  });
};
