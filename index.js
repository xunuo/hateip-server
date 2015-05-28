var runServer = function(args){
    
    var token = args.token,
        server = args.server ? args.server : 'dnspod.com',
        domain = args.domain ? args.domain : 'hateip.com',
        port = args.port ? args.port : 999
        ;
    
    if(!token){
        console.log('Need login token.');
        return false;
    }
    
    var 
        ddnspod = require('ddnspod'),
        server = require('diet'),
        app = server()
        ;
    
    app.listen('http://' + domain + ':' + port);
    // Listen on GET /
    // example : ?name=snow&ip=127.0.0.1
    app.get('/', function($){
        
        var subDomain = $.query.name,
            ip = $.query.ip
            ;

        // Params check
        if(!subDomain || !ip){
            $.end(JSON.stringify({ "code" : 500, "msg" : "no name or ip." }));
            return false;
        }
        
        // DDNS
        ddnspod({
            server : server, // which server you are using . dnspod.com (default) | dnspod.cn
            token : token,  // your login token, you can find how to get this at the top.
            domain : domain, // your domain
            subDomain : subDomain, // which subdomain do you want to set. default : @
            ip : ip // specific the IP
        }).then(function(res){
            $.end(JSON.stringify(res));
        },function(error){
            $.end(JSON.stringify(error));
        });

    });

};

module.exports = {
    runServer : runServer
};