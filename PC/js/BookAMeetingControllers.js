var controllers = angular.module('Controllers', []);
var FRAMEID = 'BookAMeeting';
controllers.controller('appController', ['$scope', 'util', 'empService', 'chatService', 'pops', 'userConfig', '$document', '$rootScope', 'webConfig', '$timeout', '$state', 'concatService', 'socketConnect', '$stateParams', 'langPack', 'frameService', 'settingService', 'envConfig', 'getChatIdInfo', 'getChatIdObj', function ($scope, util, empService, chatService, pops, userConfig, $doc, $rootScope, webConfig, $timeout, $state, concatService, socketConnect, stateParams, langPack, frameService, settingService, envConfig, getChatIdInfo, getChatIdObj) {
    $scope.userStatus = {};
    $scope.userStatus.online = true;
    $scope.frame = {
        status: 1 // 0 托盘 1 激活 2未激活
    }
    function getGlobalParams() {
        var maps = {
            LoginReturned: 'loginReturn',
            ReceiveNewMsg: 'receiveMsg',
            UpdateChatLatestReadTime: 'updateChatReadTime',
            MsgStatusReturned: 'msgStatusReturn',
            offlineChecked: 'statusChangeCallBack',//离线
            wakedByTray: 'wakedByTray',//托盘唤醒
            frameStatusChanged: 'frameStatusChangeCallBack',
            ChatUpdated: 'chatUpdated',
            groupUpdated: 'groupUpdate',
            cascadeCallback: 'cascadeCallback',
            fileProcessUpdated: 'fileProcessUpdated',
            hotKeyDetected: 'hotkeyDetected'
        }
        var params = {};
        for (var p in maps) {
            params[p] = 'globalFns.' + maps[p];
        }
        return params;
    }

    // callCefMethod('global/setCallback',);
    var isFirstCall = true;
    window.globalFns = {
        // loginReturn: function (res) {
        //     // 修改托盘图标操作
        //     this.statusChangeCallBack(res);
        //     if (isFirstCall) {
        //         isFirstCall = false;
        //         // 首次进入主界面操作
        //     } else {
        //         // 右键托盘，点击上线操作
        //     }
        // },
        // receiveMsg: function (res) {
        //     $rootScope.$broadcast('receiveMsgFromCef', res);
        // },
        // updateChatReadTime: function (res) {
        //     $rootScope.$broadcast('updateChatReadTime', res);
        // },
        // msgStatusReturn: function (res) {
        //     // 如果是消息撤回，则构造receiveMsgFromCef数据结构体{msg:{},sender:{}}，并触发receiveMsgFromCef事件
        //     // 否则触发msgSendResult
        //     var msg = res.Data;
        //     // chatService.setLastMsgTime(msg.ChatId,msg.Timestamp);
        //     if (!msg) return;
        //     var isWithDraw = false;
        //     if (webConfig.MSG_TYPE_ARR[msg.Type] == webConfig.MSG_SERVICE_TYPE) {
        //         var msgObj = angular.fromJson(msg.Content);
        //         if (msgObj.n_TYPE == 7) {
        //             isWithDraw = true;
        //         }
        //     }
        //     if (isWithDraw) {
        //         var temp = {};
        //         temp.msg = msg;
        //         var currentUser = webConfig.getUser();
        //         temp.sender = {};
        //         temp.sender.Id = currentUser.Id;
        //         temp.sender.Name = currentUser.Name;
        //         temp.sender.Avatar = currentUser.Avatar;
        //         $rootScope.$broadcast('receiveMsgFromCef', {
        //             Code: 0,
        //             Data: [temp],
        //             Flage: 0,
        //             Message: null
        //         });
        //     } else {
        //         $rootScope.$broadcast('msgSendResult', res);
        //     }
        // },
        // statusChangeCallBack: function (res) {
        //     // 0成功
        //     // 1失败
        //     // 2掉线
        //     // 3被踢
        //     // 4失效
        //     $timeout(function () {
        //         $scope.userStatus.status = res.Data;
        //         if (res.Data != 0) {
        //             frameService.offLine();
        //             $scope.userStatus.online = false;
        //             if (res.Data == 3) {
        //                 frameService.accountLogout(function () {
        //                     alert(langPack.getKey('loginInOther'));
        //                     frameService.reset(langPack.getKey('appName'), 'login.html', {
        //                         action: 'login'
        //                     }, 340, 490);
        //                 })
        //             }
        //             if (res.Data == 1) {

        //             }
        //             if (res.Data == 4) {
        //                 frameService.accountLogout(function () {
        //                     alert(langPack.getKey('outOfToken'));
        //                     frameService.reset(langPack.getKey('appName'), 'login.html', {
        //                         action: 'login'
        //                     }, 340, 490);
        //                 })
        //             }
        //             // if(res.Data == 2){
        //             // alert(langPack.getKey('offlineTip'));
        //             // }
        //         } else {
        //             $scope.userStatus.online = true;
        //             frameService.onLine();
        //         }
        //     })
        // },
        // wakedByTray: function (res) {
        //     $rootScope.$broadcast('wakedByTray', res);
        // },
        // frameStatusChangeCallBack: function (res) {
        //     $scope.frame.status = res.Data;
        //     if (res.Data == 1) {
        //         frameService.stopTwinkle();
        //         $rootScope.$broadcast('frameFocus');
        //     }
        //     $rootScope.$broadcast('frameStatusChangeCallBack', res.Data);
        // },
        // chatUpdated: function (res) {
        //     var currentUser = webConfig.getUser();
        //     if (res.Data.Type == 1000) {
        //         if (currentUser.Id == res.Data.Id) {
        //             $('.' + res.Data.Id).addClass('online').removeClass('offline');
        //             $('.' + res.Data.Id).attr('src', res.Data.Avatar + '?_=' + util.getNow());
        //         } else {
        //             if (res.Data.IMStatus == 5) {
        //                 $('.' + res.Data.Id).removeClass('online').addClass('offline');
        //             } else {
        //                 $('.' + res.Data.Id).addClass('online').removeClass('offline');
        //             }
        //             $('.' + res.Data.Id).attr('src', res.Data.Avatar + '?_=' + util.getNow());
        //         }
        //     }
        //     $rootScope.$broadcast('chatUpdated', res);
        // },
        // groupUpdate: function (res) {
        //     $rootScope.$broadcast('groupUpdate', res);
        // },
        cascadeCallback: function (res) {
            if (res.Data.action == 'settingChange') {
                settingService.getSetting(function (res) {
                    $scope.userSetting = res.Data;
                })
                return;
            }
            $rootScope.$broadcast('cascadeCallback', res);
        },
        // fileProcessUpdated: function (res) {
        //     $rootScope.$broadcast('changeFileMessageUploadProgess', res.Data);
        // },
        // hotkeyDetected: function (res) {
        //     $rootScope.$broadcast('hotkeyDetected', res.Data);
        // }
    }
    for (var p in globalFns) {
        globalFns[p] = (function (method) {
            var old = globalFns[method];
            return function (res) {
                console.log('-----------------------------------');
                console.log(method, res)
                console.log('-----------------------------------');
                old.call(globalFns, res);
            }
        })(p);
    }

    frameService.setGlobalCallbak(getGlobalParams(), function () {
        // alert('setGlobalCallbak')

        frameService.connectIm(function (res) {
        });
    })
    // settingService.getSetting(function (res) {
    //     $scope.userSetting = res.Data;
    // })
    // frameService.getCurrentUser(function (res) {
    //     frameService.onLine();
    //     $timeout(function () {
    //         $scope.user = webConfig.getUser();
    //         $scope.global = envConfig.getEnvData();
    //     })
    // });
    // $scope.toggleSystemMenu = function (e) {
    //     $scope.show = !$scope.show;
    //     $rootScope.$broadcast('document.click');
    // }
    // 拖动框架窗口 - 开始
    $scope.menuList = [];
    var mouseDownTimer;
    $doc.bind('mousedown',function(e){
        var tar = e.srcElement || e.target;
        var tagName = tar.tagName.toLowerCase();
        // console.log(tagName,tar.className);
        var parentTar = tar.parentNode;
        var parTagName = parentTar.tagName ? parentTar.tagName.toLowerCase() : '';
        if (  tar.className =="webRTC-header-right gg-flex-3") {
            mouseDownTimer = setTimeout(function () {
                frameService.moveFrame();
            });
        } 
    });
    $doc.bind('mouseup', function (e) {
        clearTimeout(mouseDownTimer);
    });
    // 窗口 拖动 - 逻辑结束
 

    frameService.getCurrentUser(function (res) {
        $timeout( function () {
            $scope.user = webConfig.getUser();
            console.log($scope.user);
            // 获取 拼接在当前路径后面传入的值  查看是修改预约会议 还是创建预约会议
            var search = util.getSearch();
            console.log('search===>', search);
            $scope.Meeting ={
                roomKey:'',//房间id
                theme:'',//会议主题
                time:'',//会议时间
                type:'video',//会议类型
                userList:[],//参会成员
                deleteListSwitch:false,//是否删除 指定参会成员
            };
            // console.log('视频会议消息体===>',$scope.webRTC.multiplayer,JSON.parse(decodeURIComponent(search.msgContent)))
            //修改 - 接收传入的预约视频会议信息
            if(search.roomKey){
                let selected=JSON.parse(decodeURIComponent(search.selected));
                $scope.Meeting.roomKey = search.roomKey;
                $scope.Meeting.theme = decodeURIComponent(search.theme);
                $scope.Meeting.time = decodeURIComponent(search.roomtime);
                $scope.Meeting.type = search.type;
                for(let i in  selected){
                    concatService.getUser((selected[i].userId), function (res) {
                        $timeout(function () {
                            if(res.Code == 0){
                                $scope.Meeting.userList.push({id:res.Data.UserId||res.Data.Id,img:res.Data.Avatar,name:res.Data.Name,});
                            };
                        })
                    })
                    // $scope.selected.push(list[i]);
                }
            }
            // 初始化
            $scope.initRtc();

           
        })
    })
    $scope.initRtc =function(){
        $timeout(() => {
            //时间插件 初始化
         // 获取当前时间戳 并且当前时间+10分钟 1分钟（60 * 1000）
           let date =new Date(new Date().getTime() + ( 10 * 60 * 1000));
           //  初始默认时间  最小当前时间的10分钟后
           let tomorrow = date.getFullYear() + "-" + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + "-" + ((date.getDate())<10?'0'+date.getDate():date.getDate()) + " " + (date.getHours()<10?'0'+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
        console.log(date,tomorrow);
        $('#datetimepicker').datetimepicker({
            forceParse: 0,  //强制解析
            format: 'yyyy-mm-dd hh:ii',//显示格式
            language: 'zh-CN',//显示中文
            startDate:tomorrow,//开始时间 - 初始默认时间 当前时间的10分钟后
            startView:'month',//开始视图 - 日期时间选择器打开之后首先显示的视图 - 默认月视图
            todayBtn:1,//显示今日按钮
            minuteStep:1,//构建小时视图。对于每个 minuteStep 都会生成一组预设时间（分钟）用于选择默认为5 每5分钟为1个间隔选择 当前为每1分钟一个间隔
            todayHighlight:true,//当天日期高亮
            autoclose: true,//选中之后自动隐藏日期选择框
            clearBtn: true,//清除按钮
            weekStart:1,//一周从哪一天开始。0（星期日）到6（星期六） 默认值 0
        }).on('click', function (ev) {
           // 获取当前时间戳 并且当前时间+10分钟 1分钟（60 * 1000）
           let date =new Date(new Date().getTime() + ( 10 * 60 * 1000));
           //  初始默认时间  最小当前时间的10分钟后
           let tomorrow = date.getFullYear() + "-" + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + "-" + ((date.getDate())<10?'0'+date.getDate():date.getDate()) + " " + (date.getHours()<10?'0'+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
           console.log(date,tomorrow);
            //每次点击选择时间 重新获取最新时间 设置 开始时间
           $('#datetimepicker').datetimepicker('setStartDate', tomorrow);
             //    滚动到 标记的标签位置
            // document.getElementsByClassName('datetimepicker')[0].scrollTop  =document.getElementsByClassName('active')[0].offsetTop;
        }).on('changeDate',function(ev){
            // 时间发生改变时触发
             // 获取当前时间戳 
           let date = new Date().getTime();
             if(ev.date.valueOf() < date){
                  alert('预约会议开始时间必须大于当前时间');
                //   input标签 赋空值
                 ev.target.value='';
                //  修改数据
                 $scope.Meeting.time='';
                 return;
             }
        });

        })
    };
    // var search = util.getSearch();
    // console.log(util.getNow() - search.time);
}])

controllers.controller('mainController', ['$rootScope', '$scope', 'concatService', '$templateCache', '$compile', '$timeout', 'webConfig', 'util', 'chatService', 'langPack','frameService', 'getChatIdInfo', 'getChatIdObj', 'rtcRoomObj', function ($rootScope, $scope, concatService, $templateCache, $compile, $timeout, webConfig, util, chatService,langPack, frameService, getChatIdInfo, getChatIdObj, rtcRoomObj) {
    $timeout(function () {
        $('.search_area input').focus();
    }, 100); 
    // 获取 拼接在当前路径后面传入的值 房间id
    var search = util.getSearch();
    console.log(search);

    // 选择会议预约类型
    $scope.selectMeetingType=function($event,type){
        console.log( $scope.Meeting);
        // 房间id 存在 禁止修改会议类型
        if($scope.Meeting.roomKey){
            return;
        }
        if(type != 'video'){
            return alert('暂未开放');
        }
        $scope.Meeting.type=type;
    };
    // 设置预约会议时间
    // $scope.setMeetingTime=function($event) {
    //         //    alert('初始化执行')
    //         // 获取当前时间戳 并且当前时间+10分钟 1分钟（60 * 1000）
    //         //    let date =new Date(new Date().getTime() + ( 10 * 60 * 1000));
    //         //    //  初始默认时间  最小当前时间的10分钟后
    //         //    let tomorrow = date.getFullYear() + "-" + ((date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1)) + "-" + ((date.getDate())<10?'0'+date.getDate():date.getDate()) + " " + (date.getHours()<10?'0'+date.getHours():date.getHours()) + ":" + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
    //         // console.log(date,tomorrow);
    //         // $('#datetimepicker').datetimepicker('setStartDate', tomorrow);
    // }
    // 添加会议成员
    $scope.startChat = function ($event) {
        // 关闭选择删除成员 开关
        $scope.Meeting.deleteListSwitch =false;
        var params = {};
        // 已有的成员传入 选择成员页面
        if($scope.Meeting.userList.length>0){
            params.selected = JSON.stringify($scope.Meeting.userList);
        }
        params.BookAMeetingAddList = true;//预约会议添加成员 控制器 
        frameService.open('chooseUser', 'choose.html', params, 600, 550, true, '预约会议添加成员');
    };
    //是否 开启选择删除成员
    $scope.setDeleKey = function($event){
        if($scope.Meeting.userList.length>0){
            $scope.Meeting.deleteListSwitch = !$scope.Meeting.deleteListSwitch;
        };
    };
    //删除指定成员
    $scope.setlistDelete =  function($event,id){
       let list= $scope.Meeting.userList;
       for(let i in list){
           if( list[i].id == id ){
                list.splice(i, 1);
           }
       }
       console.log(   $scope.Meeting.userList );
    };
    //取消预约
    $scope.onCancel = function($event){
        // 关闭 当前窗口
        frameService.closeFrame(FRAMEID);
    }
    // 确认预约
    $scope.submit= function($event){
        if($scope.Meeting.theme=='' || $scope.Meeting.time =='' || $scope.Meeting.userList.length<=0){
         return   alert($scope.Meeting.theme==''?'请填写：会议主题':$scope.Meeting.time==''?'请填写：会议时间':$scope.Meeting.userList.length<=0?'请选择：参会成员':'');
        }
          // 获取当前时间戳 
          let date = new Date().getTime();
          if(new Date($scope.Meeting.time).getTime() < date){
            alert('请重新选择：预约会议开始时间必须大于当前时间');
            // 清除input 值
            $('#datetimepicker').val('');
            $scope.Meeting.time='';
              return;
          };
         //  创建预约会议 roomKey 传空
        let params={"roomKey":  $scope.Meeting.roomKey,"subject":  $scope.Meeting.theme, "meetingType": $scope.Meeting.type, "beginTime": $scope.Meeting.time, "members": []};
        let list= $scope.Meeting.userList;
        for(let i in list){
            params.members.push(list[i].id)
        };
        callCefMethod('chat/SaveAppointmentMeeting',params , function (res) {
            console.log(res);
            // 关闭窗口
            frameService.closeFrame(FRAMEID);
        })
    }
    // 收到main主页面的通知 视频会议消息 状态是 关闭的 
    $scope.$on('cascadeCallback', function (ev, res) {
        console.log('成员选择窗口返回的通知===>',res)
        $timeout(() => {
            // 成员选择窗口 返回 通知选择的成员列表
            if(res.Code==0){
                if(res.Data.action == "BookAMeetingAddList"){
                    console.log( res.Data.selected);
                    if($scope.Meeting.userList.length<=0){
                        for(let i in res.Data.selected){
                            $scope.Meeting.userList.push({id:res.Data.selected[i].UserId||res.Data.selected[i].Id,img:res.Data.selected[i].Avatar,name:res.Data.selected[i].Name,});
                            // $scope.Meeting.userList.push(res.Data.selected[i]);
                        }
                    }else{
                        let is=false;
                        for(let i in res.Data.selected){
                            for(let k in $scope.Meeting.userList){
                                if( $scope.Meeting.userList[k].id == (res.Data.selected[i].UserId||res.Data.selected[i].Id)){
                                     // id存在 跳出循环 遍历下一条数据
                                    is=false;
                                    break;
                                }else{
                                    is=true;
                                }
                            }
                            if(is){
                                // $scope.Meeting.userList.push(res.Data.selected[i])
                                $scope.Meeting.userList.push({id:res.Data.selected[i].UserId||res.Data.selected[i].Id,img:res.Data.selected[i].Avatar,name:res.Data.selected[i].Name,});
                            }
                        }
                    }
                }
                console.log(   $scope.Meeting.userList );
            }
        });
    });

}]);