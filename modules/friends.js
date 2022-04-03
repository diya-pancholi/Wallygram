class Friends
{
    getFriendCount(username)
    {
      var sql = `SELECT count(friends_username) FROM friends WHERE Username = "${username}";`;
      return sql;
    }

    getFriendRequests(username)
    {
      var sql = `SELECT * from friends_req WHERE Username = "${username}"`;
      return sql;
    }

    addFriendRequest(username, friendusername, friendname)
    {
      var sql = `INSERT INTO friends_req (Username, friends_username, FriendName) VALUES ("${username}", "${friendusername}", "${friendname}");`;
      return sql;
    }

    deleteFriendRequest(username, friendusername)
    {
      var sql = `DELETE FROM friends_req WHERE Username = "${username}" and friends_username = "${friendusername}";`;
      return sql;
    }

    getFriends(username)
    {
      var sql = `SELECT * from friends WHERE Username = "${username}"`;
      return sql;
    }

    addFriend(username, friendusername)
    {
      var sql = `INSERT INTO friends (Username, friends_username) VALUES ("${username}", "${friendusername}");`;
      return sql;
    }

    deleteFriend(username, friendusername)
    {
      var sql = `DELETE FROM friends WHERE Username = "${username}" and friends_username = "${friendusername}";`;
      return sql;
    }
}

module.exports = Friends