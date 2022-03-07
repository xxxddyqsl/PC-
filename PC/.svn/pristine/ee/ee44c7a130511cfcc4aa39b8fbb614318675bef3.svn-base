var controllers = angular.module('Controllers');
var FRAMEID = 'previewImg';
controllers.controller('appController',['$rootScope','$scope','webConfig','$timeout','$document','frameService',function($rootScope,$scope,webConfig,$timeout,$doc,frameService){
    var search = util.getSearch();
    // FRAMEID += search.chatId;
    function getGlobalParams(){
        var maps = {
            cascadeCallback : 'cascadeCallback',
        }
        var params = {};
        for(var p in maps){
            params[p] = 'globalFns.' + maps[p];
        }
        return params; 
    }

    // callCefMethod('global/setCallback',);
    var isFirstCall = true;
    window.globalFns = {
        cascadeCallback : function(res){
            $rootScope.$broadcast('cascadeCallback',res);
        }
    }
    for(var p in globalFns){
        globalFns[p] = (function(method){
            var old = globalFns[method];
            return function(res){
                console.log('-----------------------------------');
                console.log(method,res)
                console.log('-----------------------------------');
                old.call(globalFns,res);
            }
        })(p);
    }

    frameService.setGlobalCallbak(getGlobalParams(),function(){
        frameService.getCurrentUser(function(res){
            $timeout(function(){
                $scope.user = webConfig.getUser();
            })
        })
    })

    var handleMouseDown = {
        input : 1,
        textarea : 1,
        a : 1
    }
    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parentTar = tar.parentNode;
        var parTagName = '';
        if(parentTar && parentTar != document){
            parTagName = parentTar.tagName.toLowerCase();
        }
        if(e.clientY <= 29 && !(handleMouseDown[tagName] || handleMouseDown[parTagName])){
            $rootScope.$broadcast('hiddenMenu');
            mouseDownTimer = setTimeout(function(){
                callCefMethod('frame/move');
            },50);
            e.preventDefault();
        }
    });
    document.addEventListener( "drag", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "dragleave", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "drop", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "dragenter", function(e) {
        e.preventDefault();
    }, false);
    document.addEventListener( "dragover", function(e) {
        e.preventDefault();
    }, false);
    $doc.bind('drop',function(){
    })
}]);
controllers.controller('mainController',['$rootScope','$scope','concatService','$templateCache','$compile','$timeout','webConfig','util','chatService','frameService','langPack','$document','previewService','$document',function($rootScope,$scope,concatService,$templateCache,$compile,$timeout,webConfig,util,chatService,frameService,langPack,$doc,previewService,$doc){
    $scope.windowStatus = {
        status : 0
    };
    var firstDown , secondDown;
    $('body').bind('mousedown',function(e){
        if(e.target && (e.target.tagName == 'A' || e.target.tagName == 'INPUT' || e.target.tagName == 'I')) return;
        if(secondDown){
            firstDown = secondDown;
            secondDown = util.getNow();
        }else{
            if(firstDown){
                secondDown = util.getNow();
            }else{
                firstDown = util.getNow();
            }
        }
        // console.log(firstDown,secondDown,secondDown - firstDown)
        if(secondDown && firstDown && (secondDown - firstDown < 300)){
            frameService.maxFrame(function(res){
                $timeout(function(){
                    $scope.windowStatus.status = res.Data;
                })
            });
            firstDown = undefined;
            secondDown = undefined;
        }
    });
    $scope.maxWin = function(){
        frameService.maxFrame(function(res){
            $timeout(function(){
                $scope.windowStatus.status = res.Data;
            })
        });
    }
    $scope.$on('cascadeCallback',function(ev,data){
        var msg = data.Data.msg;
        var tarMsgJson = msg.Content;
        tarMsgJson = JSON.parse(tarMsgJson);
        if($scope.currentMsg && tarMsgJson.messageid == $scope.currentMsg.messageid){
            $scope.currentImg = '';
            $scope.msgId = msg.Id;
            $rootScope.$broadcast('clearCanvas');
        }
    });
    var search = util.getSearch();
    $scope.msgId = search.msgId;
    $scope.imageList = [];
    $scope.wrap = $('#img_view_wrap');
    $scope.page = 0;
    $scope.totalPage = 0;
    $scope.totalCount = 0;
    $scope.currentImgIdx = 0;
    $scope.currentImg = decodeURIComponent(search.img);
    $scope.msgTime = search.msgTime;
    $scope.currentPage = 0;
    var COUNT = 1;
    $doc.keyup(function(e){
        if(e.keyCode == 27){
            $scope.close();
        }
    })
    function goSearch(type,callback){
        var fn;
        var params = {
            chatId : search.chatId,
            timestamp : $scope.msgTime,
            type : type,
            msgId : $scope.msgId
        }
        var fn = chatService.searchImgContext
        fn.call(chatService,params,function(res){
            if(res.Data.Data && res.Data.Data.length){
                var msg = res.Data.Data[0];
                $scope.msgId = msg.messageid;
                $scope.currentImg = msg.filePath || msg.fileUrl;
                $scope.msgTime = msg.timeStamp;
                $scope.currentPage = res.Data.CurrentPage;
                $scope.totalCount = res.Data.TotalCount;
                $scope.currentMsg = msg;
                callback && callback();
            }else{
                if(type == 2){
                    callback && callback(langPack.getKey('lastImg'));
                }
                if(type == 0){
                    callback && callback(langPack.getKey('firstImg'));
                }
            }
            // $scope.current = $scope.current + res.Data.Data.length;
            // $scope.imageList = res.Data.Data.concat($scope.imageList);
            // if(params.Page == 0){
                // $scope.totalCount = res.Data.TotalCount;
                // $scope.imageList = res.Data.Data;
                // for(var i=0;i<res.Data.Data.length;i++){
                    // res.Data.Data[i].idx = (res.Data.CurrentPage - 1) * COUNT  + i + 1;
                    // res.Data.Data[i].page = res.Data.CurrentPage;
                    // if(res.Data.Data[i].messageid == search.msgId){
                        // $scope.current = i;
                        // $scope.currentImgIdx = i;
                    // }
                // }
                // var totalPage = parseInt((res.Data.TotalCount + 4) / 5);
                // $scope.totalPage = totalPage;
                // $scope.page = res.Data.CurrentPage;
                // $rootScope.$broadcast('parentReady');
            // }else{
                // for(var i=0;i<res.Data.Data.length;i++){
                    // res.Data.Data[i].page = params.Page;
                    // res.Data.Data[i].idx = (res.Data.CurrentPage - 1) * COUNT  + i + 1;
                // }
            // }
            // callback && callback(res);
        })
    }
    previewService.open($scope);
    goSearch(1,function(res){
        
    });
    $scope.next = function(callback){
        goSearch(2,function(res){
            callback && callback(res);
            // if(res.Data.Data.length){
                // $scope.currentImg = res.Data.Data[0].filePath || res.Data.Data[0].fileUrl;
                // $scope.msgId = res.Data.Data[0].messageid;
                // callback && callback();
            // }else{
                // callback && callback(langPack.getKey('lastImg'));
            // }
        });
    }
    $scope.prev = function(callback){
        goSearch(0,function(res){
            callback && callback(res);
            // if(res.Data.Data.length){
                // $scope.currentImg = res.Data.Data[0].filePath || res.Data.Data[0].fileUrl;
                // $scope.msgId = res.Data.Data[0].messageid;
                // callback && callback();
            // }else{
                // callback && callback(langPack.getKey('lastImg'));
            // }
        });
    }
    // $scope.next = function(callback){
        // if($scope.current >= $scope.imageList.length - 1){
            // var msg = $scope.imageList[$scope.current];
            // $scope.page = msg.page;
            // if($scope.page >= $scope.totalPage){
                // callback && callback(langPack.getKey('lastImg'));
                // return;
            // }else{
                // $scope.page ++;
                // goSearch(function(res){
                    // $scope.current ++;
                    // $scope.imageList = $scope.imageList.concat(res.Data.Data);
                    // for(var i=0;i<res.Data.Data.length;i++){
                        // if($scope.imageList[$scope.current].messageid == res.Data.Data[i].messageid){
                            // $scope.currentImgIdx = i;
                        // }
                    // }
                    // callback && callback();
                // });
            // }
        // }else{
            // $scope.current ++;
            // $scope.currentImgIdx ++;
            // callback && callback();
        // }
    // }
    // $scope.prev = function(callback){
        // if($scope.current == 0){
            // var msg = $scope.imageList[$scope.current];
            // $scope.page = msg.page;
            // if($scope.page <= 1){
                // callback && callback(langPack.getKey('firstImg'));
                // return;
            // }else{
                // $scope.page --;
                // goSearch(function(res){
                    // $scope.current = res.Data.Data.length - 1;
                    // $scope.imageList = res.Data.Data.concat($scope.imageList);
                    // for(var i=0;i<res.Data.Data.length;i++){
                        // if($scope.imageList[$scope.current].messageid == res.Data.Data[i].messageid){
                            // $scope.currentImgIdx = i;
                        // }
                    // }
                    // callback && callback();
                // });
            // }
        // }else{
            // $scope.current --;
            // $scope.currentImgIdx --;
            // callback && callback();
        // }
    // }
    $scope.close = function(){
        frameService.closeFrame(FRAMEID);
    }
    $scope.min = function(){
        frameService.minFrame();
    }
    
}]);

