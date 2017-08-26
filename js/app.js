
var newGame = true;
var gameReset = false;
var columnWidth = ctx.canvas.width / 5;
var rowHeight = (ctx.canvas.height - 108) / 6;
var lives = 3;
var score = 0;
var scored = false;
ctx.font = '30px Verbana';
ctx.fillText("❤ = " + lives, 0, 40);

// Enemies our player must avoid
var Enemy = function(row, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -columnWidth;
    this.y = (rowHeight * row) - 20;
    this.speed = speed;
};

function getRandomInt(min, max) {
  /* Input: two integers
   * Output: a random integer between the two inputs
   * This helper function is used to randomize the position and speed of the Enemy objects
   */
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

Enemy.prototype.collisionDetection = function (target) {
  //Input: a target object to detect a collision with
  //Output: a boolean indicating true if a collision has occurred and false if one has not
  return target.x >= this.x - (columnWidth - 50) && target.x <= this.x + (columnWidth - 25) && target.y >= this.y && target.y <= this.y + (rowHeight - 20);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    /* Custom code:
     *
     * Calculates the speed relative to the size of the game board
     * Randomizes the Enemy's speed and row position each time it reaches
     * the end of the game board.

     * Added a progressive difficulty multiplier that increases the Enemy object
     * speed as the score increases.
     *
     * Added code that updates the player's lives and resets the player position
     * if a collision occurs.
     */
    var speed = (columnWidth * 5) / this.speed;
    if (this.collisionDetection(player) == true) {
      player.movedX = columnWidth * 2;
      player.movedY = (rowHeight * 5) - 20;
      lives = lives - 1;
      if (lives < 1) {
        lives = 3;
        gameReset = true;
      }
      ctx.clearRect(0, 0, 200, 200);
      ctx.fillText("❤ = " + lives, 0, 40);
    }
    var difficultyMulitplier = (score/2000);
    this.x = this.x + speed * (dt + (dt * difficultyMulitplier));
    if (this.x > columnWidth * 5 ) {
        this.x = -columnWidth;
        this.y = (rowHeight * getRandomInt(1, 4)) - 20;
        this.speed = getRandomInt(1, 5);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Character = function (sprite, column) {
  // Added a Character object to allow the player to select a character that will
  // be used set the Player object sprite.
  this.sprite = sprite;
  this.x = column;
  this.y = (rowHeight * 5) - 20;
};

Character.prototype.render = function (){
  //Renders the character object
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {
  // Custom code:
  // Initially sets the player sprite as the selector image, to allow player to
  // select their sprite.
  // Uses movedX and movedY properties to track the player's movement input.
    this.sprite = 'images/Selector.png';
    this.x = columnWidth * 2;
    this.y = (rowHeight * 5) - 20;
    this.movedX = columnWidth * 2;
    this.movedY = (rowHeight * 5) - 20;
};

Player.prototype.charSelect = function () {
  /* Input: takes not input
   * Output: sets the player object's sprite to the sprite of the Character object
   * currently at the player object's position.
   */
  characterList.forEach(function(e){
    if (this.x == e.x) {
      this.sprite = e.sprite;
      newGame = false;
    }
  }, this);
};

Player.prototype.handleInput = function (input) {
  /* Input: a key press from the player
   * Output: If in newGame mode, changes the selector position properties and invokes
   * the charSelect method to set the player sprite. If not in newGame mode, changes
   * the player position properties, detects if the player is in scoring position
   * and updates the score. Prevents the player from moving off the game board.
   */
  if (newGame == true) {
    if (input == 'enter') {
      this.charSelect();
    }
  }
  if (newGame == false) {

    if (input == 'up') {
      if (this.movedY - rowHeight < rowHeight - 20) {
        scored = true;
        score = score + 100;
        this.movedY = (rowHeight * 5) - 20;
      } else {
      this.movedY = this.movedY - rowHeight;
      }

    }
    if (input == 'down') {
      if (this.movedY + rowHeight > rowHeight * 5 - 20) {
        this.movedY = this.y;
      } else {
        this.movedY = this.movedY + rowHeight;
      }
    }
  }
  if (input == 'left') {
    if (this.movedX - columnWidth < columnWidth * 0) {
      this.movedX = this.x;
    } else {
      this.movedX = this.movedX - columnWidth;
    }
  }
  if (input == 'right') {
    if (this.movedX + columnWidth > columnWidth * 4) {
      this.movedX = this.x;
    } else {
      this.movedX = this.movedX + columnWidth;
    }
  }
};

Player.prototype.update = function() {
    // Custom code:
    // The current y and x position coordinates are set to the properties set by
    // the handleInput method
    this.y = this.movedY;
    this.x = this.movedX;
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var bug1 = new Enemy(getRandomInt(1, 4), getRandomInt(1, 5));
var bug2 = new Enemy(getRandomInt(1, 4), getRandomInt(1, 5));
var bug3 = new Enemy(getRandomInt(1, 4), getRandomInt(1, 5));
var allEnemies = [bug1, bug2, bug3];
var boy = new Character('images/char-boy.png', columnWidth * 2);
var catGirl = new Character('images/char-cat-girl.png', columnWidth * 0);
var hornGirl = new Character('images/char-horn-girl.png', columnWidth * 1);
var pinkGirl = new Character('images/char-pink-girl.png', columnWidth * 3);
var princessGirl = new Character('images/char-princess-girl.png', columnWidth * 4);
var characterList = [boy, catGirl, hornGirl, pinkGirl, princessGirl];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
