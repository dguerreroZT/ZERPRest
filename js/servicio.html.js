$(function(){
    M.AutoInit();

    //localizeDatePickers("dteFecha")
    
    obtenerServicio = function(ServicioID){
        for(itemData of sample_data){
            if(itemData.idServicio == ServicioID){
                return itemData
            }
        }        
        //Si no encuentra el servicio redirecciona a la pagina de listado
        window.location.replace('listado.html')
    }
    
    cargarDatos = function(){
        var ServicioID = urlParams.id || 0
        itemData = obtenerServicio(ServicioID)
        var html = $("#content").html()
        
        for (var property in itemData){
            var sVal = new RegExp("{{" + property + "}}", "g")
            html = html.replace(sVal, itemData[property]);
        }
        
        $("#content").html(html)
        
        
        
    }
    
    cargarDatos();  
})