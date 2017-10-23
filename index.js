/**
 * check webp image support in browser
 * 
 */

'use strict';

var SAVE_DATA_KEY = '__j_webp_supp__';

function error(str) {
    try {
        if (window.console && console.error) {
            console.error('[webp-support]', str);
        }
    } catch (err) {

    }
}

/**
 * webp support checking code snipet from google webp site:
 * https://developers.google.com/speed/webp/faq
 * 
 * check_webp_feature:
 * 'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
 * 'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
 * @param {*} feature 
 * @param {*} callback 
 */
function check_webp_feature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function() {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function() {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}

var singleton = {
    //check result
    webp: {
        lossy: false,
        lossless: false,
        alpha: false,
        animation: false
    }
};

//cookie name when localStorage is not available
var cookieName = '';
var isDone = false;

function save(data) {
    var str = JSON.stringify(data);
    try {
        localStorage.setItem(SAVE_DATA_KEY, str);
        return true;
    } catch (err) {
        error('save result to localStorage fail: ' + err.message);
    }

    if (!cookieName) {
        return false;
    }

    //now, try to save result in cookie
    var now = (new Date()).getTime();
    var expire = new Date(now + 1000 * 60 * 60 * 24 * 365 * 5);
    document.cookie = cookieName + '=' + encodeURIComponent(str) +
        '; expires=' + expire.toUTCString() +
        '; path=/';
}

//get check result from localStorage/cookie
function restore() {
    var str = '';
    try {
        str = localStorage.getItem(SAVE_DATA_KEY);
    } catch (err) {
        error('get result from localStorage fail: ' + err.message);
    }

    if (!str && cookieName) {
        //read from cookie
        var reg = new RegExp(cookieName + '\\=([^;]+)');
        var out = reg.exec(document.cookie || '');
        if (out) {
            str = out[1];
        }
    }

    if (!str) {
        return;
    }

    try {
        var data = JSON.parse(str);
        if (data && data.hasOwnProperty('lossy')) {
            singleton.webp = data;
            isDone = true;
        }
    } catch (err) {
        error('parse from previous result fail: ' + err.message);
    }
}

function check() {
    var remain = 4;
    var list = ['lossy', 'lossless', 'alpha', 'animation'];

    function callback(type, result) {
        var index = list.indexOf(type);
        if (index >= 0) {
            singleton.webp[type] = result;
            list.splice(index, 1);

            if (list.length < 1) {
                //all check finished
                isDone = true;
                singleton.save();
            }
        }
    }

    for (var i = 0, len = list.length; i < len; i++) {
        check_webp_feature(list[i], callback);
    }
}

singleton.init = function(config) {
    config = config || {};
    //should use cookie to store result,when localStorage.setItem fails
    cookieName = config.cookieName;

    restore();

    if (!isDone) {
        check();
    }
};

singleton.isDone = function() {
    return isDone;
};

singleton.save = function() {
    save(singleton.webp);
};

singleton.check = function() {
    check();
};

module.exports = singleton;