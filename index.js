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

console.log(await allVisitedCountryCodes());
  let visitedCountriesCountryCodes = await allVisitedCountryCodes();
  let totalCountriesVisited = visitedCountriesCountryCodes.length;



  res.render("index.ejs", 
    { countries: visitedCountriesCountryCodes ,
       total: totalCountriesVisited,
      error: req.query.error === "notfound" ? "Country not found" : null

    });
});


//POSTING new country_code by writing a country name

app.post("/add", async (req,res)=>
{
  console.log(req.body.country);
    let result = await db.query(`SELECT country_code FROM countries WHERE country_name ILIKE $1`, [req.body.country]);
     if (result.rows.length !== 0)
     {
      console.log(result);
      if (await countryAlreadyAdded(result.rows[0].country_code))
      {
        console.log(await allVisitedCountryCodes());
        let codes = await allVisitedCountryCodes();
        let totalCountries = codes.length;

        return res.render("index.ejs", {
          countries: codes,
          total: totalCountries,
          error: "Country already exists in the visited list"
        });
      }
      else
      {
        await db.query('INSERT INTO visited_countries(country_code) VALUES($1)', [result.rows[0].country_code]);
      
      res.redirect("/");
      }
    }
     else
     {
      
       console.log(await allVisitedCountryCodes());
      let codes = await allVisitedCountryCodes();
      let totalCountries = codes.length;



        return res.render("index.ejs", {
          countries: codes,
          total: totalCountries,
          error: "Please enter a valid country name."
        });
     }
    
  
});

const allVisitedCountryCodes = async () =>
{
  const result = await db.query("SELECT country_code FROM visited_countries");

  let country_codes = [];
  result.rows.forEach((country) => {
    country_codes.push(country.country_code);
  });
  return country_codes;
};

const countryAlreadyAdded = async (country_code) =>
{
  const result = await db.query("SELECT country_code FROM visited_countries WHERE country_code = $1", [country_code]);

  if (result.rows.length !== 0)
  {
    return true;
  }
  else
  {
    return false;
  } 
};


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
