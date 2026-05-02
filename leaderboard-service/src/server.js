const path = require("node:path");
const express = require("express");
const { engine } = require("express-handlebars");
const Handlebars = require("handlebars");
const { marked } = require("marked");

const leaderboardRoutes = require("./routes/leaderboard");
const usersRoutes = require("./routes/users");

const PORT = process.env.PORT || 3000;
const app = express();



app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      renderMarkdown(markdown = "") {
        const html = marked.parse(markdown);
        return new Handlebars.SafeString(html);
      },
            eq(a, b) {
              return a === b;
            },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Routes
app.use(leaderboardRoutes);
app.use(usersRoutes);

app.listen(PORT, () => {
  console.log(`Leaderboard SSR service listening on port ${PORT}`);
});
