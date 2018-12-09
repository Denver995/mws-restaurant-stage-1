//handle the event that will post the a new review on the server 
    document.getElementById('btn-submit').addEventListener('click', (event) => {
        event.preventDefault();
        addReview(event);
        setTimeout(function(){ 
          document.querySelector('.message').style.display = "block"; 
          document.querySelector('.message').classList.toggle('success-message'); 
        }, 200);
        console.log('end event');
    });

    document.getElementById('btn-favorite').addEventListener('click', (event) => {
        event.preventDefault();
        const id = getParameterByName('id');
        DBHelper.addNewFavorite(id);
        document.getElementById('btn-favorite').innerHTML = "unfavorite";
        console.log('end event');
    });

    //show map carte
    document.getElementById('btn-display-map').addEventListener('click', () => {
        document.getElementById("btn-display-map").style.display = "none";
        document.getElementById("btn-hide-map").style.display = "block";
        document.getElementById("map-container").style.display = "block";
        document.getElementById("map").style.display = "block";    
    }); 

    //show controls buttons
    document.getElementById('btn-display-controls').addEventListener('click', () => {
        document.getElementById("btn-display-controls").style.display = "none";
        document.getElementById("control-contain").style.display = "block";
        document.getElementById("btn-display-reviews-list").style.display = "block"; 
        document.getElementById("btn-display-map").style.display = "block";
        document.getElementById("btn-hide-form").style.display = "none";
        document.getElementById("btn-hide-map").style.display = "none";
        document.getElementById("btn-hide-reviews-list").style.display = "none";
        document.getElementById("btn-hide-controls").style.display = "block";   
    }); 

    //hide controls buttons
    document.getElementById('btn-hide-controls').addEventListener('click', () => {
        document.getElementById("btn-hide-controls").style.display = "none"; 
        document.getElementById("btn-display-controls").style.display = "block";
        document.getElementById("control-contain").style.display = "none";   
    });

    //hide map carte
    document.getElementById('btn-hide-map').addEventListener('click', () => {
        document.getElementById("btn-hide-map").style.display = "none"; 
        document.getElementById("btn-display-map").style.display = "block";
        document.getElementById("map-container").style.display = "none";   
    });

    //show the form to add a new review
    document.getElementById('btn-display-form').addEventListener('click', () => {
        document.getElementById("form-reviews").style.display = "block"; 
        document.querySelector(".form-reviews").classList.toggle("card");
        document.getElementById("btn-hide-form").style.display = "block";
        document.getElementById("btn-display-form").style.display = "none";   
    });

    //hide the form 
    document.getElementById('btn-hide-form').addEventListener('click', () => {
        document.getElementById("form-reviews").style.display = "none"; 
        document.querySelector(".form-reviews").classList.remove("card"); 
        document.getElementById("btn-hide-form").style.display = "none";
        document.getElementById("btn-display-form").style.display = "block";  
    });

    //show reviews list
    document.getElementById('btn-display-reviews-list').addEventListener('click', () => {
        document.getElementById("btn-display-reviews-list").style.display = "none"; 
        document.getElementById("btn-hide-reviews-list").style.display = "block";
        document.getElementById("reviews-list").style.display = "block";   
    });

    //hide reviews list
    document.getElementById('btn-hide-reviews-list').addEventListener('click', () => {
        document.getElementById("btn-hide-reviews-list").style.display = "none";
        document.getElementById("reviews-list").style.display = "none";  
        document.getElementById("btn-display-reviews-list").style.display = "block";  
    });