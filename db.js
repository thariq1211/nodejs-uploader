const PostgreSQL = require("pg").Pool;

const pool = new PostgreSQL({
  host: "10.14.17.94",
  user: "postgres",
  password: "cidengbarat",
  database: "asterisk",
  port: 5432
});

module.exports = pool;