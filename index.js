(function(win, doc){
	"use strict";
	
	var 
		canvas = doc.getElementById('canvas'),
		video = doc.getElementById('video'),
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
		snapshot();

		win.requestAnimationFrame(requestAnimationFrame);
	}


	win.navigator.getUserMedia({video: true}, function(stream) {
		video.src = win.URL.createObjectURL(stream);

		localMediaStream = stream;
	}, function(err) {
		if(err) throw err;
	});


})(this, this.document);