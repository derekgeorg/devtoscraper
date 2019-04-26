var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var logger = require("morgan");
// var handlebars = require("handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
// var bodyParser = require("bodyparser")

var PORT = process.env.PORT || 3000;

var db = require("./models")

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/devtoscraper", { useNewParser: true });

//scrape route
app.get("/scrape", function (req, res) {
    axios.get("http://www.dev.to/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.content").each(function (i, element) {
            var result = {};

            //add title
            result.title = $(this)
                .children("h3")
                .text();

            //add summary
            // result.summary = $(this)

            //add link
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape Complete")
    });
});

//app.get("/") - index.html

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        });
});

//app.get(/savedArticles) - saved articles w/buttons db.article.find res.render
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//app.post(/note)
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
    return db.Article.findOneAndUpdate({_id: req.params.id }, {note: dbNote._id }, {new: true });
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});
//app.delete("")

//start server

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});