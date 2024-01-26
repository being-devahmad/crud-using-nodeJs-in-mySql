const express = require("express");
const app = express();
const connection = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.get("/delete-data", (req, res) => {
  const deleteQuery = "DELETE FROM crud_table WHERE id = ?";
  connection.query(deleteQuery, [req.query.id], (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/data");
    }
  });
});

app.get("/data", (req, res) => {
  connection.query("SELECT * FROM crud_table", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.render("read.ejs", { rows });
    }
  });
});

app.get("/update-data", (req, res) => {
  const id = req.query.id; // Assuming id is in the query parameters
  const selectQuery = "SELECT * FROM crud_table WHERE id = ?";

  connection.query(selectQuery, [id], (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      if (rows.length > 0) {
        results = JSON.parse(JSON.stringify(rows[0]));
        console.log(results);
        res.render("edit.ejs", results);
      } else {
        // Handle the case where no data is found for the given id
        res.send("No data found for the given ID");
      }
    }
  });
});

app.post("/final-update", (req, res) => {
  // console.log(req.body);
  const id = req.body.hiddenId;
  const name = req.body.name;
  const email = req.body.email;
  const updateQuery = "UPDATE crud_table SET name = ? , email = ? WHERE id = ?";
  try {
    connection.query(updateQuery, [name, email, id], (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        // res.send(rows);
        res.redirect("/data");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/create", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  try {
    connection.query(
      "INSERT INTO crud_table (name ,email) values(? ,?)",
      [name, email],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          // res.send(rows);
          res.redirect("/data");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

// how to run
app.listen(process.env.PORT || 4000, (error) => {
  if (error) throw error;
  console.log(`server running on port ${process.env.PORT}`);
});
