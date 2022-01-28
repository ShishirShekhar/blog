// import required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// initialize the app
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
dotenv.config()

// connect mongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wbjmy.mongodb.net/blogDB?retryWrites=true&w=majority`);

// add some content for different pages.
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// create a schema for blog posts
const postsSchema = mongoose.Schema({
  title: String,
  content: String
});
// create a model for the schema
const Post = mongoose.model("Post", postsSchema);


// get route home
app.get("/", function(req, res) {
  // get the list items
  Post.find({}, function(err, foundList) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("home", {homeContent: homeStartingContent, blogs: foundList});
    }
  });
});


// get route post title
app.get("/posts/:id", function(req, res) {
  // get the of requested title
  const id = req.params.id;
  console.log(id);
  // find the title by id
  Post.findById(id, function(err, foundList) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      console.log(foundList);
      res.render("post", {title: foundList.title, content: foundList.content});
    }
  });
});


// get route about
app.get("/about", function(req, res) {
  res.render("about", {content: aboutContent});
});


// get route contact
app.get("/contact", function(req, res) {
  res.render("contact", {content: contactContent});
});


// get route compose
app.get("/compose", function(req, res) {
  res.render("compose");
});


// post route compose
app.post("/compose", function(req, res) {
  // create new post
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  // save new post
  post.save(function(err) {
    if (err) {
      console.log(err);
    }
  });

  // redirect to home
  res.redirect("/");
});


// host the app
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});