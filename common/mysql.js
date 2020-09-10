const mysql = require("mysql");
const config = require("./config");
const {logger} = require("../logs");

const connect = () => {
  return mysql.createPool(config.mysql);
};

const pool = mysql.createPool(config.mysql);
const querySql = (sql) => {
  return new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
	  connection.query(sql, (err, rows) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(rows);
		}
	  });
	  connection.release();
	})
  })
};
const insertSql = (sql, todo) => {
  return new Promise((resolve, reject) => {
	pool.getConnection((err, connection) => {
	  connection.query(sql, todo, (err, res) => {
		//是否成功写入
		if (res.affectedRows > 0) {
		  resolve(res)
		} else {
		  reject(err);
		}
	  });

	  connection.release();
	})
  })
};
const deleteSql = () => {
};

module.exports = {
  querySql,
  insertSql,
  deleteSql,
};
