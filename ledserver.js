/*
	PART 1: HTTP
        extended with Jade
*/
var http = require("http"),
	PORT = 1337,
	HOST = process.env.HOST || "127.0.0.1";
var jade = require('jade');
var fs = require("fs"),
    url = require("url"),
    mime = require("mime");

http.createServer(requestListener).listen(PORT,HOST,function(){
        console.log("LED-SERVER RUNNING ON http://" + HOST + ":" + PORT);
});
function requestListener(request, response){
	/*
    	get an array with the information about the request
    	EXAMPLE:
    		making a request to the endpoint /led/13/on
    		would result in info containing the following information
    		["led", "13", "on"]
    */
	var info = request.url.slice(1).split("/");
	/*test if the request if valid*/
	if( info[0] === "led" && info[1] > 0 && info[1] <= 13 && (info[2]=="on"||info[2]=="off")){
		var led = parseInt(info[1]);
		var state = info[2] == "on" ? true : false;
                response.writeHead(200, {"Content-Type":"text/html"});
                jade.renderFile(__dirname + "/ui.jade", {led:led,state:state}, function(err,html){
                    response.end(html);
                });
		//response.end("turning led " + led + " " + (state ? "on" : "off"));
                //
		/*
			change the led state on the arduino
		*/
		toggleLed(led,state);
	}else{
                var fileName = "/" + url.parse( request.url ).pathname;
                fs.readFile(__dirname + fileName, function(err,data){
                    if(err){
                        response.writeHead(404);
                        response.end("invalid request");
                    }else{
                        var mimeType = mime.lookup( __dirname + fileName );
                        response.writeHead(200,{"Content-Type":mimeType});
                        response.end(data);
                    }
                });
	}
}


/*
	PART 2: JOHNNY-FIVE
*/
var j5 = require("johnny-five"),
	board = new j5.Board(),
	boardReady = false;
board.on("ready",function(){
	boardReady = true;
});
function toggleLed(led,on){
	if(boardReady){
		console.log( "changing led state", led, on );
		var led = new j5.Led(led);
		if(on){led.on()}else{led.off()}
	}
}
