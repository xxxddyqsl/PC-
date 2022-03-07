var controllers = angular.module('Controllers', []);
var FRAMEID = 'vidioMeeting';

// var videoInit = {
//     BisectorModeobj: [],// 平分模式li 的x y坐标 宽高对象
//     MasterMode: [],
//     //  获取 两种模式 的x y坐标 宽 高 信息
//     getCoordinate(arr, id, is) {
//         let that = this;
//         if (id == 'MasterMode') {
//             // 获取 1大5小模式 大屏的x y坐标 宽高 画出 1大5小模式 的视频位置
//             let m = that.getObjXY($('.MasterMode-main')[0]);
//             that.MasterMode.push(m);
//         }
//         $("#" + id).find('ul').find('li').each(function () {
//             let obj = that.getObjXY($(this)[0]);
//             arr.push(obj);
//         })
//         // 根据 x y坐标 宽 高 等信息 画出 视频显示的位置大小
//         // arr.forEach((item, index) => {
//         //     if (index != 1) {
//         //         jj.fetch("frame/controlvidiopanel", JSON.stringify({ data: { panelName: item.id, x: item.x, y: item.y, width: item.w, height: item.h, isShow: is } }));
//         //     }
//         // })
//         console.log(arr, is)
//     },
//     //得到元素的左上角绝对坐标
//     getObjXY(node) {
//         // console.log(node);
//         let id = node.id;
//         let x = node.getClientRects()[0].x;
//         let y = node.getClientRects()[0].y;
//         let w = node.getClientRects()[0].width;
//         let h = node.getClientRects()[0].height;
//         return { 'id': id, 'x': x, 'y': y, 'w': w, 'h': h };
//     },

//     // 切换 显示模式
//     async OnModeSwitch(node) {
//         let that = this;
//         let Bisector = $('#BisectorMode');
//         let Master = $('#MasterMode');
//         // console.log(Bisector.is(":hidden"));
//         // 平分模式是否隐藏
//         if (!$('#BisectorMode').is(":hidden")) {
//             // 1大5小模式 显示
//             $('#MasterMode').show();
//             // 平分模式 隐藏
//             $('#BisectorMode').hide();
//             // 平分模式 下的视频 请求改为false
//             await this.OnCancel(that.BisectorModeobj, false);
//             // 清空  1大5小模式 的x y坐标 宽高
//             that.MasterMode = [];
//             that.getCoordinate(that.MasterMode, 'MasterMode', true);
//         } else {
//             // 1大5小 模式 下的视频 请求改为false
//             await this.OnCancel(that.MasterMode, false);
//             // 1大5小模式 隐藏
//             $('#MasterMode').hide();
//             // 平分模式  显示
//             $('#BisectorMode').show();
//             // 清空  平分模式 的x y坐标 宽高
//             that.BisectorModeobj = [];
//             // 获取 平分模式 的x y坐标 宽高 画出平分模式的视频位置
//             that.getCoordinate(that.BisectorModeobj, 'BisectorMode', true);
//         }
//     },
//     // 切换时 根据 x y坐标 宽 高 等信息 不显示 上一种模式的视频
//     OnCancel(arr, is) {
//         console.log(arr, is);
//         return new Promise((resolve) => {
//             // arr.forEach((item, index) => {
//             //     jj.fetch("frame/controlvidiopanel", JSON.stringify({ data: { panelName: item.id, x: item.x, y: item.y, width: item.w, height: item.h, isShow: is } }));
//             // });
//             resolve(arr);
//         })
//     },
// };
// class rtc {
//     say=null;
//     timeout=null;
//     // users 返回在线成员
//     onRegisteRsp(startAt, serverTime, roomAttrs, users) {
//         console.log(this.say);
//         console.log(this.timeout)
//         if (users.length > 0) {
//             // timeout 函数 实时 更新 数据 + view视图
//             this.timeout(()=> {
//                 for (let i in users) {
//                     if(!users[i].stream){
//                         // 视频 流 存储容器
//                         users[i].stream=null;
//                     }
//                     this.say.videoObj.userList.push(users[i]);
//                 };
//             });
//         };
//         // this.say.videoObj.userList
//         console.log(' onRegisteRsp : ==> ');
//         //    return console.log(startAt, serverTime, roomAttrs, 'users:==>'+users);
//         return console.log(users);
//     };
//     onSetRoomAttrRsp(attrs) {
//         console.log(' onSetRoomAttrRsp :==> ');
//         return console.log(attrs);
//     };
//     onSetMediaAttrRsp(media) {
//         console.log(' onSetMediaAttrRsp :==> ');
//         return console.log(media);
//     };
//     onSetUserAttrRsp() {
//         return console.log(' onSetUserAttrRsp :==> ');
//     };
//     onAddParticipantRsp(users) {
//         console.log(' onAddParticipantRsp :==> ');
//         return console.log(users);
//     };
//     onOrderStreamRsp() {
//         return console.log(' onOrderStreamRsp :==> ');
//     };
//     onUpdateMediaRsp(medias) {
//         console.log(' onUpdateMediaRsp :==> ');
//         return console.log(medias);
//     };

//     notifyRoomAttr(attrs) {
//         console.log(' notifyRoomAttr :==> ');
//         return console.log(attrs);
//     };

//     notifyUserAttr(clientId, attrs) {
//         console.log(' notifyUserAttr :==> ');
//         return console.log(clientId, attrs);
//     };
//     //返回用户在线下线状态
//     notifyUserStatus(users) {
//         var is = false;
//         let userList = this.say.videoObj.userList;
//         console.log(userList);
//         if (userList.length >= 0) {
//             //  timeout  函数 实时 更新 数据 + view视图
//             this.timeout(()=> {
//                 for (let k in users) {
//                     for (let i in userList) {
//                         if (userList[i].clientId == users[k].clientId) {
//                             is = false;
//                             if(!users[k].stream){
//                                 //自定义 视频 流 存储容器
//                                 users[k].stream=null;
//                             }
//                             //id相同 替换对应数据 break跳出当前循环
//                             userList.splice(i, 1, users[k]);
//                             break;
//                         } else {
//                             is = true;
//                         }
//                     };
//                     if (is) {
//                         if(!users[k].stream){
//                             //自定义 视频 流 存储容器
//                             users[k].stream=null;
//                         }
//                         userList.push(users[k]);
//                     };
//                 };
//                 console.log(userList);
//             });
//         };
//         console.log(' notifyUserStatus  :==> ');
//         return console.log(users);
//     };
//     notifyAddParticipant() {
//         return console.log(' notifyAddParticipant :==> ');
//     };
//     notifyBindStream(attrs) {
//         console.log(' notifyBindStream :==> ');
//         return console.log(attrs);
//     };
//     notifyRelogin(reason) {
//         console.log(' notifyRelogin :==> ');
//         return console.log(reason);
//     };
//     notifyError(errCode, subErrCode, command) {
//         console.log(' notifyError :==> ');
//         return console.log(errCode, subErrCode, command);
//     };
//     notifyMediaCtrl(actions, params) {
//         console.log(' notifyMediaCtrl :==> ');
//         return console.log(actions, params);
//     };
//     notifyRtcCmd(fromId, toId, msgType, mline, mlineIndex, sdp, peerParam) {
//         console.log(' notifyRtcCmd :==> ');
//         return console.log(fromId, toId, msgType, mline, mlineIndex, sdp, peerParam);
//     };
// };
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


    $rootScope.sendMessage = false;//是否发送销毁视频会议房间通知消息

    frameService.getCurrentUser(function (res) {
        $timeout( async function () {
            $scope.user = webConfig.getUser();
            console.log($scope.user);
            // 获取 拼接在当前路径后面传入的值 房间号 roomid
            var search = util.getSearch();
            console.log('search===>', search);
            // 视频控制操作 数据对象
            $scope.webRTC = {

                callTime:null, //通话时间
                oneSmallV:$scope.user.Id,// 单人视频会议 video  显示大小切换
                MeetingAssistantId: 's_f84d705ae09f475d9343623e350fef42',//会议小助手id 固定字段
                groupInfo:null,//群信息
                AudioIds: [],//音频轨道id
                ErrorTitle: [],//异常提示
                listStatus: 0, // 在线成员人数
                // addUserShow: false,
                videoModel: 'bOrderFlag',   // 非订阅 非p2p 模式  // p2p 模式 // 订阅 模式
                roomModel: null, // 房间模式
                setMasterShow: false,// 房主转让 显示控制器
                ModeSwitch: true,//默认ture显示4个平分  flase显示1个大屏幕5个小屏幕
                Headershow: true,//是否全屏显示
                SDK: null,
                minimize: {
                    id: $scope.user.Id,//  是否开启 最小化 显示的人 默认显示自己
                    Turnon: false//Turnon是否开启 最小化 true开启 false 不开启
                },
                modeId: '',//屏幕共享成员id
                orderType: '', //   id+ '_video';//大流   id+'_video_1';//小流  ModeSwitch true 全是 _video_1 小流  flase 大屏幕的是_video 大流 其他都是 不订阅
                orderList: [],// 订阅远端资源 id容器
                MemberListshow: false,//成员列表是否显示
                selectItemId: null,// 画面大屏 显示
                cutover: true, //屏幕共享 本地摄像头 切换控制 默认本地摄像头
                localStream: null,//本地资源 流
                localAudioTracks: null,  // 本地音频轨
                // userList:[{ id: 'AAA' }, { id: 'BBB' }, { id: 'CCC' }, { id: 'DDD' }, { id: 'EEE' }, { id: 'FFF' }, { id: 'JJJ' }, { id: 'PPP' }],//成员列表
                userList: [],//成员列表
                StreamList: [],//UI显示模式 + 翻页数据改造 容器
                PauseAulist: [],//暂停音频的id列表
                PauseVilist: [],//暂停视频的id列表
                // ClientKey: $scope.user.Id,//  登录的KEY 是静静id
                // ClientId: $scope.user.Id ,//测试阶段ClientId等于ClientKey 客户端id： 服务端生成的id 依赖于  setAuthoKey(authkey:string)接口内传的字符串参数 authkey 和登录的静静id生成的
                // Client: {
                //     Key: { ClientKey: $scope.user.Id },//  登录的KEY 是静静id
                //     Id: { ClientId: $scope.user.Id },//测试阶段ClientId等于ClientKey 客户端id： 服务端生成的id 依赖于  setAuthoKey(authkey:string)接口内传的字符串参数 authkey 和登录的静静id生成的
                // },
                // msg: util.getLs('rtcRoomObj'),//
                msg: JSON.parse(decodeURIComponent(search.roomObj)),// 解码函数 decodeURIComponent() 再转换为json // 获取 发起的邀请会议信息 房间id 邀请的会议成员
                VconcatId: search.groupId ? search.groupId : null,//是否可以添加成员- 群会议id==  单人会议== null
              
            };
            // console.log('视频会议消息体===>',$scope.webRTC.multiplayer,JSON.parse(decodeURIComponent(search.msgContent)))
             // 是否包含群id 包含获取当前群成员列表信息
            if( $scope.webRTC.msg.chatRoomId.join(',').indexOf('group_') >= 0) {
                for(let i in  $scope.webRTC.msg.chatRoomId){
                    if ($scope.webRTC.msg.chatRoomId[i].indexOf('group_') >= 0) {
                        $scope.webRTC.VconcatId = $scope.webRTC.msg.chatRoomId[i];
                        let params = { groupId: $scope.webRTC.msg.chatRoomId[i] };
                        // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取当前群信息 
                        // $scope.webRTC.groupInfo = await getChatIdInfo(JSON.stringify(params), 'group/getbyid');
                        console.log($scope.webRTC.groupInfo);
                    }
                };
            }
            // 会议小助手 - 进入
            if($scope.webRTC.msg.chatRoomId.join(',').indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0){
                for(let i in  $scope.webRTC.msg.chatRoomId){
                    $scope.webRTC.VconcatId = $scope.webRTC.msg.chatRoomId[i];
                }
            } ;
            // 获取 发起的邀请会议信息 房间id 邀请的会议成员 存入自定义方法 rtcRoomObj中 在接收到或者发送消息调用 判断是否已经在房间内
            // rtcRoomObj.setData();
            // console.log(rtcRoomObj.getData())
            // 初始化  rtc
            $scope.initRtc();

            // 单人 视频会议 拖动 video 
            $scope.Move = {
                x: null,
                y: null,
                key: null,//开启 拖动
                elem: null, //拖动 的元素
                firstTime : 0,//开始时间
                lastTime :0,//结束 时间
                IsMove:false,//设置了一个标志 true为点击事件 false 为鼠标移动事件
            };
        })
    })
    $scope.initRtc =function(){
        $timeout(() => {
            $scope.webRTC.SDK = new rtc();
            //  获取到的参数处理 存入成员列表中 并且设置默认渲染布局列表创建处理
            setMsgList();
            $scope.webRTC.SDK.WebRtcSDK = finalModule; //引入webRtcSdk.js打包SDK暴露出的全局变量(finalModule) RTCSDK  实例
            $scope.webRTC.SDK.say = $scope;// angular  内的 作用域 参数
            $scope.webRTC.SDK.id = $scope.user.Id;//用户id
            $scope.webRTC.SDK.rootScope = $rootScope;
            //传入 $timeout函数 实时 更新 数据 + view视图
            $scope.webRTC.SDK.timeout = $timeout;
            $scope.webRTC.SDK.apply = $scope.$apply;
            //视频 流 参数
            $scope.webRTC.SDK.constraints = {
                // video: { frameRate: 2000, },
                video: true,
                audio: {
                    // 设置回音消除
                    noiseSuppression: true,
                    // 设置降噪
                    echoCancellation: true,
                }
            };
            // cfgUri 服务器地址    //  eType INDEX = 1    MCU = 2  AuthKey= "a9003800860361e9JJAV"
            $scope.webRTC.SDK.setUrl("http://120.132.99.205:24002", 1, "");
            // 默认自己画面大屏 显示
            $scope.webRTC.selectItemId = $scope.user.Id;//用户id
            // 非订阅 非p2p 模式
            if ($scope.webRTC.videoModel == '0') {
                $scope.webRTC.roomModel = { 'bP2pFlag': false, 'bOrderFlag': false, 'bNotifyFlag': true, 'bSupportOfflines': true, 'bAutoRelogin': true, 'bSupportVideo': true };
            } else if ($scope.webRTC.videoModel == 'bP2pFlag') {
                // p2p 模式
                $scope.webRTC.roomModel = { 'bP2pFlag': true, 'bOrderFlag': false, 'bNotifyFlag': true, 'bSupportOfflines': true, 'bAutoRelogin': true, 'bSupportVideo': true };
            } else if ($scope.webRTC.videoModel == 'bOrderFlag') {
                // 订阅 模式
                $scope.webRTC.roomModel = { 'bP2pFlag': false, 'bOrderFlag': true, 'bNotifyFlag': true, 'bSupportOfflines': true, 'bAutoRelogin': true, 'bSupportVideo': true };
            } else if ($scope.webRTC.videoModel == 'OnlyAudio') {
                // 只有音频
                $scope.webRTC.roomModel = { 'bP2pFlag': false, 'bOrderFlag': true, 'bNotifyFlag': true, 'bSupportOfflines': true, 'bAutoRelogin': true, 'bSupportVideo': false };
            } //用户id 房间号 { 'bP2pFlag': 是否开启点对点模式 , 'bOrderFlag': 是否开启订阅模式, 'bNotifyFlag': true, 'bSupportOfflines': 是否 支持离线, 'bAutoRelogin': true }
            $scope.webRTC.SDK.login($scope.webRTC.msg.userId, $scope.webRTC.msg.roomid, $scope.webRTC.roomModel);
           
        })
    };
    // 获取通话时长- 定时器
    let calculateTimer;
    // 实时获取 获取通话时长
    function startCallTime() {
        calculateTimer =  setInterval(() => {
            // 获取通话时长
            getRemainderTime();
        },1000)
    };
    // 停止获取通话时长
    function  stopCallTime() {
        clearTimeout(calculateTimer) //清理定时任务
    }
    // 视频会议室 创建成功 通知主页面发送邀请消息
    $scope.NoticeMainInviteMsg = function(){
        // search.msgContent 视频会议邀请的消息体存在 触发发送消息 自己是邀请的不会发送
        console.log('NoticeMainInviteMsg==>',search);
        // 获取通话时长
        startCallTime();
        // 会议小助手 - 进入
        if($scope.webRTC.msg.chatRoomId.join(',').indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0){
            return alert('会议小助手 -- 视频会议室 创建成功');
        };
        
        //进入房间之后 上报告会议状态  roomid - 房间id   退出-true 加入-false
        chatService.ReportRoom($scope.webRTC.msg.roomid,false,function(res){
            if((res.Code != 0 || res.Flag != 0 ) && !res.Data){
                return  alert('上报告会议状态 - 失败');
            }else{
                // alert('上报告会议状态-成功');
            }
        });
        // 点击接听 进入房间之后 发送消息 通知其他
        if( decodeURIComponent(search.action) &&  decodeURIComponent(search.action) ==  "answered" && search.msgContent){
            let params={
                roomId:  $scope.webRTC.msg.roomid,// 房间id
                msgContent: search.msgContent,//消息内容
                sendId: $scope.webRTC.msg.userId,//给自己发送
                timestamp: util.getNow(),
                frameId: 'main',
                action: 'answered'
            };
            frameService.notice(params);
        }
        // 创建房间成功 - 发送 会议邀请消息
        if(search.action ==  "new" && search.msgContent){
            let params={
                roomId:  $scope.webRTC.msg.roomid,// 房间id
                msgContent: search.msgContent,//消息内容
                selected: $scope.webRTC.userList,//选择的成员列表
                timestamp: util.getNow(),
                frameId: 'main',
                action: 'NoticeMainInviteMsg'
            };
            //群消息 传入 群id
            if(search.groupId){
                params.groupId = search.groupId
            }
            frameService.notice(params);
               // 记录 发送了视频会议邀请的消息 在销毁房间时调用 同样需要发送销毁消息
               $rootScope.sendMessage = true;
        };
      
    };
 
    // SDK返回6 退出之后 关闭cef-视频会议窗口
    $scope.closeTheCefWindow = function () {
        // 停止获取通话时长
        stopCallTime();
        // 会议小助手 - 进入
    if($scope.webRTC.msg.chatRoomId.join(',').indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0){
        alert('会议小助手-- 退出之后 关闭cef-视频会议窗口');
        frameService.closeFrame(FRAMEID);
        return
    }
        //进入房间之后 上报告会议状态  roomid - 房间id   退出-true 加入-false
        chatService.ReportRoom($scope.webRTC.msg.roomid,true,function(res){
            if((res.Code != 0 || res.Flag != 0 ) && !res.Data){
            return  alert('上报告会议状态 - 失败');
            }else{
                // alert('上报告会议状态-成功');
            }
        });
        // 需要发送消息
        if($rootScope.sendMessage){
            $rootScope.$broadcast('sendMessageFu');
        }else{
            // 如果是 群id 多人视频 仅自己退出视频会议房间 且 当前视频会议房间还没有被房主销毁 通知main主页面 销毁 存储的当前房间数据 但是存储一个本地数据 房间id + 群id
            if ($scope.webRTC.msg.chatRoomId.join(',').indexOf('group_') >= 0) {
                for(let i in $scope.webRTC.msg.chatRoomId){
                    if($scope.webRTC.msg.chatRoomId[i].indexOf('group_') >= 0){
                        if(util.getLs('joinedVideoMeeting')){
                            let obj=util.getLs('joinedVideoMeeting');
                            let is=true;
                            // 防止当前房间id 已经存入本地
                            for(let i in obj){
                               if( obj[i].roomId == $scope.webRTC.msg.roomid){
                                    is=false;
                                    break;
                               }else{
                                   is=true;
                               }
                            }
                            if(is){
                                obj.push({
                                    groupId:$scope.webRTC.msg.chatRoomId[i],
                                    roomId: $scope.webRTC.msg.roomid,
                                    message:'已经加入该视频会议',
                                })
                                util.setLs('joinedVideoMeeting',JSON.stringify(obj));
                            }
                        }else{
                            let obj=[{
                                groupId:$scope.webRTC.msg.chatRoomId[i],
                                roomId: $scope.webRTC.msg.roomid,
                                message:'已经加入该视频会议',
                            }];
                            util.setLs('joinedVideoMeeting',JSON.stringify(obj));
                        };
                    }
                };
            };
             // 通知main主页面 销毁 存储的当前房间数据 - 不发送消息
            frameService.notice({
                roomId:  $scope.webRTC.msg.roomid,// 房间id
                timestamp: util.getNow(),
                frameId: 'main',
                action: 'destroyedRoomData'
            },function(res){ 
                // 关闭cef 视频会议窗口
                frameService.closeFrame(FRAMEID);
            })
        }
       
        // frameService.closeFrame(FRAMEID);
    };
    function setMsgList() {
        $scope.webRTC.msg.selected.map((item, index) => {
            // 等于自己的数据
            if (item.id == $scope.user.SUserId) {
                // 成员列表 unshift 头部 添加
                $scope.webRTC.userList.unshift(item);
            } else {
                $scope.webRTC.userList.push(item);
            }
        })
        console.log($scope.webRTC);
    };

    var search = util.getSearch();
    console.log(util.getNow() - search.time);
    
    // 计算 两个时间戳 之间的 时差
    function getRemainderTime (){
        var startTime = parseInt(search.time);
        // 获取当前最新的时间 - 结束时间
        var  endTimer = new Date(),
        runTime = parseInt((endTimer.getTime() - startTime) / 1000);
        // 时
        var hour = Math.floor(runTime / 3600);
        runTime = runTime % 3600;
        // 分
        var minute = Math.floor(runTime / 60);
        runTime = runTime % 60;
        // 秒
        var second = runTime;
        if(hour<10){
            hour= '0' + hour;
        }
        if(minute<10){
            minute= '0' + minute;
        }
        if(second<10){
            second= '0' + second;
        }
        let time=hour+':'+minute+':'+second;
        $scope.webRTC.callTime=time;
        // console.log(time);
    };
}])

controllers.controller('mainController', ['$rootScope', '$scope', 'concatService', '$templateCache', '$compile', '$timeout', 'webConfig', 'util', 'chatService', 'langPack','frameService', 'getChatIdInfo', 'getChatIdObj', 'rtcRoomObj', function ($rootScope, $scope, concatService, $templateCache, $compile, $timeout, webConfig, util, chatService,langPack, frameService, getChatIdInfo, getChatIdObj, rtcRoomObj) {
    $timeout(function () {
        $('.search_area input').focus();
    }, 100); 
    // 获取 拼接在当前路径后面传入的值 房间id
    var search = util.getSearch();
    console.log(search);
    

    // 是房主 或者 管理员的 有权限暂停音视频操作 并且id 不等于自己
    $scope.onisMasterOrManagerNoMe = function (item) {
        // console.log(item);
        // console.log($scope.webRTC.msg.manager);
        if (item.id != $scope.webRTC.msg.userId && (item.master == $scope.webRTC.msg.userId || item.manager.indexOf($scope.webRTC.msg.userId) >= 0)) {
            return true;
        } else {
            return false;
        }
    }
    // 是房主 或者 管理员的 有权限暂停音视频操作
    $scope.onisMasterOrManager = function (item) {
        if (item.master == $scope.webRTC.msg.userId || item.manager.indexOf($scope.webRTC.msg.userId) >= 0) {
            return true;
        } else {
            return false;
        }
    }
    // id 是管理员 并且 id 不等于房主的
    $scope.onisManager = function (item) {
        if (item.manager.indexOf(item.id) >= 0 && item.master != item.id) {
            return true;
        } else {
            return false;
        }
    }

    // 上一页
    $scope.OnLastPage = function ($event) {
        let uTop = document.getElementsByClassName('scrollbar-wrap')[0].scrollTop;
        let uHei = document.getElementsByClassName('scrollbar-wrap')[0].clientHeight;
        if (uTop == 0) {
            return alert('已至首页');
        }
        if (uTop >= uHei) { 
            document.getElementsByClassName('scrollbar-wrap')[0].scrollTop = (uTop - uHei);
        } else {
            document.getElementsByClassName('scrollbar-wrap')[0].scrollTop = 0;
        }

        $event.stopPropagation();
        $event.preventDefault();// 阻止默认行为
    }
    // 下一页
    $scope.OnNextPage = function ($event) {
        var h = $(".scrollbar-wrap").height();//div可视区域的高度
        var sh = $(".scrollbar-wrap")[0].scrollHeight;//滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
        var st = $(".scrollbar-wrap")[0].scrollTop;//滚动条的高度，即滚动条的当前位置到div顶部的距离
        // 判断滚动条滑到底部的代码
        if (h + st >= sh) {
            return alert("已至尾页");
            //   $("#scrollTest").append(111+"<br>");//滚动条滑到底部时，只要继续滚动滚动条，就会触发这条代码.一直滑动滚动条，就一直执行这条代码。
        } else {
            $(".scrollbar-wrap")[0].scrollTop = h + st;
        }

        $event.stopPropagation();
        $event.preventDefault();// 阻止默认行为
    }
    // 添加会议成员
    $scope.startChat = function ($event) {
       
        var params = {};
        // add为默认群里的全部人员并且无法去除  new新建添加视频的人数 弹出类型  添加视频通话人数 
        // params.action = 'new';
        params.groupId = search.groupId;//群 id
        params.AddListVideoConference = true;//多人视频控制器
        params.roomId = $scope.webRTC.msg.roomid; //房间号
        params.groupName = decodeURIComponent(search.groupName) ;// 群名称
        frameService.open('chooseUser', 'choose.html', params, 600, 550, true, langPack.getKey('videoConference'));
    };
    // 收到main主页面的通知 视频会议消息 状态是 关闭的 
    $scope.$on('cascadeCallback', function (ev, res) {
        console.log('closeWebrtcSdk===>',res)
        // main主页面 收到销毁或者关闭视频会议消息 调用关闭窗口函数
        // 别人通知我关闭视频会议 - 需要发送通知消息 -直接销毁房间
        if (res.Data.action == "closeWebrtcSdk") {
            // 通知关闭的房间id 等于当前房间号
            if (JSON.parse(res.Data.message).msgObj.voiceRoomKey == $scope.webRTC.msg.roomid) {
                //  房间 销毁 - 不发送消息
                $rootScope.$broadcast('close-webrtcsdk');
            }
        };
        //  我关闭的视频会议 - 需要发送通知消息
        if(  res.Data.action == 'closeMsgWebrtcSdk'){ 
             // 通知关闭的房间id 等于当前房间号
             if (JSON.parse(res.Data.message).msgObj.voiceRoomKey == $scope.webRTC.msg.roomid) {
                // 发送 房间关闭消息
                $rootScope.$broadcast('closeMsg-webrtcsdk');
            }
        };
        // 添加成员- 主页面传入的参数
        if(res.Data.action == 'AddListVideoConference'){
            let selected=res.Data.selected;
            let roomId=res.Data.roomId;
            let groupId=res.Data.groupId;
            let is=false;
            // 验证是否当前房间号 + 是否是同一个群id
            if(roomId == $scope.webRTC.msg.roomid && groupId == search.groupId){
                $timeout(()=>{
                    for(let i in selected){
                        // 遍历选中添加的成员 是否已经在当前成员列表（ $scope.webRTC.userList）中存在
                        for(let k in $scope.webRTC.userList){
                            // 当前成员列表 id不存在的 添加到当前成员列表中
                            if( $scope.webRTC.userList[k].id != selected[i].id){
                                is = true;
                            }else{
                                // id存在 跳出循环 遍历下一条数据
                                is = false;
                                break;
                            };
                        };
                        if(is){
                            // 添加
                            $scope.webRTC.userList.push(selected[i]);
                            // 调用 视频会议接口-SDK //添加其他成员  $scope.webRTC.SDK.WebRtcSDK
                             //添加其他成员
                                let data = [{ 'n': selected[i].name }, { 'i': selected[i].img },{'c':''}];
                                data.map(item => {
                                    // 获取 obj内 的 键名
                                    let sKey = Object.keys(item);
                                    // 获取 obj内 key 键名的 键值 obj[Object.keys(obj)]
                                    let sValue = item[sKey];
                                    //添加其他成员 设置成员的属性
                                    $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().addParticipant(selected[i].id, sKey[0], sValue);
                                });
                                // addParticipant添加完成之后 或者 setParticipantAttr修改添加的用户属性之后 都需调用commitParticipants() 接口
                                $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().commitParticipants();
                        };
                    };
                });
            };
        };
    });
    // 其他控制器 内调用 关闭视频房间
    $rootScope.$on('close-webrtcsdk', function (event) {
        // SDK退出之后 - 控制发送或者不发送消息的变量
        $rootScope.sendMessage = false;
        // 停止屏幕共享 关闭屏幕共享弹出窗口
        OnStopStream();
        // 直接 退出SDK登录
        $scope.webRTC.SDK.logout();

    });
    //  需要发送关闭视频房间 通知消息调用 
    $rootScope.$on('closeMsg-webrtcsdk', function (event) {
        $scope.close(event);
    });
    // 关闭
    $scope.close = async function ($event) {
        // 聊天群id
        let groupId = null;
        // 是否包含群id 或者 会议小助手Id s_f8
        // if ($scope.webRTC.msg.chatRoomId.join(',').indexOf('group_') >= 0 || $scope.webRTC.msg.chatRoomId.join(',').indexOf('s_f8') >= 0) {
        if ($scope.webRTC.msg.chatRoomId.join(',').indexOf('group_') >= 0 ) {
            for(let i in $scope.webRTC.msg.chatRoomId){
                if($scope.webRTC.msg.chatRoomId[i].indexOf('group_') >= 0){
                    groupId = $scope.webRTC.msg.chatRoomId[i];
                }
            };
        };
        let is = false;
        // 是否有其他成员是在线状态
        for (let i in $scope.webRTC.userList) {
            // 有其他成员在线的
            if ($scope.webRTC.userList[i].id != $scope.webRTC.msg.userId && $scope.webRTC.userList[i].status == '1') {
                is = true;
                break;
            }
        };
        // 多人聊天
        if(groupId){
            // 自己是房主
            if ($scope.webRTC.msg.master == $scope.webRTC.msg.userId) {
                 // 有其他成员在线的 或者 加入过房间 - 发送销毁消息
                 if(is){
                    // 有其他成员在线  并且自己是房主 退出前先转让房主 并且是群id
                    alert('请点击转让房主按钮');
                    // 显示成员列表
                    $scope.webRTC.MemberListshow = true;
                    // 显示 房主转让按钮 房主 转让
                    $scope.webRTC.setMasterShow = true;

               }else{
                    //其他成员都不是在线状态 - 发送销毁房间消息
                    // 停止屏幕共享 关闭屏幕共享弹出窗口
                    OnStopStream();
                    $rootScope.sendMessage = true;
                    // 退出SDK登录
                    $scope.webRTC.SDK.logout();
               }
            }else{
                // 多人聊天自己不是房主 - 直接退出房间不发送通知消息
                 $rootScope.$broadcast('close-webrtcsdk');
            }
        }else{
            // 单人聊天
             //其他成员在不在线状态 - 关闭房间都发送销毁房间消息
                    // 停止屏幕共享 关闭屏幕共享弹出窗口
                    OnStopStream();
                    $rootScope.sendMessage = true;
                    // 退出SDK登录
                    $scope.webRTC.SDK.logout();
        }
        // //  除了自己 其他成员都不在线 退出 直接取消房间 发送通知
        // if (!is) {
        //     // 并且自己是房主
        //     if ($scope.webRTC.msg.master == $scope.webRTC.msg.userId) {
        //         // 停止屏幕共享 关闭屏幕共享弹出窗口
        //         OnStopStream(); 

        //         // 关闭房间 后发送消息
        //         // let is=closureRoom();
        //         //  setclosureRoomMsg(closureRoom(), type, msg);
        //         $rootScope.sendMessage = true;
        //           // 退出SDK登录
        //           $scope.webRTC.SDK.logout();
        //     } else {
        //         // 自己不是房主 群-多人会议室 直接退出房间
        //         if (groupId) {
        //             // 停止屏幕共享 关闭屏幕共享弹出窗口
        //             // OnStopStream();
        //             // // 直接 退出SDK登录
        //             // $scope.webRTC.SDK.logout();

        //             //  房间 销毁 - 不发送消息
        //             $rootScope.$broadcast('close-webrtcsdk');
        //          }else{
        //             //自己不是房主 单人会议 发送消息通知 销毁房间
        //             // 停止屏幕共享 关闭屏幕共享弹出窗口
        //             OnStopStream(); 
        //             // 关闭房间 后发送消息
        //             // let is=closureRoom();
        //             // setclosureRoomMsg(closureRoom(), type, msg);
        //             $rootScope.sendMessage = true;
        //             // 退出SDK登录
        //             $scope.webRTC.SDK.logout();
        //         }
        //     }
        // } else {
        //     // 群-多人会议室
        //     if (groupId) {
        //         // 有其他成员在线  并且自己是房主 退出前先转让房主 并且是群id
        //         if ($scope.webRTC.msg.master == $scope.webRTC.msg.userId) {
        //             alert('请点击转让房主按钮');
        //             // 显示成员列表
        //             $scope.webRTC.MemberListshow = true;
        //             // 显示 房主转让按钮 房主 转让
        //             $scope.webRTC.setMasterShow = true;
        //         } else {
        //             // 停止屏幕共享 关闭屏幕共享弹出窗口
        //             // OnStopStream();
        //             // // 直接 退出SDK登录
        //             // $scope.webRTC.SDK.logout();
        //              //  房间 销毁 - 不发送消息
        //             $rootScope.$broadcast('close-webrtcsdk');
        //         }
        //     } else {
        //         // 单聊会议室
        //         // 停止屏幕共享 关闭屏幕共享弹出窗口
        //         OnStopStream();
        //         // 直接 退出SDK登录
        //         $scope.webRTC.SDK.logout();
        //         $rootScope.sendMessage = true;
        //         // 关闭房间 后发送消息
        //         // let is=closureRoom();
        //         // setclosureRoomMsg(closureRoom(), type, msg);
        //     }
        // }
        // $event.stopPropagation();
        // $event.preventDefault();// 阻止默认行为
    };
     // 关闭房间 后发送消息 
     $rootScope.$on('sendMessageFu', function (event) {
        setclosureRoomMsg(closureRoom());
    });
    // 关闭房间 验证 是取消 还是 结束 视频会议 房间内部没有进入其他成员是取消视频会议 有其他成员加入是结束视频会议
    function closureRoom() {
        let is = true;
        // chatRoomId 是不是群id 包含group_字段是多人视频  不包含单人视频
        if ($scope.webRTC.msg.chatRoomId.join().indexOf('group_') >= 0) {
            // 多人视频 只有自己是房主 并且 自己的在线状态是 1-在线 可以销毁房间
            if ($scope.webRTC.msg.master == $scope.webRTC.msg.userId && $scope.webRTC.msg.status == '1') {
                // 群会议
                // 房间内的成员数 其他成员还未加入 通知取消视频会议房间
                if ($scope.webRTC.userList.length > 1) {
                    for (let i in $scope.webRTC.userList) {
                        // status 成员在线状态   0-待加入 1-在线 2-断线  3-离开
                        if ($scope.webRTC.userList[i].id != $scope.webRTC.msg.userId && $scope.webRTC.userList[i].status == 0) {
                            // 其他成员 状态都是 待加入 时 关闭 取消视频会议
                            is = true;
                        } else if (($scope.webRTC.userList[i].status == 2 || $scope.webRTC.userList[i].status == 3) && $scope.webRTC.userList[i].id != $scope.webRTC.msg.userId) {
                            // 其他成员 状态都是 断线 或者离开 时 关闭 结束视频会议
                            is = false;
                        } 
                        // else if ($scope.webRTC.userList[i].id != $scope.webRTC.msg.userId && $scope.webRTC.userList[i].status == 1) {
                        //     // 有其他成员 状态是 在线时 关闭  不发送通知 自己退出房间
                        //       // 通知main主页面 销毁 存储的当前房间数据 - 不发送消息
                        //     frameService.notice({
                        //         roomId:  $scope.webRTC.msg.roomid,// 房间id
                        //         timestamp: util.getNow(),
                        //         frameId: 'main',
                        //         action: 'destroyedRoomData'
                        //     },function(res){ 
                        //         // 关闭cef 视频会议窗口
                        //         frameService.closeFrame(FRAMEID);
                        //     })
                        //     return;
                        // }
                    }
                } else {
                    // 房间内只有自己 状态都是 待加入 时 关闭 取消视频会议
                    is = true;
                }
            }
        } else {
            // 单人视频
            // let is = false;
            //  自己的在线状态是 1-在线
            if ($scope.webRTC.msg.status == '1') {
                if ($scope.webRTC.userList.length > 1) {
                    for (let i in $scope.webRTC.userList) {
                        // status 成员在线状态   0-待加入 1-在线 2-断线  3-离开
                        if ($scope.webRTC.userList[i].id != $scope.webRTC.msg.userId && $scope.webRTC.userList[i].status == 0) {
                            // 其他成员 状态都是 待加入 时 关闭 取消视频会议
                            is = true;
                        } else if ($scope.webRTC.userList[i].id != $scope.webRTC.msg.userId && ($scope.webRTC.userList[i].status == 1 || $scope.webRTC.userList[i].status == 2 || $scope.webRTC.userList[i].status == 3)) {
                            // 其他成员 状态都是 在线 时 关闭 结束视频会议
                            is = false;
                        }
                    }
                } else {
                    is = true;
                } 
            }
        }
        return is;
    };
    // 房间关闭后 发送消息 通知 更新数据
    function setclosureRoomMsg(is) {
       let msg = is ? "" : '已结束了视频会议';
        // 通知成员 房间已取消 或 已结束
        var content = { "chatRoomId": '', "message": msg, "n_TYPE": 10, "voiceMeetingType": 'destroy', "voiceRoomKey": $scope.webRTC.msg.roomid };
        // let addIs=false;
       let chatObj=[];
        // 房间的成员列表 新增加的成员id存入chatRoomId 发送销毁消息调用
        for(let k in $scope.webRTC.userList){
            chatObj.push({ClientId:$scope.webRTC.userList[k].ClientId,ClientKey:$scope.webRTC.userList[k].ClientKey});
            // for(let j in  $scope.webRTC.msg.chatRoomId){
            //     if($scope.webRTC.msg.chatRoomId[j].indexOf('group_') < 0 && $scope.webRTC.userList[k].id !=  $scope.webRTC.msg.userId){
            //         if($scope.webRTC.userList[k].id == $scope.webRTC.msg.chatRoomId[j]){
            //             addIs=false;
            //             break;
            //         }else{
            //             addIs=true;
            //         }
            //     }
            // };
            // if(addIs){
            //     $scope.webRTC.msg.chatRoomId.push($scope.webRTC.userList[k].id);
            // };
        }
     
        console.log('chatRoomId==>',$scope.webRTC.userList,chatObj)
        let params={
            sendMessage: content, //发送视频通知消息 - 消息体
            chatId: chatObj,// 其他成员的id + 发送的消息体内chatRoomId  - 发送消息调用
            isRoomType: is,//取消视频会议时 主页面在发送消息前销毁当前房间数据(rtcRoomObj) 否则等主页面发送完消息 调用destroyedRoomData时通知销毁
            timestamp: util.getNow(),
            frameId: 'main',
            action: 'videoSendMessage'
        }; 
       // 是否包含群id
       if ($scope.webRTC.msg.chatRoomId.join(',').indexOf('group_') >= 0) {
           for(let i in $scope.webRTC.msg.chatRoomId){
               if($scope.webRTC.msg.chatRoomId[i].indexOf('group_') >= 0){
                params.groupId = $scope.webRTC.msg.chatRoomId[i];
               }
           };
       };
        //  打开main 主页面发送消息 或 添加消息进入列表 等发送完消息 调用 destroyedRoomData 通知主页面 销毁 存储的当前房间数据 否则发送消息时获取不到当前房间数据(rtcRoomObj)
        frameService.notice(params,function(res){
            // 关闭cef 视频会议窗口
            // frameService.closeFrame(FRAMEID);
             // 通知main主页面 销毁 存储的当前房间数据
             frameService.notice({
                roomId:  $scope.webRTC.msg.roomid,// 房间id
                timestamp: util.getNow(),
                frameId: 'main',
                action: 'destroyedRoomData'
            },function(res){ 
                // 关闭cef 视频会议窗口
                frameService.closeFrame(FRAMEID);
            })
        })
    };
    // 停止 屏幕共享 + 关闭浏览器默认弹出屏幕共享窗口
    function OnStopStream() {
        if ($scope.webRTC.localStream) {
            // 点击自定义按钮 屏幕共享 切换至本地摄像头 先停止 屏幕共享 关闭浏览器默认弹出屏幕共享窗口
            $scope.webRTC.localStream.getTracks().forEach(track => {
                console.log('stop==>', track);
                track.stop();
            });
            $scope.webRTC.localStream = null;
        }
    };
    // 切换资源-屏幕共享资源 || 本地摄像头
    $scope.OnVideoSwitch = function ($event) {
        $timeout(async () => {
            if ($scope.webRTC.cutover) {
                // 停止 屏幕共享 + 关闭浏览器默认弹出屏幕共享窗口
                OnStopStream();
                $('#webRTC-main video').css({ 'object-fit': 'contain' });
                $scope.webRTC.msg.mode = 'video';
                //  本地摄像头
                await $scope.webRTC.SDK.OnLocalCamera();

                // 画面大屏 显示
                $scope.webRTC.selectItemId = '';
                // 切换显示模式
                $scope.webRTC.ModeSwitch = true;
                // 最小化 时显示 默认给自己
                $scope.webRTC.minimize.id = $scope.webRTC.msg.userId;
                // //   id+ '_video';//大流  

                $scope.webRTC.modeId = '';
                $scope.webRTC.SDK.OnCutoverAgainRendering();

            } else {
                $('#webRTC-main video').css({ 'object-fit': 'contain' });
                //  屏幕共享资源
                await $scope.webRTC.SDK.Onscreenshare();

                // 画面大屏 显示
                $scope.webRTC.selectItemId = $scope.webRTC.msg.userId;
                // 切换显示模式
                $scope.webRTC.ModeSwitch = false;
                // 最小化 时显示 屏幕共享让的流
                $scope.webRTC.minimize.id = $scope.webRTC.msg.userId;
                // //   id+ '_video';//大流 
                $scope.webRTC.msg.mode = 'screen';
                $scope.webRTC.modeId = $scope.webRTC.msg.userId;
            }
        }, 0, true);

        // $event.stopPropagation();
        // $event.preventDefault();// 阻止默认行为
    };
    // 设置 id 为 房主
    $scope.OnsetMaster = function ($event, id) {
        for (let i in $scope.webRTC.userList) {
            if ($scope.webRTC.userList[i].id == id) {
                if ($scope.webRTC.userList[i].status == '1') {
                    //原生弹出窗口 利用对话框返回的值 （true 或者 false）
                    if (confirm("确认将会议主持转移给" + $scope.webRTC.userList[i].name + "？")) {
                        // alert("点击了确定");
                        // 房主 转让
                        onmanagerTransfer(id);
                    } else {
                        return;
                    }
                } else {
                    //原生弹出窗口 利用对话框返回的值 （true 或者 false）
                    if (confirm($scope.webRTC.userList[i].name + "当前未在会议中，确定将会议主持转移给他？")) {
                        // alert("点击了确定");
                        // 房主 转让
                        onmanagerTransfer(id);
                    } else {
                        return;
                    }
                }
            }
        }


        $event.stopPropagation();
        $event.preventDefault();// 阻止默认行为
    };
    // 房主 转让
    function onmanagerTransfer(id) {
        // 管理员权限 中 是否 有此人 
        if ($scope.webRTC.msg.manager.length > 0) {
            for (let i in $scope.webRTC.msg.manager) {
                if ($scope.webRTC.msg.manager[i] == id) {
                    // 解除 成员 管理员权限
                    $scope.webRTC.msg.manager.splice(i, 1);
                }
            }
            // 发送房间属性 设置 管理员
            $scope.webRTC.SDK.OnSetRoomAttr([{ 'manager': $scope.webRTC.msg.manager.join(',') }]);
        }
        //
        $scope.webRTC.msg.master = '';
        // 发送房间属性 设置 房主
        $scope.webRTC.SDK.OnSetRoomAttr([{ 'master': id }]);
        // 转让房主 退出房间
        if ($scope.webRTC.setMasterShow) {
            // 停止屏幕共享 关闭屏幕共享弹出窗口
            // OnStopStream();
            // 退出SDK登录
            // $scope.webRTC.SDK.logout();
            $scope.close();
        }
        // 隐藏 房主设置按钮
        $scope.webRTC.setMasterShow = false;
    };
    // 房主 设置管理员权限
    $scope.Onsetupadmini = function ($event, id) {
        let is = false;
        if ($scope.webRTC.msg.manager.length > 0) {
            for (let i in $scope.webRTC.msg.manager) {
                if ($scope.webRTC.msg.manager[i] == id) {
                    is = false;
                    // 解除 成员 管理员权限
                    $scope.webRTC.msg.manager.splice(i, 1)
                    break;
                } else {
                    is = true;
                }
            }
            if (is) {
                $scope.webRTC.msg.manager.push(id)
            }
        } else {
            $scope.webRTC.msg.manager.push(id)
        }
        // console.log( $scope.webRTC.msg.manager );
        // 发送房间属性 设置 管理员
        $scope.webRTC.SDK.OnSetRoomAttr([{ 'manager': $scope.webRTC.msg.manager.join(',') }]);
        $event.stopPropagation();
        $event.preventDefault();// 阻止默认行为
    }
    //顶部按钮 暂停或取消暂停 自己的音频 视频
    $scope.OnPauseMineAu = function ($event, streamType, list) {
        // 不是房主 或者 不是管理员 并且暂停列表中 包含自己的 不能操作
        if ($scope.webRTC.msg.master != $scope.webRTC.msg.userId && $scope.webRTC.msg.manager.join(',').indexOf($scope.webRTC.msg.userId) < 0) {
            // medias == 数组
            if (Array.isArray(list)) {
                console.log(list)
                if (list.join(',').indexOf($scope.webRTC.msg.userId) >= 0) {
                    return alert('目前无法操作，已被主持人或者管理员暂停');
                }
            } else {
                if (list.indexOf($scope.webRTC.msg.userId) >= 0) {
                    return alert('目前无法操作，已被主持人或者管理员暂停');
                }

            }

        }
        // streamType：1 关闭音频  2 关闭视频 3//是关闭音频+视频  + 屏幕共享
        let key = null;
        let name = null;
        if (streamType == 1) {
            key = 'a';
            name = 'audioPause';
        } else if (streamType == 2) {
            key = 'v';
            name = 'videoPause';
        }
        if ($scope.webRTC.msg.medias != '' && $scope.webRTC.msg.medias.indexOf(key) >= 0) {
            // 删除字符串中的该字段
            $scope.webRTC.msg.medias = $scope.webRTC.msg.medias.replace(key, "");
            // 修改数据列表中自己的数据
            $scope.webRTC.SDK.OnsetLocalList($scope.webRTC.msg.userId, { [name]: true });
            // 暂停
            $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().pauseSend(true, streamType, $scope.webRTC.msg.userId);
        } else {
            //  取消暂停 音频或 视频
            if (streamType == 1) {
                $scope.webRTC.msg.medias = key + $scope.webRTC.msg.medias;
            } else if (streamType == 2) {
                $scope.webRTC.msg.medias = $scope.webRTC.msg.medias + key;
            }

            // 修改数据列表中自己的数据
            $scope.webRTC.SDK.OnsetLocalList($scope.webRTC.msg.userId, { [name]: false });
            // 取消暂停 音频或 视频
            $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().pauseSend(false, streamType, $scope.webRTC.msg.userId);
            //是房主 或者 管理员 并且 暂停列表中 包含自己 删除自己的id 
            if (($scope.webRTC.msg.master == $scope.webRTC.msg.userId || $scope.webRTC.msg.manager.join(',').indexOf($scope.webRTC.msg.userId) >= 0) && list.join(',').indexOf($scope.webRTC.msg.userId) >= 0) {
                for (let i in list) {
                    if (list[i] == $scope.webRTC.msg.userId) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
            // 数组转字符串 + id逗号分割
            let PauseId = list.toString().replace(/,/g, ',');
            console.log(list);
            //多人 包含自己 设置 房间属性 通知对应成员关闭或者打开麦克风
            let bankey = streamType == 1 ? 'banAudio' : streamType == 2 ? 'banVideo' : '';
            // 发送信令 房间属性 通知成员暂停 音频或者视频
            $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().setRoomAttr(bankey, PauseId);
        }
        // 发送用户属性
        let obj = [{ 'medias': $scope.webRTC.msg.medias }];
        $scope.webRTC.SDK.OnSetUserAttr(obj);

    }
    // 判断用户属性是否包含 音频 或者 视频
    $scope.isPauseMineAu = function (medias, is) {
        // medias == 数组
        //  暂停列表  根据用户属性 webRTC.PauseAulist 或者 webRTC.PauseVilist 判断 数组类型
        if (Array.isArray(medias)) {
            // console.log(medias)
            if (medias.join(',').indexOf(is) >= 0) {
                return false;
            } else {
                return true;
            }
        }
        // 根据用户属性 medias 判断 字符串类型
        if (typeof medias == 'string') {
            if (medias.indexOf(is) >= 0) {
                return false;
            } else {
                return true;
            }
        }

    }
    // 成员列表显示或隐藏
    $scope.OnlineMember = function ($event) {
        $scope.webRTC.MemberListshow = !$scope.webRTC.MemberListshow;
        // 隐藏成员列表 且 房主转让按钮显示则  隐藏房主转让按钮
        if(!$scope.webRTC.MemberListshow && $scope.webRTC.setMasterShow){
            $scope.webRTC.setMasterShow = false;
        };
    }
    // 控制成员麦克风
    $scope.closeAudio = function ($event, id, audioPause, medias, mediaType) {
        pausemedia($event, id, audioPause, medias, mediaType, $scope.webRTC.PauseAulist);
    }
    // 控制成员摄像头
    $scope.closeVideo = function ($event, id, videoPause, medias, mediaType) {
        pausemedia($event, id, videoPause, medias, mediaType, $scope.webRTC.PauseVilist);

    }
    // 控制是否暂停媒体（音频或视频）
    function pausemedia($event, id, Pauseboolean, medias, mediaType, list) {
        $event.stopPropagation();
        $event.preventDefault();// 阻止默认行为
        if ($scope.webRTC.msg.master == $scope.webRTC.msg.userId || $scope.webRTC.msg.manager.join(',').indexOf($scope.webRTC.msg.userId) >= 0) {
            // 是房主master 或者 是管理员manager的 直接 操作 暂停列表
            // 控制是否暂停音频或视频列表
            if (list.length > 0) {
                let k = false;
                for (let i in list) {
                    if (list[i] == id) {
                        k = false;
                        list.splice(i, 1)
                        break;
                    } else {
                        k = true;
                    }
                }
                if (k) {
                    list.push(id)
                }
            } else {
                list.push(id)
            }
            // 数组转字符串 + 逗号替换成分号
            let PauseId = list.toString().replace(/,/g, ',');
            console.log(list);
            //多人 包含自己 设置 房间属性 通知对应成员关闭或者打开麦克风
            let bankey = mediaType == 1 ? 'banAudio' : mediaType == 2 ? 'banVideo' : '';
            // 发送信令 房间属性 通知成员暂停 音频或者视频
            $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().setRoomAttr(bankey, PauseId);
        }
    }
    // 双击事件切换 UI视频显示模式
    $scope.doubleClick = function () {
        // // 窗口不是最小化才可以执行 拖动
        // if ($scope.webRTC.minimize.Turnon) {
        // 	return;
        // }
        // $scope.webRTC.ModeSwitch = !$scope.webRTC.ModeSwitch;
        // if ($scope.webRTC.ModeSwitch) {
        // 	// 4个平分 翻页
        // 	$scope.webRTC.StreamList = $scope.webRTC.SDK.dataHandling([], 4, $scope.webRTC.userList);
        // } else {
        // 	// 1大5小 翻页
        // 	$scope.webRTC.StreamList = $scope.webRTC.SDK.dataHandling([], 6, $scope.webRTC.userList);
        // }
        // // ng-if 还未执行完 获取不到标签元素 延迟调用 渲染
        // setTimeout(() => {
        // 	//  切换uI显示 重新渲染 video
        // 	$scope.webRTC.SDK.OnCutoverAgainRendering();
        // }, 100) 
    }

    // 双击video放大
    $scope.doubleZoomV = function ($event, data) {
        $event.stopPropagation();
        $event.preventDefault();// 阻止默认行为
        // 单人聊天 屏幕共享 禁止缩小
        if(!$scope.webRTC.VconcatId && $scope.webRTC.msg.mode){
            return;
        }
        // 窗口不是最小化才可以执行 拖动
        if ($scope.webRTC.minimize.Turnon) {
            return;
        }
        let userList = $scope.webRTC.userList;
        for (let i in userList) {
            if (userList[i].id == data.id) {
                if (data.Zoom == 0) {
                    userList[i].Zoom = 1;
                    onDoubleZoomV(userList[i].Zoom, userList[i]);
                } else if (data.Zoom == 1) {
                    userList[i].Zoom = 2;
                    onDoubleZoomV(userList[i].Zoom, userList[i]);
                } else if (data.Zoom == 2) {
                    userList[i].Zoom = 1;
                    onDoubleZoomV(userList[i].Zoom, userList[i]);
                }
            } else {
                userList[i].Zoom = 0;
            }
        }
        // if(!$scope.webRTC.ModeSwitch){
        // 	$scope.webRTC.Headershow = true;
        // }
        // $scope.webRTC.ModeSwitch = false;
        // // 选中的 大屏显示 id
        // $scope.webRTC.selectItemId = id;
        // // 最小化 时显示 屏幕共享让的流
        // $scope.webRTC.minimize.id = id;
        // // 1大5小 翻页
        // // $scope.webRTC.StreamList = $scope.webRTC.SDK.dataHandling([], 6, $scope.webRTC.userList);
        // // id 等于自己时
        // if (id == $scope.webRTC.msg.userId) {
        // 	$timeout(() => {
        // 		$('#webRTC-main video').css({ 'object-fit': 'contain' });
        // 		let node = document.getElementById($scope.webRTC.msg.userId);
        // 		node.srcObject = $scope.webRTC.localStream;
        // 		// 自己大屏时 订阅传空
        // 		$scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().orderStream('');
        // 	})
        // } else {

        // 	// ng-if 还未执行完 获取不到标签元素 延迟调用 渲染
        // 	$timeout(() => {
        // 		$('#webRTC-main video').css({ 'object-fit': 'contain' });
        // 		// 其他成员大屏时 订阅 对方id 单个
        // 		$scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().orderStream(id + '_video');
        // 		// 其他成员 标签
        // 		let video = document.getElementById(id);
        // 		// 渲染 其他成员    流资源
        // 		$scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
        // 	})
        // }
        console.log(data);
    };
    function onDoubleZoomV(key, data) {
        // 单人视频禁止触发
        if(!$scope.webRTC.VconcatId){
            return;
        }
        $scope.webRTC.ModeSwitch = false;
        // 选中的 大屏显示 id
        $scope.webRTC.selectItemId = data.id;
        // 最小化 时显示 屏幕共享让的流
        $scope.webRTC.minimize.id = data.id;
        if (key == 1) {
            $scope.webRTC.Headershow = true;
        } else {
            $scope.webRTC.Headershow = false;
        }
        // id 等于自己时
        if (data.id == $scope.webRTC.msg.userId) {
            $timeout(() => {
                $('#webRTC-main video').css({ 'object-fit': 'contain' });
                let node = document.getElementById($scope.webRTC.msg.userId);
                // 禁止标签输出自己的音频 否则有回音
                node.muted = true;
                node.srcObject = $scope.webRTC.localStream;
                // 自己大屏时 订阅传空
                $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().orderStream('');
            }, 0, true)
        } else {

            // ng-if 还未执行完 获取不到标签元素 延迟调用 渲染
            $timeout(() => {
                $('#webRTC-main video').css({ 'object-fit': 'contain' });
                // 其他成员大屏时 订阅 对方id 单个
                $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().orderStream(data.id + '_video');
                // 其他成员 标签
                let video = document.getElementById(data.id);
                // 渲染 其他成员    流资源
                $scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
            }, 0, true)
        }
    }
    // 单人视频会议 大小屏幕切换
    $scope.oneOnMinToggle= function(id){
        // console.log('触发事件冒泡：');
        if($scope.Move.IsMove){
            // 默认 别人最大化 切换逻辑
            // if( $scope.webRTC.oneSmallV == id  ){
            //     $scope.webRTC.userList.map(item=>{
            //         if(id != item.ClientKey){
            //             $scope.webRTC.oneSmallV = item.ClientKey;
            //             $scope.Move.IsMove = false;
            //         }
            //     })
            // }else{
            //     $scope.webRTC.oneSmallV = id;
            //     $scope.Move.IsMove = false;
            // }
            // 默认 自己最大化 切换逻辑
            // console.log('click');
            $scope.webRTC.oneSmallV = id;
            $scope.Move.IsMove = false;
        } 
        // if($('.one-webRTC-SmallV').hasClass('one-webRTC-SmallV-Move-left')){
        //     console.log('删除左边Class')
        //     $('.one-webRTC-SmallV').removeClass('one-webRTC-SmallV-Move-left');
        // }else if($('.one-webRTC-SmallV').hasClass('one-webRTC-SmallV-Move-right')){
        //     console.log('删除右边Class')
        //     $('.one-webRTC-SmallV').removeClass('one-webRTC-SmallV-Move-right');
        // }
        $('.one-on-one-video-list-item').attr('style','');
    }
    // 单人视频会议 小屏幕 可拖动
    $scope.webRtcMousedown = function(evt,id){
        $scope.Move.firstTime = new Date().getTime();
        // video最小化的才可以执行 拖动
        if ($scope.webRTC.oneSmallV == id) {
            return;
        };
        $scope.Move.elem = $(".one-webRTC-SmallV");
			// 设置鼠标样式
			$scope.Move.elem.css('cursor', 'move');
			$scope.Move.key = true;//开启拖动

			var e = evt || window.event;
			// console.log($scope.Move.elem.offset().left, $scope.Move.elem.offset().top)
			$scope.Move.x = e.clientX - $scope.Move.elem.offset().left;//鼠标点击的位置距元素边界的距离,用来固定鼠标与元素的相对位置不变
			$scope.Move.y = e.clientY - $scope.Move.elem.offset().top;
            // 鼠标松开时事件
			document.onmouseup = function (){
                //鼠标抬起后 记录时间 超过200ms就是移动事件 阻止事件冒泡参数
                $scope.Move.lastTime = new Date().getTime();
                if( ($scope.Move.lastTime - $scope.Move.firstTime) < 200){
                    $scope.Move.IsMove = true;
                }
				if ($scope.Move.key) {
                    // console.log('靠边：', getInner('one-on-one-video-box').w/2, $(".one-webRTC-SmallV").offset().left , $(".one-webRTC-SmallV").width()/2);
                    // 判断自动贴边   标签距离左边的距离 + 标签一半的宽度
                    if( (getInner('one-on-one-video-box').w/2) > ($scope.Move.elem.offset().left + $scope.Move.elem[0].offsetWidth/2) ){
                    //     // $scope.Move.elem.css({'transition': 'right 0s',})
                        $scope.Move.elem.css({'left':0 ,'right':'auto',});
                    //     // $scope.Move.elem.addClass('one-webRTC-SmallV-Move-left');

                    }else{
                        $scope.Move.elem.css({'right':0 ,'left': 'auto',});
                    //     // $scope.Move.elem.addClass('one-webRTC-SmallV-Move-right');
                    }
					$scope.Move.elem.css('cursor', '');
                    document.getElementsByClassName('one-on-one-video-list-item')[0].style='';
					// $scope.Move.elem = null;
					$scope.Move.key = false;//开关关闭
					// console.log($scope.Move);
				};
			};
            	// 鼠标 移动 ;
			document.onmousemove = function (evt) {
                if ($scope.Move.key) {
                     // 当前为鼠标移动事件 阻止事件冒泡
                     $scope.Move.IsMove = false;
                    var newe = evt || window.event;
					var left = newe.clientX - $scope.Move.x;//鼠标移动时物体边界距离屏幕边界的距离
					var top = newe.clientY - $scope.Move.y;
                    if (left <= 0)//左右边界限定
					{
						left = 0;
					}
					else if (left >= getInner('one-on-one-video-box').w - $scope.Move.elem[0].offsetWidth)//元素在最右边时的判定，父节点（屏幕）的宽度减去元素自身的宽度
					{
						// console.log(left, getInner('main_bg').w, $scope.Move.elem[0].offsetWidth)
						left = getInner('one-on-one-video-box').w - $scope.Move.elem[0].offsetWidth;

					}
					if (top <= 0)//上下边界限定
					{
						top = 0;
					}
					else if (top >= getInner('one-on-one-video-box').h - $scope.Move.elem[0].offsetHeight)//元素在最下边时的判定，父节点（屏幕）的高度减去元素自身的高度
					{
						top = getInner('one-on-one-video-box').h - $scope.Move.elem[0].offsetHeight;
					}
                   
					$scope.Move.elem.css({ 'left': left + 'px', 'top': top + 'px' });
                }
            }
    };
    	// 获取容器的 宽度 高度 禁止超出
		function getInner(classname) {
			return {
				w: document.getElementsByClassName(classname)[0].clientWidth,
				h: document.getElementsByClassName(classname)[0].clientHeight
			}
		}
    // 点击大屏显示 切换UI视频显示模式
    $scope.onFullScreen = function ($event, id) {
        // 窗口不是最小化才可以执行 拖动
        if ($scope.webRTC.minimize.Turnon) {
            return;
        }
        let userList = $scope.webRTC.userList;
        for (let i in userList) {
            if (userList[i].id == id) {
                userList[i].Zoom = 1;
                onDoubleZoomV(userList[i].Zoom, userList[i]);
            } else {
                userList[i].Zoom = 0;
            }
        }
        // $scope.webRTC.ModeSwitch = false;
        // // if ($scope.webRTC.ModeSwitch) {

        // // 	$scope.webRTC.selectItemId = '';
        // // 	// 最小化 时显示 屏幕共享让的流
        // // 	$scope.webRTC.minimize.id = id;
        // // 	// 4个平分 翻页
        // // 	// $scope.webRTC.StreamList = $scope.webRTC.SDK.dataHandling([], 4, $scope.webRTC.userList);
        // // 	// ng-if 还未执行完 获取不到标签元素 延迟调用 渲染
        // // 	setTimeout(() => {
        // // 		$('#webRTC-main video').css({ 'object-fit': 'contain' });
        // // 		//  切换uI显示 重新渲染 video 订阅多个id拼接
        // // 		$scope.webRTC.SDK.OnCutoverAgainRendering();
        // // 	}, 100)
        // // } else {

        // // 选中的 大屏显示 id
        // $scope.webRTC.selectItemId = id;
        // // 最小化 时显示 屏幕共享让的流
        // $scope.webRTC.minimize.id = id;
        // // 1大5小 翻页
        // // $scope.webRTC.StreamList = $scope.webRTC.SDK.dataHandling([], 6, $scope.webRTC.userList);
        // // id 等于自己时
        // if (id == $scope.webRTC.msg.userId) {
        // 	$timeout(() => {
        // 		$('#webRTC-main video').css({ 'object-fit': 'contain' });
        // 		let node = document.getElementById($scope.webRTC.msg.userId);
        // 		node.srcObject = $scope.webRTC.localStream;
        // 		// 自己大屏时 订阅传空
        // 		$scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().orderStream('');
        // 	})
        // } else {

        // 	// ng-if 还未执行完 获取不到标签元素 延迟调用 渲染
        // 	$timeout(() => {
        // 		$('#webRTC-main video').css({ 'object-fit': 'contain' });
        // 		// 其他成员大屏时 订阅 对方id 单个
        // 		$scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().orderStream(id + '_video');
        // 		// 其他成员 标签
        // 		let video = document.getElementById(id);
        // 		// 渲染 其他成员    流资源
        // 		$scope.webRTC.SDK.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
        // 	})
        // }

        // }

    }
    // 点击缩小平分显示 切换UI视频显示模式
    $scope.onZoomOut = function ($event, id) {
        let userList = $scope.webRTC.userList
        for (let i in userList) {
            userList[i].Zoom = 0;
        }
        $scope.webRTC.ModeSwitch = true;
        $scope.webRTC.selectItemId = '';
        // 最小化 时显示 屏幕共享让的流
        $scope.webRTC.minimize.id = id;
        // 4个平分 翻页
        // $scope.webRTC.StreamList = $scope.webRTC.SDK.dataHandling([], 4, $scope.webRTC.userList);
        // ng-if 还未执行完 获取不到标签元素 延迟调用 渲染
        $timeout(() => {
            $('#webRTC-main video').css({ 'object-fit': 'contain' });
            //  切换uI显示 重新渲染 video 订阅多个id拼接
            $scope.webRTC.SDK.OnCutoverAgainRendering();
        }, 0, true)
    }
    // 最小化
    $scope.Onminimize = function ($event) {
        // 窗口最小化
        // if (!$scope.webRTC.minimize.Turnon) {
        //     $scope.webRTC.minimize.Turnon = true;
        //     // if($scope.webRTC.ModeSwitch&&$scope.webRTC.minimize.id == ''){
        //     // 	$scope.webRTC.minimize.id = $scope.user.SUserId;//显示自己
        //     // }
        // } else {
        //     // 窗口还原
        //     $scope.webRTC.minimize.Turnon = false;
        //     // $scope.webRTC.minimize.id = '';
        //     $(".webRTC-wrapper").css({ 'left': '0px', 'top': '0px' });
        // }
        frameService.minFrame();
        // 隐藏成员列表
        $scope.webRTC.MemberListshow = false;
    }; 
}]);


// function getSharedStream($scope){
//       let node = document.getElementById('LocalStream');
//        node.autoplay = true;
//        node.srcObject = null;
//     // 原生 屏幕共享  音频输出的电脑自身的声音 无法输出外部的声音 需特殊处理
//     // navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then(stream => {
//     //     console.log(stream);
//     //     // let node = document.getElementById('LocalStream');
//     //     // node.autoplay = true;
//     //     // node.srcObject = stream;
//     // }).catch(Error => {
//     //     console.log(Error);
//     // });
// }
//  监听  video 标签 上d item.stream数据  设置video DOM属性
controllers.directive('changeStream', function () {
    return function (scope, ele, attrs) {
        scope.$watch(attrs.changeStream, function (value) {
            if (value) {
                // 兼容写法：
                try {
                    ele[0].srcObject = value;
                } catch (e) {
                    ele[0].src = window.URL.createObjectURL(value);
                }
                console.log(ele)
                // ele[0].srcObject = value;
                // console.log(value); 
            }
        });
    }
});
