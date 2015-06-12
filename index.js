(function(win, doc){
	"use strict";
	
	var 
		canvas,
		video,
		ctx,
		localMediaStream = null,
		width,
		height;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	function snapshot() {
		var 
			snapshot = document.getElementsByTagName("img")[0];

		if(snapshot) {

			drawImg(snapshot.src);
			return true;

		} else if(localMediaStream) {
			ctx.drawImage(video, 0, 0, width, height);
			return false;
		}
	}

	function drawImg(src) {
		var img = new Image();

		logln(src);

		setTimeout(function() {
			width = img.width;
			height = img.height;

			if(width > height && width > 400) {
				height = 400 * (height / width);
				width = 400;
			} else if (height > width) {
				width = 400 * (width / height);
				height = 400;
			}

			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);

			ctx.drawImage(img, 0, 0, width, height);

			calcColor();
		}, 300);

		img.src = src;
	}
	
	function initialize() {
		width = video.width;
		height = video.height;

		video.removeEventListener('playing', initialize);

		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);

		requestAnimationFrame();
	}

	function requestAnimationFrame() {
		var bowser = snapshot();

		if(!bowser) {
			calcColor();
		}
	}

	function calcColor() {
		var 
			color;

		color = getCanvasColor();

		doc.body.style.background = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';

		win.requestAnimationFrame(requestAnimationFrame);
	}

	function getCanvasColor () {
		var 
			blockSize = 5,
			data = ctx.getImageData(0, 0, width, height),
			color = {r: 0, g: 0, b: 0},
			len = data.data.length,
			count = 0,
			i;

		for(i = 0; i < len; i += blockSize * 4) {
			count++;
			color.r += data.data[i];
			color.g += data.data[i + 1];
			color.b += data.data[i + 2];
		}

		color.r = ~~(color.r / count);
		color.g = ~~(color.g / count);
		color.b = ~~(color.b / count);

		return color;
	}
	
	window.onload = function() {
		canvas = doc.getElementById('canvas');
		video = doc.getElementById('video');
		ctx = canvas.getContext('2d');

		//video.addEventListener('playing', initialize);

		navigator.getUserMedia({video: true}, function(stream) {
			video.src = win.URL.createObjectURL(stream);

			localMediaStream = stream;

			setTimeout(function() {
				initialize();
			}, 1000);

		}, function(err) {
			if(err) throw err;
		});
	};

	function log(str) {
		doc.body.appendChild(doc.createTextNode(str));
	}

	function logln(str) {
		log(str);
		doc.body.appendChild(doc.createElement('br'));
	}

})(this, this.document);