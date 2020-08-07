const fs = require("fs");
const path = require("path");
const FtpClient = require("ftp");
const config = require("../common/config");
const {logger} = require("../logs");

const client = new FtpClient();

// FTP 连接成功
client.on("ready", () => {
  logger.debug(`ftp client is ready`);
});
// FTP 连接关闭
client.on("close", () => {
  logger.debug(`ftp client is close`);
});
// FTP 连接错误
client.on("error", (err) => {
  logger.debug(`ftp client is error`);
});

// 连接 FTP
function connect() {
  client.connect(config.ftp);
}

// 关闭 FTP
function end() {
  client.end();
}

// 销毁 FTP
function destroy() {
  client.destroy();
}

function list(dirpath, callback = null) {
  return new Promise(async (resolve, reject) => {
	const {err: error, dir} = await cwd(dirpath);
	client.list((err, files) => {
	  if (err) {
		reject(message(1, "list err"));
		callback && callback(err);
	  } else {
		resolve(message(200, files));
		callback && callback(null, files);
	  }
	})
  });
}

// 切换目录
function cwd(dirpath, callback = null) {
  return new Promise((resolve, reject) => {
	client.cwd(dirpath, (err, dir) => {
	  if (err) {
		reject(message(1, err));
		callback && callback(err);
	  } else {
		resolve(message(200, "cwd ok"));
		callback && callback(null);
	  }
	})
  });
}

// 将文件上传到ftp目标地址
function put(currentFile, targetFilePath, callback = null) {
  return new Promise(async (resolve, reject) => {
	const dirpath = path.dirname(targetFilePath);
	const fileName = path.basename(targetFilePath);
	const rs = fs.createReadStream(currentFile);

	try {
	  const {err: error, dir} = await cwd(dirpath);//此处应对err做处理
	  client.put(rs, fileName, (err) => {
		if (err) {
		  throw new Error(err);
		} else {
		  resolve(message(200, "put ok"));
		  fs.unlink(currentFile, (err) => {
			if (err) throw new Error(err);
			logger.info(`临时文件${currentFile} 删除成功`);
		  });
		  callback && callback(null);
		}
	  });
	} catch (err) {
	  mkdir(dirpath)
		.then(async () => {
		  const result = await put(currentFile, targetFilePath, callback);
		  resolve(result);
		})
		.catch(err => {
		  reject(err);
		  callback && callback(err);
		});
	}
  })
}

// 创建文件夹
function mkdir(path, callback) {
  return new Promise((resolve, reject) => {
	client.mkdir(path, true, (err) => {
	  if (err) {
		reject(message(1, err));
		callback && callback(err);
	  } else {
		resolve();
		callback && callback();
	  }
	})
  })
}

//下载文件
function get(filePath, callback = null) {
  return new Promise(async (resolve, reject) => {
	try {
	  client.get(filePath, (err, rs) => {
		if (err) {
		  reject(message(1, err));
		} else {
		  let ws = fs.createWriteStream(filePath);
		  rs.pipe(ws);
		  resolve(message(200, rs));
		  callback && callback(null, rs);
		}
	  });
	} catch (err) {
	  reject(message(1, err));
	  callback && callback(err);
	}
  });
}

// 返回提示
function message(code, message) {
  return {code, message};
}

// 断点下载
/*fs.stat(localFile, (err, stats) => {
  var startSize = 0;
  if (err) {
	console.log('no file here');
  } else {
	startSize = stats.size;
  }
  console.log(`已经下载:${startSize},从此处开始下载`);
  c.restart(startSize, err => {
	if (err) {
	  console.log(err);
	  process.exit(0);
	}
	c.get(targetFile, (err, rs) => {
	  console.log('start download');
	  console.log(rs);
	  rs.on('data', data => {
		console.log(`写入${data.length}`);
		rs.pause();
		fs.appendFile(localFile, data, () => {
		  rs.resume();
		});
	  })
	  rs.on('close', () => {
		console.log('download complete')
		c.end();
	  })
	  // rs.pipe(fs.createWriteStream(localFile,{start : startSize}))
	})
  })
})*/

module.exports = {connect, end, destroy, list, cwd, get, put, mkdir};
