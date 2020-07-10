const mysql = require("mysql");
const config = require("./config");
const {logger} = require("../logs");

const connection = mysql.createConnection({
  host: config.mysql.host,
  port: config.mysql.port,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

connection.connect((err) => {
  if (err) {
	logger.error(`mysql error connecting ${err.stack}`);
	return;
  }
  logger.info(`mysql success connected as id ${connection.threadId}`);
});

//查
const sql = `SELECT * FROM b_img_list`;
connection.query(sql,function (err, result) {
  if(err){
	console.log('[SELECT ERROR] - ',err.message);
	return;
  }

  console.log('--------------------------SELECT----------------------------');
  console.log(result);
  console.log('------------------------------------------------------------\n\n');
});

connection.end();
