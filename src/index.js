var canvasWidth = document.documentElement.clientWidth - 20,
    canvasHeight = document.documentElement.clientHeight - 20,
    r = Math.round(canvasWidth * (4 / 5) / 108) - 1,
    marginTop = Math.round(canvasHeight / 5),
    marginLeft = Math.round(canvasWidth / 10);
//endTime = new Date();
//endTime.setTime(endTime.getTime() + 3600*1000);
var curtimeSeconds = getcurtimeSeconds();

var balls = [];
var colors = ['#F596AA', '#D0104C', '#EB7A77', '#734338', '#6E552F', '#62592C', '#268785', '#6A4C9C', '#60373E', '#5E3D50'];

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasHeight;

function getcurtimeSeconds() { //获取截止时间与当前时间的秒数
    var curTime = new Date();
    //倒计时
    // var betweenTime = endTime.getTime() - curTime.getTime();//獲取毫秒
    // betweenTime = Math.round(betweenTime / 1000);//轉換成秒
    // return betweenTime > 0 ? betweenTime : 0;
    //时钟
    var betweenTime = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
    return betweenTime;
}
setInterval(function() {
    render(context); 
    update();
    bilibili(context);
}, 50);

function update() { //更新時間，為小球掉落運動做準備
    var nexttimeSeconds = getcurtimeSeconds();
    var nextHours = parseInt(nexttimeSeconds / 3600),
        nextMinutes = parseInt((nexttimeSeconds - nextHours * 3600) / 60),
        nextSeconds = nexttimeSeconds % 60;
    var curHours = parseInt(curtimeSeconds / 3600),
        curMinutes = parseInt((curtimeSeconds - curHours * 3600) / 60),
        curSeconds = curtimeSeconds % 60;

    if (nextSeconds != curSeconds) {
        //小时
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            addBalls(marginLeft, marginTop, parseInt(curHours / 10));
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(marginLeft + 15 * (r + 1), marginTop, parseInt(curHours % 10));
        }
        //分
        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(marginLeft + 39 * (r + 1), marginTop, parseInt(curMinutes / 10));
        }
        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(marginLeft + 54 * (r + 1), marginTop, parseInt(curMinutes % 10));
        }
        //秒
        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(marginLeft + 78 * (r + 1), marginTop, parseInt(curSeconds / 10));
        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(marginLeft + 93 * (r + 1), marginTop, parseInt(curSeconds % 10));
        }
        

        curtimeSeconds = nexttimeSeconds; //如果时间变化，那么改变时间

    }

    moveBalls();
}

function moveBalls() {

    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if (balls[i].y >= canvasHeight - r) { //碰撞检测
            balls[i].y = canvasHeight - r;
            balls[i].vy = -balls[i].vy * 0.7;
        }
    }
    //删除画布外的球，提高性能
    var count = 0;
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + r > 0 && balls[i].x - r < canvasWidth) { balls[count++] = balls[i] };
    }
    while (balls.length > count) {
        balls.pop();
    }

}

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (r + 1) + (r + 1),
                    y: y + i * 2 * (r + 1) + (r + 1),
                    g: 1.5 + Math.random(), //重力加速度
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 3,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(aBall);
            }
        }
    }
}

function render(ctx) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var hours = parseInt(curtimeSeconds / 3600),
        minutes = parseInt((curtimeSeconds - hours * 3600) / 60),
        seconds = curtimeSeconds % 60;
    renderDigit(marginLeft,                marginTop, parseInt(hours / 10), ctx);
    renderDigit(marginLeft + 15 * (r + 1), marginTop, parseInt(hours % 10), ctx);
    
    renderDigit(marginLeft + 39 * (r + 1), marginTop, parseInt(minutes / 10), ctx);
    renderDigit(marginLeft + 54 * (r + 1), marginTop, parseInt(minutes % 10), ctx);
    
    renderDigit(marginLeft + 78 * (r + 1), marginTop, parseInt(seconds / 10), ctx);
    renderDigit(marginLeft + 93 * (r + 1), marginTop, parseInt(seconds % 10), ctx);

    //绘制掉落的小球
    for (var i = 0; i < balls.length; i++) {
        ctx.fillStyle = balls[i].color;
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, r, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}
//闪烁的冒号
function bilibili(ctx){
    var nowTime = new Date();   
    var nowString = nowTime.getTime().toString();
    var cutTime = nowString.substr(-4);
    var nowSeconds = parseInt(cutTime);
    if (Math.round(nowSeconds / 1000) == Math.floor(nowSeconds / 1000)) {
        renderM(ctx);
    }       
}
function renderM(ctx) {
	renderDigit(marginLeft + 30 * (r + 1), marginTop, 10, ctx);
	renderDigit(marginLeft + 69 * (r + 1), marginTop, 10, ctx);
}
function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = '#81C7D4';
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                ctx.beginPath();
                ctx.arc(x + j * 2 * (r + 1) + (r + 1), y + i * 2 * (r + 1) + (r + 1), r, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}