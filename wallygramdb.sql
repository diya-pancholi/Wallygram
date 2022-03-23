use wallygramdb;

CREATE TABLE IF NOT EXISTS user_table(
  Username varchar(255) NOT NULL,
  _Name varchar(255) NOT NULL,
  _Password varchar(256) NOT NULL,
  Badge varchar(50) DEFAULT NULL,
  PRIMARY KEY (Username)
);

-- check the uniqueness of the username
/* Select COUNT(*) as username_chk
FROM user_table
where Username='GYANVI';*/

-- INSERT into user_table(Username, _Name, _Password, Badge) values ('GYANVI','gyanvi tandon','idk','null');

 -- checking if username and pasword exits or not at the time of login
/* Select COUNT(*) as login_chk
FROM user_table
where Username='GYANVI' and _Password='idk';*/

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
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (friends_username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (Username,friends_username)
);
ALTER TABLE friends_req ADD FriendID int;
ALTER TABLE friends ADD FriendID int;

ALTER TABLE friends_req ADD FriendName VARCHAR(256) ;
ALTER TABLE user_table ADD Bio VARCHAR(256) ;
ALTER TABLE user_table ADD ID int ;


CREATE TABLE IF NOT EXISTS category(
    id int,
    category_name varchar(255),
    PRIMARY KEY(id)
);

ALTER TABLE user_table MODIFY _Password VARCHAR(256) ;

-- making categories
-- INSERT into category values(201,'Food');
-- INSERT into category values(202,'Savings');
-- INSERT into category values(203,'Health');
-- INSERT into category values(204,'Shopping');
-- INSERT into category values(205,'Others');

CREATE TABLE IF NOT EXISTS Payment(
    payment_id int,
    paid_to varchar(255),
    Payment_DT DATETIME,
    Amount int,
    Paid_via varchar(255),
    Payment_category int,
    Foreign Key(Payment_category) References category(id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(payment_id)
);

CREATE TABLE IF NOT EXISTS paid_by(
    payment_id int,
    username varchar(255),
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payment(payment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(payment_id)
);

-- inserting in the payments
-- Insert into Payment values(301, 'Haldiram', CURRENT_TIME(), 350, 'Debit_card',201);
-- Insert into paid_by values(301,'GYANVI');


CREATE TABLE IF NOT EXISTS posts(
    Post_id int,
    Caption varchar(255),
    Username varchar(255),
    Post_DT DATETIME,
    type enum('Comparison_Type','Category_Type') DEFAULT NULL,
    PRIMARY KEY (Post_id)
);

ALTER TABLE posts ADD LikesCount int;
ALTER TABLE posts ADD CommentsCount int;

CREATE TABLE IF NOT EXISTS Comparison_Type(
    Post_id int,
    Comp_month varchar(30),
    Curr_month varchar(30),
    category_id int,
    PRIMARY KEY (Post_id),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- inserting posts of type comparison
-- Insert into posts values(101,'Beautiful Posts','GYANVI',CURRENT_TIME(),'Comparison_Type');
-- Insert into Comparison_Type values(101,'December','January',201);



CREATE TABLE IF NOT EXISTS Category_Type(
    Post_id int,
    payment_id int,
    PRIMARY KEY (Post_id),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id)ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES Payment(payment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- inserting posts of type category
-- Insert into posts values(102,'Foodie','GYANVI',CURRENT_TIME(),'Category_Type');
-- Insert into Category_Type values(102,301);


CREATE TABLE IF NOT EXISTS likes(
    post_id int,
    username varchar(255),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (post_id,Username)
);
-- extracting users lists who liked a post
/* Select username
From likes
where post_id=101;*/


CREATE TABLE IF NOT EXISTS comments(
    post_id int,
    username varchar(255),
    Caption varchar(255),
    FOREIGN KEY (Post_id) REFERENCES posts(Post_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Username) REFERENCES user_table(Username) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (post_id,Username)
);

-- INSERT into comments values(101,'GYANVI','Trial');

-- extracting users lists and their comments on a post
/*Select username,caption
From comments
where post_id=101;*/

-- For Function feed
/*Select*
from posts
where username='Gyanvi';*/

-- user details except password
/*Select Username, _Name, Badge
from user_tablecomments
where username='Gyanvi';*/

-- for displaying posts of type comparision, returning the sum of expenditures of the entered months and then storing those months in the comparison table by the query metioned above
-- example for the month of february 2022
/*Select SUM(payment.Amount) as monthy_expense
From payment,paid_by
where payment.payment_id=paid_by.payment_id and payment.Payment_DT>'2022-02-01 12:00:00' and payment.Payment_DT<'2022-03-01 12:00:00' and paid_by.username='Gyanvi';*/

-- for displaying monthly expense of a particular category
/*Select SUM(Amount) as monthly_categorical_expense
From Payment, paid_by
where Payment_DT>'2022-03-01 12:00:00' and Payment_DT<'2022-04-01 12:00:00' and paid_by.username='Gyanvi' and paid_by.payment_id=payment.payment_id and
Payment_category=(Select id
from category
where category_name='Food');*/

-- for displaying the payments of the chosen category( fetch from here and display on expense page and from there click on share and locally store the chose values in variable, show them in posts and also store them in posts type 2
/*Select paid_to, Payment_DT,Amount, Paid_via, Payment_category
from payment, paid_by
where payment.payment_id=paid_by.payment_id and
payment.Payment_category=(Select id
from category
where category_name='Food');*/


-- CHANGES FROM HERE 



-- get user info
-- select Username, badge
-- from user_table
-- where Username='GYANVI';

-- add like
-- Insert into likes values(102,'GYANVI');

-- add comment
-- Insert into comments values(102,'GYANVI','Beautiful Post');

-- view likes
-- select username
-- from likes
-- where post_id='102';

-- view comments
-- select username, caption
-- from comments
-- where post_id=102;

-- feed for recommendations, here Anu is the person who is logged in
-- Select* 
-- from payment
-- where payment_id in (Select payment_id
-- from category_type
-- where Post_id in (select Post_id 
-- from posts
-- where Username in (Select friends_username
-- from friends
-- where username='Anu') order by Post_DT));


-- feed for comparison type, first of all retrieve the current month, comparision month and category and then calculate the total expenditures in those months separately
-- Select curr_month, Comp_month, category_id
-- from comparison_type
-- where Post_id in (select Post_id 
-- from posts
-- where Username in (Select friends_username
-- from friends
-- where username='Anu') order by Post_DT);

-- 		-- for displaying posts of type comparision, returning the sum of expenditures of the entered months and then storing those months in the comparison table by the query metioned above
-- 		-- example for the month of february 2022
-- 		Select SUM(payment.Amount) as monthy_expense
-- 		From payment,paid_by
-- 		where payment.payment_id=paid_by.payment_id and payment.Payment_DT>'2022-02-01 12:00:00' and payment.Payment_DT<'2022-03-01 12:00:00' and paid_by.username='Gyanvi';

-- 		-- for displaying monthly expense of a particular category
-- 		Select SUM(Amount) as monthly_categorical_expense
-- 		From Payment, paid_by
-- 		where Payment_DT>'2022-03-01 12:00:00' and Payment_DT<'2022-04-01 12:00:00' and paid_by.username='Gyanvi' and paid_by.payment_id=payment.payment_id and
-- 		Payment_category=(Select id 
-- 		from category
-- 		where category_name='Food');
--         
--         
-- search user
-- Select username, _name, badge
-- from user_table
-- where username='GYANVI';

-- posts of a username
-- 	-- recommendations
--     Select* 
-- 	from payment
-- 	where payment_id in (Select payment_id
-- 	from category_type
-- 	where Post_id in (select Post_id 
-- 	from posts
-- 	where Username='GYANVI' order by Post_DT) );
--     
--     -- comparisions
--     -- feed for comparison type, first of all retrieve the current month, comparision month and category and then calculate the total expenditures in those months separately
-- 		Select curr_month, Comp_month, category_id
-- 		from comparison_type
-- 		where Post_id in (select Post_id 
-- 		from posts
-- 		where Username ='GYANVI' order by Post_DT);

-- 				-- for displaying posts of type comparision, returning the sum of expenditures of the entered months and then storing those months in the comparison table by the query metioned above
-- 				-- example for the month of february 2022
-- 				Select SUM(payment.Amount) as monthy_expense
-- 				From payment,paid_by
-- 				where payment.payment_id=paid_by.payment_id and payment.Payment_DT>'2022-02-01 12:00:00' and payment.Payment_DT<'2022-03-01 12:00:00' and paid_by.username='Gyanvi';

-- 				-- for displaying monthly expense of a particular category
-- 				Select SUM(Amount) as monthly_categorical_expense
-- 				From Payment, paid_by
-- 				where Payment_DT>'2022-03-01 12:00:00' and Payment_DT<'2022-04-01 12:00:00' and paid_by.username='Gyanvi' and paid_by.payment_id=payment.payment_id and
-- 				Payment_category=(Select id 
-- 				from category
-- 				where category_name='Food');
