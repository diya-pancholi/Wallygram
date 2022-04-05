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
    password: "root",
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


router.get("/", function (req, res, next) {
  console.log("hi");
  res.render("index", { title: "Express" });
});

router.post("/register", function (req, res, next) {

  const db = makeDb();

  const user = new User(db, req.body.Username);

  try {
    withTransaction( db, async () => {
      const result = await user.addUser(req.body.name, req.body.pswd);
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

  const user = new User(db, Username);

  if (Username && pswd) {
    try {
      withTransaction( db, async () => {
        const results = await user.checkLogIn(pswd);

        if (results.length > 0) {
          console.log(request.session);
          request.session.loggedin = true;
          request.session.uid = results[0].Username;
          console.log(request.session.uid);
          response.redirect("/profile");
        } else {
          response.send("Incorrect Username and/or Pswd!");
        }

        response.end();
      } );
    } catch ( err ) {
      if(err)
      {
        console.log(err);
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
  var curruser = request.session.uid;
  console.log(request.session.uid);

  const db = makeDb();

  const user = new User(db, curruser);
  const friend = new Friends(db, curruser);
  const post = new Posts(db, curruser);

  try {
    withTransaction( db, async () => {
      const result = await user.getUserInfo();
      const result1 = await post.getProfilePostCount();
      const result2 = await post.getProfileComparisonPosts();
      const result3 = await post.getProfileCategoryPosts();
      const result4 = await post.getProfileComments();
      const result5 = await friend.getFriendCount();

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

  const post = new Posts(db, "");

  try {
    withTransaction( db, async () => {
      const result = await post.updateLikes(request.query.id);
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

  const post = new Posts(db, "");

  try {
    withTransaction( db, async () => {
    const result = await post.updateLikes(request.query.id);
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
  var curruser = request.session.uid;
  console.log(request.session.uid);

  const db = makeDb();

  const post = new Posts(db, curruser);

  try {
    withTransaction( db, async () => {
    const result = await post.updateCommentCount(request.body.postid);
    const result1 = await post.insertComment(request.body.postid, request.body.comment);

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
  var curruser = request.session.uid;
  console.log(request.session.uid);

  const db = makeDb();

  const post = new Posts(db, curruser);

  try {
    withTransaction( db, async () => {
    const result = await post.updateCommentCount(request.body.postid);
    const result1 = await post.insertComment(request.body.postid, request.body.comment);

    response.redirect("/feed");
    } );
  } catch ( err ) {
    if(err)
    {
    console.error(err);
    }
  }
});

router.get("/expenditure", function (req, res, next) {
  var curruser = req.session.uid; 
  console.log(req.session.uid);

  const db = makeDb();

  const user = new User(db, curruser);
  const friend = new Friends(db, curruser);
  const post = new Posts(db, curruser);
  const expenditure = new Expenditures(db, curruser);
  
  if(req.query.month == undefined)
  {
    const d = new Date();
    var currMonth = monthNames[d.getMonth()];
  }
  else
  {
    var currMonth = req.query.month;
  }

  try {
    withTransaction( db, async () => {
      const result = await user.getUserInfo();
      const result1 = await post.getProfilePostCount();
      const result2 = await friend.getFriendCount();
      const Shopping = await expenditure.getMonthlyCategoryWiseExpense("Shopping", currMonth);
      const Food = await expenditure.getMonthlyCategoryWiseExpense("Food", currMonth);
      const Bills = await expenditure.getMonthlyCategoryWiseExpense("Bills", currMonth);
      const Savings = await expenditure.getMonthlyCategoryWiseExpense("Savings", currMonth);
      const Health = await expenditure.getMonthlyCategoryWiseExpense("Health", currMonth);
      const Misc = await expenditure.getMonthlyCategoryWiseExpense("Misc", currMonth);

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
  var curruser = req.session.uid;
  console.log(req.session.uid);

  const db = makeDb();

  const friend = new Friends(db, curruser);

  try {
    withTransaction( db, async () => {
      const result = await friend.getFriendRequests();

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
  var curruser = req.session.uid;
  console.log(req.session.uid);

  const db = makeDb();

  const friend = new Friends(db, curruser);

  try {
    withTransaction( db, async () => {
    const result = await friend.getFriends();

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
  var curruser = req.session.uid;
  console.log(req.session.uid);

  const db = makeDb();

  const friend = new Friends(db, curruser);

  try {
    withTransaction( db, async () => {
    const result = await friend.deleteFriend(req.query.id);

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
  var curruser = req.session.uid;
  console.log(req.session.uid);

  const db = makeDb();

  const friend = new Friends(db, curruser);

  try {
    withTransaction( db, async () => {
    const result = await friend.addFriend(req.query.id);
    const result1 = await friend.deleteFriendRequest(req.query.id);

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
  var curruser = req.session.uid;
  console.log(req.session.uid);

  const db = makeDb();

  const friend = new Friends(db, curruser);

  try {
    withTransaction( db, async () => {
    const result = await friend.deleteFriendRequest(req.query.id);

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

  const user = new User(db, request.body.findingfriend);

  try {
    withTransaction( db, async () => {
    const result = await user.getUserInfo();

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
  var curruser = request.session.uid;
  console.log(request.session.uid);

  const db = makeDb();

  const friend = new Friends(db, curruser);
  const user = new User(db, request.query.id);

  try {
    withTransaction( db, async () => {
    const result = await user.getUserInfo();
    const result1 = await friend.addFriendRequest(request.query.id, result[0]._Name);

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
  var curruser = req.session.uid;

  const db = makeDb();

  const post = new Posts(db, curruser);

  try {
    withTransaction( db, async () => {
      const result = await post.getFeedComparisonPosts();
      const result1 = await post.getFeedCategoryPosts();
      const result2 = await post.getFeedComments();

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
  var curruser = request.session.uid;
  console.log(request.session.uid);

  const db = makeDb();

  const post = new Posts(db, curruser);
  const expenditure = new Expenditures(db, curruser);

  var postid = 0;

  try {
    withTransaction( db, async () => {
    const resultcount = await post.getPostCount();
    postid = resultcount[0]['count(Post_id)'] + 1;

    const month1_cat_sum = await expenditure.getMonthlyCategoryWiseExpense(request.body.Category, request.body.month1);
    const month2_cat_sum = await expenditure.getMonthlyCategoryWiseExpense(request.body.Category, request.body.month2);
    const month1_sum = await expenditure.getMonthlyExpense(request.body.month1);
    const month2_sum = await expenditure.getMonthlyExpense(request.body.month2);
    percent1 = (month1_cat_sum[0]['SUM(Amount)'] / month1_sum[0]['SUM(Amount)'] ) * 100;
    percent2 = (month2_cat_sum[0]['SUM(Amount)'] / month2_sum[0]['SUM(Amount)'] ) * 100;

    const result1 = await post.addPost(postid, request.body.caption);
    const result2 = await post.addComparisonPost(postid, request.body.month1, request.body.month2, request.body.Category, percent1, percent2);

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
  var curruser = request.session.uid;
  console.log(request.session.uid);

  const db = makeDb();

  const post = new Posts(db, curruser);
  const expenditure = new Expenditures(db, curruser);

  var postid = 0;

  try {
    withTransaction( db, async () => {
    const resultcount = await post.getPostCount();
    postid = resultcount[0]['count(Post_id)'] + 1;

    const cost = await expenditure.getMonthlyLocationWiseExpense(request.body.paidto, request.body.month);

    const result = await post.addPost(postid, request.body.caption);
    const result1 = await post.addCategoryPost(db, postid, request.body.Category, cost[0]['SUM(Amount)'], request.body.month);

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
