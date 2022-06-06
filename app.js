const connectDb = require("./database");
const express = require("express");
const app = express();
const urlRoutes = require("./api/urls/urls.routes");
const userRoutes = require("./api/users/users.routes");
const { localStrategy ,jwtStrategy } = require('./middleware/passport');
const passport = require('passport');
const cors = require('cors');

connectDb();
app.use(express.json());
app.use(cors());
app.use("/urls", urlRoutes);
app.use("/users", userRoutes);
// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

app.listen(8000, () => {
  console.log("The application is running on localhost:8000");
});
