$(function(){
    if($(window).width() > $(window).height()){
           $("#imgSplash").attr("src","img/splash_horiz.jpg")
    }
    
    setTimeout(function (){
        if(Core.isLogged()){
            window.location.replace('mesas.html')
        }else{
            window.location.replace('login.html')
        }
    }, 1500)

    function set_body_height() { // set body height = window height
        $('body').height($(window).height());
    }
    $(document).ready(function() {
        $(window).bind('resize', set_body_height);
        set_body_height();
    });
    
})