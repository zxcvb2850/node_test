const fs = require("fs");
const qiniu = require("qiniu");
const config = require("../common/config");
const {logger} = require("../logs");

const putPolicy = new qiniu.rs.PutPolicy({scope: config.qiniu.bucket}); // 指定七牛云存储空间

const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK); // 鉴定对象
const uploadToken = putPolicy.uploadToken(mac); // 获取上传凭证

const qn = {};

qn.uptoken = () => {
  return {
	domain: config.qiniu.domain,
	token: uploadToken,
  }
};

qn.upload = (filePath, fileName, callback = null) => {
  return new Promise((resolve, reject)=>{
	const qiniuConfig = new qiniu.conf.Config();
	qiniuConfig.zone = qiniu.zone[config.qiniu.zone];
	qiniuConfig.useHttpsDomain = true;

	const formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
	const putExtra = new qiniu.form_up.PutExtra();

	const readableStream = fs.createReadStream(filePath);

	formUploader.putStream(uploadToken, fileName, readableStream, putExtra, (respErr, respBody, respInfo) => {
	  if (respErr) {
		console.log("上传失败", respErr);
		reject(respErr);
		callback && callback(respErr);
		throw respErr;
	  }
	  if (respInfo.statusCode === 200) {
		console.log("**res**", respBody);
		resolve(respBody);
		fs.unlink(filePath, (err) => {
		  if (err) throw new Error(err);
		  logger.info(`临时文件${filePath} 删除成功`);
		});
		callback && callback(null, respBody);
	  } else {
		console.log("=respInfo=", respInfo);
		console.log("=code=", respInfo.statusCode);
		console.log("==respBody==", respBody);
		reject(respInfo);
		callback && callback(respInfo, respBody);
	  }
	});
  });
};

module.exports = qn;
