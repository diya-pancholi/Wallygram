var express = require("express");
var router = express.Router();
// var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var crypto = require("crypto");
const session = require("express-session");
const exp = require("constants");

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

class User
{
    getUserInfo(username)
    {
      var sql = `SELECT * FROM user_table where Username = "${username}";`;
      return sql;
    }
}

class Posts
{
    getPostCount()
    {
      var sql = `SELECT count(Post_id) FROM posts;`;
      return sql;
    }

    getProfilePostCount(username)
    {
      var sql = `SELECT count(Post_id) FROM posts where Username = "${username}";`;
      return sql;
    }

    addPost(postID, username, caption)
    {
      var sql = `INSERT INTO posts (post_id,username,Caption, LikesCount, CommentsCount) VALUES (${postID}, "${username}", "${caption}", 0, 0);`;
      return sql;
    }

    addComparisonPost(postID, month1, month2, category, percent1, percent2)
    {
      var sql =  `INSERT INTO Comparison_Type (Post_id,Comp_month,Curr_month, Category, Comp_percent, Curr_percent) VALUES (${postID}, "${month1}", "${month2}", "${category}", ${percent1}, ${percent2});`;
      return sql;
    }

    addCategoryPost(postID, category, amount, month)
    {
      var sql =  `INSERT INTO Category_Type (Post_id, Category, Spending, Spending_month) VALUES (${postID}, "${category}", ${amount}, "${month}");`;
      return sql;
    }

    getProfileCategoryPosts(username)
    {
      var sql = `SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username = "${username}";`;
      return sql;
    }

    getProfileComparisonPosts(username)
    {
      var sql = `SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username = "${username}";`;
      return sql;
    }

    getFeedCategoryPosts(username)
    {
      var sql = `SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username <> "${username}";`;
      return sql;
    }

    getFeedComparisonPosts(username)
    {
      var sql = `SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username <> "${username}";`;
      return sql;
    }

    getProfileComments(username)
    {
      var sql = `SELECT * FROM comments WHERE Post_id IN (SELECT Post_id FROM posts where Username = "${username}") ;`;
      return sql;
    }

    getFeedComments(username)
    {
      var sql = `SELECT * FROM comments;`;
      return sql;
    }

    updateLikes(postID)
    {
      var sql = `UPDATE posts SET LikesCount = LikesCount + 1 WHERE Post_id= ${postID};`;
      return sql;
    }

    updateCommentCount(postID)
    {
      var sql = `UPDATE posts SET CommentsCount = CommentsCount + 1 WHERE Post_id= ${postID};`;
      return sql;
    }

    insertComment(postID, username, comment)
    {
      var sql = `INSERT INTO comments (post_id,username,Caption) VALUES (${postID}, "${username}", "${comment}")`;
      return sql;
    }
}

class Friends
{
    getFriendCount(username)
    {
      var sql = `SELECT count(friends_username) FROM friends WHERE Username = "${username}";`;
      return sql;
    }

    getFriendRequests(username)
    {
      var sql = `SELECT * from friends_req WHERE Username = "${username}"`;
      return sql;
    }

    addFriendRequest(username, friendusername, friendname)
    {
      var sql = `'INSERT INTO friends_req (Username, friends_username, FriendName) VALUES ("${username}", "${friendusername}", "${friendname}")`;
      return sql;
    }

    deleteFriendRequest(username, friendusername)
    {
      var sql = `DELETE FROM friends_req WHERE Username = "${username}" and friends_username = "${friendusername}";`;
      return sql;
    }

    getFriends(username)
    {
      var sql = `SELECT * from friends WHERE Username = "${username}"`;
      return sql;
    }

    addFriend(username, friendusername)
    {
      var sql = `INSERT INTO friends (Username, friends_username) VALUES ("${username}", "${friendusername}");`;
      return sql;
    }

    deleteFriend(username, friendusername)
    {
      var sql = `DELETE FROM friends WHERE Username = "${username}" and friends_username = "${friendusername}";`;
      return sql;
    }
}

class Expenditures
{
    getMonthlyCategoryWiseExpense(category, month, username)
    {
      var sql = `SELECT SUM(Amount) FROM payment WHERE Category = "${category}" AND Payment_month = "${month}" AND Username = "${username}";`;
      return sql;
    }

    getMonthlyLocationWiseExpense(location, month, username)
    {
      var sql = `SELECT SUM(Amount) FROM wallygramdb.payment WHERE Username = "${username}" AND Payment_month = "${month}" AND paid_to = "${location}";`;
      return sql;
    }

    getMonthlyExpense(month, username)
    {
      var sql = `SELECT SUM(Amount) FROM payment WHERE Payment_month = "${month}" AND Username = "${username}";`;
      return sql;
    }
}

const user = new User;
const post = new Posts;
const friend = new Friends;
const expenditure = new Expenditures;

router.get("/", function (req, res, next) {
  console.log("hi");
  res.render("index", { title: "Express" });
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
      '");',
    function (error, results, fields) {
      console.log(error);
      res.redirect("/auth");
    }
  );
});

router.get("/registerviaimg", function (req, res, next) {
  res.render("signup", { title: "Express" });
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

router.get("/loginviaimg", function (req, res, next) {
  res.render("login", { title: "Express" });
});

router.get("/profile", function (request, response) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    user.getUserInfo("gfg"),
    function (err, result) {      
      if(err){
        return console.error(err);
      }

      connection.query(
        post.getProfilePostCount("gfg"),
        function (err, result1) {
          if(err){
            return console.error(err);
          }

          connection.query(
            post.getProfileComparisonPosts("gfg"),
            function (err, result2) {
              if(err){
                return console.error(err);
              }

              connection.query(
                post.getProfileCategoryPosts("gfg"),
                function (err, result3) {
                  if(err){
                    return console.error(err);
                  }

                  connection.query(
                    post.getProfileComments("gfg"),
                    function (err, result4) {
                      if(err){
                        return console.error(err);
                      }

                      connection.query(
                        friend.getFriendCount("gfg"),
                        function (err, result5) {
                          if(err){
                            return console.error(err);
                          }

                          response.render("profile", { userinfo: result, postcountinfo: result1, postinfo : result2, catpostinfo : result3, comments : result4, friendcountinfo : result5 });
                        })
                    })                            
                })                         
            })                     
        })     
    })
});

router.get("/like", function (request, response) {

  connection.query(
    post.updateLikes(request.query.id), 
    function (err, result) {
      if (err){
        return console.log(err);
      }

      response.redirect('/profile');
    })
});

router.get("/likefeed", function (request, response) {
  
  connection.query(
    post.updateLikes(request.query.id), 
    function (err, result) {
      if (err){
        return console.log(err);
      }
      
      response.redirect('/feed');
    })
});

router.post("/comment", function (request, response, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    post.updateCommentCount(request.body.postid), 
    function (err, result) {
      if (err){
        return console.log(err);
      }

      connection.query(
        post.insertComment(request.body.postid, "gfg", request.body.comment),
        function (err, results, fields) {
          if (err){
            return console.log(err);
          }

          response.redirect("/profile");
        })
    })
});

router.post("/commentfeed", function (request, response, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    post.updateCommentCount(request.body.postid), 
    function (err, result) {
      if (err){
        return console.log(err);
      }

      connection.query(
        post.insertComment(request.body.postid, "gfg", request.body.comment),
        function (err, results, fields) {
          if (err){
            return console.log(err);
          }

          response.redirect("/feed");
        })
    })
});

router.get("/feed", function (req, res, next) {
  console.log("feed");
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    post.getFeedComparisonPosts("gfg"), 
    function (err, result) {
      if (err){
        return console.log(err);
      }

      connection.query(
        post.getFeedCategoryPosts("gfg"),
        function (err, result1) {
          if (err){
            return console.log(err);
          }

          connection.query(
            post.getFeedComments("gfg"), 
            function (err, result2) {
              if (err){
                return console.log(err);
              }

              res.render("feed", { post: result, catpostinfo : result1, comments: result2 });
          })
      })
  })
});

router.get("/expenseCategory", function (req, res, next) {
  res.render("expense_category", { title: "Express" });
});

router.get("/expenditure", function (req, res, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  if(req.query.month == undefined)
  {
    const d = new Date();
    var currMonth = monthNames[d.getMonth()];
  }
  else
  {
    var currMonth = req.query.month;
  }

  connection.query(
    user.getUserInfo("gfg"),
    function (err, result) {
      if (err){
        return console.log(err);
      }

      connection.query(
        post.getProfilePostCount("gfg"),
        function (err, result1) {
          if (err){
            return console.log(err);
          }

          connection.query(
            friend.getFriendCount("gfg"),
            function (err, result2) {
              if (err){
                return console.log(err);
              }

              connection.query(
                expenditure.getMonthlyCategoryWiseExpense("Shopping", currMonth, "gfg"),
                function (err, Shopping) {
                  if (err){
                    return console.log(err);
                  }

                  connection.query(
                    expenditure.getMonthlyCategoryWiseExpense("Food", currMonth, "gfg"),
                    function (err, Food) {
                      if (err){
                        return console.log(err);
                      }

                      connection.query(
                        expenditure.getMonthlyCategoryWiseExpense("Bills", currMonth, "gfg"),
                        function (err, Bills) {
                          if (err){
                            return console.log(err);
                          }

                          connection.query(
                            expenditure.getMonthlyCategoryWiseExpense("Savings", currMonth, "gfg"),
                            function (err, Savings) {
                              if (err){
                                return console.log(err);
                              }

                              connection.query(
                                expenditure.getMonthlyCategoryWiseExpense("Health", currMonth, "gfg"),
                                function (err, Health) {
                                  if (err){
                                    return console.log(err);
                                  }

                                  connection.query(
                                    expenditure.getMonthlyCategoryWiseExpense("Misc", currMonth, "gfg"),
                                    function (err, Misc) {
                                      if (err){
                                        return console.log(err);
                                      }

                                      shop_sum = Shopping[0]['SUM(Amount)'];
                                      food_sum = Food[0]['SUM(Amount)'];
                                      bills_sum = Bills[0]['SUM(Amount)'];
                                      savings_sum = Savings[0]['SUM(Amount)'];
                                      health_sum = Health[0]['SUM(Amount)'];
                                      misc_sum = Misc[0]['SUM(Amount)'];
                              
                                      res.render("expenditure", {userinfo : result, postcountinfo:result1, friendcountinfo : result2, shopping : shop_sum, food : food_sum, bills : bills_sum, health : health_sum, savings : savings_sum, misc : misc_sum});
                                  })                                    
                              })                                
                          })                            
                      })
                  })
              })                    
          })
      })
  })  
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

router.get("/friendsRequested", function (req, res, next) {
  console.log("friendsRequested");
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    friend.getFriendRequests("gfg"), 
    function (err, result) {
    if (err){
      return console.log(err);
    }

    res.render("friends_requested", { friend: result });
  });
});

router.get("/friendsAccepted", function (req, res, next) {
  console.log("friendsAccepted");
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    friend.getFriends("gfg"), 
    function (err, result) {
      if (err){
        return console.log(err);
      }

    res.render("friends_accepted", { friend: result });
  })
});

router.get("/removeFriend", function (req, res, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    friend.deleteFriend("gfg", req.query.id),
    function (error, result) {
      if (error) {
        return console.error(error.message);
      }
  
      res.redirect("/friendsAccepted");
  })
});

router.get("/acceptFriendRequest", function (req, res, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    friend.addFriend("gfg", req.query.id),
    function (error, result) {
      if (error) {
        return console.error(error.message);
      }

      connection.query(
        friend.deleteFriendRequest("gfg", req.query.id), 
        function (error, result) {
          if (error) {
            return console.error(error.message);
          }

          res.redirect("/friendsRequested");
      })
  });
});

router.get("/deleteFriendRequest", function (req, res, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

  connection.query(
    friend.deleteFriendRequest("gfg", req.query.id), 
    function (error, result) {
      if (error) {
        return console.error(error.message);
      }
      
      res.redirect("/friendsRequested");
  })
});

router.post("/searchfriends", function (request, response, next) {

  connection.query(
    user.getUserInfo(request.body.findingfriend), 
    function (err, result) {
      if (err){
        return console.log(err);
      }

      response.render("searchfriends", {findfriend : result});
  })
});

router.get("/addfriend", function (request, response) {
  // var user = request.session.uid;
  // console.log(request.session.uid);

   connection.query(
    user.getUserInfo(request.query.id),
    function (err, result) {
      if (err){
        return console.log(err);
      }
      
      connection.query(
        friend.addFriend("gfg", request.query.id, result[0]._Name),
        function (err, result1) {
          if (err){
            return console.log(err);
          }

          response.redirect('/profile');
      })
  })
});

router.post("/comparisonpost", function (request, response, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);
  var postid = 0;

  connection.query(
    post.getPostCount(),
    function (error, resultcount, fields) {
      if (err){
        return console.log(err);
      }

      postid = resultcount[0]['count(Post_id)'] + 1;

      connection.query(
        expenditure.getMonthlyCategoryWiseExpense(request.body.Category, request.body.month1, "gfg"),
        function (err, month1_cat_sum) {
          if (err){
            return console.log(err);
          }

          connection.query(
            expenditure.getMonthlyCategoryWiseExpense(request.body.Category, request.body.month2, "gfg"),
            function (err, month2_cat_sum) {
              if (err){
                return console.log(err);
              }

              connection.query(
                expenditure.getMonthlyExpense(request.body.month1, "gfg"),
                function (err, month1_sum) {
                  if (err){
                    return console.log(err);
                  }

                  connection.query(
                    expenditure.getMonthlyExpense(request.body.month2, "gfg"), 
                    function (err, month2_sum) {
                      if (err){
                        return console.log(err);
                      }

                      percent1 = (month1_cat_sum[0]['SUM(Amount)'] / month1_sum[0]['SUM(Amount)'] ) * 100;
                      percent2 = (month2_cat_sum[0]['SUM(Amount)'] / month2_sum[0]['SUM(Amount)'] ) * 100;

                      connection.query(
                        post.addPost(postid, "gfg", request.body.caption),
                        function (error, results, fields) {
                          if (err){
                            return console.log(err);
                          }

                          connection.query(
                            post.addComparisonPost(postid, request.body.month1, request.body.month2, request.body.Category, percent1, percent2),
                            function (error, results, fields) {
                              if (err){
                                return console.log(err);
                              }

                              response.redirect("/expenditure");
                          })                          
                      })                     
                  })                  
              })              
          })      
      })      
  })
});

router.post("/categorypost", function (request, response, next) {
  // var user = request.session.uid;
  // console.log(request.session.uid);
  var postid = 0;

  connection.query(
    post.getPostCount(),
    function (error, resultcount, fields) {
      if (err){
        return console.log(err);
      }

      postid = resultcount[0]['count(Post_id)'] + 1;

      connection.query(
        post.addPost(postid, "gfg", request.body.caption),
        function (error, results, fields) {
          if (err){
            return console.log(err);
          }

          connection.query(
            expenditure.getMonthlyLocationWiseExpense(request.body.paidto, request.body.month, "gfg"),
            function (error, results1, fields) {
              if (err){
                return console.log(err);
              }

              connection.query(
                post.addCategoryPost(posdtid, request.body.Category, results1[0]['SUM(Amount)'], request.body.month),
                function (error, results2, fields) {
                  if (err){
                    return console.log(err);
                  }
 
                  response.redirect("/expenditure");
              })
          })
      })
  })
});

module.exports = router;
