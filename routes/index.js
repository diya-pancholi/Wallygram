// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
// module.exports = router;

const express = require('express')
const mysql = require('mysql')

// create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wallygramdb'
});

// connect to mysql
db.connect(err => {
    if (err) {
        throw err
    }
    console.log('MySQL Connected')
});

const app = express()

// create database
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE wallygramdb'
    db.query(sql, err => {
        if (err) {
            throw err
        }
        res.send("Database Created");
    });
});

// check the uniquenessof the username
app.get('/getuser1', (req, res) => {
    let sql = `Select COUNT(*) as username_chk FROM user_table where Username='GYANVI'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('Uniqueness of username checked')
    })
})

// checking if username and password exits or not at the time of login
app.get('/getuser2', (req, res) => {
    let sql = `Select COUNT(*) as login_chk FROM user_table where Username='GYANVI' and _Password='idk'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('Existence of username and pwd checked at time of login')
    })
})

// extracting users lists who liked a post
app.get('/getlikes1', (req, res) => {
    let sql = `Select username From likes where post_id=101`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('User list who liked a post extracted')
    })
})

// extracting users lists and their comments on a post
app.get('/getcomments1', (req, res) => {
    let sql = `Select username,caption From comments where post_id=101`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('User list and their comments on a post extracted')
    })
})

// For Function feed
app.get('/getposts1', (req, res) => {
    let sql = `Select * from posts where username='Gyanvi'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('Extracted details for feed function')
    })
})

// user details except password
app.get('/getuser3', (req, res) => {
    let sql = `Select Username, _Name, Badge from user_table where username='Gyanvi'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('User details except password extracted')
    })
})

// for displaying posts of type comparision, returning the sum of expenditures of the entered months and then storing those months in the comparison table by the query metioned above example for the month of february 2022
app.get('/getpayment1', (req, res) => {
    let sql = `Select SUM(payment.Amount) as monthy_expense
    From payment,paid_by
    where payment.payment_id=paid_by.payment_id and payment.Payment_DT>'2022-02-01 12:00:00' and payment.Payment_DT<'2022-03-01 12:00:00' and paid_by.username='Gyanvi'`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('Sum of expenditures of month extracted')
    })
})

// for displaying monthly expense of a particular category
app.get('/getpayment2', (req, res) => {
    let sql = `Select SUM(Amount) as monthly_categorical_expense
    From Payment, paid_by
    where Payment_DT>'2022-03-01 12:00:00' and Payment_DT<'2022-04-01 12:00:00' and paid_by.username='Gyanvi' and paid_by.payment_id=payment.payment_id and
    Payment_category=(Select id
    from category
    where category_name='Food')`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('Monthly expense of particular category extracted')
    })
})

// for displaying the payments of the chosen category( fetch from here and display on expense page and from there click on share and locally store the chose values in variable, show them in posts and also store them in posts type 2
app.get('/getpayment3', (req, res) => {
    let sql = `Select paid_to, Payment_DT,Amount, Paid_via, Payment_category
    from payment, paid_by
    where payment.payment_id=paid_by.payment_id and
    payment.Payment_category=(Select id
    from category
    where category_name='Food')`
    let query = db.query(sql, (err, results) => {
        if (err) {
            throw err
        }
        console.log(results)
        res.send('Payments of chosen category extracted')
    })
})

// //create table user
// app.get('/createUser', (req, res) => {
//     let sql = 'CREATE TABLE User(UserName VARCHAR(50), Name VARCHAR(255) NOT NULL, Badge VARCHAR(20), Password VARCHAR(255) NOT NULL, PRIMARY KEY(UserName))'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('User table created')
//     })
// })

// // Insert user
// app.get('/user1', (req, res) => {
//     let post = {UserName: 'maxxxx', Name: 'Max', Badge: 'Green', Password: 'thisispass'};
//     let sql = 'INSERT INTO User SET ?'
//     let query = db.query(sql, post, err => {
//         if (err) {
//             throw err
//         }
//         res.send('User added')
//     })
// })

// app.get('/user2', (req, res) => {
//     let sql = 'INSERT INTO User(UserName, Name, Badge, Password) VALUES ("maxy", "max", "Green", "pass"),("marky", "mark", "Green", "pass"),("cherry", "cherl", "Green", "pass"), ("maryy", "mary", "Green", "pass")'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Other users added')
//     })
// })

// //create table user friends
// app.get('/createUserFriend', (req, res) => {
//     let sql = 'CREATE TABLE User_Friends(UserName VARCHAR(50) NOT NULL, FriendUserName VARCHAR(50) NOT NULL, FOREIGN KEY (UserName) REFERENCES User (UserName), FOREIGN KEY (FriendUserName) REFERENCES User (UserName))'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('User Friend table created')
//     })
// })

// // Insert user friends
// // app.get('/userFriend1', (req, res) => {
// //     let sql = 'INSERT INTO User_Friends(UserName, FriendUserName) VALUES ("maxy", "marky"), ("maxy", "cherry") ,("cherry", "cherl", "Green", "pass"), ("maryy", "mary", "Green", "pass")'
// //     db.query(sql, err => {
// //         if (err) {
// //             throw err
// //         }
// //         res.send('User Friend added')
// //     })
// // })

// // //create table user posts
// // app.get('/createUserPost', (req, res) => {
// //     let sql = 'CREATE TABLE User_Posts(UserName VARCHAR(50) NOT NULL, PostID int NOT NULL, FOREIGN KEY (UserName) REFERENCES User (UserName), FOREIGN KEY (PostID) REFERENCES Post (PostID))'
// //     db.query(sql, err => {
// //         if (err) {
// //             throw err
// //         }
// //         res.send('User Friend table created')
// //     })
// // })

// // // Insert user post
// // app.get('/userPost1', (req, res) => {
// //     let post = {UserName: 'maxxxx', PostID: 4};
// //     let sql = 'INSERT INTO User_Posts SET ?'
// //     let query = db.query(sql, post, err => {
// //         if (err) {
// //             throw err
// //         }
// //         res.send('User Post added')
// //     })
// // })

// //create table category
// app.get('/createCategory', (req, res) => {
//     let sql = 'CREATE TABLE Category(CategoryID INT NOT NULL, CategoryName VARCHAR(50) NOT NULL, PRIMARY KEY(CategoryID))'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Category table created')
//     })
// })

// // Insert category
// app.get('/category1', (req, res) => {
//     let sql = 'INSERT INTO Category(CategoryID,CategoryName) VALUES (1,"Food"),(2,"Shopping"),(3,"Bills")'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Category added')
//     })
// })

// //create table category payment
// app.get('/createCategoryPayment', (req, res) => {
//     let sql = 'CREATE TABLE CategoryPayment(CategoryID INT NOT NULL REFERENCES Category(CategoryID) ON DELETE CASCADE ON UPDATE CASCADE,PaymentID INT primary key REFERENCES Payment(PaymentID) ON DELETE CASCADE ON UPDATE CASCADE)'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Category payment table created')
//     })
// })

// // Insert category payment
// app.get('/categoryPayment1', (req, res) => {
//     let sql = 'INSERT INTO CategoryPayment(CategoryID,PaymentID) VALUES (1,945672),(2,456732),(1,234587)'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Category payment added')
//     })
// })

// //create table Payment
// app.get('/createPayment', (req, res) => {
//     let sql = 'CREATE TABLE Payment(PaymentID INT primary key,Price INT NOT NULL,Location VARCHAR(100) NOT NULL,check(Price>0))'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Payment table created')
//     })
// })

// // Insert payment
// app.get('/payment1', (req, res) => {
//     let sql = 'INSERT INTO Payment(PaymentID,Price,Location) VALUES (945672,1200,"ABC Hotel,Hyderabad"),(456732,4200,"AMB Mall,Hyderabad"),(234587,900,"Kritunga Restaurant,Hyderabad")'
//     db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Payment added')
//     })
// })

// // To find private information of a user
// // app.get('/getuser1', (req, res) => {
// //     let sql = `SELECT * FROM User WHERE UserName = 'maxxxx'`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('User private details fetched')
// //     })
// // })

// // To find public information of a user
// // app.get('/getuser2', (req, res) => {
// //     let sql = `SELECT UserName, Name, Badge FROM User WHERE UserName = 'maxxxx'`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('User public details fetched')
// //     })
// // })

// // // To find all the friend’s usernames of a user
// // app.get('/getuser3', (req, res) => {
// //     let sql = `SELECT FriendID FROM User_Friends WHERE UserName = 'shrutiiii'`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('User friends details fetched')
// //     })
// // })

// // // To find all the friend’s public information of a user
// // app.get('/getuser4', (req, res) => {
// //     let sql = `SELECT UserName, Name, Badge FROM User WHERE UserName IN (SELECT FriendUserName FROM User_Friends WHERE UserName = 'shrutiiii')`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('Friends public details fetched')
// //     })
// // })

// // // To find all the post IDs of a User
// // app.get('/getuser5', (req, res) => {
// //     let sql = `SELECT PostID FROM User_Posts WHERE UserName = 'maxxxx'`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('User PostID details fetched')
// //     })
// // })

// // // To find all the posts of a User
// // app.get('/getuser6', (req, res) => {
// //     let sql = `SELECT * FROM Posts WHERE PostID IN (SELECT PostID FROM User_Posts WHERE UserName = 'maxxxx')`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('User Post details fetched')
// //     })
// // })

// // To get post header information of a user
// // app.get('/getuser7', (req, res) => {
// //     let sql = `SELECT UserName, Name, Badge FROM User WHERE UserName = 'maxxxx'`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('User Post Header details fetched')
// //     })
// // })

// // Category Wize spent money
// // app.get('/getcategory1', (req, res) => {
// //     let sql = `SELECT CategoryName,SUM(Price) FROM Category LEFT JOIN (CategoryPayment NATURAL JOIN Payment) ON Category.CategoryID=CategoryPayment.CategoryID GROUP BY Category.CategoryID`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('Category wise spent money fetched')
// //     })
// // })

// // All payments of a Particular Category
// // app.get('/getcategory2', (req, res) => {
// //     let sql = `SELECT CategoryID,CategoryName,PaymentID,Price,Location FROM Category NATURAL JOIN CategoryPayment NATURAL JOIN Payment WHERE CategoryName="Food"`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('Payments of particular category fetched')
// //     })
// // })

// // Payment of a particular category and PaymentID
// // app.get('/getcategory3', (req, res) => {
// //     let sql = `SELECT * FROM CategoryPayment NATURAL JOIN Payment WHERE CategoryID="1" AND PaymentID="945672"`
// //     let query = db.query(sql, (err, results) => {
// //         if (err) {
// //             throw err
// //         }
// //         console.log(results)
// //         res.send('Payments of particular category and payment ID fetched')
// //     })
// // })

// // update user
// // app.get('/updateuser/:id', (req, res) => {
// //     let newName = 'Updated name'
// //     let sql = `UPDATE User SET name = '${newName}' WHERE id = ${req.params.id}`
// //     let query = db.query(sql, err => {
// //         if (err) {
// //             throw err
// //         }
// //         res.send('User updated')
// //     })
// // })

// // delete user
// // app.get('/deleteuser/:id', (req, res) => {
// //     let sql = `DELETE FROM User WHERE id = ${req.params.id}`
// //     let query = db.query(sql, err => {
// //         if (err) {
// //             throw err
// //         }
// //         res.send('User deleted')
// //     })
// // })

// app.get('/deletedb1', (req, res) => {
//     let sql = `DROP DATABASE wallygramdb`
//     let query = db.query(sql, err => {
//         if (err) {
//             throw err
//         }
//         res.send('Database deleted deleted')
//     })
// })

app.listen('3000', () => {
    console.log('Server Started on port 3000')
});