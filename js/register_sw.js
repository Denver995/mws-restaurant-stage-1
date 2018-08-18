if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js', { scope: './'}).then( reg => {
		console.log('your service worker was successfull registered');
	}).catch( error => {
		console.log('failled to registered your service worker', error);
	});
}