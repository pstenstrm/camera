(function(win, doc){
	"use strict";
	
	var 
		canvas = doc.getElementById('canvas'),
		video = doc.getElementById('video'),
		file = doc.getElementById('file'),
		ctx = canvas.getContext('2d'),
		localMediaStream = null,
		width,
		height;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	function snapshot() {
		if(localMediaStream) {
			ctx.drawImage(video, 0, 0, width, height);
		}
	}

	video.addEventListener('playing', initialize);
	
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


	/*win.navigator.getUserMedia({video: true}, function(stream) {
		video.src = win.URL.createObjectURL(stream);

		localMediaStream = stream;
	}, function(err) {
		if(err) throw err;
	});*/

	file.addEventListener('change', function() {
		if(!this.files.length) return;

		var 
			src = win.URL.createObjectURL(this.files[0]),
			img = new Image();

		img.onload = function() {
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

			requestAnimationFrame();
		};

		img.src = src;
	});
	
})(this, this.document);