$(function(){
    M.AutoInit();
    
    var MovimientoID = urlParams.id

    function agregarPlatillo(){
        window.location.href = "agregarPlatillo.html?id=" + MovimientoID
    }
    
    function cargarListado(){
        //$("#lstComanda").empty()
        
        Restaurant.obtenerDetalleMesa(MovimientoID) /// Cambiar para produccion
        .then(function (result){
            
            console.log(result)
            if(result.datosMesa){
                var nombreCliente = result.datosMesa.Cliente;
                if(nombreCliente.length > 12){nombreCliente = nombreCliente.substr(0,12) + "..."}
                $("#lblNombre").html(nombreCliente)
                $("#lblMesa").html(result.datosMesa.Mesa)
            }
            if(result.platillosComanda){
                var comanda = result.platillosComanda
                $.get('templates/listItem_comandaPlatillo.html', function(original_html){
                    for(platillo of comanda){
                        var html = original_html
                        for (var property in platillo){
                            var sVal = new RegExp("{{" + property + "}}", "g")
                            html = html.replace(sVal, platillo[property]);
                        }

                        $("#lstComanda").append(html)
                    }
                })
            }
        })
    }
    
    $("#btnAgregarPlatillo").click(function(){
        agregarPlatillo()
    })
    
    cargarListado();  
})