const express = require("express");
var cors = require("cors");
const users = require("../routes/usersRoute");
const categories = require("../routes/categoriesRoute");
const posts = require("../routes/postsRoute");

function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(function (err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res
        .status(400)
        .json(
          "The server did not receive a valild JSON. Please try checking for syntax errors."
        );
    }
  });
  app.use("/api/v1", users);
  app.use("/api/v1", categories);
  app.use("/api/v1", posts);
  return app;
}

module.exports = createServer;
