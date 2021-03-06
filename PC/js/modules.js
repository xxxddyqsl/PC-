angular.module('Services',[]);
angular.module('Controllers',[]);
angular.module('Directives',[]);
angular.module('Filters',[]);



function callCefMethod(path,data,callback){
    console.log('jj.fetch(%s), params:%s , ----------------- start',path,JSON.stringify(data));
    // var _ns = window[nameSpace];
    // var fn = _ns[methodName];
    // if(!fn){
        // alert([nameSpace,methodName].join('.') + '方法不存在');
        // return;
    // }
    var params = {};
    if(typeof data == 'function'){
        frame = callback;
        callback = data;
        data = '';
    }
    var callbackName = 'cef_callback_' + new Date().getTime();
    while(window[callbackName]){
        callbackName = 'cef_callback_' + new Date().getTime();
    }
    // params.serviceName = serviceName;
    if(data){
        params.data = data;
    }
    if(!callback){
        params.callback = '';
    }else{
        params.callback = callbackName;
    }
    if(typeof FRAMEID !== 'undefined'){
        params.frameId = FRAMEID;
    }
    // var params = data ? JSON.stringify(data) : '';
    params = JSON.stringify(params);
    console.log(callback)
    if(callback){
        window[callbackName] = {
            path : path,
            params : params,
            fn : function(data,usedLater){
                var res;
                var execpt;
                try{
                    res = callback(data);
                    if(res === undefined){
                        res = {
                            Flag : data.Flag,
                            Message : 'callback invoked success'
                        }
                    }
                }catch(e){
                    console.log(e);
                    execpt = e;
                    res = {
                        Flag : data.Flag || 1,
                        Message : 'callback invoked fail'
                    }
                }
                // if(data.Flag != 0){
                    // console.log('%cend -------- jj.fetch(%s) invoked fail \nparams:%s\nres:','background:#fff0f0;color:red;',path,params,data);
                // }else{
                    // console.log('end -------- jj.fetch(%s) invoked success \nparams:%s\nres:',path,params,data);
                // }
                if(execpt){
                    console.log(execpt);
                }
                res = JSON.stringify(res);
                // if(res.Flag == 0){
                    // window[callbackName] = undefined;
                // }
                if(!usedLater || !callback){
                    delete window[callbackName];
                }
                return res;
            }
        }
    }
    /** 
        有参数，有回调
        @path path
        @params {callback : callbackName,data : '{xxx}'}
        有参数，没回调
        @path path
        @params {callback : '',data : '{xxx}'}
        没参数，有回调
        @path path
        @params {callback : callbackName}
        没参数，没回调
        @path path
        @params '{}'
    */
    return jj.fetch(path,params);
}



function openUrl(e,dom){
    var href = dom.href;
    callCefMethod('frame/openUrl',{
        url : href
    },function(){
        
    })
    e.preventDefault();
}
// var webIm = angular.module('webim',['Controllers','Services','Directives','Filters','ui.router','ngSanitize']);
var webIm = angular.module('im',['Controllers','Services','Directives','Filters','ui.router','jQueryScrollbar','ngAnimate']);
webIm.config(['$stateProvider','$sceProvider','$compileProvider',function($stateProvider,$sce,$compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(jj|https?|ftp|mailto|chrome-extension):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(jj|data|file|https?|http?):/);
    // Strophe.TIMEOUT = 2;
    $sce.enabled(false);
    if(PAGE == 'login'){
        $stateProvider
        .state('login',{
            url : '/login',
            templateUrl: 'login.html'
        })
        .state('switchAccount',{
            url : '/switch',
            templateUrl: 'switchAccount.html',
            controller : 'switchAccountController',
        })
        .state('resetPwd',{
            url : '/resetPwd',
            templateUrl: 'resetPwd.html',
            controller : 'resetPwdController',
        })
        .state('resetPwd.step1',{
            views : {
                resetPwdTitle : {
                  templateUrl : 'resetPwdTitle.html'  
                },
                resetPwdLogo : {
                    templateUrl : 'formLogo.html'  
                },
                resetPwdStep : {
                    templateUrl : 'resetPwdStep1.html'  
                },
                resetPwdStepBtns : {
                    templateUrl : 'resetPwdStep1Btns.html'  
                }
            }
        })
        .state('resetPwd.step2',{
            views : {
                resetPwdTitle : {
                  templateUrl : 'resetPwdTitle2.html'  
                },
                resetPwdLogo : {
                    templateUrl : 'formLogo.html'  
                },
                resetPwdStep : {
                    templateUrl : 'resetPwdStep2.html'  
                },
                resetPwdStepBtns : {
                    templateUrl : 'resetPwdStep2Btns.html'  
                }
            }
        })
        .state('resetPwd.step3',{
            views : {
                resetPwdTitle : {
                  templateUrl : 'resetPwdTitle.html'  
                },
                resetPwdLogo : {
                    templateUrl : 'formLogo.html'  
                },
                resetPwdStep : {
                    templateUrl : 'resetPwdStep3.html'  
                },
                resetPwdStepBtns : {
                    templateUrl : 'resetPwdStep3Btns.html'  
                }
            }
        })
        .state('resetPwd.step4',{
            views : {
                resetPwdStep : {
                    templateUrl : 'resetPwdStep4.html'  
                }
            }
        })
        .state('serviceLogin',{
            params: {
                account : '',
                password : ''
            },
            url : '/serviceLogin',
            templateUrl : 'serviceLogin.html',
            controller : 'serviceLoginController',
        })
        .state('serviceLogin.form',{

            views : {
                serviceLoginLogo : {
                    templateUrl : 'formLogo.html'  
                },
                'serviceLoginTitle' : {
                    templateUrl : 'serviceLoginTitle.html',
                },
                'serviceLoginForm' : {
                    templateUrl : 'serviceLoginForm.html',
                }
            }
        })
        .state('register',{
            url : '/register',
            templateUrl: 'register.html',
            controller : 'registerController'
        })
        .state('register.step1',{
            views : {
                registerTitle : {
                  templateUrl : 'registerTitle.html'  
                },
                registerLogo : {
                    templateUrl : 'formLogo.html'  
                },
                registerStep : {
                    templateUrl : 'registerStep1Form.html'  
                },
                registerBtns : {
                    templateUrl : 'registerStep1Btns.html'  
                }
            }
        })
        .state('register.step2',{
            views : {
                registerTitle : {
                  templateUrl : 'registerTitle2.html'  
                },
                registerLogo : {
                    templateUrl : 'formLogo.html'  
                },
                registerStep : {
                    templateUrl : 'registerStep2Form.html'  
                },
                registerBtns : {
                    templateUrl : 'registerStep2Btns.html'  
                }
            }
        })
        .state('register.step3',{
            views : {
                registerTitle : {
                  templateUrl : 'registerTitle.html'  
                },
                registerLogo : {
                    templateUrl : 'formLogo.html'  
                },
                registerStep : {
                    templateUrl : 'registerStep3Form.html'  
                },
                registerBtns : {
                    templateUrl : 'registerStep3Btns.html'  
                }
            }
        })
        .state('register.step4',{
            views : {
                registerStep : {
                    templateUrl : 'registerStep4.html'  
                }
            }
        })
        .state('loging',{
            url : '/loging',
            templateUrl: 'logining.html',
        })
    }else{
        
    }
}]).run(['$rootScope', '$state', '$stateParams','langPack','webConfig',function ($rootScope,   $state,   $stateParams,langPack,webConfig) {
   
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.langPack = langPack;
        $rootScope.webConfig = webConfig;
        window.jjCallback = jjCallback;
        /*方法说明
        *@method jjCallback
        *@for 所属window对象 window.jjCallback(param)
        *@param {
                    callBackName:cef_callback_1596509800498,
                    usedLater:boolean,
                    callBackData:obj 
                }
        *@return 1.在callBackData.Code不是0的时候直接跳出,返回错误信息
        *        2.如果callBackName参数带. 会以.分割成数组并且遍历使callbackObj不断指向window属性，callbackObj判断是否为fun，是则返回对应window上的方法callbackObj(callBackData,usedLater)，否则返回错误信息
        *        3.如果callBackName参数不带. 直接找到window[callBackName]上的方法赋值给callbackObj，判断callbackObj.fn是否为fun是则返回callbackObj.fn(callBackData,usedLater)否则返回错误信息
        */
       
        function jjCallback(callBackName,usedLater,callBackData){
            usedLater = usedLater !== 'False';
            if(callBackData){
                // 4离线
                if(callBackData.Code == 4){ 
                    alert(langPack.getKey('offlineTip'));
                    // return;
                }
                var hanlderError = langPack.getKey('error' + callBackData.Code,true);
                if(hanlderError){//其他状态跳出
                    alert(langPack.getKey('error' + callBackData.Code));
                    return;
                }
            }
            if(callBackName.indexOf('.') != -1){ // 
                var arr = callBackName.split('.');
                var idx = 0;
                callbackObj = window;
                while(idx < arr.length){
                    callbackObj = callbackObj[arr[idx]];//让callbackObj不断指向window属性
                    idx ++;
                }
                if(typeof callbackObj === 'function'){
                    return callbackObj(callBackData,usedLater);
                }else{
                    console.log('%s is undefined or not a function' , callBackName,callBackData);
                    return JSON.stringify({
                        Flag : 1,
                        Message : callBackName + ' is undefined or not a function'
                    })
                }
            }else{
                var callbackObj = window[callBackName];
                if(callbackObj ){
                    if(callBackData.Flag != 0){
                        console.log('%cend -------- jj.fetch(%s) invoked fail \nparams:%s\nres:','background:#fff0f0;color:red;',callbackObj.path,callbackObj.params,callBackData);
                    }else{
                        console.log('end -------- jj.fetch(%s) invoked success \nparams:%s\nres:',callbackObj.path,callbackObj.params,callBackData);
                    }
                    if(typeof callbackObj.fn === 'function'){
                        return callbackObj.fn(callBackData,usedLater);
                    }
                }else{
                    console.log('%s is undefined or not a function' , callBackName,callBackData);
                    return JSON.stringify({
                        Flag : 1,
                        Message : callBackName + ' is undefined or not a function'
                    })
                }
            }
            
        }
    }
])