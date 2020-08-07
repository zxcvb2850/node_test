const {CODE_SUCCESS, CODE_ERROR} = require("./constant");

const sendSuccess = (res, {code = CODE_SUCCESS, data = null, message = "success"}) => {
  res.json({
	code,
	data,
	message,
  })
};

const sendError = (res, {status = CODE_SUCCESS, code = CODE_ERROR, data = null, message = "error"}) => {
  res.status(status).json({
	code,
	data,
	message,
  })
};

module.exports = {
  sendSuccess,
  sendError,
};
