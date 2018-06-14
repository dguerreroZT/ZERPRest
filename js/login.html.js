$(function(){
    
    function iniciarSesion(){
        var usr = $("#txtUsuario").val()
        var pass = $("#txtPass").val()
        
        Restaurant.iniciarSesion(usr,pass)
        .then(function(result){
            console.log(result)
            if(!result.logged){
                swal('No se puede iniciar sesión', result.rejectReason,'error')
                return
            }else{
                window.location.replace('mesas.html')
            }
        })
    }
    
    /*
    setTimeout(function (){
        window.location.replace('login.html')
    }, 3000)

    function set_body_height() { // set body height = window height
        $('body').height($(window).height());
    }
    $(document).ready(function() {
        $(window).bind('resize', set_body_height);
        set_body_height();
    });
    */
    
    $('#txtUsuario').keypress(function(e) {
        var code = e.keyCode || e.which;
        if(code==13){
            iniciarSesion()
        }
    });
    
    $('#txtPass').keypress(function(e) {
        var code = e.keyCode || e.which;
        if(code==13){
            iniciarSesion()
        }
    });
    
    $("#btnIniciarSesion").click(function(){
        iniciarSesion()
    })
    
})