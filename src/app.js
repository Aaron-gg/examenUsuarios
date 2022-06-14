const express = require("express");

const usersRoute = require("./routes/users.routes");

const app = express();
require("./config/database");

app.set("port", process.env.PORT || 3000);
app.use(express.json());

app.use("/api/users", usersRoute);

module.exports = app;