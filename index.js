const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");
const config = require("./common/config");
const {defaultLogger} = require("./logs");

const apiRouter = require("./routers/api");
const imgRouter = require("./routers/img");
const ftpRouter = require("./routers/ftp");
const qiniuRouter = require("./routers/qiniu");

const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
	const server = express();

	// 添加日志
	server.use(defaultLogger);

	const publicFile = path.resolve(__dirname, "public");
	server.use(express.static(publicFile));

	server.use(bodyParser.urlencoded({extended: false}));

	server.use(bodyParser.json());

	server.use("/api", apiRouter);
	server.use("/img", imgRouter);
	server.use("/ftp", ftpRouter);
	server.use("/qiniu", qiniuRouter);

	server.all('*', (req, res) => {
	  return handle(req, res)
	});

	server.listen(config.port, () => console.log(`listener port: http://localhost:${config.port}`));
  })
  .catch(err => {
	console.log("== server fail ==", err);
	process.exit(1);
  });
