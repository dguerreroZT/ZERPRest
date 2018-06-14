Restaurant = new function(){
    var sample_data = {
        mesas:[
            {MesaID: 2, ClienteID: 4, NombreCliente: 'Pablo Ortega', DependienteID: 1, NombreDependiente: 'Hector Ramirez'},
            {MesaID: 3, ClienteID: 7, NombreCliente: 'Carlos Alfredo', DependienteID: 3, NombreDependiente: 'Agustín Rogelio'},
            {MesaID: 4, ClienteID: 12, NombreCliente: 'Marcos Gonzalez', DependienteID: 1, NombreDependiente: 'Luis Rodriguez'},
            {MesaID: 5, ClienteID: 31, NombreCliente: 'Raul Rodríguez', DependienteID: 4, NombreDependiente: 'Pedro Dominguez'},
            {MesaID: 6, ClienteID: 5, NombreCliente: 'Veronica Dimas', DependienteID: 1, NombreDependiente: 'Victor Robles'},
            {MesaID: 7, ClienteID: 14, NombreCliente: 'Ingrid Sanchez', DependienteID: 3, NombreDependiente: 'Arturo Lopez'},
            {MesaID: 8, ClienteID: 36, NombreCliente: 'Rafael Mendoza', DependienteID: 1, NombreDependiente: 'Alberto Reyes'},
            {MesaID: 9, ClienteID: 28, NombreCliente: 'Sandra Juárez', DependienteID: 4, NombreDependiente: 'Jesús Meza'}
        ],
        clientes:[
            {ClienteID: 1, Nombre: "Dan Guerrero"},
            {ClienteID: 2, Nombre: "Arturo Hernández"},
            {ClienteID: 3, Nombre: "Diana Ramírez"},
            {ClienteID: 4, Nombre: "Omar Estrada"},
            {ClienteID: 5, Nombre: "Rodolfo Ramírez"},
        ],
        dependientes:[
            {ClienteID: 1, DependienteID: 1, Nombre: "Susana Juarez"},
            {ClienteID: 1, DependienteID: 2, Nombre: "Laura Lee"},
            {ClienteID: 1, DependienteID: 3, Nombre: "Anthony Bryan"},
            {ClienteID: 2, DependienteID: 1, Nombre: "Juan Felipe"},
            {ClienteID: 2, DependienteID: 2, Nombre: "Maria Elena"}
        ],
        platillos: [
            {PlatilloID: 1, Nombre: "Papas Fritas"},
            {PlatilloID: 2, Nombre: "Hamburguesa"},
            {PlatilloID: 3, Nombre: "Tacos"}
        ]
    }

    //// Private Methods
    
    var ZERP_Restaurant = {
        LocalConfig: Core.initFn_LS({key:"ZERP_LocalConfig", method:Core.getData}),
        ClasificacionPlatillos: Core.initFn_LS({key:"ZERP_Restaurant_ClasificacionPlatillos", method:Core.getCollection}),
        GruposPlatillos: Core.initFn_LS({key:"ZERP_Restaurant_GruposPlatillos", method:Core.getCollection}),
        Platillos: Core.initFn_LS({key:"ZERP_Restaurant_Platillos", method:Core.getCollection}),
        PlatillosModificadores: Core.initFn_LS({key:"ZERP_Restaurant_PlatillosModificadores", method:Core.getCollection}),
        PlatillosPrecios: Core.initFn_LS({key:"ZERP_Restaurant_PlatillosPrecios", method:Core.getCollection}),
        PlatillosFavoritos: Core.initFn_LS({key:"ZERP_Restaurant_PlatillosFavoritos", method:Core.getData}),
        Clientes: Core.initFn_LS({key:"ZERP_Restaurant_Clientes", method:Core.getCollection}),
        ClientesDependientes: Core.initFn_LS({key:"ZERP_Restaurant_ClientesDependientes", method:Core.getCollection})
    }

    
    
    //this.obtenerMesasOcupadas = function(){
    //    return new Promise(function(fnSolve, fnErr){
    //        fnSolve(sample_data.mesas);
    //    })
    //}
    
    this.obtenerClientes = function(){
        return new Promise(function(fnSolve, fnErr){
            var Clientes = ZERP_Restaurant.Clientes()
            fnSolve(Clientes);
        })
    }
    
    this.obtenerCliente = function(ClienteID){
        return new Promise(function(fnSolve, fnErr){
            var Clientes = ZERP_Restaurant.Clientes()
            var Cliente = Clientes.find(function(cl){return(cl.ClienteID == ClienteID)})
            fnSolve(Cliente);
        })
    }
    
    this.obtenerDependientes = function(ClienteID){
        return new Promise(function(fnSolve, fnErr){
            var Dependientes = ZERP_Restaurant.ClientesDependientes()
            var dependientes = []
            for(d of Dependientes){
                if(d.ClienteID == ClienteID){
                    dependientes.push(d)
                }
            }
            fnSolve(dependientes);
        })
    }
    
    this.obtenerClasificacionesPlatillos = function(){
        return new Promise(function(fnSolve, fnErr){
            var ClasificacionPlatillos = ZERP_Restaurant.ClasificacionPlatillos()
            fnSolve(ClasificacionPlatillos);
        })
    }
    
    this.obtenerClasificacionPlatillo = function(ClasificacionID){
        return new Promise(function(fnSolve, fnErr){
            var resultData = ZERP_Restaurant.ClasificacionPlatillos()
            
            for(var clasif of resultData){
                if(clasif.ClasificacionID == ClasificacionID){
                    fnSolve(clasif)
                    return
                }
            }
            
            fnErr("No se encontró la clasificación en el catálogo");
        })
    }
    
    this.obtenerGruposPlatillos = function(Clasificacion){
        return new Promise(function(fnSolve, fnErr){
            var resultData = ZERP_Restaurant.GruposPlatillos()
            var GruposPlatillos = []
            for(var grupo of resultData){
                if(grupo.ClasificacionID == Clasificacion){
                    GruposPlatillos.push(grupo)
                }
            }
            fnSolve(GruposPlatillos);
        })
    }
    
    this.obtenerGrupoPlatillo = function(GrupoID){
        return new Promise(function(fnSolve, fnErr){
            var resultData = ZERP_Restaurant.GruposPlatillos()
            //var GruposPlatillos = []
            for(var grupo of resultData){
                if(grupo.GrupoID == GrupoID){
                    fnSolve(grupo)
                    return
                }
            }
            fnErr("No se encontró el grupo en el catálogo");
        })
    }
    
    this.obtenerPlatillos = function(Grupo){
        return new Promise(function(fnSolve, fnErr){
            var resultData = ZERP_Restaurant.Platillos()
            var Platillos = []
            
            if(!Grupo){Platillos = resultData}
            else{
                for(var platillo of resultData){
                    if(platillo.GrupoID == Grupo){
                        Platillos.push(platillo)
                    }
                }
            }
            fnSolve(Platillos);
        })
    }
    
    this.obtenerPlatillo = function(PlatilloID){
        return new Promise(function(fnSolve, fnErr){
            var resultData = ZERP_Restaurant.Platillos()
            //var Platillo = {}
            
                for(var platillo of resultData){
                    if(platillo.PlatilloID == PlatilloID){
                        fnSolve(platillo)
                        return;
                    }
                }
            
            fnErr("No se encontró el platillo en el catálogo");
        })
    }
    
    this.agregarPlatilloFavorito = function(PlatilloID){
        var favoritos = ZERP_Restaurant.PlatillosFavoritos()
        for(f of favoritos){
            if(f == PlatilloID){
                return 
            }
        }
        favoritos.push(PlatilloID)
        ZERP_Restaurant.PlatillosFavoritos.save(favoritos)
    }
    
    this.quitarPlatilloFavorito = function(PlatilloID){
        var favoritosActuales = ZERP_Restaurant.PlatillosFavoritos()
        var favoritos = []
        for(f of favoritosActuales){
            if(f != PlatilloID){
                favoritos.push(f)
            }
        }
        
        ZERP_Restaurant.PlatillosFavoritos.save(favoritos)
        ZERP_Restaurant.PlatillosFavoritos.refresh()
    }
    
    this.esPlatilloFavorito = function(PlatilloID){
        var favoritos = ZERP_Restaurant.PlatillosFavoritos()
        for(f of favoritos){
            if(f == PlatilloID){
                return true
            }
        }
        return false
    }
    
    this.obtenerPlatillosFavoritos = function(){
        return new Promise(function(fnSolve, fnErr){
            var Favoritos = ZERP_Restaurant.PlatillosFavoritos()
            var Platillos = ZERP_Restaurant.Platillos()
            var Grupos = ZERP_Restaurant.GruposPlatillos()
            var Clasificaciones = ZERP_Restaurant.ClasificacionPlatillos()
            
            var PlatillosFavoritos = Favoritos.map(function(f){
                var platillo = Platillos.find(function(p){return(p.PlatilloID == f)})
                platillo.grupo = Grupos.find(function(g){return(g.GrupoID == platillo.GrupoID)})
                if(platillo.grupo){
                    platillo.Grupo = platillo.grupo.Descripcion
                    platillo.clasificacion = Clasificaciones.find(function(cl){return(cl.ClasificacionID == platillo.grupo.ClasificacionID)})
                }
                if(platillo.clasificacion){
                    platillo.Clasificacion = platillo.clasificacion.Descripcion
                }
                return platillo
            })
            
            //console.log()
            
            fnSolve(PlatillosFavoritos)
        })
    }
    
    this.obtenerModificadores = function(Platillo){
        return new Promise(function(fnSolve, fnErr){
            var resultData = ZERP_Restaurant.PlatillosModificadores()
            var Modificadores = []

            for(var modificador of resultData){
               if(modificador.PlatilloID == Platillo){
                   Modificadores.push(modificador)
               }
            }

            fnSolve(Modificadores);
        })
    }
    
    
    // funcion para descargar el catalogo de platillos y guardar la informacion localmente
    this.descargarPlatillos = function(){
        return Core.request({
            request: 'PlatillosPkg',
            data:{
                EmpresaID: 1
            }
        })
        .then(function(catalog){
            var resultado = {}
            
            if(catalog.ClasificacionPlatillos){
                ZERP_Restaurant.ClasificacionPlatillos.save(catalog.ClasificacionPlatillos)
                resultado.ClasificacionPlatillos = true
            }
            if(catalog.GruposPlatillos){
                ZERP_Restaurant.GruposPlatillos.save(catalog.GruposPlatillos)
                resultado.GruposPlatillos = true
            }
            if(catalog.Platillos){
                ZERP_Restaurant.Platillos.save(catalog.Platillos)
                resultado.Platillos = true
            }
            if(catalog.PlatillosPrecios){
                ZERP_Restaurant.PlatillosPrecios.save(catalog.PlatillosPrecios)
                resultado.PlatillosPrecios = true
            }
            
            if(catalog.PlatillosModificadores){
                ZERP_Restaurant.PlatillosModificadores.save(catalog.PlatillosModificadores)
                resultado.PlatillosPrecios = true
            }
            
            return resultado
        })
        .catch(function(err){
            console.log(err)
            return false  
        })
    }
    
    this.descargarClientesDependientes = function(){
        var config = ZERP_Restaurant.LocalConfig()
        return Core.request({
            request: 'ClientesPkg',
            data:{
                EmpresaID: config.empresa
            }
        })
        .then(function(catalog){
            var resultado = {}
            
            if(catalog.Clientes){
                ZERP_Restaurant.Clientes.save(catalog.Clientes)
                resultado.Clientes = true
            }
            if(catalog.ClientesDependientes){
                ZERP_Restaurant.ClientesDependientes.save(catalog.ClientesDependientes)
                resultado.ClientesDependientes = true
            }
            
            return resultado
        })
        .catch(function(err){
            console.log(err)
            return false  
        })
    }
    
    
    this.obtenerMesasOcupadas = function(){
        var config = ZERP_Restaurant.LocalConfig()
        
        return Core.request({
            request: 'MesasAbiertas',
            data:{
                EmpresaID: config.empresa,
                AlmacenID: config.almacen,
                CentroConsumo: config.centroConsumo
            }
        })
    }
    
    this.obtenerDetalleMesa = function(MovimientoID){
        var config = ZERP_Restaurant.LocalConfig()
        return Core.request({
            request: 'DetalleMesa',
            data:{
                EmpresaID: config.empresa,
                AlmacenID: config.almacen,
                MovimientoID: MovimientoID
            }
        })
    }
    
    this.obtenerPrecioPlatillo = function(PlatilloID){
        var config = ZERP_Restaurant.LocalConfig()
        return Core.request({
            request: 'PrecioPlatillo',
            data:{
                EmpresaID: config.empresa,
                PlatilloID: PlatilloID
            }
        })
    }
    
    this.insertarPlatilloComanda = function(obj){
        var config = ZERP_Restaurant.LocalConfig()
        return Core.request({
            request: 'InsertarPlatilloComanda',
            data:{
                EmpresaID: config.empresa,
                AlmacenID: config.almacen,
                MovimientoID: obj.MovimientoID,
                Caja: config.caja, 
                Platillo: obj.PlatilloID,
                Cantidad: obj.Cantidad,
                Precio: obj.Total,
                PrecioUnitario: obj.PrecioUnitario,
                PrecioModificadores: obj.PrecioModificadores,
                Usuario: config.usuario,
                Host: 'Aqui'
            }
        }).then(function(result){
            return result.returnValue || 0
        }).catch(function(err){
            console.log(err)
            return 0
        })
    }
    
    this.abrirMesa = function(obj){
        var config = ZERP_Restaurant.LocalConfig()
        return Core.request({
            request: 'AbrirMesa',
            data:{
                EmpresaID: config.empresa,
                AlmacenID: config.almacen,
                CentroConsumo: config.centroConsumo,
                Caja: config.caja, 
                Cliente: obj.Cliente,
                Personas: obj.Personas,
                Dependiente: obj.Dependiente,
                Usuario: config.usuario,
                Host: 'Aqui'
            }
        }).then(function(result){
            return result.returnValue || 0
        }).catch(function(err){
            console.log(err)
            return 0
        })
    }
    
    this.iniciarSesion = function(usr, pass){
        console.log(usr)
        console.log(pass)
        return Core.request({
            request: 'ValidarUsuarioZERP',
            data:{
                Usuario: usr,
                Pass: pass
            }
        }).then(function(result){
            console.log(result)
            if(result.logged){
                ZERP_Restaurant.LocalConfig.save({
                    usuario: usr,
                    sesionId: "abc-123",
                    empresa: 1,
                    almacen: "41",
                    centroConsumo: 1,
                    caja: 2
                })                
            }
            return result
        }).catch(function(err){
            console.log(err)
            return false
        })
    }
    
    this.cerrarSesion = function(){
        ZERP_Restaurant.LocalConfig.save("")
    }
        
}

