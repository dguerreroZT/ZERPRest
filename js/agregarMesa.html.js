$(function(){
    M.AutoInit();
    
    var ClienteSeleccionado = 0
    var ClienteAutocompletado = false

    var DependienteSeleccionado = 0
    var DependienteAutocompletado = false

    var CantidadSeleccionada = 1
    
    var idxFilas = 0
    var idxFilasMostradas = 0
    
    function continuar(){
        if(!ClienteSeleccionado){
            swal('Error','No ha seleccionado un cliente válido','error')
            return
        }
        window.location.replace("agregarMesaCliente.html?cte=" + ClienteSeleccionado)
    }
    
    function seleccionarCliente(ClienteID){
        ClienteSeleccionado = ClienteID
        $(".active").removeClass("active")
        $("#cte" + ClienteID).addClass("active")
        $("#btnContinuar").show()
    }
    
    
     function MostrarFila(Clientes){
        if(idxFilas < Clientes.length){
            //$("#loadingBar").css({display:"block"})
            var cliente = Clientes[idxFilas]
            var mostrar = false 
            if(
                (cliente.Nombre||'').toUpperCase().includes(strBusqueda.toUpperCase()) ||
                (cliente.ClienteID == strBusqueda)
            ){
                mostrar = true;
            }

            idxFilas++
            
            if(mostrar){
                agregarItem(leadingZeros(cliente.ClienteID, 5) + '-' + cliente.Nombre, cliente.ClienteID, seleccionarCliente)
                //LlantasMostradas.push(llanta)
                idxFilasMostradas++
                /// Cargar las filas en grupos de 20 
                if((idxFilasMostradas % 20) == 0){
                    return false
                }
            }
            return true 
        }else{
            $("#loadingBar").css({display:"none"})
            return false}
    }
    
    function MostrarFilas(){
        Restaurant.obtenerClientes()
        .then(function(Clientes){
            var mostrarSiguiente = true
            // Ciclo para ir mostrando de una por una las llantas
            while(mostrarSiguiente){
                mostrarSiguiente = MostrarFila(Clientes)
            }
        })
    }
    
    function Buscar(str){
        $("#lstFavoritos").hide()
        strBusqueda = str.toUpperCase()
        filasMostradas = []
        idxFilas = 0
        idxFilasMostradas = 0
        ClienteSeleccionado = 0
        
        $("#lstClientes").empty()
        
        $("#btnContinuar").hide()
        
        MostrarFilas()
    }
    
    function cerrarBusqueda(){		
         $("#navBuscar").css({display:"none"})		
         $("#Buscar").val("");
         Buscar("")
     }
    
    function agregarItem(texto, valor, fn){
        var item = $("<a>")
        item.attr("id","cte" + valor)
        item.attr("href", "javascript:void(0)")
        item.addClass("collection-item")
        item.html(texto)
        $("#lstClientes").append(item)
        item.click(function(){
            fn(valor)
        })
    }
    
    
    cargarDependientes = function(ClienteID){
        $("#txtDependiente").val("");
        Restaurant.obtenerDependientes(ClienteID)
        .then(function(dependientes){
            var dataAutocomplete = {}
            for(var dep of dependientes){
                var leadingZerosID = leadingZeros(dep.DependienteID, 4)
                dataAutocomplete[leadingZerosID + '-' + dep.Nombre] = null /// valor debe ser la url de la imagen
            }
            $('#txtDependiente').autocomplete({
                data: dataAutocomplete,
                limit:20,
                onAutocomplete: function(value){
                    var DependienteID = value.substr(0,4)
                    DependienteSeleccionado = Number(DependienteID)
                    DependienteAutocompletado = true
                }
            });
            
        })
    }
    
    cargarClientes = function(){
        Restaurant.obtenerClientes()
        .then(function(clientes){
            var dataAutocomplete = {}
            for(var cte of clientes){
                var leadingZerosID = leadingZeros(cte.ClienteID, 4)
                dataAutocomplete[leadingZerosID + '-' + cte.Nombre] = "ObtenerImagen?emp=1&tipo=CL&rid=" + cte.ClienteID /// valor debe ser la url de la imagen
            }
            $('#txtAsociado').autocomplete({
                data: dataAutocomplete,
                onAutocomplete: function(value){
                    var ClienteID = value.substr(0,4)
                    ClienteSeleccionado = Number(ClienteID)
                    ClienteAutocompletado = true
                    cargarDependientes(ClienteID)
                }
            });
        })
    }
    
    actualizarClientes = function(){
        Restaurant.descargarClientesDependientes()
        .then(function(resultado){
            Buscar("")
            //$("#btnBuscar").click()
        })
    }
  
    $("#txtAsociado").change(function(){
        if(ClienteAutocompletado){
            ClienteAutocompletado = false
        }
        else{
            ClienteSeleccionado = 0
            cargarDependientes(ClienteSeleccionado)
        }
    })
    
    $("#txtDependiente").change(function(){
        if(DependienteAutocompletado){
            DependienteAutocompletado = false
        }
        else{
            DependienteSeleccionado = 0
        }
    })
    
    $("#btnAumentarCantidad").click(function(){
        CantidadSeleccionada++;
        $("#txtCantidad").val(CantidadSeleccionada)
    })
    
    $("#btnReducirCantidad").click(function(){
        if(CantidadSeleccionada > 1){
            CantidadSeleccionada--;
            $("#txtCantidad").val(CantidadSeleccionada)
        }
    })
    
    $("#btnContinuar").click(function(){
        continuar()
    })
    
     $("#btnBuscar").click(function(){
        $(window).scrollTop(0)
        $("#navBuscar").css({display:"block"})
        $("#Buscar").focus();
    })
    
    $("#Buscar").focusout(function(){
        var str = $("#Buscar").val()
        if (str == ""){
            cerrarBusqueda()
        }
        //if(fnBuscar){clearTimeout(fnBuscar)}
        //fnBuscar = setTimeout(buscarCompleto,1000)
    })
    
    $("#Buscar").bind("change paste keyup",function(){
        var str = $("#Buscar").val()
        Buscar(str)
        //if(fnBuscar){clearTimeout(fnBuscar)}
        //fnBuscar = setTimeout(buscarCompleto,1000)
    })
    
    $("#cerrarBusqueda").click(function(){
        cerrarBusqueda()
    })
    
    $("#borrarTexto").click(function(){
        $(window).scrollTop(0)
        $("#lstMenu").empty()
        $("#navBuscar").css({display:"block"})
        $("#Buscar").focus();
        $("#Buscar").val("");
    })
    
    $(window).scroll(function() {   
        //if($(window).scrollTop() + $(window).height() >= $(document).height()) {
        if($(window).scrollTop() + $(window).height() >= $("#loadingBar").offset().top) {
            //alert("End Reached")
            MostrarFilas()
        }
    });
    
    
    actualizarClientes();  
})