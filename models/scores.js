module.exports=function(sequelize, DataTypes){
    var Scores = sequelize.define("Scores", {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        score: DataTypes.BIGINT.UNSIGNED,
        start: DataTypes.TIME,
        end: DataTypes.TIME
    });
    return Scores;
};