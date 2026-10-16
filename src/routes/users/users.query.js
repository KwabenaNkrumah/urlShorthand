const pool = require("./../../db");

async function registerUserQuery(userName, email, password) {
  const query = `INSERT INTO users(user_name,email,user_password)
                    VALUES ($1, $2,$3)
                    RETURNING id, user_name, created_at`;

  const results = await pool.query(query, [userName, email, password]);

  return results.rows[0];
}

async function checkIfEmailExistQuery(email) {
  const query = `SELECT EXISTS (
                    SELECT 1 FROM users 
                    WHERE email = $1
                    )`;

  const results = await pool.query(query, [email]);

  return results.rows[0].exists;
}

async function findUserQuery(email) {
  const query = `SELECT id, user_name, user_password, email
                  FROM users
                  WHERE email = $1`;

  const results = await pool.query(query, [email]);

  return results.rows[0];
}

module.exports = {
  registerUserQuery,
  checkIfEmailExistQuery,
  findUserQuery,
};
