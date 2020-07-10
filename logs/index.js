const path = require("path");
const log4js = require("log4js");
const config = require("../common/config");
const {isExists} = require("../utils/files");

const logPath = config.log.path;
const logFile = path.resolve(logPath, "cheese.log");

isExists(logPath);

const configure = {
  appenders: {
	file: {
	  type: 'dateFile',
	  filename: logFile,
	  daysToKeep: 30,
	  keepFileExt: true,
	  pattern: "yyyy-MM-dd",
	},
	console: {type: "console"},
  },
  categories: {
	default: {appenders: ["console", "file"], level: "trace"}
  }
};

log4js.configure(configure);
const logger = log4js.getLogger('');
const defaultLogger = log4js.connectLogger(logger, {level: 'auto', format: ':method :url'});

module.exports = {logger, defaultLogger};
