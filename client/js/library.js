$(document).on('load',function(){
    $(".grid").masonry({
        itemSelector: ".grid-item",
        columnWidth: ".grid-sizer",
        percentPosition: true
    });
});

$(".remove-pin").on('click',function(){
    var delUrl = "/delete/"+ $(this).attr("id");
    $.post(delUrl,function(){
        location.reload();
    });
});

$("img").on('error',function(){
    $(this).unbind("error").attr("src","/client/img/DeadLink.png");
});