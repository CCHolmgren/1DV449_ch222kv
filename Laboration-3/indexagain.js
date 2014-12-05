var app = require('express')();
var http = require('http').Server(app);
var request = require("request");
var fs = require("fs");
var serveStatic = require("serve-static");
var url = require("url");

/*app.use("/messages",serveStatic("messages", {"setHeaders": 
	function(res, path, stat){
		res.setHeader("Content-Type", "application/json; charset=utf-8");
		res.setHeader("Cache-Control", "public; max-age=100");
	}
}));*/
function reloadFile(){
	request("http://api.sr.se/api/v2/traffic/messages?format=json").pipe(fs.createWriteStream(__dirname + "/messages/messages.json", "utf8"));	
	fs.writeFile(__dirname + "/messages/gottenwhen.txt", Date.now(), function(err){
		if(err) throw err;
		console.log("It's saved", new Date());
	});
}
/// Reload the file every 20 seconds
///Which means that the gottenwhen file will also be incremented
setInterval(function(){
	reloadFile();
}, 20000);

app.get("/messages/:filename", function(req, res){
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "public; max-age=100");
	console.log(__dirname + "/messages/messages.json");
	res.sendfile(__dirname + "/messages/messages.json");
});
app.get('/', function(req, res){
	res.sendfile(__dirname + '/index4.html');
});

app.listen(3000);
console.log("listening on *:3000");