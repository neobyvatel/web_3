const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const path = require("path");

const port = 3000;
const app = express();
const { UserModel, LogsModel, UserIpModel } = require("./database");
// index.js

const { getWeatherByCity, getGithubUser, getStockInfo } = require("./api");

const { getWindDirection, getCurrentTimeString } = require("./utils");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "pages"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const user = getUserInstance(req.ip);
  res.render("home", {
    activePage: "home",
    user: user ? user : null,
    error: null,
  });
});
app.get("/weather", async (req, res) => {
  const user = getUserInstance(req.ip);
  res.render("weather", {
    activePage: "weather",
    data: null,
    user: user ? user : null,
    error: null,
  });
});

app.post("/weather", async (req, res) => {
  const user = await getUserInstance(req.ip);
  const city = req.body.city;

  const weatherData = await getWeatherByCity(city);

  if (!weatherData) {
    LogsModel.create({
      user: user ? user._id : null,
      request_type: "weather",
      request_data: city,
      status_code: "404",
      timestamp: new Date(),
      response_data: null,
    });
    return res.render("weather", {
      activePage: "home",
      user: user ? user : null,
      error: "City not found",
      city: null,
      data: null,
    });
  }

  weatherData.wind_direction = getWindDirection(weatherData.wind_deg);
  weatherData.description =
    weatherData.description.charAt(0).toUpperCase() +
    weatherData.description.slice(1);
  weatherData.time = getCurrentTimeString();

  res.render("weather", {
    activePage: "search",
    user: user ? user : null,
    data: weatherData,
    city: city,
    error: null,
  });
  LogsModel.create({
    user: user ? user._id : null,
    request_type: "weather",
    request_data: city,
    status_code: "200",
    timestamp: new Date(),
    response_data: JSON.stringify(weatherData),
  });
});

app.get("/search", async (req, res) => {
  const user = getUserInstance(req.ip);
  res.render("search", {
    activePage: "search",
    user: user ? user : null,
    error: null,
  });
});

app.get("/stocks", async (req, res) => {
  const user = getUserInstance(req.ip);
  res.render("stocks", {
    activePage: "stocks",
    user: user ? user : null,
    error: null,
  });
});

app.get("/api/stocks/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try {
    const stockInfo = await getStockInfo(symbol);
    if (stockInfo) {
      res.json(stockInfo);
    } else {
      res.status(404).json({ error: "Stock not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/register", (req, res) => {
  res.render("register", { activePage: "register", error: null, user: null });
});
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    res.render("register", {
      activePage: "signup",
      error: "All fields are required",
      user: null,
    });
    return;
  }

  let userInstance = await UserModel.findOne({ username: username }).exec();

  if (userInstance) {
    res.render("register", {
      activePage: "register",
      error: "User already exists",
      user: null,
    });
    return;
  }

  userInstance = new UserModel({
    username: username,
    email: email,
    password: password,
  });
  await userInstance.save();

  await UserIpModel.create({ ip: req.ip, user: userInstance._id });
  res.status(303).redirect("/");
  LogsModel.create({
    user: userInstance._id,
    request_type: "signup",
    request_data: username,
    status_code: "200",
    timestamp: new Date(),
    response_data: "success",
  });
});
app.get("/api/github/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const githubUser = await getGithubUser(username);
    if (githubUser) {
      res.json(githubUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/login", async (req, res) => {
  const user = getUserInstance(req.ip);
  res.render("login", { activePage: "login", error: null, user: null });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
async function getUserInstance(ip) {
  let username = await UserIpModel.findOne({ ip: ip }).exec();
  username = username ? username.user : null;

  let userInstance = null;
  if (username) {
    userInstance = await UserModel.findOne({ _id: username }).exec();
  }

  return userInstance;
}
