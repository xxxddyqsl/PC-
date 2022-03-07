var controllers = angular.module('Controllers');
var FRAMEID = 'backUpAndRestore';
controllers.controller('appController',['$rootScope','$scope','webConfig','$timeout','$document','frameService',function($rootScope,$scope,webConfig,$timeout,$doc,frameService){
    var search = util.getSearch();

    frameService.getCurrentUser(function(res){
        $timeout(function(){
            $scope.user = webConfig.getUser();
        })
    })
    var handleMouseDown = {
        input : 1,
        textarea : 1,
        a : 1
    }
    $doc.bind('mousedown',function(e){
        console.log(e.clientY)
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parentTar = tar.parentNode;
        var parTagName = '';
        if(parentTar && parentTar != document){
            parTagName = parentTar.tagName.toLowerCase();
        }
        if(e.clientY <= 35 && !(handleMouseDown[tagName] || handleMouseDown[parTagName])){
            $rootScope.$broadcast('hiddenMenu');
            mouseDownTimer = setTimeout(function(){
                callCefMethod('frame/move');
            },50);
            e.preventDefault();
        }
    });
}]);
controllers.controller('mainController',['$rootScope','$scope','concatService','$templateCache','$compile','$timeout','webConfig','util','chatService','frameService','settingService','$parse','$interval',function($rootScope,$scope,concatService,$templateCache,$compile,$timeout,webConfig,util,chatService,frameService,settingService,$parse,$interval){
    var search = util.getSearch();
    $scope.action = search.action;
    $scope.status = 1;
    
    $interval(function(){
        $scope.status ++;
        if($scope.status >= 5){
            $scope.status = 1;
        }
    },1000)
    settingService.getSetting(function(res){
        $scope.setting = res.Data;
    })
    $scope.close = function(){
        frameService.closeFrame(FRAMEID);
    }
    var keyMap = {
        backup : 'backupToPC',
        restore : 'recoverToPhone',
        manager : 'managerBackup'
    }
    $scope.titleKey = keyMap[$scope.action];
}]);
