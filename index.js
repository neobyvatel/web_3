const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const port = 3000;
const app = express();
const { UserModel, LogsModel, UserIpModel } = require("./db");
const { getWeatherByCity, getGithubUser, getStockInfo } = require("./api");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "pages"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/weather", (req, res) => {
  res.render("weather", { data: null, error: null, city: null });
});
// app.post("/weather", async (req, res) => {
//   const user = await getUserInstance(req.ip);
//   const city = req.body.city;

//   const weatherData = await getWeatherByCity(city);

//   if (!weatherData) {
//     LogsModel.create({
//       user: user ? user._id : null,
//       request_type: "weather",
//       request_data: city,
//       status_code: "404",
//       timestamp: new Date(),
//       response_data: null,
//     });
//     return res.render("weather", {
//       activePage: "home",
//       user: user ? user : null,
//       error: "City not found",
//       city: null,
//       data: null,
//     });
//   }

//   weatherData.wind_direction = getWindDirection(weatherData.wind_deg);
//   weatherData.description =
//     weatherData.description.charAt(0).toUpperCase() +
//     weatherData.description.slice(1);
//   weatherData.time = getCurrentTimeString();

//   res.render("weather", {
//     activePage: "weather",
//     user: user ? user : null,
//     data: weatherData,
//     city: city,
//     error: null,
//   });
//   LogsModel.create({
//     user: user ? user._id : null,
//     request_type: "weather",
//     request_data: city,
//     status_code: "200",
//     timestamp: new Date(),
//     response_data: JSON.stringify(weatherData),
//   });
// });

app.get("/search", (req, res) => {
  res.render("search", { data: null, error: null, user: null });
});
app.get("/stocks", (req, res) => {
  res.render("stocks");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
