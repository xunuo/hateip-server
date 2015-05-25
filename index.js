var request = require('request');

var runServer = function(args){
    
    var loginToken = args.token,
        port = args.port ? args.port : 999,
        domain = args.domain ? args.domain : 'hateip.com',
        apiUrlPrefix = 'https://api.dnspod.com'
        ;
    
    if(!loginToken){
        console.log('need login token.');
        return false;
    }
    
    var 
        server = require('diet'),
        app = server()
        ;
    
    app.listen('http://' + domain + ':' + port);
    // Listen on GET /
    // example : ?name=snow&ip=127.0.0.1
    app.get('/', function($){
        
        var name = $.query.name,
            ip = $.query.ip
            ;
        
        if(!name || !ip){
            $.end('{ "code" : 500, "msg" : "no name or ip." }');
            return false;
        }
        
        request.post(
            {
                url: apiUrlPrefix + '/Record.List',
                json: true,
                headers: {
                  'User-Agent': 'hateip'
                },
                form:{
                    domain : 'hateip.com',
                    user_token:loginToken,
                    sub_domain : name,
                    format : 'json'
                },
                encoding:'utf8'
            },
            function(error, response, callback){
                
                if(response.statusCode == 200){
                    
                    //console.log(callback);
                    
                    // 没找到记录
                    if(callback.status.code == '10'){
                         console.log('Add A record.');
                         request.post(
                            {
                                url: apiUrlPrefix + '/Record.Create',
                                json: true,
                                headers: {
                                  'User-Agent': 'hateip'
                                },
                                form:{
                                    domain : 'hateip.com',
                                    user_token:loginToken,
                                    sub_domain : name,
                                    value : ip,
                                    ttl : 1,
                                    record_type : 'A',
                                    record_line : 'default',
                                    format : 'json'
                                },
                                encoding:'utf8'
                            },
                            function(error, response, callback){
                                if(response.statusCode == 200){
                                    //console.log(callback);
                                    $.end('{ "code" : 200, "msg" : "create [' + name + '.hateip.com -> ' + ip + '] success." }');
                                }else{
                                    console.log(response.statusCode);
                                    $.end('{ "code" : 500, "msg" : "create [' + name + '.hateip.com -> ' + ip + '] success." }');
                                }
                            }
                         );
                    }else{
                        // 已有重复记录
                        console.log('Modify A record.');

                        var recordId = callback.records[0].id;
    
                         request.post(
                            {
                                url: apiUrlPrefix + '/Record.Modify',
                                json: true,
                                headers: {
                                  'User-Agent': 'hateip'
                                },
                                form:{
                                    domain : 'hateip.com',
                                    user_token: loginToken,
                                    sub_domain : name,
                                    record_id : recordId,
                                    value : ip,
                                    ttl : 1,
                                    record_type : 'A',
                                    record_line : 'default',
                                    format : 'json'
                                },
                                encoding:'utf8'
                            },
                            function(error, response, callback){
                                if(response.statusCode == 200){
                                    //console.log(callback);
                                    $.end('{ "code" : 200, "msg" : "modify [' + name + '.hateip.com -> ' + ip + '] success." }');
                                }else{
                                    console.log(response.statusCode);
                                    $.end('{ "code" : 500, "msg" : "modify [' + name + '.hateip.com -> ' + ip + '] error." }');
                                }
                            }
                         );
    
                    }
    
                }else{
                    console.log(response.statusCode);
                    $.end('{ "code" : 500, "msg" : "search domain list error." }');
                }
            }
        );

    });

};

module.exports = {
    runServer : runServer
};