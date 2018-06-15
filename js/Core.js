Core = new function(){
    
    var urlServer = "https://192.168.1.22:8000/"
    
    this.newId = function(len){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
      return (s4() + s4()).substring(0,len);
    }

    var localStorage_Cache = {}
    
    this.initFn_LS = function(o){
        var key = o.key
        var method = o.method
        var fn = function(){
            localStorage_Cache[key] = localStorage_Cache[key] || method(key) || []
            return localStorage_Cache[key]
        }
        fn.refresh = function(){
            localStorage_Cache[key] = method(key) || []
            return fn
        }
        fn.save = function(v){
            Core.setData(key, v)
            return fn
        }

        return fn
    }
    
    this.isLogged = function(){
        var conf = Core.getData("ZERP_LocalConfig") || {}
        if(conf.usuario){return(true)}
        else{return(false)};
    }
    
    this.timeStamp = function(){
        var d = new Date()
        return d.getTime()
    }
    
    this.getData = function(key){
        var val = localStorage.getItem(key)
        
        if(val == ""){return false}
        return JSON.parse(localStorage.getItem(key))
    }
    
    this.getCollection = function(key){
        var resultData = []
        
        var val = localStorage.getItem(key)
        if(val == ""){console.log('empty data'); return resultData}
        val = JSON.parse(val) /// Convertir String en Objeto
        if(val.idx && val.rows){ /// Validar que el objeto tiene una estructura correcta
            for(var row of val.rows){
                var o = {}
                for(var i in val.idx){
                    o[val.idx[i]] = row[i]
                }
                resultData.push(o)
            }
        }
        return resultData
        
    }
    
    this.setData = function(key, data){
        localStorage.setItem(key, JSON.stringify(data))
    }

    this.request = function(config){
         console.log(config)
        return new Promise(function(fnSolve, fnFail){
            try{
                $.post(urlServer + config.request, config.data)
                .done(function(r){
                    if(r.ok){
                        var datos = r.data
                        fnSolve(datos)
                    }else{
                        fnFail(r)
                    }

                })
                .fail(function(r){
                    console.log(r)
                    fnFail(r)
                })
            }catch(err){
                fnFail(err)
            }
        })
    }
    
    $(function(){
       if(window.location.href == (window.location.origin + '/')){return}
       if(window.location.href.toLowerCase().includes('index.html')){return}
       if(window.location.href.toLowerCase().includes('login.html')){return}
        
        var fn = function(){
            if(!Core.isLogged()){
                window.location.replace("login.html")
            }    
        }
        //setInterval(fn, 10000) // 10 Segundos
        fn()
    })
}

