const mysql = require("mysql");
const config = require("./config");
const {logger} = require("../logs");

const connect = () => {
  return mysql.createConnection(config.mysql);
};
const querySql = (sql) => {
  const conn = connect();
  return new Promise((resolve, reject) => {
	try {
	  conn.query(sql, (err, res) => {
		if (err) {
		  reject(err);
		} else {
		  resolve(res);
		}
	  })
	} catch (e) {
	  reject(e);
	} finally {
	  conn.end();
	}
  })
};
const insertSql = (sql, todo) => {
  const conn = connect();
  return new Promise(async (resolve, reject) => {
	try {
	  conn.query(sql, todo, (err, res) => {
		//是否成功写入
		if (res.affectedRows > 0) {
		  resolve(res)
		} else {
		  reject(err);
		}
	  });
	} catch (e) {
	  reject(e);
	} finally {
	  conn.end();
	}
  })
};
const deleteSql = () => {
};

module.exports = {
  querySql,
  insertSql,
  deleteSql,
};
