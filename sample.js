var jDateTime = require('./jDateTime').init();

console.log('Gregorian To Jalali:' + jDateTime.gregorian_to_jalali([2012, 01, 19]));
console.log('Jalali To Gregorian:' + jDateTime.jalali_to_gregorian([1390, 10, 29]))
console.log('Today In Jalali:' + jDateTime.jalali_today());