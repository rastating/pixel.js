document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        // Setup some variables local to the game
        var ballIsMovingLeft = true;
        var ballIsMovingDown = true;
        var score = { player: 0, computer: 0 };
        
        // Setup a custom assets path
        PixelJS.assetPath = '/static/examples/pong';
        
        var game = new PixelJS.Engine();
        game.init({
            container: 'pixeljs',
            width: 800,
            height: 600,
            maxDeltaTime: 25
        });

        // Create the layers used for the different entities
        var backgroundLayer = game.createLayer("background");
        var scoreLayer = game.createLayer("score");
        var playerLayer = game.createLayer("players");
        
        // Set the background and score layers to static to prevent
        // unrequired redrawing.
        backgroundLayer.static = true;
        scoreLayer.static = true;
        
        // Setup the background image of the game.
        var background = backgroundLayer.createEntity();
        background.pos = { x: 0, y: 0 };
        background.asset = new PixelJS.Sprite();
        background.asset.prepare({
            name: 'background.png',
            size: {
                width: 800,
                height: 600
            }
        });
        
        // Setup the walls which the ball can bounce off.
        var topWall = backgroundLayer.createEntity();
        topWall.pos = { x: 0, y: 0 };
        topWall.size = { width: 800, height: 23 };
        topWall.asset = new PixelJS.Sprite();
        topWall.asset.prepare({
            name: 'top-wall.png',
            size: topWall.size
        });
        
        var bottomWall = backgroundLayer.createEntity();
        bottomWall.pos = { x: 0, y: 574 };
        bottomWall.size = { width: 800, height: 26 };
        bottomWall.asset = new PixelJS.Sprite();
        bottomWall.asset.prepare({
            name: 'bottom-wall.png',
            size: bottomWall.size
        });
        
        // Setup the controllable player entity.
        var player = new PixelJS.Player();
        player.addToLayer(playerLayer);
        player.isAnimatedSprite = false;
        player.canMoveLeft = false;
        player.canMoveRight = false;
        player.pos = { x: 20, y: 263 };
        player.size = { width: 9, height: 74 };
        player.velocity = { x: 0, y: 400 };
        player.asset = new PixelJS.Sprite();
        player.asset.prepare({
            name: 'player.png',
            size: player.size
        });
        
        // Setup the computer player entity.
        var computer = playerLayer.createEntity();
        computer.pos = { x: 761, y: 263 };
        computer.size = { width: 9, height: 74 };
        computer.velocity = { x: 0, y: 300 };
        computer.asset = new PixelJS.Sprite();
        computer.asset.prepare({
            name: 'player.png',
            size: player.size
        });
        
        // Setup the ball entity.
        var ball = playerLayer.createEntity();
        ball.pos = { x: 390, y: 280 };
        ball.size = { width: 21, height: 21 };
        ball.velocity = { x: 350, y: 350 };
        ball.asset = new PixelJS.Sprite();
        ball.asset.prepare({
            name: 'ball.png',
            size: ball.size
        });
        
        // Register our entities that can collide with one another.
        backgroundLayer.registerCollidable(topWall);
        backgroundLayer.registerCollidable(bottomWall);
        playerLayer.registerCollidable(player);
        playerLayer.registerCollidable(ball);
        playerLayer.registerCollidable(computer);
        
        // Setup the sound of the ball colliding with the wall and player.
        var ping = game.createSound('ping');
        ping.load({ name: 'ping.mp3' });
        
        // Setup the callback when we detect the ball has collided with
        // another entity in the scene.
        ball.onCollide = function (collidable) {
            if (collidable == topWall) {
                ballIsMovingDown = true;
                ping.play();
            }
            else if (collidable == bottomWall) {
                ballIsMovingDown = false;
                ping.play();
            }
            else if (collidable == player || collidable == computer) {
                ballIsMovingLeft = !ballIsMovingLeft;
                ping.play();
            }
        };
        
        // A helper function to set the redraw flag and update the scores.
        var updateScores = function () {
            scoreLayer.redraw = true;
            scoreLayer.drawText(
                score.player, 
                300, 
                307, 
                '60pt "Trebuchet MS", Helvetica, sans-serif', 
                '#ff3155',
                'center'
            );
            scoreLayer.drawText(
                score.computer, 
                495, 
                307, 
                '60pt "Trebuchet MS", Helvetica, sans-serif', 
                '#ff3155',
                'center'
            );
        };
        
        game.loadScene(function () {
            // Draw the initial score of 0-0 to the score layer.
            updateScores();
            
            game.run(function (elapsedTime, dt) {
                // Prevent the players going outside the bounds of the screen
                player.canMoveDown = (player.pos.y + player.size.height) < 560;
                player.canMoveUp = player.pos.y > 35;
                computer.canMoveDown = (computer.pos.y + computer.size.height) < 560;
                computer.canMoveUp = computer.pos.y > 35;
                
                // Move the ball in the appropriate direction
                if (ballIsMovingLeft) {
                    ball.moveLeft();
                }
                else {
                    ball.moveRight();
                }
                if (ballIsMovingDown) {
                    ball.moveDown();
                }
                else {
                    ball.moveUp();
                }
                
                // Make our rather simple minded AI follow the ball
                // once it is nearing their side of the scene.
                if (!ballIsMovingLeft && ball.pos.x > 300) {
                    if (computer.pos.y > ball.pos.y) {
                        computer.moveUp();
                    }
                    else {
                        computer.moveDown();
                    }
                }
                
                // If the ball goes off screen, increment the score
                // of the appropriate player, set the redraw flag on
                // the score layer, and reset the ball.
                if (ball.pos.x + ball.size.width <= 0) {
                    score.computer += 1;
                    ball.pos = { x: 390, y: 280 };
                    ballIsMovingDown = true;
                    ballIsMovingLeft = false;
                    updateScores();
                }
                else if (ball.pos.x > 800) {
                    score.player += 1;
                    ball.pos = { x: 390, y: 280 };
                    ballIsMovingDown = true;
                    ballIsMovingLeft = true;
                    updateScores();
                }
            });
        });
    }
}