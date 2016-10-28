var ChangeImg_imgUlWidth = 0,
	ChangeImg_imgUl,
	ChangeImg_timer;
var ChangeImg = {
	endX: 0,
	moveX: 0,
	speed: 0,
	startX: 0,
	moveDis: 0,
	oDiv: null,
	navLi: null,
	timestamp: 0,
	imgNumber: 0,
	moving: false,
	currentImg: 1,
	moving: false,
	imgUlStartX: 0,
	slideSpeed: 600,
	slideTime: 3000,
	init: function(oDiv, slideSpeed, slideTime) {
		this.slideSpeed = slideSpeed || 600;
		this.slideTime = slideTime || 3000;
		this.getAllElement(oDiv);
		this.changeColor(this.currentImg);
		ChangeImg_timer = setInterval(function() {
			ChangeImg.moveLeft(ChangeImg_imgUl, ChangeImg_imgUlWidth);
		}, slideTime);
	},
	getAllElement: function(o) {
		this.oDiv = document.getElementById(o) || document.getElementsByClassName(o)[0];
		ChangeImg_imgUl = this.oDiv.childNodes[1];
		this.imgNumber = ChangeImg_imgUl.getElementsByTagName('li').length || 0;
		ChangeImg_imgUl.addEventListener('touchstart', function(e) {
			ChangeImg.touchStart(e);
		});
		ChangeImg_imgUl.addEventListener('touchmove', function(e) {
			ChangeImg.touchMove(e);
		});
		ChangeImg_imgUl.addEventListener('touchend', function(e) {
			ChangeImg.touchEnd(e);
		});
		ChangeImg_imgUl.addEventListener('transitionend', function() {
			ChangeImg.transitionEnd();
		}, false);
		ChangeImg_imgUl.addEventListener('webkitTransitionEnd', function() {
			ChangeImg.transitionEnd();
		}, false);
		ChangeImg_imgUl.addEventListener('mozTransitionEnd', function() {
			ChangeImg.transitionEnd();
		}, false);
		
		this.changeWidth();
		this.moveTo(this.currentImg);
		this.navLi = this.oDiv.childNodes[3].childNodes[1].getElementsByTagName('li');

	},
	moveLeft: function(o, dis) {
		if(o.style.transition == "none") {
			o.style.transition = "all " + this.slideSpeed + "ms";
		}
		dis = parseInt(dis) * -1;
		this.move(o, dis);
		this.currentImg++;
	},
	moveRight: function(o, dis) {
		if(o.style.transition == "none") {
			o.style.transition = "all " + this.slideSpeed + "ms";
		}
		dis = parseInt(dis) * 1;
		this.move(o, dis);
		this.currentImg--;
	},
	move: function(o, dis, setDis) {

		moveDis = setDis || (dis + this.getTransformValue(o.style.transform));
		if (Math.abs(setDis) === 0) {
			moveDis = setDis;
		}
		o.style.transform = "translateX(" + moveDis + "px)";

	},
	moveTo: function(site) {
		ChangeImg_imgUl.style.transition = "none";
		ChangeImg.move(ChangeImg_imgUl, null, ChangeImg_imgUlWidth * site  * -1);
		
	},
	getTransformValue: function(transformValue) {
		var result_start = transformValue.indexOf('(');
		var result_stop = transformValue.indexOf('px');
		return parseInt(transformValue.substring(result_start + 1, result_stop)) || 0;
	},
	changeWidth: function() {
		ChangeImg_imgUlWidth = document.body.clientWidth;
		var oLi = ChangeImg_imgUl.getElementsByTagName('li');
		console.log(oLi);
		ChangeImg_imgUl.style.width = oLi.length * ChangeImg_imgUlWidth + "px";
		for(var i = 0; i < oLi.length; i++) {
			if(oLi[i].nodeName != "#text") {
				oLi[i].style.width = ChangeImg_imgUlWidth + "px";
			}
		}
		
	},
	changeColor: function(item) {
		for(var i = 0; i < this.navLi.length; i++) {
			this.navLi[i].className = "changePic-nav-unselected";
		}
		this.navLi[item - 1].className = "changePic-nav-selected";
	},
	touchStart: function(e) {
		this.moving = true;

		clearInterval(ChangeImg_timer);
		this.startX = e.touches[0].pageX;
		this.imgUlStartX = this.getTransformValue(ChangeImg_imgUl.style.transform);
		this.timestamp = new Date().getTime();

	},
	touchMove: function(e) {

		ChangeImg_imgUl.style.transition = "none"
		e.preventDefault();
		this.moveX = e.touches[0].pageX - this.startX;
		this.move(ChangeImg_imgUl, null, -this.currentImg * ChangeImg_imgUlWidth + this.moveX);
		this.endX = e.touches[0].pageX;
	},
	touchEnd: function(e) {
		ChangeImg_imgUl.style.transition = "all " + this.slideSpeed + "ms";
		this.moving = false;
		ChangeImg_timer = setInterval(function() {
			ChangeImg.moveLeft(ChangeImg_imgUl, ChangeImg_imgUlWidth);
		}, this.slideTime);
		this.timestamp = new Date().getTime() - this.timestamp;
		this.speed = this.moveX / this.timestamp;
		console.log(this.speed);
		if(this.speed > 0.4 || this.moveX * 2 > ChangeImg_imgUlWidth) {
			
			this.currentImg--;
			console.log( -ChangeImg_imgUlWidth * this.currentImg);
			this.move(ChangeImg_imgUl, null, -ChangeImg_imgUlWidth * this.currentImg);
		} else if(this.speed < -0.4 || this.moveX * -2 > ChangeImg_imgUlWidth) {
			
			this.currentImg++;
			this.move(ChangeImg_imgUl, null, -ChangeImg_imgUlWidth * this.currentImg);
		} else {
			this.move(ChangeImg_imgUl, null, this.imgUlStartX);
		}
	},
	transitionEnd: function() {
		
		if(this.currentImg >= this.imgNumber - 1) {
			this.currentImg = 1;
			this.moveTo(1);
			

		} else if(this.currentImg <= 0) {
			this.currentImg = this.imgNumber - 2;
			this.moveTo(this.imgNumber - 2);
			
		}
		
		ChangeImg.changeColor(ChangeImg.currentImg);
	}
}
