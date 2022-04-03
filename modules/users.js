class User
{
    getUserInfo(username)
    {
      var sql = `SELECT * FROM user_table where Username = "${username}";`;
      return sql;
    }

    addUser(username, name, password)
    {
      var sql = `INSERT INTO user_table (Username,_Name,_Password) VALUES ("${username}", "${name}", "${password}");`; 
      return sql;
    }

    checkLogIn(username, password)
    {
      var sql = `SELECT * FROM user_table WHERE Username = "${username}" AND _Password = "${password}";`;
      return sql;
    }
}

module.exports = User