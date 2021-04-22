//面向对象
//全局变量
var sw = 20,//方块的宽度
    sh = 20,//方块的高度
    tr = 30,//行数
    td = 30;//列数
var snake = null,//蛇的实例
    food = null;//食物的实例
game = null;//游戏的实例

//方块
function Square(x, y, classname) {//x,y代表坐标
    //创建属性
    this.x = x * sw;
    this.y = y * sh;
    this.class = classname;

    this.viewContent = document.createElement('div');//方块对应的DOM元素
    this.viewContent.className = this.class;
    this.parent = document.getElementById('snakeWrap')//方块的父级
}
//方块创建的方法
Square.prototype.create = function () {//创建方块DOM
    this.viewContent.style.position = "absolute";
    this.viewContent.style.width = sw + "px";
    this.viewContent.style.height = sh + "px";
    this.viewContent.style.left = this.x + 'px';
    this.viewContent.style.top = this.y + 'px';

    this.parent.appendChild(this.viewContent)
}
//移除方块的方法
Square.prototype.remove = function () {
    this.parent.removeChild(this.viewContent);
};


//蛇
function Snake() {
    //蛇的属性
    this.hand = null;//存蛇头的信息
    this.tail = null;//存蛇尾的信息
    this.pos = [];    //存储蛇身上的每一个方块的位置，用二维数组表示
    this.directionNum = {//存储蛇走的方向，用一个对象来表示
        left: {
            x: -1,
            y: 0,
            rotate:180//蛇头在不同的方向应该进行旋转，不然就会始终朝右
        },
        right: {
            x: 1,
            y: 0,
            rotate:0
        },
        up: {
            x: 0,
            y: -1,
            rotate:270
        },
        down: {
            x: 0,
            y: 1,
            rotate:90
        }
    }
}
//蛇的初始化
Snake.prototype.init = function () {//init是初始化的意思
    //创建蛇头
    var snakeHead = new Square(2, 0, 'snakeHead');
    snakeHead.create();
    this.head = snakeHead;//储存蛇头信息
    this.pos.push([2, 0]);//储存蛇头位置信息
    //创建蛇身体1
    var snakeBody1 = new Square(1, 0, 'snakeBody');
    snakeBody1.create();
    this.pos.push([1, 0]);//储存身体位置信息
    //创建蛇身体2（蛇尾）
    var snakeBody2 = new Square(0, 0, 'snakeBody');
    snakeBody2.create();
    this.tail = snakeBody2;//储存身体(尾)信息
    this.pos.push([0, 0]);//储存身体(尾)位置信息
    //默认的蛇就创建好啦

    //形成链表关系
    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    //给蛇添加一条属性，用来表示蛇走的方向
    this.direction = this.directionNum.right;//默认往右走
}
//这个方法用来获取蛇头的下一个位置对应的元素，要根据元素做不同的事情
Snake.prototype.getNextPos = function () {
    var nextPos = [//蛇头要走的下一个点的坐标
        this.head.x / sw + this.direction.x,
        this.head.y / sh + this.direction.y
    ]
    // console.log(nextPos)
    //下个点是自己，死
    var selfCollied = false;
    this.pos.forEach(function (value) {
        if (value[0] == nextPos[0] && value[1] == nextPos[1]) {
            // console.log(value[0]+''+nextPos[0]+''+ value[1]+''+nextPos[1] )
            selfCollied = true;
        }
    });
    if (selfCollied) {
        // console.log("撞到自己了");
        this.startegies.die.call(this)
        return;
    }
    //下个点是墙，死
    if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > td - 1 || nextPos[1] > tr - 1) {
        // console.log('撞墙了');
        this.startegies.die.call(this)
        return;
    }
    //下个点是食物，吃
    if(food&&food.pos[0]==nextPos[0]&&food.pos[1]==nextPos[1]){
        //如果这个条件成立，说明现在蛇头要走的下一个点是食物所在位置
        // console.log('撞到食物了');
        this.startegies.eat.call(this);
        return;
    }
    //this.startegies.eat.call(this)
    //下个点什么都不是，走
    this.startegies.move.call(this)
}
//处理碰撞后要做的事
Snake.prototype.startegies = {
    move: function (format) {//这个参数用于决定要不要删除最后一个方块（蛇尾）
        // console.log('move');
        // 创建新的身体(在旧蛇头的位置)
        var newBody = new Square(this.head.x / sw, this.head.y / sh, 'snakeBody')
        //更新链表关系
        newBody.next = this.head.next;
        newBody.next.last = newBody;
        newBody.last = null;
        this.head.remove();
        newBody.create();
        //创建新的蛇头
        var newHead = new Square(this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y, 'snakeHead');
        //更新链表关系
        newHead.next = newBody;
        newHead.last = null;
        newBody.last = newHead;
        newHead.viewContent.style.transform='rotate('+this.direction.rotate+'deg)';
        newHead.create();
        //更新蛇身上每一个方块的坐标
        this.pos.unshift([this.head.x / sw + this.direction.x, this.head.y / sh + this.direction.y]);
        //更新this.head（蛇头）的信息
        this.head=newHead;

        //关于蛇尾
        if (!format) {//如果为false，就删除蛇尾（除了吃之外的操作）
            this.tail.remove();
            //更新链表
            this.tail = this.tail.last;
            //更新方块坐标(删掉尾部方块)
            this.pos.pop();
        }

    },
    eat: function () {
        this.startegies.move.call(this, true);
        createFood();
        game.score++;
    },
    die: function () {
        // console.log('die');
        game.over();

    }
}
//执行：蛇的初始化
snake = new Snake();

//创建食物
function createFood() {
    //食物小方块的随机坐标
    var x = null;
    var y = null;

    var include = true;//循环跳出的条件，true表示食物的坐标在蛇身上（需要继续循环）。false表示食物的坐标不在蛇身上（循环不了）
    while (include) {
        x = Math.floor(Math.random() * (td))
        y = Math.floor(Math.random() * (tr));

        snake.pos.forEach(function (value) {
            if (x != value[0] && y != value[1]) {
                include = false;
            }
        });
        // console.log(x + '' + y)
    }
    //生成食物
    food = new Square(x, y, 'food');
    food.pos=[x,y];//生成食物的坐标用于跟要走的下一个点做对比
    var foodDom=document.querySelector('.food');
    if(foodDom){
        foodDom.style.left=x*sw+'px';
        foodDom.style.top=y*sh+'px';
    }else{
        food.create();
    }
}


//创建游戏逻辑
function Game() {
    this.timer = null;
    this.score = 0;//得分
}
Game.prototype.init = function () {
    snake.init();
    createFood();

    //创建键盘事件
    document.onkeydown = function (e) {
        if (e.which == 37 && snake.direction != snake.directionNum.right) {//代表键盘左键,且不是正在往右走
            snake.direction = snake.directionNum.left;
            // console.log('左')
        } else if (e.which == 38 && snake.direction != snake.directionNum.down) {//代表键盘上键,且不是正在往下走
            snake.direction = snake.directionNum.up;
        } else if (e.which == 39 && snake.direction != snake.directionNum.left) {//代表键盘右键,且不是正在往左走
            snake.direction = snake.directionNum.right;
        } else if (e.which == 40 && snake.direction != snake.directionNum.up) {//代表键盘下键,且不是正在往上走
            snake.direction = snake.directionNum.down;
            // console.log('下')
        }
    }
    this.start();
}
Game.prototype.start=function(){
    this.timer=setInterval(function(){
        snake.getNextPos();
    },200)
}
Game.prototype.pause=function(){
    clearInterval(this.timer)
}
Game.prototype.over=function(){
    clearInterval(this.timer);
    alert("你的得分为："+this.score)
    //游戏回到最初始的状态
    var snakeWrap=document.getElementById('snakeWrap');
    snakeWrap.innerHTML='';
    snake=new Snake();
    game=new Game();

    var startBtnWrap=document.querySelector('.startBtn');
    startBtnWrap.style.display='block';
}
//开始游戏
game = new Game();
var startBtn=document.querySelector('.startBtn button');
startBtn.onclick=function(){
    startBtn.parentNode.style.display="none";
    game.init();
}
//暂停游戏
var snakeWrap=document.getElementById('snakeWrap');
var pauseBtn=document.querySelector('.pauseBtn button');
snakeWrap.onclick=function(){
    game.pause();
    pauseBtn.parentNode.style.display='block'
}
//继续游戏
pauseBtn.onclick=function(){
    game.start();
    pauseBtn.parentNode.style.display='none';

}