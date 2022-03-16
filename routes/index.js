var express = require("express");
var router = express.Router();
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var crypto = require("crypto");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shrestaai",
  database: "wallygramdb",
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

router.post("/register", function (req, res, next) {
  console.log(req.body);

  connection.query(
    'INSERT INTO user_table (Username,_Name,_Password) VALUES ("' +
      req.body.Username +
      '" , "'+req.body.name+'", "' +
      crypto.createHash("sha256").update(req.body.pswd).digest("hex") +
      '");',
    function (error, results, fields) {
      console.log(error);
      res.redirect("/home");
    }
  );
});

router.post("/auth", function (request, response) {
  var Username = request.body.Username;
  var pswd = crypto
    .createHash("sha256")
    .update(request.body.pswd)
    .digest("hex");
  if (Username && pswd) {
    connection.query(
      "SELECT * FROM user_table WHERE Username = ? AND _Password = ?",
      [Username, pswd],
      function (error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.uid = results[0].id;
          response.redirect("/feed");
        } else {
          response.send("Incorrect Username and/or Pswd!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Pswd!");
    response.end();
  }
});
router.get("/loginviaimg", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/registerviaimg", function (req, res, next) {
  res.render("signup",{ title: "Express" });
});

router.get("/", function (req, res, next) {
  console.log("hi");
  res.render("index", { title: "Express" });
});

module.exports = router;
