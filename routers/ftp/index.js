const express = require("express");
const router = express.Router();
const {uploadFiles} = require("../../utils/files");
const {logger} = require("../../logs");
const {connect, put} = require("../../utils/ftp");
const config = require("../../common/config");
const {sendSuccess, sendError} = require("../../utils/request");
const {insertSql} = require("../../common/mysql");

router.post("/upload", async (req, res, next) => {
  try {
	connect();

	const uploadFile = await uploadFiles(req);
	const len = uploadFile.length;
	const result = [];
	for (let i = 0; i < len; i++) {
	  const item = uploadFile[i];
	  const {path, name} = item;
	  const ftpName = `${config.ftp.upload}/${name}`;

	  const {code} = await put(path, ftpName);
	  const completeName = `${config.ftp.path}${ftpName}`;
	  if (code === 200) {
		result.push(completeName);

		// 保存数据库
		const sql = `INSERT INTO b_img_list (img,type,hash) VALUES (?,?,?)`;
		const todo = [completeName, 2, name];
		await insertSql(sql, todo);
	  }
	}
	logger.info(`FTP 文件上传成功 ${JSON.stringify(result)}`);
	sendSuccess(res, {data: result.length === 1 ? result[0] : result, message: "上传成功"})
  } catch (err) {
	logger.error(`FTP 文件上传失败 ${req.body}`);
	sendError(res, {message: err.message});
  }
});

module.exports = router;
