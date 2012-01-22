/*
* Jalali DateTime Module For Node.js
* (c) 2012 Amir M. Mahmoudi <a-mahmoudi.com>
* MIT license
*
* Original Jalali to Gregorian (and vice versa) convertor:
* Copyright (C) 2003,2008  Behdad Esfahbod <js@behdad.org>
* http://www.farsiweb.info/jalali/jalali.js
*
* Also Using some ideas(codes) from Jalali DateTime Class by: Sallar Kaboli
* Copyright (C) 2011 Sallar Kaboli (http://sallar.ir)
* http://sallar.me/projects/jdatetime/
*
*
* This module can convert DateTime between Gregorian and Jalali Calendar.
*
* @version: 1.0
*/



/**
 *  jDateTime Definition and Constructor
 *
 * width this function we define our Object(Class)
 * and with prototype extend our Object
 *
 * @param convertNumber bool Converts numbers to Farsi
 * @param TimeZone string This string should be in TimeZones array
 */
function jDateTime (convertNumber, timeZone) {
	/*
	 * Constants and constructor variables
	 */	
	this.TimeZones = {
		'Kwajalein' : -12,
        'Pacific/Midway' : -11,
        'Pacific/Honolulu' : -10,
        'America/Anchorage' : -9,
        'America/Los_Angeles' : -8,
        'America/Denver' : -7,
        'America/Tegucigalpa' : -6,
        'America/New_York' : -5,
        'America/Caracas' : -4.5,
        'America/Halifax' : -4,
        'America/St_Johns' : -3.5,
        'America/Argentina/Buenos_Aires' : -3,
        'America/Sao_Paulo' : -3,
        'Atlantic/South_Georgia' : -2,
        'Atlantic/Azores' : -1,
        'Europe/Dublin' : 0,
        'Europe/Belgrade' : 1,
        'Europe/Minsk' : 2,
        'Asia/Kuwait' : 3,
        'Asia/Tehran' : 3.5,
        'Asia/Muscat' : 4,
        'Asia/Yekaterinburg' : 5,
        'Asia/Kolkata' : 5.5,
        'Asia/Katmandu' : 5.75,
        'Asia/Dhaka' : 6,
        'Asia/Rangoon' : 6.5,
        'Asia/Krasnoyarsk' : 7,
        'Asia/Brunei' : 8,
        'Asia/Seoul' : 9,
        'Australia/Darwin' : 9.5,
        'Australia/Canberra' : 10,
        'Asia/Magadan' : 11,
        'Pacific/Fiji' : 12,
        'Pacific/Tongatapu' : 13
	},
	this.convert_number = (convertNumber === null || typeof(convertNumber) === 'undefined') ? false : convertNumber,
	this.time_zone = (timeZone === null || typeof(timeZone) === 'undefined' || !this._isValidTimeZone(timeZone)) ? false : timeZone,
	this.g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	this.j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
}

/*
* Extend out Object(Class) with new functions
* Private functions have '_' prefix for their names
*/
jDateTime.prototype = {
	/**
	 *  jDateTime.getJalali
	 *
	 *  Format and returns given DateTime string just like php
	 *
	 * @param format string This string should be like php DateTime Format (http://php.net/manual/en/function.date.php)
	 * @param dt string DateTime String. e.g: 2012-01-20 15:05:30
	 * @param convertNumber bool Converts numbers to Farsi
	 */
	getJalali: function(format, dt, convertNumber) {
		
		convertNumber = (convertNumber === null || typeof(convertNumber) === 'undefined') ? this.convert_number : convertNumber;
		format = (format === null || typeof(format) === 'undefined') ? 'Y-m-d' : format;

		// define javascript Date object with given DateTime or with Current Time
		dt = (dt === null || typeof(dt) === 'undefined') ? new Date() : new Date(dt);

		// get javascript Date Object with specific TimeZone
		objDT = this._calculateTimeZone(dt);

		var JDate = this._g2j([objDT.getFullYear(), objDT.getMonth()+1, objDT.getDate()]);
		
		return this._getFormatedDate(format, objDT, JDate, convertNumber)
	},
	/**
	 *  jDateTime.getGregorian
	 *
	 *  Format given DateTime Jalali array convert it to geregorian and return it as a string
	 *
	 * @param format string This string should be like php DateTime Format (http://php.net/manual/en/function.date.php)
	 * @param dtArray array DateTime as an array in this specific format: (year, month, day, hour, min, sec)
	 * @param convertNumber bool Converts numbers to Farsi
	 */
	getGregorian: function(format, dtArray, convertNumber) {
		if(this._isArray(dtArray)) {
			convertNumber = (convertNumber === null || typeof(convertNumber) === 'undefined') ? this.convert_number : convertNumber;
			format = (format === null || typeof(format) === 'undefined') ? 'Y-m-d' : format;

			jDate = dtArray.slice(0,3);
			gDate = this._j2g(jDate);

			gDateString = gDate.join('-');
			if(dtArray.length > 3) {
				gTime = dtArray.slice(3, dtArray.length);
				gDateString += ' ' + gTime.join(':');
			}

			// get javascript Date Object with specific TimeZone
			dt = new Date(gDateString);
			objDT = this._calculateTimeZone(dt);
			
			return this._getFormatedDate(format, objDT, gDate, convertNumber)
		} else {
			return false;
		}
	},
	farsi_day_name: function(day, shorten, len) {
		var shorten = (!shorten) ? false : shorten,
			len = (!len) ? 3 : len,
        	ret = '';
		switch ( day.toString().toLowerCase() ) {
			case 'sat': case 'saturday': case '0': ret = 'شنبه';  break;
			case 'sun': case 'sunday': case '1': ret = 'یکشنبه'; break;
			case 'mon': case 'monday': case '2': ret = 'دوشنبه'; break;
			case 'tue': case 'tuesday': case '3': ret = 'سه شنبه'; break;
			case 'wed': case 'wednesday': case '4': ret = 'چهارشنبه'; break;
			case 'thu': case 'thursday': case '5': ret = 'پنجشنبه'; break;
			case 'fri': case 'friday': case '6': ret = 'جمعه'; break;
        }

		return (shorten) ? ret.substr(0, len) : ret;
	},
	farsi_month_name: function(month, shorten, len) {
		var shorten = (!shorten) ? false : shorten,
			len = (!len) ? 3 : len;
        	ret = '',
        	month = parseInt(month, 10);
        switch ( month ) {
            case 1: ret = 'فروردین'; break;
            case 2: ret = 'اردیبهشت'; break;
            case 3: ret = 'خرداد'; break;
            case 4: ret = 'تیر'; break;
            case 5: ret = 'امرداد'; break;
            case 6: ret = 'شهریور'; break;
            case 7: ret = 'مهر'; break;
            case 8: ret = 'آبان'; break;
            case 9: ret = 'آذر'; break;
            case 10: ret = 'دی'; break;
            case 11: ret = 'بهمن'; break;
            case 12: ret = 'اسفند'; break;
        }
        return (shorten) ? ret.substr(0, len) : ret;
	},	
	_getFormatedDate: function(format, objDateTime, arrayDate, convertNumber) {
		var formatArray = format.split('');
		var ret = ''; //output string
		var i = 0;
		
		for(i in formatArray) {
			
			switch (formatArray[i]) {
				case 'j':
					ret += parseInt(arrayDate[2], 10).toString();
					break;
				case 'D':
					ret += this.farsi_day_name(objDateTime.getDay(), true);
					break;
				case 'l':
					ret += this.farsi_day_name(objDateTime.getDay(), false);
					break;
				case 'd':
					ret += (arrayDate[2].toString().length === 1) ? '0' + arrayDate[2] : arrayDate[2];
					break;
				case 'w':
					ret += objDateTime.getDay();
					break;
				case 'F':
					ret += this.farsi_month_name(arrayDate[1]);
					break;
				case 'n':
					ret += parseInt(arrayDate[1], 10).toString();
					break;
				case 'm':
					ret += (arrayDate[1].toString().length === 1) ? '0' + arrayDate[1] : arrayDate[1];
					break;
				case 'M':
					ret += this.farsi_month_name(arrayDate[1], true);
					break;
				case 'Y':
					ret += arrayDate[0];
					break;
				case 'y':
					ret += arrayDate[0].toString().substr(2,2);
					break;
				case 'a':
					ret += (objDateTime.getHours() < 12) ? 'ق.ظ' : 'ب.ظ';
					break;
				case 'A':
					ret += (objDateTime.getHours() < 12) ? 'قبل از ظهر' : 'بعد از ظهر';
					break;
				case 'H':
					ret += objDateTime.getHours();
					break;
				case 'i':
					ret += objDateTime.getMinutes();
					break;
				case 's':
					ret += objDateTime.getSeconds();
					break;
				default:
					ret += formatArray[i];
					break;
			}

		}

		return (convertNumber) ? this._convertNumbers(ret) : ret;
	},
	_isArray: function(testObject) {	 
    	return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
	},
	_convertNumbers: function(matches) {
        var farsi_array = new Array('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'),
        	english_array = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
        
        matches = matches.toString();
        for (var i in english_array) {
        	matches = matches.replace(new RegExp(english_array[i], 'g'), farsi_array[i]);
        }

        return matches;
	},
	_isValidTimeZone: function(timeZone) {
		for(var tz in this.TimeZones) {
			if (tz === timeZone) {
				return true;
			}
		}

		return false;
	},
	_calculateTimeZone: function(objTime) {
		if(this.time_zone === false) {
			return objTime;
		} else {
			targetTime = objTime.getTime(); //get unix time stamp time from target DateTime Object

			localOffset = new Date().getTimezoneOffset() * 60000; //get TimeOffset of server, for example if TZ of server is set to iran we receive +3.5
			utc = targetTime + localOffset;
			offset = this.TimeZones[this.time_zone]; //get target offset

			targetTimeTZ = utc + (3600000*offset);
			newTime = new Date(targetTimeTZ);

			return newTime;
		}
	},
    /**
	 * Original Jalali to Gregorian (and vice versa) convertor:
	 * Copyright (C) 2003,2008  Behdad Esfahbod <js@behdad.org>
     * In this section i just use and edit base source code
     */	
	_div: function(a, b) {
		return Math.floor(a/b);
	},
	_remainder: function(a, b) {
		return a - this._div(a,b)*b;
	},
	_g2j: function(g) {
		var gy, gm, gd;
		var jy, jm, jd;
		var g_day_no, j_day_no;
		var j_np;

		var i;

		gy = g[0]-1600;
		gm = g[1]-1;
		gd = g[2]-1;

		g_day_no = 365*gy+this._div((gy+3),4)-this._div((gy+99),100)+this._div((gy+399),400);
		for (i=0;i<gm;++i)
			g_day_no += this.g_days_in_month[i];
		if (gm>1 && ((gy%4==0 && gy%100!=0) || (gy%400==0)))
			/* leap and after Feb */
			++g_day_no;
		g_day_no += gd;

		j_day_no = g_day_no-79;

		j_np = this._div(j_day_no, 12053);
		j_day_no = this._remainder (j_day_no, 12053);

		jy = 979+33*j_np+4*this._div(j_day_no,1461);
		j_day_no = this._remainder (j_day_no, 1461);

		if (j_day_no >= 366) {
			jy += this._div((j_day_no-1),365);
			j_day_no = this._remainder ((j_day_no-1), 365);
		}
	 
		for (i = 0; i < 11 && j_day_no >= this.j_days_in_month[i]; ++i) {
			j_day_no -= this.j_days_in_month[i];
		}
		jm = i+1;
		jd = j_day_no+1;

		return new Array(jy, jm, jd);
	},
	_j2g: function(j) { // array containing year, month, day
		var gy, gm, gd;
		var jy, jm, jd;
		var g_day_no, j_day_no;
		var leap;

		var i;

		jy = j[0]-979;
		jm = j[1]-1;
		jd = j[2]-1;
		
		j_day_no = 365*jy + this._div(jy,33)*8 + this._div((this._remainder (jy, 33)+3),4);

		for (i=0; i < jm; ++i)
			j_day_no += this.j_days_in_month[i];

		j_day_no += jd;

		g_day_no = j_day_no+79;

		gy = 1600 + 400*this._div(g_day_no,146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
		g_day_no = this._remainder (g_day_no, 146097);

		leap = 1;
		if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
		{
			g_day_no--;
			gy += 100*this._div(g_day_no,36524); /* 36524 = 365*100 + 100/4 - 100/100 */
			g_day_no = this._remainder (g_day_no, 36524);

			if (g_day_no >= 365)
				g_day_no++;
			else
				leap = 0;
		}
		
		gy += 4*this._div(g_day_no,1461); /* 1461 = 365*4 + 4/4 */
		g_day_no = this._remainder (g_day_no, 1461);

		if (g_day_no >= 366) {
			leap = 0;

			g_day_no--;
			gy += this._div(g_day_no, 365);
			g_day_no = this._remainder (g_day_no, 365);
		}

		for (i = 0; g_day_no >= this.g_days_in_month[i] + (i == 1 && leap); i++)
			g_day_no -= this.g_days_in_month[i] + (i == 1 && leap);
		gm = i+1;
		gd = g_day_no+1;

		return new Array(gy, gm, gd);
	},
};

module.exports.init = function (convertNumber, timeZone) {
	return new jDateTime(convertNumber, timeZone);
};