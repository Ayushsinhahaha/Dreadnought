const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

// home
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// about
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

app.get("/student", (req, res) => {
  res.sendFile(__dirname + "/student.html");
});

app.get("/social", (req, res) => {
  res.sendFile(__dirname + "/social.html");
});

//signin

app.get("/signin", (req, res) => {
  res.render("login");
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.get("/signup", (req, res) => {
  res.render("register");
});

app.post("/signup", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.get("/logout", (req, res) => {
  res.render("home");
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

app.get("/secrets", (req, res) => {
  res.render("secrets");
});

app.post("/secrets", (req, res) => {
  res.render("secret");
});

app.get("/faq", (req, res) => {
  res.sendFile(__dirname + "/faq.html");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port 3000");
});
