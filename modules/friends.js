class Friends
{
    constructor(db, username)
    {
      this.db = db;
      this.username = username;
    }

    getFriendCount()
    {
      const result = (this.db).query(`SELECT count(friends_username) FROM friends WHERE Username = "${this.username}";`);
      return result;
    }

    getFriendRequests()
    {
      const result = (this.db).query(`SELECT * from friends_req WHERE friends_username = "${this.username}"`);
      return result;
    }

    addFriendRequest(friendusername, friendname)
    {
      const result = (this.db).query(`INSERT INTO friends_req (Username, friends_username, FriendName) VALUES ("${this.username}", "${friendusername}", "${friendname}");`);
      return result;
    }

    deleteFriendRequest(friendusername)
    {
      const result = (this.db).query(`DELETE FROM friends_req WHERE Username = "${this.username}" and friends_username = "${friendusername}";`);
      return result;
    }

    getFriends()
    {
      const result = (this.db).query(`SELECT * from friends WHERE Username = "${this.username}"`);
      return result;
    }

    addFriend(friendusername)
    {
      const result = (this.db).query(`INSERT INTO friends (Username, friends_username) VALUES ("${this.username}", "${friendusername}");`);
      return result;
    }

    deleteFriend(friendusername)
    {
      const result = (this.db).query(`DELETE FROM friends WHERE Username = "${this.username}" and friends_username = "${friendusername}";`);
      return result;
    }
}

module.exports = Friends