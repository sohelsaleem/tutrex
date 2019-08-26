$('.navbar-item').hover(
    function(){
        $(this).stop();

        $(this).animate({
            right: '5px'
        })
    },
    function(){
        $(this).stop();

        $(this).animate({
            right: '-5px'
        })
    }
);



