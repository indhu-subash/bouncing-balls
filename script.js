const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

let balls = [];
let collisionCount = 0;
let paused = false;

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if (this.x + this.size >= canvas.width || this.x - this.size <= 0) {
            this.velX = -this.velX;
        }

        if (this.y + this.size >= canvas.height || this.y - this.size <= 0) {
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (this !== ball) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    this.color = ball.color =
                        `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;

                    collisionCount++;
                    document.getElementById("score").textContent =
                        `Collisions: ${collisionCount}`;
                }
            }
        }
    }
}

for (let i = 0; i < 10; i++) {
    balls.push(
        new Ball(
            random(50, canvas.width - 50),
            random(50, canvas.height - 50),
            random(-5, 5) || 2,
            random(-5, 5) || 2,
            `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`,
            random(10, 20)
        )
    );
}

canvas.addEventListener("click", (e) => {
    balls.push(
        new Ball(
            e.clientX,
            e.clientY,
            random(-5, 5) || 2,
            random(-5, 5) || 2,
            `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`,
            random(10, 20)
        )
    );

    document.getElementById("ballCount").textContent =
        `Balls: ${balls.length}`;
});

document.getElementById("toggleBtn").addEventListener("click", () => {
    paused = !paused;
    document.getElementById("toggleBtn").textContent =
        paused ? "Resume" : "Pause";
});

function loop() {
    if (!paused) {
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const ball of balls) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    requestAnimationFrame(loop);
}

loop();