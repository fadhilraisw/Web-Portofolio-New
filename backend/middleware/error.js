const multer = require('multer');
module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err instanceof multer.MulterError ? 400 : (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  res.status(status).json({ success:false, message: status === 500 ? 'Internal server error' : err.message, ...(err.errors ? {details:Object.values(err.errors).map(e=>e.message)} : {}) });
};
