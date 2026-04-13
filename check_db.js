import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "ChibaKing82",
  port: 5432,
});

db.connect();

(async () => {
  try {
    const result = await db.query("SELECT * FROM visited_countries");
    console.log("Rows in visited_countries:", result.rows);
    db.end();
  } catch (err) {
    console.error(err);
    db.end();
  }
})();