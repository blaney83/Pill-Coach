const db = require("../models");

module.exports = function (app) {

//! Below are all examples of using sequelize with handlebars to CRUD. Above code is always necessary.

//     app.get("/", function(req, res) {
//         db.Burger.findAll({}).then(function(dbBurger) {
//             let hbsObject = {
//                 burgers: dbBurger
//             }
//             res.render("index", hbsObject);
//         })
//     })


//     app.get("/api/burgers", function(req, res) {
//         db.Burger.findAll({}).then(function(dbBurger) {

//             res.json(dbBurger);
//         });
//     });

//     app.post("/api/burgers", function(req, res) {
//         console.log(req.body);

//         db.Burger.create({
//           burger_name: req.body.name,
//           devoured: req.body.devoured
//         }).then(function(dbBurger) {

//           res.json(dbBurger);
//         });
//       });

//       app.put("/api/burgers/:id", function(req, res) {
//         db.Burger.update({
//             devoured: req.body.devoured
//         },{
//             where: { id: req.params.id }
//         }).then(function(dbBurger) {
//           res.json(dbBurger);
//         });
//       });

//       app.delete("/api/burgers/:id", function(req, res) {
//         db.Burger.destroy({
//           where: { id: req.params.id }
//         }).then(function(dbBurger) {
//           res.json(dbBurger);
//         });
//       });
};