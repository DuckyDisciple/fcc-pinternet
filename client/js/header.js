var displayName = $("#profile-display");

var apiUrl = "/api/user";

function updateUser(){
    $.get(apiUrl, function(user){
        if(user.id !== undefined){
            $(".not-logged-in").addClass("hide");
            $(".logged-in").removeClass("hide");
            displayName.html(user.displayName);
        }else{
            $(".not-logged-in").removeClass("hide");
            $(".logged-in").addClass("hide");
        }
    });
}

$(document).ready(function(){
    updateUser();
});