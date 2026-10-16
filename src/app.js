const express = require("express");
const app = express();
require("./db");

const limiter = require("./middleware/rateLimit.middleware");

const errorHandler = require("./middleware/error.middleware");
const URLrouter = require("./routes/urls/urls.route");
const usersRouter = require("./routes/users/users.route");

app.use(limiter);

app.use(errorHandler);
app.use(express.json());
app.use("/api", URLrouter);
app.use("/api/auth", usersRouter);

app.get("/", (req, res) => {
  //   console.log(req.session);
  res.status(200).json({
    success: true,
    message: "This is a URL shorthand API",
  });
});

module.exports = app;
