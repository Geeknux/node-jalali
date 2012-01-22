var jDateTime = require('../index.js').init(true, 'Asia/Tehran');

//we just pass datestring and DateTime format like PHP
console.log('Gregorian To Jalali:' + jDateTime.getJalali('Y-m-d H:i:s', '1984-09-21 21:14:59', true));

//we send jalali date as an array( year, month, day, hour, minute, second )
console.log('Jalali To Gregorian:' + jDateTime.getGregorian('Y-m-d H:i:s', [1363, 6, 30, 21, 14, 59], false));

//To get Current Jalali DateTime, we just call getJalali method without any arguments
console.log('Today In Jalali:' + jDateTime.getJalali());
