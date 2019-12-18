var db=require("../models");

module.exports=function(app){
    app.get("/", function(req, res){
        res.render("index");
    });

    app.get("/scores", function(req, res){
        db.Scores.findAll({}).then(function(dbScores){
            var scoresArray=res.json(dbScores);
            res.render("scores", {scores: scoresArray});
        });
    });
};