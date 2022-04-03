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

module.exports = Posts