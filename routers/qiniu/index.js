const fs = require("fs");
const express = require("express");
const router = express.Router();
const {uploadFiles} = require("../../utils/files");
const {upload} = require("../../utils/qiniu");
const config = require("../../common/config");
const {logger} = require("../../logs");

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
	  if (content && content.key) result.push(`${config.qiniu.domain}${content.key}`)
	}
	logger.info(`七牛文件上传成功 ${JSON.stringify(result)}`);
	res.send({code: 200, data: result, message: "上传成功"});
  } catch (err) {
	logger.error(`七牛文件上传失败 ${err.message}`);
	res.send({code: 1, data: null, message: err.message});
  }
});

module.exports = router;
