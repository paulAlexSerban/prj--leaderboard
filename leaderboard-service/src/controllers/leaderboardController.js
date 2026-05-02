const { queries } = require("../storage");

exports.getHome = (_req, res) => {
  const page = queries.getContentPage("home");
  const leaderboard = queries.getLeaderboard({ limit: 10 });

  res.render("home", {
    title: page?.title || "Home",
    page,
    leaderboard,
  });
};

exports.getLeaderboard = (_req, res) => {
  const leaderboard = queries.getLeaderboard();
  const snapshot = queries.getBusinessSnapshot();

  res.render("leaderboard", {
    title: "Leaderboard",
    leaderboard,
    snapshot,
  });
};

exports.getLeaderboardApi = (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : null;

  if (req.query.limit && (!Number.isInteger(limit) || limit < 1)) {
    return res.status(400).json({ error: "limit must be a positive integer" });
  }

  const leaderboard = queries.getLeaderboard({ limit });

  res.json({
    entries: leaderboard,
    lastUpdated: new Date().toISOString(),
  });
};

exports.getAbout = (_req, res) => {
  const page = queries.getContentPage("about");
  const snapshot = queries.getBusinessSnapshot();

  res.render("markdown-page", {
    title: page?.title || "About Platform",
    page,
    snapshot,
  });
};

exports.getContentPage = (req, res, next) => {
  const page = queries.getContentPage(req.params.slug);

  if (!page) {
    return next();
  }

  const snapshot = queries.getBusinessSnapshot();

  return res.render("markdown-page", {
    title: page.title,
    page,
    snapshot,
  });
};
