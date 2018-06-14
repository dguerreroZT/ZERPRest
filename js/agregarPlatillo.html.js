$(function(){
    M.AutoInit();
    
    var MovimientoID = urlParams.id
    
    var PlatilloSeleccionado = 0
    var PlatilloAutocompletado = false

    var DependienteSeleccionado = 0
    var DependienteAutocompletado = false

    var CantidadSeleccionada = 1
    
    var idxFilas = 0
    var idxFilasMostradas = 0
    
    
    var guardar = function(){
        if(!PlatilloSeleccionado){
            swal('Error','No ha seleccionado un Platillo válido','error')
            return
        }
        window.location.href = "mesas.html"
    }
    
    function MostrarFila(Platillos){
        if(idxFilas < Platillos.length){
            //$("#loadingBar").css({display:"block"})
            var platillo = Platillos[idxFilas]
            var mostrar = false 
            if(
                (platillo.Descripcion||'').toUpperCase().includes(strBusqueda.toUpperCase()) ||
                (platillo.PlatilloID == strBusqueda)
            ){
                mostrar = true;
            }

            idxFilas++
            
            if(mostrar){
                agregarItem(platillo.Descripcion, platillo.PlatilloID, seleccionarPlatillo)
                //LlantasMostradas.push(llanta)
                idxFilasMostradas++
                /// Cargar las filas en grupos de 20 
                if((idxFilasMostradas % 100) == 0){
                    return false
                }
            }
            return true 
        }else{
            //$("#loadingBar").css({display:"none"})
            return false}
    }
    
    
    function Buscar(str){
        $("#lstFavoritos").hide()
        strBusqueda = str.toUpperCase()
        filasMostradas = []
        idxFilas = 0
        idxFilasMostradas = 0
        
        $("#lstMenu").empty()
        
        Restaurant.obtenerPlatillos()
        .then(function(Platillos){
            var mostrarSiguiente = true
            // Ciclo para ir mostrando de una por una las llantas
            while(mostrarSiguiente){
                mostrarSiguiente = MostrarFila(Platillos)
            }
        })
    }
    
    function cerrarBusqueda(){		
         $("#navBuscar").css({display:"none"})		
         $("#Buscar").val("");
        $("#lstFavoritos").show()
        cargarClasificacionesPlatillos()
     }
    
    function agregarItem(texto, valor, fn){
        var item = $("<a>")
        item.attr("href", "javascript:void(0)")
        item.addClass("collection-item")
        item.html(texto)
        $("#lstMenu").append(item)
        item.click(function(){
            fn(valor)
        })
    }
    
    seleccionarPlatillo = function(PlatilloID){
        window.location.href = "agregarPlatilloComanda.html?id=" + MovimientoID + "&PlatilloID=" + PlatilloID
    }
    
    cargarPlatillosFavoritos = function(){
        $("#lstFavoritos").empty()
        Restaurant.obtenerPlatillosFavoritos() /// Cambiar para produccion
        .then(function (platillos){
            $.get('templates/listItem_platilloFavorito.html', function(original_html){
                for(var p of platillos){
                    var html = original_html
                    for (var property in p){
                        var sVal = new RegExp("{{" + property + "}}", "g")
                        html = html.replace(sVal, p[property]);
                    }

                    $("#lstFavoritos").append(html)
                }
            })
        })
            
    }
    
    function cargarPlatillos(grupo){
        Restaurant.obtenerPlatillos(grupo.GrupoID)
        .then(function(coleccion){
            $("#lstMenu").empty()
            agregarItem("<-...", grupo, cargarGruposPlatillos)
            for(platillo of coleccion){
                agregarItem(platillo.Descripcion, platillo.PlatilloID, seleccionarPlatillo)
            }
        })
    }
    
    function cargarGruposPlatillos(clasif){
        Restaurant.obtenerGruposPlatillos(clasif.ClasificacionID)
        .then(function(coleccion){
            $("#lstMenu").empty()
            agregarItem("<-...", 0, cargarClasificacionesPlatillos)
            for(grupo of coleccion){
                agregarItem("<b>" + grupo.Descripcion + "</b>", grupo, cargarPlatillos)
            }
        })
    }
    
    function cargarClasificacionesPlatillos(){
        Restaurant.obtenerClasificacionesPlatillos()
        .then(function(coleccion){
            $("#lstMenu").empty()
            for(clasif of coleccion){
                agregarItem("<b>" + clasif.Descripcion + "</b>", clasif, cargarGruposPlatillos)
            }
        })
    }
    
        
    actualizarPlatillos = function(){
        Restaurant.descargarPlatillos()
        .then(function(resultado){
            cargarClasificacionesPlatillos()
        })
        .then(function(){
                cargarPlatillosFavoritos()
            
        })
    }
  
    $("#txtPlatillo").change(function(){
        if(PlatilloAutocompletado){
            PlatilloAutocompletado = false
        }
        else{
            PlatilloSeleccionado = 0
            cargarDependientes(PlatilloSeleccionado)
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
    
    $("#btnActualizar").click(function(){
        actualizarPlatillos()
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
    
    actualizarPlatillos();  
    
    
})