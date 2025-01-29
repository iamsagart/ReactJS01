const mysql = require("mysql2");
var mysqlConnection = mysql.createConnection({
  host: "mysql-3e718719-pawarsachin11384-5ab0.g.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_JDVMeYkIrqdpVYHdvM_",
  database: "student_db",
  port: "28429",
});
mysqlConnection.connect((err) => {
  if (err) {
    console.log("err in db connection :" + JSON.stringify(err, undefined, 2));
  } else {
    console.log("Database Connection Success");
  }
});
module.exports = mysqlConnection;
