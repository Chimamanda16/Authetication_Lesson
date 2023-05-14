require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then((res) =>{
    app.listen("3000", (req, res) =>{
        console.log("Server has started on port 3000");
    });
});

const userSchema = new mongoose.Schema({
    Email: String,
    Password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["Password"]});

const Item = mongoose.model("User", userSchema);

// Handle requests to the home page
app.get("/", (req, res) =>{
    res.render("home");
});
// Handle requests to the login page
app.get("/login", (req, res) =>{
    res.render("login");
});
// Handle requests to the register page
app.route("/register")
.get((req, res) =>{
    res.render("register");
})
.post((req, res) =>{
    console.log(req.body);
    const newUser = new Item({
        Email: req.body.username,
        Password: req.body.password
    });
    newUser.save().then(response =>{
        res.render("secrets");
    }).catch((err) =>{
        console.log(err);
    });
});
// Handle requests to the login page
app.route("/login")
.get((req, res) =>{
    res.render("login");
})
.post((req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    Item.findOne({Email: username})
    .then((response) =>{
        if(response.Password === password){
            res.render("secrets");
        }
        else{
            res.send("Email/Password is incorrect");
        }
    }).catch((err) =>{
        console.log(err);
    });

});