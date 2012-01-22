# node-jalali

Jalali DateTime module for Nodejs.

# Usage

To install this module, use npm:

    $ npm install node-jalali
    
Here is a sample source code:

    var jDate = require('node-jalali');
    var date;
    
    // Use getJalali method to convert from gregorian to jalali
    date = jDate.getJalali('Y-m-d H:i:s', '1984-09-21 21:14:59', true);
    
    // You can use getJalali without any parameter. It returns today:
    date = jDate.getJalali();
    
    // Converting from jalali to gregorian is also possible:
    jDateTime.getGregorian('Y-m-d H:i:s', [1363, 6, 30, 21, 14, 59], false);
    
# License

See LICENSE in the root directory of this repo.


