var express = require("express");
var router = express.Router();
// var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var crypto = require("crypto");
const session = require("express-session");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "wallygramdb",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

router.post("/register", function (req, res, next) {
  console.log(req.body);

  connection.query(
    'INSERT INTO user_table (Username,_Name,_Password) VALUES ("' +
      req.body.Username +
      '" , "' +
      req.body.name +
      '", "' +
      req.body.pswd +
      // crypto.createHash("sha256").update(req.body.pswd).digest("hex") +
      '");',
    function (error, results, fields) {
      console.log(error);
      // request.session.loggedin = true;
      // request.session.uid = results[0].id;
      res.redirect("/profile");
    }
  );
});

router.post("/auth", function (request, response) {
  var Username = request.body.Username;
  var pswd = request.body.pswd;
  // crypto
  //   .createHash("sha256")
  //   .update(request.body.pswd)
  //   .digest("hex");
  console.log(Username, pswd);
  if (Username && pswd) {
    connection.query(
      "SELECT * FROM user_table WHERE Username = ? AND _Password = ?;",
      [Username, pswd],
      function (error, results, fields) {
        console.log(results);
        if (results.length > 0) {
          console.log(results, "abc");
          // console.log(request);
          console.log(request.session);
          // request.session.save(function () {
          //   console.log(request.session);
          //   response.redirect("/profile");
          // })
          request.session.loggedin = true;
          request.session.uid = results[0].Username;
          // request.session.regenerate(function(err) {
          //   request.session = {};
          // })
          response.redirect("/profile");
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

router.get("/profile", function (request, response) {
  var user = request.session.uid;
  connection.query(
    `SELECT * FROM user_table where Username = "anu";`,
    function (err, result) {
      connection.query(
        `SELECT count(Post_id) FROM posts where Username = "anu";`,
        function (err, result1) {
          connection.query(
            `SELECT * FROM posts where Username = "anu";`,
            function (err, result2) {
              response.render("profile", { userinfo: result, postcountinfo: result1, postinfo : result2 });
            }           
          )
        }
      )
    }
  )
});

router.get("/friendsRequested", function (req, res, next) {
  console.log("friendsRequested");
  var friend = undefined;
  connection.query(`insert select query`, function (err, result) {
    console.log(err);
    res.render("friends_requested", { friend: result });
  });
});

router.get("/friendsAccepted", function (req, res, next) {
  console.log("friendsAccepted");
  var friend = undefined;
  connection.query(`insert select query`, function (err, result) {
    console.log(err);
    res.render("friends_accepted", { friend: result });
  });
});
router.get("/feed", function (req, res, next) {
  console.log("feed");
  var post = undefined;
  connection.query(`SELECT * FROM posts where Username <> "gfg";`, function (err, result) {
    console.log(err);
    res.render("feed", { post: result });
  });
});

router.get("/loginviaimg", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/expenseCategory", function (req, res, next) {
  res.render("expense_category", { title: "Express" });
});
router.get("/expenditure", function (req, res, next) {
  res.render("expenditure", { title: "Express" });
});
router.get("/registerviaimg", function (req, res, next) {
  res.render("signup", { title: "Express" });
});

router.get("/", function (req, res, next) {
  console.log("hi");
  res.render("index", { title: "Express" });
});
router.get("/like", function (req, res, next) {
  console.log("like");
  connection.query(`set update query`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    res.redirect("feed", { title: "Express" });
  });
});
// am confused about sending comment body
router.get("/comment", function (req, res, next) {
  console.log("comment");
  connection.query(`set insert query`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    res.redirect("feed", { title: "Express" });
  });
});
router.get("/share", function (req, res, next) {
  console.log("share");
  connection.query(`set insert query`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    res.redirect("profile", { title: "Express" });
  });
});
router.get("/removeFriend", function (req, res, next) {
  console.log("removeFriend");
  connection.query(`set query`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    res.redirect("/friendsAccepted");
  });
});
router.get("/acceptFriendRequest", function (req, res, next) {
  console.log("acceptFriendRequest");
  connection.query(`set query`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    res.redirect("/friendsRequestedted");
  });
});
router.get("/deleteFriendRequest", function (req, res, next) {
  console.log("deleteFriendRequest");
  connection.query(`set query`, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    res.redirect("/friendsRequested");
  });
});

module.exports = router;
