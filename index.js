const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();
const { UserModel, LogsModel, UserIpModel } = require("./db");
const { getWeatherByCity, getUser } = require("./api");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
