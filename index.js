const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./common/config");
const {defaultLogger} = require("./logs");

const index = require("./routers/index");
const imgRouter = require("./routers/img");
const ftpRouter = require("./routers/ftp");
const qiniuRouter = require("./routers/qiniu");

const app = express();

// 添加日志
app.use(defaultLogger);

const publicFile = path.resolve(__dirname, "public");
app.use(express.static(publicFile));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use("/", index);
app.use("/img", imgRouter);
app.use("/ftp", ftpRouter);
app.use("/qiniu", qiniuRouter);

app.listen(config.port, () => console.log(`listener port: ${config.port}`));
