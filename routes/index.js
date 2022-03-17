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
      req.body.pswd+
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
          request.session = {};
          request.session.loggedin = true;
          request.session.uid = results[0].Username;
          request.session.save(function () {
            console.log(request.session);
            response.redirect("/profile");
          })
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
  console.log(request.session);
  console.log(request.session.uid);
  console.log("abc");
  connection.query('SELECT * FROM user_table;',function (err, result){
        response.render('profile', {'userinfo':result})
      })
});

router.get('/home', function(req,res){
    // connection.query(
    //   "SELECT * FROM user_table WHERE Username = 'dog'",
    //   function (error, results, fields) {
    
    //     if (err) {
    //         res.redirect('/');
    //     }
    //     res.render('home', {
    //         // title: Welcome to Socka | View Players
    //         userinfo: result
    //     });
    //     response.end();
    //   }
    // );
    connection.query('SELECT * FROM user_table;',function (err, result){
      // console.log(result);
          res.render('home', {'userinfo':result})
        })
      
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

// class User
// {
//     constructor(Username, Name, Password, Badge)   
//     {
//         this.Username = Username;
//         this.Name = Name;
//         this.Password = Password;
//         this.Badge = Badge;

//         //Insert these values into user table
//         //Check unquiness of Username
//     }
// }

// class Post
// {
//     constructor(PostID, Caption, Username, Time, Type)
//     {
//         this.PostID = PostID;
//         this.Caption = Caption;
//         this.Username = Username;
//         this.Time = Time;
//         this.Type = Type;

//         //Insert values into Post table
//     }

//     getUserInfo()
//     {
//         //Select user into (name and badge) from user table where username is this.Username
//     }

//     AddLike(LikedBy_Username)
//     {
//         //Insert (this.PostID and LikedBy_Username) into Likes table
//     }

//     AddComment(CommentedBy_Username, comment)
//     {
//         //Insert (this.PostID, CommentedBy_Username and comment) into Comments table
//     }

//     ViewLikes()
//     {
//         //Select all usernames where PostID is equal to this.PostID from Likes table
//     }

//     ViewComments()
//     {
//         //Select all usernames, comments where PostID is equal to this.PostID from Comments table
//     }
// }

// class PostType1 extends Post
// {
//     constructor(PostID, Caption, Username, Time, Type, Month, CompMonth, CategoryID)
//     {
//         super(PostID, Caption, Username, Time, Type);
//         this.Month = Month;
//         this.CompMonth = CompMonth;
//         this.CategoryID = CategoryID;

//         //Insert values into PostType1 table
//     }
// }

// class PostType2 extends Post
// {
//     constructor(PostID, Caption, Username, Time, Type, PaymentID)
//     {
//         super(PostID, Caption, Username, Time, Type);
//         this.PaymentID = PaymentID;

//         //Insert values into PostType2 table
//     }
// }

// class Payment
// {
//     constructor(PaymentID, Amount, Time, Date, PaidTo, CategoryID)
//     {
//         this.PaymentID = PaymentID;
//         this.Amount = Amount;
//         this.Time = Time;
//         this.Date = Date;
//         this.PaidTo = PaidTo;
//         this.CategoryID = CategoryID;

//         //Insert values into Payment Table
//     }
// }

// class Category
// {
//     constructor(CategoryID, Name)
//     {
//         this.CategoryID = CategoryID;
//         this.Name = Name;

//         //Insert values into Category Table
//     }
// }

// function feed(LoggedUsername)
// {
//     //Select all posts where Username != LOggedUsername and sort by time  
// }

// function SearchUser(FindUsername)
// {
//     //Select user details where Username = FindUsername
//     //Select all posts where Username = FindUsername
// }

// const A = new User('anu', 'Anushka', 'pass', 'green');
// console.log(A.Password);

