var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
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
