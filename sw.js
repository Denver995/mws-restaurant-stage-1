/* store all static file in urlToCache*/
let urlToCache = [
					'./',
					'./css/styles.css', 
					'./css/responsive-index.css', 
					'./css/responsive-restaurant.css'
				];

let contentImgsCache = 'mws-restaurant-img';
let cachName = 'mws-restaurant-stage-2-v1';
let allCaches = [cachName, contentImgsCache];

/* listen to the install service worker event to cache file*/
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(cachName).then(function(cache) {
			/* cache all static file*/
			console.log('create cache for url');
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

	/*const requestUrl = new URL(event.request.url);
	if (requestUrl.origin === location.origin ) {
		if (requestUrl.pathname.startsWith('/img/')) {
			event.respondWith(serveImage(event.request));
			return;
		}
		cacheRequest(event);
		return;
	}*/
	cacheRequest(event);
})

/* fuction serveImage that request for the image in the cache

function serveImage(request) {
	caches.open(contentImgsCache).then(function(cache) {
		return cache.match(request).then(function(response_img){
			if (response_img) {
				return response_img;
			}
			return fetch(request).then(function(new_img) {
				cache.put(request, new_img.clone());
				return new_img;
			})
		});
	})
}
*/
function cacheRequest(event) {
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
}