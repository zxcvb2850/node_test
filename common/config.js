// 基础配置

module.exports = {
  // 端口
  port: 9797 || process.env.PORT,

  // 数据库配置
  mysql: {
	host: "118.89.16.43",
	port: 6033,
	user: "blog_water_2048",
	password: "MLjT8PdeR6MXDwZH",
	database: "blog_water_2048",
  },

  // 上传相关的
  upload: {
	// 缓存目录
	tmp: process.cwd() + '/runtime/tmp',
	// 上传目录
	path: process.cwd() + '/public/upload'
  },
  // FTP相关的
  ftp: {
	host: "118.89.16.43",
	port: 21,
	user: "xiaobai2850",
	password: "wang1234..",
	connTimeout: 1000 * 10, // 连接超时时间
	pasvTimeout: 1000 * 10, // PASV data 连接超时时间
	keepalive: 1000 * 10, // 多久发送一次请求，以保持连接
	upload: "/files",
	path: "//img.qhyking.com"
  },
  // 七牛云
  qiniu: {
	upload: "files",
	domain: "//cdn.qhyking.com/",
	AK: "fGqdsR7GeeDW9id1txp87-uUYMMKleE4re4wxXqe", // AK
	SK: "bXYb52VzQxSZTV3NnAV7-7t1ude4k4GCNLBFaeJL", // SK
	bucket: "2856", // 七牛云储存空间名
	zone: "Zone_z0",
  },

  // log
  log: {
	path: process.cwd() + '/runtime/logs'
  }
};
