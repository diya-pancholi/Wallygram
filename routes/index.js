var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var path = require("path");
var mysql = require("mysql");
var crypto = require("crypto");
const session = require("express-session");
const exp = require("constants");
const util = require( 'util' );
const User = require('../modules/users');
const Posts = require('../modules/posts');
const Friends = require('../modules/friends');
const Expenditures = require('../modules/expenditures');

function makeDb() {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wallygramdb",
  });
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    },
    beginTransaction() {
      return util.promisify( connection.beginTransaction )
        .call( connection );
    },
    commit() {
      return util.promisify( connection.commit )
        .call( connection );
    },
    rollback() {
      return util.promisify( connection.rollback )
        .call( connection );
    }
  };
}

async function withTransaction( db, callback ) {
  try {
    await db.beginTransaction();
    await callback();
    await db.commit();
  } catch ( err ) {
    await db.rollback();
    throw err;
  } finally {
    await db.close();
  }
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const user = new User();
const post = new Posts();
const friend = new Friends();
const expenditure = new Expenditures();

router.get("/", function (req, res, next) {
  console.log("hi");
  res.render("index", { title: "Express" });
});

router.post("/register", function (req, res, next) {
  const db = makeDb();
  try {
    withTransaction( db, async () => {
      const result = await db.query(user.addUser(req.body.Username, req.body.name, req.body.pswd));

      res.redirect("/auth");
    } );
  } catch ( err ) {
    if(err)
    {
      console.error(err);
    }
  }
});

router.get("/registerviaimg", function (req, res, next) {
  res.render("signup", { title: "Express" });
});

router.post("/auth", function (request, response) {
  var Username = request.body.Username;
  var pswd = request.body.pswd;
  const db = makeDb();

  if (Username && pswd) {
    try {
      withTransaction( db, async () => {
        const results = await db.query(user.checkLogIn(Username, pswd));

        if (results.length > 0) {
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
      } );
    } catch ( err ) {
      if(err)
      {
        console.error(err);
      }
    }

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
  console.log("Hello");
  const db = makeDb();
  try {
    withTransaction( db, async () => {
      const result = await db.query( user.getUserInfo("gfg") );
      const result1 = await db.query( post.getProfilePostCount("gfg") );
      const result2 = await db.query( post.getProfileComparisonPosts("gfg") );
      const result3 = await db.query( post.getProfileCategoryPosts("gfg") );
      const result4 = await db.query( post.getProfileComments("gfg"));
      const result5 = await db.query( friend.getFriendCount("gfg"));

      response.render("profile", { userinfo: result, postcountinfo: result1, postinfo : result2, catpostinfo : result3, comments : result4, friendcountinfo : result5 });
    } );
  } catch ( err ) {
    if(err)
    {
      console.error(err);
    }
  }
});

router.get("/like", function (request, response) {

  const db = makeDb();
  try {
    withTransaction( db, async () => {
      const result = await db.query(post.updateLikes(request.query.id));
      response.redirect('/profile');
    } );
  } catch ( err ) {
    if(err)
    {
      console.error(err);
    }
  }
});

router.get("/likefeed", function (request, response) {

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(post.updateLikes(request.query.id));
  response.redirect('/feed');
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.post("/comment", function (request, response, next) {
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(post.updateCommentCount(request.body.postid));
  const result1 = await db.query(post.insertComment(request.body.postid, "gfg", request.body.comment));

  response.redirect("/profile");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.post("/commentfeed", function (request, response, next) {
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(post.updateCommentCount(request.body.postid));
  const result1 = await db.query(post.insertComment(request.body.postid, "gfg", request.body.comment));

  response.redirect("/feed");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
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

  const db = makeDb();
  try {
    withTransaction( db, async () => {
      const result = await db.query(user.getUserInfo("gfg"));
      const result1 = await db.query(post.getProfilePostCount("gfg"));
      const result2 = await db.query(friend.getFriendCount("gfg"));
      const Shopping = await db.query(expenditure.getMonthlyCategoryWiseExpense("Shopping", currMonth, "gfg"));
      const Food = await db.query(expenditure.getMonthlyCategoryWiseExpense("Food", currMonth, "gfg"));
      const Bills = await db.query(expenditure.getMonthlyCategoryWiseExpense("Bills", currMonth, "gfg"));
      const Savings = await db.query(expenditure.getMonthlyCategoryWiseExpense("Savings", currMonth, "gfg"));
      const Health = await db.query(expenditure.getMonthlyCategoryWiseExpense("Health", currMonth, "gfg"));
      const Misc = await db.query(expenditure.getMonthlyCategoryWiseExpense("Misc", currMonth, "gfg"));

      shop_sum = Shopping[0]['SUM(Amount)'];
      food_sum = Food[0]['SUM(Amount)'];
      bills_sum = Bills[0]['SUM(Amount)'];
      savings_sum = Savings[0]['SUM(Amount)'];
      health_sum = Health[0]['SUM(Amount)'];
      misc_sum = Misc[0]['SUM(Amount)'];
                              
      res.render("expenditure", {userinfo : result, postcountinfo:result1, friendcountinfo : result2, shopping : shop_sum, food : food_sum, bills : bills_sum, health : health_sum, savings : savings_sum, misc : misc_sum, currMonth : currMonth});

    } );
  } catch ( err ) {
    if(err)
    {
      console.error(err);
    }
  }  
});

router.get("/friendsRequested", function (req, res, next) {
  console.log("friendsRequested");
  // var user = request.session.uid;
  // console.log(request.session.uid);

  const db = makeDb();
  try {
    withTransaction( db, async () => {
      const result = await db.query(friend.getFriendRequests("gfg"));

      res.render("friends_requested", { friend: result });
    } );
  } catch ( err ) {
    if(err)
    {
      console.error(err);
    }
  }
});

router.get("/friendsAccepted", function (req, res, next) {
console.log("friendsAccepted");
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(friend.getFriends("gfg"));

  res.render("friends_accepted", { friend: result });
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.get("/removeFriend", function (req, res, next) {
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(friend.deleteFriend("gfg", req.query.id));

  res.redirect("/friendsAccepted");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.get("/acceptFriendRequest", function (req, res, next) {
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(friend.addFriend("gfg", req.query.id));
  const result1 = await db.query(friend.deleteFriendRequest("gfg", req.query.id));

  res.redirect("/friendsRequested");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.get("/deleteFriendRequest", function (req, res, next) {
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(friend.deleteFriendRequest("gfg", req.query.id));

  res.redirect("/friendsRequested");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.post("/searchfriends", function (request, response, next) {

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(user.getUserInfo(request.body.findingfriend));

  response.render("searchfriends", {findfriend : result});
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.get("/addfriend", function (request, response) {
// var user = request.session.uid;
// console.log(request.session.uid);

const db = makeDb();
try {
  withTransaction( db, async () => {
  const result = await db.query(user.getUserInfo(request.query.id));
  const result1 = await db.query(friend.addFriendRequest("gfg", request.query.id, result[0]._Name));

  response.redirect('/profile');
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.get("/feed", function (req, res, next) {
  console.log("feed");
  // var user = request.session.uid;
  // console.log(request.session.uid);

  const db = makeDb();
  try {
    withTransaction( db, async () => {
      const result = await db.query(post.getFeedComparisonPosts("gfg"));
      const result1 = await db.query(post.getFeedCategoryPosts("gfg"));
      const result2 = await db.query(post.getFeedComments("gfg"));

      res.render("feed", { post: result, catpostinfo : result1, comments: result2 });
    } );
  } catch ( err ) {
    if(err)
    {
      console.error(err);
    }
  }
});

router.post("/comparisonpost", function (request, response, next) {
// var user = request.session.uid;
// console.log(request.session.uid);
var postid = 0;

const db = makeDb();
try {
  withTransaction( db, async () => {
  const resultcount = await db.query(post.getPostCount());
  postid = resultcount[0]['count(Post_id)'] + 1;

  const month1_cat_sum = await db.query(expenditure.getMonthlyCategoryWiseExpense(request.body.Category, request.body.month1, "gfg"));
  const month2_cat_sum = await db.query(expenditure.getMonthlyCategoryWiseExpense(request.body.Category, request.body.month2, "gfg"));
  const month1_sum = await db.query(expenditure.getMonthlyExpense(request.body.month1, "gfg"));
  const month2_sum = await db.query(expenditure.getMonthlyExpense(request.body.month2, "gfg"));
  percent1 = (month1_cat_sum[0]['SUM(Amount)'] / month1_sum[0]['SUM(Amount)'] ) * 100;
  percent2 = (month2_cat_sum[0]['SUM(Amount)'] / month2_sum[0]['SUM(Amount)'] ) * 100;

  const result1 = await db.query(post.addPost(postid, "gfg", request.body.caption));
  const result2 = await db.query(post.addComparisonPost(postid, request.body.month1, request.body.month2, request.body.Category, percent1, percent2));

  response.redirect("/expenditure");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

router.post("/categorypost", function (request, response, next) {
// var user = request.session.uid;
// console.log(request.session.uid);
var postid = 0;

const db = makeDb();
try {
  withTransaction( db, async () => {
  const resultcount = await db.query(post.getPostCount());
  postid = resultcount[0]['count(Post_id)'] + 1;

  const cost = await db.query(expenditure.getMonthlyLocationWiseExpense(request.body.paidto, request.body.month, "gfg"));

  const result = await db.query(post.addPost(postid, "gfg", request.body.caption));
  const result1 = await db.query(post.addCategoryPost(postid, request.body.Category, cost[0]['SUM(Amount)'], request.body.month));

  response.redirect("/expenditure");
  } );
} catch ( err ) {
  if(err)
  {
  console.error(err);
  }
}
});

module.exports = router;
