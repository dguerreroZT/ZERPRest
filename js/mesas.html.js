$(function(){
    M.AutoInit();
    var ListadoMesas = []
    var campoOrdenar = "ClientesDetalle"
    
    abrirMesa = function(idServicio){
        window.location.href = "mesaComandas.html?id=" + idServicio
    }
    
    function ordenar(){
        swal({
          title: 'Ordenar por',
          input: 'select',
          inputOptions: {
                  'ClientesDetalle': 'Nombre',
                  'IdMesa': 'Mesa'
                },
          inputValidator: function(value){
            return(!value && 'You need to choose something!')
          }
        })
        .then(function(e){
            campoOrdenar = e.value
            mostrarMesas()
        })
    }
    
    function mostrarMesas(){
        $("#main_list").empty()

        ListadoMesas = sortObjectsByString(ListadoMesas, campoOrdenar)
        $.get('templates/listItem_mesa.html', function(original_html){
            for(var mesa of ListadoMesas){
                var html = original_html
                for (var property in mesa){
                    var sVal = new RegExp("{{" + property + "}}", "g")
                    html = html.replace(sVal, mesa[property]);
                }

                $("#main_list").append(html)
            }
        })
        $("#loadingBar").hide()
    }
    
    cargarListado = function(){
        Restaurant.obtenerMesasOcupadas() /// Cambiar para produccion
        .then(function (mesas){
            ListadoMesas = mesas
            for(mesa of ListadoMesas){
                mesa.IdMesa = leadingZeros(mesa.mesa, 3)
            }
            mostrarMesas()
        })
    }
    
    function cerrarSesion(){
        Restaurant.cerrarSesion()
        location.reload()
    }
    
    $("#btnOrdenar").click(function(){
        ordenar()
    })
    
    $("#btnCerrarSesion").click(function(){
        cerrarSesion()
    })
    
   
    cargarListado();  
})