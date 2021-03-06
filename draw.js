function Chess(canvas, context, config) {
    this.canvas = canvas;
    this.context = context;
    this.master = null;
    this.config = {
        width: config && config.width || 480,
        height: config && config.height || 480,
        step: config && config.step || 30,
        lineColor: config && config.lineColor || '#0078AA'
    }
    this.lines = this.config.width / this.config.step - 1;
    this.crossData = {playermax: {num: '', point: 0}, AImax: {num: '', point: 0}};

    this.drawRect();
    this.setCrossData();
    
}

/**
 * 绘制棋盘
 * @param {Object} canvas对象 
 * @param {number} step 棋盘方格大小
 * @return {[type]} [description]
 */
Chess.prototype.drawRect = function() {
    for(var i = 0; i < this.canvas.width - this.config.step; i += this.config.step) {
        this.context.lineWidth = 1;
        this.context.strokeStyle = this.config.lineColor;
        // 绘制垂直线
        this.context.beginPath();
        this.context.moveTo(this.config.step + i, this.config.step);
        this.context.lineTo(this.config.step + i, this.canvas.height - this.config.step);
        this.context.stroke();
        this.context.closePath();

        // 绘制水平线
        this.context.beginPath();
        this.context.moveTo(this.config.step, this.config.step + i);
        this.context.lineTo(this.canvas.width - this.config.step, i + this.config.step);
        this.context.stroke();
        this.context.closePath();
    }
}

Chess.prototype.setCrossData = function() {
    var count = Math.floor((this.canvas.width - this.config.step) / this.config.step);
    for(var i = 1; i <= count; i++) {
        for(var j = 1; j <= count; j++) {
            this.crossData['x' + i + 'y' + j] = {
                // 每个交叉点，有八个方向(除了边界)
                direction: {},
                position: {
                    x: this.config.step * i,
                    y: this.config.step * j,
                },
                has: false
            }
            // 添加类型属性type: player or AI 
            this.crossData['x' + i + 'y' + j].type = '';

            // 设置direction八个方向向量
            // 左上角, slant1,2,3,4 分别表示1,2,3,4象限
            // order为各方向排列的棋子顺序，基于当前落子状态
            if(i === 1 && j === 1) {
                this.crossData['x' + i + 'y' + j].direction.right = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.bottom = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant3 = {point: 0, order: []};
                continue;
            }
            // 右上角
            if(i === count && j === 1) {
                this.crossData['x' + i + 'y' + j].direction.left = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.bottom = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant4 = {point: 0, order: []};
                continue;
            }
            // 左下角
            if(i === 1 && j === count) {
                this.crossData['x' + i + 'y' + j].direction.top = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.right = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant2 = {point: 0, order: []};
                continue;
            }
            // 右下角
            if(i === count && j === count) {
                this.crossData['x' + i + 'y' + j].direction.top = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.left = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant1 = {point: 0, order: []};
                continue;
            }
            // 上边线
            if(j === 1) {
                this.crossData['x' + i + 'y' + j].direction.bottom = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.left = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.right = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant3 = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant4 = {point: 0, order: []};
                continue;
            }
            // 下边线
            if(j === count) {
                this.crossData['x' + i + 'y' + j].direction.top = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.left = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.right = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant1 = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant2 = {point: 0, order: []};
                continue;
            }
            // 左边线
            if(i === 1) {
                this.crossData['x' + i + 'y' + j].direction.top = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.bottom = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.right = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant3 = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant2 = {point: 0, order: []};
                continue;
            }
            // 右边线
            if(i === count) {
                this.crossData['x' + i + 'y' + j].direction.bottom = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.left = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.top = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant1 = {point: 0, order: []};
                this.crossData['x' + i + 'y' + j].direction.slant4 = {point: 0, order: []};
                continue;
            }
            // 其余中间交叉点
            this.crossData['x' + i + 'y' + j].direction.top = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.right = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.bottom = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.left = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.slant1 = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.slant2 = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.slant3 = {point: 0, order: []};
            this.crossData['x' + i + 'y' + j].direction.slant4 = {point: 0, order: []};
        }
    }
    console.log(this.crossData)
}


Chess.prototype.drawChess = function() {

    this.context.beginPath()
    this.context.arc(60, 60, 15, 0, 2*Math.PI)
    this.context.fillStyle = 'black';
    this.context.fill();
    this.context.closePath();

    this.context.beginPath()
    this.context.arc(30, 30, 15, 0, 2*Math.PI)
    this.context.fillStyle = '#D1D1D1';
    this.context.fill();
    this.context.closePath();
}

var canvas = document.getElementById('gobang');
canvas.setAttribute('disabled', true);
window.onload = function() {
    var canvasConfig = {
        width: 480,
        height: 480,
    }
    /**
     * 初始换Canvas
     * @return {Object} 画笔
     */
    function initCanvas(canvas, width, height) {
        canvas.width = 480;
        canvas.height = 480;
       
        return canvas.getContext('2d');
    }
    var context = initCanvas(canvas, canvasConfig.width, canvasConfig.height);
    var chess = new Chess(canvas, context);
    

    document.getElementById('replay').onclick = function() {
        location.reload();
    };

    document.getElementById('single').onclick = (function() {
        var count = 0;
        return function() {
            console.log(count)
            if(count === 0) {
                singlePlay(chess);
                count++;
            }
        }
    })();

    document.getElementById('double').onclick = function() {
        webSocket(chess);
    };


    var calculate = new Calculate(chess);

    function singlePlay(chess) {
        canvas.onclick = function(e) {
            let num = `x${Math.round(e.offsetX / chess.config.step)}y${Math.round(e.offsetY / chess.config.step)}`;
            Event.trigger('clickCanvas', num)
        }

        console.log('new')

        var player1 = new Player(chess);
        var AI = new Computer(chess);

        player1.drawChess = player1.drawChess.after(calculate.setType, 1);
        player1.drawChess = player1.drawChess.after(calculate.hasChess, 1, 2);
        player1.drawChess = player1.drawChess.after(calculate.setPosition, 1, 2);
        player1.drawChess = player1.drawChess.after(calculate.reCalculate.bind(calculate), 1, 2);
        
        AI.drawChess = AI.drawChess.after(calculate.setType, 1);
        AI.drawChess = AI.drawChess.after(calculate.hasChess, 1, 2);
        AI.drawChess = AI.drawChess.after(calculate.setPosition, 1, 2);
        AI.drawChess = AI.drawChess.after(calculate.reCalculate.bind(calculate), 1, 2);
        AI.drawChess = AI.drawChess.after(calculate.judge.bind(calculate), 1, 2);
    };

    function webSocket(chess) {
        var calculate = new Calculate(chess);
        var play1;
        var play2;

        function createPlayer(chess, option, ws) {
            var player = new Player(chess, option);

            player.sendWebSocket = player.sendWebSocket(ws);

            player.drawChess = player.drawChess.after(calculate.setType, 1);
            player.drawChess = player.drawChess.after(calculate.hasChess, 1, 2);
            player.drawChess = player.drawChess.after(calculate.setPosition, 1, 2);
            player.drawChess = player.drawChess.after(calculate.reCalculate.bind(calculate), 1, 2);
            player.drawChess = player.drawChess.after(player.sendWebSocket);
            player.drawChess = player.drawChess.after(calculate.judge.bind(calculate), 1, 2);
        
            return player;
        }

        function checkPlayerNum(e) {
           return e.data === '1' ? 1 : 2;
        }

        function ctrlCanvasAllowClick(event) {
            
        }


        var websocket = new WebSocket("ws://localhost:3000/");
        websocket.onopen = function() { 
            console.log('websocket open ');

        }
        websocket.onclose = function() {
            console.log('websocket close ');
        }
        websocket.onmessage = function(e) {
            // 判断玩家数量，提示信息控制
            var num = checkPlayerNum(e);
            notice.style.visibility = num === 2 ? 'hidden' : 'unset';
            
            console.log(e)
            if(e.data === '1') {
                play1 = createPlayer(chess, null, websocket);
                play2 = createPlayer(chess, {turn: false, color: '#ccc'}, websocket);
                console.log(play1)
                console.log(play2)
                chess.master = play1;
                return;
            }else if(e.data === '2') {
                if(!play1) play1 = createPlayer(chess, {turn: false}, websocket);
                if(!play2) play2 = createPlayer(chess, {color: '#ccc'}, websocket);
                chess.master = play2;
            }

            if(chess.master !== JSON.parse(e.data).who) {
                canvas.onclick = function() {
                    let num = `x${Math.round(event.offsetX / chess.config.step)}y${Math.round(event.offsetY / chess.config.step)}`;
                    Event.trigger('clickCanvas', num)
                    console.log(play1)
                    console.log(play2)
                };
            }else {
                canvas.onclick = function() {};
            }
            Event.trigger('clickCanvas', JSON.parse(e.data))
            Event.trigger('turn');

           
        }
    }

    
}


















