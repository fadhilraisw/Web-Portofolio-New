const SecurityRule = require('../models/SecurityRule');

function normalizedIp(req) {
  const value = req.ip || req.socket?.remoteAddress || '';
  return value.replace(/^::ffff:/, '');
}

module.exports = async function securityMiddleware(req, res, next) {
  if (req.path === '/health' || req.path.startsWith('/uploads')) return next();
  const ipAddress = normalizedIp(req);
  try {
    const rules = await SecurityRule.find({ ipAddress }).lean();
    const whitelist = rules.find((rule) => rule.status === 'WHITELISTED');
    const banned = rules.find((rule) => rule.status === 'BANNED');
    if (banned && !whitelist) {
      return res.status(403).json({ success: false, message: 'Access denied by security controls' });
    }
    req.securityContext = { ipAddress, monitored: Boolean(rules.find((rule) => rule.status === 'MONITOR')) };
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports.normalizedIp = normalizedIp;
