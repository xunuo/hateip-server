# HateIP Server

A tool for who hate enter ip everytime - server.

## Install

```
npm install hateip-server -g
```

or

```
npm install hateip-server
```

## Usage

- with bin  
  
```
hateip-server -t "xxxxx,xxxxxxxxxx" -p "9999" -d "hateip.com"  
```

or  


```
./bin/server -t "xxxxx,xxxxxxxxxx" -p "9999" -d "hateip.com"  
```

- with api

```
var hateipServer = require('hateip-server');
hateipServer.runServer({
    server : 'dnspod.com',
    token : 'xxxxx,xxxxxxxxxx',
    domain : 'hateip.com',
    port : '9999'
});
```

## URL Example

> http://hateip.com:999/?name=starcraft&ip=127.0.0.1 
