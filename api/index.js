require("dotenv").config();
const express = require("express");
const http = require("http");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

async function init() {
  // Create pool for Postgres DB
  const pool = await new Pool({
    user: process.env.PGUSER, // Update with your username if building locally
    host: process.env.PGHOST, // Change to localhost if building locally
    database: process.env.PGDATABASE, // Update with correct database name if building locally
    password: process.env.PGPASSWORD, // password: 'postgres_password', //update accordingly
    port: process.env.PGPORT,
  });

  // Routes
  app.post("/login", async (req, res) => {
    try {
      const login = req.body;
      res.json("logged in");
      user.key = login.key;
    } catch (error) {
      console.error(error.message);
    }
  });

  app.get("/logout", async (req, res) => {
    try {
      const login = {};
      res.json("logged out");
      console.log(login);
      user.key = login;
    } catch (error) {
      console.error(error.message);
    }
  });

  app.post("/api", async (req, res) => {
    try {
      const { description } = req.body;
      const newTodos = await pool.query(
        "INSERT INTO todos (description) VALUES($1) RETURNING *",
        [description]
      );
      res.json(newTodos.rows[0]);
    } catch (error) {
      console.error(error.message);
    }
  });

  app.get("/api", async (req, res) => {
    try {
      const allTodos = await pool.query("SELECT * FROM todos");
      res.json(allTodos.rows);
    } catch (error) {
      console.error(error.message);
    }
  });

  app.delete("/api/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteTodos = await pool.query("DELETE FROM todos WHERE _id = $1", [
        id,
      ]);
      res.json("To-do task deleted");
    } catch (error) {
      console.error(error.message);
    }
  });

  app.set("port", 5000);
  const server = http.createServer(app);

  server.listen(app.get("port"), cors(), function () {
    console.log("The API server is now live");
  });

  // We can also detect flag changes, feel free to uncomment this section to see this in action
  /*
reload(app).then((reloadReturned) => {
client.on('update:apiFlag', () => {
		console.log('the flag has changed'); 
		reloadReturned.reload();
		})
	})
	.catch(function (err) {
		console.error(
		  "Reload could not start, could not start server/sample app",
		  err
		);
	  });
*/
}

init();
