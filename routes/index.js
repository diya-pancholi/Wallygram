var express = require("express");
var router = express.Router();
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
var mysql = require("mysql");
var crypto = require("crypto");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "diyapancholi",
  database: "users",
});

connection.connect();

router.post("/register", function (req, res, next) {
  console.log(req.body);

  connection.query(
    'INSERT INTO people (email, password, role) VALUES ("' +
      req.body.email +
      '" , "' +
      crypto.createHash("sha256").update(req.body.pswd).digest("hex") +
      '", "user");',
    function (error, results, fields) {
      console.log(error);
      res.redirect("/home");
    }
  );
});

router.post("/auth", function (request, response) {
  var email = request.body.email;
  var pswd = crypto
    .createHash("sha256")
    .update(request.body.pswd)
    .digest("hex");
  if (email && pswd) {
    connection.query(
      "SELECT * FROM people WHERE email = ? AND password = ?",
      [email, pswd],
      function (error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.uid = results[0].id;
          response.redirect("/feed");
        } else {
          response.send("Incorrect email and/or Pswd!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter email and Pswd!");
    response.end();
  }
});
router.get("/loginviaimg", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/registerviaimg", function (req, res, next) {
  res.render("signin", { title: "Express" });
});

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

app.listen(3000);
module.exports = router;
