class Expenditures
{
    getMonthlyCategoryWiseExpense(category, month, username)
    {
      var sql = `SELECT SUM(Amount) FROM payment WHERE Category = "${category}" AND Payment_month = "${month}" AND Username = "${username}";`;
      return sql;
    }

    getMonthlyLocationWiseExpense(location, month, username)
    {
      var sql = `SELECT SUM(Amount) FROM wallygramdb.payment WHERE Username = "${username}" AND Payment_month = "${month}" AND paid_to = "${location}";`;
      return sql;
    }

    getMonthlyExpense(month, username)
    {
      var sql = `SELECT SUM(Amount) FROM payment WHERE Payment_month = "${month}" AND Username = "${username}";`;
      return sql;
    }
}

module.exports = Expenditures