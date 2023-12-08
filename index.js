//all the required modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const { checkForAuthenticationCookie } = require("./middlewares/auth");

//port of the server and server establishment point
const app = express();
const port = 8000;
//connecting the database to the server
mongoose
  .connect("mongodb://localhost:27017/blogapp")
  .then((e) => console.log("mongodb connected"));
//doing ssr with ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
//make cookie for authentication
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
// when / is called it takes you to home  and render it to user
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort("createdAt");
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
//using the router with /user  and server started with listen
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.listen(port, () => console.log(`server started ${port}`));
