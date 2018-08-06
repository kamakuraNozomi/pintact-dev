const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
// Mongoose
const mongoose = require("mongoose");
const app = express();

const users = require("./routes/api/users");
const videos = require("./routes/api/videos");
const company = require("./routes/api/company");

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DataBase Connect
const db = require("./config/keys").mongoURI;
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport midleware
app.use(passport.initialize());
// Passport Config
require("./config/passport.js")(passport);

// Use route
app.use("/api/users", users);
app.use("/api/videos", videos);
app.use("/api/company", company);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
