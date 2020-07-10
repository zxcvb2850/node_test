const fs = require("fs");
const express = require("express");
const router = express.Router();
const {logger} = require("../logs");

// 主页
router.get("/", (req, res) => {
  logger.info("xxxxx");
  res.writeHeader(200, {"Content-Type": "text/html"});
  fs.readFile("index.html", (err, data) => {
	res.end(data);
  });
});

module.exports = router;
