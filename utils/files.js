const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const config = require("../common/config");

/**
 * 判断路径是否存在，不存在则创建
 * @param path 路径
 * @returns {boolean}
 */
const isExists = (path) => {
  if (!!path.trim()) {
	if (fs.existsSync(path)) {
	  return true;
	} else {
	  fs.mkdirSync(path, {recursive: true}, (err) => {
		if (err) return false;
		return true;
	  });
	}
  } else {
	return false;
  }
};

/**
 * 修改文件名
 * @param oldPath 文件路劲
 * @param fileName 修改的文件名
 * @param newPath 修改后的文件路径
 * @returns {Promise<any>}
 */
const renameFile = (oldPath, fileName, newPath = config.upload.path) => {
  return new Promise((resolve, reject) => {
	isExists(newPath);
	if (!(oldPath && fileName)) {
	  reject({code: -1, data: "请正确填写参数"});
	} else {
	  fs.rename(oldPath, `${newPath}/${fileName}`, (err) => {
		if (err) reject({code: -1, data: "请正确填写目录"});
		resolve({code: 200, data: fileName});
	  })
	}
  })
};

/**
 * 上传文件获取列表
 * @param req
 * @returns {Promise<any>}
 */
const uploadFiles = (req) => {
  return new Promise((resolve, reject) => {
	isExists(config.upload.tmp);
	const form = new formidable.IncomingForm();
	form.multiples = true;
	form.uploadDir = config.upload.tmp;
	form.hash = "md5";
	form.parse(req, async (err, fields, files) => {
	  if (err) {
		throw new Error("上传失败");
	  }
	  if (files.file) {
		let list = files.file;
		if (!list.length) {
		  list = [files.file]
		}
		const len = list.length;
		const result = [];
		for (let i = 0; i < len; i++) {
		  const item = list[i];
		  const name = item.hash;
		  const extname = path.extname(item.name);

		  result.push({path: item.path, hash: item.hash, name: `${name}${extname}`});
		}
		resolve(result);
	  } else {
		reject("请上传文件");
	  }
	});
  });
}

module.exports = {isExists, renameFile, uploadFiles};
