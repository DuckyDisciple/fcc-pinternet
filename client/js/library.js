$(".grid").masonry({
    itemSelector: ".grid-item",
    columnWidth: 200
});

$(".remove-pin").on('click',function(){
    var delUrl = "/delete/"+ $(this).attr("id");
    $.post(delUrl,function(){
        location.reload();
    })
})