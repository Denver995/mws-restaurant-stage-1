/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static idbStorage() {
    var dbPromise = idb.open('data', 4, function(upgradeDb) {
      switch(upgradeDb.oldVersion){
        case 0:
          upgradeDb.createObjectStore('list-restaurants');
        case 1:
          upgradeDb.createObjectStore('list-reviews');
        case 2:
          var reviewsStorage = upgradeDb.transaction.objectStore('list-reviews');
          reviewsStorage.createIndex('restaurant-reviews', 'restaurant_id');
        case 3:
          upgradeDb.createObjectStore('list-favorite-restaurents');
        case 4:
          upgradeDb.createObjectStore('pending-reviews');
      }
    });
    return dbPromise;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    /*var xhr = new XMLHttpRequest();
    xhr.open('GET', DBHelper.DATABASE_URL);
    xhr.onload = () => {
      if (xhr.status === 200) { // Got a success response from server!
        const json = JSON.parse(xhr.responseText);
        const restaurants = json.restaurants;
        callback(null, restaurants);
      } else { // Oops!. Got an error from server.
        const error = (`Request failed. Returned status of ${xhr.status}`);
        callback(error, null);
      }
    };
    xhr.send();*/
      var dbPromise = DBHelper.idbStorage();
      //try to fetch data to the local storage before going to the network
      dbPromise.then((db) => {
        const tx = db.transaction('list-restaurants');
        const restaurantsList = tx.objectStore('list-restaurants');
        return restaurantsList.get('data');
      }).then((data) => {
          //if there is no data store, fetch from the local server
          if(data === undefined){
            fetch(DBHelper.DATABASE_URL).then((resp) => { 
              return resp.json();
            }).then((restaurants) => {
                dbPromise.then((db) => {
                const tx = db.transaction('list-restaurants', 'readwrite');
                const restaurantsStorage = tx.objectStore('list-restaurants');
                restaurantsStorage.put(restaurants, 'data');
                callback(null, restaurants);
                return tx.complete;
              }).then(() => { 
                  console.log('data has been store in idb'); 
                });
              }).catch((error) => { 
                  callback(error, null);
                });
          }else{
            callback(null, data);
          }
      })

      DBHelper.fetchFavorite();
  } 

static fetchReviews(id) {
  //try to fetch data to the local storage before going to the network
  const query = "http://localhost:1337/reviews/?restaurant_id="+id;
  var dbPromise = DBHelper.idbStorage();
  fetch(query).then((resp) => { 
        return resp.json();
      }).then((reviewsList) => {
        console.log(reviewsList);
        const dbPromise = DBHelper.idbStorage();
        dbPromise.then((db) => {
        const tx = db.transaction('list-reviews', 'readwrite');
        const reviewsStorage = tx.objectStore('list-reviews');
          reviewsList.forEach((review) => {
            console.log(review)
            reviewsStorage.put(review, review.id);
            fillReviewHTML(review);
          });
          return tx.complete; 
        });
    }).catch((error) => {
      dbPromise.then((db) => {
      const tx = db.transaction('list-reviews');
      const reviewsStorage = tx.objectStore('list-reviews');
      const restaurantIndex = reviewsStorage.index('restaurant-reviews')
        return restaurantIndex.getAll(id);
      }).then((data_reviews) => {
          //if there is no data store, fetch from the local server
          data_reviews.forEach((review) => {
            fillReviewHTML(review);
          });
      }).catch((error) => {
        console.log(error);
        
      });
    });
}

static fetchFavorite() {
  //try to fetch data to the local storage before going to the network
  const query = "http://localhost:1337/restaurants/?is_favorite=true";
  var dbPromise = DBHelper.idbStorage();
  fetch(query).then((resp) => { 
        return resp.json();
      }).then((favoriteList) => {
        console.log(favoriteList);
        const dbPromise = DBHelper.idbStorage();
        dbPromise.then((db) => {
        const tx = db.transaction('list-favorite-restaurents', 'readwrite');
        const favoriteStorage = tx.objectStore('list-favorite-restaurents');
          favoriteList.forEach((favorite) => {
            console.log(favorite)
            //const key = "favorites-"+id;
            favoriteStorage.put(favorite.id, 'key');
            //fillReviewHTML(favorite);
          });
          return tx.complete; 
        });
    }).catch((error) => {
      dbPromise.then((db) => {
      const tx = db.transaction('list-favorite-restaurents');
      const favoriteStorage = tx.objectStore('list-favorite-restaurents');
        return favoriteStorage.getAll();
      }).then((favoriteList) => {
          //if there is no data store, fetch from the local server
          favoriteList.forEach((favorite) => {
            //fillReviewHTML(review);
            console.log(favorite);
          });
      }).catch((error) => {
        console.log(error);
        
      });
    });
}

/**
*function that will call to post review server
*/

 
static addNewReview(review) {
  const url = 'http://localhost:1337/reviews/';
  fetch(url, {
    method: 'post',
    headers: {"Content-type": "application/json; charset=UTF-8"},
    body:JSON.stringify(review)
  }).then((resp) => { 
    return resp.json();
  }).then((data) => {
    var dbPromise = DBHelper.idbStorage();
    dbPromise.then((db) => {
      const tx = db.transaction('list-reviews', 'readwrite');
      const objectStore = tx.objectStore('list-reviews');
      objectStore.put(data, data.id);
      return tx.complete;
    }).then((data) => {
      console.log('your new reviews has been posted')
    })
    console.log('Request succeeded with JSON response', data);
  }).catch((error) => {
      console.log('an error happen', error);
      var dbPromise = DBHelper.idbStorage();
      dbPromise.then((db) => {
        const tx = db.transaction('pending-reviews', 'readwrite');
        const objectStore = tx.objectStore('pending-reviews');
        objectStore.put(review, review.restaurant_id);
        return tx.complete;
    });
  });    
}


// Favorite a restaurant
static addNewFavorite(id){
  const query = `http://localhost:1337/restaurants/${id}/?is_favorite=true`;
  fetch(query, {
    method: 'post'
  }).then((resp) => {
    console.log(resp);
    var dbPromise = DBHelper.idbStorage();
    if (resp.status === 200) {
        dbPromise.then((db) => {
        const tx = db.transaction('list-favorite-restaurents', 'readwrite');
        const objectStore = tx.objectStore('list-favorite-restaurents');
        const key = "favorites-"+id;
        objectStore.put(id, key);
        return tx.complete;
    });
    }
  }).catch((error) => {
    console.log(error);
  });
}

// Unfavorite a restaurant
static UnFavorite(id){
  const query = `http://localhost:1337/restaurants/${id}/?is_favorite=false`;
  fetch(query, {
    method: 'post'
  }).then((resp) => {
    console.log(resp);
    var dbPromise = DBHelper.idbStorage();
    dbPromise.then((db) => {
      const tx = db.transaction('list-favorite-restaurents', 'readwrite');
      const objectStore = tx.objectStore('list-favorite-restaurents');
      objectStore.delete(id);
      return tx.complete;
    })
  }).catch((error) => {
    console.log(error);
  });
}

//check if retaurant is favorite
static isFavorite(restaurant){
  var dbPromise = DBHelper.idbStorage();
        dbPromise.then((db) => {
        const tx = db.transaction('list-favorite-restaurents');
        const objectStore = tx.objectStore('list-favorite-restaurents');
        return objectStore.getAll();
    }).then((favoriteList) => {
          if(favoriteList.indexOf(restaurant) != -1)
            return "favorite";
          else
            return "unfavorite";
      }).catch((error) => {
        console.log(error);
        
      });
}

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        /*const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }*/

        //try to fetch data to the local storage before going to the network
        var dbPromise = DBHelper.idbStorage();
        const query = `http://localhost:1337/restaurants/${id}`;
        dbPromise.then((db) => {
          const tx = db.transaction('list-restaurants');
          const restaurantsList = tx.objectStore('list-restaurants');
          return restaurantsList.get(query);
        }).then((data) => {
            //if there is no data store, fetch from the local server
            if(data === undefined){
              fetch(query).then((resp) => { 
                return resp.json();
              }).then((restaurant) => {
                  dbPromise.then((db) => {
                  const tx = db.transaction('list-restaurants', 'readwrite');
                  const restaurantsStorage = tx.objectStore('list-restaurants');
                  restaurantsStorage.put(restaurant, query);
                  callback(null, restaurant);
                  return tx.compvare;
                }).then(() => { 
                    console.log('data has been store in idb'); 
                  });
                }).catch((error) => { 
                    callback(error, null);
                    console.log('restaurant does not exist');
                  });
            }else{
              callback(null, data);
            }
        })
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        var results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL. 
   */
  static imageUrlForRestaurant(restaurant) {
    return `/img/${restaurant.photograph || restaurant.id}.jpg`;
  }

  /**
   * Map marker for a restaurant.
   */
   static mapMarkerForRestaurant(restaurant, map) {
    // https://leafvarjs.com/reference-1.3.0.html#marker  
    const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
      {title: restaurant.name,
      alt: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant)
      })
      marker.addTo(newMap);
    return marker;
  } 
  /* static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  } */

}
