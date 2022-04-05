class User
{
    constructor(db, username)
    {
      this.db = db;
      this.username = username;
    }

    getUserInfo()
    {
      const result = (this.db).query(`SELECT * FROM user_table where Username = "${this.username}";`);
      return result;
    }

    addUser(name, password)
    {
      const result = (this.db).query(`INSERT INTO user_table (Username,_Name,_Password) VALUES ("${this.username}", "${name}", "${password}");`);
      return result;
    }

    checkLogIn(password)
    {
      const result = (this.db).query(`SELECT * FROM user_table WHERE Username = "${this.username}" AND _Password = "${password}";`);
      return result;
    }
}

module.exports = User