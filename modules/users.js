class User
{
    getUserInfo(db, username)
    {
      const result = db.query(`SELECT * FROM user_table where Username = "${username}";`);
      return result;
    }

    addUser(db, username, name, password)
    {
      const result = db.query(`INSERT INTO user_table (Username,_Name,_Password) VALUES ("${username}", "${name}", "${password}");`);
      return result;
    }

    checkLogIn(db, username, password)
    {
      const result = db.query(`SELECT * FROM user_table WHERE Username = "${username}" AND _Password = "${password}";`);
      return result;
    }
}

module.exports = User