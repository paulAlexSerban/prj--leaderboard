const { queries, mutations } = require("../storage");

function parseUserId(rawId) {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

exports.getUsers = (req, res) => {
  const q = req.query.q || "";
  const sort = req.query.sort || "id";
  const users = queries.getUsers({ q, sortBy: sort });

  res.render("users", {
    title: "Users",
    users,
    q,
    sort,
  });
};

exports.getUserById = (req, res) => {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(404).render("not-found", {
      title: "User Not Found",
      message: `No user found with id ${req.params.id}`,
    });
  }

  const user = queries.getUserById(id);

  if (!user) {
    return res.status(404).render("not-found", {
      title: "User Not Found",
      message: `No user found with id ${req.params.id}`,
    });
  }

  res.render("user-profile", {
    title: `${user.firstName} ${user.lastName}`,
    user,
  });
};

exports.getUsersApi = (req, res) => {
  const q = req.query.q || "";
  const sort = req.query.sort || "id";
  const users = queries.getUsers({ q, sortBy: sort });
  res.json(users);
};

exports.getUserByIdApi = (req, res) => {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const user = queries.getUserById(id);

  if (!user) {
    return res.status(404).json({ error: `No user found with id ${req.params.id}` });
  }

  res.json(user);
};

exports.createUser = (req, res) => {
  try {
    const newUser = mutations.createUser(req.body);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.updateUser = (req, res) => {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No update fields provided" });
  }

  let updated = null;

  try {
    updated = mutations.updateUser(id, req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!updated) {
    return res.status(404).json({ error: `No user found with id ${id}` });
  }

  res.json(updated);
};

exports.deleteUser = (req, res) => {
  const id = parseUserId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "id must be a positive integer" });
  }

  const deleted = mutations.deleteUser(id);

  if (!deleted) {
    return res.status(404).json({ error: `No user found with id ${id}` });
  }

  res.json({ message: `User ${id} deleted successfully` });
};
