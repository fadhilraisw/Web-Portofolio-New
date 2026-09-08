const mongoose = require('mongoose');
const asyncHandler = (fn) => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const fail = (res,status,message,details) => res.status(status).json({success:false,message,...(details ? {details} : {})});
module.exports = { asyncHandler, isValidId, fail };
