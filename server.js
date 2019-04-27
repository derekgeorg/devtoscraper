var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models")

var PORT = process.env.PORT || 3000;

var app = express();

//Middleware

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// app.engine("handlebars", exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/devtoscraper";
mongoose.connect(MONGODB_URI, { useNewURLParser: true });

console.log("this part is working");

//scrape route
app.get("/scrape", function (req, res) {
    // res.render("home", {scrapedArticle: articles})
    axios.get("https://dev.to/").then(function (response) {
        var $ = cheerio.load(response.data);
      

        $("h3").each(function (i, element) {
            
            var result = {};

            //add title
            result.title = $(this).text();
                

            //add summary - site has no summary
            // result.summary = $(this)

            //add link
            result.link = $(this)
                .children("a")
                .attr("href");

            console.log(result);

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

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
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