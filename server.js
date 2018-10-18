var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/articlesDB";


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.set('useCreateIndex', true);

//HTML routes
app.get("/", function (req, res) {
    res.sendfile(__dirname + "/public/index.html");
});

app.get("/saved", function (req, res) {
    res.sendfile(__dirname + "/public/saved.html");
});

//api routes

//gets articles 
app.get("/api/articles/:saved", function (req, res) {
    db.Article.find({ saved: req.params.saved })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//updates saved property of clicked article
app.put("/article/:id/:saved", function (req, res) {
    db.Article.update({ _id: req.params.id }, { $set: { saved: req.params.saved } })
        .then(function (data) {
            res.json(data);

        })
        .catch(function (err) {
            return res.json(err);
        });
});

//save notes
app.post("/notes", function (req, res) {
    db.Note.create({ body: req.body.text })
        .then(function (data) {
            db.Article.update({ _id: req.body.id }, { $push: { note: data._id } })
                .then(function (data1) {
                    console.log(data1);
                    res.json(data1);
                })
        })
        .catch(function (err) {
            res.json(err);
        });
});

//get article's notes
app.get("/api/notes/:id", function (req, res) {
    db.Article.find({ _id: req.params.id })
        .then(function (data) {
            console.log(data);
            res.json(data);
            // data.note.forEach(item => {
            //     db.Note.find({ _id: item })
            //         .then(function (data1) {
            //             console.log(data1);
            //             res.json(data1);
            //         })
            // })
        })
        .catch(function (err) {
            res.json(err);
        });
});

//delete all articles
app.delete("/article/delete", function(req, res) {
    db.Article.remove({})
    .then(function (data) {
        db.Note.remove({})
        .then(function (data) {
            res.json(data);

        })
        .catch(function (err) {
            return res.json(err);
        });
    })
    .catch(function (err) {
        return res.json(err);
    });
})


app.get("/scrape", function (req, res) {
    axios.get("https://www.huffpost.com/life/topic/home-decor").then(function (response) {
        var $ = cheerio.load(response.data);

        $("h2.card__headline__text").each(function (i, element) {
            var result = {};

            result.title = $(this).text();
            result.link = $(this).parent().attr("href");
            result.author = $(this).parent().parent().parent().children(".card__byline").text();
            result.summary = $(this).parent().parent().parent().children(".card__description").text();
            result.image = $(this).parent().parent().parent().parent().children().children().children().children("img").attr("src");
            result.saved = false;
            // console.log(result);

            db.Article.create(result)
                .then(function (data) {
                    // console.log(data);
                })
                .catch(function (err) {
                    return res.json(err);
                });
        })
        res.send("Scrape Complete");
    });
});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});


