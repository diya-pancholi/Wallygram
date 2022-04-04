class Posts
{
    getPostCount(db)
    {
      const result = db.query(`SELECT count(Post_id) FROM posts;`);
      return result;
    }

    getProfilePostCount(db, username)
    {
      const result = db.query(`SELECT count(Post_id) FROM posts where Username = "${username}";`);
      return result;
    }

    addPost(db, postID, username, caption)
    {
      const result = db.query(`INSERT INTO posts (post_id,username,Caption, LikesCount, CommentsCount) VALUES (${postID}, "${username}", "${caption}", 0, 0);`);
      return result;
    }

    addComparisonPost(db,postID, month1, month2, category, percent1, percent2)
    {
      const result = db.query(`INSERT INTO Comparison_Type (Post_id,Comp_month,Curr_month, Category, Comp_percent, Curr_percent) VALUES (${postID}, "${month1}", "${month2}", "${category}", ${percent1}, ${percent2});`);
      return result;
    }

    addCategoryPost(db, postID, category, amount, month)
    {
      const result = db.query(`INSERT INTO Category_Type (Post_id, Category, Spending, Spending_month) VALUES (${postID}, "${category}", ${amount}, "${month}");`);
      return result;
    }

    getProfileCategoryPosts(db, username)
    {
      const result = db.query(`SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username = "${username}";`);
      return result;
    }

    getProfileComparisonPosts(db, username)
    {
      const result = db.query(`SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username = "${username}";`);
      return result;
    }

    getFeedCategoryPosts(db, username)
    {
      const result = db.query(`SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username <> "${username}";`);
      return result;
    }

    getFeedComparisonPosts(db, username)
    {
      const result = db.query(`SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username <> "${username}";`);
      return result;
    }

    getProfileComments(db, username)
    {
      const result = db.query(`SELECT * FROM comments WHERE Post_id IN (SELECT Post_id FROM posts where Username = "${username}") ;`);
      return result;
    }

    getFeedComments(db, username)
    {
      const result = db.query(`SELECT * FROM comments;`);
      return result;
    }

    updateLikes(db, postID)
    {
      const result = db.query(`UPDATE posts SET LikesCount = LikesCount + 1 WHERE Post_id= ${postID};`);
      return result;
    }

    updateCommentCount(db, postID)
    {
      const result = db.query(`UPDATE posts SET CommentsCount = CommentsCount + 1 WHERE Post_id= ${postID};`);
      return result;
    }

    insertComment(db, postID, username, comment)
    {
      const result = db.query(`INSERT INTO comments (post_id,username,Caption) VALUES (${postID}, "${username}", "${comment}")`);
      return result;
    }
}

module.exports = Posts