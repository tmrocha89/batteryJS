'use strict';

var http = require('http');
const notifier = require('node-notifier');

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


// Object
notifier.notify({
  'title': 'BatteryJS',
  'message': 'Starting...'
});

var chargingState = null;
var batteryState = null;

var batteryMessage = '';
var notifiedLevel = null;

(function magic(){
	http.get(options, function(res) {
		var bodyChunks = [];
		res.on('data', function(chunk) {
			bodyChunks.push(chunk);
		}).on('end', function() {
			var body = Buffer.concat(bodyChunks);
			var batteryObj = JSON.parse(body);
			
			if(!chargingState){
				chargingState = batteryObj.battery_charging;
				console.log("ChargingState: "+chargingState);
			}

			if(chargingState != batteryObj.battery_charging) {
				notifier.notify({
					'title': 'BatteryJS',
					'message': 'Battery is no long charging'
				});
				console.log("Router esta a carregar " + batteryObj.battery_charging);
							
			}

			if(!batteryState) {
				batteryState = parseInt(batteryObj.battery_pers);
			}

			if(chargingState != 1) {
				switch(batteryState){
					case 0: batteryMessage = 'Battery is dying'; break;
					case 1: batteryMessage = 'Battery almost dead'; break;
					case 2: batteryMessage = 'Alf way'; break;
					case 3: batteryMessage = 'Without full charge'; break;
					case 4: batteryMessage = 'Full charged'; break;
				}
			}

			if(!notifiedLevel || notifiedLevel!=batteryState) {
				notifiedLevel = batteryState;
				notifier.notify({
					'title': 'BatteryJS',
					'message': batteryMessage
				});
			}

		});
}).on('error',function(err){
	console.log(err);
});
		setTimeout(magic, batteryState*1000);
})();
