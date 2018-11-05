const express = require("express");
const db = require("./data/db");
const server = express();
const cors = require("cors");

//middleware
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

const hobbits = [
  {
    id: 1,
    name: "Samwise Gamgee"
  },
  {
    id: 2,
    name: "Frodo Baggins"
  }
];

server.get("/hobbits", (req, res) => {
  res.status(200).json(hobbits);
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "There is no user with that ID" });
      }
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ error: "The user couldn't be retrieved" });
    });
});

server.post("/api/users", async (req, res) => {
  if (!req.body.name || !req.body.bio) {
    return res
      .status(400)
      .json({ message: "You need to provide a name and bio in JSON format" });
  }
  try {
    let data = await db.insert(req.body);
    return res.status(201).json({
      id: data.id,
      name: req.body.name,
      bio: req.body.bio
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(user => {
      console.log(user.name, "has been deleted");
      res.status(200).json(user);
    })
    .catch(err => console.error(err));
});

//updates the user and returns the updated array of users
server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  const user = { name, bio };

  db.update(id, user)
    .then(res.status(200))
    .catch(err => console.error(err));
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => console.error(err));
});

server.listen(8000, () => console.log("API running on port 8000"));
