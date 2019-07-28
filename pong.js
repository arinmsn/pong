class Vec 
{
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
}

class Rect 
{
    constructor(w, h)
    {
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }

    get left()
    {
        return this.pos.x - this.size.x / 2;
    }

    get right()
    {
        return this.pos.x + this.size.x / 2;
    }

    get top()
    {
        return this.pos.y - this.size.y / 2;
    }

    get bottom()
    {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect 
{
    constructor()
    {
        super(10, 10)
        this.vel = new Vec;
    }
}

class Player extends Rect {
    constructor() {
        super(20, 100);
        this.score = 0;
    }
}

class Pong 
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball;

        this.players = [
            new Player,
            new Player
        ];

        // Position of Player 1 - 40 pixel from the left
        this.players[0].pos.x = 40; 

        // Position of Player 2 
        this.players[1].pos.x = this._canvas.width - 40;

        // Centering the players
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        });

        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
        this.reset();
    }

    collide(player, ball) {
        // Ball is colliding with the player
        if (player.left < ball.right &&  player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
                ball.vel.x = -ball.vel.x;
            }
    }

    draw() {
        // Black background
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width,
            this._canvas.height);
        
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    }
    drawRect(rect)
    {
        this._context.fillStyle = '#fff';
        // (rec.pos.x, rect.pos.y ...) will not center players correctly
        this._context.fillRect(rect.left, rect.top,
                    rect.size.x, rect.size.y);
    }

    reset()
    {
        //Place the ball vertically centered
        this.ball.pos.x = this._canvas.width / 2;
        //Place the ball horizontally centered
        this.ball.pos.y = this._canvas.height / 2;

        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    start()
    {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            // On Start, randomize initial direction of ball
            this.ball.vel.x = 300 * (Math.random() * .5 ? 1: -1);
            this.ball.vel.y = 300 * (Math.random() * 2 - 1);;
        }
    }

    update(dt) {
        // Movement of the ball
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        // Ensure this.ball bounces off  ----------------------------
        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            // Keeping tab of scores
            // Shorthand - '| 0' will convert it to an integer
            // 'this.ball.vel.x < 0 will take care of boolean logic
            let playerId = this.ball.vel.x < 0 | 0;
            console.log(playerId);
            this.players[playerId].score++;
            this.reset();
            // let playerId;
            // if (this.ball.vel.x < 0) {
            //     playerId = 1;
            // } else {
            //     playerId = 0;
            // }

            
            this.ball.vel.y = -this.ball.vel.y
        }
    
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y
        } //---------------------------------------------------------

        // Computer player to follow the ball
        this.players[1].pos.y = this.ball.pos.y;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    }
}

const canvas = document.getElementById('pong');
// Initialize the game
const pong = new Pong(canvas);

// User can now use the mouse to move the player.
canvas.addEventListener('mousemove', event => {
    pong.players[0].pos.y = event.offsetY;
});

canvas.addEventListener('click', event => {
    pong.start();
});