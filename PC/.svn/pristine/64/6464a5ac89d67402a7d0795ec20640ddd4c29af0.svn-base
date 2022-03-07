var controllers = angular.module('Controllers');
var FRAMEID = '';

controllers.controller('appController',['$rootScope','$scope','webConfig','$timeout','$document','frameService',function($rootScope,$scope,webConfig,$timeout,$doc,frameService){
    var search = util.getSearch();
    var userId = FRAMEID = search.userId;
    function getGlobalParams(){
        var maps = {
            ChatUpdated : 'chatUpdated'
        }
        var params = {};
        for(var p in maps){
            params[p] = 'globalFns.' + maps[p];
        }
        console.log(params)
        return params; 
    }

    // callCefMethod('global/setCallback',);
    var isFirstCall = true;
    window.globalFns = {
        chatUpdated : function(res){
            if(res.Data.Type == 1000){
                if(res.Data.IMStatus == 5){
                    $('.'+res.Data.Id).removeClass('online').addClass('offline');
                }else{
                    $('.'+res.Data.Id).addClass('online').removeClass('offline');
                }
                $('.'+res.Data.Id).attr('src',res.Data.Avatar+'?_=' + util.getNow());
            }
            $rootScope.$broadcast('chatUpdated',res);
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

    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        var parentTar = tar.parentNode;
        var parTagName = parentTar.tagName.toLowerCase();
        if(e.clientY <= 35 && parTagName != 'a'  && tagName != 'a' && tagName != 'img' && ($('.setting').find(tar).size() == 0)){
            mouseDownTimer = setTimeout(function(){
                callCefMethod('frame/move');
                $('body').addClass('no_select');
            },50);
        }
    });
    $doc.bind('mouseup',function(e){
        $('body').removeClass('no_select');
    });
    var search = util.getSearch();
    console.log('controllers 执行完毕时间： %s',util.getNow() - search.time);
}]);
controllers.controller('mainController',['$rootScope','$scope','concatService','$templateCache','$compile','$timeout','webConfig','util','chatService','frameService',function($rootScope,$scope,concatService,$templateCache,$compile,$timeout,webConfig,util,chatService,frameService){
    var search = util.getSearch();
    var ele = angular.element;
    var userId = FRAMEID = search.userId;
    var currentUser = webConfig.getUser();
    $scope.isBroad = util.isBroad(userId);
    
    $scope.idx = 0;
    $scope.setFavorite = function(){
        var ids = [];
        ids.push($scope.emp.Id);
        if(!$scope.emp.Favorite){
            concatService.setFavorite(0,ids,function(){
                $timeout(function(){
                    for(var i=0;i<ids.length;i++){
                        chatService.setChatStatus(ids[i],2);
                    }
                })
            });
        }else{
            concatService.cancelFavorite(0,ids,function(){
                $timeout(function(){
                    for(var i=0;i<ids.length;i++){
                        chatService.setChatStatus(ids[i],2);
                    }
                })
            });
        }
    }
    $scope.close = function(){
        frameService.closeFrame(FRAMEID);
    }
    $scope.scrollEnt = function(idx){
        $scope.idx = idx;
        $('.user_ents').animate({
            scrollLeft : idx * 410
        },200);
    }
    $scope.scrollEntByArrow = function(add){
        $scope.idx = $scope.idx + add;
        $scope.idx = Math.max(0 , $scope.idx);
        $scope.idx = Math.min( $scope.idx , $scope.emp.Staffs.length - 1);
        $('.user_ents').animate({
            scrollLeft : $scope.idx * 410
        },200);
    }
    concatService.getUserDetail(userId,function(res){
        $timeout(function(){
            $scope.emp = res.Data;
            var now = new Date().getTime();
            console.log('打开窗体时间：%s，结果显示时间：%s，耗时：%s', search.time , now , now - search.time);
        })
    })
    $scope.chatWith = function(){
        frameService.notice({
            chatId : userId,
            timestamp : util.getNow(),
            frameId : 'main',
            action : 'chatWith'
        },function(res){
            $scope.close();
        })
    }
    $scope.changeEmailFlag = false;
    $scope.changeSignFlag = false;
    $scope.inputEmail = '';
    $scope.inputSignature = '';
    $scope.goEdit = function(){
        $scope.inputEmail = $scope.emp.Email;
        $scope.changeEmailFlag = true;
        setTimeout(function(){
            $('.email_edit').focus();
        },50);
    }
    $scope.goEditSign = function(){
        $scope.inputSignature = $scope.emp.Signature;
        $scope.changeSignFlag = true;
        setTimeout(function(){
            $('.sign_edit').focus();
        },50);
    }
    $scope.submitEmail = function(){
        if($scope.inputEmail == $scope.emp.Email){
            $scope.changeEmailFlag = false;
            return;
        };
        if($scope.inputEmail){
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
            if(!reg.test($scope.inputEmail)){
                alert('邮箱格式不正确');
                setTimeout(function(){
                    $('.email_edit').focus();
                },50);
                return;
            }
            concatService.modifyUserInfo({
                Email : $scope.inputEmail
            },function(){
                $timeout(function(){
                    $scope.changeEmailFlag = false;
                    $scope.emp.Email = $scope.inputEmail;
                })
            })
        }else{
            $timeout(function(){
                $scope.changeEmailFlag = false;
            })
        }
    }
    $scope.submitSign = function(){
        if($scope.inputSignature == $scope.emp.Signature){
            $scope.changeSignFlag = false;
        }
        concatService.modifyUserInfo({
            Signature : $scope.inputSignature
        },function(){
            $timeout(function(){
                $scope.changeSignFlag = false;
                $scope.emp.Signature = $scope.inputSignature;
            })
        })
    }
    $scope.openUserProfile = function(user){
        if(user.UserId == userId) return;
        frameService.open(user.UserId,'profile.html',{
            userId : user.UserId
        },410,currentUser.Id == user.UserId ? 520 : 580,false,user.Name,undefined,undefined,{
            NewFormPerRequest : true
        });
    }
    
    $scope.goDept = function(dept){
        frameService.notice({
            deptId : dept.Id,
            timestamp : util.getNow(),
            frameId : 'main',
            action : 'goDept'
        },function(res){
            $scope.close();
        })
    }

    $scope.$on('setFavorite',function(ev,type,idList){
        console.log(arguments)
        $timeout(function(){
            for(var i=0;i<idList.length;i++){
                if($scope.emp.Id == idList[i]){
                    $scope.emp.Favorite = 1;
                }
            }
        })
    })
    
    $scope.$on('cancelFavorite',function(ev,type,idList){
        console.log(arguments)
        $timeout(function(){
            for(var i=0;i<idList.length;i++){
                if($scope.emp.Id == idList[i]){
                    $scope.emp.Favorite = 0;
                }
            }
        })
    })    
}]);
