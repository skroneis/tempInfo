//custom libraries
var http = require("./website");

//npm libraries
var schedule = require('node-schedule');

// =============================
// global variables ============
// =============================
var actuals = {
    temp: 0
};

// =============================
// get netatmo data ============
// =============================
schedule.scheduleJob('*/5 * * * * *', function () {
	console.log('every 5 seconds...');
	//get Temperature
    getTemperatureMeasurement();
});

//update angular values...
http.update(actuals);


//get measurement from module
var getTemperatureMeasurement = function () {
    //TODO - get Temperature
    actuals.temp = 1.5;
};