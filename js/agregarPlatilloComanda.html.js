$(function(){
    M.AutoInit();
    $("#imgCover").attr("src", "img/backgrounds/orange/" + (Math.floor(Math.random()  * 15) + 1) + ".png")
    
    var PlatilloID = urlParams.PlatilloID
    var MovimientoID = urlParams.id
    var PrecioUnitario = 0
    var Modificadores = []
    var platillosCantidad = {}
    var favorito = false
    
    var platilloSeleccionado = 1
    
    var CantidadSeleccionada = 1
    
    function isChecked(elementId){
        return ($("#" + elementId + ":checked").length > 0)
    }
    
    function llenarModificadores(){
        $(".modif").attr("active", "")
        var platilloActual = platillosCantidad[platilloSeleccionado] || {}
        for(var modif of Modificadores){
            if(platilloActual[modif.ModificadorID]){
                $("#chk" + modif.ModificadorID).prop("checked", true)
            }else{
                $("#chk" + modif.ModificadorID).prop("checked", false)
            }
        }
    }
    
    function autoguardarModificadores(e){
        var platilloActual = platillosCantidad[platilloSeleccionado] || {}
        for(var modif of Modificadores){
            platilloActual[modif.ModificadorID] = isChecked("chk" + modif.ModificadorID)
        }
        platillosCantidad[platilloSeleccionado] = platilloActual
    }
    
    
    seleccionarPlatillo = function(i){
        $(".lst").removeClass("active")
        $("#lstItem" + i).addClass("active")
        platilloSeleccionado = i
        llenarModificadores()
    }
    
    function despliegaDatos(){
        Restaurant.obtenerPlatillo(PlatilloID)
        .then(function(platillo){
            $("#txtDescripcion").html(platillo.Descripcion)
            mostrarModificadores()
            mostrarFavorito()
        })
        .then(function(){
            return Restaurant.obtenerPrecioPlatillo(PlatilloID)
        })
        .then(function(datosPrecio){
            PrecioUnitario = datosPrecio.Precio;
            mostrarTotal()
        })
        
    }

    
    function mostrarFavorito(){
        favorito = Restaurant.esPlatilloFavorito(PlatilloID)
        if(favorito){
            $("#iconFavorito").html("star")
        }else{
            $("#iconFavorito").html("star_border")
        }
    }
    
    function mostrarModificadores(){
        $("#pnlModificadores").empty()
        Restaurant.obtenerModificadores(PlatilloID)
        .then(function(modificadores){
            $.get('templates/chk_modificador.html', function(original_html){
                Modificadores = modificadores
                for(var modificador of modificadores){
                    var html = original_html
                    for (var property in modificador){
                        var sVal = new RegExp("{{" + property + "}}", "g")
                        html = html.replace(sVal, modificador[property]);
                    }

                    $("#pnlModificadores").append(html)
                }
            })
        })
        .then(function(){
            setTimeout(function(){
                $(".modif").click(autoguardarModificadores)
            }, 100)
        })
    }
    
    function mostrarBotonesCantidad(){
        for(var i=1; i<=5; i++){
            if(i <= CantidadSeleccionada){
                $("#lstItem" + i).show()
            }else{
                $("#lstItem" + i).hide()
            }
        }
    }
    
    function mostrarTotal(){
        $("#clcTotal").html(PrecioUnitario * CantidadSeleccionada)
    }
    
    function insertarPlatillo(){
    //    swal({
    //      title: 'Guardando',
    //      html: 'Agregando el platillo al pedido.',
    //      //timer: 2000,
    //      onOpen: function(){
    //        swal.showLoading()
             $("#btnGuardar").hide()
             $("#barLoading").show()

              var obj = {
                    MovimientoID: MovimientoID,
                    PlatilloID: PlatilloID,
                    Cantidad: CantidadSeleccionada,
                    Total: (PrecioUnitario * CantidadSeleccionada),
                    PrecioUnitario: PrecioUnitario,
                    PrecioModificadores: 0
                }
                Restaurant.insertarPlatilloComanda(obj)
                .then(function(valorPartida){
                    if(valorPartida > 0){
                        swal({
                            title:'Platillo agregado al pedido!',
                            //html:'Platillo agregado al pedido',
                            type:'success',
                            showConfirmButton: false,
                            timer: 1500
                            
                        })
                        .then(function(){
                            window.history.go(-1);
                        })
                    }else{
                        swal({
                            title:'Ocurrió un error al agregar el platillo',
                            //html:'Platillo agregado al pedido',
                            type:'error',
                            showConfirmButton: false,
                            timer: 1500
                            
                        })
                        .then(function(){
                            $("#btnGuardar").show()
                            $("#barLoading").hide()
                        })
                    }
                })
    //          
    //      }
    //    })
        
        
        /*
        var obj = {
            MovimientoID: MovimientoID,
            PlatilloID: PlatilloID,
            Cantidad: CantidadSeleccionada,
            Total: (PrecioUnitario * CantidadSeleccionada),
            PrecioUnitario: PrecioUnitario,
            PrecioModificadores: 0
        }
        Restaurant.insertarPlatilloComanda(obj)
        .then(function(valorPartida){
            if(valorPartida){
                
            }
        })*/
    }
    
    
    $("#btnAumentarCantidad").click(function(){
        if(CantidadSeleccionada < 5){
            CantidadSeleccionada++;
            mostrarBotonesCantidad()
            mostrarTotal()
        }
    })
    
    $("#btnReducirCantidad").click(function(){
        if(CantidadSeleccionada > 1){
            CantidadSeleccionada--;
            mostrarBotonesCantidad()
            mostrarTotal()
            if (platilloSeleccionado > CantidadSeleccionada){
                seleccionarPlatillo(CantidadSeleccionada)
            }
        }
    })
    
    $("#btnFavorito").click(function(){
        favorito = !favorito
        if(favorito){
            Restaurant.agregarPlatilloFavorito(PlatilloID)
        }else{
            Restaurant.quitarPlatilloFavorito(PlatilloID)
        }
        mostrarFavorito()
    })
    
    $("#btnGuardar").click(function(){
        insertarPlatillo()
    })
    
    despliegaDatos()
    
})