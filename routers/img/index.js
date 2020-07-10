const path = require("path");
const express = require("express");
const router = express.Router();
const config = require("../../common/config");
const {renameFile, uploadFiles} = require("../../utils/files");
const {logger} = require("../../logs");

router.post("/upload", async (req, res, next) => {
  try {
	const uploadFile = await uploadFiles(req);
	const len = uploadFile.length;
	const result = [];
	for (let i = 0; i < len; i++) {
	  const item = uploadFile[i];
	  const {path, name} = item;
	  const fileUrl = await renameFile(path, name);
	  if (fileUrl && fileUrl.code === 200) {
		result.push(`/upload/${fileUrl.data}`);
	  } else {
		throw new Error({message: "文件修改失败"});
	  }
	}
	logger.info(`本地 文件上传成功 ${JSON.stringify(result)}`);
	res.send({code: 200, data: result, message: "上传成功"});
  } catch (err) {
	logger.error(`本地 文件上传失败 ${err.message}`);
	res.send({code: 1, data: null, message: err.message});
  }
});

router.get("/download/:id", (req, res, next) => {
  const id = req.params.id;
  const targetPath = path.resolve(config.upload.path, id);
  res.download(targetPath, id);
});

module.exports = router;
