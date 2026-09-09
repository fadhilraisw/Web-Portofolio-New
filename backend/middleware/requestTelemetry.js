const Telemetry = require('../models/Telemetry');

module.exports = function requestTelemetry(req, res, next) {
  if (req.path === '/health' || req.path.startsWith('/uploads') || req.path.startsWith('/api/telemetry')) return next();
  res.on('finish', () => {
    if (!req.securityContext?.monitored && !req.path.startsWith('/api/auth') && !req.path.startsWith('/api/visitor-sessions')) return;
    Telemetry.create({
      action: 'HTTP_REQUEST',
      details: { method: req.method, path: req.path, statusCode: res.statusCode },
      ipAddress: req.securityContext?.ipAddress || req.ip,
      userAgent: req.get('user-agent'),
      sessionId: req.body?.sessionId,
      email: req.body?.email || req.body?.identity?.email,
      identity: req.body?.identity || {}
    }).catch((error) => console.error('Request telemetry failed:', error.message));
  });
  return next();
};
