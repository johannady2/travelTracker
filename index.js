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







app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) =>
{
//NOTE: the solution1.js has a better code.

  let result = await db.query("SELECT country_code FROM visited_countries");

  let visitedCountriesCountryCodes = [];
  let totalCountriesVisited = result.rows.length;

  result.rows.forEach(country => {
  visitedCountriesCountryCodes.push(country.country_code);
});

  res.render("index.ejs", { countries: visitedCountriesCountryCodes , total: totalCountriesVisited});
});


//POSTING new country_code by writing a country name

app.post("/add", async (req,res)=>
{
  console.log(req.body.country);
    let result = await db.query(`SELECT country_code FROM countries WHERE country_name = $1`, [req.body.country]);
     if (result.rows.length !== 0)
     {
      console.log(result);
      await db.query('INSERT INTO visited_countries(country_code) VALUES($1)', [result.rows[0].country_code]);
      
     }
    res.redirect("/");
  
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
