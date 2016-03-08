var socket = io();

function updateLibrary(){
    $(".request-flag").addClass("hide");
    $(".request-flag").removeClass("flagged");
    $.get("/library/requests",function(data){
        for(var i=0; i<data.length; i++){
            $("#"+data[i]).addClass("flagged");
            $("#"+data[i]).removeClass("hide");
        }
    });
}

$(document).on('ready',function(){
    updateLibrary();
});

$(".delete-book").on('click', function(){
    var delUrl = $(this).siblings("a").first().attr("href").replace("book", "book/delete");
    $.post(delUrl, function(data){
        if(data.hasOwnProperty("error")){
            console.log(data.error);
        }
        location.reload();
    });
});

socket.on("requested", function(bookId){
    updateLibrary();
});