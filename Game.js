var canvas;
var ctx;
var map;
var pc;
var dt;
var images;
var anterior = 0;
var frame = 0;
var perdeu = false;
var vitoria = false;
var completo = false;
var posInicioX = 0;
var posInicioY = 0;
var posFinalX = 0;
var posFinalY = 0;

function init(){
  perdeu = false;
  vitoria = false;
  completo = false;
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = 720;
  canvas.height = 480;
  ctx = canvas.getContext("2d");
  images = new ImageLoader();
  images.load("pc","pc.png");
  map = new Map(Math.floor(canvas.height/40), Math.floor(canvas.width/40));
  map.images = images;
  /*map.setCells([
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ]);*/
map.setCells(JSON.parse("[" + display(maze(5,5)) + "]"));
/*map.setCells([
	[1,1,2,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,0,0,0,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,1,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,3],
	[1,1,1,1,1,1,1,1,1,1,1,1,1]
])*/
  pc = new Sprite();
  pc.x = 30 * (posInicioX + 1);
  pc.y = 30 * (posInicioY + 1);
  pc.images = images;
  initControls();
  requestAnimationFrame(passo);
}


function passo(t){
  dt = (t-anterior)/1000;
  requestAnimationFrame(passo);
  //ctx.save();
  //ctx.translate(250,0);
  //ctx.scale(1,0.5);
  //ctx.rotate(Math.PI/4);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  pc.mover(map, dt);
  //map.perseguir(pc);
  map.mover(dt);
  map.desenhar(ctx);
  pc.desenhar(ctx);
  anterior = t;
  //ctx.restore();
  frame = (frame<9)?frame:1;
  //images.drawFrame(ctx,"pc",8,Math.floor(frame),0,0,64);
  frame+=2*dt;
  
  if(completo){
	ctx.fillStyle = "#000";
	ctx.font="30px Arial";
	ctx.fillText("CONCLUÍDO", 120, 210);
	ctx.font="13px Arial";
	ctx.fillText("Espaço - Iniciar Jogo", 160, 240);
	pc.vx = 0;
	pc.vy = 0;
  }else if(vitoria){
	ctx.fillStyle = "#000";
	ctx.font="30px Arial";
	ctx.fillText("Objetivo Concluído", 90, 210);
	ctx.font="13px Arial";
	ctx.fillText("Espaço - Próximo Nível", 160, 240);
	pc.vx = 0;
	pc.vy = 0;
  }
  
  if(perdeu){
	ctx.fillStyle = "#000";
	ctx.font="30px Arial";
	ctx.fillText("Você Perdeu", 120, 210);
	ctx.font="13px Arial";
	ctx.fillText("Espaço - Iniciar Jogo", 160, 240);
	pc.vx = 0;
	pc.vy = 0;
  }
}


function initControls(){
  addEventListener('keydown', function(e){
    switch (e.keyCode) {
	  case 32:
		if(vitoria || perdeu || completo){
			if(completo){
				document.getElementById("qtdLevel").innerHTML = 1;
			}else if(vitoria){
				document.getElementById("qtdLevel").innerHTML = parseInt(document.getElementById("qtdLevel").innerHTML) + 1;
			}
			init();
		}
        break;
      case 37:
	    if(!vitoria && !perdeu && !completo){
			pc.vx = -100;
			pc.vy = 0;
			pc.pose = 2;
			e.preventDefault();
		}
        break;
      case 38:
	    if(!vitoria && !perdeu && !completo){
			pc.vy = -100;
			pc.vx = 0;
			pc.pose = 3;
			e.preventDefault();
		}
        break;
      case 39:
	    if(!vitoria && !perdeu && !completo){
			pc.vx = 100;
			pc.vy = 0;
			pc.pose = 0;
			e.preventDefault();
		}
        break;
      case 40:
	    if(!vitoria && !perdeu && !completo){
			pc.vy = 100;
			pc.vx = 0;
			pc.pose = 1;
			e.preventDefault();
		}
        break;
      default:

    }
  });
  addEventListener('keyup', function(e){
    switch (e.keyCode) {
      case 37:
      case 39:
        pc.vx = 0;
        pc.pose = 4;
        break;
      case 38:
      case 40:
        pc.vy = 0;
        break;
      default:

    }
  });
}

function duom(){

    var a = 3;
    var b = 3;

    //document.getElementById('out').innerHTML = display(maze(a,b));
    console.log(JSON.parse("[" + display(maze(a,b)) + "]"));
}

function maze(x,y) {
    var n=x*y-1;
    if (n<0) {alert("illegal maze dimensions");return;}
    var horiz=[]; for (var j= 0; j<x+1; j++) horiz[j]= [];
    var verti=[]; for (var j= 0; j<y+1; j++) verti[j]= [];
    var here= [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
    var path= [here];
    var unvisited= [];
    for (var j= 0; j<x+2; j++) {
        unvisited[j]= [];
        for (var k= 0; k<y+1; k++)
            unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
    }
    while (0<n) {
        var potential= [[here[0]+1, here[1]], [here[0],here[1]+1],
            [here[0]-1, here[1]], [here[0],here[1]-1]];
        var neighbors= [];
        for (var j= 0; j < 4; j++)
            if (unvisited[potential[j][0]+1][potential[j][1]+1])
                neighbors.push(potential[j]);
        if (neighbors.length) {
            n= n-1;
            next= neighbors[Math.floor(Math.random()*neighbors.length)];
            unvisited[next[0]+1][next[1]+1]= false;
            if (next[0] == here[0])
                horiz[next[0]][(next[1]+here[1]-1)/2]= true;
            else 
                verti[(next[0]+here[0]-1)/2][next[1]]= true;
            path.push(here= next);
        } else 
            here= path.pop();
    }
    return ({x: x, y: y, horiz: horiz, verti: verti});
}

function display(m) {
    var text= [];
    for (var j= 0; j<m.x*2+1; j++) {
        var line= [];
        if (0 == j%2)
            for (var k=0; k<m.y*4+1; k++)
                if (0 == k%4) 
                    line[k]= '1';
                else
                    if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
                        line[k]= '0';
                    else
                        line[k]= '1';
        else
            for (var k=0; k<m.y*4+1; k++)
                if (0 == k%4)
                    if (k>0 && m.horiz[(j-1)/2][k/4-1])
                        line[k]= '0';
                    else
                        line[k]= '1';
                else
                    line[k]= '0';
        if (0 == j) line[1]=line[3]='1',line[2]= '1';
        if (m.x*2-1 == j) line[4*m.y]= '1';
        text.push('['+line.join(',')+']');
    }
    return text.join(',');
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-1656750-34', 'auto');
ga('require', 'linkid', 'linkid.js');
ga('require', 'displayfeatures');
ga('send', 'pageview');
