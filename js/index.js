var sketch = angular.module('sketch',[]);
sketch.controller('sketchController', ['$scope', function($scope){
	$scope.wh = [800,600];
	$scope.csState = {
		fillStyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:1,
		style:'stroke'	
	};
	$scope.setStyle = function(s) {
		$scope.csState.style = s;
	}
	$scope.newSketch = function(){
		if(previous){
			if( confirm('是否保存') ){
				location.href = canvas.toDataURL();		
			}
		}
		clearCanvas();
		previous = null;
	}
	$scope.save = function(ev){
		if(previous){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download = 'mypic.png';
		}else{
			alert('空画布');
		}
	}

	$scope.tool = 'rect';
	$scope.tools = {
		'画线':'line',
		'画圆':'arc',
		'矩形':'rect',
		'铅笔':'pen',
		'橡皮':'erase',
		'选择':'select'
	};
	$scope.setTool = function(s) {
		$scope.tool = s;
	}


	var 
	canvas = document.querySelector('#canvas'),
	ctx = canvas.getContext('2d'),
	previous;

	var saveCurrentImage =  function() {
		previous = ctx.getImageData(0,0,$scope.wh[0],$scope.wh[1]);
	}
	var clearCanvas = function() {
		ctx.clearRect(0,0,$scope.wh[0],$scope.wh[1]);
	}
	var setmousemove = {
		line:function (e) {
			canvas.onmousemove = function(ev) {
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		rect:function(e) {
			canvas.onmousemove = function(ev) {
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();
				var w = ev.offsetX - e.offsetX;
				var h = ev.offsetY - e.offsetY;
				if($scope.csState.style == 'fill'){
					ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				}else{
					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				}
			}
		},
		arc:function(e) {
			canvas.onmousemove = function(ev) {
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.beginPath();
				var r = Math.abs(e.offsetX - ev.offsetX);
				ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
				if($scope.csState.style == 'fill'){
					ctx.fill();
				}else{
					ctx.stroke();
				}
			}
		},
		erase:function(e) {
			canvas.onmousemove = function(ev){
				ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
			}
		},
		pen:function(e) {
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove = function(ev) {
				clearCanvas();
				if(previous){
					ctx.putImageData(previous,0,0);
				}
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		select:function(e) {
			console.log('select');
		}
	}
	canvas.onmousedown = function(e) {
		ctx.strokeStyle = $scope.csState.strokeStyle;
		ctx.fillStyle   = $scope.csState.fillStyle;
		ctx.lineWidth   = $scope.csState.lineWidth;

		setmousemove[$scope.tool](e);
		document.onmouseup = function() {
			canvas.onmousemove = null;
			saveCurrentImage();
		}
	}
}])