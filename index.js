function getCurrentState() {
    let c = gameState.cops.getChildren();
    return [Math.floor(gameState.robber.body.x/20), Math.floor(gameState.robber.body.y), Math.floor(c[0].body.x/20), Math.floor(c[1].body.x / 20)];
}

function applyAction(action) {
  if (action == 0) {
    gameState.robber.setVelocityX(-160);
  } else if (action == 1) {
    gameState.robber.setVelocityX(160);
  } else {
    gameState.robber.setVelocityX(0);
  }
  if(action == 2 && (gameState.robber.body.y == 453.9 || gameState.jumping == true)) {
      gameState.robber.setVelocityY(-115);
      gameState.robber.jumping = true;
  } else if(gameState.robber.body.y == 453.9) {
      gameState.robber.jumping = false;
  }
}
brain = new qtable( Math.floor(431/20) *7* Math.floor(431/20)*Math.floor(431/20), 3); 
player = new agent(actionMap, getStateID); 


function preload() {
  this.load.image('platform', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png');
  this.load.image('person', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png');
}

const gameState = {
  score: 0,
  highScore: 0
};

function create() {
  const platforms = this.physics.add.staticGroup();
  gameState.robber = this.physics.add.sprite(225, 457, 'person').setScale(.5);

  gameState.cops = this.physics.add.group();
  
  gameState.cops.create(0, 450, 'person').setScale(.5);
  gameState.cops.create(445, 450, 'person').setScale(.5);

  
  platforms.create(225, 490, 'platform').setScale(1, .3).refreshBody();

  gameState.scoreText = this.add.text(195, 485, 'Score: 0', { fontSize: '15px', fill: '#000000' });
  gameState.highScoreText = this.add.text(0, 485, `High Score: ${gameState.highScore}`, { fontSize: '15px', fill: '#000000' });

  gameState.robber.setCollideWorldBounds(true);

  this.physics.add.collider(gameState.robber, platforms);
  this.physics.add.collider(gameState.cops, platforms);
  gameState.cursors = this.input.keyboard.createCursorKeys();

  gameState.jumping = false;

  this.physics.add.collider(gameState.robber, gameState.cops, () => {
    if(gameState.highScore<gameState.score) {
        gameState.highScore = gameState.score;
    }
    qcode(-10);
    gameState.score=0; this.scene.restart()})
}
let expl = 1
function qcode(rewardRecieved) {
    player.state = getCurrentState();
    let currentState = [...player.state];
    legalActions = player.getLegalActions();

    if(Math.random() > expl) {
      actionChosen = brain.getBestActionForState(player.getStateID(player.state), legalActions);
      console.log(player.state, actionChosen);
    } else {
      actionChosen = player.chooseRandomAction();
    }
    applyAction(actionChosen);
    player.state = getCurrentState();
    brain.updateCell(0.98, 0.1, rewardRecieved, player.getStateID(currentState), actionChosen, player.getStateID(player.state));
}

function update() {

  qcode(1);  
  gameState.score +=1;
  gameState.scoreText.setText(`Score: ${gameState.score}`);
  /*if (gameState.cursors.left.isDown) {
    gameState.robber.setVelocityX(-160);
  } else if (gameState.cursors.right.isDown) {
    gameState.robber.setVelocityX(160);
  } else {
    gameState.robber.setVelocityX(0);
  }
  if(gameState.cursors.up.isDown && (gameState.robber.body.y == 453.9 || gameState.jumping == true)) {
      gameState.robber.setVelocityY(-115);
      gameState.robber.jumping = true;
  } else if(gameState.robber.body.y == 453.9) {
      gameState.robber.jumping = false;
  }*/
  let copArr = gameState.cops.getChildren();
  for(let i=0; i<copArr.length;i++) {
      if(copArr[i].body.x < gameState.robber.body.x) {
        copArr[i].setVelocityX(30);
      } else {
          copArr[i].setVelocityX(-30);
      }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 500,
  backgroundColor: "b9eaff",
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);
