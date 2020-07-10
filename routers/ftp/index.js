const express = require("express");
const router = express.Router();
const {uploadFiles} = require("../../utils/files");
const {logger} = require("../../logs");
const {connect, put} = require("../../utils/ftp");
const config = require("../../common/config");

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
	  if (code === 200) result.push(`${config.ftp.path}${ftpName}`);
	}
	logger.info(`FTP 文件上传成功 ${JSON.stringify(result)}`);
	res.send({code: 200, data: result, message: "上传成功"});
  } catch (err) {
	logger.error(`FTP 文件上传失败 ${req.body}`);
	res.send({code: 1, data: null, message: err.message});
  }
});

module.exports = router;
