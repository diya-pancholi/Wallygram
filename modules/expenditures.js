class Expenditures
{
    constructor(db, username)
    {
      this.db = db;
      this.username = username;
    }

    getMonthlyCategoryWiseExpense(category, month)
    {
      const result = (this.db).query(`SELECT SUM(Amount) FROM payment WHERE Category = "${category}" AND Payment_month = "${month}" AND Username = "${this.username}";`);
      return result;
    }

    getMonthlyLocationWiseExpense(location, month)
    {
      const result = (this.db).query(`SELECT SUM(Amount) FROM wallygramdb.payment WHERE Username = "${this.username}" AND Payment_month = "${month}" AND paid_to = "${location}";`);
      return result;
    }

    getMonthlyExpense(month)
    {
      const result = (this.db).query(`SELECT SUM(Amount) FROM payment WHERE Payment_month = "${month}" AND Username = "${this.username}";`);
      return result;
    }
}

module.exports = Expenditures