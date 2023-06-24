const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const jwtToken = req.headers["authorization"];

    if (!jwtToken) {
      return res.status(400).json({
        message: "no JWT Token provided",
      });
    }

    const verify = jwt.verify(jwtToken.split(" ")[1], process.env.JWT_KEY);
    if (!verify) {
      return res.status(403).json({
        message: "failed to authenticate JWT Token",
      });
    }

    req.user = verify;
    next();
  } catch (error) {
    res.status(500).json({
      message: "error occuired",
      data: error.message,
    });
  }
};
