Create database wallygramdb;

use wallygramdb;

CREATE TABLE IF NOT EXISTS user_table(
  Username varchar(255) NOT NULL,
  _Name varchar(255) NOT NULL,
  _Password varchar(256) NOT NULL,
  Badge varchar(50) DEFAULT NULL,
  Bio VARCHAR(256) DEFAULT NULL,
  PRIMARY KEY (Username)
);


CREATE TABLE IF NOT EXISTS friends(
    Username varchar(255),
    friends_username varchar(255),
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (friends_username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (Username,friends_username)
);

CREATE TABLE IF NOT EXISTS friends_req(
    Username varchar(255),
    friends_username varchar(255),
	FriendName VARCHAR(256),
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (friends_username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (Username,friends_username)
);

CREATE TABLE IF NOT EXISTS Payment(
    payment_id int,
    paid_to varchar(255),
    Payment_month varchar(255),
    Amount int,
    Paid_via varchar(255),
    Category varchar(255),
    Username varchar(255),
    PRIMARY KEY(payment_id)
);


CREATE TABLE IF NOT EXISTS posts(
    Post_id int,
    Caption varchar(255),
    Username varchar(255),
    Post_DT DATETIME,
    LikesCount int,
    CommentsCount int,
    type enum('Comparison_Type','Category_Type') DEFAULT NULL,
    PRIMARY KEY (Post_id)
);


CREATE TABLE IF NOT EXISTS Comparison_Type(
    Post_id int,
    Comp_month varchar(30),
    Curr_month varchar(30),
    Category varchar(100),
    Comp_percent int,
    Curr_percent int,
    PRIMARY KEY (Post_id),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Category_Type(
    Post_id int,
    payment_id int,
    Category varchar(100),
    Spending int,
    Spending_month varchar(255),
    PRIMARY KEY (Post_id),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id)ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payment(payment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS likes(
    post_id int,
    username varchar(255),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (post_id,Username)
);

CREATE TABLE IF NOT EXISTS comments(
    post_id int,
    username varchar(255),
    Caption varchar(255),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (post_id,Username)
);


Insert into user_table values("gfg","greek","gfg",NULL,"I love travelling");
Insert into user_table values("robin24","Robin","ro_bin",NULL,"I was born on 24 April 1998");
Insert into user_table values("carl_34","Carl","1234",NULL,"I love cooking");

Insert into friends values("gfg","carl_34");

Insert into friends_req values("gfg","robin24","Robin");

Insert into payment values(101,"Amazon","march",900,"UPI","shopping","gfg");
Insert into payment values(102,"Dominos","february",1500,"Debit card","food","gfg");
Insert into payment values(103,"MAX Hospital","march",2000,"UPI","Healthcare","robin24");


