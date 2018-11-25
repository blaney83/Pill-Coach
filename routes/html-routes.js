// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

const db = require("../models")

module.exports = function (app) {

  app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
          let hbsObject = {
            key: req.user.id};
          return res.render("index", hbsObject);
    } else
      res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/login", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.render("index");
    }
    {res.sendFile(path.join(__dirname, "../public/login.html"));}

  });

  app.get("/sign_up", function(req, res) {
    // If the user already has an account send them to the members page
    {res.sendFile(path.join(__dirname, "../public/signup.html"));}
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });


  app.get("/meds", isAuthenticated, function (req, res) {
    if (req.user) {
      db.Pill.findAll({})
        .then(function (dbPill) {
          console.log(dbPill[0])
          dbPill.forEach(function(pillObj){
            let nameArray = pillObj.rx_name.split(" ")
            pillObj.idString = nameArray.join("_")
          })
          console.log(dbPill[0].idString)
          let hbsObject = {
            pills: dbPill
          }
          return res.render("medications", hbsObject);
        });
    }
  });
};