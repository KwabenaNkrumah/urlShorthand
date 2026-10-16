const { Pool } = require("pg");

const pool = new Pool({
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
});

(async function () {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("database successfully connected");
    console.log(`Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.log("database couldn't connected");
    console.log(err.message);
  }
})();

module.exports = pool;
