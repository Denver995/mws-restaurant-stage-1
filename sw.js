/* store all static file in urlToCache*/
let urlToCache = [
					'/mws-restaurant-stage-1/css/styles.css', 
					'./css/responsive-index.css', 
					'./css/responsive-restaurant.css',
					'./data/restaurants.json'
					'./js/dbhelper.js',
					'./js/main.js',
					'./js/restaurant_info.js',
				];
let cachName = 'mws-restaurant-stage-1-v1';
let allCaches = [urlToCache, cachName];

/* listen to the install service worker event to cache file*/
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cachName).then(function(cache) {
			/* cache all static file*/
			cache.addAll(urlToCache);
		})
	);
});

/* listen to the activate service worker event to update cache*/
self.addEventListener('activate', function(event){
	let cacheWhiteList = Object.values(allCaches);
	event.waitUntil(
		caches.keys().then(function(CACHENAME) {
			return Promise.all(
				CACHENAME.map(function (cachName) {
					if (cacheWhiteList.indexOf(cachName) === -1) {
						return caches.delete(cachName);
					}
				})
			);
		})
	);
})

/* listen to the fetch service worker event to respond or cache a request*/
self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.open(cachName).then(function(cache) {
			return cache.match(event.request).then(function(response) {
				if (response) {
					return response;
				}

				return fetch(event.request).then(function(new_response){
					cache.put(event.request, new_response.clone());
					return new_response;
				})
			})
		})
	);
})