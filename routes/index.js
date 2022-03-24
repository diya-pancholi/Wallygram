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
  password: "",
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
      res.redirect("/auth");
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
          console.log(request.session.uid);
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
  // var user = request.session.uid;
  // console.log(request.session.uid);
  connection.query(
    `SELECT * FROM user_table where Username = "gfg";`,
    function (err, result) {
      connection.query(
        `SELECT count(Post_id) FROM posts where Username = "gfg";`,
        function (err, result1) {
          connection.query(
            `SELECT * FROM posts where Username = "gfg";`,
            function (err, result2) {
              response.render("profile", { userinfo: result, postcountinfo: result1, postinfo : result2 });
            }           
          )
        }
      )
    }
  )
});

router.get("/like", function (request, response) {
  console.log(request.query.id);
  connection.query(
    `UPDATE posts SET LikesCount = LikesCount + 1 WHERE Post_id= ${request.query.id};`, 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log('Rows affected:', result.affectedRows);
      response.redirect('/profile');
    }
  )
});

router.get("/comment", function (request, response) {
  console.log(request.query.id);
  connection.query(
    `UPDATE posts SET CommentsCount = CommentsCount + 1 WHERE Post_id= ${request.query.id};`, 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log('Rows affected:', result.affectedRows);
      console.log(request.body);
      console.log(request.body.comment);
      connection.query(
        'INSERT INTO comments (post_id,username,Caption) VALUES ("' +
        request.query.id +
        '" , "' +
        "yy" +
        '", "' +
        request.body.comment +
        '");',
        function (error, results, fields) {
          console.log(error);
          response.redirect("/profile");
        }
      )
    }
  )
});

router.get("/friendsRequested", function (req, res, next) {
  console.log("friendsRequested");
  var friend = undefined;
  connection.query(`SELECT * from friends_req WHERE Username = "gfg"`, function (err, result) {
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
// INSERT INTO user_table (Username,_Name,_Password) VALUES ("' +
//       req.body.Username +
//       '" , "' +
//       req.body.name +
//       '", "' +
//       req.body.pswd +
//       '");
router.get("/createPost2",function(req,res,next){
  console.log("createPost2");
  var post=undefined;
  // if(req.body.Caption!= "")
  // { 
    connection.query('Insert into posts(Post_id,Caption,Username,Post_DT,type) values('+100+', "'+req.body.Caption+'","'+req.body.Username+'","'+CURRENT_TIME()+'","'+Comparison_Type+'");',function (error, results, fields) {
    console.log(error);
     });
    // }
    
    // else{
    //   connection.query('Insert into posts(Post_id,Caption,Username,Post_DT,type) values('100+', "'+ req.body.Caption+'","'+req.body.Username+'","'+2021-11-12 09:23:45+'","'Comparison_Type'");',function (error, results, fields) {
    //     console.log(error);
    //   });
    // }
    // press ctrl & ~. in terminal, 1. git branch: just to check ki tu konsi branch pe hai currently
    //2. git checkout -b sahithidev: to make new branch
    //3. git add .
    //4. git commit -m "work in progress"
    //5. git push -u origin sahithidev
    //iske baad go to github of wallygram, and refresh. you will see a message on top that sahithi pushed changes a minute ago, press create pull request wala green button.
  connection.query('Insert into Comparison_Type(Post_ID,Comp_month,Curr_month,category_id) values('+101+',"'+'"December"'+'","'+'"January"'+'","'+201);')
  connection.query(
    `SELECT * FROM user_table where Username = "gfg";`,
    function (err, result) {
      connection.query(
        `SELECT count(Post_id) FROM posts where Username = "gfg";`,
        function (err, result1) {
          connection.query(
            `SELECT * FROM posts where Username = "gfg";`,
            function (err, result2) {
              response.render("profile", { userinfo: result, postcountinfo: result1, postinfo : result2 });
            }           
          )
        }
      )
    }
  ) 
})
// router.get("/like", function (req, res, next) {
//   console.log("like");
//   connection.query(`set update query`, (error, results, fields) => {
//     if (error) {
//       return console.error(error.message);
//     }
//     console.log("Rows affected:", results.affectedRows);
//     res.redirect("feed", { title: "Express" });
//   });
// });
// am confused about sending comment body
// router.get("/comment", function (req, res, next) {
//   console.log("comment");
//   connection.query(`set insert query`, (error, results, fields) => {
//     if (error) {
//       return console.error(error.message);
//     }
//     console.log("Rows affected:", results.affectedRows);
//     res.redirect("feed", { title: "Express" });
//   });
// });
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
  // console.log("req.query.id");
  connection.query('INSERT INTO friends (Username,FriendID) VALUES ("' +
  "gfg" +
  '" , "' +
  req.query.id +
  '");', function (error, result) {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", results.affectedRows);
    connection.query(`DELETE FROM friends_req WHERE Username = "gfg" and FriendID = ${req.query.id};`, function (error, result) {
      if (error) {
        return console.error(error.message);
      }
      console.log("Rows affected:", results.affectedRows);
      res.redirect("/friendsRequested");
    })
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
