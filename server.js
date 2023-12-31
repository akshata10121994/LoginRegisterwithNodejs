if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverrirde = require("method-override");

const initializePassport = require("./passport-config.js");

//here we are calling initialize function which we written in passport-config.js file
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
const users = [];
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverrirde("_method"));

app.get("/", (req, res) => {
  res.render("index.ejs", { name: "kyle" });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureflash: true,
  })
);

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  try {
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedpassword,
    });
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.redirect("/register");
  }
  console.log(users);
});

app.delete("/logout", (req, res,next) => {
  req.logOut(function(err){
    if(err){
      return next(err)
    }
  });
  res.redirect("/login");
});
app.listen(3000);
