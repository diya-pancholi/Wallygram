class Expenditures
{
    getMonthlyCategoryWiseExpense(db, category, month, username)
    {
      const result = db.query(`SELECT SUM(Amount) FROM payment WHERE Category = "${category}" AND Payment_month = "${month}" AND Username = "${username}";`);
      return result;
    }

    getMonthlyLocationWiseExpense(db, location, month, username)
    {
      const result = db.query(`SELECT SUM(Amount) FROM wallygramdb.payment WHERE Username = "${username}" AND Payment_month = "${month}" AND paid_to = "${location}";`);
      return result;
    }

    getMonthlyExpense(db, month, username)
    {
      const result = db.query(`SELECT SUM(Amount) FROM payment WHERE Payment_month = "${month}" AND Username = "${username}";`);
      return result;
    }
}

module.exports = Expenditures