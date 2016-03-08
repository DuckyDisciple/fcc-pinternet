"use strict";

(function(){
    var displayName = document.querySelector("#profile-display") || null;
    var loggedInDiv = document.querySelector(".logged-in") || null;
    var notLoggedInDiv = document.querySelector(".not-logged-in") || null;
    
    var apiUrl = appUrl + '/api/:id';
    
    function updateHtmlElement(data, element, userProperty){
        if(userProperty==="displayName"){
            var fullName = data[userProperty];
            var firstName = fullName.substring(0,fullName.lastIndexOf(' '));
        }
        if(element !== null)
            element.innerHTML = firstName;
    }
    
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest("GET",apiUrl,function(data){
        try{
            var userObject = JSON.parse(data);
        
            if(userObject.email!==undefined){
                loggedInDiv.className = loggedInDiv.className.replace(/\bhide\b/g,'');
                notLoggedInDiv.classList.add("hide");
            }
            
            if(displayName!==null){
                if(userObject.displayName!==undefined){
                    updateHtmlElement(userObject,displayName,'displayName');
                }else if(userObject.email!==undefined){
                    updateHtmlElement(userObject,displayName,'email');
                }
            }
        }catch(error){
            //not logged in
        }
    }));
})();