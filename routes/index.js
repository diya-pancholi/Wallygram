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

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

router.post("/register", function (req, res, next) {
  console.log(req.body);

  connection.query(
    'INSERT INTO user_table (Username,_Name,_Password) VALUES ("' +
      req.body.Username +
      '" , "' +
      req.body.name +
      '", "' +
      req.body.pswd +
      '");',
    function (error, results, fields) {
      console.log(error);
      res.redirect("/auth");
    }
  );
});

router.post("/auth", function (request, response) {
  var Username = request.body.Username;
  var pswd = request.body.pswd;
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
      if(err){
        console.error(err);
      }

      connection.query(
        `SELECT count(Post_id) FROM posts where Username = "gfg";`,
        function (err, result1) {
          if(err){
            console.error(err);
          }

          connection.query(
            `SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username = "gfg";`,
            function (err, result2) {
              if(err){
                console.error(err);
              }

              connection.query(
                `SELECT * FROM comments WHERE Post_id IN (SELECT Post_id FROM posts where Username = "gfg") ;`,
                function (err, result3) {
                  connection.query(
                    `SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username = "gfg";`,
                    function (err, result4) {
                      if(err){
                        console.error(err);
                      }
                      connection.query(
                        `SELECT count(friends_username) FROM friends WHERE Username = "gfg";`,
                        function (err, result5) {
                          if(err){
                            console.error(err);
                          }
                          response.render("profile", { userinfo: result, postcountinfo: result1, postinfo : result2, comments : result3, catpostinfo : result4, friendcountinfo : result5 });
                        }           
                      )
                    }           
                  )
                }           
              )
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

router.get("/likefeed", function (request, response) {
  console.log(request.query.id);
  connection.query(
    `UPDATE posts SET LikesCount = LikesCount + 1 WHERE Post_id= ${request.query.id};`, 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log('Rows affected:', result.affectedRows);
      response.redirect('/feed');
    }
  )
});

router.post("/comment", function (request, response, next) {
  console.log(request.body);
  connection.query(
    `UPDATE posts SET CommentsCount = CommentsCount + 1 WHERE Post_id= ${request.body.postid};`, 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log('Rows affected:', result.affectedRows);
      console.log(request.body);
      console.log(request.body.comment);
      connection.query(
        'INSERT INTO comments (post_id,username,Caption) VALUES ("' +
        request.body.postid +
        '" , "' +
        "gfg" +
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

router.post("/commentfeed", function (request, response, next) {
  console.log(request.body);
  connection.query(
    `UPDATE posts SET CommentsCount = CommentsCount + 1 WHERE Post_id= ${request.body.postid};`, 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log('Rows affected:', result.affectedRows);
      console.log(request.body);
      console.log(request.body.comment);
      connection.query(
        'INSERT INTO comments (post_id,username,Caption) VALUES ("' +
        request.body.postid +
        '" , "' +
        "gfg" +
        '", "' +
        request.body.comment +
        '");',
        function (error, results, fields) {
          console.log(error);
          response.redirect("/feed");
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
  connection.query(`SELECT * from friends WHERE Username = "gfg"`, function (err, result) {
    console.log(err);
    res.render("friends_accepted", { friend: result });
  });
});

router.get("/feed", function (req, res, next) {
  console.log("feed");
  var post = undefined;
  connection.query(
    `SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username <> "gfg";`, function (err, result) {
      connection.query(
        `SELECT * FROM comments;`, function (err, result1) {
          connection.query(
            `SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username <> "gfg";`,
            function (err, result2) {
              res.render("feed", { post: result, comments: result1, catpostinfo : result2 });
            }           
          )
      });
  });
});

router.get("/loginviaimg", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/expenseCategory", function (req, res, next) {
  console.log(console.error());
  res.render("expense_category", { title: "Express" });
});

router.get("/expenditure", function (req, res, next) {
  console.log(req.query.month)
  if(req.query.month == undefined)
  {
    const d = new Date();
    var currMonth = monthNames[d.getMonth()];
    console.log(currMonth);
    connection.query(
      `SELECT * FROM user_table where Username = "gfg";`,
      function (err, result) {
        connection.query(
          `SELECT count(Post_id) FROM posts where Username = "gfg";`,
          function (err, result1) {           
              connection.query(
                `SELECT count(friends_username) FROM friends WHERE Username = "gfg";`,
                function (err, result2) {
                  connection.query(
                    `SELECT SUM(Amount) FROM payment WHERE Category = "Shopping" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                    function (err, Shopping) {
                      connection.query(
                        `SELECT SUM(Amount) FROM payment WHERE Category = "Food" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                        function (err, Food) {
                          connection.query(
                            `SELECT SUM(Amount) FROM payment WHERE Category = "Bills" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                            function (err, Bills) {
                              connection.query(
                                `SELECT SUM(Amount) FROM payment WHERE Category = "Savings" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                                function (err, Savings) {
                                  connection.query(
                                    `SELECT SUM(Amount) FROM payment WHERE Category = "Health" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                                    function (err, Health) {
                                      connection.query(
                                        `SELECT SUM(Amount) FROM payment WHERE Category = "Misc" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                                        function (err, Misc) {
                                            shop_sum = Shopping[0]['SUM(Amount)'];
                                            food_sum = Food[0]['SUM(Amount)'];
                                            bills_sum = Bills[0]['SUM(Amount)'];
                                            savings_sum = Savings[0]['SUM(Amount)'];
                                            health_sum = Health[0]['SUM(Amount)'];
                                            misc_sum = Misc[0]['SUM(Amount)'];
                                            res.render("expenditure", {userinfo : result, postcountinfo:result1, friendcountinfo : result2, shopping : shop_sum, food : food_sum, bills : bills_sum, health : health_sum, savings : savings_sum, misc : misc_sum});
                                        }
                                      )
                                    }
                                  )
                                }
                              )
                            }
                          )
                        }
                      )
                    }
                  )
                }
              )
          }
        )
      }
    )
  }
  else
  {
    var currMonth = req.query.month;
    connection.query(
      `SELECT * FROM user_table where Username = "gfg";`,
      function (err, result) {
        connection.query(
          `SELECT count(Post_id) FROM posts where Username = "gfg";`,
          function (err, result1) {           
              connection.query(
                `SELECT count(friends_username) FROM friends WHERE Username = "gfg";`,
                function (err, result2) {
                  connection.query(
                    `SELECT SUM(Amount) FROM payment WHERE Category = "Shopping" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                    function (err, Shopping) {
                      connection.query(
                        `SELECT SUM(Amount) FROM payment WHERE Category = "Food" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                        function (err, Food) {
                          connection.query(
                            `SELECT SUM(Amount) FROM payment WHERE Category = "Bills" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                            function (err, Bills) {
                              connection.query(
                                `SELECT SUM(Amount) FROM payment WHERE Category = "Savings" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                                function (err, Savings) {
                                  connection.query(
                                    `SELECT SUM(Amount) FROM payment WHERE Category = "Health" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                                    function (err, Health) {
                                      connection.query(
                                        `SELECT SUM(Amount) FROM payment WHERE Category = "Misc" AND Payment_month = ? AND Username = "gfg";`, [currMonth],
                                        function (err, Misc) {
                                            shop_sum = Shopping[0]['SUM(Amount)'];
                                            food_sum = Food[0]['SUM(Amount)'];
                                            bills_sum = Bills[0]['SUM(Amount)'];
                                            savings_sum = Savings[0]['SUM(Amount)'];
                                            health_sum = Health[0]['SUM(Amount)'];
                                            misc_sum = Misc[0]['SUM(Amount)'];
                                            res.render("expenditure", {userinfo : result, postcountinfo:result1, friendcountinfo : result2, shopping : shop_sum, food : food_sum, bills : bills_sum, health : health_sum, savings : savings_sum, misc : misc_sum});
                                        }
                                      )
                                    }
                                  )
                                }
                              )
                            }
                          )
                        }
                      )
                    }
                  )
                }
              )
          }
        )
      }
    )
  }  
});

router.get("/registerviaimg", function (req, res, next) {
  res.render("signup", { title: "Express" });
});

router.get("/", function (req, res, next) {
  console.log("hi");
  res.render("index", { title: "Express" });
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
  console.log(req.query.id);
  connection.query(`DELETE FROM friends WHERE Username = "gfg" and friends_username = "${req.query.id}";`, function (error, result) {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", result.affectedRows);
    res.redirect("/friendsAccepted");
  })
});

router.get("/acceptFriendRequest", function (req, res, next) {
  console.log(req.query.id);
  connection.query('INSERT INTO friends (Username, friends_username) VALUES ("' +
  "gfg" +
  '" , "' +
  req.query.id +
  '");', function (error, result) {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", result.affectedRows);
    connection.query(`DELETE FROM friends_req WHERE Username = "gfg" and friends_username = "${req.query.id}";`, function (error, result) {
      if (error) {
        return console.error(error.message);
      }
      console.log("Rows affected:", result.affectedRows);
      res.redirect("/friendsRequested");
    })
  });
});

router.get("/deleteFriendRequest", function (req, res, next) {
  console.log(req.query.id);
  connection.query(`DELETE FROM friends_req WHERE Username = "gfg" and friends_username = "${req.query.id}";`, function (error, result) {
    if (error) {
      return console.error(error.message);
    }
    console.log("Rows affected:", result.affectedRows);
    res.redirect("/friendsRequested");
  })
});

router.post("/searchfriends", function (request, response, next) {
  console.log(request.body);
  connection.query(
    `SELECT * FROM user_table WHERE Username = ?;`,
    [request.body.findingfriend], 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log(result);
      response.render("searchfriends", {findfriend : result});
    }
  )
});

router.get("/addfriend", function (request, response) {
  console.log(request.query.id);
   connection.query(
    `SELECT * FROM user_table WHERE Username = ?;`,
    [request.query.id], 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      console.log(result);
      connection.query(
        'INSERT INTO friends_req (Username, friends_username, FriendName) VALUES ("' +
            "gfg" +
            '", "' +
            request.query.id +
            '", "' +
            result[0]._Name + 
            '");', 
        function (err, result1) {
          if (err){
            return console.log(err);
          }
          response.redirect('/profile');
        }
      )
    }
  )
  
});

router.post("/comparisonpost", function (request, response, next) {
  postid = 0
  connection.query(
    'SELECT count(Post_id) FROM posts;',
    function (error, resultcount, fields) {
      postid = resultcount[0]['count(Post_id)'] + 1;
      connection.query(
        `SELECT SUM(Amount) FROM payment WHERE Payment_month = ? AND Category = ? AND Username = "gfg";`,
        [request.body.month1, request.body.Category], 
        function (err, month1_cat_sum) {
          if (err){
            return console.log(err);
          }
          connection.query(
            `SELECT SUM(Amount) FROM payment WHERE Payment_month = ? AND Category = ? AND Username = "gfg";`,
            [request.body.month2, request.body.Category], 
            function (err, month2_cat_sum) {
              if (err){
                return console.log(err);
              }
              connection.query(
                `SELECT SUM(Amount) FROM payment WHERE Payment_month = ? AND Username = "gfg";`,
                [request.body.month1], 
                function (err, month1_sum) {
                  if (err){
                    return console.log(err);
                  }
                  connection.query(
                    `SELECT SUM(Amount) FROM payment WHERE Payment_month = ? AND Username = "gfg";`,
                    [request.body.month2], 
                    function (err, month2_sum) {
                      if (err){
                        return console.log(err);
                      }
                      percent1 = (month1_cat_sum[0]['SUM(Amount)'] / month1_sum[0]['SUM(Amount)'] ) * 100;
                      percent2 = (month2_cat_sum[0]['SUM(Amount)'] / month2_sum[0]['SUM(Amount)'] ) * 100;
                      connection.query(
                        'INSERT INTO posts (post_id,username,Caption, LikesCount, CommentsCount) VALUES ("' +
                        postid +
                        '" , "' +
                        "gfg" +
                        '", "' +
                        request.body.caption +
                        '", "' +
                        0 + 
                        '", "' +
                        0 +
                        '");',
                        function (error, results, fields) {
                          connection.query(
                            'INSERT INTO Comparison_Type (Post_id,Comp_month,Curr_month, Category, Comp_percent, Curr_percent) VALUES ("' +
                            postid +
                            '" , "' +
                            request.body.month1 +
                            '", "' +
                            request.body.month2 +
                            '", "' +
                            request.body.Category +
                            '", "' +
                            percent1 +
                            '", "' +
                            percent2 +
                            '");',
                            function (error, results, fields) {
                              console.log(error);
                              response.redirect("/expenditure");
                            }
                          )
                        }
                      )
                    }
                  )
                }
              )
            }
          )
        }
      )
    }
  )
});

router.post("/categorypost", function (request, response, next) {
  postid = 0
  connection.query(
    'SELECT count(Post_id) FROM posts;',
    function (error, resultcount, fields) {
      postid = resultcount[0]['count(Post_id)'] + 1;
      connection.query(
        'INSERT INTO posts (post_id,username,Caption, LikesCount, CommentsCount) VALUES ("' +
        postid +
        '" , "' +
        "gfg" +
        '", "' +
        request.body.caption +
        '", "' +
        0 + 
        '", "' +
        0 +
        '");',
        function (error, results, fields) {
          connection.query(
            'SELECT SUM(Amount) FROM wallygramdb.payment WHERE Username = "gfg" AND Payment_month = ? AND paid_to = ?;',
            [request.body.month, request.body.paidto],
            function (error, results1, fields) {
              connection.query(
                'INSERT INTO Category_Type (Post_id, Category, Spending, Spending_month) VALUES ("' +
                postid +
                '" , "' +
                request.body.Category +
                '" , "' +
                results1[0]['SUM(Amount)'] +
                '" , "' +
                request.body.month +
                '");',
                function (error, results2, fields) {
                  console.log(error);
                  console.log(results);
                  console.log(results1);
                  console.log(results2);
                  response.redirect("/expenditure");
                }
              )
            }
          )
        }
      )
    }
  )
});

module.exports = router;
