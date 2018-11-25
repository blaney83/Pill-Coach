const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const cors = require("cors");
const morgan = require("morgan");

let app = express();
app.use(cors());
let PORT = process.env.PORT || 3000;

let db = require("./models");

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set passport
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./scraper.js")(app);
// require("./routes/rx-routes.js")(app);

// Set Handlebars.
let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    // console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
