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
app.get("/weather", (req, res) => {
  res.render("weather");
});
app.get("/github", (req, res) => {
  res.render("githubUsers");
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

// app.get("/user/:id", async (req, res) => {
//   try {
//     // Assuming UserModel has a method to find a user by their ID
//     const user = await UserModel.findById(req.params.id);

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     // Render the user info using the user.ejs template
//     res.render("user", { user });
//   } catch (error) {
//     console.error("Error retrieving user:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
