var controllers = angular.module('Controllers');
var FRAMEID = 'about';
controllers.controller('appController',['$rootScope','$scope','webConfig','$timeout','$document','frameService','envConfig',function($rootScope,$scope,webConfig,$timeout,$doc,frameService,envConfig){
    var search = util.getSearch();

    frameService.getCurrentUser(function(res){
        $timeout(function(){
            $scope.user = webConfig.getUser();
            var envData = envConfig.getEnvData();
            $scope.ver = 'Version ' + envData.Version;
        })
    });
    var mouseDownTimer;
    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parentTar = tar.parentNode;
        var parTagName = parentTar.tagName.toLowerCase();
        if(tagName != 'a' && parTagName != 'a'){
            mouseDownTimer = setTimeout(function(){
                frameService.moveFrame();
            });
        }
    });
}]);
controllers.controller('mainController',['$rootScope','$scope','concatService','$templateCache','$compile','$timeout','webConfig','util','chatService','frameService','settingService','$parse',function($rootScope,$scope,concatService,$templateCache,$compile,$timeout,webConfig,util,chatService,frameService,settingService,$parse){
    $scope.close = function(){
        frameService.closeFrame(FRAMEID);
    }
}]);
