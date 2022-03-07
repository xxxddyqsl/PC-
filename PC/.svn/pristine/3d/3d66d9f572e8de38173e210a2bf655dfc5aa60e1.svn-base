var controllers = angular.module('Controllers');
var changeTitleTimer;
if(location.href.indexOf('debug') == -1){
    // if(console){
        // var old = console.log;
        // console.log = function(){}
    // }
}

controllers.controller('appController',['$scope','util','empService','chatService','pops','userConfig','$document','$rootScope','webConfig','$timeout','$state','concatService','socketConnect','$stateParams','langPack',function($scope,util,empService,chatService,pops,userConfig,$doc,$rootScope,webConfig,$timeout,$state,concatService,socketConnect,stateParams,langPack){
    var info = socketConnect.info;
    var search = util.getSearch();
    $scope.userConfig = userConfig;
    $scope.show = false;
    $scope.loginAccount = info.userId;
    $scope.connectStatus = info.connectStatus;
    $scope.user = {};
    var chatListOnServer = [] , initedChatList = false;
    $(document).bind('dragstart',function(e){
        if(e.target && e.target.tagName == 'IMG'){
            e.preventDefault();
            e.stopPropagation();
        }
    })
    
    var mouseDownTimer;
    var handleMouseDown = {
        input : 1,
        textarea : 1,
        a : 1,
        img : 1
    }
    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parTagName = tar.parentNode.tagName.toLowerCase();
        if(handleMouseDown[tagName] || handleMouseDown[parTagName]){
        }else{
            if($('.selected_area_con').find(tar).size() == 0 && tar != $('.selected_area_con')[0]){
                mouseDownTimer = setTimeout(function(){
                    $rootScope.$broadcast('document.click');
                    callCefMethod('frame/move');
                },100);
            }
        }
    });
    $doc.bind('mouseup',function(e){
        clearTimeout(mouseDownTimer);
    });
    
    $scope.langSetting = function(){
        pops.open({
            templateUrl : 'languageSetting.html',
            className : 'radius4',
            data : {
                changeLanguage : $scope.changeLanguage
            },
            controller : 'languageSetting'
        })
    }
    
    var lang = langPack.getLang();
    $scope.langs = langPack.langs;
    for(var i=0;i<$scope.langs.length;i++){
        if(lang == $scope.langs[i].langValue){
            $scope.lang = $scope.langs[i];
        }
    }
    $scope.changeLanguage = function(newLang){
        $scope.lang = newLang;
        langPack.setLang(newLang.langValue);
        $rootScope.$broadcast('changeLang',newLang.langValue);
    }
    
    if(search.action == 'switch'){
        $state.go('switchAccount');
    }else{
        $state.go('login');
    }
}])

controllers.controller('loginController',['$rootScope','$scope','pops','empService','chatService','$timeout','socketConnect','langPack','webConfig','ajaxService','$state','frameService',function($rootScope,$scope,pops,empService,chatService,$timeout,socketConnect,langPack,webConfig,ajax,$state,frameService){
    $scope.login = {
        remember : false,
        showPassword : false,
        phone : '',
        password : '',
        autoLogin : false,
        selectArea : util.getLs(webConfig.PHONE_PIX) || '+86',
        errorMessage : '',
        loginUseId:'',
        stateStr : '正在登录...',
        showCaptcha : false,
        captcha : '',
        login_bott : {"margin-top":"50px"},
        captchaImg_items : [{
            "id":"2E30B9DC47EA04A3E7543FA69F4564D8",
            "alt":"请重试！",
            "title":"看不清？点击刷新！",
            "src":"img/loading.gif"
        }],
        uuidtmp : ''
    };

    function captcha(captchaInUrl, captchaCallback, imgError) {
        // alert("captcha")
        document.getElementById($scope.login.captchaImg_items[0].id) ? document.getElementById($scope.login.captchaImg_items[0].id).src = "img/loading.gif" : null;
        // var root_url = location.protocol;
        // root_url === 'file:' ? root_url = 'http:' : null;
        var root_url = 'http:';
        var jsUrl = root_url + "//cloud.api.woniu.com/cloud/captcha/genkey/" + captchaInUrl;
        var params = createVerParams(jsUrl, {file: 'captcha_generation.js'});
        try {
            if (captchaAlive)
                captchaAlive = null;
            if (captchaGenerationUuid)
                captchaGenerationUuid = null;
            if (captchaGenerationValue)
                captchaGenerationValue = null;
        } catch (err) {};
        $.ajax({
            url: jsUrl,
            dataType: 'script',
            data: params,
            success: function(response, data, status, error_message) {
                try {
                    var captchaAlived = captchaAlive();
                    if (captchaAlived == "false") {
                        console.log('captchaAlived:'+captchaAlived)
                        imgError && imgError(captchaAlived);
                        return;
                    }
                    var capUrl = root_url + '//cloud.api.woniu.com/cloud/captcha/generation/' + captchaInUrl;
                    var _params = {
                        "uuid": captchaGenerationUuid(),
                        "value": captchaGenerationValue()
                    };
                    var params = genc(capUrl, _params);
                    var queryParam = $.param(params);
                    var urlsrc = capUrl + '?' + queryParam;
                    // $scope.login.captchaImg_items[0].src = urlsrc;
                    document.getElementById($scope.login.captchaImg_items[0].id) ? document.getElementById($scope.login.captchaImg_items[0].id).src = urlsrc : null;
                    console.log(urlsrc)
                    captchaCallback && captchaCallback(_params);
                } catch (err) {
                    imgError && imgError("SyntaxError:" + err.message);
                }
            },
            error: function(response, data, status, error_message) {
                try {
                    if (data == 'parsererror' && response.responseText != undefined && response.responseText.indexOf("{") == 0) {
                        imgError && imgError(JSON.parse(response.responseText));
                    } else {
                        imgError && imgError("Error:" + data);
                    }
                } catch (err) {
                    imgError && imgError("Error:" + err.message);
                }
            }
        });
    }

    $scope.showCaptchaFn = $scope.login.showCaptchaFn = function(id,status){
        // alert("showCaptchaFn")
        $timeout(function() {
            if (document.getElementById($scope.login.captchaImg_items[0].id) && document.getElementById($scope.login.captchaImg_items[0].id).src.indexOf('img/loading.gif') >= 0) {
                $scope.login.captchaImg_items[0].src = 'img/fail.png';
            }
        }, 6000);
        captcha(id, function(_params) {
            console.log('success------start')
            console.log(_params)

            $scope.login.showCaptcha = true;
            // $state.go('login');
            if (_params.code == undefined) {
                $scope.login.uuidtmp = _params.uuid;
            } else {
                console.log(_params.code + "," + 　_params.message);
            }
        },function(_params) {
            console.log('error-------start')
            console.log(_params)

            $state.go('login');
            if (_params == "false") {
                //无需提示用户、主动删除验证输入框和前端验证
                console.log("验证码服务已经关闭或内部服务问题");
                $scope.login.captcha = '';
                status ? null : $scope.login.errorMessage = '网络问题';
                status ? null : $timeout(function(){
                    $scope.login.errorMessage = '';
                },3000);
            } else if (_params.code != undefined) {
                if (_params.code == "-90019" || _params.code == "-90020") {
                    //需要提示用户，输入项不做调整,已确认
                    console.log("验证码服务频率限制,稍后再试");
                    status ? null : $scope.login.errorMessage = '操作太过频繁';
                    status ? null : $timeout(function(){
                        $scope.login.errorMessage = '';
                    },3000);
                }else{
                    //需要提示用户，输入项不做调整
                    console.log("服务其他问题");
                    status ? null : $scope.login.errorMessage = '服务其他问题';
                    status ? null : $timeout(function(){
                        $scope.login.errorMessage = '';
                    },3000);
                }
            } else {
                if( (_params+"").indexOf("SyntaxError:") == 0){
                    //需要提示用户，输入项不做调整.待核实
                    console.log("验证码服务频率限制,稍后再试");
                    status ? null : status ? null : $scope.login.errorMessage = '操作太过频繁';
                    status ? null : status ? null : $timeout(function(){
                        $scope.login.errorMessage = '';
                    },3000);
                }else{
                    //需要提示用户，输入项不做调整
                    console.log("验证码服务网络问题或图片加载未完成,稍后再试" + _params);
                    status ? null : $scope.login.errorMessage = '网络问题';
                    status ? null : $timeout(function(){
                        $scope.login.errorMessage = '';
                    },3000);
                }
            }
        });
    }

    if ((new Date()).getTime() - window.localStorage.getItem('captchaTime') < 10*60*1000) {
        console.log("captchaTime--------------------start")
        $scope.login.login_bott = {"margin-top":"12px"};
        $scope.showCaptchaFn($scope.login.captchaImg_items[0].id, (!$scope.login.showCaptcha ? true : false));
        $scope.login.showCaptcha = true;
    } else {
        console.log("captchaTime--------------------start")
        $scope.login.showCaptcha = false;
    }

    window.onhashchange = function(){
        console.log("window.onhashchange------start");
        if ((window.location.hash == '#/login' || window.location.hash == '#/serviceLogin') && $scope.login.showCaptcha) {
            $scope.showCaptchaFn($scope.login.captchaImg_items[0].id, (!$scope.login.showCaptcha ? true : false));
        }
    }

    var opening = false;
    var search = util.getSearch();
    if(search.action == 'switch' || search.action == 'login'){
        opening = true;
        $scope.login.autoLogin = false;
    }
    
    $scope.$watch('login.errorMessage',function(v){
        if(v){
            $timeout(function(){
                $scope.login.errorMessage = '';
            },3000);
        }
    })
    
    var areaReg = /\+(86|886|1|82|7|81)/;
    // $scope.logining = false;
    // 获取上次登录过用户的数据
    frameService.getCurrentUser(function(data){
        if(data.Flag == 0){
            var user = data.Data.user;
            if(user && user.Mobile){
                var phone = user.Mobile.replace(areaReg,'');
                $scope.login.phone = phone;
                if(search.action == 'switch'){
                    $scope.login.autoLogin = false;
                }else{
                    $scope.login.autoLogin = user.AutoLogin;
                }
                if($scope.login.autoLogin){
                    if(search.action == 'login') return;
                    user.Type=2;//自动登录类型
                    opening = true;
                    goLogin(user);
                }
            }
        }
    })

    $scope.loginFn = function(data){
        goLogin(data);
    }
    // 密码登录
    function goLogin(data){
        $scope.logining = true;
        $state.go('loging'); 
        callCefMethod('account/login',data,loginCallback); 
    }
    // 注册-昵称填写
    $scope.loginAfterRegister = function(id,type,name){
       var data={
            Id : id,
            Type:type,
            Name : name,  
        };
        $scope.logining = true;
        $state.go('loging');
        callCefMethod('user/changeInfo',data,function(res){
             // alert("登录成功")
             window.localStorage.setItem('captchaCounter','');
             window.localStorage.getItem('captchaTime','');
             $timeout(function(){
                 if(res.Data.loading){
                     $scope.login.stateStr = res.Data.msg;
                 }else{
                     callCefMethod('frame/reset',{
                         id : 'main',
                         name : langPack.getKey('appName'),
                         width : 890,
                         height : 630,
                         contentPath : 'index.html', 
                         resizable : true,
                         isMain : true,
                         draggable : true,
                         minHeight:500,//窗口的最小高度
                         minWidth:800//窗口的最小宽度
                     },function(){});
                 }
             })
        }); 
    }
    // 账号注册验证 
    $scope.AccountVerification = function(data){
        callCefMethod('account/login',data,function(res){ 
            if (res.Flag) {
            console.log(res);
            $state.go('login');
            $scope.login.password = '';
            $scope.login.errorMessage = langPack.getKey('loginError' + res.Code, true) || res.Message;
            $timeout(function () {
                $scope.login.errorMessage = '';
            }, 3000);
            //错误三次开启验证
            if (count.length >= 3) {
                console.log("count");
                $scope.showCaptchaFn($scope.login.captchaImg_items[0].id, (!$scope.login.showCaptcha ? true : false));
                $scope.login.captcha = '';
                $scope.login.showCaptcha = true;
                $scope.login.login_bott = { "margin-top": "12px" };
                window.localStorage.setItem('captchaTime', (new Date()).getTime());
            }
        } else { 
            console.log(res); 
            // 进入-注册-昵称填写
            $state.go('register.step4');
            $scope.login.loginUseId = res.Data.result.Id;  
        }
        });
    }  
    function loginCallback(res) {
        console.log("loginController------start");
        
        // return
        var count = window.localStorage.getItem('captchaCounter');
        var time = window.localStorage.getItem('captchaTime');
        window.localStorage.setItem('captchaCounter', count += 1);
        $scope.logining = false;
        if (res.Flag) {
            console.log(res)
            $state.go('login');
            $scope.login.password = '';
            $scope.login.errorMessage = langPack.getKey('loginError' + res.Code, true) || res.Message;
            $timeout(function () {
                $scope.login.errorMessage = '';
            }, 3000);
            //错误三次开启验证
            if (count.length >= 3) {
                console.log("count");
                $scope.showCaptchaFn($scope.login.captchaImg_items[0].id, (!$scope.login.showCaptcha ? true : false));
                $scope.login.captcha = '';
                $scope.login.showCaptcha = true;
                $scope.login.login_bott = { "margin-top": "12px" };
                window.localStorage.setItem('captchaTime', (new Date()).getTime());
            }
        } else {
            // alert("登录成功")
            window.localStorage.setItem('captchaCounter','');
            window.localStorage.getItem('captchaTime','');
            $timeout(function(){
                if(res.Data.loading){
                    $scope.login.stateStr = res.Data.msg;
                }else{
                    callCefMethod('frame/reset',{
                        id : 'main',
                        name : langPack.getKey('appName'),
                        width : 890,
                        height : 630,
                        contentPath : 'index.html', 
                        resizable : true,
                        isMain : true,
                        draggable : true,
                        minHeight:500,//窗口的最小高度
                        minWidth:800//窗口的最小宽度
                    },function(){});
                }
            })
        }
    }

    $scope.connect = function(){
        var phone = $scope.login.selectArea + $scope.login.phone;
        if($scope.login.phone && $scope.login.password && ($scope.login.showCaptcha ? $scope.login.captcha : true)){
            $scope.logining = true;
            $state.go('loging');
            var params = {
                mobile : phone,
                Type:'2',
                password : $scope.login.password,
                AutoLogin : $scope.login.autoLogin
            }
            $scope.login.showCaptcha ? params.ValidateCodeId = $scope.login.uuidtmp : null;
            $scope.login.showCaptcha ? params.ValidateCode = $scope.login.captcha : null;
            goLogin(params);
        }
    }
    $scope.$on('reconnect',function(){
        empService.init($scope.login.phone).then(function(){
            // strophe.login($scope.login.phone,$scope.login.password,function(){
                // $scope.logining = false;
            // });
        })
    })
    $scope.loginKeyDown = function(e){
        if(e.keyCode == util.KEYMAP.ENTER){
            if($scope.logining) return;
            if($scope.login.phone && $scope.login.password){
                $scope.connect();
                $scope.logining = true;
            }
        }
    }
    $scope.accountKeyDown = function(e){
        if(e.keyCode == util.KEYMAP.ENTER){
            if($scope.login.password){
                if($scope.logining) return;
                $scope.connect();
                $scope.logining = true;
            }else{
                $('#password').focus();
            }
        }
    }
    $scope.$on('chatSocketClose',function(){
        $timeout(function(){
            $scope.logining = false;
        })
    })
    $scope.switchType = function(){
        $scope.login.showPassword = !$scope.login.showPassword;
    }
    $scope.switchRemember = function(){
        $scope.login.remember = !$scope.login.remember;
    }
    
    $timeout(function(){
        $scope.ready = true;
        if($scope.login.phone){
            $('#password').focus();
        }else{
            $('#account').focus();
        }
    },200);
    $scope.$on('afterLogin',function(){
        $timeout(function(){
            $scope.ready = false;
        })
    })
    
    $scope.clearIpt = function(key){
        $scope.login[key] = '';
    }
    
    $scope.setAutoLogin = function(v){
        $scope.login.autoLogin = v;
        opening = false;
    }
    
    $scope.$watch('login.autoLogin',function(nv,ov){
        if(nv && !opening){
            opening = true;
            pops.open({
                scope : {
                    setAutoLogin : function(v){
                        $scope.setAutoLogin(v);
                        this.closeThisPop();
                    }
                },
                templateUrl : 'autoLoginTips.html',
                hideMask : true,
                className : 'radius10'
            })
        }
    })
    $scope.resetOpening = function(){
        opening = false;
    }
}])

controllers.controller('resetPwdController',['$scope','$state','$stateParams','webConfig','loginService','$interval','$timeout','langPack',function($scope,$state,$params,webConfig,loginService,$interval,$timeout,langPack){
    var MAX = 120;
    var bindBtn = false;
    $scope.resetPwd = {
        codeCount : 0,
        phone : $scope.login.phone,
        selectArea : util.getLs(webConfig.PHONE_PIX) || '+86',
        password : '',
        confirmPassword : '',
        showConfirmPassword : false,
        showPassword : false,
        smsCode : ''
    }
    $scope.clearIpt = function(key){
        $scope.resetPwd[key] = '';
    }
    $scope.switchType = function(tar){
        $scope.resetPwd[tar] = !$scope.resetPwd[tar];
    }
    $scope.data = {
        phone : $params.phone || '',
        smsCode : ''
    }
    $scope.goStep1 = function(){
        $state.go('resetPwd.step1');
    }
    $scope.goStep2 = function(){ 
        if($scope.resetPwd.phone){
            $timeout(function(){
                $scope.resetPwd.smsCode = '';
            });
            $state.go('resetPwd.step2');
        }
    }
    
    $scope.goStep3 = function(){
        if(!$scope.resetPwd.smsCode){
            $timeout(function(){
                $scope.login.errorMessage = langPack.getKey('blankSmsCode');
            })
            return;
        }
        loginService.checkSmsCode(1,$scope.resetPwd.selectArea + $scope.resetPwd.phone,$scope.resetPwd.smsCode,function(res){
            if(res.Data){
                if(res.Data.result){
                    $state.go('resetPwd.step3');
                }else{
                    $timeout(function(){
                        $scope.login.errorMessage = langPack.getKey('wrongSmsCode');
                    })
                }
            }else{
                $timeout(function(){
                    $scope.login.errorMessage = langPack.getKey('requestError');
                })
            }
        })
    }
    $scope.goStep4 = function(){ 

        if($scope.resetPwd.password != $scope.resetPwd.confirmPassword){
            $scope.login.errorMessage = langPack.getKey('diffPassword');
            return;
        }
        if($scope.resetPwd.password.length < 6 || $scope.resetPwd.password.length > 16){
            $scope.login.errorMessage = '密码长度为6-16位！';
            return;
        }
        if(!(/[0-9]/).test($scope.resetPwd.password) || !(/[a-z]/i).test($scope.resetPwd.password)){
            $scope.login.errorMessage = '密码必须包含数字和字母！';
            return;
        }
        if((/[\u4E00-\u9FA5\uF900-\uFA2D]|[\uFF00-\uFFEF]/).test($scope.resetPwd.password)){
            $scope.login.errorMessage = '密码不能有中文字符！(包括全角符号)';
            return;
        }
        loginService.changePassword($scope.resetPwd.selectArea + $scope.resetPwd.phone,$scope.resetPwd.password,$scope.resetPwd.confirmPassword,function(res){
            $state.go('resetPwd.step4');
        })
    }
    $scope.$on('$destroy',function(){
        console.log($scope.data)
    })
    
    $scope.getSmsCode = function(){
        if (bindBtn) {
            return;
        } else {
            bindBtn = true;
        }
        loginService.sendSmsCode(1,$scope.resetPwd.selectArea + $scope.resetPwd.phone,function(res){
            $timeout(function(){
                $scope.resetPwd.codeCount = MAX;
            })
            $interval(function(){
                $scope.resetPwd.codeCount --;
                bindBtn = false;
            }, 1000, MAX);
        })
    }
    $scope.goStep1();
}]);

controllers.controller('serviceLoginController',['$scope','$state','$stateParams','$timeout','pops','langPack',function($scope,$state,$params,$timeout,pops,langPack){
    $scope.service = {
        account : $params.account || '',
        password : $params.password || '',
        showPassword : false
    }
    $scope.clearIpt = function(key){
        $scope.service[key] = '';
    }
    $scope.switchType = function(){
        $scope.service.showPassword = !$scope.service.showPassword;
    }
    function goLogin(data){
        $scope.logining = true;
        $state.go('loging');
        callCefMethod('account/login',data,loginCallback);
    }
    function loginCallback(res){
        console.log("serviceLoginController------start");
        console.log(res);

        $scope.logining = false;
        if(res.Flag){
            // alert("serviceLogin___________________________")
            $state.go('serviceLogin.form',{
                account : $scope.service.account,
                password : $scope.service.password,
            });
            $scope.login.errorMessage = langPack.getKey('loginError'+res.Code,true) || res.Message;
            $timeout(function(){
                $scope.login.errorMessage = '';
            },3000);
            //加载验证码
            $scope.login.showCaptchaFn($scope.login.captchaImg_items[0].id, (!$scope.login.showCaptcha ? true : false));
            $scope.login.captcha = '';
            $scope.login.showCaptcha = true;
            $scope.login.login_bott = {"margin-top":"12px"};
            window.localStorage.setItem('captchaTime',(new Date()).getTime());
        }else{
            $timeout(function(){
                if(res.Data.loading){
                    $scope.login.stateStr = res.Data.msg;
                }else{
                    callCefMethod('frame/reset',{
                        id : 'main',
                        name : langPack.getKey('appName'),
                        width : 1080,
                        height : 680,
                        contentPath : 'index.html', 
                        resizable : true,
                        isMain : true
                    },function(){});
                }
            })
        }
    }
    
    $scope.connect = function(){
        // $scope.logining = true;
        // $state.go('loging');
        // var account = $scope.service.account;
        // goLogin({
        //     mobile : account,
        //     password : $scope.service.password
        // });

        if($scope.service.account && $scope.service.password && ($scope.login.showCaptcha ? $scope.login.captcha : true)){
            $scope.logining = true;
            $state.go('loging');
            var params = { 
                Type:'1',
                mobile : $scope.service.account,
                password : $scope.service.password
            }
            $scope.login.showCaptcha ? params.ValidateCodeId = $scope.login.uuidtmp : null;
            $scope.login.showCaptcha ? params.ValidateCode = $scope.login.captcha : null;
            goLogin(params);
        }
    }
    
    $scope.forgetPwd = function(){
        pops.open({
            templateUrl : 'serviceForgetPwd.html',
            hideMask : true,
            className : 'radius10'
        })
    }
    
    $scope.loginKeyDown = function(e){
        if(e.keyCode == util.KEYMAP.ENTER){
            if($scope.logining) return;
            if($scope.service.account && $scope.service.password){
                $scope.connect();
                $scope.logining = true;
            }
        }
    }
    $scope.accountKeyDown = function(e){
        if(e.keyCode == util.KEYMAP.ENTER){
            if($scope.service.password){
                if($scope.logining) return;
                $scope.connect();
                $scope.logining = true;
            }else{
                $('#password').focus();
            }
        }
    }
}]);

controllers.controller('registerController',['$scope','$state','$stateParams','webConfig','loginService','$interval','$timeout','langPack','pops',function($scope,$state,$params,webConfig,loginService,$interval,$timeout,langPack,pops){
    var MAX = 120;
    var bindBtn = false;
    $scope.register = {
        codeCount : 0,
        phone : '',
        selectArea : util.getLs(webConfig.PHONE_PIX) || '+86',
        password : '',
        confirmPassword : '',  
        showConfirmPassword : false,
        showPassword : false,
        smsCode : '',
        loginToken : '',
        InvitationCode:'',//邀请码
        showInvitationCode:false,//是否开启邀请码
        name:'',//昵称 
    }
    $scope.switchType = function(tar){
        $scope.register[tar] = !$scope.register[tar];
    }
    $scope.clearIpt = function(key){
        $scope.register[key] = '';
    }
    $scope.data = {
        phone : $params.phone || '',
        smsCode : ''
    }
    $scope.goStep1 = function(){
        $state.go('register.step1');
    }
    $scope.goStep2 = function(){  
        // 注册手机号码验证
        if(!$scope.register.phone){
            return;
        } 
        // 验证 是否有邀请码
        loginService.checkInvitationCode($scope.register.selectArea + $scope.register.phone,function(res){ 
            if(res.Data){
                $scope.register.showInvitationCode=true;
            }else{
                $scope.register.showInvitationCode=false;
            }
        });
        $timeout(function(){
            $scope.register.smsCode = '';
        }); 
        loginService.checkPhone($scope.register.selectArea + $scope.register.phone,function(res){
            if(res.Data){
                $state.go('register.step2');
            }else{
                $timeout(function(){
                    $scope.login.errorMessage = langPack.getKey('alreadyInUse');
                })
            }
        })
    }
    //  <!-- 注册作废-老流程 -->
    $scope.goStep3 = function(){
         // 注册 验证码
        if(!$scope.register.smsCode){
            $timeout(function(){
                $scope.login.errorMessage = langPack.getKey('blankSmsCode');
            })
            return;
        } 
        loginService.checkSmsCode(0,$scope.register.selectArea + $scope.register.phone,$scope.register.smsCode,function(res){ 
            if(res.Data){
                if(res.Code == 13){
                        $timeout(function(){
                            $scope.login.errorMessage = langPack.getKey('wrongSmsCode');
                        })
                }else{
                    if(res.Data.result){
                        $scope.register.loginToken = res.Data.result;
                        $state.go('register.step3');
                    }else{
                        $timeout(function(){
                            $scope.login.errorMessage = langPack.getKey('requestError');
                        })
                    }
                }
            }else{
                $timeout(function(){
                    $scope.login.errorMessage = langPack.getKey('requestError');
                })
            }
        })
    }
     //  <!-- 注册作废-老流程 -->
    $scope.goStep4 = function(){
        
        // 有邀请码-必填
        if($scope.register.showInvitationCode&&$scope.register.InvitationCode==''){
            return $timeout(function(){
                $scope.login.errorMessage = langPack.getKey('writeInvitationCode'); 
            });
        } 
        // 密码+确认密码必填
        if($scope.register.password !='' &&$scope.register.confirmPassword!='' ){
            if($scope.register.password != $scope.register.confirmPassword){
                $scope.login.errorMessage = langPack.getKey('diffPassword');
                return;
            }
        }else{
            $scope.login.errorMessage = '请填写密码';
            return;
        }
        
        // loginService.changePassword($scope.register.selectArea + $scope.register.phone,$scope.register.password,$scope.register.confirmPassword,function(res){
            $state.go('register.step4');
        // })
    }
    $scope.$on('$destroy',function(){
        console.log($scope.data)
    })
    
    $scope.getSmsCode = function(){
        if (bindBtn) {
            return;
        } else {
            bindBtn = true;
        }
        loginService.sendSmsCode(0,$scope.register.selectArea + $scope.register.phone,function(res){
            $timeout(function(){
                $scope.register.codeCount = MAX;
            })
            $interval(function(){
                $scope.register.codeCount --;
                bindBtn = false;
            }, 1000, MAX);
        })
    }
    $scope.skipStep3 = function(){
        $state.go('register.step4');
    }
    $scope.callLoginAfterRegister = function(){
        // 注册 并登录
        let type='0';  
        // $scope.loginAfterRegister($scope.register.selectArea + $scope.register.phone,$scope.register.loginToken,$scope.register.password,type,$scope.register.InvitationCode);
        $scope.loginAfterRegister($scope.login.loginUseId,type,$scope.register.name)
    }
    $scope.callAccountVerification= function(){
          // 注册 验证码
          if(!$scope.register.smsCode){
            $timeout(function(){
                $scope.login.errorMessage = langPack.getKey('blankSmsCode');
            })
            return;
        }
         // 有邀请码-必填
         if($scope.register.showInvitationCode&&$scope.register.InvitationCode==''){
            return $timeout(function(){
                $scope.login.errorMessage = langPack.getKey('writeInvitationCode'); 
            });
        } 
        // 密码+确认密码必填
        if($scope.register.password !='' &&$scope.register.confirmPassword!='' ){
            if($scope.register.password != $scope.register.confirmPassword){
                $scope.login.errorMessage = langPack.getKey('diffPassword');
                return;
            }
        }else{
            $scope.login.errorMessage = '请填写密码';
            return;
        }
          // 账号注册验证 
          let data={
                Type:'0',
                Mobile : $scope.register.selectArea + $scope.register.phone,
                Code : $scope.register.smsCode,
                Password : $scope.register.password,
                InvitationCode:$scope.register.InvitationCode
            };
            $scope.AccountVerification(data); 
    }
    $scope.goStep1();
}]);

controllers.controller('switchAccountController',['$scope','$state','$stateParams','webConfig','loginService','$interval','$timeout','frameService',function($scope,$state,$params,webConfig,loginService,$interval,$timeout,frameService){
    $scope.logined = {};
    frameService.getCurrentUser(function(data){
        if(data.Flag == 0){
            $scope.logined = data.Data.user;
        }
    })
    $scope.loginCurrentUser = function(){
        $scope.loginFn($scope.logined);
    }
    $scope.goLogin = function(){
        $scope.login.autoLogin = false;
        $state.go('login');
        $scope.resetOpening();
    }
}])

