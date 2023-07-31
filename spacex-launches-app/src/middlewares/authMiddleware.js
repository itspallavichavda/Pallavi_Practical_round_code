
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access of api, header authorization is missing in header envelop please check your request' });
  }

  try {
    const decoded = jwt.verify(token, 'JWT_SECRET_KEY');
    req.user = decoded.user;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized Token! Please Check you token' });
  }
};

module.exports = authMiddleware;
