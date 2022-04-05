class Posts
{
    constructor(db, username)
    {
      this.db = db;
      this.username = username;
    }

    getPostCount()
    {
      const result = (this.db).query(`SELECT count(Post_id) FROM posts;`);
      return result;
    }

    getProfilePostCount()
    {
      const result = (this.db).query(`SELECT count(Post_id) FROM posts where Username = "${this.username}";`);
      return result;
    }

    addPost(postID, caption)
    {
      const result = (this.db).query(`INSERT INTO posts (post_id,username,Caption, LikesCount, CommentsCount) VALUES (${postID}, "${this.username}", "${caption}", 0, 0);`);
      return result;
    }

    addComparisonPost(postID, month1, month2, category, percent1, percent2)
    {
      const result = (this.db).query(`INSERT INTO Comparison_Type (Post_id,Comp_month,Curr_month, Category, Comp_percent, Curr_percent) VALUES (${postID}, "${month1}", "${month2}", "${category}", ${percent1}, ${percent2});`);
      return result;
    }

    addCategoryPost(postID, category, amount, month)
    {
      const result = (this.db).query(`INSERT INTO Category_Type (Post_id, Category, Spending, Spending_month) VALUES (${postID}, "${category}", ${amount}, "${month}");`);
      return result;
    }

    getProfileCategoryPosts()
    {
      const result = (this.db).query(`SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username = "${this.username}" ORDER BY POST_DT;`);
      return result;
    }

    getProfileComparisonPosts()
    {
      const result = (this.db).query(`SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username = "${this.username}" ORDER BY POST_DT;`);
      return result;
    }

    getFeedCategoryPosts()
    {
      const result = (this.db).query(`SELECT * FROM posts INNER JOIN category_type ON posts.Post_id = category_type.Post_id WHERE Username IN (SELECT friends_username From friends WHERE Username = "${this.username}") OR Username IN (SELECT Username From friends WHERE friends_username = "${this.username}") ORDER BY POST_DT ;`);
      return result;
    }

    getFeedComparisonPosts()
    {
      const result = (this.db).query(`SELECT * FROM posts INNER JOIN comparison_type ON posts.Post_id = comparison_type.Post_id WHERE Username IN (SELECT friends_username From friends WHERE Username = "${this.username}") OR Username IN (SELECT Username From friends WHERE friends_username = "${this.username}") ORDER BY POST_DT;`);
      return result;
    }

    getProfileComments()
    {
      const result = (this.db).query(`SELECT * FROM comments WHERE Post_id IN (SELECT Post_id FROM posts where Username = "${this.username}") ;`);
      return result;
    }

    getFeedComments()
    {
      const result = (this.db).query(`SELECT * FROM comments INNER JOIN posts ON posts.Post_id=comments.post_id WHERE Username IN (SELECT friends_username From friends WHERE Username = "${this.username}") OR Username IN (SELECT Username From friends WHERE friends_username = "${this.username}");`);
      return result;
    }

    updateLikes(postID)
    {
      const result = (this.db).query(`UPDATE posts SET LikesCount = LikesCount + 1 WHERE Post_id= ${postID};`);
      return result;
    }

    updateCommentCount(postID)
    {
      const result = (this.db).query(`UPDATE posts SET CommentsCount = CommentsCount + 1 WHERE Post_id= ${postID};`);
      return result;
    }

    insertComment(postID, comment)
    {
      const result = (this.db).query(`INSERT INTO comments (post_id,username,Caption) VALUES (${postID}, "${this.username}", "${comment}")`);
      return result;
    }
}

module.exports = Posts