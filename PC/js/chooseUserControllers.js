var controllers = angular.module('Controllers');
var FRAMEID = 'chooseUser';
controllers.controller('appController', ['$rootScope', '$scope', 'webConfig', '$timeout', '$document', 'frameService', function ($rootScope, $scope, webConfig, $timeout, $doc, frameService) {
    frameService.getCurrentUser(function (res) {
        $timeout(function () {
            $scope.user = webConfig.getUser();
        })
    })
    $doc.bind('mousedown', function (e) {

    });
    var search = util.getSearch();
    console.log(util.getNow() - search.time);
}]);
controllers.controller('mainController', ['$rootScope', '$scope', 'concatService', '$templateCache', '$compile', '$timeout', 'webConfig', 'util', 'chatService', 'frameService', function ($rootScope, $scope, concatService, $templateCache, $compile, $timeout, webConfig, util, chatService, frameService) {
    $timeout(function () {
        $('.search_area input').focus();
    }, 100);
    var search = util.getSearch();
    var elem = angular.element;
    var currentUser = webConfig.getUser();
    $scope.searchResultUser = [];
    $scope.show = {
        friend: false,
        user: false,
        dept: false,
        group: false,
        grouplist: false,  //新增字段 点击切换当前群显示隐藏
    }
    $scope.users = [];
    $scope.groups = [];
    $scope.friends = [];
    $scope.selected = [];
    $scope.index = -1;
    $scope.groupObj = {}; //新增字段 创建视频会议 值存储容器
    $scope.groupObj.grouplist = [];// 群列表容器
    //新增字段 创建视频会议 获取当前群名称  只显示群当前成员列表 其他列表全部不显示
    if (search.videoConference || search.AddListVideoConference) {
        // 点击摄像头icon 传入的群相关消息 id name等
        console.log('search===>', search)
        $timeout(function () {
            // decodeURIComponent 解码  获取当前群名称
            $scope.groupObj.groupName = decodeURIComponent(search.groupName);
            // 仅当前群显示 其他列表+搜索全部不显示
            $scope.groupObj.onlyGroup = true;

            console.log('search===>', $scope.groupObj)
        })
        // 默认展开 群成员列表
        $scope.show.grouplist = true;
        concatService.getGroup(search.groupId, function (res) {
            $timeout(function () {
                if (res.Code == 0) {
                    // 群列表容器
                    $scope.groupObj.grouplist = res.Data.Members;
                    // console.log(res);
                }
            })
        })
    }
    // 预约会议- 添加成员
    if (search.BookAMeetingAddList) {
    // 已选的成员
        if(search.selected){
            let list=JSON.parse(decodeURIComponent(search.selected))
            for(let i in list){
                concatService.getUser((list[i].id), function (res) {
                    $timeout(function () {
                        // deleteAble 控制是否可以 操作 删除
                        // res.Data.deleteAble = true;
                        $scope.selected.push(res.Data);
                    })
                })
                // $scope.selected.push(list[i]);
            }
        }
       
        // $timeout(function () {
        //     // decodeURIComponent 解码  获取当前群名称
        //     $scope.groupObj.groupName = decodeURIComponent(search.groupName);
        //     // 当前群显示
        //     $scope.groupObj.makeAnAppointmentGroup = true;

        //     console.log('search===>', $scope.groupObj)
        // })
        // // 默认展开 群成员列表
        // $scope.show.grouplist = true;
        // concatService.getGroup(search.groupId, function (res) {
        //     $timeout(function () {
        //         if (res.Code == 0) {
        //             // 群列表容器
        //             $scope.groupObj.grouplist = res.Data.Members;
        //             // console.log(res);
        //         }
        //     })
        // })
    }

    if (search.action == 'new') {
        if (search.selected) {
            concatService.getUser(search.selected, function (res) {
                $timeout(function () {
                    res.Data.deleteAble = true;
                    $scope.selected.push(res.Data);
                })
            })
        }
    } else if (search.action == 'add') {
        concatService.getGroup(search.groupId, function (res) {
            $timeout(function () {
                for (var i = 0; i < res.Data.Members.length; i++) {
                    if (currentUser.Id == res.Data.Members[i].Id) continue;
                    res.Data.Members[i].deleteAble = false;
                    $scope.selected.push(res.Data.Members[i]);
                }
            })
        })
    }

    $scope.select = '';
    var inited = false;
    $scope.close = function () {
        frameService.closeFrame(FRAMEID);
    }
    init();
    function init() {
        if (inited) return;
        concatService.getEnts(function (res) {
            $('.ents').html('');
            createEnts(res.Data);
        })
        inited = true;
    }
    $scope.getFriends = function () {
        if (!$scope.show.friend) {
            $scope.show.friend = true;
            concatService.getFriends(function (res) {
                $timeout(function () {
                    $scope.friends = res.Data;
                })
            })
        } else {
            $scope.show.friend = false;
        }
    }
    //视频会议 获取 当前群成员列表
    $scope.getGroupList = function () {
        if (!$scope.show.grouplist) {
            $scope.show.grouplist = true;
            concatService.getGroup(search.groupId, function (res) {
                $timeout(function () {
                    if (res.Code == 0) {
                        // 群列表容器
                        $scope.groupObj.grouplist = res.Data.Members;
                        // console.log(res);
                    }
                })
            })
        } else {
            $scope.show.grouplist = false;
        };
    }
    $scope.getFavorite = function (type) {
        var keys = ['user', 'dept', 'group'];
        if (!$scope.show[keys[type]]) {
            $scope.show[keys[type]] = true;
            concatService.getFavorite(type, function (res) {
                $timeout(function () {
                    if (type == 0) {
                        console.log('users===>', res.Data)
                        $scope.users = res.Data;
                    }
                    if (type == 1) {
                        $('#fav_depts').html('');
                        createEnts(res.Data, $('#fav_depts'), 1, true);
                    }
                    if (type == 2) {
                        $scope.groups = res.Data;
                    }
                })
            })
        } else {
            $scope.show[keys[type]] = false;
        }
    }
    $scope.selectThis = function (user) {
        $('.ent_tree .select').removeClass('select');
        $scope.select = user;
        var tarUserId = user.UserId || user.Id;
        if (currentUser.Id == tarUserId || currentUser.Id == tarUserId) {
            return;
        }
        var isIn = false;
        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i].Id == tarUserId || $scope.selected[i].UserId == tarUserId) {
                isIn = true;
                break;
            }
        }
        if (!isIn) {
            user.deleteAble = true;
            $timeout(function () {
                $scope.selected.push(user);
            })
            $scope.clearSearch();
        }
    }
    $scope.deleteThis = function (user) {
        var tarUserId = user.UserId || user.Id;
        for (var i = $scope.selected.length - 1; i >= 0; i--) {
            if ($scope.selected[i].Id == tarUserId || $scope.selected[i].UserId == tarUserId) {
                $scope.selected.splice(i, 1);
                break;
            }
        }
    }
    var submiting = false;
    $scope.submit = function () {
        // search 传入的参数
        var userIds = [];
        // videoConference-多人视频会议发起 
        if (search.videoConference) {
            // if(submiting)  return;
            // submiting = true;
            // for(var i=0;i<$scope.selected.length;i++){
            //     userIds.push({id:$scope.selected[i].UserId || $scope.selected[i].Id,name:$scope.selected[i].Name,img:''});
            // }
            if ($scope.selected.length > 0) {

                frameService.notice({
                    selected: $scope.selected,
                    groupId: search.groupId,// 群id
                    // groupId: search.groupId,// groupId 群id
                    timestamp: util.getNow(),
                    frameId: 'main',
                    action: 'videoConference'
                }, function (res) {
                    // $scope.close();
                    frameService.closeFrame(FRAMEID);
                })
            }

        } else if (search.AddListVideoConference) {
            // 视频会议添加成员
            if ($scope.selected.length > 0) {

                frameService.notice({
                    selected: $scope.selected,
                    groupId: search.groupId,// 群id
                    roomId: search.roomId,// 房间id
                    timestamp: util.getNow(),
                    frameId: 'main',
                    action: 'AddListVideoConference'
                }, function (res) {
                    $scope.close();
                })
            }
        
        }else if (search.BookAMeetingAddList) {
              //预约 视频会议添加成员
              if ($scope.selected.length > 0) {

                frameService.notice({
                    selected: $scope.selected,
                    // groupId: search.groupId,// 群id
                    // roomId: search.roomId,// 房间id
                    timestamp: util.getNow(),
                    frameId: 'BookAMeeting',
                    action: 'BookAMeetingAddList'
                }, function (res) {
                    $scope.close();
                })
            }
        }
         if (search.action == 'new') {
            if (submiting) return;
            submiting = true;
            for (var i = 0; i < $scope.selected.length; i++) {
                userIds.push($scope.selected[i].UserId || $scope.selected[i].Id);
            }
            var groupId = ['group', currentUser.Id, util.getNow()].join('_');
            if (userIds.length == 0) {
                submiting = false;
                return;
            } else if (userIds.length == 1) {
                frameService.notice({
                    chatId: userIds[0],
                    timestamp: util.getNow(),
                    frameId: 'main',
                    action: 'chatWith'
                }, function (res) {
                    $scope.close();
                })
            } else {
                frameService.notice({
                    chatId: groupId,
                    timestamp: util.getNow(),
                    frameId: 'main',
                    action: 'creatingGroup'
                }, function (res) {
                });
                chatService.createGroup(groupId, userIds, function (res) {
                    submiting = false;
                    if (res.Data == 1) {
                        $scope.close();
                        // frameService.notice({
                        // chatId : groupId,
                        // timestamp : util.getNow(),
                        // frameId : 'main',
                        // action : 'chatWith'
                        // },function(res){
                        // $scope.close();
                        // })
                    } else {
                        frameService.notice({
                            chatId: groupId,
                            timestamp: util.getNow(),
                            frameId: 'main',
                            action: 'createGroupReturn'
                        });
                    }
                })
            }
        }
        if (search.action == 'add') {
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.selected[i].deleteAble !== false) {
                    userIds.push($scope.selected[i].UserId || $scope.selected[i].Id);
                }
            }
            chatService.addUsers(search.groupId, userIds, function (res) {
                $scope.close();
            })
        }
    }

    function createEnts(ents, container, level, isFav) {
        container = container || $('.ents');
        for (var i = 0; i < ents.length; i++) {
            var _scope = $scope.$new();
            var tplName = isFav ? 'favDept.html' : 'ent.html';
            var tpl = $templateCache.get(tplName);
            var _ele = elem(tpl);
            _scope.ent = ents[i];
            $compile(_ele)(_scope);
            container.append(_ele);
            _scope.$digest();
            if (level) {
                _ele.find('.ent_dept').attr('level', (level + 1));
                _ele.find('.ent_dept').css('paddingLeft', (level + 1) * 14)
            } else {
                _ele.find('.ent_dept').attr('level', 1);
            }
            _ele.find('.ent_dept').click(function () {
                toggleSelect.call(this);
                var id = $(this).attr('did');
                var entId = $(this).parents('.root').attr('cid') || $(this).attr('cid');
                $rootScope.$broadcast('onSelectConcat', isFav ? 2 : 1, id, entId);
                var that = $(this);
                var dom = $(this).next();
                if ($(this).hasClass('show')) {
                    dom.hide();
                    $(this).removeClass('show');
                } else {
                    $(this).addClass('show');
                    dom.show();
                }
                var level = $(this).attr('level');
                $('.ents').css('width', Math.max($('.concat_wrap')[0].scrollWidth, $('.concat_wrap')[0].offsetWidth));
                concatService.getDept(id, function (res) {
                    if (!that.attr('get')) {
                        dom.html('');
                        createBranchs(res.Data.Staffs, level, dom, true);
                        createBranchs(res.Data.Children, level, dom);
                        that.attr('get', true);
                    }
                    if (isFav) {
                        $rootScope.$broadcast('onSelectDept', res.Data);
                    } else {
                        $rootScope.$broadcast('onSelectEnt', res.Data);
                    }
                })
            })
        }
    }
    function toggleSelect() {
        $('.concat_wrap .select').removeClass('select');
        $(this).addClass('select');
    }
    var cache = {};
    function createBranchs(list, level, container, isEmp) {
        level = parseInt(level);
        for (var i = 0; i < list.length; i++) {
            createEle(i);
        }
        setTimeout(function () {
            $('.ents').css('width', Math.max($('.concat_wrap')[0].scrollWidth, $('.concat_wrap')[0].offsetWidth));
        })
        function createEle(i) {
            var _scope = $scope.$new();
            var tplName = isEmp ? 'entUser.html' : 'entDept.html';
            var tpl = $templateCache.get(tplName);
            var _ele = elem(tpl);
            if (isEmp) {
                cache[list[i].UserId] = list[i];
            }
            _scope.branch = list[i];
            $compile(_ele)(_scope);
            container.append(_ele);
            _ele.find('.ent_dept').attr('level', level + 1);
            _ele.find('.ent_dept').css('paddingLeft', (level + 1) * 14)
            _ele.find('.ent_dept').click(function () {
                var that = $(this);
                toggleSelect.call(this);
                var id = $(this).attr('did');
                var entId = $(this).parents('.childs').last().prev().attr('cid');
                if (isEmp) {
                    $scope.selectThis(cache[id]);
                    // $rootScope.$broadcast('onSelectConcat',0,id,entId);
                } else {
                    // $rootScope.$broadcast('onSelectConcat',2,id,entId);
                    var dom = $(this).next();
                    if ($(this).hasClass('show')) {
                        dom.hide();
                        $(this).removeClass('show');
                        $('.ents').css('width', Math.max($('.concat_wrap')[0].scrollWidth, $('.concat_wrap')[0].offsetWidth));
                    } else {
                        $(this).addClass('show');
                        dom.show();
                    }
                    var level = $(this).attr('level');
                    $('.ents').css('width', Math.max($('.concat_wrap')[0].scrollWidth, $('.concat_wrap')[0].offsetWidth));
                    concatService.getDept(id, function (res) {
                        if (!that.attr('get')) {
                            dom.html('');
                            createBranchs(res.Data.Staffs, level, dom, true);
                            createBranchs(res.Data.Children, level, dom);
                            that.attr('get', true);
                        }
                        $rootScope.$broadcast('onSelectDept', res.Data);
                    })
                }
            })
        }
    }

    var searchTimer;
    $scope.clearSearch = function () {
        $scope.keyword = '';
        $scope.searchResultUser = [];
    }
    $scope.search = function () {
        if (!$scope.keyword) {
            $scope.searchResultUser = [];
            return;
        }
        chatService.searchUser($scope.keyword, 10, function (res) {
            if (res.Data.key != $scope.keyword) return;
            if (res.Data.type == -2) {
                $timeout(function () {
                    $scope.searchResultUser = res.Data.data.users;
                    if ($scope.searchResultUser.length) {
                        $scope.index = 0;
                        $scope.searchResultUser[$scope.index].active = 1;
                    }
                })
            }
        })
    }
    $scope.$watch('keyword', function (v) {
        $scope.search();
    })
    $scope.onKeyDown = function (e) {
        var temp = $scope.index;
        var all = $scope.searchResultUser;
        all[temp] && (all[temp].active = false);
        var change = 0;
        if (e) {
            if (e.keyCode == util.KEYMAP.UP) {
                if (temp >= 1) {
                    temp--;
                } else {
                    temp = all.length - 1;
                }
                $scope.index = Math.max(0, temp);
                e.preventDefault();
            }
            if (e.keyCode == util.KEYMAP.DOWN) {
                if (temp < all.length - 1) {
                    temp++;
                } else {
                    temp = 0;
                }
                $scope.index = Math.min(all.length - 1, temp);
                e.preventDefault();
            }
            if (e.keyCode == util.KEYMAP.ENTER) {
                var type, isGroup, id;
                var data = all[$scope.index];
                if (!data) {
                    if (!$scope.keyword && $scope.selected.length != 0) {
                        $scope.submit();
                    }
                    return;
                };
                $scope.selectThis(data);
                $scope.clearSearch();

            }
        }
        all[$scope.index] && (all[$scope.index].active = true);
        setTimeout(function () {
            var active = $('.search_res').find('.active')[0];
            if (active) {
                var height = $('.search_res').height();
                var activeHeight = active.clientHeight;
                var offset = active.offsetTop;
                var scrollTop = $('.search_res').scrollTop();
                if (offset + activeHeight > height + scrollTop) {
                    $('.search_res').scrollTop(offset - height + activeHeight);
                } else {
                    if ($scope.index == 0) {
                        $('.search_res').scrollTop(0);
                    } else {
                        if (offset < scrollTop) {
                            $('.search_res').scrollTop(offset);
                        }
                    }
                }
            }
        })
    }
}]);
