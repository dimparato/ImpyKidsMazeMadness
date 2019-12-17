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
            gravity: {y: 0}
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: "#000000",
});

var playerData=new Object();
var gameOver=false;
var poweredUp=false;
var scoreText;
var player;
var enemy;
var cursors;
var dimTiles;
var blocks;
var floor;
var blocks;

function preload(){
    this.load.image("tiles", "/img/maze/bluetiles.png");
    this.load.spritesheet("blockBreak", "/img/maze/blocks/blue-block-break.png", {
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
}

function create(){
    //game.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
    //game.scale.pageAlignHorizontally=true;
    //game.scale.pageAlignVertically=true;
  
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
    tiles=this.map.addTilesetImage("tiles");
    floor=this.map.createDynamicLayer(0, tiles);
    blocks=this.map.createBlankDynamicLayer("blocks", tiles);
    blocks.randomize(0, 0, this.map.width, this.map.height, [-1, -1, -1, 2], 1);
    
    player=this.physics.add.sprite(0, 0, "player");
    playerData.start=moment().format("hh:mm:ss");
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

    enemy=this.physics.add.sprite(400, 400, "enemy");
    enemy.setCollideWorldBounds(true);
    this.anims.create({
        key: "down",
        frames: this.anims.generateFrameNumbers("enemy", {start: 0, end: 2}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "up",
        frames: this.anims.generateFrameNumbers("enemy", {start: 3, end: 5}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("enemy", {start: 6, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("enemy", {start: 9, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    cursors=this.input.keyboard.createCursorKeys();

    scoreText=this.add.text(16, 16, "0", {fontSize: "32px", fill: "#000"});

    this.physics.add.collider(player, blocks);
    this.physics.add.collider(enemy, blocks, enemyMovement, null, this);
    this.physics.add.collider(player, enemy);

    this.physics.add.overlap(player, enemy, playerHitsEnemy, null, this);
}

function update(){
    if(gameOver){
        playerData.end=moment().format("hh:mm:ss");
        playerData.score=score;
        $.post("/api/scores", playerData).then(function(){
            return;
        });
    }
    
    if(cursors.down.isDown){
        player.setVelocityY(100);
        player.anims.play("down", true);
    }
    else if(cursors.up.isDown){
        player.setVelocityY(-100);
        player.anims.play("up", true);
    }
    else if(cursors.left.isDown){
        player.setVelocityX(-100);
        player.anims.play("left", true);
    }
    else if(cursors.right.isDown){
        player.setVelocityX(100);
        player.anims.play("right", true);
    }
    //player.body.velocity.normalize().scale(speed);
    //enemy.body.velocity.normalize().scale(speed);

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