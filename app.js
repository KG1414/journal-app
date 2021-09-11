//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
var _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const port = 3000;

// posts.forEach(function (post) {
//   const storedPost = post.postBody;
//   const truncatedPost = storedPost.split('').splice(0, 10).join(" ");  //splits into 10 words, rather than 100 characters as it does from home.ejs
// });

//Schema
const journalSchema = new mongoose.Schema({
  title: String,
  body: String
});

//Model
const Journal = mongoose.model("Journal", journalSchema);



app.get("/", function (req, res) {

  Journal.find({}, function (err, journals) {
    res.render("home", {
      homeContent: homeStartingContent,
      posts: journals
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { about: aboutContent });
})

app.get("/contact", function (req, res) {
  res.render("contact", { contact: contactContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.post("/compose", function (req, res) {
  const title = req.body.postTitle;
  const body = req.body.postBody;

  const journal = new Journal({
    title: title,
    body: body
  });

  journal.save(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err);
    }
  });

  // const post = { postTitle: title, postBody: body };
  // posts.push(post);
});

app.get("/posts/:journalTitle/:_id", function (req, res) {

  const requestedPostId = req.params._id;
  // const reqJournalTitle = _.capitalize(req.params.journalTitle);

  Journal.findById(requestedPostId, (err, foundJournals) => {
    if (err) {
      console.log(err + " error occured");
    } else {
      console.log("These are the found journals " + foundJournals);
      res.render("post", {
        title: foundJournals.title,
        body: foundJournals.body
      })
    }
  });
});

// const requestedPostId = req.params.postId;

// Journal.findOne({ "_id": requestedPostId }, function (err, journals) {

//   res.render("post", {
//     title: journals?.title,
//     body: journals?.body
//   });
// });


app.listen(process.env.PORT || port, function () {
  if (process.env.PORT) {
    console.log(`Server started successfully`);
  } else {
    console.log(`Server started on port:${port}`);
  }
});

