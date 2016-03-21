'use strict';

var http = require('http');

var options = {
  host : '192.168.1.1',
  path: '/goform/goform_get_cmd_process?multi_data=1&isTest=false&cmd=battery_pers,battery_charging&_=1458588878551',
  headers: {
	'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:44.0) Gecko/20100101 Firefox/44.0',
	'Accept': 'application/json, text/javascript, */*; q=0.01',
	'Accept-Language': 'en-US,en;q=0.5',
	'Accept-Encoding': 'gzip, deflate',
	'X-Requested-With': 'XMLHttpRequest',
	'Referer': 'http://192.168.1.1/index.html',
	}
};


(function magic(){
	http.get(options, function(res) {
		var bodyChunks = [];
		res.on('data', function(chunk) {
			bodyChunks.push(chunk);
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var batteryObj = JSON.parse(body);
			
			if(batteryObj.battery_charging != 1){
				console.log("Router esta a carregar " + batteryObj.battery_charging);
			
			//console.log("Carga do router: " + batteryObj.battery_pers);
				switch(parseInt(batteryObj.battery_pers)){
					case 0: console.log("Battery is dying"); break;
					case 1: console.log("Battery almost dead"); break;
					case 2: console.log("Alf way"); break;
					case 3:
					case 4: console.log("Good to go"); break;
				}
			}
		});
}).on('error',function(err){
	console.log(err);
});
		setTimeout(magic, 3000);
})();
