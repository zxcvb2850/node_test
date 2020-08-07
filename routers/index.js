const fs = require("fs");
const express = require("express");
const router = express.Router();
const {logger} = require("../logs");
const {querySql} = require("../common/mysql");
const {sendError, sendSuccess} = require("../utils/request");

// 主页
router.get("/", async (req, res) => {
  res.writeHeader(200, {"Content-Type": "text/html"});
  fs.readFile("index.html", (err, data) => {
	res.status(200 ).end(data);
  });
});
// 调试
/*router.get("/json", async (req, res) => {
  try {
	const sql = `SELECT * FROM b_img_list`;
	const result = await querySql(sql);
	sendSuccess({res, data: result})
  } catch (err) {
	sendError({res, message: err.message});
  }
});*/

module.exports = router;
