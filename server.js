let express = require("express");
let session = require("express-session");
let passport = require("./config/passport");

let app = express();
let PORT = process.env.PORT || 8080;

let db = require("./models");

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set passport
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
// Set Handlebars.
let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});
