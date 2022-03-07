var controllers = angular.module('Controllers');
var FRAMEID = 'setting';
controllers.controller('appController',['$rootScope','$scope','webConfig','$timeout','$document','frameService',function($rootScope,$scope,webConfig,$timeout,$doc,frameService){
    var search = util.getSearch();

    frameService.getCurrentUser(function(res){
        $timeout(function(){
            $scope.user = webConfig.getUser();
        })
    })
    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parentTar = tar.parentNode;
        var parTagName = parentTar.tagName.toLowerCase();
        if(parTagName != 'a'  && tagName != 'a' && tagName != 'img' && ($('.setting').find(tar).size() == 0)){
            $rootScope.$broadcast('hiddenMenu');
            mouseDownTimer = setTimeout(function(){
                callCefMethod('frame/move');
            },50);
        }
    });
}]);
controllers.controller('mainController',['$rootScope','$scope','concatService','$templateCache','$compile','$timeout','webConfig','util','chatService','frameService','settingService','$parse','langPack',function($rootScope,$scope,concatService,$templateCache,$compile,$timeout,webConfig,util,chatService,frameService,settingService,$parse,langPack){
    var search = util.getSearch();
    $scope.rendered = false;
    $scope.dataReady = false;
    var typeNameMap = {
        ShowMainPanel : langPack.getKey('showMainIframe'),
        Capture : langPack.getKey('capture'),
        QuickSendMsg : langPack.getKey('quickSend'),
        RecordAudio : langPack.getKey('recordingVoice'),
        ShowHistory : langPack.getKey('openChatHistory')
    }
    $scope.oldValue  = {};
    settingService.getSetting(function(res){
        $scope.setting = res.Data;
        for(var i=0;i<$scope.setting.Hotkey.length;i++){
            $scope.setting.Hotkey[i].Desc = typeNameMap[$scope.setting.Hotkey[i].Name];
            $scope.oldValue[$scope.setting.Hotkey[i].Name] = $scope.setting.Hotkey[i].Value;
        }
        $scope.checkSameWithOther();
        $scope.dataReady = true;
        if($scope.rendered && $scope.dataReady){
            setNavBlock();
        }
    })
    var tar = search.tar;
    var sameArr = [];
    $scope.sameKeys = {
        ShowMainPanel : 0,
        Capture : 0,
        QuickSendMsg : 0,
        RecordAudio : 0,
        ShowHistory : 0
    }
    
    $scope.close = function(){
        frameService.closeFrame(FRAMEID);
    }
    
    $scope.switchSetting = function(prop,key,event){
        var obj = {};
        if(key == ''){
            $scope.setting[prop] = !$scope.setting[prop];
            obj[prop] = $scope.setting[prop];
        }
        if(prop == 'Hotkey'){
            obj.Hotkey = [];
            var temp = {};
            for(var i=0;i<$scope.setting.Hotkey.length;i++){
                if($scope.setting.Hotkey[i].Name == key){
                    $scope.setting.Hotkey[i].Enabled = !$scope.setting.Hotkey[i].Enabled;
                    temp.Name = $scope.setting.Hotkey[i].Name;
                    temp.Enabled = $scope.setting.Hotkey[i].Enabled;
                    temp.Type = $scope.setting.Hotkey[i].Type;
                    temp.Value = $scope.setting.Hotkey[i].Value;
                    obj.Hotkey.push(temp);
                }
            }
        }
        settingService.saveSetting(obj,function(res){
            console.log(res)
            frameService.notice({
                timestamp : util.getNow(),
                frameId : 'main',
                action : 'settingChange'
            },function(res){
            })
        })
    }
    $scope.checkSameWithOther = function(){
        var temp = {};
        for(var i=0;i<$scope.setting.Hotkey.length;i++){
            temp[$scope.setting.Hotkey[i].Name] = $scope.setting.Hotkey[i].Value;
        }
        for(var p in $scope.sameKeys){
            $scope.sameKeys[p] = 0;
        }
        var hasSame = false;
        for(var p in temp){
            for(var i=0;i<$scope.setting.Hotkey.length;i++){
                if(temp[p] && $scope.setting.Hotkey[i].Value && temp[p] == $scope.setting.Hotkey[i].Value && p != $scope.setting.Hotkey[i].Name){
                    $scope.sameKeys[p] = 1;
                    $scope.sameKeys[$scope.setting.Hotkey[i].Name] = 1;
                    hasSame = true;
                }
            }
        }
        if(!hasSame){
            for(var p in $scope.sameKeys){
                $scope.sameKeys[p] = 0;
            }
        }
    }
    
    $scope.goContent = function(tar){
        scrollTo(tar);
    }
    $scope.min = function(){
        frameService.minFrame();
    }
    function scrollTo(tar){
        var targ = $('#' + tar)[0];
        var top = targ.offsetTop;
        $('.nav_content').scrollTop(top);
    }
    var navBlock = {};
    var idxMap = {};
    function init(){
        if(tar){
            scrollTo(tar);
        }else{
            scrollTo('login');
            $('.left_nav a').removeClass('select');
            $('.left_nav a').eq(0).addClass('select');
        }
    }
    init();
    $scope.$on('langPackRendered',function(){
        $timeout(function(){
            $scope.rendered = true;
            if($scope.rendered && $scope.dataReady){
                setNavBlock();
            }
        })
    })
    function setNavBlock(){
        setTimeout(function(){
            $('.nav_item').each(function(idx){
                var id = $(this).attr('id');
                var _from = this.offsetTop;
                var _to = _from + $(this).height();
                navBlock[id] = [_from , _to];
                idxMap[id] = idx;
            });
            init();
        })
        setTimeout(function(){
            $('.switch').removeClass('no_an');
        },1000);
    }
    $('.nav_content').scroll(function(){
        var scrolled = $(this).scrollTop();
        for(var p in navBlock){
            var _from = navBlock[p][0];
            var _to = navBlock[p][1];
            if(scrolled >= _from && scrolled <= _to){
                $('.left_nav a').removeClass('select');
                var idx = idxMap[p];
                $('.left_nav a').eq(idx).addClass('select');
            }
        }
    });
    var allowKeyMap = {
        16 : 'Shift',
        17 : 'Ctrl',
        18 : 'Alt'
    };
    for(var i=112;i<124;i++){
        allowKeyMap[i] = 'F' + (i - 111);
    }
    for(var i=65;i<91;i++){
        allowKeyMap[i] = String.fromCharCode(i).toUpperCase();
    }
    $scope.allowKeyMap = allowKeyMap;
    // var keyStrMap = {};
    // for(var p in allowKeyMap){
        // keyStrMap[allowKeyMap[p]] = p;
    // }
    $scope.hotKeyEdit = function(e){
        var keyCode = e.keyCode;
        var input = e.target;
        e.preventDefault();
        if(keyCode == 8 || keyCode == 46){
            input.value = '';
            input.setAttribute('setable',1);
            return;
        }
        if(input.getAttribute('setable') === '0'){
            e.preventDefault();
            return;
        }
        var val = input.value;
        var reg = /[^\w+]/g;
        val = val.replace(reg,'');
        input.value = val;
        var arr = val.split('+');
        var seted = false;
        for(var i=0;i<arr.length;i++){
            if(arr[i] == allowKeyMap[keyCode]) seted = true;
        }
        if(seted) return;
        if(keyCode >= 16 && keyCode <= 18){
            var newIn = '';
            if(e.ctrlKey){
                newIn += allowKeyMap['17'] + '+';
            }
            if(e.shiftKey){
                newIn += allowKeyMap['16'] + '+';
            }
            if(e.altKey){
                newIn += allowKeyMap['18'] + '+';
            }
            input.value = newIn;
            input.setAttribute('setable',1);
        }else{
            if(keyCode >= 65 && keyCode < 91){
                if(e.ctrlKey || e.shiftKey || e.altKey){
                    if(allowKeyMap[keyCode]){
                        input.value += allowKeyMap[keyCode];
                        input.setAttribute('setable',0);
                    }
                }
            }else{
                if(allowKeyMap[keyCode]){
                    input.value += allowKeyMap[keyCode];
                    input.setAttribute('setable',0);
                }
            }
        }
    }
    $scope.inputBlur = function(prop,key,event){
        var setAble = event.target.getAttribute('setable');
        for(var i=0;i<$scope.setting.Hotkey.length;i++){
            if($scope.setting.Hotkey[i].Value == '' || setAble == '1') {
                $scope.setting.Hotkey[i].Value = $scope.oldValue[$scope.setting.Hotkey[i].Name];
            }
        }
        $scope.checkSameWithOther();
    }
    $scope.isSameWithOther = function(hotkey){
        return $scope.sameKeys[hotkey.Name];
    }
    $scope.keyup = function(e){
        var input = e.target;
        var val = input.value;
        var reg = /[^\w+]/g;
        val = val.replace(reg,'');
        input.value = val;
        if(input.getAttribute('setable') !== '0'){
            input.value = '';
        }
        if(input.getAttribute('setable') === '0'){
            var fn = $parse(input.getAttribute('ng-save'));
            fn($scope);
        }
    }
    $scope.saveSetting = function(prop,key){
        if(!$scope.sameKeys[key]){
            var obj = {};
            if(prop == 'Hotkey'){
                obj.Hotkey = [];
                var temp = {};
                for(var i=0;i<$scope.setting.Hotkey.length;i++){
                    if($scope.setting.Hotkey[i].Name == key){
                        temp.Name = $scope.setting.Hotkey[i].Name;
                        temp.Enabled = $scope.setting.Hotkey[i].Enabled;
                        temp.Type = $scope.setting.Hotkey[i].Type;
                        temp.Value = $scope.setting.Hotkey[i].Value;
                        obj.Hotkey.push(temp);
                    }
                }
            }
            settingService.saveSetting(obj,function(res){
                frameService.notice({
                    timestamp : util.getNow(),
                    frameId : 'main',
                    action : 'settingChange'
                },function(res){
                })
            })
        }
    }
        
    $scope.switchSendType = function(){
        var obj = {};
        obj.SendMsgMode = $scope.setting.SendMsgMode == 0 ? 1 : 0;
        settingService.saveSetting(obj,function(res){
            frameService.notice({
                timestamp : util.getNow(),
                frameId : 'main',
                action : 'settingChange'
            },function(res){
            })
        })
    }
    $scope.setToDefault = function(){
        settingService.reset(function(res){
            $scope.setting = res.Data;
            for(var i=0;i<$scope.setting.Hotkey.length;i++){
                $scope.setting.Hotkey[i].Desc = typeNameMap[$scope.setting.Hotkey[i].Name];
                $scope.oldValue[$scope.setting.Hotkey[i].Name] = $scope.setting.Hotkey[i].Value;
            }
            $scope.checkSameWithOther();
            frameService.notice({
                timestamp : util.getNow(),
                frameId : 'main',
                action : 'settingChange'
            },function(res){
            })
            $scope.dataReady = true;
            if($scope.rendered && $scope.dataReady){
                setNavBlock();
            }
        })
    }
    
    $scope.goBackUp = function(){
        frameService.open('backUpAndRestore','backupAndRestore.html',{
            action : 'backup'
        },470,370,false,langPack.getKey('backupToPC'))
    }
    $scope.goRestore = function(){
        frameService.open('backUpAndRestore','backupAndRestore.html',{
            action : 'restore'
        },470,370,false,langPack.getKey('recoverToPhone'))
    }
    $scope.managerBackUp = function(){
        frameService.open('backUpAndRestore','backupAndRestore.html',{
            action : 'manager'
        },470,370,false,langPack.getKey('managerBackup'))
    }
}]);
