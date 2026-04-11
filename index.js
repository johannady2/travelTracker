import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "ChibaKing82",
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

let visitedCountriesDB = [];
let totalCountriesVisited = 0;
let visitedCountriesCountryCodes = [];

db.query("SELECT country_code from visited_countries", (err, res) =>
{
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    visitedCountriesDB = res.rows;
    totalCountriesVisited = visitedCountriesDB.length;

    //console.log(visitedCountries);
  }
  db.end();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) =>
{
//NOTE: the solution1.js has a better code.

visitedCountriesDB.forEach(country =>
{
  visitedCountriesCountryCodes.push(country.country_code);
});

  res.render("index.ejs", { countries: visitedCountriesCountryCodes , total: totalCountriesVisited});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
