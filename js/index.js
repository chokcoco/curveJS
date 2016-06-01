;/*!/static/js/index.js*/
/**
 * @author Coco
 * QQ:308695699
 * @name curveJS 1.0.0
 * @description 原生JS实现的各类曲线运动
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 *
 */
(function(window, undifined) {
  // 抛物线
  parabola = (function() {
    var divDrag = document.querySelector('.drap'),
      ball = document.querySelector('.parabola .ball'),
      width = divDrag.offsetWidth / 2,
      height = divDrag.offsetHeight / 2,
      // 这里注意，因为位移使用了 left 和 top
      // 定位点是位于页面最左上角
      // 但是为了效果将中心点移到了页面的 (960,200)
      // 故起始点和终点的坐标都需要减去 (960,300)
      originOffset = {
        x: 960,
        y: 300
      },
      startX = ball.getBoundingClientRect().left + (ball.offsetWidth * 0.5) - originOffset.x,
      startY = ball.getBoundingClientRect().top + (ball.offsetHeight * 0.5) - originOffset.y,
      isMove = false;

    // console.log('startX ' + startX)
    // console.log('startY ' + startY)

    /**
     * 抛物线运动函数 y = a*x*x + b*x + c
     * @param  endX 终止坐标
     * @param  endY 起始坐标
     * @param  time 持续时间 ms
     * @return      [description]
     */
    function ballParabolaMove(endX, endY, time) {
      var a = 0.003,
        b = 0,
        c = 0,
        // 这里注意，因为位移使用了 left 和 top
        // 定位点是位于页面最左上角
        // 但是为了效果将中心点移到了页面的 (960,200)
        // 故起始点和终点的坐标都需要减去 (960,300)
        endX = endX - originOffset.x,
        endY = endY - originOffset.y,
        startTime = Date.now();

      /*
       * 抛物线公式：
       * y = a * x*x + b*x;
       * y1 = a * x1*x1 + b*x1;
       * y2 = a * x2*x2 + b*x2;
       * 假设已知参数 a ，利用两点坐标可得 b，c：
       * b = ((y2-y1)+ a(x2*x2-x1*x1)) / (x2-x1)
       */
      b = ((endY - startY) - a * (endX * endX - startX * startX)) / (endX - startX);
      c = endY - a * endX * endX - b * endX;

      // console.log('startX ' + startX);
      // console.log('startY ' + startY);
      // console.log('endX ' + endX);
      // console.log('endY ' + endY);
      // console.log(b);
      // console.log(c);

      /**
       * 利用抛物线公式进行运动 y = a*x*x + b*x + c
       * @function parabolaRAF RAF句柄
       * @return {[type]}  [description]
       */
      requestAnimationFrame(function parabolaRAF() {
        var t = Math.min(1.0, (Date.now() - startTime) / time),
          tx = (endX - startX) * t + startX,
          ty = a * tx * tx + b * tx + c;

        // console.log('t ' + t);
        // console.log('tx ' + tx);
        // console.log('ty ' + ty);

        ball.style.left = tx + 960 + 'px';
        ball.style.top = ty + 300 + 'px';

        if (t < 1.0) requestAnimationFrame(parabolaRAF);
      })
    }
    return {
      eventBind: function() {
        //下面几个事件监听是一个原生拖曳小组件
        //与抛物线运动本身无关
        divDrag.addEventListener("mousedown", function() {
          isMove = true;
        }, false);

        divDrag.addEventListener("mouseup", function(e) {
          isMove = false;

          var cursorX = e.pageX,
            cursorY = e.pageY;

          ballParabolaMove(cursorX, cursorY, 2000);
        }, false);

        window.addEventListener("mousemove", function(e) {
          var cursorX = e.pageX,
            cursorY = e.pageY;

          if (isMove) {
            divDrag.style.left = cursorX - width + 'px';
            divDrag.style.top = cursorY - height + 'px';
          }
        }, false);
      },
      init: function() {
        this.eventBind();
      }
    }
  })();

  // 正弦运动
  sine = (function() {
    var ball = document.querySelector('.sine .ball'),
      distance = document.body.clientWidth * 0.8,
      startX = ball.getBoundingClientRect().left + Math.max(document.body.scrollLeft, document.documentElement.scrollLeft),
      startY = ball.getBoundingClientRect().top + Math.max(document.body.scrollTop, document.documentElement.scrollTop) - document.querySelector('.parabola').offsetHeight;

    // console.log('startX '+startX)
    // console.log('startY '+startY)

    /**
     * 正弦函数运动公式 y = sin(2PI * x)
     * @return {[type]} [description]
     */
    function sineMove() {
      var
        // RAF 开始时间
        startTime = Date.now(),
        // 动画持续时间
        duration = 20000;

      requestAnimationFrame(function sineAni() {
        var
        // 当前时间线
          t = Math.min(1, (Date.now() - startTime) / duration),
          // x 坐标
          tx = distance * t,
          // y 坐标
          ty = 0.05 * distance * Math.sin(10 * Math.PI * t);

        ball.style.left = tx + startX + 'px';
        ball.style.top = ty + startY + 'px';

        if (t < 1.0) requestAnimationFrame(sineAni);
      });
    }
    return {
      eventBind: function() {
        ball.addEventListener('click', function() {
          this.style.left = startX + 'px';
          this.style.top = startY + 'px';
          sineMove();
        }, false)
      },
      init: function() {
        sineMove();
        this.eventBind();
      }
    }
  })();

  // 圆周运动
  circular = (function(){
    var container = document.querySelector('.circular'),
      ball = container.querySelector('.circular .ball'),
      startX = (container.offsetWidth * 0.5) - (ball.offsetWidth * 0.5),
      startY = (container.offsetHeight * 0.5) - (ball.offsetHeight * 0.5);

    // console.log('startX '+startX)
    // console.log('startY '+startY)

    /**
     * 圆周运动方法，圆的参数方程
     * x=R * cos(ωt)
     * y=R * sin(ωt)
     * @return {[type]} [description]
     */
    function circularMove(){
      var
        // RAF 开始时间
        startTime = Date.now(),
        // 动画持续时间
        duration = 20000,
        // 圆的运动半径
        R = (container.offsetHeight * 0.6) / 2;

      requestAnimationFrame(function circularAni() {
        var
          // 当前时间线
          t = Math.min(1, (Date.now() - startTime) / duration),
          // x 坐标
          tx = R * Math.cos(10 * Math.PI * t),
          // y 坐标
          ty = - R * Math.sin(10 * Math.PI * t);

        ball.style.left = tx + startX + 'px';
        ball.style.top = ty + startY +'px';

        if (t < 1.0) requestAnimationFrame(circularAni);
      });
    }

    return{
      eventBind:function(){
        ball.addEventListener('click', function(){
          this.style.left = startX + 'px';
          this.style.top = startY + 'px';
          circularMove();
        }, false)
      },
      init:function(){
        circularMove();
        this.eventBind();
      }
    }
  })();

  // 自由落体运动
  var freefall = (function(){
    var container = document.querySelector('.freefall'),
      ball = container.querySelector('.freefall .ball'),
      startX = (container.offsetWidth * 0.5) - (ball.offsetWidth * 0.5),
      startY = (container.offsetHeight * 0.1) - (ball.offsetHeight * 0.5);

    console.log('freefall startX '+startX);
    console.log('freefall startY '+startY);

    /**
     * 自由落体反弹运动
     * S = 1/2 * g * T^2
     * g ≈ 10m/s
     * T = Math.sqrt(2s/g) ≈ 1414 ms
     * 下落阶段：St=a*t^2 --> S = S*t^2
     * 上升阶段：St=S−S*t(2−t)
     *
     */
    function freefallMove(){
      var
        // 假设 20px 为 1米
        // RAF 开始时间
        startTime = Date.now(),
        // 动画位移距离
        height = (container.offsetHeight * 0.8),
        // 模拟下落的距离
        S = height/20,
        // 动画持续时间
        duration = Math.sqrt(2 * S / 10) * 1000;

      // console.log('S '+S);
      // console.log('duration '+duration);

      requestAnimationFrame(function freefallAni() {
        var
          // 当前时间线
          // 这是一个相对时长，无论 duration 多大
          // t 的取值范围是 [0,1]
          t = Math.min(1, (Date.now() - startTime) / duration),
          // y 坐标
          // S = 1/2 * g * T^2
          ty = height * t * t;

        ball.style.top = ty + startY +'px';

        if (t < 1.0){
          requestAnimationFrame(freefallAni);
        }else{
          // ball.style.top = height + startY +'px';
          freeUpMove();
        }
      });
    }

    function freeUpMove(){
      var
        // 假设 20px 为 1米
        // RAF 开始时间
        startTime = Date.now(),
        // 动画位移距离
        height = (container.offsetHeight * 0.8),
        // 模拟下落的距离
        S = height/20,
        // 动画持续时间
        duration = Math.sqrt(2 * S / 10) * 1000;

      requestAnimationFrame(function freeUpAni() {
        var
          // 当前时间线
          t = Math.min(1, (Date.now() - startTime) / duration),
          // y 坐标
          ty = height - (height * t * (2 - t));

        // console.log('t '+t);
        // console.log('ty '+ty);

        ball.style.top = ty + startY +'px';

        if (t < 1.0){
          requestAnimationFrame(freeUpAni);
        }else{
          // ball.style.top = startY +'px';
          freefallMove();
        }
      });
    }

    return{
      init:function(){
        freefallMove();
      }
    }
  })();

  parabola.init();
  sine.init();
  circular.init();
  freefall.init();
})(window);
