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
		if(localMediaStream) {
			ctx.drawImage(video, 0, 0, width, height);
		}
	}
	
	function initialize() {
		width = this.videoWidth;
		height = this.videoHeight;

		video.removeEventListener('playing', initialize);

		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);

		requestAnimationFrame();
	}

	function requestAnimationFrame() {
		var 
			color;

		snapshot();

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

		video.addEventListener('playing', initialize);

		navigator.getUserMedia({video: true}, function(stream) {
			video.src = win.URL.createObjectURL(stream);

			localMediaStream = stream;
		}, function(err) {
			if(err) throw err;
		});
	};

})(this, this.document);