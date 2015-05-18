// Create an app
var request = require('request')
    ;


var runServer = function(args){
    
    var loginToken = args.token,
        port = args.port ? args.port : 999,
        domain = args.domain ? args.domain : 'hateip.com'
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
    // example : ?user=snow&ip=127.0.0.1
    app.get('/', function($){
        
        var user = $.query.user,
            ip = $.query.ip
            ;
        
        if(!user || !ip){
            $.end('{ "code" : 500, "msg" : "no user or ip." }');
            return false;
        }
        
        request.post(
            {
                url:'https://dnsapi.cn/Record.List',
                form:{
                    domain : 'hateip.com',
                    login_token:loginToken,
                    sub_domain : user,
                    format : 'json'
                },
                encoding:'utf8'
            },
            function(error, response, body){
                if(response.statusCode == 200){
                    
                    
                    var callback = JSON.parse(body);
    
                    // 没找到记录
                    if(callback.status.code == '10'){
                         console.log('新增A记录');
                         request.post(
                            {
                                url:'https://dnsapi.cn/Record.Create',
                                form:{
                                    domain : 'hateip.com',
                                    login_token:loginToken,
                                    sub_domain : user,
                                    value : ip,
                                    record_type : 'A',
                                    record_line : '默认',
                                    format : 'json'
                                },
                                encoding:'utf8'
                            },
                            function(error, response, body){
                                if(response.statusCode == 200){
                                    console.log(body);
                                    $.end('{ "code" : 200, "msg" : "create [' + user + '.hateip.com -> ' + ip + '] success." }');
                                }else{
                                    console.log(response.statusCode);
                                    $.end('{ "code" : 500, "msg" : "create [' + user + '.hateip.com -> ' + ip + '] success." }');
                                }
                            }
                         );
                    }else{
                        // 已有重复记录
                        console.log('已有重复记录,修改记录');
                        var recordId = callback.records[0].id;
    
                         request.post(
                            {
                                url:'https://dnsapi.cn/Record.Modify',
                                form:{
                                    domain : 'hateip.com',
                                    login_token:loginToken,
                                    sub_domain : user,
                                    record_id : recordId,
                                    value : ip,
                                    record_type : 'A',
                                    record_line : '默认',
                                    format : 'json'
                                },
                                encoding:'utf8'
                            },
                            function(error, response, body){
                                if(response.statusCode == 200){
                                    console.log(body);
                                    $.end('{ "code" : 200, "msg" : "modify [' + user + '.hateip.com -> ' + ip + '] success." }');
                                }else{
                                    console.log(response.statusCode);
                                    $.end('{ "code" : 500, "msg" : "modify [' + user + '.hateip.com -> ' + ip + '] error." }');
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