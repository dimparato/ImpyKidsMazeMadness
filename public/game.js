//Instantiation of Game
var game=new Phaser.Game({
    type: Phaser.AUTO,
    title: "Impy Kids in Maze Madness",
    width: 640,
    height: 640,
    parent: "playArea",
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {x: 0, y: 0}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: "#000000",
});

//Necessary Global Variables
var playerData=new Object();
var gameOver=false;
var poweredUp=false;
var enemyPoweredUp=false;
var powerUp;
var scoreText;
var score=0;
var player;
var enemy;
var cursors;
var floor;
//var blocks;
var blockLayer;
//var blockConfig={key: "blocks"};
var blockBreaking;
//var tempTile;

function preload(){

    $(window).on("load", function(){
        $("#nameForm").modal("show");
    $("#nameSubmit").on("click", function(){
        playerData.name=$("#playerName").val().trim();
        $("#nameForm").hide();
        });
    });
    
    //Loading Assets
    this.load.image("tiles", "/img/maze/blue-tiles.png");
    this.load.spritesheet("blockBreaking", "/img/maze/blocks/blue-block-break.png", {
        frameWidth: 64,
        frameHeight: 64
    });
    this.load.spritesheet("powerUp", "/img/maze/gems/blue-power.png", {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet("player", "/img/player/benny/Benny.png", {
        frameWidth: 32,
        frameHeight: 32
    });
    this.load.spritesheet("enemy", "/img/enemy/pac/yellow-pac.png", {
        frameWidth: 32,
        frameHeight: 32
    });

    //Start Player Timer
    playerData.start=moment().format("hh:mm:ss");
}

function create(){
    //game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
    //game.scale.pageAlignHorizontally=true;
    //game.scale.pageAlignVertically=true;

    //Create Map with Random Blocks
    this.level=[];
    for(let i=0; i<20; i++){
        this.level[i]=[];
        for(let n=0; n<20; n++){
            this.level[i][n]=0;
        }
    }
    this.map=this.make.tilemap({
        data: this.level,
        tileWidth: 32,
        tileHeight: 32
    })
    tiles=this.map.addTilesetImage("tiles", null, 32, 32);
    floor=this.map.createDynamicLayer(0, tiles);
    blockLayer=this.map.createBlankDynamicLayer("blocks", tiles);
    blockLayer.randomize(0, 0, this.map.width, this.map.height, [-1, -1, -1, 2], 2);
    this.map.setCollision(2);
    //blocks=blockLayer.createFromTiles(2, null, blockConfig)

    //Add Player & Animations
    //getBlocklessTile(player, "player");
    player=this.physics.add.sprite(Phaser.Math.Between(0,640), Phaser.Math.Between(0,640), "player");
    player.setCollideWorldBounds(true);
    this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNumbers("player", {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("player", {start: 4, end: 7}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("player", {start: 8, end: 11}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("player", {start: 12, end: 15}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "downPush",
        frames: this.anims.generateFrameNumbers("player", {start: 16, end: 18}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "upPush",
        frames: this.anims.generateFrameNumbers("player", {start: 19, end: 21}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftPush",
        frames: this.anims.generateFrameNumbers("player", {start: 22, end: 24}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightPush",
        frames: this.anims.generateFrameNumbers("player", {start: 25, end: 27}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "downPoweredUp",
        frames: this.anims.generateFrameNumbers("player", {start: 28, end: 31}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "upPoweredUp",
        frames: this.anims.generateFrameNumbers("player", {start: 32, end: 35}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftPoweredUp",
        frames: this.anims.generateFrameNumbers("player", {start: 36, end: 39}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightPoweredUp",
        frames: this.anims.generateFrameNumbers("player", {start: 40, end: 43}),
        frameRate: 10,
        repeat: -1
    });

    //Add Enemy & Animations
    //getBlocklessTile(enemy, "enemy");
    enemy=this.physics.add.sprite(Phaser.Math.Between(0,640), Phaser.Math.Between(0,640), "enemy");
    enemy.setCollideWorldBounds(true);
    this.anims.create({
        key: "downEnemy",
        frames: this.anims.generateFrameNumbers("enemy", {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "upEnemy",
        frames: this.anims.generateFrameNumbers("enemy", {start: 3, end: 5}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "leftEnemy",
        frames: this.anims.generateFrameNumbers("enemy", {start: 6, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "rightEnemy",
        frames: this.anims.generateFrameNumbers("enemy", {start: 9, end: 11}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "poweredUpEnemy",
        frames: this.anims.generateFrameNumbers("enemy", {start: 12, end: 13}),
        frameRate: 10,
        repeat: -1
    });

    //Add PowerUp & Animations
    //getBlocklessTile(powerUp, "powerUp");
    powerUp=this.physics.add.sprite(Phaser.Math.Between(0,640), Phaser.Math.Between(0,640), "powerUp");
    this.anims.create({
        key: "floating",
        frames: this.anims.generateFrameNumbers("powerUp", {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    //Add Breaking Block Animation
    this.anims.create({
        key: "blockBreaking",
        frames: this.anims.generateFrameNumbers("blockBreaking", {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });

    //Creating Input Control
    cursors=this.input.keyboard.createCursorKeys();

    //Creating Scoreboard
    scoreText=this.add.text(16, 16, score, {fontSize: "32px", fill: "#000"});

    //Collision Logic
    this.physics.add.collider(player, blockLayer);//, hitBlock("p"));
    this.physics.add.collider(enemy, blockLayer);//, hitBlock("e"));
    //this.physics.add.collider(player, powerUp);
    this.physics.add.overlap(player, powerUp, exitLevel, null, this);//getPoweredUp("p"), null, this);
    //this.physics.add.overlap(enemy, powerUp, getPoweredUp("e"), null, this);
    //this.physics.add.collider(player, enemy);
    //this.physics.collide(player, blocks);
    this.physics.add.overlap(player, enemy, playerHitsEnemy, null, this);
}

function update(){
    //this.physics.collide(player, this.layer);

    //PowerUp Animation Activated
    powerUp.anims.play("floating", true);

    //Enemy "AI"
    enemy.rotation=Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    this.physics.velocityFromRotation(enemy.rotation, 50, enemy.body.velocity);
    if(enemyPoweredUp){
        enemy.anims.play("poweredUpEnemy", true);
        enemy.velocity=100;
    }
    else{
        if(enemy.body.velocity.x<0){
            enemy.anims.play("rightEnemy", true);
        }
        else if(enemy.body.velocity.x>0){
            enemy.anims.play("leftEnemy", true);
        }
        else if(enemy.body.velocity.y<0){
            enemy.anims.play("upEnemy", true);
        }
        else{
            enemy.anims.play("downEnemy", true);
        }
    }

    //When Player Dies
    if(gameOver){
        playerData.end=moment().format("hh:mm:ss");
        playerData.score=score;
        $.post("/api/scores", playerData).then(function(){
            return;
        });
    }
    
    //Player Movement Input
    if(cursors.down.isDown){
        if(!poweredUp){
            player.setVelocityY(100);
            player.anims.play("down", true);
        }
        else{
            player.setVelocityY(200);
            player.anims.play("downPoweredUp", true);
        }
    }
    else if(cursors.up.isDown){
        if(!poweredUp){
            player.setVelocityY(-100);
            player.anims.play("up", true);
        }
        else{
            player.setVelocityY(-200);
            player.anims.play("upPoweredUp", true);
        }
    }
    else if(cursors.left.isDown){
        if(!poweredUp){
            player.setVelocityX(-100);
            player.anims.play("left", true);
        }
        else{
            player.setVelocityX(-200);
            player.anims.play("leftPoweredUp", true);
        }
    }
    else if(cursors.right.isDown){
        if(!poweredUp){
            player.setVelocityX(100);
            player.anims.play("right", true);
        }
        else{
            player.setVelocityX(200);
            player.anims.play("rightPoweredUp", true);
        }
    }
    //player.body.velocity.normalize().scale(player.speed);
    //enemy.body.velocity.normalize().scale(enemy.speed);

}

function playerHitsEnemy(){
    if(!poweredUp){
        this.physics.pause();
        player.setTint(0xff0000);
        gameOver=true;
    }
}

function enemyMovement(){
    //enemy.rotation=this.physics.arcade.angleBetween(enemy, player);
    enemy.setAngle(90);
}

//If Player/Enemy grabs PowerUp
function getPoweredUp(who){
    if(who==="e"){
        enemyPoweredUp=true;
    }
    else if(who==="p"){
        poweredUp=true;
    }
    powerUp.visible=false;
}

function hitBlock(who){
    if(who==="e" && enemyPoweredUp==true){
        blockBreaking=this.physics.add.sprite(enemy.x, enemy.y, "blockBreaking");
    }
    else if(who==="p"){
        if(poweredUp==true){
            blockBreaking=this.physics.add.sprite(player.x, player.y, "blockBreaking");
        }
        else{
            if(player.body.velocity.y>0){
                player.anims.play("downPush", true);
            }
            else if(player.body.velocity.y<0){
                player.anims.play("upPush", true);
            }
            else if(player.body.velocity.x>0){
                player.anims.play("rightPush", true);
            }
            else if(player.body.velocity.x<0){
                player.anims.play("leftPush", true);
            }
        }
    }
}

function getBlocklessTile(newSprite, newSpriteString){
    var tempTile
    var gettingTile=function(){
        tempTile=blockLayer.getTileAtWorldXY(Phaser.Math.Between(0,640), Phaser.Math.Between(0,640)).then(function(){
            if(tempTile.layer==2){
                getBlocklessTile();
            }
            else{
                newSprite=this.physics.add.sprite(tempTile.x, tempTile.y, newSpriteString);
                newSprite.setCollideWorldBounds(true);
            }
        });
    }
}

function exitLevel(){
    score+=100;
    this.create();
}