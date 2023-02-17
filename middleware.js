module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.originalUrl === '/api/login') {
    req.method = 'GET';
  }
  next()
};