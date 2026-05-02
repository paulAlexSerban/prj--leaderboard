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
    ...getNavData(),
  });
};

exports.getLeaderboard = (_req, res) => {
  const leaderboard = queries.getLeaderboard();
  const snapshot = queries.getBusinessSnapshot();

  res.render("leaderboard", {
    title: "Leaderboard",
    leaderboard,
    snapshot,
    ...getNavData(),
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
    ...getNavData(),
  });
};
