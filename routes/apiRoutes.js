var db=require("../models");

module.exports=function(app){
    app.get("/api/scores", function(req, res){
        db.Scores.findAll({}).then(function(dbScores){
            res.json(dbScores);
        });
    });

    app.post("/api/scores", function(req, res){
        db.Scores.create({
            name: req.body.name,
            score: req.body.score,
            start: req.body.start,
            end: req.body.end
        }).then(function(dbScores){
                res.json(dbScores);
        });
    });
};