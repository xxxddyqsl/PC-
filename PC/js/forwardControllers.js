var controllers = angular.module('Controllers');
var FRAMEID = 'forward';
controllers.controller('appController',['$rootScope','$scope','webConfig','$timeout','$document','frameService',function($rootScope,$scope,webConfig,$timeout,$doc,frameService){
    frameService.getCurrentUser(function(res){
        $timeout(function(){
            $scope.user = webConfig.getUser();
        })
    })
    $doc.bind('mousedown',function(e){

    });
}]);
controllers.controller('mainController',['$rootScope','$scope','concatService','$templateCache','$compile','$timeout','webConfig','util','chatService','frameService','langPack',function($rootScope,$scope,concatService,$templateCache,$compile,$timeout,webConfig,util,chatService,frameService,langPack){
    $timeout(function(){
        $('.search_area input').focus();
    },500);
    var search = util.getSearch();
    var elem = angular.element;
    var currentUser = webConfig.getUser();
    var page = 1 , pageSize = 20;
    var getTimer;
    $scope.selected = [];
    $scope.searchResult = {
        searching : false,
        
        index : -1,
        
        hasResult : 0,
        showResult : 0,
        
        allData : [],
        staffs : [],
        groups : [],
        depts : []
    }
    $scope.chatList = [];
    $scope.onScrollEnd = function(){
        $timeout.cancel(getTimer);
        getTimer = $timeout(function(){
            page ++;
            chatService.getChats(page,pageSize,function(res){
                // console.log(res);
                if(res.Flag == 0){
                    $timeout(function(){
                        handleList(res.chatList);
                        $scope.chatList = res.chatList;
                    })
                }else{
                    page --;
                }
            });
        },500)
    }
    var inited = false;
    $scope.close = function(){
        frameService.closeFrame(FRAMEID);
    }
    init();
    function init(){
        if(inited) return;
        chatService.getChats(page,pageSize,function(res){
            if(res.Flag == 0){
                $timeout(function(){
                    handleList(res.chatList);
                    $scope.chatList = res.chatList;
                })
            }
        });
        inited = true;
    }
    function handleList(list){
        for(var i=list.length-1;i>=0;i--){
            if(util.isBroad(list[i].Id)){
                list.splice(i,1);
            }
        }
    }
    $scope.selectThis = function(user){
        // $('.ent_tree .select').removeClass('select');
        $scope.select = user;
        var tarUserId = user.UserId || user.Id;
        if(currentUser.Id == tarUserId || currentUser.Id == tarUserId){
            return;
        }
        var isIn = false;
        for(var i=0;i<$scope.selected.length;i++){
            if($scope.selected[i].Id == tarUserId || $scope.selected[i].UserId == tarUserId){
                isIn = true;
                break;
            }
        }
        if(!isIn){
            user.deleteAble = true;
            $timeout(function(){
                $scope.selected.push(user);
            })
        }
    }
    $scope.selectSearchRes = function(user){
        $scope.selectThis(user);
        $scope.clearKeyword();
    }
    $scope.deleteThis = function(user){
        var tarUserId = user.UserId || user.Id;
        for(var i=$scope.selected.length-1;i>=0;i--){
            if($scope.selected[i].Id == tarUserId || $scope.selected[i].UserId == tarUserId){
                $scope.selected.splice(i,1);
                break;
            }
        }
    }

    $scope.submit = function(){
        // console.log($scope.selected);
        var arr = [];
        for(var i=0;i<$scope.selected.length;i++){
            arr.push($scope.selected[i].Id);
        }
        frameService.notice({
            msgId : search.msgId,
            selected : arr,
            timestamp : util.getNow(),
            frameId : 'main',
            action : 'forward'
        },function(res){
            $scope.close();
        })
    }
    function createEnts(ents,container,level,isFav){
        container = container || $('.ents');
        for(var i=0;i<ents.length;i++){
            var _scope = $scope.$new();
            var tplName = isFav ? 'favDept.html' : 'ent.html';
            var tpl = $templateCache.get(tplName);
            var _ele = elem(tpl);
            _scope.ent = ents[i];
            $compile(_ele)(_scope);
            container.append(_ele);
            _scope.$digest();
            if(level){
                _ele.find('.ent_dept').attr('level',(level + 1));
                _ele.find('.ent_dept').css('paddingLeft',(level + 1) * 14)
            }else{
                _ele.find('.ent_dept').attr('level',1);
            }
            _ele.find('.ent_dept').click(function(){
                toggleSelect.call(this);
                var id = $(this).attr('did');
                var entId = $(this).parents('.root').attr('cid') || $(this).attr('cid');
                $rootScope.$broadcast('onSelectConcat',isFav ? 2 :1,id,entId);
                var that = $(this);
                var dom = $(this).next();
                if($(this).hasClass('show')){
                    dom.hide();
                    $(this).removeClass('show');
                }else{
                    $(this).addClass('show');
                    dom.show();
                }
                var level = $(this).attr('level');
                $('.ents').css('width',Math.max($('.concat_wrap')[0].scrollWidth , $('.concat_wrap')[0].offsetWidth));
                concatService.getDept(id,function(res){
                    if(!that.attr('get')){
                        dom.html('');
                        createBranchs(res.Data.Staffs,level,dom,true);
                        createBranchs(res.Data.Children,level,dom);
                        that.attr('get',true);
                    }
                    if(isFav){
                        $rootScope.$broadcast('onSelectDept',res.Data);
                    }else{
                        $rootScope.$broadcast('onSelectEnt',res.Data);
                    }
                })
            })
        }
    }
    function toggleSelect(){
        $('.concat_wrap .select').removeClass('select');
        $(this).addClass('select');
    }
    var cache = {};
    function createBranchs(list,level,container,isEmp){
        level = parseInt(level);
        for(var i=0;i<list.length;i++){
            createEle(i);
        }
        setTimeout(function(){
            $('.ents').css('width',Math.max($('.concat_wrap')[0].scrollWidth , $('.concat_wrap')[0].offsetWidth));
        })
        function createEle(i){
            var _scope = $scope.$new();
            var tplName = isEmp ? 'entUser.html' : 'entDept.html';
            var tpl = $templateCache.get(tplName);
            var _ele = elem(tpl);
            if(isEmp){
                cache[list[i].UserId] = list[i];
            }
            _scope.branch = list[i];
            $compile(_ele)(_scope);
            container.append(_ele);
            _ele.find('.ent_dept').attr('level',level + 1);
            _ele.find('.ent_dept').css('paddingLeft',(level+1) * 14)
            _ele.find('.ent_dept').click(function(){
                var that = $(this);
                toggleSelect.call(this);
                var id = $(this).attr('did');
                var entId = $(this).parents('.childs').last().prev().attr('cid');
                if(isEmp){
                    $scope.selectThis(cache[id]);
                    // $rootScope.$broadcast('onSelectConcat',0,id,entId);
                }else{
                    // $rootScope.$broadcast('onSelectConcat',2,id,entId);
                    var dom = $(this).next();
                    if($(this).hasClass('show')){
                        dom.hide();
                        $(this).removeClass('show');
                        $('.ents').css('width',Math.max($('.concat_wrap')[0].scrollWidth , $('.concat_wrap')[0].offsetWidth));
                    }else{
                        $(this).addClass('show');
                        dom.show();
                    }
                    var level = $(this).attr('level');
                    $('.ents').css('width',Math.max($('.concat_wrap')[0].scrollWidth , $('.concat_wrap')[0].offsetWidth));
                    concatService.getDept(id,function(res){
                        if(!that.attr('get')){
                            dom.html('');
                            createBranchs(res.Data.Staffs,level,dom,true);
                            createBranchs(res.Data.Children,level,dom);
                            that.attr('get',true);
                        }
                        $rootScope.$broadcast('onSelectDept',res.Data);
                    })
                }
            })
        }
    }

    var searchTimer;
    $scope.clearSearch = function(){
        $scope.keyword = '';
        $scope.searchResultUser = [];
    }
    $scope.search = function(){
        if(searchTimer){
            clearTimeout(searchTimer);
            searchTimer = undefined;
        }
        if(!$scope.keyword) {
            oldSearch = '';
            $timeout(function(){
                $scope.searchResult.index = -1;
                $scope.searchResult.searching = false;
                $scope.hideSearchResult();
            });
            return;
        }
        if(oldSearch !== '' && oldSearch == $scope.keyword){
            $timeout(function(){
                if($scope.searchResult.allData.length){
                    $scope.searchResult.searching = true;
                }
            });
            return;
        }
        $timeout(function(){
            $scope.searchResult.showResult = 1;
            $scope.searchResult.searching = true;
        })
        $scope.searchResult.index = -1;
        chatService.searchData($scope.keyword,function(res){
            oldSearch = $scope.keyword;
            if(res.Data.key != $scope.keyword){
                return;
            }
            $timeout(function(){
                // if(res.Data.type != -2 && res.Data.data.length){
                    // $scope.searchResult.hasResult = 1;
                // }
                var data = res.Data.data;
                var type = res.Data.type;
                if(type == -2){
                    var _temp = [];
                    for(var i=0;i<data.users.length;i++){
                        var depts = data.users[i].Staffs;
                        var obj = {};
                        obj.Avatar = data.users[i].Avatar;
                        obj.Id = data.users[i].Id;
                        obj.Name = data.users[i].Name;
                        obj.type = 0;
                        obj.IMStatus = data.users[i].IMStatus;
                        if(depts.length){
                            for(var j=0;j<depts.length;j++){
                                var hasMain = false;
                                var _depts = depts[j].Departments;
                                if(_depts.length){
                                    for(var k=0;k<_depts.length;k++){
                                        if(_depts[k].isMain == 1){
                                            hasMain = true;
                                            obj.deptName = depts[k].LevelInfo;
                                        }
                                    }
                                    if(!hasMain){
                                        obj.deptName = _depts[0].LevelInfo;
                                    }
                                }
                            }
                        }
                        _temp.push(obj);
                    }
                    $scope.searchResult.staffs = _temp;
                    $scope.searchResult.groups = data.groups;
                    // $scope.searchResult.depts = data.depts;
                    for(var i=0;i<$scope.searchResult.groups.length;i++){
                        $scope.searchResult.groups[i].type = 1;
                    }
                    // for(var i=0;i<$scope.searchResult.depts.length;i++){
                        // $scope.searchResult.depts[i].type = 2;
                    // }
                    $scope.searchResult.allData = [];
                    $scope.searchResult.allData = $scope.searchResult.allData.concat($scope.searchResult.staffs);
                    $scope.searchResult.allData = $scope.searchResult.allData.concat($scope.searchResult.groups);
                    // $scope.searchResult.allData = $scope.searchResult.allData.concat($scope.searchResult.depts);
                   if($scope.searchResult.allData.length){
                        $scope.searchResult.hasResult = 1;
                        $scope.searchResult.index = 0;
                        $scope.searchResult.allData[0].active = 1;
                    }else{
                        $scope.searchResult.hasResult = 0;
                        $scope.searchResult.index = -1;
                        $scope.searchResult.staffs = [];
                        $scope.searchResult.groups = [];
                        // $scope.searchResult.depts = [];
                    }
                }
            })
        })
    }
    $scope.clearKeyword = function(){
        $scope.keyword = '';
        $scope.searchResult.index = -1;
        $scope.hideSearchResult();
    }
    $scope.hideSearchResult = function(){
        $scope.searchResult.showResult = 0;
        $scope.searchResult.staffs = [];
        $scope.searchResult.groups = [];
        // $scope.searchResult.depts = [];
        $scope.searchResult.allData = [];
    }
    $scope.$watch('keyword',function(v){
        $scope.search();
    })
    $scope.onKeyDown = function(e){
        var temp = $scope.searchResult.index;
        var all = $scope.searchResult.allData;
        all[temp] && (all[temp].active = false);
        var change = 0;
        if(e){
            if(e.keyCode == util.KEYMAP.UP){
                if(temp >= 1){
                    temp --;
                    $scope.searchResult.index = Math.max(0,temp);
                }
                e.preventDefault();
            }
            if(e.keyCode == util.KEYMAP.DOWN){
                if(temp <= all.length - 1){
                    temp ++;
                    $scope.searchResult.index = Math.min(all.length - 1,temp);
                }
                e.preventDefault();
            }
            if(e.keyCode == util.KEYMAP.ENTER){
                var type , isGroup , id;
                var data = all[$scope.searchResult.index];
                if(!data) return;
                if(data.type == 0 || data.type == 1){
                    $scope.selectThis(data);
                }
                // if(data.type == 2){
                    // $scope.goDept(data.Id);
                // }
                $scope.clearKeyword();
            }
        }
        all[$scope.searchResult.index] && (all[$scope.searchResult.index].active = true);
        setTimeout(function(){
            var active = $('.search_res').find('.active')[0];
            if(active){
                var height = $('.search_res').height();
                var activeHeight = active.clientHeight;
                var offset = active.offsetTop;
                var scrollTop = $('.search_res').scrollTop();
                if(offset + activeHeight > height + scrollTop){
                    $('.search_res').scrollTop(offset-height + activeHeight);
                }else{
                    if($scope.searchResult.index == 0){
                        $('.search_res').scrollTop(0);
                    }else{
                        if(offset < scrollTop){
                            $('.search_res').scrollTop(offset);
                        }
                    }
                }
            }
        })
    }
}]);

controllers.controller('chooseUserController',[function(){
}]);