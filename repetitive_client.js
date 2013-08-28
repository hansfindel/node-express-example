//repetitive_client


//client.js

//variables
var memory = {};

var red, blue, reset;
red   = '\u001b[31m';
blue  = '\u001b[34m';
reset = '\u001b[0m';
green   = '\u001b[33m';


function invoke_array(array){
	var data 	 = array;
	var link 	 = data[0], 
		callback = data[1]; 
	return invoke(link, callback);
}
function invoke(options, callback){
	console.time('invoke');
	console.log(reset,'Request:', blue, options.method, options.schema, options.host, options.port,options.path,reset);	
	var https = require(options.schema);
	console.log("params:", green, options.data, reset);
	if(options.method == 'post' || options.method == 'put'){
		options['headers']['Content-Length'] = JSON.stringify(options.data).length; 		
	}

	var req = https.request( options, response(callback) );
	
	if(options.method == 'post' || options.method == 'put'){
		console.log('Sending data',options.data);		
		req.write(JSON.stringify(options.data));
	}
	
	req.end();
	console.log('request finished');

	req.on('error', function(e) {
	  console.log(e);
	});
	console.timeEnd('invoke');
	req.on("done", function(){
		console.log("request done"); return true;
	})
}
function response(callback){
	return function (res) {
	    console.log('on response');
		console.log(red, res.statusCode, reset);
		
		callback();
		
		res.body = '';
	    res.setEncoding('utf8');
	    res.on('data', function(chunk) {
	      res.body += chunk;
	    });
	    
		res.on('end', function() {
			console.log("end");
		});
		true;
	}
}


//invokes parallel split on 
var compositeService = {
	    'schema': 'http',
	    'host': 'localhost', // localhost || 0.0.0.0
	    'port':'3000',
	    'path':'/json_callback', 
	    'method':'get',
	    'headers':{},
	    'data':{}
	};
var callback = function(message){
	return function(){
		console.log(message);
		var count = memory["count"]
		if(count){
			memory["count"] = count = count + 1;		
			console.log("inside invoke")
		}else{
			memory["count"] = 1;
			count = 1;
		}
		console.log(red, "count=", count, reset)
		if(count < 5){
			compositeService.data = memory;
			//notar la llamada recursiva a callback(message)
			invoke(compositeService, callback(message))	
		}
		console.log(blue, "memory", reset, "=", red, memory, reset);
	}
}


//main 
console.log("repetitive_1");
first  = callback("El primero")
second = callback("El segundo")
third  = callback("El tercero")
invoke( compositeService, first);
invoke( compositeService, second);
invoke( compositeService, third);
console.log("2")

/*
por si quieres probar sin la función creadora de funciones
function normal_request(){
		var count = memory["count"]
		if(count){
			memory["count"] = count = count + 1;		
			console.log("inside invoke")
			console.log("count", count)
		}else{
			memory["count"] = 1;
			count = 1;
		}
		if(count < 5){
			compositeService.data = memory;
			// notar que el callback en este caso es el mismo nombre del método
			invoke(compositeService, normal_request)	
		}
		console.log(blue, "memory", reset, "=", red, memory, reset);
	}
invoke(compositeService, normal_request)
*/