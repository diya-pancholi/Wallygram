class Friends
{
    getFriendCount(db, username)
    {
      const result = db.query(`SELECT count(friends_username) FROM friends WHERE Username = "${username}";`);
      return result;
    }

    getFriendRequests(db, username)
    {
      const result = db.query(`SELECT * from friends_req WHERE Username = "${username}"`);
      return result;
    }

    addFriendRequest(db, username, friendusername, friendname)
    {
      const result = db.query(`INSERT INTO friends_req (Username, friends_username, FriendName) VALUES ("${username}", "${friendusername}", "${friendname}");`);
      return result;
    }

    deleteFriendRequest(db, username, friendusername)
    {
      const result = db.query(`DELETE FROM friends_req WHERE Username = "${username}" and friends_username = "${friendusername}";`);
      return result;
    }

    getFriends(db, username)
    {
      const result = db.query(`SELECT * from friends WHERE Username = "${username}"`);
      return result;
    }

    addFriend(db, username, friendusername)
    {
      const result = db.query(`INSERT INTO friends (Username, friends_username) VALUES ("${username}", "${friendusername}");`);
      return result;
    }

    deleteFriend(db, username, friendusername)
    {
      const result = db.query(`DELETE FROM friends WHERE Username = "${username}" and friends_username = "${friendusername}";`);
      return result;
    }
}

module.exports = Friends