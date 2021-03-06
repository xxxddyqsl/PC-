var controllers = angular.module('Controllers');
var changeTitleTimer;
// 18662589246 密码123456
13962511460
if(location.href.indexOf('debug') == -1){
    // if(console){
        // var old = console.log;
        // console.log = function(){}
    // }
}
function callCefMethod(nameSpace,methodName,data,callback){
    var _ns = window[nameSpace];
    var fn = _ns[methodName];
    var params = data ? JSON.stringify(data) : '';
    var callbackName = 'cef_callback_' + new Date().getTime();
    while(window[callbackName]){
        callbackName = 'cef_callback_' + new Date().getTime();
    }
    window[callbackName] = function(data){
        var res;
        try{
            res = callback(data);
            if(res === undefined){
                res = {
                    Flag : 0,
                    Message : 'callback invoked success'
                }
            }
        }catch(e){
            res = {
                Flag : 1,
                Message : 'callback invoked fail'
            }
        }
        res = JSON.stringify(res);
        window[callbackName] = undefined;
        return res;
    }
    if(params && callback){
        fn(params,callbackName);
    }else if(params && !callback){
        fn(params);
    }else if(!params && callback){
        fn(callbackName);
    }else{
        fn();
    }
}
controllers.controller('appController',['strophe','$scope','util','empService','chatService','pops','userConfig','$document','$rootScope','webConfig','$timeout','$state','concatService','socketConnect','$stateParams','langPack',function(strophe,$scope,util,empService,chatService,pops,userConfig,$doc,$rootScope,webConfig,$timeout,$state,concatService,socketConnect,stateParams,langPack){
    var info = socketConnect.info;
    $scope.userConfig = userConfig;
    $scope.show = false;
    $scope.loginAccount = info.userId;
    $scope.connectStatus = info.connectStatus;
    $scope.user = {};
    var chatListOnServer = [] , initedChatList = false;
    $scope.$on('afterLogin',function(ev,currentUser,status,phone){
        $scope.loginAccount = currentUser;
        $scope.connectStatus = status;
        $timeout(function(){
            $scope.user = webConfig.getUser();
        })
        var user = webConfig.getUser();
        user && empService.setRememberedPhone(user.phone);
        concatService.getConcatList().then(function(list){
            chatService.initRecentChat();
            initedChatList = true;
            initChatListFromServer(chatListOnServer);
        });
        window.onbeforeunload = function(e){
            e = e || window.event;
            e.returnValue = langPack.getKey('closeBrowser');
            return langPack.getKey('closeBrowser');
        }
        $state.go('chat',{concat: "", isGroup: false, selected: "", msgContent: "", needCreate: false},{
            reload : true
        })
    });
    $scope.$on('getCompanyDataSuccess',function(){
    })
    function initChatListFromServer(list){
        for(var i=0;i<list.length;i++){
            var chatId = list[i].recver;
            if(chatId != '0'){
                chatService.readChatMsg(chatId,true);
                empService.saveRecentEmp(chatId);
            }
        }
    }
    $scope.$on('afterLogout',function(){
        util.removeLs(webConfig.LOGIN_KEY);
        // empService.logoutUid($scope.loginAccount,function(){
            // $timeout(function(){
                $scope.loginAccount = '';
                $scope.connectStatus = '';
                window.onbeforeunload = null;
                location.href = location.href;
            // })
        // });
    });

    $scope.$on('loginInOther',function(){
        util.removeLs(webConfig.LOGIN_KEY);
        // empService.logoutUid($scope.loginAccount,function(){
            // $timeout(function(){
                $scope.loginAccount = '';
                $scope.connectStatus = '';
                window.onbeforeunload = null;
                location.href = location.href;
            // })
        // });
    });
    
    $scope.add = function(){
        // $scope.show = false;
        pops.open({
            templateUrl : 'empChooser.html',
            className : 'radius10',
            data : {
                selected:[],
                needCreate : true,
                title : langPack.getKey('startChat')
            },
            controller: "empChooserController"
        })
    }
    $scope.toggleNotice = function(e){
        userConfig.allowNotice = !userConfig.allowNotice;
    }
    $scope.toggleVoice = function(e){
        userConfig.allowVoice = !userConfig.allowVoice;
    }
    $scope.toggleSystemMenu = function(e){
        $scope.show = !$scope.show;
        $rootScope.$broadcast('document.click');
    }
    $scope.showDownLoad=function(url){
        pops.open({
            templateUrl : 'appDown.html',
            className : 'radius4',
            data : {
                url:url
            }
        })
    };
    $scope.$on('createRoomSuccess',function(ev,roomId,msg){
        var currentEmp = empService.getLoginEmp();
        // empService.saveRecentEmp(_roomId);
        var chat = chatService.initBlankTempChat(roomId,true,msg.servicetype  ? true : false);
        if(msg.servicetype) chat.isService = true;
        delete chat.needCreate;
        var needAysnGroup = concatService.getFirstLoginGroup();
        if(needAysnGroup[roomId]){
            socketConnect.transRoom(roomId,needAysnGroup[roomId].creator);
        }
        var callbacks = chatService.getCreateRoomCallBack(roomId);
        while(callbacks.length){
            callbacks.pop()(roomId);
        }
    });
    $scope.$on('transOwnerSuccess',function(ev,roomId,newOwner){
        var needAysnGroup = concatService.getFirstLoginGroup();
        concatService.markCreateSuccess(roomId);
    });
    $scope.$on('connecntChatServerFail',function(ev,roomId){
        $timeout(function(){
            alert('im服务器连接失败，请稍后重试');
        });
    });
    $scope.$on('connecntVerServerFail',function(ev,roomId){
        $timeout(function(){
            alert('认证服务器连接失败，请稍后重试');
        });
    });
    $scope.$on('chatSocketClose',function(ev,roomId){
        $timeout(function(){
            // alert('im服务器连接失败，请稍后重试');
        },1000);
    });
    $scope.$on('connectTimeout',function(ev,roomId){
        console.log('connectTimeout');
        util.removeLs(webConfig.LOGIN_KEY);
        $timeout(function(){
            util.log(langPack.getKey('chatServerTimeout'),'error');
            $scope.loginAccount = '';
            // location.href = location.href;
        });
    });
    $doc.bind('click',function(e){
        $scope.show = false;
        $rootScope.$broadcast('document.click',e);
    });
    var mouseDownTimer;
    var handleMouseDown = {
        input : 1,
        textarea : 1
    }
    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        if(handleMouseDown[tagName]){
        }else{
            mouseDownTimer = setTimeout(function(){
                callCefMethod('loginController','moveForm');
            },200);
        }
    });
    $doc.bind('mouseup',function(e){
        clearTimeout(mouseDownTimer);
    });
    $scope.updateOrganize = function(){
        $scope.show = false;
        empService.clearLocalStorage();
        // empService.init();
        var phone = util.getLs(webConfig.PHONE_PIX) + util.getLs(webConfig.IM_ACCOUNT);
        empService.getUserOrgs(phone).then(function(){
            // empService.getCompanys();
        })
    }
    $scope.clearFirstLogin = function(){
        chatService.clearFirstLogin();
    }
    
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
    if(!langPack.isSeted()){
        // $scope.langSetting();
    }
    var userId = util.getLs(webConfig.LOGIN_USER) , token = util.getLs(webConfig.LOGIN_KEY);
    var phone = util.getLs(webConfig.IM_ACCOUNT) , pix = util.getLs(webConfig.PHONE_PIX) || '+86';
    if(phone && token && userId){
        var mobileNo = pix + phone;
        webConfig.setToken(token);
        empService.queryUserData(mobileNo).then(function(res){
            var data = res.data;
            if(data.code == -1) return;
            data.userInfo.phone = phone;
            webConfig.setUser(data.userInfo);
            var userId = data.userInfo.SUserId;
            empService.getUserOrgs(mobileNo).then(function(){
                // empService.getCompanys();
                socketConnect.loginServer(userId,token,function(){
                });
            })
        })
        
    }
    $scope.$on('receiveBroadcastMsg',function(ev,broadcastMsg){
        var msg = angular.copy(broadcastMsg);
        msg.content = msg.s_CONTENTS.replace(/\n/g,'');
        msg.broadcasttitle = msg.s_TITLE.replace(/\n/g,'');
        // msg.content = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(msg.content));
        // msg.broadcasttitle = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(msg.broadcasttitle));
        $scope.showBroadcast(msg);
    })
    $scope.showBroadcast = function(msg){
        msg.content = util.hrefEncode(msg.s_CONTENTS);
        var templeName = msg.n_TYPE == '1' ? 'broadcast.html' : 'systemNotice.html';
        pops.append({
            templateUrl : templeName,
            scope : {
                msg : msg,
                openBroadcast : openBroadcast
            },
            className : 'radius4'
        });
        chatService.showDeskNotice('images/broadcast_notice_icon.png',msg.n_TYPE == '1' ? '广播消息' : '系统通知' ,msg.broadcasttitle);
    }
    $scope.openBroadcast = openBroadcast;
    function openBroadcast(msg){
        pops.open({
            templateUrl : 'broadcastDetail.html',
            scope : {
                msg : msg
            },
            className : 'radius4',
            controller: 'broadcastDetailController'
        })
    }
    window.showBroadcast = $scope.showBroadcast;
    window.openBroadcast = openBroadcast;
    $scope.$on('getChatListFromServer',function(ev,list){
        if(initedChatList){
            initChatListFromServer(list);
        }else{
            chatListOnServer = list;
        }
    });
    $state.go('login')
}])

controllers.controller('loginController',['$rootScope','strophe','$scope','pops','empService','chatService','$timeout','socketConnect','langPack','webConfig','ajaxService',function($rootScope,strophe,$scope,pops,empService,chatService,$timeout,socketConnect,langPack,webConfig,ajax){
    $scope.login = {
        remember : false,
        showPassword : false,
        phone : '',
        password : '',
        autoLogin : false,
        selectArea : util.getLs(webConfig.PHONE_PIX) || '+86'
    }
    $scope.logining = false;
    // $scope.selectArea = util.getLs(webConfig.PHONE_PIX) || '+86'
    $scope.connect = function(){
        //if($scope.logining) return;
        $scope.logining = true;
        var phone = $scope.login.selectArea + $scope.login.phone;
        // phone = encodeURIComponent(phone)
        callCefMethod('loginController','login',{
            mobileNo : phone,
            password : $scope.login.password
        },function(){
            $scope.logining = false;
            console.log(arguments);
        })
    }
    $scope.$on('reconnect',function(){
        empService.init($scope.login.phone).then(function(){
            // strophe.login($scope.login.phone,$scope.login.password,function(){
                // $scope.logining = false;
            // });
        })
    })
    $scope.loginKeyDown = function(e){
        if(e.keyCode == 13){
            if($scope.logining) return;
            if($scope.login.phone && $scope.login.password){
                $scope.connect();
                $scope.logining = true;
            }
            // 360浏览器弹出通知
            // if(Notification.permission === undefined && webkitNotifications.checkPermission && webkitNotifications.checkPermission() == 1){
                // Notification.requestPermission && Notification.requestPermission();
            // }
        }
    }
    $scope.accountKeyDown = function(e){
        if(e.keyCode == 13){
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
    $scope.showForgetWidget = function(){
        pops.open({
            templateUrl : 'forgetPassword.html',
            data : {
                users : [{
                    name : '沈磊',
                    phone : '13913112414',
                    weixin : 'shenlei2101024',
                    qq : '570124655'
                }]
            }
        })
    }
    $scope.$on('loginFail',function(){
        util.removeLs(webConfig.LOGIN_KEY);
        if(!$scope.logining) return;
        $scope.logining = false;
        alert(langPack.getKey('loginFail'));
    })
    $scope.$on('connecntVerServerFail',function(ev,roomId){
        $timeout(function(){
            $scope.logining = false;
        },5000);
    });
    
    $timeout(function(){
        $scope.ready = true;
        $('#account').focus();
        var phone = empService.getRememberedPhone() || '13962511460';
        $scope.login.phone = phone;
    },200);
    $scope.$on('afterLogin',function(){
        $timeout(function(){
            $scope.ready = false;
        })
    })
    
    $scope.clearIpt = function(key){
        $scope.login[key] = '';
    }
    
    var opening = false;
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
        // $scope.login.autoLogin = false;
    })
}])

controllers.controller('resetPwdController',['$scope','$state','$stateParams','webConfig',function($scope,$state,$params,webConfig){
    $scope.resetPwd = {
        phone : '',
        selectArea : util.getLs(webConfig.PHONE_PIX) || '+86',
        password : '',
        confirmPassword : '',
        showConfirmPassword : false,
        showPassword : false
    }
    $scope.clearIpt = function(key){
        $scope.resetPwd[key] = '';
    }
    $scope.data = {
        phone : $params.phone || '',
        smsCode : ''
    }
    $scope.goStep1 = function(){
        $state.go('resetPwd.step1');
    }
    $scope.goStep2 = function(){ 
        $state.go('resetPwd.step2');
    }
    $scope.goStep3 = function(){
        $state.go('resetPwd.step3');
    }
    $scope.goStep4 = function(){
        $state.go('resetPwd.step4');
    }
    $scope.$on('$destroy',function(){
        console.log($scope.data)
    })
    $scope.goStep1();
}]);

controllers.controller('serviceLoginController',['$scope','$state','$stateParams',function($scope,$state,$params){
    $scope.service = {
        phone : '',
        password : '',
        showPassword : false
    }
    $scope.clearIpt = function(key){
        $scope.service[key] = '';
    }
    $scope.switchType = function(){
        $scope.service.showPassword = !$scope.service.showPassword;
    }
    // $state.go('serviceLogin.form')
}]);

controllers.controller('registerController',['$scope','$state','$stateParams','webConfig',function($scope,$state,$params,webConfig){
    $scope.register = {
        phone : '',
        selectArea : util.getLs(webConfig.PHONE_PIX) || '+86',
        password : '',
        confirmPassword : '',
        showConfirmPassword : false,
        showPassword : false
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
        $state.go('register.step2');
    }
    $scope.goStep3 = function(){
        $state.go('register.step3');
    }
    $scope.goStep4 = function(){
        $state.go('register.step4');
    }
    $scope.$on('$destroy',function(){
        console.log($scope.data)
    })
    $scope.skipStep3 = function(){
        $state.go('register.step4');
    }
    $scope.goStep1();
}]);

controllers.controller('mainController',['strophe','$scope','empService','chatService','$state','$timeout','concatService','jQueryScrollbar','util','domain','$rootScope','webConfig','socketConnect','langPack',function(strophe,$scope,empService,chatService,$state,$timeout,concatService,jQueryScrollbar,util,domain,$rootScope,webConfig,socketConnect,langPack){
    $scope.totalUnreadNum = 0;
    $scope.keyword = '';
    $scope.loginOut = function(){
        // strophe.loginOut();
        socketConnect.logout();
    }
    
    $scope.searchResult = {
        friendsShow : true,
        deptsShow : true,
        concatsShow : true,
        groupsShow : true,
        friendTotal : 0,
        deptTotal : 0,
        concatTotal : 0,
        groupTotal : 0,
        
        friendPageSize : 5,
        deptPageSize : 10,
        concatPageSize : 5,
        groupPageSize : 5,
        friendPage : 1,
        deptPage : 1,
        concatPage : 1,
        groupPage : 1,
        
        searchFriends : [],
        searchDepts : [],
        searchConcats : [],
        searchGroups : [],
        
        friends : [],
        depts : [],
        concats : [],
        groups : [],
        searching : 1,
        index : -1
    }
    $scope.totalHeight = 0;
    var searchTimer;
    $scope.search = function(){
        // $rootScope.$broadcast('document.click');
        $rootScope.$broadcast('hiddenMenu');
        if(searchTimer){
            $timeout.cancel(searchTimer);
            searchTimer = undefined;
        }
        if($scope.searchResult.index != -1){
            var all = [];
            [].push.apply(all,$scope.searchResult.friends);
            [].push.apply(all,$scope.searchResult.concats);
            [].push.apply(all,$scope.searchResult.groups);
            [].push.apply(all,$scope.searchResult.depts);
            all[$scope.searchResult.index] && (all[$scope.searchResult.index].active = false);
        }
        searchTimer = $timeout(function(){
            if(!$scope.keyword) return;
            $('.top_search_result_scroll')[1] && ($('.top_search_result_scroll')[1].scrollTop = 0);
            $scope.searchResult.index = -1;
            $scope.searchResult.friendShow = true;
            $scope.searchResult.deptsShow = true;
            $scope.searchResult.concatsShow = true;
            $scope.searchResult.groupsShow = true;
            $scope.searchResult.searching = 2;
            // 初始化起始页码
            $scope.searchResult.friendPage = 1;
            $scope.searchResult.deptPage = 1;
            $scope.searchResult.concatPage = 1;
            $scope.searchResult.groupPage = 1;
            // 初始化所有查询结果数组
            $scope.searchResult.searchFriends.length = 0;
            $scope.searchResult.searchDepts.length = 0;
            $scope.searchResult.searchConcats.length = 0;
            $scope.searchResult.searchGroups.length = 0;    
            // 初始化已显示内容数组
            $scope.searchResult.friends.length = 0;
            $scope.searchResult.depts.length = 0;
            $scope.searchResult.concats.length = 0;
            $scope.searchResult.groups.length = 0;    
            
            var key = $scope.keyword;
            
            var depts = empService.searchDepts($scope.keyword);
            var concats = empService.searchEmp($scope.keyword);
            var concatSearchResult = concatService.searchConcats($scope.keyword);
            // 填充所有结果数组
            
            [].push.apply($scope.searchResult.searchDepts,depts);
            [].push.apply($scope.searchResult.searchConcats,concats);
            
            $scope.searchResult.deptTotal = parseInt((depts.length + $scope.searchResult.deptPageSize - 1) / $scope.searchResult.deptPageSize);
            $scope.searchResult.concatTotal = parseInt((concats.length + $scope.searchResult.concatPageSize - 1) / $scope.searchResult.concatPageSize);
            // 获取第一页部门
            var data = $scope.searchResult.searchDepts.slice(0,$scope.searchResult.deptPageSize);
            [].push.apply($scope.searchResult.depts,data);
            
            // 获取第一页联系人
            data = $scope.searchResult.searchConcats.slice(0,$scope.searchResult.concatPageSize);
            [].push.apply($scope.searchResult.concats,data);

            var isZhcn = /^[a-z]/;
            function isGroupMatch(chat){
                var py;
                var name = chat.name + (chat.tempName || '');
                name = name || '';
                // var reg = /^group_.*?_[\d.]+$/; 
                // if(!reg.test(name)){
                    // return -1;
                // }
                py = !isZhcn.test(key) ? name : util.getPinyin(name);
                if(py.indexOf(key) != -1){
                    return py.indexOf(key);
                }
                return -1;
            }
            concatSearchResult.then(function(result){
                var friends = result.friends;
                [].push.apply($scope.searchResult.searchFriends,friends);
                $scope.searchResult.friendTotal = parseInt((friends.length + $scope.searchResult.friendPageSize - 1) / $scope.searchResult.friendPageSize);
                // 获取第一页好友
                data = $scope.searchResult.searchFriends.slice(0,$scope.searchResult.friendPageSize);
                [].push.apply($scope.searchResult.friends,data);
                var inMap = {};
                // 将最近聊天也放进去
                var list = chatService.getChatList();
                var _glist = [];
                for(var i=0;i<list.length;i++){
                    if(!list[i].isGroup || list[i].isKicked) continue;
                    var r = isGroupMatch(list[i]);
                    if(r != -1){
                        _glist.push([r,{
                            groupId : list[i].id,
                            groupName : list[i].name || (list[i].tempName || ''),
                            lastChatTime : list[i].lastChatTime
                        }]);
                    }
                }
                _glist.sort(function(v1,v2){
                    return v1[1].lastChatTime >= v2[1].lastChatTime ? -1 : (v1[0] > v2[0] ? -1 : 1);
                });
                for(var i=0;i<_glist.length;i++){
                    inMap[_glist[i][1].groupId] = 1;
                    $scope.searchResult.searchGroups.push(_glist[i][1]);
                }
                for(var i=0;i<result.groups.length;i++){
                    var gid = result.groups[i].groupId;
                    if(!inMap[gid]){
                        $scope.searchResult.searchGroups.push({
                            groupId : result.groups[i].groupId,
                            groupName : result.groups[i].groupName,
                            groupCreator : result.groups[i].groupCreator,
                            members : result.groups[i].members
                        });
                    }
                }
                $scope.searchResult.groupTotal = parseInt(($scope.searchResult.searchGroups.length + $scope.searchResult.groupPageSize - 1) / $scope.searchResult.groupPageSize);
                data = $scope.searchResult.searchGroups.slice(0,$scope.searchResult.groupPageSize);
                [].push.apply($scope.searchResult.groups,data);
                $scope.searchResult.searching = 3;
                // jQueryScrollbar.updateScrollbars();
                $scope.onKeyDown();
            });
        },300);
    }
    
    $scope.loadMore = function(cate){
        if(cate == 'friends'){
            var from = $scope.searchResult.friendPage * $scope.searchResult.friendPageSize;
            $scope.searchResult.friendPage += 1;
            var to = $scope.searchResult.friendPage * $scope.searchResult.friendPageSize;
            var newPage = $scope.searchResult.searchFriends.slice(from,to);
            [].push.apply($scope.searchResult.friends,newPage);
        }
        if(cate == 'dept'){
            var from = $scope.searchResult.deptPage * $scope.searchResult.deptPageSize;
            $scope.searchResult.deptPage += 1;
            var to = $scope.searchResult.deptPage * $scope.searchResult.deptPageSize;
            var newPage = $scope.searchResult.searchDepts.slice(from,to);
            [].push.apply($scope.searchResult.depts,newPage);
        }
        if(cate == 'concat'){
            var from = $scope.searchResult.concatPage * $scope.searchResult.concatPageSize;
            $scope.searchResult.concatPage += 1;
            var to = $scope.searchResult.concatPage * $scope.searchResult.concatPageSize;
            var newPage = $scope.searchResult.searchConcats.slice(from,to);
            [].push.apply($scope.searchResult.concats,newPage);
        }
        if(cate == 'group'){
            var from = $scope.searchResult.groupPage * $scope.searchResult.groupPageSize;
            $scope.searchResult.groupPage += 1;
            var to = $scope.searchResult.groupPage * $scope.searchResult.groupPageSize;
            var newPage = $scope.searchResult.searchGroups.slice(from,to);
            [].push.apply($scope.searchResult.groups,newPage);
        }
    }
    $scope.getDeptStruct = function(dept){
        return empService.getDeptStruct(dept);
    }
    $scope.onKeyDown = function(e){
        var temp = $scope.searchResult.index;
        var all = [];
        [].push.apply(all,$scope.searchResult.friends);
        [].push.apply(all,$scope.searchResult.concats);
        [].push.apply(all,$scope.searchResult.groups);
        [].push.apply(all,$scope.searchResult.depts);
        all[temp] && (all[temp].active = false);
        var change = 0;
        if(e){
            if(e.keyCode == '38'){
                temp --;
                $scope.searchResult.index = Math.max(0,temp);
                if(temp == ($scope.searchResult.concats.length + $scope.searchResult.groups.length) || temp == $scope.searchResult.concats.length){
                    change = -101;
                }else{
                    change = -71;
                }
            }
            if(e.keyCode == '40'){
                temp ++;
                $scope.searchResult.index = Math.min(all.length - 1,temp);
                if(temp == ($scope.searchResult.concats.length + $scope.searchResult.groups.length) || temp == $scope.searchResult.concats.length){
                    change = 101;
                }else{
                    change = 71;
                }
            }
            if(e.keyCode == 13){
                var type , isGroup , id;
                var data = all[$scope.searchResult.index];
                if(!data) return;
                $scope.keyword = '';
                $scope.searchResult.searching = 1;
                if(data.groupId != undefined){ // 群组
                    $scope.chatWith(data.groupId,true);
                    return;
                }
                if(data.SUserId){
                    $scope.chatWith(data.SUserId,false);
                    return;
                }
                if(data.SDeptId){ // 部门
                    $scope.goDept(data);
                    return;
                }
            }
        }
        var active = $('.top_search_result_scroll').find('.active')[0];
        if(active){
            if(active.offsetTop > ($('.top_search_result').height() - 150 - (util.browser.chrome ? 17 : 0))){
                $('.top_search_result_scroll')[1].scrollTop =  $('.top_search_result_scroll')[1].scrollTop + change;
            }
        }
        all[$scope.searchResult.index] && (all[$scope.searchResult.index].active = true);
    }
    $scope.goDept = function(dept){
        $state.go('concat',{
            dept : dept.SDeptId
        })
        $scope.searchResult.searching = 1;
        $scope.keyword = '';
    }
    function totalHeight(){
        var dl = $scope.searchResult.depts.length;
        var gl = $scope.searchResult.groups.length;
        var cl = $scope.searchResult.concats.length;
       
        var deptHeight = $scope.searchResult.deptsShow ? (dl ? (dl * 71 +30)  : 0 ): 30;
        var groupHeight = $scope.searchResult.groupsShow ? (gl ? (gl * 71 +30)  : 0 ) : 30;
        var concatsHeight = $scope.searchResult.concatsShow ? (cl ? (cl * 71 +30)  : 0 ) : 30;
        return deptHeight+ groupHeight + concatsHeight;
    }
    $scope.getTempName = function(group){
        var tempName = [] , members = group.members;
        var _members = angular.copy(members);
        // _members.unshift({
            // memberJid : group.groupCreator
        // });
        var len = _members.length;
        var userId;
        for(var j=0;j<len;j++){
            userId = _members[j];
            emp = empService.getEmpInfo(userId);
            tempName.push(emp.SShowName || emp.SName);
        }
        return tempName.join(',');
    }
    $scope.toggleResult = function(cate){
        $scope.searchResult[cate + 'Show'] = !$scope.searchResult[cate + 'Show'];
        $scope.$emit('ngRepeatFinished');
    }
    var sendingMessage = {};
    $scope.$on('onSendMsg',function(ev,msg){
        sendingMessage[msg.messageid] = msg;
    })

    $scope.$on('receiveMsg',function(e,msgList){
        $timeout(function(){
            for(var i=0;i<msgList.length;i++){
                receiveMsgFn(msgList[i]);
            }
        })
    })
    var handleMsgType = {
       0 : 1,
       1 : 1,
       2 : 1,
       6 : 1,
       7 : 1,
       10:1
    }
    function receiveMsgFn(msg){
        var success = msg.retcode == 1 || msg.retcode == 14;
        var message = sendingMessage[msg.msgid];
        if(message){
            message.sendStatus = success ? webConfig.MSG_SENDSUCCESS : webConfig.MSG_SENDFAIL;
            if(success){
                delete sendingMessage[message.messageid];
            }
        }
        var source = msg.source;
        var toUser = msg.touser;
        var action = msg.action;
        var currentEmp = empService.getLoginEmp();
        // console.log(arguments)
        msg = chatService.socketMsgToFrontMsg(msg);
        // if(msg.msgObj && msg.msgObj.n_TYPE == 1){
            // $rootScope.$broadcast('receiveBroadcastMsg',msg.msgObj);
            // return;
        // }
        // 0：系统分享，1 ： 广播   2：服务号   3：语音会议 4：添加好友 5:公司邀请 6:置顶同步消息 7:消息撤回 8:离线文件接收回执)
        if(msg.msgObj && !handleMsgType[msg.msgObj.n_TYPE]){  // 3,4,5不做处理
            return;
        }
        if(msg.msgObj && handleMsgType[msg.msgObj.n_TYPE]){
            if(msg.msgObj.n_TYPE == 6){
                if(msg.msgObj.setTopType == 'addTop'){
                    $rootScope.$broadcast('setChatToTop',msg.msgObj.chatid);
                }else{
                    $rootScope.$broadcast('cancelChatToTop',msg.msgObj.chatid);
                }
                return;
            }
            if(msg.msgObj.n_TYPE == 7){
                $scope.$broadcast('withDrawMsg',msg.id,msg.msgObj);
                return;
            }
        }
        var toUserIsService = util.isService(toUser);
        empService.saveRecentEmp(msg.id,msg.isService || toUserIsService,msg.serviceid);
        if(msg.isGroup){
            if(!chatService.isExist(msg.id)){
                socketConnect.getGroupInfo(msg.id,true);
            }
        }
        if(action == 3){

        }else{
            chatService.addChat({
                serviceid : msg.serviceid,
                isService : msg.isService || toUserIsService,
                isGroup : msg.isGroup,
                msgData : msg,
                sender : msg.sender,
                id : msg.id
            })
        }
        // 当消息发送者是当前登陆用户时，不增加未读消息
        if(msg.sender && currentEmp){
            if(msg.sender.SUserId != currentEmp.SUserId){
                chatService.addUnReadNum(msg.id);
                if(!empService.isBlocked(msg.id)){
                    chatService.deskNotice(msg);
                    util.playAudio();
                    changeTitle(msg.id);
                }
            }
        }
    }
    function changeTitle(chatId){
        if(!empService.isBlocked(chatId)){
            if(changeTitleTimer) clearInterval(changeTitleTimer);
            var i=0;
            document.title = i % 2 == 0 ? '【'+langPack.getKey('newMessage')+'】- '+langPack.getKey('appName') : langPack.getKey('appNameWeb');
            changeTitleTimer = setInterval(function(){
                i++;
                document.title = i % 2 == 0 ? '【'+langPack.getKey('newMessage')+'】- '+langPack.getKey('appName') : langPack.getKey('appNameWeb');
            },700);
        }
    }
    $scope.$on('receiveRoomSubject',function(e,room,subject,roomInfo){
        $timeout(function(){
            var isExist = chatService.isExist(room);
            if(!isExist) return;
            chatService.modifyChatName(room,subject);
            concatService.updateCache(room,roomInfo);
        })
    })
    $scope.$on('roomSubjectChange',function(e,room,subject,roomInfo){
        $timeout(function(){
            chatService.modifyChatName(room,subject);
            concatService.updateCache(room,subject);
        })
    })
    $scope.$on('receiveRoomMembers',function(e,roomId,members){
        $timeout(function(){
            var isExist = chatService.isExist(roomId);
            if(!isExist) return;
            var chat = chatService.getChat(roomId);
            chatService.replaceMembers(roomId,members);
            concatService.updateCacheMembers(roomId,members);
        })
    })
    $scope.$on('transOwnerSuccess',function(ev,roomId,newOwner){
        var isExist = chatService.isExist(roomId);
        if(!isExist) return;
        var chat = chatService.getChat(roomId);
        var members = chat.members;
        for(var i=0;i<members.length;i++){
            members[i].isAdmin = false;
            if(members[i].SUserId == newOwner){
                members[i].isAdmin = true;
            }
        }
        chatService.replaceMembers(roomId,members);
        concatService.updateCacheMembers(roomId,members);
    });
    $scope.$on('noticeClick',function(ev,concatId,isGroup){
        if($scope.$state.current.name != 'chat'){
            $timeout(function(){
                $state.go('chat',{
                    concat : concatId,
                    isGroup : isGroup
                });
            })
        }
    })
    $scope.$on('roomSubjectChange',function(e,roomId,subject,editor){
        $timeout(function(){
            editor = empService.getEmpInfo(editor);
            chatService.addMsg({
                type : webConfig.MSG_SYSTEM_TYPE,
                content : (editor.SShowName || editor.SName) + langPack.getKey('changeGroupName') +'"'+util.htmlDecode(subject)+'"'
            },roomId);
            chatService.modifyChatName(roomId,subject);
        })
    })
    $scope.$on('empJoinRoom',function(e,roomId,emps,msg){
        $timeout(function(){
            // if(!chatService.isExist(roomId)) return;
            var chat = chatService.getChat(roomId);
            if(chat.isKicked){
                socketConnect.getGroupInfo(roomId,true);
            }
            chat.isKicked = false;
            if(msg.servicetype){
                chat.isService = true;
            }
            var groupAdminId = empService.getGroupAdmin(roomId);
            var names = [];
            var users = [];
            var members = chat.members , len = members.length;
            var isIn = false;
            var currentEmp = empService.getLoginEmp();
            var actor = empService.getEmpInfo(msg.actor);
            var currentEmpInEmps = false;
            var strangers = [];
            var strangerNames = [];
            for(var j=0;j<emps.length;j++){
                var emp = emps[j];
                var isStranger = !concatService.isFriend(emp.SUserId) && !empService.isColleague(emp.SUserId);
                if(isStranger){
                    strangers.push(emp.SUserId);
                    strangerNames.push(empService.getEmpName(emp,1));
                }
                if(emp.SUserId != currentEmp.SUserId && actor.SUserId != emp.SUserId){
                    names.push(empService.getEmpName(emp,1));
                    users.push(emp.SUserId);
                }
                if(emp.SUserId == currentEmp.SUserId){
                    currentEmpInEmps = true;
                }
                for(var i=0;i<len;i++){
                    if(members[i].SUserId == emp.SUserId){
                        isIn = true;
                    }
                }
                if(!isIn){
                    // console.log(emp);
                    members.push(emp);
                }
            }
            $rootScope.$broadcast('updateGroupAvatar' + roomId,roomId);
            if(currentEmpInEmps && currentEmp.SUserId != msg.actor) names.unshift('你');
            
            if(currentEmp.SUserId != msg.actor){
                var _content = '';
                _content = empService.getEmpName(actor,1) + langPack.getKey('invitedIntoGroup') + names.join('、') + langPack.getKey('invitedIntoGroupEnd');
                if(strangers.length){
                    _content += ' , ' + strangerNames.join('、') + langPack.getKey('privacyAttention');
                }
                chatService.addMsg({
                    type : webConfig.MSG_SYSTEM_TYPE,
                    actor : msg.actor,
                    users : users,
                    strangers : strangers,
                    hasCurrentUser : currentEmpInEmps,
                    content : _content
                },roomId); 
            }
            if(currentEmp.SUserId == msg.actor){
                chatService.addMsg({
                    type : webConfig.MSG_SYSTEM_TYPE,
                    actor : currentEmp.SUserId,
                    users : users,
                    strangers : strangers,
                    content : langPack.getKey('you') + langPack.getKey('invitedIntoGroup') + names.join('、') + langPack.getKey('invitedIntoGroupEnd')
                },roomId); 
            }
        })
    })
    // 获取我邀请的人
    var mineInviteEmps = {};
    $scope.$on('createTempRoom',function(ev,selected,roomId){
        if(!mineInviteEmps[roomId]){
            mineInviteEmps[roomId] = {};
        }
        var account ;
        for(var i=0;i<selected.length;i++){
            account = selected[i].SUserId;
            mineInviteEmps[roomId][account] = 1;
        }
    });
    function resetChatTempName(chatId){
        var chat = chatService.getChat(chatId);
        if(chat.isGroup){
            for(var i=0;i<$scope.chatList.length;i++){
                if($scope.chatList[i].id == chatId){
                    $scope.chatList[i].tempName = chat.tempName;
                }
            }
        }
    }

    $scope.$on('empKicked',function(e,roomId,emps){
        var currentEmp = webConfig.getUser();
        var groupAdminId = empService.getGroupAdmin(roomId);
        $timeout(function(){
            var chat = chatService.getChat(roomId);
            if(chat){
                var isIn = false , members = chat.members , len = members.length;
                var len1 = emps.length , names = [];
                for(var i=len-1;i>=0;i--){
                    for(var j=0;j<len1;j++){
                        var emp = emps[j];
                        if(members[i].SUserId == emp.SUserId){
                            members.splice(i,1);
                            if(emp.SUserId == currentEmp.SUserId){
                                names.push(langPack.getKey('you'));
                            }else{
                                names.push(empService.getEmpName(emp,1));
                            }
                        }
                    }
                }
                if(names.length){
                    var content = '';
                    if(groupAdminId == currentEmp.SUserId){
                        content = langPack.getKey('removedMemberAdminStart') + names.join('、') + langPack.getKey('removedMemberAdminEnd');
                    }else{
                        content = names.join('、') + langPack.getKey('removedMember');
                    }
                    chatService.addMsg({
                        type : webConfig.MSG_SYSTEM_TYPE,
                        content : content
                    },roomId);
                    chatService.modifyChatName(roomId);
                    $scope.totalUnreadNum = chatService.getTotalUnreadNum();
                    $rootScope.$broadcast('updateGroupAvatar' + roomId,roomId);
                }
            }else{
                chatService.initBlankChat(roomId,true);
                // socketConnect.getGroupInfo(roomId);
                // strophe.getRoomSubject(roomId);
                // strophe.getRoomMembers(roomId);
            }
        })
    })
    
    $scope.$on('empLeave',function(e,roomId,emp){
        var chat = chatService.getChat(roomId);
        if(chat){
            var isIn = false , members = chat.members , len = members.length;
            for(var i=len-1;i>=0;i--){
                if(members[i].SUserId == emp[0].SUserId){
                    chatService.addMsg({
                        type : webConfig.MSG_SYSTEM_TYPE,
                        content : empService.getEmpName(emp[0],1) + langPack.getKey('leftGroup')
                    },roomId);
                    members.splice(i,1);
                }
                chatService.modifyChatName(roomId);
            }
            $rootScope.$broadcast('updateGroupAvatar' + roomId,roomId);
            // $scope.totalUnreadNum = chatService.getTotalUnreadNum();
        }else{
            chatService.initBlankChat(roomId,true);
            // socketConnect.getGroupInfo(roomId);
            // strophe.getRoomSubject(roomId);
            // strophe.getRoomMembers(roomId);
        }
    })
    $scope.$on('refreshNum',function(ev,num){
        $scope.totalUnreadNum = num;
    })
    $scope.$on('ngRepeatFinished',function(ev){
        $timeout(function(){
            // jQueryScrollbar.updateScrollbars();
        })
    })
    $scope.$on('document.click',function(){
        $timeout(function(){
            $scope.searchResult.searching = 1;
        })
    });
    
    $scope.chatWith = function(id,isGroup){
        // console.log('go chat!!! id : %s' , id)
        $timeout(function(){
            $scope.keyword = '';
            $scope.searchResult.searching = 1;
            // $('#msg_edit_area').focus();
            if(chatService.isExist(id)){
                var chat = chatService.getChat(id);
                chat.lastChatTime = util.getTime(1);
            }
            if($state.current.name === 'chat'){
                $rootScope.$broadcast('chatWith',id,isGroup,util.getTime(1));
            }else{
                var chat = chatService.getChat(id);
                var options = {
                    concat : id,
                    isGroup : isGroup
                }
                if(isGroup){
                    options.needCreate = chat.needCreate;
                }else{
                    options.needCreate = false;
                }
                $state.go('chat',options,{
                    reload : true
                })
            }
        })
    }
    $scope.$on('empNotInRoom',function(ev,groupId){
        var chatList = chatService.getChatList();
        for(var i=chatList.length - 1;i>=0;i--){
            if(chatList[i].id == groupId){
                chatList.splice(i,1);
            }
        }
    })
    $scope.getGroupInfo = function(chat){
        if(chat.isGroup){
            if(!chat.needCreate){
                socketConnect.getGroupInfo(chat.id);
            }
        }
    }
    $scope.$on('setChatToTop',function(ev,chatId){
        chatService.setChatTop(chatId);
        // socketConnect.sendSetTopMsg(chatId,1);
        $timeout(function(){
            $scope.serviceChatList = chatService.getServiceChatList();
            $scope.norChatList = chatService.getNorChatList();
        })
    })
    
    $scope.$on('cancelChatToTop',function(ev,chatId){
        chatService.cancelChatTop(chatId);
        // socketConnect.sendSetTopMsg(chatId,0);
        $timeout(function(){
            $scope.serviceChatList = chatService.getServiceChatList();
            $scope.norChatList = chatService.getNorChatList();
        })
    })
    $scope.$on('roomNotFound',function(ev,roomId){
        // var firstLogin = localStorage.getItem('firstLogin');
        // if(firstLogin >= 2){
        var currentEmp = empService.getLoginEmp();
        chatService.removeChat(roomId);
        empService.removeRecent(currentEmp.SUserId,roomId);
        concatService.delMsgTop(roomId+domain.room);
        concatService.delGroup(roomId+domain.room);
        // }
    });

    
    $scope.$on('deleteChat',function(ev,chatId){
        $timeout(function(){
            var chat = chatService.getChat(chatId);
            var unread = chat.unread;
            $scope.totalUnreadNum = Math.max(0,$scope.totalUnreadNum - unread);
        });
    })
    
    $scope.$on('receiveVoiceMetting',function(ev,msg){
        var sender = empService.getEmpInfo(msg.sedner);
        var receive = empService.getEmpInfo(msg.recver);
        var currentEmp = empService.getLoginEmp();
        var content = '';
        var chatId = msg.groupid || sender.SUserId;
        if(sender.SUserId == currentEmp.SUserId){
            content = langPack.getKey('you') + langPack.getKey('invitedIntoGroup') + empService.getEmpName(receive,1) + langPack.getKey('invitedIntoMetting');
        }else{
            content = langPack.getKey('invitedIntoGroup') + langPack.getKey('you') + langPack.getKey('invitedIntoMetting');
            chatService.addUnReadNum(chatId);
        }
        var msgData = {
            messageid : msg.msgid,
            type : webConfig.MSG_TEXT_TYPE,
            sender : sender,
            selfDate : msg.timestamp,
            date : msg.timestamp,
            content : content,
            encodeContent : content,
            readStatus : webConfig.MSG_UNREAD
        }
        chatService.addChat({
            isService : false,
            isGroup : msg.groupid ? true : false,
            msgData : msgData,
            sender : currentEmp,
            id : chatId,
            needCreate : false
        });
        empService.saveRecentEmp(chatId);
    })
    
    $scope.$on('shutUpAction',function(ev,groupId,userId,time,action){
        var timeMinute = parseInt(time / 60);
        var currentEmp = empService.getLoginEmp();
        var user = empService.getEmpInfo(userId);
        var name = currentEmp.SUserId == user.SUserId ? langPack.getKey('you') : empService.getEmpName(user);
        if(action == 1){
            if(timeMinute > 24 * 60){
                chatService.addMsg({
                    type : webConfig.MSG_SYSTEM_TYPE,
                    isShutUpWarn : true,
                    action : action,
                    target : userId,
                    content : name + langPack.getKey('shutUpForever')
                },groupId);
            }else{
                chatService.addMsg({
                    type : webConfig.MSG_SYSTEM_TYPE,
                    action : action,
                    isShutUpWarn : true,
                    target : userId,
                    content : name + langPack.getKey('shutUpAction') + timeMinute + ' ' + langPack.getKey('minutes')
                },groupId);
            }
        }else{
            chatService.addMsg({
                type : webConfig.MSG_SYSTEM_TYPE,
                isShutUpWarn : true,
                action : action,
                target : userId,
                content : name + langPack.getKey('cancelShutUp')
            },groupId);
        }
    })
    
    socketConnect.markReady();
    
    $scope.$on('signMsgReaded',function(ev,chatId){
        $timeout(function(){
            // TODO !!!! 标记已读
            // var chatId = Strophe.getNodeFromJid(markRead.chatJID.__TEXT__);
            if(chatService.isExist(chatId)){
                chatService.readChatMsg(chatId);
            }
        })
    });
}]);

controllers.controller('chatController',['$stateParams','strophe','$scope','empService','chatService','domain','util','$timeout','pops','concatService','webConfig','previewService','servers','$rootScope','$compile','langPack','socketConnect','ajaxService',function($params,strophe,$scope,empService,chatService,domain,util,$timeout,pops,concatService,webConfig,preview,servers,$rootScope,$compile,langPack,socketConnect,ajaxService){   
    var editArea = $('#msg_edit_area')[0];
    // console.log($params)
    var parent = editArea.parentNode;
    var posHelper = document.getElementById('caretPosHelper');
    
    var loginUser = webConfig.getUser();
    $scope.chatList = chatService.getChatList();
    $scope.serviceChatList = chatService.getServiceChatList();
    $scope.norChatList = chatService.getNorChatList();
    $scope.isGroup = $params.isGroup;
    $scope.concatId = $params.concat;
    $scope.currentMsgList = [];
    $scope.showing = $params.target || 'nor';
    var _isGroup;
    _isGroup = $params.isGroup;
    var selected = $params.selected , roomId = $params.concat;
    var needCreate = $params.needCreate;
    
    var editSelection , editRange;

    function setSelection(){
        if(document.getSelection){
            editSelection = window.getSelection();
            editRange = editSelection.getRangeAt(0);
        }else{
            editRange = document.selection.createRange();
        }
    }
    function selectRange() {
        editRange ? window.getSelection ? (editSelection.removeAllRanges(), editSelection.addRange(editRange),editRange.collapse(false)) : editRange.select() : editAreaFocus();
    }
    function editAreaFocus() {
        var e, t;
        if(document.createRange){
            e = document.createRange();
            e.selectNodeContents(editArea);
            e.collapse(false);
            t = window.getSelection();
            t.removeAllRanges();
            t.addRange(e);
        }else{
            document.selection && (e = document.body.createTextRange(), e.moveToElementText(editArea), e.collapse(false), e.select());
        }
    }
    if($scope.concatId){
        $timeout(function(){
            $('#msg_edit_area').focus();
            editAreaFocus();
        },20);
    }

    
    if($params.concat){
        var broadChatReg = /^b_.+/;
        $scope.notBroadChat = !broadChatReg.test($params.concat);
        if($params.needCreate && $params.isGroup){
            var _selected = $params.selected;
            var currentEmp = empService.getLoginEmp();
            var chat = chatService.initBlankTempChat(roomId,true);
            chat.members.length = 0;
            chat.needCreate = true;
            chat.lastChatTime = util.getTime(1);
            [].push.apply(chat.members,_selected);
            var users = [];
            var tempName = [];
            var names = [];
            for(var i=0;i<_selected.length;i++){
                _selected[i].SShowName && tempName.push(_selected[i].SShowName);
                names.push('"'+_selected[i].SShowName+'"')
                socketConnect.checkEmpStatus(_selected[i].SUserId);
                users.push(_selected[i].SUserId);
            }
            chat.tempName = tempName.join(',');
            var tLen = tempName.length;
            for(var i=tLen - 1;i>=0;i--){
                if(tempName[i] == currentEmp.SShowName){
                    tempName.splice(i,1);
                }
            }
            chatService.addMsg({
                type : webConfig.MSG_SYSTEM_TYPE,
                actor : currentEmp.SUserId,
                users : users,
                content : langPack.getKey('you') + langPack.getKey('invitedIntoGroup') + names.join('、') + langPack.getKey('invitedIntoGroupEnd')
            },roomId);
            $scope.concat = chatService.getChat($params.concat);
            $scope.currentMsgList = chatService.getMsgList($scope.concatId);
        }else{
            var chat = chatService.getChat($params.concat);
            chat.lastChatTime = util.getTime(1);
            chatService.readChatMsg($scope.concatId);
            if($scope.isGroup){
                socketConnect.getGroupInfo($scope.concatId,true);
                resetChatTempName($scope.concatId);
                $scope.concat = chat;
                var members = chat.members;
                for(var i=0;i<members.length;i++){
                    if(empService.getEmpStatus(members[i].SUserId) === undefined){
                        socketConnect.checkEmpStatus(members[i].SUserId);
                    }
                }
                socketConnect.getShutUpUsers($scope.concatId);
            }else{
                $scope.concat = empService.getEmpInfo($params.concat,'SUserId',function(emp){
                    for(var p in emp){
                        $scope.concat[p]  = emp[p]
                    }
                });
                // console.log($scope.concat)
            }
            $scope.currentMsgList = chatService.getMsgList($scope.concatId);
        }
        $scope.serviceChatList = chatService.getServiceChatList();
        $scope.norChatList = chatService.getNorChatList();
    }

    var area;
    $scope.msg = {
        msgContent : $params.msgContent || (editArea.innerHTML = '')
        // msgList : chatService.getMsgList()
    }
    var createRoomCallBack = {};
    function sendMsg(message,_to,members){
        $('#insert_helper').remove();
        var scope = {};
        scope.isGroup = _to ? true : $scope.isGroup;
        scope.concatId = _to ? _to : $scope.concatId;
        scope.concat = $scope.concat;
        if(scope.isGroup){
            var currentUser = webConfig.getUser();
            var currentUserId = currentUser.SUserId; 
            var shutUpStatus = socketConnect.checkShutUpStatus(scope.concatId,currentUserId);
            if(shutUpStatus){
                chatService.addMsg({
                    type : webConfig.MSG_SYSTEM_TYPE,
                    isShutUpWarn : true,
                    content : langPack.getKey('you') + langPack.getKey('shutUpWarn')
                },scope.concatId);
                return;
            }
        }
        var res = chatService.sendMessage(scope,message,_to,members || selected,function(){
            $timeout(function(){
                // message.sendStatus = webConfig.MSG_SENDSUCCESS;
                !_to && editArea.focus();
            },1000)
        });
        if(res === false){
            alert('消息过长，请删除部分内容后重试。');
            return;
        }
        $timeout(function(){
            if(message.sendStatus == webConfig.MSG_SENDING){
                message.sendStatus = webConfig.MSG_SENDFAIL;
            }
        },10000)
        if(!_to){
            atEmpContainer = undefined;
            atPos = undefined;
        }
        $scope.msg.msgContent = '';
        $timeout(function(){
            $scope.serviceChatList = chatService.getServiceChatList();
            $scope.norChatList = chatService.getNorChatList();
        })
    }
    // function sendMsg(message,_to){
        // if(!_to){
            // chatService.addChat({
                // isGroup : $scope.isGroup,
                // msgData : message,
                // sender : $scope.isGroup ? {} : $scope.concat,
                // id : $scope.concatId
            // });
            // var chat = chatService.getChat($scope.concatId);
            // if(chat.needCreate){
                // $scope.msg.msgContent = '';
                // var _selected = $params.selected;
                // createRoomCallBack[$scope.concatId] = createRoomCallBack[$scope.concatId] || [];
                // socketConnect.createRoom(roomId,_selected);
                // createRoomCallBack[$scope.concatId].push(function(){
                    // sendMsg(message);
                // });
                // return;
            // }
            // atEmpContainer = undefined;
            // atPos = undefined;
        // }
        // if(message.type == webConfig.MSG_TEXT_TYPE && (!message.content || message.content == '<br>')) return;
        // var to = _to || $scope.concatId;
        // var reg = /^group_.*?_[\d.]+$/; // 二次确认根据$scope.concatId判断是否为群
        // if(reg.test(to)){
            // _to == $scope.concatId && ($scope.isGroup = true);
        // }else{
            // _to == $scope.concatId && ($scope.isGroup = false);
        // }
        
        // socketConnect.sendMessage(message);
        // $timeout(function(){
            // if(message.sendStatus == webConfig.MSG_SENDING){
                // message.sendStatus = webConfig.MSG_SENDFAIL;
            // }
            // !_to && editArea.focus();
        // },10000);
        // if(!_to){
            // chatService.deleteMsgTemp($scope.concatId);
            // empService.saveRecentEmp($scope.concatId);
            // $scope.currentMsgList = chatService.getMsgList($scope.concatId);
            // $scope.msg.msgContent = '';
        // }
        // $rootScope.$broadcast('onSendMsg',message);
    // }
    
    $scope.resendMsg = function(msg){
        msg.sendStatus = webConfig.MSG_SENDING;
        sendMsg(msg);
    }
    
    var msgWraper = $('.chat_content_msglist')[0];
    
    $scope.$watch('concatId', function(e) {
        setTimeout(function() {
            msgWraper.scrollTop = 999999;
        }, 10)
    });
    
    $scope.sendTextMsg = function(){
        var reg = /^\s+$/;
        if(reg.test($scope.msg.msgContent)){
            return;
        }
        var tempSpan = $('#temp_span');
        // console.log(tempSpan.size());
        tempSpan.remove();
        $scope.msg.msgContent = editArea.innerHTML;
        var reg1 = /^\s+|\s+$/g;
        // var content = $scope.msg.msgContent.replace(reg1,'');
        var content = $scope.msg.msgContent;
        var isOneBr = /^<br\s*\/*>$/;
        var preEnd = /<\/pre>$/;
        content = content.replace(preEnd,'');
        // console.log(content)
        if(content != '' && !isOneBr.test(content)){
            var message = chatService.createMessage($scope.concatId , webConfig.MSG_TEXT_TYPE , content);
            if(Object.prototype.toString.call(message) == '[object Array]'){
                for(var i=0;i<message.length;i++){
                    (function(idx){
                        setTimeout(function(){
                            sendMsg(message[idx]);
                        },idx * 100)
                    })(i);
                }
            }else{
                sendMsg(message);
            }
        }
    }
    function insertHtmlAtCaret(html,resetRange) {
        // selectRange();
        // !resetRange && selectRange();
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = editSelection || window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = editRange || sel.getRangeAt(0);
                range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
            // Preserve the selection
                if (lastNode) {
                    // range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.setEndAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }
    $scope.editAreaClick = function(e){
        setSelection();
        seeAtMsg = false;
        atEmpContainer = undefined;
    }
    $scope.editAreaInput = function(){
        seeAtMsg = false;
        collapseRange();
    }
    var posHelperOffset = {};
    function resetPosHelper(){
        if(window.getSelection){
            var range = window.getSelection().getRangeAt(0).cloneRange();
            range.insertNode(posHelper);
            posHelperOffset.left = posHelper.offsetLeft;
            posHelperOffset.top = posHelper.offsetTop - editArea.scrollTop;
            parent.appendChild(posHelper);
        }
    }
    function collapseRange(){
        if(window.getSelection){
            setSelection();
            setTimeout(function(){
                if(editRange.endContainer.nodeType != 3){
                    editRange.collapse(false);
                }
            },20);
        }
    }
    $scope.keyDownSend = function(e){
        if($scope.atEmpScope && $scope.atEmpScope.result.length && (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13)){
            e.preventDefault();
            if(e.keyCode == 13){
                if($scope.atEmpScope.index == -1) return;
                var _keyword = util.replaceMetaStr($scope.atEmp.keyword);
                var reg = new RegExp('@'+_keyword,'g');
                var child = editArea.childNodes;
                var totalLen = 0;
                for(var i=0;i<child.length;i++){
                    if(child[i].nodeType == 3){
                        if(atContainer == child[i]){
                            break;
                        }
                        totalLen += (child[i].whileContent || child[i]).length;
                    }
                }
                if(atContainer.textContent == '@' + $scope.atEmp.keyword || atContainer.textContent == '＠' + $scope.atEmp.keyword){
                    atContainer.textContent = '';
                }else{
                    atContainer.textContent = atContainer.textContent.replace(reg,function(v,pos){
                        if(pos + totalLen == atPos - 1) return'';
                        return v;
                    })
                    var _keyword = util.replaceMetaStr($scope.atEmp.keyword);
                    atContainer.textContent = atContainer.textContent.replace(new RegExp('＠'+_keyword,'g'),function(v,pos){
                        if(pos + totalLen == atPos - 1) return'';
                        return v;
                    })
                }
                
                if(atContainer){
                    editRange.setStartAfter(atContainer);
                    editRange.setEndAfter(atContainer);
                    editSelection.removeAllRanges();
                    editSelection.addRange(editRange);
                }
                $scope.atEmpScope.keydown(e);
                $scope.atEmpScope = undefined;
            }else{
                $scope.atEmpScope.keydown(e);
            }
            return;
        }

        area = area || document.getElementById('msg_edit_area');
        
        if(e.keyCode == 13){
            $scope.msg.msgContent = area.innerHTML;
            e.preventDefault();
            if(e.ctrlKey){
                var br = '<br />'
                if (!util.browser.msie && window.getSelection) {
                    var next = window.getSelection().focusNode.nextSibling;
                    do
                        if (!next || next.nodeValue || "BR" == next.tagName)
                            break;
                    while (next = next.nextSibling);
                    next || (util.browser.chrome && (br += br));
                }
                setSelection();
                var oldScrollHeight = area.scrollHeight;
                insertHtmlAtCaret(br,true);
                var helper = document.getElementById('insert_helper');
                if(helper){
                    helper.parentNode.removeChild(helper);
                }
                insertHtmlAtCaret('<span id="insert_helper" style="position:absolute;"></span>',true);
                $scope.msg.msgContent = area.innerHTML;
                var areaHeight = area.clientHeight;
                setTimeout(function(){
                    var helper = document.getElementById('insert_helper');
                    if(helper){
                        var addHeight = area.scrollHeight - oldScrollHeight;
                        if(area.scrollHeight > helper.offsetTop + 140){
                            if(helper.offsetTop - area.scrollTop >= areaHeight){
                                area.scrollTop = addHeight + helper.offsetTop  - areaHeight;
                            }
                        }else{
                            area.scrollTop = helper.offsetTop;
                        }
                        helper.parentNode.removeChild(helper);
                    }
                },0);
            }else{
                $scope.sendTextMsg();
                e.preventDefault();
                e.stopPropagation();
            }
        }
        if(e.keyCode == 83 && e.altKey){
            e.preventDefault();
            e.stopPropagation();
            $scope.sendTextMsg();
        }
    }
    
    var atEmpContainer;
    var atPos , atContainer;
    $scope.atEmp = {
        keyword : ''
    }
    var getLastestInput = function(){
        var selection = window.getSelection();
        range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        range.setStart(editArea,0);
        var str = range.toString();
        return str.slice(-1);
    }
    $scope.keyUp = function(e){
        if(e.keyCode == '50' && (getLastestInput() == '@' || getLastestInput() == '＠')){
            if($scope.isGroup){
                var selection = window.getSelection();
                var range;
                if(selection.rangeCount > 0){
                    range = selection.getRangeAt(0).cloneRange();
                    atContainer = range.startContainer
                    range.collapse(true);
                    range.setStart(editArea,0);
                    var str = range.toString();
                    atPos = str.length;
                    resetPosHelper();
                }
                $scope.atEmp.keyword = '';
                initAtEmp();
            }
            return;
        }else{
            if(e.keyCode >= 37 && e.keyCode <= 40){
                setSelection();
            }
        // console.log(e.keyCode)
            $timeout(function(){
                if(atPos !== undefined){
                    var selection = window.getSelection();
                    if(selection.rangeCount >0){
                        var range = selection.getRangeAt(0).cloneRange();
                        range.collapse(true);
                        range.setStart(editArea,0);
                        var str = range.toString();
                        var len = str.length;
                        if(len < atPos){
                            $scope.atEmpScope && $scope.atEmpScope.closeThisPop();
                            atEmpContainer = undefined;
                            return;
                        }else{
                            !$scope.atEmpScope && initAtEmp();
                        }
                        var keyword = str.substr(atPos,len);
                        $scope.atEmp.keyword = keyword;
                        if(atEmpContainer){
                            atEmpContainer.css(posHelperOffset)
                        }
                    }
                }
            },50);
        }
        // $scope.rememberRange();
    }
    $scope.rememberRange = function(){
        setSelection();
    }
    function initAtEmp(){
        // console.log('initAtEmp')
        if(atEmpContainer){
            atEmpContainer.css(posHelperOffset);
            atEmpContainer.show();
            return;
        }
        var containerId = pops.openDialog({
            scope : {
                inertHtmlToEditArea : $scope.inertHtmlToEditArea
            },
            data : {
                members : angular.copy($scope.concat.members),
                parentScope : $scope
            },
            templateUrl : 'at_emp.html',
            container : $('#edit_area_warper'),
            controller : 'atEmpController',
            isDialog : true,
            left : posHelperOffset.left,
            top : posHelperOffset.top
        })
        atEmpContainer = $('#'+containerId);
    }
    $scope.$on('atEmpControllerDestroy',function(){
        atEmpContainer = undefined;
        atPos = undefined;
        atContainer = undefined;
        delete $scope.atEmpScope;
    })
    $scope.checkAtMsg = function(chatId){
        var atMsg = chatService.hasAtMsg(chatId);
        if(atMsg){
            return atMsg.show;
        }
        return false;
    }
    $scope.createAtTip = function(){
        var msgList = chatService.getMsgList($scope.concatId);
        var atmsg = chatService.hasAtMsg($scope.concatId);
        for(var i=0;i<msgList.length;i++){
            if(msgList[i].messageid == atmsg.messageid){
                return empService.getEmpName(msgList[i].sender) + langPack.getKey('atedby');
            }
        }
    }
    
    var seeAtMsg = false;
    $scope.goMsg = function(){
        var atmsg = chatService.hasAtMsg($scope.concatId);
        var messageId = atmsg.messageid;
        var message = chatService.getMessage(messageId);
        var offsetTop = message._offsetTop;
        $('.chat_content_msglist').scrollTop(offsetTop - 10);
        chatService.delAtMsg($scope.concatId);
        seeAtMsg =  true;
        setTimeout(function(){
            seeAtMsg = false;
        },30000);
    }
    $scope.delAtTip = function(){
        chatService.delAtMsg($scope.concatId);
    }
    $scope.checkClickedAtTips = function(){
        var atMsg = chatService.hasAtMsg($scope.concatId);
        if(atMsg){
            return !atMsg.clicked;
        }
        return false;
    }
    $scope.inertHtmlToEditArea = function(html){
        var temp = document.getElementById('temp_span');
        if(temp){
            $(temp).remove();
        }
        html += '<span id="temp_span"></span>';
        insertHtmlAtCaret(html);
        temp = document.getElementById('temp_span');
        $scope.msg.msgContent = editArea.innerHTML;
        // console.log($scope.msg.msgContent)
        setTimeout(function(){
            editArea.focus();
            temp = document.getElementById('temp_span');
            // console.log(temp)
            if(document.createRange){
                editRange.setStartAfter(temp);
                editRange.collapse(false);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(editRange);
            }else{
                if(document.selection){
                    range = document.body.createTextRange();
                    range.moveToElementText(temp);
                    range.collapse(false);
                    range.select();
                }
            }
            $(temp).remove();
            $scope.msg.msgContent = editArea.innerHTML;
        },30);
    }
    $scope.keyPressHandler = function(e){
        if(e.altKey && e.keyCode == 83){
            e.preventDefault();
            e.stopPropagation();
        }
    }
    $scope.$on('noticeClick',function(ev,concatId,isGroup){
        $scope.chatWith(concatId,isGroup);
    })
    $scope.backToNor = function(){
        $scope.showing = 'nor';
        $scope.concatId = '';
        $scope.currentMsgList = [];
    }
    $scope.chatWith = function(_concat,isGroup){
        var broadChatReg = /^b_.+/;
        $scope.notBroadChat = !broadChatReg.test(_concat);
        if(_concat == 'service_chat_converge'){
            $scope.showing = 'service';
            return;
        }
        if(_concat == $scope.concatId) return;
        var lastMsgTime = chatService.getLastMsgTime(_concat);
        // TODO !!! 标记已读
        lastMsgTime && socketConnect.markRead(_concat,isGroup,lastMsgTime);
        var atmsg = chatService.hasAtMsg(_concat);
        atmsg && (atmsg.show = false);
        atEmpContainer = undefined;
        atPos = undefined;
        var player = document.getElementById('voice_player');
        if($scope.playing){
            player && player.pause();
            $scope.playing = undefined;
        }
        var oldId = $scope.concatId;
        if($scope.concat){
            if($scope.msg.msgContent && $scope.msg.msgContent != '<br>'){
                chatService.setMsgTemp(oldId,$scope.msg.msgContent);
                $scope.msg.msgContent = '';
            }else{
                chatService.deleteMsgTemp(oldId);
            }
        }
        _isGroup = isGroup;
        $scope.concatId = _concat;
        if(isGroup){
            $scope.concat = chatService.getChat(_concat);
            if(!$scope.concat.needCreate){
                if(oldId != _concat){
                    if(!chatService.isCompleteReq($scope.concatId)){
                        socketConnect.getGroupInfo($scope.concatId);
                        // strophe.getRoomMembers($scope.concatId);
                        // strophe.getRoomSubject($scope.concatId);
                    }
                    // strophe.getRoomSubject($scope.concatId);
                    // strophe.getRoomMembers($scope.concatId);
                }
                selected = undefined;
                roomId = undefined;
            }else{
                selected = $scope.concat.members;
                roomId = $scope.concatId;
            }
            var members = $scope.concat.members;
            for(var i=0;i<members.length;i++){
                if(empService.getEmpStatus(members[i].SUserId) === undefined){
                    socketConnect.checkEmpStatus(members[i].SUserId);
                }
            }
            socketConnect.getShutUpUsers(_concat);
            fillMsgList();
        }else{
            $scope.concat = empService.getEmpInfo(_concat);
            fillMsgList();
            selected = undefined;
            roomId = undefined;
        }
        // createRoomCallBack.length = 0;
        chatService.readChatMsg(_concat);
        function fillMsgList(){
            var _chat = chatService.getChat(_concat);
            // console.log($scope.currentMsgList);
            chatService.readMsg(_concat);
            $scope.currentMsgList = chatService.getMsgList(_concat);
            $timeout(function(){
                $('#msg_edit_area').focus();
                editArea.innerHTML = $scope.msg.msgContent = _chat.msgTemp || '';
                editAreaFocus();
                setSelection();
            },20);
        }
    }
    $scope.$watch('concatId',function(list){
        $timeout(function(){
            $scope.isGroup = _isGroup;
        })
    });
    $scope.$on('resetRoomTempName',function(e,roomId){
        $timeout(function(){
            chatService.modifyChatName(roomId);
        })
    })
    $scope.$on('receiveRoomSubject',function(e,room,subject,roomInfo){
        $timeout(function(){
            var isExist = chatService.isExist(room);
            if(!isExist) return;
            chatService.modifyChatName(room,subject);
        })
    })
    $scope.$on('receiveRoomMembers',function(e,roomId,members){
        $timeout(function(){
            var isExist = chatService.isExist(roomId);
            if(!isExist) return;
            var chat = chatService.getChat(roomId);
            if(chat){
                chatService.replaceMembers(roomId,members);
                if(!chat.name){
                    chatService.modifyChatName(roomId);
                }
            }else{
                chatService.initBlankChat(roomId,true);
                // socketConnect.getGroupInfo($scope.concatId);
                // strophe.getRoomMembers(roomId);
            }
        });
    })
    $scope.$on('withDrawMsg',function(ev,chatId,msgObj){
        var messageId = msgObj.messageid;
        chatService.withDrawMsg(chatId,msgObj);
    })
    $scope.$on('roomNotFound',function(ev,roomId){
        // var firstLogin = localStorage.getItem('firstLogin');
        // if(firstLogin >= 2){
        $timeout(function(){
            removeChat(roomId);
            if($scope.concatId == roomId){
                $scope.concatId = '';
            }
        })
        // }
    })
    $scope.$on('empNotInRoom',function(ev,roomId){
        $timeout(function(){
            removeChat(roomId);
            if(roomId == $scope.concatId){
                $scope.concatId = '';
            }
        })
    })
    
    $scope.$on('roomSubjectChange',function(e,roomId,subject){
        $timeout(function(){
            chatService.modifyChatName(roomId,subject);
        })
    })
    $scope.$on('empJoinRoom',function(e,roomId,emp){
        // if(!chatService.isExist(roomId)) return;
        $timeout(function(){
            if($scope.concatId == roomId){
                $scope.currentMsgList = chatService.getMsgList($scope.concatId);
            }
            chatService.modifyChatName(roomId);
            resetChatTempName(roomId);
        });
    })
    function resetChatTempName(chatId){
        var chat = chatService.getChat(chatId);
        if(chat.isGroup){
            for(var i=0;i<$scope.chatList.length;i++){
                if($scope.chatList[i].id == chatId){
                    $scope.chatList[i].tempName = chat.tempName;
                }
            }
        }
    }
    $scope.$on('empKicked',function(e,roomId,emp){
        empLeaveRoom(roomId,emp);
    })
    $scope.$on('empLeave',function(e,roomId,emp){
        empLeaveRoom(roomId,emp,1);
    })
    function empLeaveRoom(roomId,emp,removeMsg){
        $timeout(function(){
            if(emp.splice){
                if(emp.length == 1){
                    emp = emp[0];
                }
            }
            var currentEmp = empService.getLoginEmp();
            if(emp.SUserId == currentEmp.SUserId){
                removeChat(roomId,1);
                if($scope.concatId == roomId){
                    // $scope.isGroup = false;
                    // $scope.concatId = undefined;
                    removeMsg && ($scope.currentMsgList.length = 0);
                    // $scope.concat = '';
                }
                removeMsg && chatService.removeMsgList(roomId);
            }else{
                if($scope.concatId == roomId){
                    $scope.currentMsgList = chatService.getMsgList($scope.concatId);
                }
                chatService.modifyChatName(roomId);
                resetChatTempName(roomId);
            }
        })
    }
    function heightCalc(msg,callback){
        var scope = $rootScope.$new();
        var div = '<div message-directive></div>';
        scope._msg = msg;
        scope.user = empService.getLoginEmp();
        var to = msg.to;
        var reg = /^group_.*?_[\d.]+$/;
        if(reg.test(to)){
            scope.isGroup = true;
        }
        var html = $compile(div)(scope);
        $('#prerender').append(html);
        (function(_s,_h,_m,_callback){
            setTimeout(function() {
                if(msg.type == webConfig.MSG_PIC_TYPE || msg.type == webConfig.MSG_VIDEO_TYPE || msg.type == webConfig.MSG_SERVICE_TYPE){
                    try{
                        _s.$digest();
                    }catch(e){
                        console.log(e);
                    }
                    var img = html.find('.thumb_img')[0] || html.find('._img')[0];
                    if(img && img.complete){
                        _callback && _callback(_h.height());
                        _h.remove();
                        _s.$destroy();
                    }else if(img && !img.complete){
                        img.onload = function(){
                            _callback && _callback(_h.height());
                            _h.remove();
                            _s.$destroy();
                        }
                        img.onerror = function(){
                            _callback && _callback(_h.height());
                            _h.remove();
                            _s.$destroy();
                            this.onerror = null;
                        }
                    }else{
                        _callback && _callback(_h.height());
                        _h.remove();
                        _s.$destroy();
                    }
                }else{
                    try{
                        _s.$digest();
                    }catch(e){
                        console.log(e);
                    }
                    _callback && _callback(_h.height());
                    _h.remove();
                    _s.$destroy();
                }
            },0);
        })(scope,html,msg,callback);
    }
    $scope.heightCalc = heightCalc;
    $scope.$on('msgHeightCalc',function(e,msg,chatId){
        heightCalc(msg,function(h){
            var list = chatService.getMsgList(chatId);
            if(list){
                msg._h = h;
                for(var i=0;i<list.length;i++){
                    if(list[i].messageid == msg.messageid){
                        msg.index = i;
                        break;
                    }
                }
            }
        });
    });
    $scope.$on('receiveMsg',function(e,msgList){
        for(var i=0;i<msgList.length;i++){
            receiveMsgFn(msgList[i]);
        }
        $timeout(function(){
            $scope.serviceChatList = chatService.getServiceChatList();
            $scope.norChatList = chatService.getNorChatList();
        })
    })
    $scope.$on('receiveVoiceMetting',function(ev,msg){
        var sender = empService.getEmpInfo(msg.sedner);
        var receive = empService.getEmpInfo(msg.recver);
        var currentEmp = empService.getLoginEmp();
        var msgChatId = msg.groupid || sender.SUserId;
        var fromUser = sender.SUserId;
        var isGroup = msg.groupid ? true : false;
        $timeout(function(){
            isGroup && socketConnect.getGroupInfo(msgChatId);
            if(msgChatId == $scope.concatId){
                var lastMsgTime = chatService.getLastMsgTime(msgChatId);
                lastMsgTime && socketConnect.markRead(msgChatId,msg.isGroup,lastMsgTime);
                $scope.currentMsgList = chatService.getMsgList($scope.concatId);
                chatService.deleteMsgTemp(msgChatId);
                chatService.readChatMsg(msgChatId);
            }
            $scope.serviceChatList = chatService.getServiceChatList();
            $scope.norChatList = chatService.getNorChatList();
        })
    })
    $scope.$on('withDrawMyMsg',function(ev,msgId){
        socketConnect.sendWithDrawMsg($scope.concatId,msgId);
    })
    var handleMsgType = {
       0 : 1,
       1 : 1,
       2 : 1,
       6 : 1,
       7 : 1
    }
    function receiveMsgFn(msg){
        var res = msg.retcode;
        var to = msg.touser;
        msg = chatService.socketMsgToFrontMsg(msg);
        if(msg.msgObj && !handleMsgType[msg.msgObj.n_TYPE]){
            return;
        }
        if(msg.msgObj && handleMsgType[msg.msgObj.n_TYPE]){
            // if(msg.msgObj.n_TYPE == 6){
                // alert('置顶')
            // }
            // if(msg.msgObj.n_TYPE == 7){
                // alert('消息撤回')
            // }
            return;
        }
        $timeout(function(){
            var from = msg.id;
            if(from == $scope.concatId){
                // TODO !!!! 标记已读
                var lastMsgTime = chatService.getLastMsgTime(from);
                if(res == 1){
                    lastMsgTime && socketConnect.markRead(from,msg.isGroup,lastMsgTime);
                }
            }
            if(msg.isGroup){
                if(to == $scope.concatId){
                    $scope.currentMsgList = chatService.getMsgList($scope.concatId);
                    chatService.deleteMsgTemp(to);
                    chatService.readChatMsg(to);
                    // chatService.delAtMsg(from);
                    var atmsg = chatService.hasAtMsg($scope.concatId);
                    if(atmsg && atmsg.messageid == msg.messageid){
                        chatService.delAtMsg(to);
                    }
                }
            }else{
                if(from == $scope.concatId){
                    $scope.currentMsgList = chatService.getMsgList($scope.concatId);
                    chatService.deleteMsgTemp(from);
                    chatService.readChatMsg(from);
                }
            }
        })
    }
    
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent,ele) {
        if(seeAtMsg) return;
        ele && ele.parents('.chat_content_msglist').scrollTop(999999);
    });
    
    $scope.addEmp = function(){
        var selected = $scope.isGroup ? $scope.concat.members : [$scope.concat];
        var loginEmp = empService.getLoginEmp();
        if(!$scope.isGroup && loginEmp.SUserId == $scope.concat.SUserId){
            selected = [];
        }
        // selected = angular.copy(selected);
        // if(!$scope.isGroup){
            // selected.isDefault = true;
        // }
        var chat = chatService.getChat($scope.concatId);
        var needCreate = chat.isGroup ? (chat.needCreate === undefined ? false : true) : true;
        pops.open({
            templateUrl : 'empChooser.html',
            data : {
                selected : angular.copy(selected),
                isGroup : $scope.isGroup ? $scope.concatId : false,
                oldEmps : angular.copy(selected),
                msgContent : $scope.msg.msgContent,
                needCreate : needCreate
            },
            className : 'radius10',
            controller: "empChooserController"
        })
    }
    // 延迟创建房间相关改动 -- begin
    
    $scope.$on('createRoomSuccess',function(ev,_roomId){
            // if(!chatService.isExist(_roomId)) return;
        var currentEmp = empService.getLoginEmp();
        if(_roomId == $scope.concatId){
            $params.concat.needCreate = false;
            var chat = chatService.getChat(_roomId);
            if(selected){
                var _selected = selected ? angular.copy(selected) : angular.copy(chat.members);
                var len = _selected.length;
                for(var i=len-1;i>=0;i--){
                    if(_selected[i].SUserId == currentEmp.SUserId){
                        selected[i].isAdmin = true;
                        _selected.splice(i,1);
                    }
                }
                selected = undefined;
                roomId = _roomId;
                while(createRoomCallBack[_roomId] && createRoomCallBack[_roomId].length){
                    createRoomCallBack[_roomId].pop()();
                }
            }
            $('#group_info_btn').css('opacity',0);
            $('#group_info_btn').animate({
                opacity : 1
            },1000);
        }
        // if(forwardMsgCallBack[_roomId] && forwardMsgCallBack[_roomId].length){
            // forwardMsgCallBack[_roomId].pop()(_roomId);
        // }
    });
    
    $scope.$on('createRoomFail',function(){
        alert(langPack.getKey('failCreateRoom'));
        selected = '';
        roomId = '';
        $timeout(function(){
            var msgList = chatService.getMsgList($scope.concatId);
            for(var i=0;i<msgList.length;i++){
                msgList[i].sendStatus = webConfig.MSG_SENDFAIL;
            }
        })
    });
    
    // 延迟创建房间相关改动 -- end
    
    // 获取群组聊天最后发消息的人，用于显示在聊天列表中形如XXX:xxxxx
    $scope.getLastMsgSender = function(chatId){
        var msgList = chatService.getMsgList(chatId) || [] , len = msgList.length;
        if(len){
            var last = {};
            for(var i=len-1;i>=0;i--){
                if(msgList[i].type != 'system'){
                    last = msgList[i];
                }
            }
            return last.sender ? empService.getEmpName(last.sender) : '';
        }
        return '';
    }
    $scope.toggleConcat = function(chatId){
        var chat = chatService.getChat(chatId);
        if(chat){
            if(chat.isGroup){
                var groupObject = {};

            }else{
                var emp = empService.getEmpInfo(chatId);
                var relPerId = emp.SPerId;
            }
        }else{
            var emp = empService.getEmpInfo(chatId);
            var relPerId = emp.SPerId;            
        }
    }
    
    $scope.getTotalMailTo = function(){
        return !$scope.isGroup ? [$scope.concat] : $scope.concat.members;
    }
    
    $scope.showGroupInfo = function(e){
        if($scope.isGroup){
            var chat = chatService.getChat($scope.concatId);
            var needCreate = chat.needCreate;
            if(needCreate){
                var selected = chat.members;
                pops.open({
                    templateUrl : 'empChooser.html',
                    data : {
                        chatId : $scope.concatId,
                        selected : angular.copy(selected),
                        isGroup : $scope.concatId,
                        oldEmps : angular.copy(selected),
                        msgContent : $scope.msg.msgContent,
                        needCreate : needCreate
                    },
                    className : 'radius10',
                    controller: "empChooserController"
                })
            }else{
                if($scope.showingInfo){
                    pops.closeAllPop();
                    return;
                }
                $scope.showingInfo = true;
                pops.openDialog({
                    isDialog : true,
                    templateUrl : 'groupInfo.html',
                    className : 'group_info_inner slide-down',
                    container : $('#group_info_warp'),
                    auto : true,
                    data : {
                        group : $scope.concat,
                        msgContent : $scope.msg.msgContent,
                        needCreate : needCreate,
                        isGroup : true,
                        groupId : $scope.concatId
                    },
                    controller: "groupInfoController"
                })
            }
        }else{
            if($scope.showingInfo){
                pops.closeAllPop();
                return;
            }
            $scope.showingInfo = true;
            pops.openDialog({
                isDialog : true,
                templateUrl : 'groupInfo.html',
                className : 'group_info_inner slide-down',
                container : $('#group_info_warp'),
                auto : true,
                data : {
                    group : $scope.concat,
                    msgContent : $scope.msg.msgContent,
                    // needCreate : needCreate,
                    isGroup : false,
                    currentUserId : $scope.concatId
                },
                controller: "groupInfoController"
            })
        }
        e.stopPropagation();
    }
    $scope.$on('groupInfoPopuClosed',function(){
        $timeout(function(){
            $scope.showingInfo = false;
        })
    })
    // 播放相关
    $scope.playing = undefined;
    function onplayend(){
        $timeout(function(){
            $scope.playing = undefined;
        })
    }
    function onerror(){
        alert(langPack.getKey('audioFailed'));
        $scope.playing = undefined;
    }
    $scope.playVoice = function(msg){
        msg.readStatus = webConfig.MSG_READED;
        var player = document.getElementById('voice_player');
        if($scope.playing && $scope.playing == msg.messageid){
            player && player.pause();
            $scope.playing = undefined;
            return;
        }
        var src = msg.url;
        $scope.playing = msg.messageid;
        if(!player){
            player = document.createElement('audio');
            player.id = 'voice_player';
            player.onloadedmetadata = function(){
                this.play();
            }
            player.onended = onplayend;
            player.onerror = onerror;
            var con = document.createElement('div');
            con.style.position = 'absolute';
            con.style.top = '-10000px';
            con.style.left = '-10000px';
            con.appendChild(player);
            $('body').append(con);
        }
        player.src = src;
        player.onended = onplayend;
        player.onerror = onerror;
    }
    $scope.playVideo = function(msg){
        msg.readStatus = webConfig.MSG_READED;
        pops.open({
            templateUrl : 'playVideo.html',
            data : {
                video : msg
            },
            maskClose : true,
            className : 'radius10',
            controller: ['$scope','util',function($s,util){
                // console.log(util);
                $s.isFF = util.browser.mozilla;
            }]
        })
    }
    
    $scope.previewImage = function(msg){
        var imageMessageList = [];
        var len = $scope.currentMsgList.length;
        var current = 0;
        for(var i=0;i<len;i++){
            if($scope.currentMsgList[i].type == webConfig.MSG_PIC_TYPE && $scope.currentMsgList[i].url){
                imageMessageList.push($scope.currentMsgList[i]);
            }
            if($scope.currentMsgList[i].messageid == msg.messageid){
                current = imageMessageList.length - 1;
            }
        }
        preview.open({
            imageList : imageMessageList, 
            current : current
        })
    }
    $scope.openServiceMsgLink = function(msg){
        var entId = msg.sender.entId;
        $.ajax({
            type : 'post',
            async : false,
            url : webConfig.REQUEST_PIX + '/users/getUserST.wn',
            beforeSend : function(req){
                req.setRequestHeader('Content-Type','application/json;charset=UTF-8');
                var token = webConfig.getToken();
                if(token){
                    req.setRequestHeader('token',token);
                }
            },
            success : function(data){
                var type = msg.msgObj.s_CONTENTTYPE;
                var url = '';
                if(type == 'image'){
                    url = msg.msgObj.s_CONTENTS;
                }else{
                    url = msg.msgObj.s_URL;
                }
                var pstr = 'entId=' + entId + '&token=' + data.userSt;
                if(url.indexOf('?') == -1){
                    url += '?' + pstr;
                }else{
                    url += pstr
                }
                window.open(url);
            }
        })
        // ajaxService.postJson('',function(data){
            // var type = msg.msgObj.s_CONTENTTYPE;
            // var url = '';
            // if(type == 'image'){
                // url = msg.msgObj.s_CONTENTS;
            // }else{
                // url = msg.msgObj.s_URL;
            // }
            // var pstr = 'entId=' + entId + '&token=' + data.userSt;
            // if(url.indexOf('?') == -1){
                // url += '?' + pstr;
            // }else{
                // url += pstr
            // }
            // window.open(url);
        // })
    }
    // 上传！
    $scope.downLoadFile = function(msg){
        var iframe = document.createElement('iframe');
        iframe.src = msg.url;
        $('body').append(iframe);
        setTimeout(function(){
            iframe.parentNode.removeChild(iframe);
        },1000);
    }
    var imgType = {
        jpg : 1,
        jpeg : 1,
        gif : 1,
        bmp : 1,
        png : 1
    }
    $scope.cancelFile = function(msg){
        // console.log(msg);
        var list = $scope.currentMsgList , len = list.length;
        for(var i=len-1;i>=0;i--){
            if(msg.messageid == $scope.currentMsgList[i].messageid){
                $scope.currentMsgList.splice(i,1);
            }
        }
        if(msg.uploadStatus == webConfig.FILE_UPLOADING){
            wuObj.cancelFile(msg.file);
        }
    }
    var fileUploadAction = {
        onQueued : function(){
            var file = this;
            var ext = file.ext;
            if(imgType[ext]){
                file.message = chatService.createMessage($scope.concatId,webConfig.MSG_PIC_TYPE,'',file,'');
                wuObj.makeThumb(file, function(error, thumb) {
                    if (!error) {
                        file.message.thumb = thumb.replace('data:image/jpeg;base64,','');
                    }
                    if(!file.lastModified){
                        pops.open({
                            templateUrl : 'screenShootImage.html',
                            data : {
                                message : file.message,
                                sendMsg : sendMsg
                            },
                            maskClose : true,
                            className : 'radius10',
                            controller: "screenShootImageController"
                        })
                    }else{
                        chatService.addMsg(file.message,$scope.concatId);
                    }
                    // console.log(file);
                });
            }else{
                file.message = chatService.createMessage($scope.concatId,'file','',file);
                file.message.uploadStatus = webConfig.FILE_UPLOADING;
                file.message.file = file;
                chatService.addMsg(file.message,$scope.concatId);
            }
        },
        onSuccess : function(data){
            var file = this;
            $scope.$apply(function(){
                file.message.uploadStatus = webConfig.FILE_COMPLETE;
                file.message.url = servers.downLoad + data.fileUploadPath;
                if(file.lastModified){
                    sendMsg(file.message);
                }else{
                    $rootScope.$broadcast('screenShootImageUploaded',servers.downLoad + data.fileUploadPath);
                }
            });
        },
        onProgress : function(per){
            var file = this;
            $scope.$apply(function(){
                file.message.uploadStatus = webConfig.FILE_UPLOADING;
                file.message.uploadPersent = per;
            })
        },
        onError : function(){
            var file = this;
            $scope.$apply(function(){
                file.message.sendStatus = webConfig.MSG_SENDFAIL;
                file.message.uploadStatus = webConfig.FILE_ERROR;
            })
            
        }
    }

    var wu = window.WebUploader;
    var wuObj = wu.create({
        auto : true,
        // dnd : "#chat_area",
        paste : util.browser.webkit ? "#chat_area" : '',
        swf : 'Uploader.swf',
        server : domain.upload,
        fileVal : 'uploadFile',
        pick : '#choose_file',
        // thumb : {
            // allowMagnify: false,
            // crop : false
        // },
        formData : {
            userId : loginUser.SUserId
        },
        compress : false,
        duplicate : true
    }).on('beforeFileQueued', function(file) {
        if(file.size > webConfig.MAX_UPLOAD_SIZE){
            alert(langPack.getKey('maxUpload') + webConfig.MAX_UPLOAD_SIZE_M + langPack.getKey('mb'));
            return false;
        }
        if(file.size == 0){
            alert(langPack.getKey('zeroFile'));
            return false;
        }
        // console.log(file);
        if(!file.source.source.lastModified){
            angular.extend(file,fileUploadAction); // 文件上传操作扩展到每个file内部
            
            return true;
        }else{
            return false;
        }
    }).on('filesQueued', function(files) {
        var len = files.length;
        for (var i=0;i<len;i++) {
            files[i].onQueued.call(files[i]);
        }
    }).on('uploadBeforeSend', function(fileBlock, fileInfo) {
        // file.onProgress.call(file, t)
    }).on('uploadProgress', function(file, per) {
        file.onProgress.call(file, per);
    }).on('uploadFinished', function() {
        wuObj.reset();
    }).on('uploadSuccess', function(file, data) {
        file.onSuccess.call(file,data);
    }).on('uploadError', function(file, error) {
        file.onError.call(file,error);
    }).on('error', function(e) {
        alert(langPack.getKey('webuploaderError'))
    })
    
    $scope.$on('$destroy',function(){
        if($scope.playing){
            var player = document.getElementById('voice_player');
            player && player.pause();
        }
        $scope.playing = undefined;
        for(var p in createRoomCallBack){
            createRoomCallBack[p].length = 0;
        }
    })
    
    // 表情
    $scope.showFace = function(e){
        pops.openDialog({
            scope : $scope,
            data : {
                parent : $scope
            },
            templateUrl : 'face.html',
            container : $('#tool_bar'),
            controller : 'faceController',
            isDialog : true,
            className : 'face_dialog',
            left : 2
            // top : -228
        })
        e.preventDefault()
    }
    function removeChat(chatId,keepChat){
        !keepChat && socketConnect.clearGroupInfo(chatId);
        var chatList = $scope.chatList , len = chatList.length;
        for(var i=len-1;i>=0;i--){
            if(chatList[i].id == chatId){
                chatList[i].isKicked = true;
                !keepChat && chatList.splice(i,1);
                break;
            }
        }
        var norChatList = $scope.norChatList , len1 = norChatList.length;
        for(var i=len1-1;i>=0;i--){
            if(norChatList[i].id == chatId){
                norChatList[i].isKicked = true;
                !keepChat && norChatList.splice(i,1);
                break;
            }
        }
        var serviceChatList = $scope.serviceChatList , len2 = serviceChatList.length;
        for(var i=len2-1;i>=0;i--){
            if(serviceChatList[i].id == chatId){
                serviceChatList[i].isKicked = true;
                !keepChat && serviceChatList.splice(i,1);
                break;
            }
        }
    }
    // 右键菜单
    $scope.$on('deleteChat',function(ev,chatId){
        var currentEmp = empService.getLoginEmp();
        $timeout(function(){
            chatService.removeChat(chatId);
            empService.removeRecent(currentEmp.SUserId,chatId);
            removeChat(chatId);
            if($scope.concatId == chatId){
                $scope.isGroup = false;
                $scope.concatId = undefined;
                $scope.currentMsgList = [];
                $scope.concat = '';
            }
        });
    })
    $scope.$on('forward',function(ev,msgId){
        var msg = chatService.getMessage(msgId);
        pops.open({
            templateUrl : 'empChooser.html',
            className : 'radius10',
            data : {
                msg : msg,
                chatId : $scope.concatId,
                selected:[],
                isForward : true,
                title : langPack.getKey('forwardTitle')
            },
            controller: "empChooserController"
        })
    })
    
    $scope.$on('forwardComplete',function(){
        $timeout(function(){
            $scope.currentMsgList = chatService.getMsgList($scope.concatId);
            $scope.chatList = chatService.getChatList();
        })
    })
    $scope.$on('afterLogout',function(){
        $timeout(function(){
            for(var p in $params){
                delete $params[p];
            }
            $scope.concatId = undefined;
        });
    });
    
    // var forwardMsgCallBack = {};
    $scope.$on('forwardMsg',function(ev,roomId,members,msg){
        // var _cbs = forwardMsgCallBack[roomId] = [];
        var currentEmp = empService.getLoginEmp();
        chatService.addChat({
            isService : false,
            isGroup : true,
            msgData : msg,
            sender : currentEmp,
            id : roomId,
            needCreate : true
        },false);
        sendMsg(msg,roomId,members);
        // _cbs.push(function(successRoomId){
            // if(successRoomId == roomId){
                // sendMsg(msg,roomId);
            // }
        // });
        // socketConnect.createRoom(roomId,members);
    })
    $scope.$on('chatWith',function(ev,concatId,isGroup,time){
        var chat = chatService.getChat(concatId);
        time = time || 0;
        chat.lastChatTime = Math.max(chat.lastChatTime , time);
        $scope.chatWith(concatId,isGroup);
        $scope.serviceChatList = chatService.getServiceChatList();
        $scope.norChatList = chatService.getNorChatList();
    });
    $scope.joinUrl = function(msg){
        return msg.url + '?randomId=1111'
    }
    
    $scope.$on('refreshLastestEmpInfo',function(ev){
        $timeout(function(){
            $scope.serviceChatList = chatService.getServiceChatList();
            $scope.norChatList = chatService.getNorChatList();
        })
    });    
}])


controllers.controller('organizeController',['$state','$scope','empService','$rootScope','$stateParams','$timeout','webConfig',function($state,$scope,empService,$rootScope,$params,$timeout,webConfig){
    var loginUser = webConfig.getUser();
    var loginUserId = loginUser.SUserId;
    $scope.tree = $params.dept ? empService.getOrganizeTree(loginUserId,$params.dept) : empService.getOrganizeTree(loginUserId);
    // $scope.selected = $params.dept ? empService.getDept($params.dept) : empService.getEmpDept(loginUserId);

    $scope.chatWith = function(){
        var s = $scope.selected;
        if(s.IsEmp){
            $state.go('chat',{
                concat : s.SUserId,
                isGroup : false
            });
        }else{
            //其次把部门所有人邀请进房间
            //最后触发下面的createRoom事件go房间
            var timeStr=new Date().getTime();
            var roomId='group_'+loginUserId+'_'+timeStr;
            //console.log(s)
            var tempSelected=getEmpsInDept(s);
            if(tempSelected.length > 80){
                alert(langPack.getKey('maxMembers'));
                return;
            }
            $state.go('chat',{
                concat : roomId,
                isGroup : true,
                selected : tempSelected,
                needCreate : true
            });
            // $rootScope.$broadcast('createTempRoom',s,roomId);
        }
    }
    function getEmpsInDept(dept){
        var emps = [];
        emps = emps.concat(dept.ChildEmps);
        // dept.ChildDepts = dept.ChildDepts || [];
        for(var i=0;i<dept.ChildDepts.length;i++){
            emps = emps.concat(getEmpsInDept(dept.ChildDepts[i]));
        }
        var temp = {};
        for(var i=emps.length-1;i>=0;i--){
            if(!temp[emps[i].SUserId]){
                temp[emps[i].SUserId] = 1;
            }else{
                if(temp[emps[i].SUserId]){
                    emps.splice(i,1);
                }
            }
        }
        return emps;
    }
    $scope.$on('selectDept',function(ev,dept){
        $timeout(function(){
            dept.NEmpnumber = empService.getEmpNumberOfDept(dept.entId,dept.SDeptId);
            $scope.selected = dept;
        })
    })
    $scope.$on('updateSelectEntLogo',function(ev,logo){
        $timeout(function(){
            $scope.entLogoUrl = logo;
        })
    })
    // $scope.$on('createRoom',function(ev,roomId){
        // $state.go('chat',{
            // concat : roomId,
            // isGroup : true
        // });
    // })
    $scope.gone = $params.dept ? false : true;
    $scope.$on('ngRepeatFinished',function(){
        var selectDom = $('.organize_tree').find('.selected')[0];
        if(selectDom && !$scope.gone){
            $('.organize_tree')[1].scrollTop = Math.max(0,selectDom.offsetTop - 80);
            $scope.gone = true;
        }
    })
}])

controllers.controller('empChooserController',['$state','$scope','empService','$rootScope','chatService','concatService','strophe','domain','$timeout','util','webConfig','socketConnect','langPack',function($state,$scope,empService,$rootScope,chatService,concatService,strophe,domain,$timeout,util,webConfig,socketConnect,langPack){
    var currentUser = currentEmp = webConfig.getUser();
    
    $scope.index = 0;
    $scope.selectedIndex = -1;
    $scope.tree = empService.getOrganizeTree(currentUser.SUserId); // 组织架构树数据
    $scope.allEmps = empService.getAllEmps(); // 所有人员数据，供搜索用
    
    $scope.chatId = $scope.data.chatId; // 在哪个聊天窗口里打开的人员选择窗，可以为空
    $scope.selected = $scope.data.selected || []; // 已选择人员，可以传入表示默认选择的人
    $scope.oldEmps = $scope.data.oldEmps || []; // 已选择人员备份，用于检测哪些人被踢出
    $scope.isGroup = $scope.data.isGroup || false; // 传入的时候如果为群组，isGroup字段为群组的id，否则为false
    $scope.msgContent = $scope.data.msgContent; // 在跟单个人聊天时添加其他人的时候需要将输入框中内容另外存一份等房间创建完成后再将数据放入输入框
    $scope.isForward = $scope.data.isForward;
    // console.log($scope.isForward)
    $scope.map = {}; // 已选择人员字典用于快速检测该人员是否已选择
    $scope.oldMap = {}; // 传入的oldEmps字段，主要用于非群组管理员无法删除已存在的人员
    $scope.searchResult = []; // 搜索结果
    $scope.pageResult = []; // 搜索结果当前页数据
    
    $scope.page = 1; // 搜索当前页
    $scope.pageSize = 10; // 搜索结果每页数据量
    $scope.totalPage = 1; // 搜索结果总页数
    
    $scope.keyword = ''; // 搜索关键字
    $scope.loginEmp = currentUser; // 当前登陆人员
    $scope.concats = []; // 常用联系人
    $scope.recents = $scope.isForward ? angular.copy(chatService.getNorChatList()) : empService.getRecentEmps(true); // 最近联系人，只搜索人员排除群组
    $scope.mineGroups = [];
    var reg = /^group_.*?_[\d.]+$/;
    $scope.recentPager = {
        pageSize : 5,
        page : 0,
        totalPage : 0,
        recentsList : []
    };
    $scope.friendPager = {
        pageSize : 5,
        page : 0,
        totalPage : 0,
        friends : [],
        friendsList : []
    };
    var pageSize = $scope.recentPager.pageSize;
    for(var i=$scope.recents.length - 1;i>=0;i--){
        var name = $scope.recents[i].name;
        var tempName = $scope.recents[i].tempName;
        var id = $scope.recents[i].id || $scope.recents[i].SUserId;
        if(id == 'service_chat_converge' || util.isBroad(id)){
            $scope.recents.splice(i,1);
        }
        if(util.isBroad(id)){
            continue;
        }
        if(reg.test(id)){
            var groupId = $scope.recents[i].id;
            if($scope.recents[i].isKicked) continue;
            $scope.recents[i] = {
                id : groupId,
                groupId : groupId,
                isGroup : true,
                name : name,
                tempName : tempName,
                members : []
            };
        }else{
            var emp = empService.getEmpInfo(id);
            if(emp.SUserId){
                $scope.recents[i] = {
                    id : id,
                    SUserId : emp.SUserId,
                    IsEmp : true,
                    name : name,
                    tempName : tempName,
                    SShowName : emp.SShowName,
                    SName : emp.SName
                };
            }
        }
    }
    $scope.recentPager.totalPage = parseInt(($scope.recents.length + pageSize - 1) / pageSize);
    $scope.loadMore2 = function(){
        var _old = $scope.recentPager.page;
        $scope.recentPager.page ++;
        var _new = $scope.recentPager.page;
        var newIn = $scope.recents.slice(_old * pageSize , _new * pageSize);
        for(var i=0;i<newIn.length;i++){
            var groupId = newIn[i].id;
            if(reg.test(groupId)){
                chatService.getGroup(groupId,(function(idx){
                    return function(group){
                        newIn[idx].name = group.groupName;
                        newIn[idx].tempName = group.tempName;
                        if(group.members.length){
                            newIn[idx].members.length = 0;
                            [].push.apply(newIn[idx].members,group.members);
                        }
                    }
                })(i));
            }
        }
        [].push.apply($scope.recentPager.recentsList,newIn);
    }
    $scope.loadMore3 = function(){
        var pageSize = $scope.friendPager.pageSize;
        var _old = $scope.friendPager.page;
        $scope.friendPager.page ++;
        var _new = $scope.friendPager.page;
        var newIn = $scope.friendPager.friends.slice(_old * pageSize , _new * pageSize);
        [].push.apply($scope.friendPager.friendsList,newIn);
    }
    $scope.loadMore2();
    // 初始化常用联系人数据
    function wrapFn(emp){
        return function(_emp){
            $timeout(function(){
                for(var p in _emp){
                    emp[p] = _emp[p];
                }
            })
        }
    }
    concatService.getConcatList().then(function(list){
        var concats = list.frequentList;
        for(var i=0;i<concats.length;i++){
            var emp = empService.getEmpInfo(concats[i].id.SFrequenterUserId,'SUserId');
            $scope.concats.push(emp);
        }
        var friends = list.firendsList;
        for(var i=0;i<friends.length;i++){
            var emp = empService.getEmpInfo(friends[i].SUserId,'SUserId');
            $scope.friendPager.friends.push(emp);
        }
        $scope.friendPager.totalPage = parseInt(($scope.friendPager.friends.length + $scope.friendPager.pageSize - 1) / $scope.friendPager.pageSize);
        $scope.loadMore3();
        var groupList = list.groupList;
        for(var i=0;i<groupList.length;i++){
            var groupId = groupList[i].groupId;
           $scope.mineGroups[i] =  {
                groupId : groupId,
                isGroup : true,
                groupName : '',
                tempName : '',
                members : []
            };
            chatService.getGroup(groupId,(function(idx){
                return function(group){
                    if(group){
                        if($scope.mineGroups[idx]){
                            group.isGroup = true;
                            for(var p in group){
                                $scope.mineGroups[idx][p] = group[p];
                            }
                        }
                    }
                }
            })(i));
        }
        // console.log($scope.concats);
    });
    $scope.$on('receiveRoomSubject',function(e,roomId,subject,roomInfo){
        $timeout(function(){
            for(var i=0;i<$scope.mineGroups.length;i++){
                if($scope.mineGroups[i].groupId == roomId){
                    subject && ($scope.mineGroups[i].groupName = subject);
                }
            }
        })
    })
    $scope.$on('receiveRoomMembers',function(e,roomId,members){
        $timeout(function(){
            for(var i=0;i<$scope.mineGroups.length;i++){
                if($scope.mineGroups[i].groupId == roomId){
                    $scope.mineGroups[i].members = members;
                    var tempName = [];
                    for(var j=0;j<members.length;j++){
                        members[j].SShowName && tempName.push(members[j].SShowName);
                    }
                    $scope.mineGroups[i].tempName = tempName.join(',');
                    // $scope.mineGroups[i].groupName = $scope.mineGroups[i].groupName || tempName.join(',');
                }
            }
        })
    })
    // 初始化是否显示最近联系人与常用联系人栏位的展开与隐藏
    $scope.show = {
        recent :  true,
        concat : true,
        groups : $scope.isForward
    }
    // 常用联系人与最近联系人的展开与隐藏方法
    $scope.toggleCate = function(cate){
        $scope.show[cate] = !$scope.show[cate];
    }
    // 已选择人员在页面上展开|收起状态切换
    $scope.toggleAll = false;
    // 如果不是群组，则把当前人员也放入已选择列表
    if(!$scope.isForward){
        if(!$scope.isGroup){
            $scope.selected.push(currentUser);
        }
    }

    // 展开|收起 状态切换方法
    function toggleEmps(emps){
        var len = emps.length ,userId;
        for(var i=len-1;i>=0;i--){
            emps[i].IsEmp = true;
            if(userId == currentEmp.SUserId) continue;
            if($scope.canCancel(emps[i])){
                emps.splice(i,1);
            }
        }
        len = emps.length;
        for(var i=0;i<len;i++){
            userId = emps[i].SUserId;
            if(userId == currentEmp.SUserId) continue;
            if($scope.map[userId]){
                if($scope.canCancel(emps[i])) continue;
                var _len = $scope.selected.length
                for(var j=_len-1;j>=0;j--){
                    if(userId == $scope.selected[j].SUserId) $scope.selected.splice(j,1);
                }
                delete $scope.map[userId];
            }else{
                $scope.selected.push(emps[i]);
                $scope.map[userId] = 1;
            }
        }
        if($scope.selected.length <= 5){
            $scope.toggleAll = false;
        }
    }
    function toggleGroup(group){
        if(!$scope.map[group.groupId]){
            $scope.selected.push(group);
            $scope.map[group.groupId] = 1;
        }else{
            for(var i=$scope.selected.length - 1;i>=0;i--){
                if($scope.selected[i].isGroup && $scope.selected[i].groupId == group.groupId){
                    $scope.selected.splice(i,1);
                }
            }
            delete $scope.map[group.groupId];
        }
    }
    // 初始化已选择人员字典对象
    for(var i=0;i<$scope.selected.length;i++){
        $scope.map[$scope.selected[i].SUserId] = 1;
        $scope.oldMap[$scope.selected[i].SUserId] = 1;
    }
    // 获取部门中所有人员，用于勾选部门时使用
    function getEmpsInDept(dept){
        var emps = [];
        [].push.apply(emps,dept.ChildEmps);
        // dept.ChildDepts = dept.ChildDepts || [];
        for(var i=0;i<dept.ChildDepts.length;i++){
            [].push.apply(emps,getEmpsInDept(dept.ChildDepts[i]));
            if(emps.length > 100) break;
        }
        var temp = {};
        for(var i=emps.length-1;i>=0;i--){
            if(!temp[emps[i].SUserId]){
                temp[emps[i].SUserId] = 1;
            }else{
                if(temp[emps[i].SUserId]){
                    emps.splice(i,1);
                }
            }
        }
        return emps;
    }
    // 检测当前对象是否已选中，可以传入人员或者部门。
    // 如果传入的是人员，则IsEmp字段必需为true
    function isChecked(obj){
        if(!obj) return false;
        if(util.isBlank($scope.map)) return false;
        var userId;
        if(obj.IsEmp || (obj.IsEmp === undefined && obj.IsDept === undefined && obj.isGroup === undefined)){
            userId = obj.SUserId;
            return $scope.map[userId] ? true : false;
        }else if(obj.isGroup){
            return $scope.map[obj.groupId] ? true : false;
        }else if(obj.IsDept){
            var emps = getEmpsInDept(obj);
            if(!emps.length || emps.length > 80) return false;
            for(var i=0;i<emps.length;i++){
                if(!isChecked(emps[i])) return false;
            }
            return true;
        }
    }
    
    
    $scope.isChecked = isChecked;
    // 人员|部门 勾选状态切换方法
    $scope.toggleSelect = function(branch,$event){
        if(branch.IsEmp || (branch.IsEmp === undefined && branch.IsDept === undefined && branch.isGroup === undefined)){
            if($scope.oldMap[branch.SUserId] && !$scope.data.needCreate && !$scope.isAdmin()){
                return;
            }
            if(!$scope.map[branch.SUserId]){
                if($scope.selected.length >= 80){
                    showOutOfLimit($event);
                    return false;
                }
            }
            toggleEmps([branch]);
            $scope.keyword = '';
            $scope.selectedIndex = -1;
            $('.chooser_search_ipt').focus();
        }else if(branch.isGroup === true){
            toggleGroup(branch);
        }else if(branch.IsDept){
            var emps = getEmpsInDept(branch) , len = emps.length;
            if(!isChecked(branch)){
                for(var i=len-1;i>=0;i--){
                    isChecked(emps[i]) && emps.splice(i,1);
                }
                len = emps.length;
                if($scope.selected.length + len > 80){
                    showOutOfLimit($event);
                    return false;
                }
                toggleEmps(emps);
            }else{
                toggleEmps(emps);
            }
        }
        // $event.stopPropagation();
    }
    var outOfLimitTip , removeTipTimer;
    // 显示超出群组人数上限提示信息
    function showOutOfLimit(e){
        var target = $(e.target || e.srcElement);
        var dom;
        if(target.parents('.emp_branch').size()){
            dom = target.parents('.emp_branch');
        }
        if(target.parents('.dept_branch').size()){
            dom = target.parents('.dept_branch');
        }
        if(target.parents('.repeat_block').size()){
            dom = target.parents('.repeat_block');
        }
        if(target.hasClass('emp_branch') || target.hasClass('result_item')){
            dom = target;
        }
        if(target.parents('.result_item').size()){
            dom = target.parents('.result_item');
        }
        if(!outOfLimitTip){
            outOfLimitTip = $('<div class="out_of_limit">'+langPack.getKey('maxNum')+'</div>');
        }
        dom.append(outOfLimitTip);
        if(removeTipTimer){
            $timeout.cancel(removeTipTimer);
            removeTipTimer = undefined;
        }
        removeTipTimer = $timeout(function(){
            outOfLimitTip.remove();
            outOfLimitTip = undefined;
        },5000);
    }
    var timer;
    $scope.$watch('keyword',function(){
        if(timer){
            $timeout.cancel(timer);
            timer = undefined;
        }
        timer = $timeout(function(){
            $scope.searchResult.length = 0;
            $scope.pageResult = [];
            $scope.selectedIndex = -1;
            $scope.page = 1;
            $scope.totalPage = 1;
            $('#emp_chooser_search_result')[0] && ($('#emp_chooser_search_result')[0].scrollTop = 0);
            if($scope.keyword){
                var result = empService.searchEmp($scope.keyword);
                var temp = $scope.selectedIndex = 0;
                $scope.totalPage = parseInt((result.length + $scope.pageSize - 1) / $scope.pageSize);
                [].push.apply($scope.searchResult,result);
                var pageResult = $scope.searchResult.slice(0,$scope.page * $scope.pageSize);
                [].push.apply($scope.pageResult,pageResult);
                var all = $scope.pageResult;
                all[temp] && (all[temp].active = true);
            }
        },300);
    })
    
    $scope.createChatRoom = function(){
        var selected = angular.copy($scope.selected) , slen = selected.length;
        if($scope.isForward){// 如果是转发消息
            if(selected.length == 0){
                alert(langPack.getKey('selectStaff'));
                return;
            }else{
                if(!confirm(langPack.getKey('confirmForward'))){
                    return;
                }
            }
            var forwardToCreateGroup = false;
            if(selected.length == 1){ // 如果只选择了一个目标直接发送
                forwardToEmp();
                return;
            }
            /* 
                判断选择的目标里是否只有群组
                如果只有群组则直接转发至群组
                如果有群组与员工，则需创建群聊再发送
                如果只有员工，则需创建群聊在发送
            */
            var onlyEmp = true , onlyGroup = true;
            var selectedMap = {};
            for(var i=0;i<selected.length;i++){
                if(selected[i].isGroup){
                    onlyEmp = false;
                    for(var j=0;j<selected[i].members.length;j++){
                        if(!selectedMap[selected[i].members[j].SUserId]){
                            selectedMap[selected[i].members[j].SUserId] = selected[i].members[j];
                        }
                    }
                }else{
                    onlyGroup = false;
                    if(!selectedMap[selected[i].SUserId]){
                        selectedMap[selected[i].SUserId] = selected[i];
                    }
                }
            }
            if(!onlyEmp && onlyGroup){
                forwardToEmp();
            }else{
                var account = currentEmp.SUserId;
                var unque = [];
                var isIn = false;
                for(var p in selectedMap){
                    if(selectedMap.hasOwnProperty(p)){
                        if(p == account){
                            isIn = true;
                        }else{
                            unque.push(selectedMap[p]);
                        }
                    }
                }
                // !isIn && unque.unshift(currentEmp);
                var now = (new Date()).getTime();
                var roomId = 'group_' + account + '_' + now;
                $scope.closeThisPop();
                var groupMsg = getForwardMsg(roomId);
                $rootScope.$broadcast('forwardMsg',roomId,unque,groupMsg);
            }
            function getForwardMsg(to){
                var msg = chatService.createMsgByMsg($scope.data.msg);
                msg.date = (new Date()).getTime();
                msg.messageid = currentEmp.SUserId + msg.date;
                msg.sendStatus = webConfig.MSG_SENDING;
                msg.fromuser = currentEmp.SUserId;
                msg.readtime = 0;
                msg.status = 0;
                msg.to = to;
                msg.grouped = true;
                return msg;
            }
            function forwardToEmp(){
                var forwardList = [];
                for(var i=0;i<selected.length;i++){
                    var msg = chatService.createMsgByMsg($scope.data.msg);
                    forwardList.push(msg);
                    msg.date = (new Date()).getTime();
                    msg.messageid = currentEmp.SUserId + msg.date;
                    msg.sendStatus = webConfig.MSG_SENDING;
                    msg.fromuser = currentEmp.SUserId;
                    msg.to = selected[i].isGroup ? selected[i].groupId : selected[i].SUserId;
                    msg.grouped = selected[i].isGroup;
                    socketConnect.sendMessage(msg);
                    $rootScope.$broadcast('onSendMsg',msg);
                    
                    chatService.addChat({
                        isService : false,
                        isGroup : selected[i].isGroup,
                        msgData : msg,
                        sender : selected[i].isGroup ? {} : selected[i],
                        id : selected[i].isGroup ? selected[i].groupId : selected[i].SUserId
                    })
                    empService.saveRecentEmp(selected[i].isGroup ? selected[i].groupId : selected[i].SUserId);
                }
                $timeout(function(){
                    for(var i=0;i<forwardList.length;i++){
                        var msg = forwardList[i];
                        if(msg.sendStatus == webConfig.MSG_SENDING){
                            msg.sendStatus = webConfig.MSG_SENDFAIL;
                        }
                    }
                },10000);
                $rootScope.$broadcast('forwardComplete');
                $scope.closeThisPop();
            }
            return;
        }
        if(slen < 2){
            $scope.closeThisPop();
            return;
        }
        if(!$scope.data.needCreate){
            var kick = getKick();
            var chat = chatService.getChat($scope.isGroup) , members = chat.members;
            var admin = {};
            for(var i=0;i<members.length;i++){
                members[i].isAdmin && (admin[members[i].SUserId] = 1);
            }
            var slen = selected.length;
            for(var i=slen - 1;i>=0;i--){
                if(admin[selected[i].SUserId]){
                    selected.splice(i,1);
                }
            }
            var newIn = [] , isIn , newInEmps = [];
            for(var i=0;i<selected.length;i++){
                isIn = false;
                for(var j=0;j<members.length;j++){
                    if(members[j].SUserId == selected[i].SUserId){
                        isIn = true;
                    }
                }
                if(!isIn){
                    newIn.push(empService.getEmpName(selected[i]));
                    var emp = empService.getEmpInfo(selected[i].SUserId);
                    emp.namePinyin = util.getPinyin(empService.getEmpName(emp));
                    emp.isAdmin = 0;
                    emp.state = empService.getEmpStatus(selected[i].SUserId) == 'online' ? 1 : 0;
                    members.push(emp);
                    newInEmps.push(selected[i]);
                }
            }
            if(newIn.length){
                socketConnect.inviteEmps($scope.isGroup,newInEmps);
            }
            kick.length && socketConnect.kickEmps($scope.isGroup,kick);
            // kick.length && strophe.kickEmps($scope.isGroup,kick);
            // strophe.
            $scope.closeThisPop();
            $rootScope.$broadcast('updateGroupAvatar' + $scope.isGroup,$scope.isGroup);
            $rootScope.$broadcast('resetRoomTempName',$scope.isGroup);
        }else{
            if(slen == 2){
                for(var p in $scope.map){
                    if(p != currentEmp.SUserId){
                        $scope.closeThisPop();
                        empService.saveRecentEmp(p);
                        if($state.current.name === 'chat'){
                            if(!chatService.isExist(p)){
                                chatService.addChat({
                                    isGroup : false,
                                    msgData : {},
                                    members : [],
                                    lastChatTime : util.getTime(1),
                                    sender : currentEmp,
                                    id : p
                                });
                            }else{
                                var chat = chatService.getChat(p);
                                chat.lastChatTime = util.getTime(1);
                            }
                            $rootScope.$broadcast('chatWith',p,false);
                        }else{
                            $state.go('chat',{
                                concat : p,
                                isGroup : false,
                                needCreate : false,
                                selected : ''
                            },{
                                reload : true
                            });
                        }
                    }
                }
            }else{
                var userId = currentEmp.SUserId;
                var now = (new Date()).getTime();
                var roomId = $scope.data.isGroup || 'group_' + userId + '_' + now;
                $scope.closeThisPop();
                if($state.current.name === 'chat'){
                    var chat = chatService.addChat({
                        isGroup : true,
                        msgData : {},
                        members : selected,
                        sender : currentEmp,
                        lastChatTime : util.getTime(1),
                        id : roomId,
                        needCreate : true
                    });
                    var tempName = [];
                    var newIn = getNewIn();
                    var names = [];
                    var users = [];
                    for(var i=0;i<newIn.length;i++){
                        if(newIn[i].SUserId == currentEmp.SUserId) continue;
                        tempName.push(empService.getEmpName(newIn[i]));
                        names.push(empService.getEmpName(newIn[i],1));
                        users.push(newIn[i].SUserId);
                    }
                    var kicked = getKick() , kickedNames = [];
                    for(var i=0;i<kicked.length;i++){
                        if(kicked[i].SUserId == currentEmp.SUserId) continue;
                        kickedNames.push(empService.getEmpName(kicked[i]));
                    }
                    if(newIn.length){
                        chatService.addMsg({
                            type : webConfig.MSG_SYSTEM_TYPE,
                            actor : userId,
                            users : users,
                            content : langPack.getKey('you') + langPack.getKey('invitedIntoGroup') + names.join('、') + langPack.getKey('invitedIntoGroupEnd')
                        },roomId);
                    }
                    if(kicked.length){
                        chatService.addMsg({
                            type : webConfig.MSG_SYSTEM_TYPE,
                            content : langPack.getKey('removedMemberAdminStart') + kickedNames.join('、') + langPack.getKey('removedMemberAdminEnd')
                        },roomId);
                    }
                    var _temp = [];
                    for(var i=0;i<selected.length;i++){
                        _temp.push(empService.getEmpName(selected[i]));
                    }
                    chat.tempName = _temp.join(',');
                    $rootScope.$broadcast('chatWith',roomId,true);
                }else{
                    $state.go('chat',{
                        concat : roomId,
                        isGroup : true,
                        selected : selected,
                        msgContent : $scope.msgContent,
                        needCreate : true
                    },{
                        reload : true
                    });
                }
                $rootScope.$broadcast('createTempRoom',selected,roomId);
            }
        }
    }
    
    $scope.$on('ngRepeatFinished',function(){
        $('.chooser_selected').scrollTop(100000);
    })
    $scope.loadMore = function(){
        var from = $scope.page * $scope.pageSize;
        $scope.page += 1;
        var to = $scope.page * $scope.pageSize;
        var pageResult = $scope.searchResult.slice(from , to);
        
        [].push.apply($scope.pageResult,pageResult);
    }
    function getKick(){
        var old = $scope.data.oldEmps || [], oLen = old.length;
        var selected = $scope.selected , sLen = selected.length;
        var kick = [];
        for(var i=0;i<oLen;i++){
            var isIn = false;
            for(var j=0;j<sLen;j++){
                if(old[i].SUserId == selected[j].SUserId){
                    isIn = true;
                }
            }
            if(!isIn){
                kick.push(old[i]);
            }
        }
        return kick;
    }
    function getNewIn(){
        var newIn = [];
        var selected = $scope.selected , sLen = selected.length;
        var old = $scope.data.oldEmps || [], oLen = old.length;
        for(var i=0;i<sLen;i++){
            var isIn = false;
            for(var j=0;j<oLen;j++){
                if(old[j].SUserId == selected[i].SUserId){
                    isIn = true;
                }
            }
            if(!isIn){
                newIn.push(selected[i]);
            }
        }
        return newIn;
    }
    // $scope.$on('createRoomSuccess',function(ev,roomId){
        // empService.saveRecentEmp(roomId);
        // var selected = angular.copy($scope.selected);
        // var chat = chatService.getChat(roomId);
        // if(!chat){
            // chat = chatService.initBlankChat(roomId,true);
        // }
        // for(var i=selected.length - 1;i>=0;i--){
            // if(selected[i].SEmpAccount == currentEmp.SEmpAccount){
                // selected.splice(i,1);
            // }
        // }
        // strophe.getRoomSubject(roomId);
        // strophe.getRoomMembers(roomId);
        // if($scope.isGroup){
            // var kick = getKick();
            // strophe.inviteEmps(selected);
            // strophe.kickEmps(kick);
        // }else{
            // strophe.inviteEmps(roomId,selected);
        // }
        // setTimeout(function(){
            // $scope.closeThisPop();
        // },200);
        // $state.go('chat',{
            // concat : roomId,
            // isGroup : true
        // });
    // })
    
    // $scope.$on('createRoomFail',function(){
        // alert('群聊创建失败');
    // })
    $scope.isAdmin = function(){
        if($scope.isGroup){
            var chat = chatService.getChat($scope.isGroup);
            if(chat.needCreate){
                return  true;
            }
            if(currentEmp.SUserId == empService.getGroupAdmin($scope.isGroup)){
                return true;
            }
            return false;
        }else{
            return true;
        }
    }
    $scope.canCancel = function(branch){
        if(branch.IsEmp || (branch.IsEmp === undefined && branch.IsDept === undefined && branch.isGroup === undefined)){
            return $scope.oldMap[branch.SUserId] && !$scope.isAdmin();
        }else if(branch.isGroup){
            return false;
        }else if(branch.IsDept){
            var emps = getEmpsInDept(branch);
            for(var i=0;i<emps.length;i++){
                if(!$scope.canCancel(emps[i])) return false;
            }
            return true;
        }
    }
    $scope.onKeyDown = function(e){
        var temp = $scope.selectedIndex;
        var all = $scope.pageResult;
        all[temp] && (all[temp].active = false);
        var change = 0;
        if(e){
            if(e.keyCode == '38'){
                temp --;
                $scope.selectedIndex = Math.max(0,temp);
                change = - 69;
            }
            if(e.keyCode == '40'){
                temp ++;
                $scope.selectedIndex = Math.min(all.length - 1,temp);
                change = 69;
            }
            if(e.keyCode == '13'){
                if(all[$scope.selectedIndex]){
                    var addResult = $scope.toggleSelect(all[$scope.selectedIndex],{
                        target : $('.search_result .active'),
                        stopPropagation : e.stopPropagation
                    });
                    if(addResult != false){
                        $scope.keyword = '';
                        $scope.selectedIndex = -1;
                        $('.chooser_search_ipt').focus();
                    }
                }
            }
        }
        all[$scope.selectedIndex] && (all[$scope.selectedIndex].active = true);
        var active = $('#emp_chooser_search_result').find('.active')[0];
        if(active){
            // console.log(active.offsetTop,$('#emp_chooser_search_result').height(),$('#emp_chooser_search_result').height() - 62 - (util.browser.chrome ? 17 : 0))
            if(active.offsetTop > ($('#emp_chooser_search_result').height() - 138 - (util.browser.chrome ? 17 : 0))){
                $('#emp_chooser_search_result')[0].scrollTop =  $('#emp_chooser_search_result')[0].scrollTop + change;
            }
        }
    }
    $scope.$on('roomNotFound',function(ev,roomId){
        removeRoom(roomId);
    })
    $scope.$on('empNotInRoom',function(ev,roomId){
        removeRoom(roomId);
    })
    function removeRoom(roomId){
        $timeout(function(){
            for(var i=$scope.mineGroups.length - 1;i>=0;i--){
                if($scope.mineGroups[i].groupId == roomId){
                    $scope.mineGroups.splice(i,1);
                }
            }
        })
    }
}])

controllers.controller('empController',['$scope','$stateParams','$state','empService','pops','$rootScope','concatService','util',function($scope,$stateParams,$state,empService,pops,$rootScope,concatService,util){
    var emp = $scope.emp = $scope.data.emp;
    // $scope.leader = empService.getEmpInfoFromEnt(emp.SEntId,emp.SLeader);
    // $scope.leader = $scope.leader.length ? $scope.leader[0] : {};
    $scope.loginEmp = empService.getLoginEmp();
    $scope.concatId = emp.SUserId;
    $scope.isGroup = false;
    $scope.userEnts = [];
    $scope.idx = 0;
    $scope.canSendMessage = false;
    
    $scope.isFriend = concatService.isFriend(emp.SUserId);
    $scope.isBroad = util.isBroad(emp.SUserId);
    if(emp.SUserId == $scope.loginEmp.SUserId){
        $scope.isFriend = false;
    }
    var loginUserEnts = empService.getLoginUserEnts();
    var currentUserEntMap = {};
    for(var i=0;i<loginUserEnts.length;i++){
        currentUserEntMap[loginUserEnts[i].SEntId] = loginUserEnts[i];
    }
    var empName = emp.SName;
    var userEnts = emp.entInfo;
    for(var i=0;i<userEnts.length;i++){
        var entId = userEnts[i].SEntId;
        if((userEnts[i].SShowEnt != '1' || userEnts[i].SStatus.toLowerCase() == 'n') || !empService.isColleague(emp.SUserId,entId)) continue;
        var ent = {};
        ent.entName = userEnts[i].SEntName;
        ent.showDetail = true;
        if(currentUserEntMap[entId]){
            var empBaseInfo = empService.getUserBaseInfo(entId,emp.SUserId);
            // ent.showDetail = true;
            $scope.canSendMessage = true;
            ent.depts = empService.getUserEntDepts(entId,emp.SUserId);
            if(!ent.depts.length){
                ent.depts = [ent.entName];
            }
            ent.userName = userEnts[i].SEmpName || empBaseInfo.SShowName || empBaseInfo.SName || empBaseInfo.SEmpName || empName;
            ent.empPost = userEnts[i].SShowPost == '1' ? userEnts[i].SPost : '';
            ent.companyEmail = empBaseInfo.SEmpMail;
            ent.empNo = empBaseInfo.SEmpNo;
            ent.address = emp.SNowAddress;
            var leader = empService.getEmpInfoFromEnt(entId,empBaseInfo.SLeader);
            ent.leader = leader.length ? leader[0] : {};
        }else{
            ent.depts = [ent.entName];
            ent.userName =  userEnts[i].SEmpName || empName;
            ent.empPost = userEnts[i].SShowPost == '1' ? userEnts[i].SPost : '';
        }
        $scope.userEnts.push(ent);
    }
    $scope.scrollEnt = function(idx){
        $scope.idx = idx;
        $('.user_ents').animate({
            scrollLeft : idx * 493
        },200);
    }
    $scope.scrollEntByArrow = function(add){
        $scope.idx = $scope.idx + add;
        $scope.idx = Math.max(0 , $scope.idx);
        $scope.idx = Math.min( $scope.idx , $scope.userEnts.length - 1);
        $('.user_ents').animate({
            scrollLeft : $scope.idx * 493
        },200);
    }
    $scope.delFriend = function(userId){
        concatService.delFriend(userId,function(){
            $scope.closeThisPop(true);
        });
    }

    $scope.chatWith = function(){
        if($state.current.name === 'chat'){
            $rootScope.$broadcast('chatWith',emp.SUserId,false);
        }else{
            $state.go('chat',{
                concat : emp.SUserId,
                isGroup : false,
                selected : '',
                msgContent : ''
            },{
                reload : true
            })
        }
        $scope.closeThisPop();
        pops.closeAllPop();
    }
}])

controllers.controller('groupInfoController',['$scope','strophe','concatService','empService','$rootScope','pops','domain','chatService','$timeout','langPack','socketConnect',function($scope,strophe,concatService,empService,$rootScope,pops,domain,chatService,$timeout,langPack,socketConnect){
    var currentEmp = empService.getLoginEmp();
    if(!$scope.data.isGroup){
        var userId = $scope.data.currentUserId;
        $scope.currentUser = empService.getEmpInfo(userId);
        concatService.getConcatList().then(function(list){
            var frequentList = list.frequentList;
            var topList = list.topList;
            for(var i=0;i<frequentList.length;i++){
                if(userId == frequentList[i].id.SFrequenterUserId){
                    $scope.save = true;
                }
            }
            for(var j=0;j<topList.length;j++){
                if(userId == topList[j].id.SChatId && topList[j].STop.toLowerCase() == 'y'){
                    $scope.saveTop = true;
                }
            }
            $scope.disturb = empService.isBlocked(userId) ? true : false;
        })
    }else{
        var group_amdin = {};
        var group = $scope.data.group;
        var group_members = group.members;
        $scope.room = {};
        $scope.room.name = group.name || group.tempName;
        $scope.room.inputName = util.htmlDecode($scope.room.name);
        // $scope.room.name = util.htmlDecode($scope.room.name);
        var groupAdminId = empService.getGroupAdmin(group.id);
        for(var i=0;i<group_members.length;i++){
            if(groupAdminId == group_members[i].SUserId){
                group_members[i].isAdmin = 1;
            }else{
                group_members[i].isAdmin = 0;
            }
            group_members[i].state = empService.getEmpStatus(group_members[i].SUserId) == 'online' ? 1 : 0;
            // if(group_members[i].isAdmin === undefined) group_members[i].isAdmin = false;
            group_members[i].namePinyin = util.getPinyin(empService.getEmpName(group_members[i]));
            // console.log(empService.getEmpName(group_members[i]),group_members[i].state,group_members[i].isAdmin)
        }
        $scope.$on('empStatusChange',function(e,empAccounts,status,resource){
            for(var i=0;i<empAccounts.length;i++){
                for(var j=0;j<group_members.length;j++){
                    if(group_members[j] && empAccounts[i] == group_members[j].SUserId){
                        // empService.setEmpStatus(group_members[j].SUserId,resource,status);
                        group_members[j].state = empService.getEmpStatus(group_members[j].SUserId) == 'online' ? 1 : 0;
                    }
                }
            }
        });
        
        for(var i=0; i<group_members.length;i++){
            if(group_members[i].SUserId == groupAdminId){
                for(var p in group_members[i]){
                    group_amdin[p] = group_members[i][p];
                }
            }
        }
        group.group_admin = group_amdin;
        $scope.group = group;
        $scope.isAdminEmp = group_amdin.SUserId == currentEmp.SUserId;
        //是否添加了常用群组/置顶
        concatService.getConcatList().then(function(list){
            var concat_groups = list.groupList;
            var topList=list.topList;
            for(var i=0;i<concat_groups.length;i++){
                if(group.id == concat_groups[i].groupId){
                    $scope.save = true;
                }
            }
            for(var j=0;j<topList.length;j++){
                if(group.id == topList[j].id.SChatId && topList[j].STop.toLowerCase() == 'y'){
                    $scope.saveTop = true;
                }
            }
            $scope.disturb = empService.isBlocked(group.id) ? true : false;
        })
    }
    $scope.$on('setChatToTop',function(event,chatId){
        $timeout(function(){
            if(chatId == $scope.data.currentUserId || chatId == $scope.data.group.id){
                $scope.saveTop = true;
            }
        })
    });
    $scope.isBroad = function(){
        var chatId;
        if(!$scope.data.isGroup){
            chatId = $scope.data.currentUserId;
        }else{
            chatId = $scope.data.group.id;
        }
        return util.isBroad(chatId);
    }
    $scope.$on('cancelChatToTop',function(event,chatId){
        $timeout(function(){
            if(chatId == $scope.data.currentUserId || chatId == $scope.data.group.id){
                $scope.saveTop = false;
            }
        })
    });
    // console.log(group_amdin,currentEmp);
    //console.log($scope.group);
    var oldName;
    $scope.change = function(event){
        oldName = $scope.room.inputName;
        $scope.changeTag = true;
    };
    $scope.$on('$destroy',function(){
        $rootScope.$broadcast('groupInfoPopuClosed');
    })
    $scope.nameChanged = function(e){
        var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g; 
        if($scope.room.inputName.match(regRule)) { 
            $scope.room.inputName = $scope.room.inputName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""); 
            alert(langPack.getKey('errorEmjgroupName')); 
        }
        if($scope.room.inputName.length > 16){
            alert(langPack.getKey('errorGroupName'));
            $scope.changeTag = false;
            // $timeout(function(){
                // e.target.focus();
            // },100);
            return;
        }
        $scope.changeTag = false;
        if($scope.room.inputName == ''){
            $scope.room.name = group.tempName;
            $scope.room.inputName = group.tempName;
        }else{
            if(oldName != $scope.room.inputName){
                $scope.room.name = $scope.room.inputName;
                socketConnect.changeRoomSubject(group.id,$scope.room.inputName);
            }
        }
    };
    $scope.addEmp = function(){
        var selected = $scope.data.isGroup ? $scope.group.members : [$scope.currentUser];
                // selected : angular.copy(selected),
                // isGroup : $scope.isGroup ? $scope.concatId : false,
                // oldEmps : angular.copy(selected),
                // msgContent : $scope.msg.msgContent,
                // needCreate : needCreate
        pops.open({
            templateUrl : 'empChooser.html',
            data : {
                selected : angular.copy(selected),
                isGroup : $scope.data.isGroup ? $scope.data.group.id : false,
                oldEmps : $scope.data.isGroup ? angular.copy(selected) : [],
                msgContent : $scope.data.msgContent,
                needCreate : $scope.data.isGroup ? $scope.data.needCreate : true
            },
            className : 'radius10',
            controller: "empChooserController"
        })
        $scope.closeThisPop();
    }
    //减人
    $scope.delEmp=function(){
        $scope.delChecked = !$scope.delChecked;
    };
    var deling = {};
    $scope.del=function(emp){
        var _acc = emp.SUserId;
        if(deling[_acc]) return;
        deling[_acc] = 1;
        // strophe.kickEmps(group.id,[emp],'');
        socketConnect.kickEmps(group.id,[emp],'');
    };
    $scope.$on('document.click',function(){
        $timeout(function(){
            pops.close($scope.$dialogId);
        })
    });
    function empLeaveRoom(roomId,emps){
        $timeout(function(){
            var len = group.members.length;
            var len1= emps.length;
            var isIn = false;
            for(var j=0;j<len1;j++){
                var emp = emps[j];
                for(var i=len-1;i>=0;i--){
                    var member=group.members[i];
                    if(emp.SUserId==member.SUserId){
                       $scope.group.members.splice(i,1);
                       isIn = true;
                   }
                }
            }
            if(isIn){
                chatService.removeChat(roomId);
                empService.removeRecent(emp.SUserId,roomId);
                if(roomId == group.id){
                    $scope.closeThisPop();
                }
            }
        })
    }
    $scope.$on('empKicked',function(e,roomId,emps){
        empLeaveRoom(roomId,emps);
    })
    $scope.$on('empLeave',function(e,roomId,emps){
        empLeaveRoom(roomId,emps);
    })

    //添加/删除常用群组
    $scope.saveGroup = function(){
        if($scope.data.isGroup){
            var groupId = group.id;
            if(!$scope.save){
                concatService.addGroup(groupId,function(res){
                    if(res.code == 0){
                        $scope.save = true;
                    }
                })
            }else{
                concatService.delGroup(groupId,function(res){
                    if(res.code == 0){
                        $scope.save = false;
                    }
                })
            }
        }else{
            if(!$scope.save){
                concatService.addFrequents($scope.data.currentUserId,function(res){
                    if(res.code == 0){
                        $scope.save = true;
                    }
                })
            }else{
                concatService.delFrequents($scope.data.currentUserId,function(res){
                    if(res.code == 0){
                        $scope.save = false;
                    }
                })
            }
        }
    }
    //添加/删除置顶
    $scope.setTop = function(){
        var chatId = $scope.data.isGroup ? group.id : $scope.data.currentUserId;
        if(!$scope.saveTop){
            concatService.setMsgTop(chatId,$scope.data.isGroup).then(function(data){
                if(data.data.code == 0){
                    $scope.saveTop = true;
                    $rootScope.$broadcast('setChatToTop',chatId)
                }
            })
        }else{
            concatService.delMsgTop(chatId,$scope.data.isGroup).then(function(data){
                //console.log(data)
                if(data.data.code == 0){
                    $scope.saveTop = false;
                    $rootScope.$broadcast('cancelChatToTop',chatId)
                }
            })
        }
    }
    // 消息免打扰设置
    $scope.setDisturb = function(){
        var chatId = $scope.data.isGroup ? group.id : $scope.data.currentUserId;
        var chat = chatService.getChat(chatId);
        if(!$scope.disturb){
            concatService.blockChat(chatId,$scope.data.isGroup).then(function(data){
                if(data.data.code == 0){
                    $scope.disturb = true;
                    chat.isBlocked = true;
                }
            })
        }else{
            concatService.cancelBlockChat(chatId,$scope.data.isGroup).then(function(data){
                if(data.data.code == 0){
                    $scope.disturb = false;
                    chat.isBlocked = false;
                }
            })
        }
    }
    $scope.canDel = function(){
        if(currentEmp.SUserId == group.group_admin.SUserId){
           return true;
        }
    }
    $scope.isAdmin = function(emp){
        var flag = false;
       if(emp.SUserId == group.group_admin.SUserId){
           flag = true;
       }
        return flag;
    }
    $scope.leaveRoom = function(){
        if(currentEmp.SUserId == group_amdin.SUserId){
            alert(langPack.getKey('leaveError'));
            return;
        }
        chatService.removeChat(group.id);
        // strophe.leaveRoom(group.id);
        socketConnect.leaveRoom(group.id);
        $scope.closeThisPop();
    }
    $scope.checkShutUpStatus = function(userId){
        return socketConnect.checkShutUpStatus($scope.data.group.id,userId);
    }
}])


// 视频： type = video    url = 文件地址   thumb = 视频缩略图  content = 视频秒数，typeex = 文件大小单位kb
// 语音： type = voice    url = 文件地址  thumb = '' content = ''，typeex = 语音秒数
// 文件： type = file content = 文件名 typeex = 文件大小
// 图片： type = pic thumb = 图片缩略图 content = '' typeex = ''

// /IMFileServer/file/user/upload 上传路径

// userId(登录用户名)，uploadFile:文件内容

controllers.controller('faceController',['$scope','pops','faces','$rootScope','$timeout',function($scope,pops,faces,$rootScope,$timeout){
    var cates = faces.cates;
    var decs = faces.titles;
    $scope.cates = cates;
    $scope.decs = decs;
    
    $scope.current = 0;
    $scope.faces = decs[$scope.current];
    
    $scope.$on('document.click',function(){
        $timeout(function(){
            pops.close($scope.$dialogId);
        })
    });
    $scope.insertFace = function(idx){
        var name = cates[$scope.current];
        $scope.inertHtmlToEditArea('<img src="'+location.origin+'/images/spacer.gif" class="'+name+'_face '+name+'_'+idx+'" title="['+$scope.faces[idx]+']"/>');
    }
    $scope.changeCate = function(idx){
        $scope.current = idx;
        $scope.faces = decs[$scope.current];
    }
    $scope.faceKeyDown = function(e){
        if(e.keyCode == 13){
            e.preventDefault();
        }
    }
    $scope.faceKeyUp = function(e){
        if(e.keyCode == 13){
            $scope.data.parent.sendTextMsg();
            e.preventDefault();
        }
    }
    $scope.$on('onSendMsg',function(){
        pops.close($scope.$dialogId);
    })
}]);


controllers.controller('atEmpController',['$scope','pops','$rootScope','util','empService',function($scope,pops,$rootScope,util,empService){
    $scope.atEmp = $scope.data.parentScope.atEmp;
    $scope.data.parentScope.atEmpScope = $scope;
    $scope.$on('$destroy',function(){
        $rootScope.$broadcast('atEmpControllerDestroy');
        // delete $scope.data.parentScope.atEmpScope;
    })
    var currentEmp = empService.getLoginEmp();
    var dms = $scope.data.members , dml = dms.length;
    $scope.result = [];
    $scope.members = [];
    $scope.index = -1;
    for(var i=0;i<dml;i++){
        if(currentEmp.SUserId != dms[i].SUserId && empService.getEmpName(dms[i]) != ''){
            $scope.members.push(dms[i]);
            $scope.result.push(dms[i]);
        }
    }
    var isZhcn = /^[a-z0-9]/;
    function filterEmp(){
        $scope.result.length = 0;
        $scope.index = -1;
        var keyword = $scope.data.parentScope.atEmp.keyword;
        keyword = keyword.toLowerCase();
        var pushed = {};
        var pyKey = util.getPinyin(keyword);
        if(!isZhcn.test(keyword)){
            var idx;
            var temp = [];
            for(var i=0;i<dms.length;i++){
                if(dms[i].SUserId == currentEmp.SUserId || !dms[i].SUserId) continue;
                dms[i].IsEmp = true;
                var empName = empService.getEmpName(dms[i]);
                idx = empName.indexOf(keyword);
                if(idx != -1){
                    temp.push([idx,dms[i]]);
                    pushed[dms[i].SUserId] = 1;
                }
            }
            temp.sort(function(v1,v2){
                return v1[0] < v2[0] ? -1 : 1;
            })
            for(var i=0;i<temp.length;i++){
                $scope.result.push(temp[i][1]);
            }
        }else{
            for(var i=0;i<dms.length;i++){
                if(dms[i].SUserId == currentEmp.SUserId || !dms[i].SUserId) continue;
                var empName = empService.getEmpName(dms[i]);
                var namePinyin = util.getPinyin(empName);
                if(dms[i].SUserId && !pushed[dms[i].SUserId] && (dms[i].SUserId.indexOf(pyKey) != -1 || namePinyin.indexOf(pyKey) != -1)){
                    $scope.result.push(dms[i]);
                    pushed[dms[i].SUserId] = 1;
                }
            }
        }
        if($scope.result.length == 0){
            // console.log($('#'+$scope.$dialogId))
            $('#'+$scope.$dialogId).hide();
        }else{
            $('#'+$scope.$dialogId).show();
        }
    }
    $scope.$watch('data.parentScope.atEmp.keyword',function(v){
        $scope.result.length = 0;
        $scope.index = -1;
        if(v == ''){
            [].push.apply($scope.result,$scope.members);
            $('#'+$scope.$dialogId).show();
        }else{
            filterEmp();
        }
    })
    
    var container = $('#at_emp_con')[0];

    $scope.keydown = function(e){
        var temp = $scope.index;
        var change = 0;
        if(e.keyCode == '38'){
            // temp --;
            $scope.index = temp <= 0 ? (temp = $scope.result.length - 1) : Math.max(0,--temp);
            e.preventDefault();
        }
        if(e.keyCode == '40'){
            // temp ++;
            $scope.index = temp >= $scope.result.length - 1 ? (temp = 0) : Math.min($scope.result.length - 1,++temp);
            e.preventDefault();
        }
        if(e.keyCode == '13'){
            if($scope.result[$scope.index]){
                atEmp($scope.result[$scope.index]);
                $scope.closeThisPop();
            }
        }
        var activeTop = temp * 38;
        var totalHeight = container.offsetHeight - 20;
        var scrollTop = container.scrollTop;
        if(scrollTop > activeTop){
            container.scrollTop = 0;
        }else{
            container.scrollTop = util.browser.mozilla ? activeTop + 38  - totalHeight + temp / 2 : activeTop + 18  - totalHeight ;
        }
    }
    function atEmp(emp){
        var name = empService.getEmpName(emp);
        var userId = emp.SUserId;
        var width = util.getStringWidth('@' + name);
        $scope.inertHtmlToEditArea('<input class="_at_emp" type="text" readonly="readonly" at="'+userId+'" value="@'+name+'" style="line-height:16px;width:'+width+'px"/>');
    }
    $scope.atEmp = function(emp,e){
        for(var i=0;i<$scope.result.length;i++){
            if(emp.SUserId == $scope.result[i].SUserId){
                $scope.index = i;
            }
        }
        $scope.data.parentScope.keyDownSend({
            keyCode : 13,
            preventDefault : function(){},
            isClick : true
        })
        e.preventDefault();
        e.stopPropagation();
    }
    $scope.empMouseDown = function(emp){
        $scope.data.parentScope.rememberRange();
    }
    $scope.$on('document.click',function(){
        pops.close($scope.$dialogId);
    });
}]);

controllers.controller('contextMenuController',['$scope','domain','$timeout','$rootScope','util','empService','chatService','concatService','langPack','webConfig',function($scope,domain,$timeout,$rootScope,util,empService,chatService,concatService,langPack,webConfig){
    $scope.menuList = [];
    $scope.style = {
        top : 0,left:0
    }
    $scope.showMenu = false;
    var target;
    $scope.$on('contextMenu',function(ev,menuData,pos){
        target = ev.target;
        $timeout(function(){
            angular.extend($scope.style,pos);
            initMenu(menuData.type,menuData);
            $scope.menuList.length && ($scope.showMenu = true);
        })
    })
    function callbackWarper(callback){
        return function($event){
            callback && callback.apply(undefined,arguments);
            $scope.showMenu = false;
            $scope.menuList.length = 0;
            $event.preventDefault();
            $event.stopPropagation();
        }
    }
    
    function initMenu(type,menuData){
        $scope.menuList.length = 0;
        switch(type){
            case 'chat' : 
                var chatList = chatService.getChatList();
                var chat = chatService.getChat(menuData.data);
                if(menuData.data == 'service_chat_converge'){
                    break;
                }
                $scope.menuList.push({
                    name : chat.isTop ? langPack.getKey('cancelTop') : langPack.getKey('setTop'),
                    callback : callbackWarper(function(){
                        if(!chat.isTop){
                            concatService.setMsgTop(chat.id,chat.isGroup).then(function(data){
                                if(data.data.code==0){
                                    $rootScope.$broadcast('setChatToTop',menuData.data);
                                }
                            });
                        }else{
                            concatService.delMsgTop(chat.id,chat.isGroup).then(function(data){
                                if(data.data.code==0){
                                    $rootScope.$broadcast('cancelChatToTop',menuData.data);
                                }
                            });
                        }
                    })
                });
                $scope.menuList.push({
                    name : langPack.getKey('deleteChat'),
                    callback : callbackWarper(function(){
                        $rootScope.$broadcast('deleteChat',menuData.data);
                    })
                });
                break;
            case 'msg':
                if(menuData.forwardable == 1){
                    $scope.menuList.push({
                        name : langPack.getKey('forward'),
                        callback : callbackWarper(function(){
                            $rootScope.$broadcast('forward',menuData.data);
                        })
                    });
                    $scope.menuList.push({
                        isCopy : true,
                        name : langPack.getKey('copy'),
                        copyData : function(){
                            var msg = chatService.getMessage(menuData.data);
                            var str = msg.content.replace(/<br>/g,'\n');
                            str = util.faceToImg(str);
                            str = util.faceToFont(str);
                            str = util.convertAtToMob(str,empService.getEmpInfo,empService.getEmpName);
                            return util.htmlDecode(str);
                        },
                        callback : callbackWarper(function(e){
                        })
                    });
                    var currentUser = webConfig.getUser();
                    if(menuData.msg.sender.SUserId == currentUser.SUserId){
                        var _now = util.getNow();
                        var allowTime = 2 * 60 * 1000;
                        if(_now - menuData.msg.selfDate < allowTime){
                            $scope.menuList.push({
                                name : langPack.getKey('withDraw'),
                                callback : callbackWarper(function(e){
                                    var _now = util.getNow();
                                    if(_now - menuData.msg.selfDate > allowTime){
                                        alert(langPack.getKey('canNotWithDraw'));
                                        return;
                                    }
                                    $rootScope.$broadcast('withDrawMyMsg',menuData.data);
                                })
                            });
                        }
                    }
                }
                break;
            case webConfig.MSG_PIC_TYPE :
            case 'pic' :
                $scope.menuList.push({
                    name : langPack.getKey('forward'),
                    callback : callbackWarper(function(){
                        $rootScope.$broadcast('forward',menuData.data);
                    })
                });
                break;
            default:
                break;
        }
    }
    $scope.$on('document.click',function(){
        $scope.showMenu = false;
        $scope.menuList.length = 0;
    });
    $scope.$on('hiddenMenu',function(){
        $scope.showMenu = false;
        $scope.menuList.length = 0;
    })
}]);

/**
    controller_2.js
*/

controllers.controller('concatController',['$rootScope','$state','$stateParams','$scope','strophe','concatService','empService','$timeout','webConfig','socketConnect',function($rootScope,$state,$params,$scope,strophe,concatService,empService,$timeout,webConfig,socketConnect){
    $scope.concat = $params.concat;
    $scope.groupList = [];
    $scope.firendsList = [];
    $scope.frequentList = [];
    $scope.dataReceive = false;
    var groupList,frequentList;
    $scope.$on('unkownEmp',function(ev,userId){
        $timeout(function(){
            for(var i=$scope.firendsList.length - 1;i>=0;i--){
                if($scope.firendsList[i].SUserId == userId){
                    $scope.firendsList.splice(i,1);
                }
            }
            for(var i=$scope.frequentList.length - 1;i>=0;i--){
                if($scope.frequentList[i].SUserId == userId){
                    $scope.frequentList.splice(i,1);
                }
            }
        });
    })
    $scope.$on('getLastestEmpInfo',function(ev,emp){
        $timeout(function(){
            for(var i=0;i<$scope.groupList.length;i++){
                var accounts = $scope.groupList[i].members;
                var tempName = [];
                for(var k=0;k<accounts.length;k++){
                    tempName.push(accounts[k].SShowName || accounts[k].SName);
                }
                if(!$scope.groupList[i].groupName){
                    $scope.groupList[i].tempName = tempName.join(',');
                }
            }
            for(var i=$scope.frequentList.length - 1;i>=0;i--){
                if($scope.frequentList[i].SUserId == emp.SUserId){
                    
                    for(var p in emp){
                        $scope.frequentList[i][p] = emp[p];
                    }
                }
            }
        })
    })
    concatService.getConcatList().then(function(list){
        $scope.dataReceive = true;
        //群组
        //console.log(arguments);
        groupList = list.groupList;
        if(groupList){
            groupList.toggle = false;
        }
        var _groups = [] , temp;
        for(var j=0;j<groupList.length;j++){
            if(groupList[j].needConverge === false){
                _groups.push(groupList[j]);
                continue;
            }
            socketConnect.getGroupInfo(groupList[j].groupId);
            temp = {};
            var v = groupList[j];
            temp.groupId= v.groupId;
            temp.members = [];
            temp.groupName = v.groupName;
            var emails = [] , tempName = [];
            var accounts = [];
            if(v.groupCreator){
                creator = empService.getEmpInfo(v.groupCreator);
                accounts.push(creator);
            }
            if(v.members){
                temp.members.push(creator);
                for(var i=0;i< v.members.length;i++){
                    if(v.members[i] == v.groupCreator) continue;
                    if(v.members[i]){
                        var uid = v.members[i];
                        var emps = empService.getEmpInfo(uid,'SUserId',function(emp){
                            $timeout(function(){
                                if(emp.SUserId == uid){
                                    for(var p in emp){
                                        emps[p] = emp[p];
                                    }
                                }
                            })
                        });
                        temp.members.push(emps);
                        if(emps){
                            accounts.push(emps);
                            v.members[i].emps=emps;
                            // emails.push(emps.SMailAccount);
                        }
                    }
                }
            }
            accounts.sort(function(v1,v2){
                var name1 = v1.SShowName || v1.SName;
                var pinyin1 = util.getPinyin(name1);
                var name2 = v2.SShowName || v2.SName;
                var pinyin2 = util.getPinyin(name2);
                return pinyin1 > pinyin2;
            })
            for(var i=0;i<accounts.length;i++){
                tempName.push(accounts[i].SShowName || accounts[i].SName);
            }
            // v.emails = emails.join(',');
            v.tempName = tempName.join(',');
            // temp.emails = v.emails;
            temp.tempName = v.tempName;
            _groups.push(temp);
        }
        $scope.groupList = _groups;
        $scope.groupList.isGroup = true;
        //联系人
        frequentList = list.frequentList;
        $scope.frequentList = [];
        if(frequentList){
            frequentList.toggle = false;
        }
        for(var i=0;i<frequentList.length;i++){
            var _emp = empService.getEmpInfo(frequentList[i].id.SFrequenterUserId,'SUserId');
            // _emp.SUserId = frequentList[i].id.SFrequenterUserId;
            // console.log(frequentList[i].id.SFrequenterUserId,_emp);
            $scope.frequentList.push(_emp);
        }
        angular.forEach(list.firendsList,function(v,k){
            $scope.firendsList.push(v)
        });
        $scope.frequentList.isGroup = false;
        $scope.firendsList.isGroup = false;
    });
    //联系人说明
    $scope.currentIsFriend = false;
    $scope.concatPerson = function(list,isGroup,isFriend){
        $scope.selected = undefined;
        $scope.personInfo = {};
        if(isGroup){
            $scope.concat = true;
            $scope.isGroup = isGroup;
            $scope.personInfo = list;
            $scope.concatId = list.groupId;
        }else{
            empService.getLastestEmpInfo(list.SUserId).then(function(data){
                $scope.concat = true;
                $scope.isGroup = isGroup;
                var emp = data.data.userInfo;
                var tempObj = angular.copy(emp);
                for(var p in tempObj){
                    $scope.personInfo[p] = tempObj[p];
                }
                $scope.personInfo.userEnts = [];
                var loginUserEnts = empService.getLoginUserEnts();
                var currentUserEntMap = {};
                for(var i=0;i<loginUserEnts.length;i++){
                    currentUserEntMap[loginUserEnts[i].SEntId] = loginUserEnts[i];
                }
                var empName = emp.SName;
                var userEnts = emp.entInfo;
                for(var i=0;i<userEnts.length;i++){
                    var entId = userEnts[i].SEntId;
                    if((userEnts[i].SShowEnt != '1' || userEnts[i].SStatus.toLowerCase() == 'n') || !empService.isColleague(emp.SUserId,entId)) continue;
                    var ent = {};
                    ent.entName = userEnts[i].SEntName;
                    ent.showDetail = true;
                    if(currentUserEntMap[entId]){
                        var empBaseInfo = empService.getUserBaseInfo(entId,emp.SUserId);
                        // ent.showDetail = true;
                        $scope.personInfo.canSendMessage = true;
                        ent.depts = empService.getUserEntDepts(entId,emp.SUserId);
                        if(!ent.depts.length){
                            ent.depts = [ent.entName];
                        }
                        ent.userName = userEnts[i].SEmpName || empBaseInfo.SShowName || empBaseInfo.SName || empBaseInfo.SEmpName || empName;
                        ent.empPost = userEnts[i].SShowPost == '1' ? userEnts[i].SPost : '';
                        ent.companyEmail = empBaseInfo.SEmpMail;
                        ent.empNo = empBaseInfo.SEmpNo;
                        ent.address = emp.SNowAddress;
                        var leader = empService.getEmpInfoFromEnt(entId,empBaseInfo.SLeader);
                        ent.leader = leader.length ? leader[0] : {};
                    }else{
                        ent.depts = [ent.entName];
                        ent.userName = userEnts[i].SEmpName || empName;
                        ent.empPost = userEnts[i].SShowPost == '1' ? userEnts[i].SPost : '';
                    }
                    $scope.personInfo.userEnts.push(ent);
                }
                // for(var p in emp){
                    // list[p] = emp[p];
                // }
                // if(!isFriend){
                    // var emps = empService.getEmpInfoFromEnt(list.SEntId,list.SLeader);
                    // list.leader = emps.length ? emps[0] : {};
                // }
                // $scope.personInfo = list;
                $scope.concatId = list.SUserId || list.groupId;
            });
        }
        $scope.currentIsFriend = isFriend;
    };
    $scope.chatWith=function(_concat,isGroup){
        $state.go('chat',{
            concat : _concat,
            isGroup : isGroup
        });
    }
    
    $scope.toggle = function(arr,name){
        if(arr){
            this[name].toggle = arr.toggle ? false : true;
            this[name].opened = true;
        }
    }
    $scope.$on('delFriend',function(e,userId){
        var len = $scope.firendsList.length;
        for(var i=len-1;i>=0;i--){
            if($scope.firendsList[i].SUserId == userId){
                $scope.firendsList.splice(i,1);
                if($scope.concatId == userId){
                    $scope.concatId = undefined;
                    $scope.concat = false;
                }
            }
        }
    });
    $scope.$on('delGroup',function(e,groupId){
        var len = $scope.frequentList.length;
        for(var i=len-1;i>=0;i--){
            if($scope.groupList[i].groupId == groupId){
                $scope.groupList.splice(i,1);
                if($scope.concatId == groupId){
                    $scope.concatId = undefined;
                    $scope.concat = false;
                }
            }
        }
    });
    $scope.$on('delFrequenter',function(e,userId){
        var len = $scope.frequentList.length;
        for(var i=len-1;i>=0;i--){
            if($scope.frequentList[i].SUserId == userId){
                $scope.frequentList.splice(i,1);
                if($scope.concatId == userId){
                    $scope.concatId = undefined;
                    $scope.concat = false;
                }
            }
        }
    });
    $scope.$on('addFrequenter',function(e,userId){
        var len = $scope.frequentList.length;
        var isIn = false;
        for(var i=len-1;i>=0;i--){
            if($scope.frequentList[i].SUserId == userId){
                isIn = true;
            }
        }
        if(!isIn){
            empService.getEmpInfo(userId,'SUserId',function(emp){
                $timeout(function(){
                    $scope.frequentList.push(emp)
                })
            });
        }
    });
    $scope.$on('roomNotFound',function(ev,roomId){
        removeRoom(roomId);
    })
    $scope.$on('empNotInRoom',function(ev,roomId){
        removeRoom(roomId);
    })
    function removeRoom(roomId){
        $timeout(function(){
            for(var i=$scope.groupList.length - 1;i>=0;i--){
                if($scope.groupList[i].groupId == roomId){
                    $scope.groupList.splice(i,1);
                }
            }
        })
    }
    var loginUser = webConfig.getUser();
    var loginUserId = loginUser.SUserId;
    $scope.requestComplete = false;
    $scope.$on('getCompanyDataSuccess',function(){
        $timeout(function(){
            $scope.tree = $params.dept ? empService.getOrganizeTree(loginUserId,$params.dept) : empService.getOrganizeTree(loginUserId);
            $scope.requestComplete = true;
            for(var i=0;i<$scope.groupList.length;i++){
                var accounts = $scope.groupList[i].members;
                var tempName = [];
                for(var k=0;k<accounts.length;k++){
                    tempName.push(accounts[k].SShowName || accounts[k].SName);
                }
                $scope.groupList[i].tempName = tempName.join(',');
            }
        })
    })
    $scope.tree = $params.dept ? empService.getOrganizeTree(loginUserId,$params.dept) : empService.getOrganizeTree(loginUserId);
    if($scope.tree.length){
        $scope.requestComplete = true;
    }
    // $scope.selected = $params.dept ? empService.getDept($params.dept);
    if($params.dept){
        $scope.selected = empService.getDept($params.dept);
        $scope.selected.NEmpnumber = empService.getEmpNumberOfDept($scope.selected.SEntId,$params.dept);
    }
    $scope.chatWith2 = function(){
        var s = $scope.selected;
        if(s.IsEmp){
            $state.go('chat',{
                concat : s.SUserId,
                isGroup : false
            });
        }else{
            //其次把部门所有人邀请进房间
            //最后触发下面的createRoom事件go房间
            var timeStr=new Date().getTime();
            var roomId='group_'+loginUserId+'_'+timeStr;
            //console.log(s)
            var tempSelected = getEmpsInDept(s);
            if(tempSelected.length > 80){
                alert(langPack.getKey('maxMembers'));
                return;
            }
            $state.go('chat',{
                concat : roomId,
                isGroup : true,
                selected : tempSelected,
                needCreate : true
            });
            // $rootScope.$broadcast('createTempRoom',s,roomId);
        }
    }
    function getEmpsInDept(dept){
        var emps = [];
        emps = emps.concat(dept.ChildEmps);
        // dept.ChildDepts = dept.ChildDepts || [];
        for(var i=0;i<dept.ChildDepts.length;i++){
            emps = emps.concat(getEmpsInDept(dept.ChildDepts[i]));
        }
        var temp = {};
        for(var i=emps.length-1;i>=0;i--){
            if(!temp[emps[i].SUserId]){
                temp[emps[i].SUserId] = 1;
            }else{
                if(temp[emps[i].SUserId]){
                    emps.splice(i,1);
                }
            }
        }
        return emps;
    }
    $scope.$on('selectDept',function(ev,dept){
        $timeout(function(){
            $scope.concat = undefined;
            dept.NEmpnumber = empService.getEmpNumberOfDept(dept.entId,dept.SDeptId);
            $scope.selected = dept;
        })
    })
    $scope.$on('updateSelectEntLogo',function(ev,logo){
        $timeout(function(){
            $scope.entLogoUrl = logo;
        })
    })
    $scope.gone = $params.dept ? false : true;
    $scope.$on('ngRepeatFinished',function(){
        var selectDom = $('.concat_list_content').find('.selected');
        if(selectDom && !$scope.gone){
            $('.concat_list_content')[1].scrollTop = Math.max(0,selectDom.offset().top - 80);
            $scope.gone = true;
        }
    })
}]);
controllers.controller('screenShootImageController',['$rootScope','$state','$stateParams','$scope','strophe','concatService','empService','webConfig','langPack',function($rootScope,$state,$params,$scope,strophe,concatService,empService,webConfig,langPack){
    $scope.send = function(){
        if($scope.data.message.uploadStatus == webConfig.FILE_COMPLETE){
            $scope.data.sendMsg($scope.data.message);
            $scope.closeThisPop();
        }else{
            alert(langPack.getKey('uploading'));
        }
    }
}]);
controllers.controller('languageSetting',['$rootScope','$state','$scope','langPack',function($rootScope,$state,$scope,langPack){
    var data = $scope.data;
    $scope.langs = langPack.langs;
    $scope.setLanguage = function(lang){
        data.changeLanguage(lang);
        $scope.closeThisPop();
    }
}])
controllers.controller('broadcastDetailController',['$rootScope','$state','$scope','langPack','util',function($rootScope,$state,$scope,langPack,util){
    $scope._title = $scope.msg.broadcasttitle;
    $scope.broadcasttitle = $scope.msg.broadcasttitle;
    $scope.encodeContent = $scope.msg.content
}])