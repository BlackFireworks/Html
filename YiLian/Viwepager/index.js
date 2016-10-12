var imgUlWidth = 0,
    imgUl,
    timer;
var ChangeImg = {
	endX : 0,
	moveX : 0,
	speed : 0,
	startX : 0,
	moveDis : 0,
	oDiv : null,
	navLi : null,
	timestamp : 0,
	imgNumber : 0,
	moving : false,
	currentImg :  1,
	moving :  false,
	imgUlStartX : 0,
	slideSpeed : 600,
	slideTime : 3000,
	init : function (oDiv,slideSpeed,slideTime) {
		this.slideSpeed = slideSpeed || 600;
		this.slideTime = slideTime || 3000;
		this.getAllElement(oDiv);
		this.appendUl();
		this.changeWidth();
		
		this.changeColor(this.currentImg);
		timer = setInterval(function() {
			ChangeImg.moveLeft(imgUl, imgUlWidth);
		}, slideTime);
	},
	getAllElement : function (o) {
		imgUlWidth = document.body.clientWidth;
		this.oDiv = document.getElementById(o) || document.getElementsByClassName(o)[0];
		imgUl = this.oDiv.childNodes[1];
		this.imgNumber = imgUl.getElementsByTagName('li').length || 0;
		imgUl.addEventListener('touchstart',function (e) {
			ChangeImg.touchStart(e);
		});
		imgUl.addEventListener('touchmove',function (e) {
			ChangeImg.touchMove(e);
		});
		imgUl.addEventListener('touchend',function (e) {
			ChangeImg.touchEnd(e);
		});
		this.changeWidth();
		
		this.navLi = this.oDiv.childNodes[3].childNodes[1].getElementsByTagName('li');
	},
	moveLeft : function (o,dis) {
		if (o.style.transition == "none") {
			o.style.transition = "all " + this.slideSpeed + "ms";
		}
		dis = parseInt(dis) * -1;
		this.move(o,dis);
	},
	moveRight : function (o,dis) {
		if (o.style.transition == "none") {
			o.style.transition = "all " + this.slideSpeed + "ms";
		}
		dis = parseInt(dis) * 1;
		this.move(o,dis);
	},
	move : function (o,dis,setDis) {
		var oLeft = this.getTransformValue(o.style.transform);
		moveDis = setDis || (dis + oLeft);
		this.currentImg = moveDis / imgUlWidth - 1;
		if (this.moving === false) {
			this.changeColor(this.currentImg);
		}
		o.style.transform = "translateX("+ moveDis +"px)";
		if (this.currentImg === this.imgNumber * -1) {
			setTimeout(function () {
				ChangeImg.moveTo(ChangeImg.imgNumber * 2);
			},this.slideSpeed);
		}
		if (this.currentImg === this.imgNumber * -2 - 1) {
			setTimeout(function () {
				ChangeImg.moveTo(ChangeImg.imgNumber + 1);
			},this.slideSpeed);
		}
		
	},
	moveTo : function (site) {
		imgUl.style.transition = "none";
		ChangeImg.move(imgUl,null, imgUlWidth * (site-1) * -1);
		ChangeImg.changeColor(ChangeImg.currentImg);
	},
	getTransformValue : function (transformValue) {
		var result_start = transformValue.indexOf('(');
		var result_stop = transformValue.indexOf('px');
		return parseInt(transformValue.substring(result_start + 1,result_stop)) || 0;
	},
	changeWidth : function () {
		
		var oLi = imgUl.getElementsByTagName('li');
		imgUl.style.width = oLi.length * imgUlWidth + "px";
		for (var i = 0; i < oLi.length; i++) {
			if (oLi[i].nodeName != "#text") {
				oLi[i].style.width = imgUlWidth + "px";
			}
		}
		
	},
	appendUl : function () {
		imgUl.innerHTML = imgUl.innerHTML+imgUl.innerHTML+imgUl.innerHTML;
		imgUl.style.transition = "none";
		ChangeImg.move(imgUl,null,imgUlWidth * -this.imgNumber);
	},
	changeColor : function (item) {
		item = Math.abs(parseInt(item)) - this.imgNumber;
		item = item % this.imgNumber;
		if (item === 0) {
			item = this.imgNumber;
		}
		for (var i = 0; i < this.navLi.length; i++) {
			this.navLi[i].className = "changePic-nav-unselected";
		}
		this.navLi[item - 1].className = "changePic-nav-selected";
	},
	touchStart : function (e) {
		this.moving = true;
		imgUl.style.transition = "none"
		clearInterval(timer);
		this.startX = e.touches[0].pageX;
		this.imgUlStartX = this.getTransformValue(imgUl.style.transform);
		this.timestamp = new Date().getTime();
	},
	touchMove : function (e) {
		this.moveX = e.touches[0].pageX - this.startX;
		this.move(imgUl,null,this.moveX + this.imgUlStartX);
		this.endX = e.touches[0].pageX;
	},
	touchEnd : function (e) {
		imgUl.style.transition =  "all " + this.slideSpeed + "ms";
		this.moving = false;
		timer = setInterval(function() {
			ChangeImg.moveLeft(imgUl, imgUlWidth);
		}, this.slideTime);
		this.timestamp = new Date().getTime() - this.timestamp;
		this.speed = this.moveX / this.timestamp;
		if (this.speed > 1.1 || this.moveX * 2 > imgUlWidth) {

			this.move(imgUl,null, imgUlWidth + this.imgUlStartX)
		}else if(this.speed < -1.1 || this.moveX * -2 > imgUlWidth){

			this.move(imgUl,null, - imgUlWidth + this.imgUlStartX)
		}else{
			this.move(imgUl,null, this.imgUlStartX)
		}
	}
}