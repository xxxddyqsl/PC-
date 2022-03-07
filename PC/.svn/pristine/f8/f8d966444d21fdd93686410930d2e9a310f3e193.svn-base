var parseJson = function(str) {
    if (typeof JSON !== 'undefined') {
        return JSON.parse(str);
    }
    var res = new Function('return ' + str);
    return res();
}
var stringifyJSON = function(obj) {
    var type = typeof obj;
    if (obj == null) {
        return "null";
    }
    if (type == "string") {
        return "\"" + obj.replace(/([\'\"\\])/g, "\\$1").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\f/g, "\\f").replace(/\r/g, "\\r") + "\"";
    }
    if (type == "number") {
        return obj.toString();
    }
    if (type == "boolean") {
        return obj + "";
    }
    if (Object.prototype.toString.call(obj) == "[object Date]") {
        return obj.format("YYYY-MM-DD hh:mm:ss");
    }
    var r = [],
        i, x;
    if (Object.prototype.toString.call(obj) == "[object Array]") {
        var il = obj.length;
        for (i = 0; i < il; i += 1) {
            x = arguments.callee(obj[i]);
            x != null && r.push(x);
        }
        return "[" + r.join(",") + "]";
    }
    if (obj && obj.constructor == Object) {
        for (i in obj) {
            x = arguments.callee(obj[i]);
            x != null && r.push("\"" + i + "\":" + x);
        }
        return "{" + r.join(",") + "}";
    }
    return null;
};

function getSearch(url) {
    var a = '';
    if (url) {
        var reg = /(\?.+)/;
        var matches = url.match(reg);
        if (matches) {
            a = matches[1];
        }
    } else {
        a = location.search;
    }
    if (!a) {
        return {};
    }
    var obj = {};
    var ps = a.substr(1, a.length).split('&')
    for (var i = 0; i < ps.length; i++) {
        var _a = ps[i].split('=');
        var k = _a[0],
            v = _a[1];
        if (obj[k]) {
            obj[k] = [obj[k]];
            obj[k].push(v);
        } else {
            obj[k] = v;
        }
    }
    return obj;
}

function createVerParams(url, params) {
    var paramsStr = [];
    var stringifyParams = stringifyJSON(params);
    paramsStr.push(stringifyParams);

    var access = {
        accessId: 358,
        accessType: 6,
        accessKey: 'Jzb4m6LDRd8ttpvezp2',
        accessPasswd: '3s47AcSr496OyqEEGI'
    }
    // var access = {
    //     accessId: 2010,
    //     accessType: 8,
    //     accessKey: 'grssiAYYUjvRPUV',
    //     accessPasswd: 'v2fz2wN8hnPqB3'
    // } 
    // var access = {
    //     accessId: 351,
    //     accessType: 6,
    //     accessKey: 'bhiUcI3v5B1Y',
    //     accessPasswd: 'lMBrqsr6uA6o6GoS'
    // }

    var reg = /[https,http]:\/\/[^/]+(\/[^?]+)\?*/;
    var matches = url.match(reg);
    var uri = url;
    if (matches) {
        uri = matches[1];
    }
    paramsStr.push(uri);
    var temp = {};
    temp.signVersion = '1.0';
    temp.second = parseInt((new Date().getTime()) / 1000);
    var search = getSearch(url);
    for (var p in search) {
        temp[p] = search[p];
    }

    for (var p in access) {
        temp[p] = access[p];
    }

    paramsStr.push(access.accessId);
    paramsStr.push(access.accessPasswd);
    paramsStr.push(access.accessType);
    paramsStr.push(temp.second);
    paramsStr.push(temp.signVersion);

    paramsStr.push(access.accessKey);
    temp.postBody = stringifyParams;

    temp.accessVerify = md5(paramsStr.join(''));

    delete temp.accessKey;
    return temp;
}

// function captcha(captchaInUrl, callback, imgError) {
//     var root_url = location.protocol;

//     if (root_url === 'file:') {
//         root_url = 'http:';
//     }

//     var jsUrl = root_url + "//cloud.api.sandbox.wn/cloud/captcha/genkey/" + captchaInUrl;
//     var nginxUrl = "/cloud/captcha/genkey/" + captchaInUrl;

//     var params = createVerParams(jsUrl, {
//         file: 'captcha_generation.js'
//     });

//     $("#" + captchaInUrl).error(function() {
//         $("#" + captchaInUrl).remove();
//         imgError && imgError($(this));
//     })

//     try {
//         if (captchaAlive)
//             captchaAlive = null;

//         if (captchaGenerationUuid)
//             captchaGenerationUuid = null;

//         if (captchaGenerationValue)
//             captchaGenerationValue = null;

//     } catch (err) {};

//     $.ajax({
//         type: 'get',
//         url: jsUrl,
//         dataType: 'script',
//         data: params,
//         success: function(response, data, status, error_message) {
//             console.log(arguments)
//             try {
//                 var captchaAlived = captchaAlive();
//                 if (captchaAlived == "false") {
//                     $("#" + captchaInUrl).remove();
//                     imgError && imgError(captchaAlived);
//                     return;
//                 }

//                 var capUrl = root_url + '//cloud.api.sandbox.wn/cloud/captcha/generation/' + captchaInUrl;
//                 var _params = {
//                     "uuid": captchaGenerationUuid(),
//                     "value": captchaGenerationValue()
//                 };
//                 var params = genc(capUrl, _params);
//                 var queryParam = $.param(params);

//                 var urlsrc = capUrl + '?' + queryParam;

//                 $("#" + captchaInUrl).attr({
//                     src: urlsrc
//                 })

//                 callback && callback(_params);
//             } catch (err) {
//                 imgError && imgError("SyntaxError:" + err.message);
//             }
//         },
//         error: function(response, data, status, error_message) {
//             console.log(arguments)
//             captchaAlive();
//             try {
//                 if (data == 'parsererror' && response.responseText != undefined && response.responseText.indexOf("{") == 0) {
//                     imgError && imgError(JSON.parse(response.responseText));
//                 } else {
//                     imgError && imgError("Error:" + data);
//                 }
//             } catch (err) {
//                 imgError && imgError("Error:" + err.message);
//             }
//         }
//     });

// }