// Import necessary modules
const express = require("express");
const ejs = require("ejs");

// Create an Express application
const app = express();
app.use(express.static("public"));
// Set EJS as the view engine
app.set("view engine", "ejs");

// Define a route to render an EJS template
app.get("/", (req, res) => {
  // Render the EJS template named 'index.ejs' in the 'views' directory
  res.render("index", { message: "Hello, EJS!" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
