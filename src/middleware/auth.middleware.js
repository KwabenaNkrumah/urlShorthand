const { verifyToken } = require("./../utils");

function authenticateMiddleware(req, res, next) {
  try {
    //Get Authorizaton header
    const authHeader = req.headers.authorization;

    //Check if header exists
    if (!authHeader)
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });

    //Header format: Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });

    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

module.exports = authenticateMiddleware;
