$(function(){
    M.AutoInit();
    
    var ClienteID = urlParams.cte
    
    
    var ClienteSeleccionado = 0
    var ClienteAutocompletado = false

    var DependienteSeleccionado = 0
    var DependienteAutocompletado = false

    var CantidadSeleccionada = 1
    
    var idxFilas = 0
    var idxFilasMostradas = 0
    
    function guardar(){
        var obj = {
            Cliente: ClienteID,
            Personas: CantidadSeleccionada,
            Dependiente: DependienteSeleccionado
        }
        Restaurant.abrirMesa(obj)
        .then(function(MovimientoID){
            //window.location.href = "agregarMesaCliente.html"
            window.location.replace("agregarPlatillo.html?id=" + MovimientoID)
        })
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
    
    
    function cargarDependientes(ClienteID){
        Restaurant.obtenerDependientes(ClienteID)
        .then(function(dependientes){
            console.log(dependientes)
            $.get('templates/card_dependiente.html', function(original_html){
                for(var dp of dependientes){
                    $("#titleDependiente").show()
                    var html = original_html
                    for (var property in dp){
                        var sVal = new RegExp("{{" + property + "}}", "g")
                        html = html.replace(sVal, dp[property]);
                    }

                    $("#lstDependientes").append(html)
                }
            })    
        })
    }
    
    
    function cargarDatos(){
        Restaurant.obtenerCliente(ClienteID)
        .then(function(cte){
            $("#fotoCliente").attr("src", "ObtenerImagen?emp=1&tipo=CL&rid=" + ClienteID)
            $("#txtNombreCliente").html(cte.Nombre)
            cargarDependientes(ClienteID)
        }).catch(function(err){
            console.log(err)
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
    
    $("#btnGuardar").click(function(){
        guardar()
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
    
    
    //actualizarClientes();  
    cargarDatos()
})