// Author Hy忠
var gameCanvas = document.getElementById('gameCanvas');
var score = document.getElementById('score');
var ctx = gameCanvas.getContext('2d');
var score = document.getElementById('score');

const gridHorizonalNumber = 60;
var gridSize = Number.parseInt((window.innerWidth - 40) / gridHorizonalNumber);//格子大小,除数为数量
gameCanvas.width = Number.parseInt((window.innerWidth - 40) / gridSize) * gridSize;
gameCanvas.height = Number.parseInt((window.innerHeight - 25 - 60) / gridSize) * gridSize;
var speed = 150;//绘制刷新间隔
var xStatus = yStatus = 0;//当前前进方向
var paintStatus = true;//绘制状态，用于按键速度超过刷新速度导致的加速
var flushPaint = 0;
//颜色
const headColor = '#00ffff';
const bodyColor = '#ff00ff';
const foodColor = '#00ff00';

//蛇
function snake(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
}
//整条蛇
var snakes = [new snake(
    Number.parseInt(gameCanvas.width / 2 / gridSize) * gridSize,
    Number.parseInt(gameCanvas.height / 2 / gridSize) * gridSize,
    1)
]
//食物
var food;
createFood();
//移动
function move(x, y) {
    if (paintStatus) {
        //回头检测,仅一个头时不检
        if (snakes.length > 1 && x == -xStatus && y == -yStatus) {
            gameOver();
        }
        xStatus = x;
        yStatus = y;
        if (!impactCheck(x, y)) {
            eat();
            paintStatus = false;
        } else {
            gameOver();
        }
    }
}
//碰撞检测
function impactCheck() {
    let head = snakes[0];
    //墙
    if (head.x < gridSize / 2 || head.x > gameCanvas.width - gridSize / 2 ||
        head.y < gridSize / 2 || head.y > gameCanvas.height - gridSize / 2) {
        return true;
    }
    //自身
    for (let i = 1; i < snakes.length; i++) {
        if (head.x == snakes[i].x && head.y == snakes[i].y) {
            return true;
        }
    }
    return false;
}
//创建食物
function createFood() {
    //对齐格子
    food = {
        x: Number.parseInt(Number.parseInt((Math.random() * gameCanvas.width + 1) / gridSize) * gridSize),
        y: Number.parseInt(Number.parseInt((Math.random() * gameCanvas.height + 1) / gridSize) * gridSize)
    }
    if (food.x == 0 || food.x == gameCanvas.width ||
        food.y == 0 || food.y == gameCanvas.height) {
        //边缘坐标重新生成
        createFood();
    }
    for (let i = 0; i < snakes.length; i++) {
        if (food.x == snakes[i].x && food.y == snakes[i].y) {
            //创建的食物坐标不能在蛇身上
            createFood();
            return;
        }
    }
}
//吃到食物
function eat() {
    if (snakes[0].x == food.x && snakes[0].y == food.y) {
        score.innerText = Number.parseInt(score.innerText) + 1;
        snakes.push(new snake(snakes[snakes.length - 1].x + gridSize * -xStatus, snakes[snakes.length - 1].y + gridSize * -yStatus, 0));
        createFood();
    }
}
// 画
function paint() {
    paintStatus = true;
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    //食物
    ctx.beginPath();
    ctx.fillStyle = foodColor;
    ctx.arc(food.x, food.y, gridSize / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    //头后赋值，剩下的是前一个坐标
    for (let i = snakes.length - 1; i > 0; i--) {
        snakes[i].x = snakes[i - 1].x;
        snakes[i].y = snakes[i - 1].y;
    }
    snakes[0].x += gridSize * xStatus;
    snakes[0].y += gridSize * yStatus;
    eat();
    if (impactCheck()) { gameOver(); }
    //蛇
    for (let i = 0; i < snakes.length; i++) {
        ctx.beginPath();
        if (snakes[i].type) {
            ctx.fillStyle = headColor;
        } else {
            ctx.fillStyle = bodyColor;
        }
        ctx.arc(snakes[i].x, snakes[i].y, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}
//游戏结束
function gameOver() {
    window.clearInterval(flushPaint);

    ctx.beginPath();
    ctx.fillStyle = '#ff0000';
    let fontSize = 72;
    ctx.font = fontSize + "px '微软雅黑'";
    ctx.textAlign = "left";
    ctx.fillText('游戏结束', gameCanvas.width / 2 - fontSize * 2, gameCanvas.height / 2 - fontSize / 2);
    ctx.closePath();

    document.getElementById('restart').classList.remove('d-none');
}
//重新开始
function restart() {
    score.innerText = xStatus = yStatus = 0;
    flushPaint = setInterval(paint, speed);
    document.getElementById('restart').classList.add('d-none');

    snakes = [new snake(
        Number.parseInt(gameCanvas.width / 2 / gridSize) * gridSize,
        Number.parseInt(gameCanvas.height / 2 / gridSize) * gridSize,
        1)
    ]
}
function changeSpeed() {
    speed = Number.parseInt(Number.parseFloat(document.getElementById('speed').value) * 100);
    //游戏中途变速则需要重设setInterval
}
window.onload = function () {
    flushPaint = setInterval(paint, speed);
}
window.onresize = function () {
    gameCanvas.width = Number.parseInt((window.innerWidth - 40) / gridSize) * gridSize;
    gameCanvas.height = Number.parseInt((window.innerHeight - 25 - 60) / gridSize) * gridSize;
    gridSize = Number.parseInt((window.innerWidth - 40) / gridHorizonalNumber);
    restart();
}
window.onkeydown = function (event) {
    switch (event.code) {
        case 'KeyW': this.move(0, -1); break;
        case 'KeyS': this.move(0, 1); break;
        case 'KeyA': this.move(-1, 0); break;
        case 'KeyD': this.move(1, 0); break;
        case 'ArrowUp': this.move(0, -1); break;
        case 'ArrowDown': this.move(0, 1); break;
        case 'ArrowLeft': this.move(-1, 0); break;
        case 'ArrowRight': this.move(1, 0); break;
    }
}