var controllers = angular.module('Controllers');
var FRAMEID = 'sendFile';
controllers.controller('appController', ['$rootScope', '$scope', 'webConfig', '$timeout', '$document', 'frameService', function ($rootScope, $scope, webConfig, $timeout, $doc, frameService) {
    var search = util.getSearch();
    FRAMEID += search.chatId;
    frameService.getCurrentUser(function (res) {
        $timeout(function () {
            $scope.user = webConfig.getUser();
        })
    })
    var handleMouseDown = {
        input: 1,
        textarea: 1,
        a: 1
    }
    $doc.bind('mousedown', function (e) {
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parentTar = tar.parentNode;
        var parTagName = '';
        if (parentTar && parentTar != document) {
            parTagName = parentTar.tagName.toLowerCase();
        }
        if (e.clientY <= 35 && !(handleMouseDown[tagName] || handleMouseDown[parTagName])) {
            $rootScope.$broadcast('hiddenMenu');
            mouseDownTimer = setTimeout(function () {
                callCefMethod('frame/move');
            }, 50);
            e.preventDefault();
        }
    });
    document.addEventListener("dragleave", function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener("drop", function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener("dragenter", function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener("dragover", function (e) {
        e.preventDefault();
    }, false);
    $doc.bind('drop', function () {
        // console.log(111);
    })
}]);
controllers.controller('mainController', ['$rootScope', '$scope', 'concatService', '$templateCache', '$compile', '$timeout', 'webConfig', 'util', 'chatService', 'frameService', 'langPack', '$document', 'envConfig',function ($rootScope, $scope, concatService, $templateCache, $compile, $timeout, webConfig, util, chatService, frameService, langPack, $doc,envConfig) {
    window.fileList = $scope.fileList = [];

    $scope.fileMap = {};
    $scope.close = function () {
        frameService.closeFrame(FRAMEID);
    }
    $scope.min = function () {
        frameService.minFrame();
    }
    $doc.on('drop', function (e) {
        // console.log(111);
        var sourceEvent = e.originalEvent;
        var transfer = sourceEvent.dataTransfer;
        var items = transfer.items;
        var types = transfer.types;
        var hasFiles = false;
        var hasHtml = false;
        for (var i = 0; i < types.length; i++) {
            if (types[i] == 'Files') {
                hasFiles = true;
            }
            if (types[i] == 'text/html') {
                hasHtml = true;
            }
        }
        var envData = envConfig.getEnvData();
        var fileDomain = envData.LocalDomain;
        var _fileDomain = util.replaceMetaStr(fileDomain);
        var fileDomainReg = new RegExp(_fileDomain);
        if (hasFiles) {
            frameService.getDragFiles(function (res) {
                var fileList = res.Data;
                $timeout(function () {
                    for (var i = 0; i < fileList.length; i++) {
                        if ($scope.fileMap[fileList[i].Path]) continue;
                        $scope.fileMap[fileList[i].Path] = 1;
                        var temp = {
                            Path: fileList[i].Path.replace(fileDomainReg,''),
                            Size: fileList[i].Size,
                            IsDirectory: fileList[i].IsDirectory
                        }
                        $scope.fileList.push(temp);
                    }
                })
            })
        }
        e.preventDefault();
    })
    $scope.addFile = function () {
        var envData = envConfig.getEnvData();
        var fileDomain = envData.LocalDomain;
        var fileDomainReg = new RegExp(fileDomain);
        frameService.fileDialog({
            extFilter: langPack.getKey('allFiles')
        }, function (res) {
            $timeout(function () {
                var fileList = res.Data;
                if(fileList.length){
                    for (var i = 0; i < fileList.length; i++) {
                        if ($scope.fileMap[fileList[i].Path]) continue;
                        $scope.fileMap[fileList[i].Path] = 1;
                        fileList[i].Path = fileList[i].Path.replace(fileDomainReg,'');
                        $scope.fileList.push(fileList[i]);
                    }
                }
            })
        })
    }

    $scope.deleteFile = function (idx) {
        var file = $scope.fileList[idx];
        delete $scope.fileMap[file.Path];
        $scope.fileList.splice(idx, 1);
    }
    var imgExt = {
        png : 1,
        gif : 1,
        jpg : 1,
        jpeg : 1,
        bpm : 1,
        ico : 1
    }
    $scope.sendFile = function () {
        if($scope.fileList.length){
            if($scope.fileList.length == 1){
                var file = $scope.fileList[0];
                file.Path = envConfig.getEnvData().LocalDomain + file.Path;
                if(!file.IsDirectory){
                    var extArr = file.Path.split('.');
                    var ext = extArr[extArr.length - 1] || '';
                    ext = ext.toLowerCase();
                    if(imgExt[ext]){
                        frameService.notice({
                            chatId : search.chatId,
                            file : file,
                            timestamp : util.getNow(),
                            frameId : 'main',
                            action : 'sendImgMsg'
                        },function(res){
                            $scope.close();
                        })
                        return;
                    }
                }
            }
            frameService.notice({
                chatId : search.chatId,
                onlineFiles : $scope.fileList,
                timestamp : util.getNow(),
                frameId : 'main',
                action : 'onlineFiles'
            },function(res){
                $scope.close();
            })
        }
    }
}]);

