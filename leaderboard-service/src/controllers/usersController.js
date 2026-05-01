const { queries, mutations } = require("../storage");

exports.getUsers = (_req, res) => {
  const users = queries.getUsers();
  res.render("users", {
    title: "Users",
    users,
  });
};

exports.getUserById = (req, res) => {
  const user = queries.getUserById(Number(req.params.id));

  if (!user) {
    res.status(404).render("not-found", {
      title: "User Not Found",
      message: `No user found with id ${req.params.id}`,
    });
    return;
  }

  res.render("user-profile", {
    title: `${user.firstName} ${user.lastName}`,
    user,
  });
};

exports.getUsersApi = (_req, res) => {
  const users = queries.getUsers();
  res.json(users);
};

exports.getUserByIdApi = (req, res) => {
  const user = queries.getUserById(Number(req.params.id));

  if (!user) {
    return res.status(404).json({ error: `No user found with id ${req.params.id}` });
  }

  res.json(user);
};

exports.createUser = (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: "firstName and lastName are required" });
  }

  const newUser = mutations.createUser(req.body);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const id = Number(req.params.id);

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "No update fields provided" });
  }

  const updated = mutations.updateUser(id, req.body);

  if (!updated) {
    return res.status(404).json({ error: `No user found with id ${id}` });
  }

  res.json(updated);
};

exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const deleted = mutations.deleteUser(id);

  if (!deleted) {
    return res.status(404).json({ error: `No user found with id ${id}` });
  }

  res.json({ message: `User ${id} deleted successfully` });
};
