const express = require("express");
const router = express.Router();
const {uploadFiles} = require("../../utils/files");
const {upload} = require("../../utils/qiniu");
const config = require("../../common/config");
const {logger} = require("../../logs");
const {sendSuccess, sendError} = require("../../utils/request");
const {insertSql} =  require("../../common/mysql");

router.post("/upload", async (req, res, next) => {
  try {
	const uploadFile = await uploadFiles(req);
	const len = uploadFile.length;
	const result = [];
	for (let i = 0; i < len; i++) {
	  const item = uploadFile[i];
	  const {path, name} = item;
	  const ftpName = `${config.qiniu.upload}/${name}`;

	  const content = await upload(path, ftpName);
	  const completeName = `${config.qiniu.domain}${content.key}`;
	  if (content && content.key) {
	    result.push(completeName);

		// 保存数据库
		const sql = `INSERT INTO b_img_list (img,type,hash) VALUES (?,?,?)`;
		const todo = [completeName, 3, name];
		await insertSql(sql, todo);
	  }
	}
	logger.info(`七牛文件上传成功 ${JSON.stringify(result)}`);

	sendSuccess(res, {data: result.length === 1 ? result[0] : result, message: "上传成功"})
  } catch (err) {
	logger.error(`七牛文件上传失败 ${err.message}`);
	sendError(res, {message: err.message});
  }
});

module.exports = router;
