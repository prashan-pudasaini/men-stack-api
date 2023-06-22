const express = require("express");
const mongoose = require("mongoose");
const db = require("./keys").mongoURI;
const createServer = require("./createServer");

mongoose
  .connect(db)
  .then(() => {
    const app = createServer();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Apps running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Could not connect to MongoDB and start the server`);
    console.log(err);
  });
