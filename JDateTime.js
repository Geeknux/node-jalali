/*
* Jalali DateTime Module For Node.js
* (c) 2012 Amir M. Mahmoudi <a-mahmoudi.com>
* MIT license
*
* Original Jalali to Gregorian (and vice versa) convertor:
* Copyright (C) 2003,2008  Behdad Esfahbod <js@behdad.org>
*
* This module can convert DateTime between Gregorian and Jalali Calendar.
*

* @version: 0.1
*/


function jDateTime () {
	this.g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
	this.j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);
}

jDateTime.prototype = {
	div: function(a, b) {
		return Math.floor(a/b);
	},
	remainder: function(a, b) {
		return a - this.div(a,b)*b;
	},
	gregorian_to_jalali: function(g) {
		var gy, gm, gd;
		var jy, jm, jd;
		var g_day_no, j_day_no;
		var j_np;

		var i;

		gy = g[0]-1600;
		gm = g[1]-1;
		gd = g[2]-1;

		g_day_no = 365*gy+this.div((gy+3),4)-this.div((gy+99),100)+this.div((gy+399),400);
		for (i=0;i<gm;++i)
			g_day_no += this.g_days_in_month[i];
		if (gm>1 && ((gy%4==0 && gy%100!=0) || (gy%400==0)))
			/* leap and after Feb */
			++g_day_no;
		g_day_no += gd;

		j_day_no = g_day_no-79;

		j_np = this.div(j_day_no, 12053);
		j_day_no = this.remainder (j_day_no, 12053);

		jy = 979+33*j_np+4*this.div(j_day_no,1461);
		j_day_no = this.remainder (j_day_no, 1461);

		if (j_day_no >= 366) {
			jy += this.div((j_day_no-1),365);
			j_day_no = this.remainder ((j_day_no-1), 365);
		}
	 
		for (i = 0; i < 11 && j_day_no >= this.j_days_in_month[i]; ++i) {
			j_day_no -= this.j_days_in_month[i];
		}
		jm = i+1;
		jd = j_day_no+1;

		return new Array(jy, jm, jd);
	},
	jalali_to_gregorian: function(j) { // array containing year, month, day
		var gy, gm, gd;
		var jy, jm, jd;
		var g_day_no, j_day_no;
		var leap;

		var i;

		jy = j[0]-979;
		jm = j[1]-1;
		jd = j[2]-1;
		
		j_day_no = 365*jy + this.div(jy,33)*8 + this.div((this.remainder (jy, 33)+3),4);

		for (i=0; i < jm; ++i)
			j_day_no += this.j_days_in_month[i];

		j_day_no += jd;

		g_day_no = j_day_no+79;

		gy = 1600 + 400*this.div(g_day_no,146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
		g_day_no = this.remainder (g_day_no, 146097);

		leap = 1;
		if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
		{
			g_day_no--;
			gy += 100*this.div(g_day_no,36524); /* 36524 = 365*100 + 100/4 - 100/100 */
			g_day_no = this.remainder (g_day_no, 36524);

			if (g_day_no >= 365)
				g_day_no++;
			else
				leap = 0;
		}
		
		gy += 4*this.div(g_day_no,1461); /* 1461 = 365*4 + 4/4 */
		g_day_no = this.remainder (g_day_no, 1461);

		if (g_day_no >= 366) {
			leap = 0;

			g_day_no--;
			gy += this.div(g_day_no, 365);
			g_day_no = this.remainder (g_day_no, 365);
		}

		for (i = 0; g_day_no >= this.g_days_in_month[i] + (i == 1 && leap); i++)
			g_day_no -= this.g_days_in_month[i] + (i == 1 && leap);
		gm = i+1;
		gd = g_day_no+1;

		return new Array(gy, gm, gd);
	},
	jalali_today: function() {
		Today = new Date();
		j = this.gregorian_to_jalali(new Array(
						Today.getFullYear(),
						Today.getMonth()+1,
						Today.getDate()
						));
		return j[2]+"/"+j[1]+"/"+j[0];
	}
};

module.exports.init = function () {
	return new jDateTime();
};