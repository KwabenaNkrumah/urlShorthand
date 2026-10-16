const pool = require("./db");
const jwt = require("jsonwebtoken");

async function generateShortcode(size) {
  try {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let code = "";
    let exists = true;

    while (exists) {
      // Generate code
      for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }

      // Check if code exist
      const query = await pool.query(
        "SELECT EXISTS (SELECT 1 FROM url WHERE short_code = $1);",
        [code],
      );

      exists = query.rows[0].exists;
    }

    return code;
  } catch (err) {
    console.log(err.message);
  }
}

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateShortcode,
  generateToken,
  verifyToken,
};
