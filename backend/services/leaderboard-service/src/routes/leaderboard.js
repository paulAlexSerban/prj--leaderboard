const express = require("express");
const leaderboardController = require("../controllers/leaderboardController");

const router = express.Router();

// HTML routes
router.get("/", leaderboardController.getHome);
router.get("/home", leaderboardController.getHome);
router.get("/leaderboard", leaderboardController.getLeaderboard);
router.get("/games", leaderboardController.getGames);
router.get("/about", leaderboardController.getAbout);

// API routes
router.get("/api/leaderboard", leaderboardController.getLeaderboardApi);
router.get("/api/games", leaderboardController.getGamesApi);

// Content pages from markdown files
router.get("/:slug", leaderboardController.getContentPage);

module.exports = router;
