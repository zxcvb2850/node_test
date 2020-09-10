const {querySql} = require("../../common/mysql");
const {sendSuccess} = require("../../utils/request");

const express = require("express");
const router = express.Router();

router.get('/img', async (req, res, next) => {
  const {page = 1, limit = 10} = req.query;
  console.log("query", req.query);
  const sql = `SELECT * FROM b_img_list LIMIT ${(page -1) * limit}, ${limit}`;
  const [{total}] = await querySql(`SELECT COUNT(*) AS total FROM b_img_list`);
  const data = await querySql(sql);
  sendSuccess(res, {
	data: {
	  list: data,
	  page,
	  limit,
	  total,
	},
	message: "success",
  })
});

module.exports = router;
