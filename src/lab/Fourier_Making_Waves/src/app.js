if(navigator.serviceWorker) {
	navigator
		.serviceWorker
		.register('./.././Fourier_Making_Waves/service_worker_Fourier_Making_Waves.js')
		.then(function(r) {
			console.log('NW  App now available offline');
		})
		.catch(function(e) {
			console.log('NW App NOT available offline');
			console.log(e);
		});
} else {
	console.log('Service workers are not supported');
}
