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

class Pong 
{
    constructor(canvas)
    {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');

        this.ball = new Ball;
        this.ball.pos.x = 100;
        this.ball.pos.y = 50;

        this.ball.vel.x = 100;
        this.ball.vel.y = 100;

        let lastTime;
        const callback = (millis) => {
            if (lastTime) {
                this.update((millis - lastTime) / 1000);
            }
            lastTime = millis;
            requestAnimationFrame(callback);
        };
        callback();
    }

    draw() {
        // Black background
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, this._canvas.width,
            this._canvas.height);
    }
    drawRect(rect)
    {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rect.pos.x, rect.pos.y,
                    rect.size.x, rect.size.y);
    }
    update(dt) {
        // Movement of the ball
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        // Ensure this.ball bounces off  ----------------------------
        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            this.ball.vel.x = -this.ball.vel.x
        }
    
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y
        }

        this.draw();
    }
}

const canvas = document.getElementById('pong');
// Initialize the game
const pong = new Pong(canvas);