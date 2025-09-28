const express = require("express");
const app = express();
const path = require("path");
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'twitter',
  password:'DBMS@123'
});
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended : true}));
app.use(express.json());


//home page
app.get("/tweets", (req, res) => {
    let q = "SELECT * FROM user";
    connection.query(q,(err, result) => {
    if(err) {
      console.error(err);
      return res.send("Error loading tweets.");
    }
    res.render("home", { tweets: result });
    });
});

//new tweet
app.post("/tweets/new",(req,res) => {
  const {username,content} = req.body;
  const q = "INSERT INTO user (username,content) VALUES (?,?)";

  connection.query(q,[username, content],(err,result) => {
    if(err) {
      console.error(err);
      return res.send("Error saving tweet.");
    }
    res.redirect("/tweets");
  });
});

//edit
app.put("/tweets/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;  // new content from form

  const q = "UPDATE user SET content = ? WHERE id = ?";

  connection.query(q, [content, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Error updating tweet.");
    }
    res.redirect("/tweets");  // redirect back to home page after updating
  });
});

//delete
app.delete("/tweets/:id",(req,res) => {
  let {id} = req.params;
  const q = "DELETE FROM user WHERE id = ?";
  connection.query(q,[id],(err,result) => {
    if(err){
      console.log(err);
      return res.send("Error deleting tweet.");
    }
    res.redirect("/tweets");
  });

});

//like 
app.post("/tweets/:id/like", (req, res) => {
  const { id } = req.params;
  const q = "UPDATE user SET likes = likes + 1, liked = 1 WHERE id = ?";
  connection.query(q, [id], (err, result) => {
    if (err) return res.send("Error liking tweet.");
    res.redirect("/tweets");
  });
});


app.listen(8080, () => {
    console.log("server is listening toport 8080");
});