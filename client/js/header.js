var socket = io();

function updateRequestCount(){
    $(".requests").addClass("hide");
    $(".requests").removeClass("header-requests");
    $.get("/requests/count",function(data){
        if(data.count > 0){
            $(".requests").html(data.count);
            $(".requests").addClass("header-requests");
            $(".requests").removeClass("hide");
        }
    });
}

$(document).on('ready',function(){
    updateRequestCount();
});

socket.on("requested",function(msg){
    updateRequestCount();
});