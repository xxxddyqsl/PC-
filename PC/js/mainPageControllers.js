var controllers = angular.module('Controllers');
var changeTitleTimer;
if (location.href.indexOf('debug') == -1) {
    // if(console){
    // var old = console.log;
    // console.log = function(){}
    // }
}
var resizing = 0;
var lastPoint = {};

$('body').mousemove(function (e) {
    if (resizing == 0) return;
    // e.preventDefault();
    // e.stopPropagation();
    $('body').addClass('no_select');
    if (lastPoint.x !== undefined) {
        var changeX = e.clientX - lastPoint.x;
        var changeY = e.clientY - lastPoint.y;
        if (resizing == 1) {
            var leftWidth = $('.left_part').width();
            if (changeX < 0) {
                if (leftWidth >= 253) {
                    $('.left_part').css('width', Math.max(252, leftWidth + changeX));
                    $('.right_part').css('left', Math.max(252, leftWidth + changeX));
                }
            } else {
                if (leftWidth <= 400) {
                    $('.left_part').css('width', Math.min(400, leftWidth + changeX));
                    $('.right_part').css('left', Math.min(400, leftWidth + changeX));
                }
            }
        }
        if (resizing == 2) {
            var editorHeight = $('.msg_editor').height();
            if (changeY < 0) {
                if (editorHeight <= 400) {
                    $('.msg_editor').css('height', Math.min(400, editorHeight - changeY));
                    $('.msg_list_wrap').css('bottom', Math.min(400, editorHeight - changeY));
                }
            } else {
                if (editorHeight >= 101) {
                    $('.msg_editor').css('height', Math.max(100, editorHeight - changeY));
                    $('.msg_list_wrap').css('bottom', Math.max(100, editorHeight - changeY));
                }
            }
        }
    }
    lastPoint.x = e.clientX;
    lastPoint.y = e.clientY;
});

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
        loginReturn: function (res) {
            // 修改托盘图标操作
            this.statusChangeCallBack(res);
            if (isFirstCall) {
                isFirstCall = false;
                // 首次进入主界面操作
            } else {
                // 右键托盘，点击上线操作
            }
        },
        receiveMsg: function (res) {
            $rootScope.$broadcast('receiveMsgFromCef', res);
        },
        updateChatReadTime: function (res) {
            $rootScope.$broadcast('updateChatReadTime', res);
        },
        msgStatusReturn: function (res) {
            // 如果是消息撤回，则构造receiveMsgFromCef数据结构体{msg:{},sender:{}}，并触发receiveMsgFromCef事件
            // 否则触发msgSendResult
            var msg = res.Data;
            // chatService.setLastMsgTime(msg.ChatId,msg.Timestamp);
            if (!msg) return;
            var isWithDraw = false;
            if (webConfig.MSG_TYPE_ARR[msg.Type] == webConfig.MSG_SERVICE_TYPE) {
                var msgObj = angular.fromJson(msg.Content);
                if (msgObj.n_TYPE == 7) {
                    isWithDraw = true;
                }
            }
            if (isWithDraw) {
                var temp = {};
                temp.msg = msg;
                var currentUser = webConfig.getUser();
                temp.sender = {};
                temp.sender.Id = currentUser.Id;
                temp.sender.Name = currentUser.Name;
                temp.sender.Avatar = currentUser.Avatar;
                $rootScope.$broadcast('receiveMsgFromCef', {
                    Code: 0,
                    Data: [temp],
                    Flage: 0,
                    Message: null
                });
            } else {
                $rootScope.$broadcast('msgSendResult', res);
            }
        },
        statusChangeCallBack: function (res) {
            // 0成功
            // 1失败
            // 2掉线
            // 3被踢
            // 4失效
            $timeout(function () {
                $scope.userStatus.status = res.Data;
                if (res.Data != 0) {
                    frameService.offLine();
                    $scope.userStatus.online = false;
                    if (res.Data == 3) {
                        frameService.accountLogout(function () {
                            alert(langPack.getKey('loginInOther'));
                            frameService.reset(langPack.getKey('appName'), 'login.html', {
                                action: 'login'
                            }, 340, 490);
                        })
                    }
                    if (res.Data == 1) {

                    }
                    if (res.Data == 4) {
                        frameService.accountLogout(function () {
                            alert(langPack.getKey('outOfToken'));
                            frameService.reset(langPack.getKey('appName'), 'login.html', {
                                action: 'login'
                            }, 340, 490);
                        })
                    }
                    // if(res.Data == 2){
                    // alert(langPack.getKey('offlineTip'));
                    // }
                } else {
                    $scope.userStatus.online = true;
                    frameService.onLine();
                }
            })
        },
        wakedByTray: function (res) {
            $rootScope.$broadcast('wakedByTray', res);
        },
        frameStatusChangeCallBack: function (res) {
            $scope.frame.status = res.Data;
            if (res.Data == 1) {
                frameService.stopTwinkle();
                $rootScope.$broadcast('frameFocus');
            }
            $rootScope.$broadcast('frameStatusChangeCallBack', res.Data);
        },
        chatUpdated: function (res) {
            var currentUser = webConfig.getUser();
            if (res.Data.Type == 1000) {
                if (currentUser.Id == res.Data.Id) {
                    $('.' + res.Data.Id).addClass('online').removeClass('offline');
                    $('.' + res.Data.Id).attr('src', res.Data.Avatar + '?_=' + util.getNow());
                } else {
                    if (res.Data.IMStatus == 5) {
                        $('.' + res.Data.Id).removeClass('online').addClass('offline');
                    } else {
                        $('.' + res.Data.Id).addClass('online').removeClass('offline');
                    }
                    $('.' + res.Data.Id).attr('src', res.Data.Avatar + '?_=' + util.getNow());
                }
            }
            $rootScope.$broadcast('chatUpdated', res);
        },
        groupUpdate: function (res) {
            $rootScope.$broadcast('groupUpdate', res);
        },
        cascadeCallback: function (res) {
            if (res.Data.action == 'settingChange') {
                settingService.getSetting(function (res) {
                    $scope.userSetting = res.Data;
                })
                return;
            } 
            $rootScope.$broadcast('cascadeCallback', res);
        },
        fileProcessUpdated: function (res) {
            $rootScope.$broadcast('changeFileMessageUploadProgess', res.Data);
        },
        hotkeyDetected: function (res) {
            $rootScope.$broadcast('hotkeyDetected', res.Data);
        }
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
    settingService.getSetting(function (res) {
        $scope.userSetting = res.Data;
    })
    frameService.getCurrentUser(function (res) {
        frameService.onLine();
        $timeout(function () {
            $scope.user = webConfig.getUser();
            $scope.global = envConfig.getEnvData();
        })
    });
    $scope.toggleSystemMenu = function (e) {
        $scope.show = !$scope.show;
        $rootScope.$broadcast('document.click');
    }
    $doc.bind('click', function (e) {
        $scope.show = false;
        $rootScope.$broadcast('document.click', e);
    });
    var mouseDownTimer;
    var handleMouseDown = {
        input: 1,
        textarea: 1
    }

    $doc.bind('mousedown', function (e) {
        if (resizing == 0) {
            var tar = e.srcElement || e.target;
            var tagName = tar.tagName.toLowerCase();
            var parentTar = tar.parentNode;
            var parTagName = parentTar.tagName ? parentTar.tagName.toLowerCase() : '';
            if (($('.header').find(tar).size() != 0 || tar.className == 'header') && parTagName != 'a' && tagName != 'a' && tagName != 'img' && $('.search').find(tar).size() == 0) {
                $rootScope.$broadcast('hiddenMenu');
                mouseDownTimer = setTimeout(function () {
                    frameService.moveFrame();
                });
            }
        }
    });
    $doc.bind('mouseup', function (e) {
        clearTimeout(mouseDownTimer);
        lastPoint = {};
        resizing = 0;
        $('body').removeClass('no_select');
    });
    $doc.bind('keyup', function (e) {
        if (e.keyCode == util.KEYMAP.S || e.keyCode == util.KEYMAP.Q) {
            if (document.activeElement && (document.activeElement.id != 'msg_edit_area' && document.activeElement.id != 'search_ipt' && document.activeElement.id != 'group_name')) {
                $('#search_ipt').focus();
            }
        }
        if (e.keyCode == util.KEYMAP.ESC) {
            // frameService.hideMainFrame();
        }
    });
    $('.search')[0].addEventListener('drop', function (e) {
        e.preventDefault();
    }, false);
    document.addEventListener("drag", exectEditorArea, false);
    document.addEventListener("dragleave", exectEditorArea, false);
    document.addEventListener("drop", exectEditorArea, false);
    document.addEventListener("dragenter", exectEditorArea, false);
    document.addEventListener("dragover", exectEditorArea, false);

    function exectEditorArea(e) {
        if (e.target.id != 'msg_edit_area') {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'none'
        } else {
            e.dataTransfer.dropEffect = 'copy';
        }
    }
    $('.win_btn').on('drag', function () {
        return false;
    })
}])

controllers.controller('mainController', ['$scope', 'empService', 'chatService', '$state', '$timeout', 'concatService', 'jQueryScrollbar', 'util', 'domain', '$rootScope', 'webConfig', 'socketConnect', 'langPack', 'frameService', '$interval', 'getChatIdInfo', 'getChatIdObj', 'rtcRoomObj', function ($scope, empService, chatService, $state, $timeout, concatService, jQueryScrollbar, util, domain, $rootScope, webConfig, socketConnect, langPack, frameService, $interval, getChatIdInfo, getChatIdObj, rtcRoomObj) {
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.keyCode == util.KEYMAP.A) {
            var tar = e.target;
            if (tar == document.body) {
                if ($scope.chatData.currentChat) {
                    var chatId = $scope.chatData.currentChat;
                    var dom = document.getElementById('msgList_' + chatId);
                    if (dom) {
                        var selection = document.getSelection();
                        var range = document.createRange();
                        var childs = dom.childNodes;
                        if (childs.length) {
                            range.setStartBefore(childs[0]);
                            range.setEndAfter(childs[childs.length - 1]);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }
                }
                e.preventDefault();
            }
        }
    })
    $scope.chatData = {
        currentChat: ''
    }
    $scope.view = {
        currentView: 'chat',
        goDeptId: '',
        broadMsg: ''
    }
    $scope.record = {
        status: 0, // 0 未开始 1 录音中 2 录音结束,
        recordTime: 0,
        recordFile: '',
        recordTimer: ''
    }
    $scope.concatData = {
        currentConcat: ''
    }
    $scope.windowStatus = {
        status: 0
    };
    $scope.creating = {
        status: 0
    };
    //添加遮罩层定时器，防止未知原因导致遮罩层不消失
    var indexLoading;
    $scope.$watch('creating.status', function (newValue, oldValue) {
        if (newValue == 1) {
            indexLoading = setTimeout(function () {
                $scope.creating = {
                    status: 0
                }
            }, 30000);
        } else {
            clearTimeout(indexLoading)
        }
    });

    var firstDown, secondDown;
    $('.header').bind('mousedown', function (e) {
        if (e.target && (e.target.tagName == 'A' || e.target.tagName == 'INPUT' || e.target.tagName == 'IMG')) return;
        if (secondDown) {
            firstDown = secondDown;
            secondDown = util.getNow();
        } else {
            if (firstDown) {
                secondDown = util.getNow();
            } else {
                firstDown = util.getNow();
            }
        }
        // console.log(firstDown,secondDown,secondDown - firstDown)
        if (secondDown && firstDown && (secondDown - firstDown < 300)) {
            frameService.maxFrame(function (res) {
                $timeout(function () {
                    $scope.windowStatus.status = res.Data;
                })
            });
            firstDown = undefined;
            secondDown = undefined;
        }
    });
    $('.resize_e').mousedown(function () {
        resizing = 1;
    });
    $('.resize_s').mousedown(function () {
        resizing = 2;
    });
    $scope.$on('receiveMsgFromCef', function (e, msg) {
    })
    $scope.$on('cascadeCallback', async function (ev, res) {
        // 个人信息 性别：Gender 男：0 女：1
        let userList = webConfig.getUser();
        let jjtoken = userList.Token;
        let name = userList.Name;
        let phone = userList.Mobile;
        let img = userList.Avatar ? userList.Avatar : userList.Gender==0?"../images/video/defaultHeadImage.jpg":"/IM/avatars/snail_woman.png";
        let groupId = res.Data.groupId?res.Data.groupId:null;
         // 选中的人员 在群列表中 ClientId等于群id 不在群列表中  ClientId等于会议小助手id
        const MeetingAssistantId = 's_f84d705ae09f475d9343623e350fef42';//会议小助手id 固定字段
        console.log('cascadeCallback==groupId=>',groupId);
        // return;
        // 多人视频会议-发送消息
        if (res.Data.action == 'videoConference') {
            console.log(res);
            // userIds 选中的人员
            let selected = res.Data.selected;
            //获取 生成房间号函数
            var guid = new GUID();
            // // 生成房间号
            let roomid = guid.newGUID();
            //查询是否允许进入会议
            chatService.CanJoinRoom(roomid,function(res){
                if((res.Code != 0 || res.Flag != 0 ) && !res.Data){
                    return alert('无法进入该房间')
                }else{
                    // alert('允许进入会议');
                }
            });
            // console.log('是视频房间号：' + roomid);
            let roomObj = {
                chatRoomId: [],
                img: img,
                roomid: roomid,// '88888888' ||
                jjtoken: jjtoken,
                phone: phone,
                userId: userList.Id,
                username: name,
                mode: 'video',// 房间模式 视频 + 音频
                medias: 'av',//流属性 视频+音频
                status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                master: userList.Id,//会议发起人（房主）
                manager: [],//会议管理员 
                ClientId: groupId,//服务端生成的id
                ClientKey: userList.Id,//  登录的KEY 是静静id
                // id-用户id  n-用户name名 i-用户头像
                selected: [
                    {
                        id: userList.Id,
                        name: name,
                        img: img,
                        status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                        audioPause: false, //是否暂停音频流
                        videoPause: false,
                        mode: 'video',//房间模式 video 视频+音频  seceen-屏幕共享
                        medias: '',//流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                        master: '',//房主 值等于用户id
                        manager: '',//会议管理员 
                        ClientId: groupId,//服务端生成的id
                        ClientKey: userList.Id,//  登录的KEY 是静静id
                        Zoom: 0, //显示的屏幕缩放的大小
                    }],//选中的加入视频会议人员列表
            };
            // 获取群信息
            if(groupId){
                // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取当前群信息 
                var groupInfo = await getChatIdInfo(JSON.stringify({ groupId: groupId }), 'group/getbyid');
            }
            //  给选中的人员-发送视频邀请-打开视频会议页面
            for (var k in selected) {
                let is=false; 
                for(let j in groupInfo.Members){
                    if(groupInfo.Members[j].Id == (selected[k].UserId?selected[k].UserId:selected[k].Id) ){
                        is=false;
                        break;
                    }else{
                        is=true;
                    }
                };
                // 发送的成员消息id
                roomObj.chatRoomId.push((selected[k].UserId?selected[k].UserId:selected[k].Id));
                // id-用户id  n-用户name名 i-用户头像 'http://org.jj.woniu.com' +
                roomObj.selected.push({
                    id: (selected[k].UserId?selected[k].UserId:selected[k].Id), 
                    name: selected[k].Name, img: selected[k].Avatar != '' && selected[k].Avatar != undefined ?  selected[k].Avatar : "IM/avatars/snail_woman.png", status: '0', audioPause: false, //是否暂停音频流
                    videoPause: false,
                    mode: "video", // video 摄像头  seceen-屏幕共享
                    medias: "", //流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    orderSwitch: false,//是否订阅过
                    master: '',//房主 值等于用户id
                    manager: '',//会议管理员
                    ClientKey:  (selected[k].UserId?selected[k].UserId:selected[k].Id), //静静id
                    ClientId: is?MeetingAssistantId:groupId,//服务端生成的id
                    Zoom: 0, //显示的屏幕缩放的大小
                });
                // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                // if (chatService.getChat(selected[k].Id) == undefined) {
                //     // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
                //     let params = { userId: selected[k].Id };
                //     let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                //     // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                //     getChatIdObj.setData(ChatIdInfo);
                //     console.log(ChatIdInfo)
                // }
                // console.log(chatService.getChat(selected[k].Id));
                // var content = { "chatRoomId": groupId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
                // var message = chatService.createMessage(selected[k].Id, 10, JSON.stringify(content));
                // chatService.sendMsg(message);
            }
            // 多人 multiplayer: true,
            var content = {multiplayer: true, "chatRoomId": groupId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
            //res.Data.chatId 群id  在群中 添加一条本地消息（仅自己可见）
            // if (res.Data.chatId) {
            //     // 群 id 
            //     // roomObj.chatRoomId.push(res.Data.chatId);
            //     var content = { "chatRoomId": res.Data.chatId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
            //     var message = chatService.createMessage(res.Data.chatId, 10, JSON.stringify(content));
            //     $rootScope.$broadcast('sendingMsg', message.msg, message.now);
            // }
              // 群id
            roomObj.chatRoomId.push(groupId);
               // 发送 会议邀请 数据容器  视频会议控制器 从这里取值
            // rtcRoomObj.msg = roomObj;
            rtcRoomObj.setData(roomObj)

            // 打开视频会议页面窗口 传入的参数 - params
            let params = {};
            params.action = 'new';
            let chat = chatService.getChat(groupId);
            params.groupId = chat.id;//群 id
            params.groupName = chat.Name || chat.ShowName;//群 name

            params.roomObj = JSON.stringify(roomObj);//视频会议信息跟在URL后面传入 视频会议页
            params.msgContent= JSON.stringify(content),// 发送的消息内容
            params.selected =  JSON.stringify(roomObj.chatRoomId), // 发送 邀请消息的消息体
           // 打开视频通话窗口显示 视频会议SDK登录成功之后- 视频通话窗口通知主页面 发送邀请消息   selected需要发送消息的成员id 消息内容（content）  NoticeMainInviteMsg
            frameService.open('vidioMeeting', 'vidioMeeting.html', params, 1080, 680, false, langPack.getKey('startChat'), true, true);

         

             
    //    var content = { "chatRoomId": concatId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
    //    frameService.open('vidioMeeting', 'vidioMeeting.html', {
    //        action: 'new',
    //        msgContent: JSON.stringify(content),// 发送的消息内容
    //        selected:  JSON.stringify(roomObj.chatRoomId), // 发送 邀请消息的消息体
    //        roomObj: JSON.stringify(roomObj),//视频会议信息跟在URL后面传入 视频会议页
    //    }, 1080, 680, false, langPack.getKey('startChat'), true, true);
            // frameService.open('chooseUser', 'vidioMeeting.html', {
            //     action: 'new',
            // }, 1080, 680, false, langPack.getKey('startChat'),  true, true);
            // alert(1111);
            // 获取融云token
            // callCefMethod('account/loginRongYun', {}, function (res) {
            //     if (res.Code == 0) {
            //         let data = JSON.parse(res.Data);
            //         if (data.rongYunToken.code = 200) {
            //             // 解码
            //             var str = decodeURIComponent(data.rongYunToken.reqBody)
            //             var jsonList = {};
            //             var strs = str.split("&");
            //             for (var i = 0; i < strs.length; i++) {
            //                 jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1];
            //             }
            //             // id-用户id  n-用户name名 i-用户头像
            //             useList.push({id:jsonList.userId,n:name,i:jsonList.portraitUri,status:'0'})
            //             let roomObj = {
            //                 appKey: 'cpj2xarlcm2jn',
            //                 img: jsonList.portraitUri,
            //                 roomid: roomid,
            //                 jjtoken: jjtoken,
            //                 phone:phone,
            //                 rytoken: data.rongYunToken.token,
            //                 userId: jsonList.userId,
            //                 username: name,
            //                  // id-用户id  n-用户name名 i-用户头像
            //                 selected:useList,
            //             };
            //             // 本次视频会议是自己发起的 选中的会议成员列表 点击接听时调用
            //             // $('#'+roomid).find('.msg_video_agree').attr('data-vSelected',JSON.stringify(useList));
            //             // encodeURIComponent 现将json（roomObj）转换为字符串再进行编码
            //             window.open("http://172.18.70.26:8080/?obj=" + encodeURIComponent(JSON.stringify(roomObj)));//选中的加入视频会议人员列表
            //         }
            //         console.log(data);

            //     }
            // });
        }
        // 视频会议-添加会议成员-仅发送消息
        if (res.Data.action == 'AddListVideoConference') {
            console.log(res);
            // selected 选中的人员
            let selected = res.Data.selected;
            let roomid = res.Data.roomId;
            console.log(getChatIdObj.getData());
            // console.log('是视频房间号：' + roomid);
             // 获取群信息
             if(groupId){
                // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取当前群信息 
                var groupInfo = await getChatIdInfo(JSON.stringify({ groupId: groupId }), 'group/getbyid');
            }
            var useList = [];
            //  给选中的人员-发送视频邀请
            for (let k in selected) {
                let is=false; 
                // 遍历选中的成员 是否在群列表中 不在 chatRoomId + ClientId 为会议小助手ID
                for(let j in groupInfo.Members){
                    if(groupInfo.Members[j].Id == (selected[k].UserId?selected[k].UserId:selected[k].Id)){
                        is=false;
                        break;
                    }else{
                        is=true;
                    }
                };
                // id-用户id  n-用户name名 i-用户头像
                useList.push({
                    id: (selected[k].UserId?selected[k].UserId:selected[k].Id),
                    name: selected[k].Name,
                    img: selected[k].Avatar,
                    status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                    audioPause: false, //是否暂停音频流
                    videoPause: false,
                    mode: 'video',//房间模式 video 视频+音频  seceen-屏幕共享
                    medias: '',//流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    master: '',//房主 值等于用户id
                    manager: '',//会议管理员 
                    ClientKey: (selected[k].UserId?selected[k].UserId:selected[k].Id),//静静id
                    ClientId:  is?MeetingAssistantId:groupId,//服务端生成的id  // 选中的成员 是否在群列表中 不在  ClientId 为会议小助手ID
                    Zoom: 0, //显示的屏幕缩放的大小
                });
                // 多人 multiplayer: true,
                var content = {multiplayer: true, "chatRoomId":  is?MeetingAssistantId:groupId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
                // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                if (chatService.getChat(selected[k].UserId?selected[k].UserId:selected[k].Id) == undefined) {
                    // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息 
                   
                    let params = { userId:(selected[k].UserId?selected[k].UserId:selected[k].Id)};
                    // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息 
                    let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                    // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                    getChatIdObj.setData(ChatIdInfo);
                    console.log(ChatIdInfo)
                }
                var message = chatService.createMessage((selected[k].UserId?selected[k].UserId:selected[k].Id), 10, JSON.stringify(content));
                chatService.sendMsg(message);
            }
            //res.Data.groupId 群id  在群中 添加一条本地消息（仅自己可见）
            // if (groupId) {
            //     var content = { "chatRoomId": groupId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
            //     var message = chatService.createMessage(groupId, 10, JSON.stringify(content));
            //     $rootScope.$broadcast('sendingMsg', message.msg, message.now);
            // }
            // 发送 会议邀请 数据容器  视频会议控制器 从这里取值
            // rtcRoomObj.msg = roomObj;
            //     rtcRoomObj.getData(roomObj)

            // 通知视频通话窗口 传入添加的成员
            frameService.notice({
                selected: useList,
                roomId: roomid,//房间号
                groupId: groupId,//群id
                timestamp: util.getNow(),
                frameId: 'vidioMeeting',
                action: 'AddListVideoConference'
            }, function (res) {
                // $scope.close();
            })
        }
        // 视频会议窗口-传入主页面值-取消或销毁房间-发送消息
        if (res.Data.action == 'videoSendMessage') { 
            //取消视频会议时 主页面在发送消息前销毁当前房间数据(rtcRoomObj) 否则等主页面发送完消息 视频会议窗口调用destroyedRoomData时通知销毁
            if (res.Data.isRoomType) {
                // 取消会议 当前房间没有其他成员加入 销毁之前存入的房间信息 函数 rtcRoomObj
                rtcRoomObj.setData(null);
            }
            let userIds = res.Data.chatId;
            let content = res.Data.sendMessage;//需要发送的消息体
            // // 聊天群id
            if(groupId){
               // 群id 添加一条本地消息  
            //    var message = chatService.createMessage(groupId, 10, JSON.stringify(content));
            //    $rootScope.$broadcast('sendingMsg', message.msg, message.now);
                // 发送视频会议消息通知
                for (var k in userIds) {
                    //  设置消息体的chatRoomId
                    // content.chatRoomId = (groupId != null ? groupId : userIds[k]);
                    content.chatRoomId = userIds[k].ClientId;
                    // 成员不在群列表里面 ClientId 等于 会议小助手ID
                    if(userIds[k].ClientId.indexOf("s_f8")>=0){
                        alert('忽略会议小助手ID：'+ userIds[k].ClientId);
                        // 跳出本次for循环。下次继续执行。
                        continue;
                    }
                    if(userIds[k].ClientKey != userList.Id) {//ClientKey 不等于自己的id 给其他成员发送房间销毁消息
                        // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                        if (chatService.getChat(userIds[k].ClientKey) == undefined) {
                            let params = { userId:userIds[k].ClientKey};
                            // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息 
                            let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                            // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                            getChatIdObj.setData(ChatIdInfo);
                            console.log(ChatIdInfo)
                        }
                        var message = chatService.createMessage( userIds[k].ClientKey, 10, JSON.stringify(content));
                        chatService.sendMsg(message);
                    }
                }
            }else{
                // 单人 发送视频会议消息销毁通知
                for (var k in userIds) {
                    //  设置消息体的chatRoomId
                    content.chatRoomId = userIds[k].ClientKey;
                   if(userIds[k].ClientKey != userList.Id) {//ClientKey 不等于自己的id 给其他成员发送房间销毁消息
                        // 不是群id 发送一条单人消息通知
                        // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                        if (chatService.getChat(userIds[k].ClientKey) == undefined) {
                            let params = { userId:userIds[k].ClientKey};
                            // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息 
                            let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                            // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                            getChatIdObj.setData(ChatIdInfo);
                            console.log(ChatIdInfo)
                        }
                        var message = chatService.createMessage( userIds[k].ClientKey, 10, JSON.stringify(content));
                        chatService.sendMsg(message);
                    }
                }
            }
           

        };

        // 视频会议窗口 已经打开 通知 销毁主页面存入的房间数据  处理被通知关闭视频窗口事件 - 不需要发送消息
        if(res.Data.action == 'destroyedRoomData'){
            if(rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == res.Data.roomId){
                rtcRoomObj.setData(null);
            }
        }

       // 视频会议窗口创建成功 通知主页面发送邀请消息
        if(res.Data.action == 'NoticeMainInviteMsg'){
            let newRes= res;
            console.log('NoticeMainInviteMsg==>',newRes);
            if(rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == newRes.Data.roomId ){
                // 邀请的成员列表
                let selected= newRes.Data.selected;
                // 发送的消息内容
                let content =JSON.parse(decodeURIComponent(newRes.Data.msgContent));
                // 发送 多人群视频会议邀请消息
                if(groupId){
                    // 群消列表里添加一条本地数据
                    let message = chatService.createMessage(groupId, 10, JSON.stringify(content));
                    $rootScope.$broadcast('sendingMsg', message.msg, message.now);
                    //发送邀请消息
                    for (let i in selected){
                        if(selected[i].ClientKey != userList.Id) {//ClientKey 不等于自己的id 给其他成员发送房间销毁消息
                            content.chatRoomId = selected[i].ClientId;
                            // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                            if (chatService.getChat(selected[i].ClientKey) == undefined) {
                                // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
                                let params = { userId: selected[i].ClientKey };
                                let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                                // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                                getChatIdObj.setData(ChatIdInfo);
                            }
                            let message = chatService.createMessage(selected[i].ClientKey, 10, JSON.stringify(content));
                            //  成员id 发送邀请消息
                            chatService.sendMsg(message);
                        }
                    }
                }else{
                    //发送 单人视频会议邀请消息
                    for (let i in selected){
                        if(selected[i].ClientKey != userList.Id) {//ClientKey 不等于自己的id 给其他成员发送房间销毁消息
                            content.chatRoomId = selected[i].ClientKey;
                            // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                            if (chatService.getChat(selected[i].ClientKey) == undefined) {
                                // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
                                let params = { userId: selected[i].ClientKey };
                                let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                                // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                                getChatIdObj.setData(ChatIdInfo);
                            }
                            let message = chatService.createMessage(selected[i].ClientKey, 10, JSON.stringify(content));
                            //  成员id 发送邀请消息
                            chatService.sendMsg(message);
                        }
                    }
                }
                // if(selected.join(',').indexOf('group_') >= 0){
                //     // // 聊天群id
                //     let groupId = null;
                //     for (let i in selected) {
                //         if (selected[i].indexOf('group_') >= 0) {
                //             groupId = selected[i];
                //         }
                //     };
                //     // 获取群信息 遍历发送的成员id 是否在群列表中
                //     let params = { groupId: groupId };
                //     // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取当前群信息 
                //     let groupInfo = await getChatIdInfo(JSON.stringify(params), 'group/getbyid');

                // }else{

                // }


                // for (let i in selected){
                //     if(selected[i].indexOf('group_') >= 0 ) {
                //         let message = chatService.createMessage(selected[i], 10, JSON.stringify(content));
                //         $rootScope.$broadcast('sendingMsg', message.msg, message.now);
                //      }else{
                //         // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                //         if (chatService.getChat(selected[i]) == undefined) {
                //             // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
                //             let params = { userId: selected[i] };
                //             let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                //             // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                //             getChatIdObj.setData(ChatIdInfo);
                //         }
                //         let message = chatService.createMessage(selected[i], 10, JSON.stringify(content));
                //         //  成员id 发送邀请消息
                //         chatService.sendMsg(message);
                //     }
                // }
                
            };
        }
        // 点击接听-成功加入房间之后 给自己发送消息 禁止其他端再次进入房间
        if(res.Data.action == 'answered'){
            if(rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == res.Data.roomId ){
                // 邀请的成员列表
                let sendId = res.Data.sendId;
                // 发送的消息内容
                let content = JSON.parse(decodeURIComponent(res.Data.msgContent));
                    // content.chatRoomId = sendId;
                    // 视频会议状态 已经在其他端接听
                    content.voiceMeetingType = 'answered';
                     // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                     if (chatService.getChat(sendId) == undefined) {
                        // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
                        let params = { userId: sendId };
                        let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                        // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                        getChatIdObj.setData(ChatIdInfo);
                    }
                    // 发送给自己
                    let message = chatService.createMessage(sendId, 10, JSON.stringify(content));
                    //  成员id 发送邀请消息
                    chatService.sendMsg(message);
                };
        }
        if (res.Data.action == 'chatWith') {
            $rootScope.$broadcast('hiddenGroupInfo');
            $rootScope.$broadcast('chatWith', res.Data.chatId);
        }
        if (res.Data.action == 'goDept') {
            $timeout(function () {
                $scope.view.goDeptId = res.Data.deptId;
                if ($scope.view.currentView == 'concat') {
                    $rootScope.$broadcast('goDept');
                } else {
                    $scope.view.currentView = 'concat';
                }
            })
        }
        if (res.Data.action == 'forward') {
            var msgId = res.Data.msgId;
            var tars = res.Data.selected;
            forwardMsg(msgId, tars);
        }
        if (res.Data.action == 'onlineFiles') {
            var chatId = res.Data.chatId;
            var files = res.Data.onlineFiles;
            var message = chatService.createMessage(chatId, 10, '', '', files);
            chatService.sendOnlineFileMsg(message);
        }
        if (res.Data.action == 'sendImgMsg') {
            var chatId = res.Data.chatId;
            var file = res.Data.file;
            var message = chatService.createMessage(chatId, webConfig.MSG_TYPE_MAP[webConfig.MSG_PIC_TYPE], '', file, []);
            chatService.sendMsg(message);
        }
        if (res.Data.action == 'creatingGroup') {
            $scope.creating[res.Data.chatId] = 1;
            $timeout(function () {
                $scope.creating.status = 1;
                $('#msg_edit_area').blur();
            })
        }
        if (res.Data.action == 'createGroupReturn') { // 创建群组与壳的交互返回通知
            delete $scope.creating[res.Data.chatId];
            $timeout(function () {
                $scope.creating.status = 0;
                $('#msg_edit_area').blur();
            })
        }
        if (res.Data.action == 'groupOperationFailed') { // 群组实际操作失败（创建、增减成员）
            delete $scope.creating[res.Data.groupId];
            $timeout(function () {
                if (res.Data.sdkAction == 17) {
                    $scope.creating.status = 0;
                }
            })
        }
        // if(res.Data.action = 'deleteGroup'){
        // $rootScope.$broadcast('removeChatFromChatList',res.Data.groupId);
        // }
        console.log(res);
    })
    // 创建视频会议生成房间号 roomid
    function GUID() {
        this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
        if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
            GUID.prototype.newGUID = function () {
                this.date = new Date(); var guidStr = '';
                sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                for (var i = 0; i < 9; i++) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                guidStr += sexadecimalDate;
                guidStr += sexadecimalTime;
                while (guidStr.length < 32) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                return this.formatGUID(guidStr);
            }
            /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
            GUID.prototype.getGUIDDate = function () {
                return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
            }
            /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
            GUID.prototype.getGUIDTime = function () {
                return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
            }
            /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
            GUID.prototype.addZero = function (num) {
                if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                    return '0' + Math.floor(num);
                } else {
                    return num.toString();
                }
            }
				/*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
                if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
                else { return parseInt(num.toString()).toString(x); }
            }
            /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
            GUID.prototype.formatGUID = function (guidStr) {
                var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
                return str1 + str2 + str3 + str4 + str5;
            }
        }
    }
    function forwardMsg(msgId, chatIds) {
        chatService.getMsgDetail(msgId, function (msg) {
            msg = msg.Data.msg;
            for (var i = 0; i < chatIds.length; i++) {
                if (chatService.isExist(chatIds[i])) {
                    var message = chatService.createForwardMsg(chatIds[i], msg);
                    chatService.sendMsg(message, function () { });
                } else {
                    createChatAndForward(chatIds[i], msg);
                }
            }
        });
        function createChatAndForward(chatId, msg) {
            chatService.getNewChat(chatId, function (res) {
                chatService.addChat(res.Data);
                var message = chatService.createForwardMsg(chatId, msg);
                chatService.sendMsg(message, function () { });
            })
        }
    }
    $scope.$on('startRecord', function () {
        if ($scope.record.recordTimer) {
            $interval.cancel($scope.record.recordTimer);
        }
        $timeout(function () {
            $scope.record.recordTime = 0;
            $scope.record.recordFile = '';
            $scope.record.status = 1;
        })
        $scope.record.recordTimer = $interval(function () {
            if ($scope.record.recordTime >= 60) {
                $scope.record.status = 2;
                $interval.cancel($scope.record.recordTimer);
                frameService.stopRecord(1, function (res) {
                    $scope.record.recordFile = res.Data;
                })
            } else {
                $scope.record.recordTime += 1;
            }
        }, 1000)
    })
    $scope.$watch('chatData.currentChat', function (v, old) {
        cancelRecord();
    });
    $scope.$watch('view.currentView', function (v, old) {
        cancelRecord();
    });
    $scope.cancelRecord = cancelRecord;
    function cancelRecord() {
        if ($scope.record.status == 1) {
            frameService.stopRecord(0, function (res) {
                // $scope.record.recordFile = res.Data;
            })
        }
        $interval.cancel($scope.record.recordTimer);
        $scope.record.status = 0;
        $scope.record.recordTime = 0;
        $scope.record.recordFile = '';
    }
    $scope.showHistory = function () {
        var params = {};
        params.chatId = $scope.chatData.currentChat;
        frameService.open('history', 'history.html', params, 750, 580, false, langPack.getKey('messageManager'), false, true);
    }
    var oldStatus = $scope.frame.status;
    $scope.$on('hotkeyDetected', function (ev, type) {
        if (type == 1000) {
            if ($scope.frame.status == 1) {
                if (oldStatus == 0) {
                    frameService.hideMainFrame();
                }
                if (oldStatus == 1 || oldStatus == 2) {
                    frameService.minFrame();
                }
            } else {
                frameService.showFrame();
            }
            oldStatus = $scope.frame.status;
        }
        if (type == 1001) {
            if (!$scope.chatData.currentChat) {
                frameService.capture(function (res) {
                });
            }
        }
        if (type == 1004) {
            if ($scope.chatData.currentChat) {
                if (util.isService($scope.chatData.currentChat)) {
                    frameService.open('history', 'history.html', {}, 750, 580, true, langPack.getKey('messageManager'), false, true);
                } else {
                    $scope.showHistory();
                }
            } else {
                frameService.open('history', 'history.html', {}, 750, 580, true, langPack.getKey('messageManager'), false, true);
            }
        }
    })
}]);

controllers.controller('headerController', ['$scope', 'empService', 'chatService', '$state', '$timeout', 'concatService', 'jQueryScrollbar', 'util', 'domain', '$rootScope', 'webConfig', 'socketConnect', 'langPack', 'frameService', function ($scope, empService, chatService, $state, $timeout, concatService, jQueryScrollbar, util, domain, $rootScope, webConfig, socketConnect, langPack, frameService) {
    $scope.showMenu = false;
    $scope.keyword = '';
    $('.search input').bind('drop', function (e) {
        var sourceEvent = e.originalEvent;
        var transfer = sourceEvent.dataTransfer;
        var html = transfer.getData('text/html');
        var content = util.contentReplace(html);
        $timeout(function () {
            $scope.keyword = content;
            $('.search input').focus();
        })
        return false;
    })
    $scope.$watch('user', function (user) {

    })
    $scope.switchView = function (tar) {
        $scope.view.currentView = tar;
        if (tar != 'chat') {
            // $scope.view.broadMsg = '';
        }
    }

    $scope.closeWin = function () {
        frameService.hideMainFrame();
    }
    $scope.minWin = function () {
        frameService.minFrame();
    }
    $scope.maxWin = function () {
        frameService.maxFrame(function (res) {
            $timeout(function () {
                $scope.windowStatus.status = res.Data;
            })
        });
    }
    $scope.toggleMenu = function (e) {
        $scope.showMenu = !$scope.showMenu;
    }
    $scope.$on('document.click', function () {
        $scope.showMenu = false;
        $scope.searchResult.showResult = 0;
        $scope.searchResult.searching = false;
    })
    $scope.startChat = function () {
        // jj.fetch("frame/open", JSON.stringify({ data: { id: "testModal", width: 1080, height: 680, contentPath: "index.html", isModal: true }, callback: "callback" }));//新开窗口
        frameService.open('chooseUser', 'choose.html', {
            action: 'new',
        }, 600, 550, true, langPack.getKey('startChat'))
    }
    $scope.searchResult = {
        searching: false,

        index: -1,

        hasResult: 0,
        showResult: 0,

        allData: [],
        staffs: [],
        groups: [],
        depts: []
    }

    var searchTimer;
    var oldSearch = '';
    var nameSplitReg = /,|，|;|；|、/;
    $scope.$watch('keyword', function (v) {
        // if(v.test(nameSplitReg)){

        // }else{
        $scope.search();
        // }
    })
    $scope.search = function () {
        if (searchTimer) {
            clearTimeout(searchTimer);
            searchTimer = undefined;
        }
        if (!$scope.keyword) {
            oldSearch = '';
            $timeout(function () {
                $scope.searchResult.index = -1;
                $scope.searchResult.searching = false;
                $scope.hideSearchResult();
            });
            return;
        }
        if (oldSearch !== '' && oldSearch == $scope.keyword) {
            $timeout(function () {
                if ($scope.searchResult.allData.length) {
                    $scope.searchResult.searching = true;
                }
            });
            return;
        }
        $timeout(function () {
            $scope.searchResult.showResult = 1;
            $scope.searchResult.searching = true;
        })
        $scope.searchResult.index = -1;
        chatService.searchData($scope.keyword, function (res) {
            oldSearch = $scope.keyword;
            if (res.Data.key != $scope.keyword) {
                return;
            }
            $timeout(function () {
                // if(res.Data.type != -2 && res.Data.data.length){
                // $scope.searchResult.hasResult = 1;
                // }
                var data = res.Data.data;
                var type = res.Data.type;
                if (type == -2) {
                    var _temp = [];
                    data.users = data.users || [];
                    for (var i = 0; i < data.users.length; i++) {
                        var depts = data.users[i].Staffs;
                        var obj = {};
                        obj.Avatar = data.users[i].Avatar;
                        obj.Id = data.users[i].Id;
                        obj.Name = data.users[i].Name;
                        obj.type = 0;
                        obj.IMStatus = data.users[i].IMStatus;
                        if (depts.length) {
                            for (var j = 0; j < depts.length; j++) {
                                var hasMain = false;
                                var _depts = depts[j].Departments;
                                if (_depts.length) {
                                    for (var k = 0; k < _depts.length; k++) {
                                        if (_depts[k].isMain == 1) {
                                            hasMain = true;
                                            obj.deptName = depts[k].LevelInfo;
                                        }
                                    }
                                    if (!hasMain) {
                                        obj.deptName = _depts[0].LevelInfo;
                                    }
                                }
                            }
                        }
                        _temp.push(obj);
                    }
                    $scope.searchResult.staffs = _temp;
                    $scope.searchResult.groups = data.groups;
                    $scope.searchResult.depts = data.depts;
                    for (var i = 0; i < $scope.searchResult.groups.length; i++) {
                        $scope.searchResult.groups[i].type = 1;
                    }
                    for (var i = 0; i < $scope.searchResult.depts.length; i++) {
                        $scope.searchResult.depts[i].type = 2;
                    }
                    $scope.searchResult.allData = [];
                    $scope.searchResult.allData = $scope.searchResult.allData.concat($scope.searchResult.staffs);
                    $scope.searchResult.allData = $scope.searchResult.allData.concat($scope.searchResult.groups);
                    $scope.searchResult.allData = $scope.searchResult.allData.concat($scope.searchResult.depts);
                    if ($scope.searchResult.allData.length) {
                        $scope.searchResult.hasResult = 1;
                        $scope.searchResult.index = 0;
                        $scope.searchResult.allData[0].active = 1;
                    } else {
                        $scope.searchResult.hasResult = 0;
                        $scope.searchResult.index = -1;
                        $scope.searchResult.staffs = [];
                        $scope.searchResult.groups = [];
                        $scope.searchResult.depts = [];
                    }
                }
            })
        })
    }
    $scope.onPaste = function (e) {
        var oe = e.originalEvent;
        var target = oe.target;
        var clip = oe.clipboardData;
        var stringData = '';
        for (var i = 0; i < clip.items.length; i++) {
            if (clip.items[i].type == 'text/plain') {
                stringData = clip.getData('text/plain');
                oe.preventDefault();
            }
        }
        var start = target.selectionStart;
        var end = target.selectionEnd;
        var scrollLeft = target.scrollLeft;
        var scrollWidth = target.scrollWidth;
        target.setRangeText('', start, end);
        if (stringData) {
            var reg = /\r*\n/;
            stringData = stringData.replace(/\r*\n$/, '');
            stringData = stringData.split(reg);
            var arr = [];
            for (var i = 0; i < stringData.length; i++) {
                var _s = $.trim(stringData[i]);
                if (_s) {
                    arr.push(stringData[i]);
                }
            }
            stringData = arr.join(',');
            var end = start + stringData.length;
            // $scope.keyword = $scope.keyword + stringData;
            var len = $scope.keyword.length;
            target.setRangeText(stringData, start, start);
            $scope.keyword = target.value;
            setTimeout(function () {
                target.setSelectionRange(start + stringData.length, start + stringData.length);
                var _scrollWidth = target.scrollWidth;
                target.scrollLeft = scrollLeft + _scrollWidth - scrollWidth;
            });
        }
    }

    $scope.onKeyDown = function (e) {
        var temp = $scope.searchResult.index;
        var all = $scope.searchResult.allData;
        all[temp] && (all[temp].active = false);
        var change = 0;
        if (e) {
            if (e.keyCode == util.KEYMAP.UP) {
                if (temp >= 1) {
                    temp--;
                } else {
                    temp = all.length - 1;
                }
                $scope.searchResult.index = Math.max(0, temp);
                e.preventDefault();
            }
            if (e.keyCode == util.KEYMAP.DOWN) {
                if (temp < all.length - 1) {
                    temp++;
                } else {
                    temp = 0;
                }
                $scope.searchResult.index = Math.min(all.length - 1, temp);
                e.preventDefault();
            }
            if (e.keyCode == util.KEYMAP.ENTER) {
                var type, isGroup, id;
                var data = all[$scope.searchResult.index];
                if (!data) {
                    var nameArr = $scope.keyword.split(nameSplitReg);
                    for (var i = nameArr.length - 1; i >= 0; i--) {
                        nameArr[i] = $.trim(nameArr[i]);
                        if (!nameArr[i]) {
                            nameArr.splice(i, 1);
                        }
                    }
                    chatService.searchByNames(nameArr, function (res) {
                        if (res.Flag == 0) {
                            var users = res.Data.data.userIds;
                            if (users.length) {
                                for (var i = users.length - 1; i >= 0; i--) {
                                    if (users[i] == $scope.user.Id) {
                                        users.splice(i, 1);
                                    }
                                }
                                if (users.length) {
                                    if (users.length == 1) {
                                        $scope.chatWith(users[0]);
                                    } else {
                                        var groupId = ['group', $scope.user.Id, util.getNow()].join('_');
                                        chatService.createGroup(groupId, users, function (res) {
                                            $scope.chatWith(groupId);
                                        })
                                    }
                                }
                            }
                        }
                    })
                    return;
                };
                if (data.type == 0 || data.type == 1) {
                    $scope.chatWith(data.Id);
                }
                if (data.type == 2) {
                    $scope.goDept(data.Id);
                }
                $scope.clearKeyword();
            }
        }
        all[$scope.searchResult.index] && (all[$scope.searchResult.index].active = true);
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
                    if ($scope.searchResult.index == 0) {
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
    $scope.chatWith = function (id) {
        $scope.clearKeyword();
        $rootScope.$broadcast('chatWith', id);
    }
    $scope.goDept = function (id) {
        $scope.view.goDeptId = id;
        if ($scope.view.currentView == 'concat') {
            $rootScope.$broadcast('goDept');
        } else {
            $scope.view.currentView = 'concat';
        }
        $scope.clearKeyword();
    }
    $scope.clearKeyword = function () {
        $scope.keyword = '';
        $scope.searchResult.index = -1;
        $scope.hideSearchResult();
    }
    $scope.hideSearchResult = function () {
        $scope.searchResult.showResult = 0;
        $scope.searchResult.staffs = [];
        $scope.searchResult.groups = [];
        $scope.searchResult.depts = [];
        $scope.searchResult.allData = [];
    }
    $scope.goSetting = function () {
        frameService.open('setting', 'setting.html', '', 620, 470, true, langPack.getKey('setting'))
    }
    $scope.goAbout = function () {
        // open : function(id,path,params,width,height,isModal,name){
        frameService.open('about', 'about.html', '', 340, 475, true, langPack.getKey('about'));
    }
    $scope.switchAccount = function () {
        chatService.checkUnFinishedFileMsg(function (res) {
            if (res.Data.length) {
                if (confirm(langPack.getKey('fileTransfering'))) {
                    cancelQueue(res.Data, function () {
                        frameService.logout(function () {
                            frameService.reset(langPack.getKey('appName'), 'login.html', {
                                action: 'switch'
                            }, 340, 490);
                        })
                    })
                }
            } else {
                frameService.logout(function () {
                    frameService.reset(langPack.getKey('appName'), 'login.html', {
                        action: 'switch'
                    }, 340, 490);
                })
            }
        })
    }
    $scope.logOut = function () {
        chatService.checkUnFinishedFileMsg(function (res) {
            if (res.Data.length) {
                if (confirm(langPack.getKey('fileTransfering'))) {
                    cancelQueue(res.Data, function () {
                        frameService.logout(function () {
                            frameService.closeMainFrame();
                        })
                    })
                }
            } else {
                frameService.logout(function () {
                    frameService.closeMainFrame();
                })
            }
        })
    }
    function cancelQueue(list, finalCallback) {
        frameService.cancelTransfer({
            id: list.shift()
        }, function (res) {
            if (list.length) {
                cancelQueue(list, finalCallback);
            } else {
                finalCallback && finalCallback();
            }
        })
    }
    $scope.$on('cascadeCallback', function (ev, res) {
        if (res.Data.action == 'logout') {
            $scope.logOut();
        }
    });
}]);

controllers.controller('chatListController', ['$stateParams', '$scope', 'empService', 'chatService', 'domain', 'util', '$timeout', 'pops', 'concatService', 'webConfig', 'servers', '$rootScope', '$compile', 'langPack', 'socketConnect', 'ajaxService', 'frameService', 'concatService','rtcRoomObj', function ($params, $scope, empService, chatService, domain, util, $timeout, pops, concatService, webConfig, servers, $rootScope, $compile, langPack, socketConnect, ajaxService, frameService, concatService,rtcRoomObj) {
    $scope.chatList = [];
    var page = 1, pageSize = 20;
    var getTimer;
    var msgReplaceBody = {};
    msgReplaceBody[webConfig.MSG_FILE_TYPE] = langPack.getKey('file');
    msgReplaceBody[webConfig.MSG_PIC_TYPE] = langPack.getKey('img');
    msgReplaceBody[webConfig.MSG_VIDEO_TYPE] = langPack.getKey('video');
    msgReplaceBody[webConfig.MSG_VOICE_TYPE] = langPack.getKey('audio');
    $scope.onScrollEnd = function () {
        $timeout.cancel(getTimer);
        getTimer = $timeout(function () {
            page++;
            chatService.getChats(page, pageSize, function (res) {
                // console.log(res);
                if (res.Flag == 0) {
                    $timeout(function () {
                        resetChtMsgContentList(res.chatList);
                        $scope.chatList = res.chatList;
                    })
                } else {
                    page--;
                }
            });
        }, 500)
    }
    $scope.checkAtMsg = function (id) {
        if (id % 13 == 0) return true;
        return false;
    }
    $scope.hasName = function (chat) {
        return chat.Name;
    }
    $scope.chatWith = function (chatId) {
        concatService.getUserDetail(chatId, function (res) {
            if (res.Data) {
                for (var i = 0; i < $scope.chatList.length; i++) {
                    if ($scope.chatList[i].Id == chatId) {
                        $scope.chatList[i].Name = res.Data.Name;
                        break;
                    }
                }
            }
        })
        frameService.stopTwinkle();
        if ($scope.chatData.currentChat != chatId) {
            var chat = chatService.getChat(chatId);
            chat.ReadTimestamp = util.getNow();
            chatService.setIsRead(chatId);
        }
        $timeout(function () {
            $scope.chatData.currentChat = chatId;
        })
        var _chat = chatService.getChat(chatId);
        // _chat.UnreadMsgCount = 0;
        $scope.view.broadMsg = '';
    }
    $scope.whenShow = function (chat) {
        if (chat.Type == 1002) {
            // var groupInfo = chatService.getGroupInfo(chat.id);
            // for(var p in groupInfo){
            // chat[p] = groupInfo[p];
            // }
        }
    }
    $scope.allOfflineMsgReceived = false;
    $scope.$on('cascadeCallback', function (ev, res) {
        if (res.Data.action == 'allOfflineMsgReceived') {
            $scope.allOfflineMsgReceived = true;
        }
        if (res.Data.action == 'deleteGroup') {
            // $rootScope.$broadcast('removeChatFromChatList',res.Data.groupId);
            var chatId = res.Data.groupId;
            chatService.removeChat(chatId);
            $timeout(function () {
                $scope.chatList = chatService.chatList;
                if ($scope.chatData.currentChat == chatId) {
                    $scope.chatData.currentChat = '';
                }
            });
        }
    })

    function init() {
        chatService.getChats(page, pageSize, function (res) {
            if (res.Flag == 0) {
                $timeout(function () {
                    console.log(res.chatList)
                    resetChtMsgContentList(res.chatList);
                    $scope.chatList = res.chatList;
                })
            } else {
                $timeout(function () {
                    $scope.chatList = chatService.chatList;
                });
            }
        });
    }
    function resetChtMsgContentList(list) {
        for (var i = 0; i < list.length; i++) {
            var _type = list[i].MsgType;
            var _typeName = webConfig.MSG_TYPE_ARR[_type];
            if (msgReplaceBody[_typeName]) {
                list[i].MsgContent = msgReplaceBody[_typeName];
            }
            if (_type == 10 && list[i].MsgContent) {
                try {
                    var msgObj = angular.fromJson(list[i].MsgContent);
                    if (list[i].MsgSenderName) {
                        list[i]._senderName = list[i].MsgSenderName;
                    }
                    if (msgObj.n_TYPE == 100 || msgObj.n_TYPE == 3 || msgObj.n_TYPE == 4) {
                        list[i].MsgSenderName = '';
                    }
                } catch (e) { }
            }
        }
    }
    init();
    var sendingMsg = {};
    $scope.$on('msgSendResult', function (ev, res) {
        if (res.Flag == 0) {
            var msgId = res.Data.Id;
            //方式1：视频会议特殊处理  发送成功之后返回数据 不添加到消息列表中 但是列表要更新排序
            //  如果是视频会议 并且chatRoomId是群id 返回数据res内的chatId修改完群id（chatRoomId）否则就会多一条 发送给某个人的群会议数据出现
            // if(res.Data.Type == 10){
            //     if(JSON.parse(res.Data.Content).chatRoomId.indexOf('group_')>=0){
            //         res.Data.ChatId = JSON.parse(res.Data.Content).chatRoomId;
            //     }
            // }
            var chatId = res.Data.ChatId;

            var chat = chatService.getChat(chatId);
            if (chat) {
                $timeout(function () {
                    //    方式2：视频会议特殊处理 群视频会议邀请发给指定成员的 数据不在dom中渲染 已经在群中 添加一条本地消息（仅自己可见） 否则渲染的会议邀请dom 是在和指定成员的私聊中渲染 不在群聊中渲染
                    // if (res.Data.Type == 10) {
                    //     if (JSON.parse(res.Data.Content).chatRoomId.indexOf('group_') >= 0 && chatId != JSON.parse(res.Data.Content).chatRoomId) {
                    //         return;
                    //     }
                    // }
                    chat.MsgTimestamp = res.Data.Timestamp;
                    chat.ReadTimestamp = res.Data.Timestamp;
                    chat.msgTemp = '';
                    chat.ActiveTimestamp = res.Data.Timestamp;
                    chat.LastMsgId = msgId;
                    chat.MsgStatus = res.Data.Status;
                    // changeChatMsgContent(chat,res.Data); //数据推入 添加聊天消息内容
                    $scope.chatList = chatService.handlerChatList($scope.chatList);
                })
                delete sendingMsg[msgId];
                chatService.setIsRead(chatId, function (res) {
                    if (res.Flag == 0) {
                        if ($scope.chatData.currentChat == chatId) {
                            $timeout(function () {
                                // chat.UnreadMsgCount = 0;
                            })
                        }
                    }
                })
            }
        }
    });

    $scope.$on('messageSendFail', function (ev, msgId, chatId) {
        $timeout(function () {
            if (chatService.isSending(msgId) || chatService.isReSending(msgId)) {
                var chat = chatService.getChat(chatId);
                $timeout(function () {
                    chat.MsgStatus = 0;
                })
            }
        });
    })
    // 添加聊天消息内容
    function changeChatMsgContent(chat, msg, sender) {
        // //方式1：视频会议特殊处理 如果是视频会议 chatRoomId是群id 发送到群聊中
        // if(msg.type == 10){
        //     if(JSON.parse(msg.content).chatRoomId.indexOf('group_')>=0){
        //         if( msg.chatId != JSON.parse(msg.content).chatRoomId){
        //             return;
        //         }
        //         //修改chatId 应该为chatRoomId 群id
        //         msg.chatId =JSON.parse(msg.content).chatRoomId;
        //         // 获取群消息模板 添加到列表中
        //         let newchat = chatService.getChat(msg.chatId);
        //             newchat.MsgTimestamp =  chat.MsgTimestamp ;
        //             newchat.ReadTimestamp =  chat.ReadTimestamp ;
        //             newchat.ActiveTimestamp =  chat.ActiveTimestamp ;
        //             newchat.MsgSenderId = chat.MsgSenderId ;
        //             newchat.MsgType = chat.MsgType ;
        //             newchat.MsgStatus = chat.MsgStatus ;

        //             chat=newchat;
        //     }
        // }
        //方式2：视频会议特殊处理 群视频会议邀请发给指定成员的 数据不在dom中渲染 已经在群中 添加一条本地消息（仅自己可见） 否则渲染的会议邀请dom 是在和指定成员的私聊中渲染 不在群聊中渲染
        // if (msg.type == 10) {
        //     // chatRoomId 为群id 
        //     if (JSON.parse(msg.content).chatRoomId.indexOf('group_') >= 0) {
        //         //  msg.chatId为指定成员的id 不是群id
        //         if (msg.chatId != JSON.parse(msg.content).chatRoomId) {
        //             return;
        //         }
        //     }
        // }
        console.log(chat)
        console.log(msg)
        console.log(sender)
        var _type = msg.Type === undefined ? msg.type : msg.Type;
        var _typeName = webConfig.MSG_TYPE_ARR[_type];
        var user = webConfig.getUser();
        if (chat.isGroup) {
            chat.MsgSenderName = msg.SenderId == user.Id ? '' : sender;
        }
        if (_typeName == webConfig.MSG_TEXT_TYPE) {
            chat.MsgContent = msg.Content || msg.content;
            // console.log(sendingMsg[msg.Id]);
        } else {
            if (msgReplaceBody[_typeName]) {
                chat.MsgContent = msgReplaceBody[_typeName];
            } else {
                var isWithDraw = false;
                if (_typeName == webConfig.MSG_SERVICE_TYPE) {
                    var msgObj = angular.fromJson(msg.Content || msg.content);
                    if (msgObj.n_TYPE == 7) {
                        isWithDraw = true;
                    }
                    if (msgObj.n_TYPE == 3 || msgObj.n_TYPE == 4) {
                        chat._senderName = sender;
                        chat.MsgSenderName = '';
                    }
                    if (isWithDraw) {
                        chat.MsgContent = chat.MsgSenderName + ' ' + langPack.getKey('withDrawMsg');
                        chat.MsgSenderName = '';
                    } else {
                        chat.MsgContent = msg.Content || msg.content;
                    }
                }
            }
        }
    }
    $scope.$on('sendingMsg', function (ev, msg, timeStamp) {
        console.log(msg, timeStamp)
        var user = webConfig.getUser();

        var chatId = msg.chatId;

        var chat = chatService.getChat(chatId);
        //方式1： 视频会议特殊处理 如果是视频会议 chatRoomId是群id 发送到群聊中
        //  if(msg.type == 10){
        //     if(JSON.parse(msg.content).chatRoomId.indexOf('group_')>=0){
        //         //修改chatId 应该为chatRoomId 群id
        //         chatId =JSON.parse(msg.content).chatRoomId;
        //         // 获取群消息模板 添加到列表中
        //         chat= chatService.getChat(chatId);
        //     }
        // }
        if (chat) {
            $timeout(function () {
                //方式2：视频会议特殊处理 群视频会议邀请发给指定成员的 数据不在dom中渲染 已经在群中 添加一条本地消息（仅自己可见） 否则渲染的会议邀请dom 是在和指定成员的私聊中渲染 不在群聊中渲染
                if (msg.type == 10) {
                    if (JSON.parse(msg.content).chatRoomId && JSON.parse(msg.content).chatRoomId.indexOf('group_') >= 0 && chatId != JSON.parse(msg.content).chatRoomId) {
                        return;
                    }
                }
                chat.MsgTimestamp = timeStamp;
                chat.ReadTimestamp = timeStamp;
                chat.ActiveTimestamp = timeStamp;
                chat.MsgSenderId = user.Id;
                chat.MsgType = msg.type;
                chat.MsgStatus = 2;
                changeChatMsgContent(chat, msg);
                $scope.chatList = chatService.handlerChatList($scope.chatList);
            })
        }

        sendingMsg[msg.id] = msg;
    })
    // 左侧消息类型提示 （增加或者修改）
    var ignoreNType = {
        3: 1,
        4: 1,
        5: 1,
        6: 1,
        7: 1,
        8: 1,
        10: 1,
        // 100 : 1
    }
    $scope.$on('receiveMsgFromCef', function (ev, res) {
        for (var i = 0; i < res.Data.length; i++) {
            onReceiveMsg(res.Data[i]);
        }
    });
    // 接收到消息  回显 左侧 信息
    function onReceiveMsg(res) {
        var msg = res.msg;
        var frameStatus = $scope.frame.status;
        var sender = res.sender.Name;
        console.log('接收或同步 receivemsg ====== ', msg);
        var senderId = res.sender.Id;
        var isSender = msg.SenderId == $scope.user.Id;
        var _msg = chatService.cefMsgToFrontMsg(res);
        var msgId = _msg.messageid;
        var chatId = msg.ChatId;
        if (_msg.type == webConfig.MSG_SERVICE_TYPE) {
            var contentJson = angular.fromJson(_msg.content);
            var nType = contentJson.n_TYPE;
            // 0：系统分享，1 ： 广播   2：服务号   3：语音会议 4：添加好友 5:公司邀请 6:置顶/免打扰/添加常用联系人同步消息 7:消息撤回 8:离线文件接收回执)
            // 3,4,5,6,7,8不闪，先忽略
            if (nType == 5) return; // 过滤公司邀请消息
            if (chatService.isExist(chatId)) {
                var chat = chatService.getChat(chatId);
                chat._senderName = sender;
            }
            if (ignoreNType[nType]) {
                if (nType == 6) {
                    switch (contentJson.setTopType) {
                        case 'addTop':
                            chatService.setChatStatus(contentJson.chatid, 0);
                            $rootScope.$broadcast('setChatStatus', 0, [contentJson.chatid]);
                            break;
                        case 'deleteTop':
                            chatService.cancelChatStatus(contentJson.chatid, 0);
                            $rootScope.$broadcast('cancelChatStatus', 0, [contentJson.chatid]);
                            break;
                        case 'addDisturb':
                            chatService.setChatStatus(contentJson.chatid, 1);
                            $rootScope.$broadcast('cancelChatStatus', 1, [contentJson.chatid]);
                            break;
                        case 'deleteDisturb':
                            chatService.cancelChatStatus(contentJson.chatid, 1);
                            $rootScope.$broadcast('cancelChatStatus', 1, [contentJson.chatid]);
                            break;
                        case 'addContact':
                            var isGroup = util.isGroup(contentJson.chatid);
                            var _type = isGroup ? 2 : 0;
                            chatService.setChatStatus(contentJson.chatid, 2);
                            $rootScope.$broadcast('setFavorite', _type, [contentJson.chatid]);
                            break;
                        case 'deleteContact':
                            var isGroup = util.isGroup(contentJson.chatid);
                            var _type = isGroup ? 2 : 0;
                            chatService.cancelChatStatus(contentJson.chatid, 2);
                            $rootScope.$broadcast('cancelFavorite', _type, [contentJson.chatid]);
                            break;
                        default:
                            break;
                    }
                }
                if (nType == 3) {
                    if (chatService.isExist(chatId)) {
                        $timeout(function () {
                            if (chat.MsgTimestamp <= msg.Timestamp) {
                                chat.MsgContent = _msg.content;
                                chat.MsgType = _msg.msgType;
                                chat.MsgTimestamp = msg.Timestamp;
                                chat.MsgSenderId = msg.SenderId;
                                chat.ActiveTimestamp = msg.Timestamp;
                                chat._senderName = sender;
                                chat.LastMsgId = msgId;
                                chat.MsgStatus = 1;
                                console.log(chat)
                            }
                            $scope.chatList = chatService.handlerChatList($scope.chatList);
                            changeFrameIcon();
                            if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                                frameService.newMsgDing();
                            }
                            if ($scope.chatData.currentChat != chatId) {
                                if (!isSender) {
                                    if (chat.UnreadMsgCount == 0) {
                                        chat.firstUnReadId = msg.Id;
                                    }
                                    chat.UnreadMsgCount = chat.UnreadMsgCount + 1;
                                }
                            } else {
                                chatService.setIsRead(chatId);
                            }
                        });
                    } else {
                        chatService.getNewChat(chatId, function (res) {
                            $timeout(function () {
                                chatService.addChat(res.Data);
                                var chat = chatService.getChat(chatId);
                                if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                                    frameService.newMsgDing();
                                }
                                changeFrameIcon();
                                if (chat.MsgTimestamp <= msg.Timestamp) {
                                    chat.ActiveTimestamp = msg.Timestamp;
                                    chat.MsgContent = _msg.content;
                                    chat.MsgSenderId = msg.SenderId;
                                    chat.MsgType = _msg.msgType;
                                    chat.MsgTimestamp = msg.Timestamp;
                                    chat._senderName = sender;
                                    chat.LastMsgId = msgId;
                                }
                                $scope.chatList = chatService.handlerChatList($scope.chatList);
                            })
                        })
                    }
                }
                if (nType == 7) {
                    frameService.notice({
                        msg: msg,
                        timestamp: util.getNow(),
                        frameId: 'previewImg',
                        action: 'withDraw'
                    }, function (res) {
                    })
                    if (chatService.isExist(chatId)) {
                        $timeout(function () {
                            if (contentJson.messageid == chat.LastMsgId) {
                                if (chat.MsgTimestamp <= msg.Timestamp) {
                                    chat.MsgContent = _msg.content;
                                    chat.MsgTimestamp = msg.Timestamp;
                                    chat.ActiveTimestamp = msg.Timestamp;
                                    chat.MsgType = _msg.msgType;
                                    chat.MsgStatus = 1;
                                }
                            }
                            if (chat.ReadTimestamp < msg.Timestamp) {
                                chat.UnreadMsgCount = Math.max(0, chat.UnreadMsgCount - 1);
                            }
                        })
                    }
                }
                // 新增 视频会议信息进入更新左侧列表 消息通知
                if (nType == 10) {
                //特殊处理  - 发送人等于自己的消息 - 其他端口通知本端已经 成功接听进入视频会议房间 本端禁止重复接听
                if(  _msg.sender.Id == webConfig.getUser().Id && _msg.msgObj && _msg.msgObj.n_TYPE== 10 && _msg.msgObj.voiceMeetingType == "answered"){
                    
                    if( $(document.getElementsByClassName(_msg.msgObj.voiceRoomKey + '_btn')).length>0 ){
                        $(document.getElementsByClassName(_msg.msgObj.voiceRoomKey + '_btn')).each(function () {
                            // 替换标签自定义 data 消息类型
                            $(this).attr('data-voicemeetingtype',_msg.msgObj.voiceMeetingType);
                        });
                    }
                    
                    return;
                }
                    // 左侧栏  消息内容调整
                    // if(_msg.msgObj && _msg.msgObj.n_TYPE== 10){
                    //     if( _msg.msgObj.voiceMeetingType == "invite"){ 
                    //         _msg.msgObj.message = '发起了视频会议邀请';
                    //     }
                    //     if( _msg.msgObj.voiceMeetingType == "refuse"){ 
                    //        if( _msg.sender.Id != $scope.user.Id){
                    //         _msg.msgObj.message = _msg.msgObj.message == '' ? '拒绝了您的邀请：拒绝视频邀请':'现在不能加入您的会议：他正在另一个会议中';
                    //        }else{
                    //         _msg.msgObj.message = _msg.msgObj.message == '' ? '已拒绝':'当前正在通话：已拒绝' + msg.sender.Name + '的会议邀请';
                    //        }
                    //     }
                    //     if( _msg.msgObj.voiceMeetingType == "busy"){ 
                    //         _msg.msgObj.message = '正在会议中';
                    //     }
                    //     if( _msg.msgObj.voiceMeetingType == "destroy"){
                    //         if( rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == _msg.msgObj.voiceRoomKey){
                    //             _msg.msgObj.message = '已结束了视频会议';
                    //         }else{
                    //             _msg.msgObj.message = '已取消了视频会议';
                    //         }
                    //     }
                    //     _msg.content = JSON.stringify(_msg.msgObj);
                    //  }
                    $timeout(function () {
                        var chat = chatService.getChat(chatId);
                        if (chatService.isExist(chatId)) {
                            $timeout(function () {
                                if (chat.MsgTimestamp <= msg.Timestamp) {
                                    chat.MsgContent = _msg.content;
                                    chat.MsgType = _msg.msgType;
                                    chat.MsgTimestamp = msg.Timestamp;
                                    chat.MsgSenderId = msg.SenderId;
                                    chat.ActiveTimestamp = msg.Timestamp;
                                    chat.MsgSenderName = sender;
                                    chat._senderName = sender;
                                    chat.LastMsgId = msgId;
                                    chat.MsgStatus = 1;
                                }
                                $scope.chatList = chatService.handlerChatList($scope.chatList);
                                changeFrameIcon();
                                if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                                    frameService.newMsgDing();
                                }
                                if ($scope.chatData.currentChat != chatId) {
                                    if (!isSender) {
                                        if (chat.UnreadMsgCount == 0) {
                                            chat.firstUnReadId = msg.Id;
                                        }
                                        chat.UnreadMsgCount = chat.UnreadMsgCount + 1;
                                    }
                                } else {
                                    chatService.setIsRead(chatId);
                                }
                            });
                        } else {
                            chatService.getNewChat(chatId, function (res) {
                                $timeout(function () {
                                    chatService.addChat(res.Data);
                                    var chat = chatService.getChat(chatId);
                                    if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                                        frameService.newMsgDing();
                                    }
                                    changeFrameIcon();
                                    if (chat.MsgTimestamp <= msg.Timestamp) {
                                        chat.ActiveTimestamp = msg.Timestamp;
                                        chat.MsgContent = _msg.content;
                                        chat.MsgSenderId = msg.SenderId;
                                        chat.MsgType = _msg.msgType;
                                        chat.MsgTimestamp = msg.Timestamp;
                                        chat.MsgSenderName = sender;
                                        chat._senderName = sender;
                                        chat.LastMsgId = msgId;
                                    }
                                    $scope.chatList = chatService.handlerChatList($scope.chatList);
                                })
                            })
                        }
                    });
                    return;
                }
                return;
            } else {
                // 老代码
                // if (nType == 10) {
                //     $timeout(function () {
                //         var chat = chatService.getChat(chatId);
                //         if (chatService.isExist(chatId)) {
                //             $timeout(function () {
                //                 if (chat.MsgTimestamp <= msg.Timestamp) {
                //                     chat.MsgContent = _msg.content;
                //                     chat.MsgType = _msg.msgType;
                //                     chat.MsgTimestamp = msg.Timestamp;
                //                     chat.MsgSenderId = msg.SenderId;
                //                     chat.ActiveTimestamp = msg.Timestamp;
                //                     chat._senderName = sender;
                //                     chat.LastMsgId = msgId;
                //                     chat.MsgStatus = 1;
                //                 }
                //                 $scope.chatList = chatService.handlerChatList($scope.chatList);
                //                 changeFrameIcon();
                //                 if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                //                     frameService.newMsgDing();
                //                 }
                //                 if ($scope.chatData.currentChat != chatId) {
                //                     if (!isSender) {
                //                         if (chat.UnreadMsgCount == 0) {
                //                             chat.firstUnReadId = msg.Id;
                //                         }
                //                         chat.UnreadMsgCount = chat.UnreadMsgCount + 1;
                //                     }
                //                 } else {
                //                     chatService.setIsRead(chatId);
                //                 }
                //             });
                //         } else {
                //             chatService.getNewChat(chatId, function (res) {
                //                 $timeout(function () {
                //                     chatService.addChat(res.Data);
                //                     var chat = chatService.getChat(chatId);
                //                     if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                //                         frameService.newMsgDing();
                //                     }
                //                     changeFrameIcon();
                //                     if (chat.MsgTimestamp <= msg.Timestamp) {
                //                         chat.ActiveTimestamp = msg.Timestamp;
                //                         chat.MsgContent = _msg.content;
                //                         chat.MsgSenderId = msg.SenderId;
                //                         chat.MsgType = _msg.msgType;
                //                         chat.MsgTimestamp = msg.Timestamp;
                //                         chat._senderName = sender;
                //                         chat.LastMsgId = msgId;
                //                     }
                //                     $scope.chatList = chatService.handlerChatList($scope.chatList);
                //                 })
                //             })
                //         }
                //     });
                //     return;
                // }
                if (nType == 100 && contentJson.action == 19) {
                    var currentUser = webConfig.getUser();
                    var targetUser = contentJson.targetUsers[0];
                    if (targetUser.Id == msg.SenderId && msg.SenderId == currentUser.Id) {
                        return;
                    }
                }
                if (chatService.isExist(chatId)) {
                    $timeout(function () {
                        var chat = chatService.getChat(chatId);
                        if (chat.MsgTimestamp <= msg.Timestamp) {
                            chat.MsgContent = _msg.content;
                            chat.MsgType = msg.Type;
                            chat.MsgTimestamp = msg.Timestamp;
                            chat.ActiveTimestamp = util.getNow();
                            chat.MsgSenderName = sender;
                            chat._senderName = sender;
                            chat.MsgSenderId = msg.SenderId;
                            chat.LastMsgId = msgId;
                        }
                        chat.MsgStatus = 1;
                        $scope.chatList = chatService.handlerChatList($scope.chatList);
                        if (nType == 9 && contentJson.type == 0) {
                            if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                                frameService.newMsgDing();
                            }
                            if ($scope.chatData.currentChat == chatId) {
                                chat.ReadTimestamp = msg.Timestamp;
                                chatService.setIsRead(chatId, function (res) {
                                    if (res.Flag == 0) {
                                        // chat.UnreadMsgCount = 0;
                                    }
                                })
                            } else {
                                if (!isSender) {
                                    if (chat.UnreadMsgCount == 0) {
                                        chat.firstUnReadId = msg.Id;
                                    }
                                    nType != 100 && (chat.UnreadMsgCount = chat.UnreadMsgCount + 1);
                                }
                            }
                        } else {
                            if ($scope.chatData.currentChat == chatId) {
                                chat.ReadTimestamp = msg.Timestamp;
                                chatService.setIsRead(chatId, function (res) {
                                    if (res.Flag == 0) {
                                        // chat.UnreadMsgCount = 0;
                                    }
                                })
                            } else {
                                if (!isSender) {
                                    if (chat.UnreadMsgCount == 0) {
                                        chat.firstUnReadId = msg.Id;
                                    }
                                    nType != 100 && (chat.UnreadMsgCount = chat.UnreadMsgCount + 1);
                                }
                            }
                        }
                        changeFrameIcon();
                    });
                    return;
                }
            }
        }

        function changeFrameIcon() {
            if ($scope.userStatus.online) {
                var isBlocked = chatService.isBlockedChat(chatId);
                // 未禁止消息提醒则根据窗体状态以及当前聊天判断是否闪烁
                if (isBlocked === 0) {
                    if ($scope.chatData.currentChat == chatId) {
                        if (frameStatus == 0) { // 托盘状态时闪动
                            frameService.twinkle();
                        } else if (frameStatus == 2) {// 未激活状态托盘不闪，只任务栏黄色闪动
                            // 任务栏黄色闪动方法
                            frameService.flash();
                        }
                    } else {
                        if (frameStatus == 0) { // 托盘状态时闪动
                            frameService.twinkle();
                        } else if (frameStatus == 2) {// 未激活状态托盘闪动，任务栏黄色闪动
                            frameService.twinkle();
                            // 任务栏黄色闪动方法
                            frameService.flash();
                        }
                    }
                }
            }
        }
        if (chatService.isExist(chatId)) {
            $timeout(function () {
                var chat = chatService.getChat(chatId);
                chat.ActiveTimestamp = util.getNow();
                if (chat.MsgTimestamp <= msg.Timestamp) {
                    chat.MsgTimestamp = msg.Timestamp;
                    chat.MsgSenderId = msg.SenderId;
                    chat.MsgStatus = 1;
                    chat.MsgType = msg.Type;
                    chat._senderName = sender;
                    chat.LastMsgId = msgId;
                    changeChatMsgContent(chat, msg, sender);
                }
                if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                    frameService.newMsgDing();
                }
                if ($scope.chatData.currentChat == chatId) {
                    chat.ReadTimestamp = msg.Timestamp;
                    chatService.setIsRead(chatId, function (res) {
                        if (res.Flag == 0) {
                            // chat.UnreadMsgCount = 0;
                        }
                    })
                } else {
                    if (!isSender) {
                        if (chat.UnreadMsgCount == 0) {
                            chat.firstUnReadId = msg.Id;
                        }
                        chat.UnreadMsgCount = chat.UnreadMsgCount + 1;
                    }
                    signAtMsg();
                }
                $scope.chatList = chatService.handlerChatList($scope.chatList);
                changeFrameIcon();
            })
        } else {
            // 获取新聊天
            chatService.getNewChat(chatId, function (res) {
                chatService.addChat(res.Data);
                var chat = chatService.getChat(chatId);
                if (!isSender && !chatService.isBlockedChat(chatId) && $scope.frame.status != 1) {
                    frameService.newMsgDing();
                }
                changeChatMsgContent(chat, msg, sender);
                changeFrameIcon();
                chat.MsgSenderName = sender;
                chat._senderName = sender;
                chat.LastMsgId = msgId;
                signAtMsg();
                $timeout(function () {
                    $scope.chatList = chatService.handlerChatList($scope.chatList);
                })
                $rootScope.$broadcast('chatInitSuccess', chatService.getChat(res.Data.Id));
                // 如果是创建群聊消息，并且发送者是自己，并且是在本客户端操作的，则在获取群聊后自动定位到群聊
                if (_msg.type == webConfig.MSG_SERVICE_TYPE) {
                    var contentJson = angular.fromJson(_msg.content);
                    var nType = contentJson.n_TYPE;
                    if (nType == 100 && contentJson.action == 17 && isSender && $scope.creating[chatId]) {
                        delete $scope.creating[chatId];
                        var chat = chatService.getChat(chatId);
                        chat.ActiveTimestamp = util.getNow();
                        $timeout(function () {
                            $scope.creating.status = 0;
                            $scope.chatData.currentChat = chatId;
                            $scope.chatList = chatService.handlerChatList($scope.chatList);
                            $scope.view.currentView = 'chat';
                        })
                    }
                }
            })
        }
        function signAtMsg() {
            var name = util.getAtUserName(_msg.content);
            var chat = chatService.getChat(chatId);
            if (name && $scope.user.Name == name) {
                chat.AtMeTimestamp = _msg.timeStamp;
                chatService.setAtMsgTime(chatId, _msg.timeStamp);
            }
        }
    }

    $scope.$on('chatWith', function (e, chatId) {
        if (chatService.isExist(chatId)) {
            $scope.chatWith(chatId);
            var chat = chatService.getChat(chatId);
            chat.ActiveTimestamp = util.getNow();
            $timeout(function () {
                // chat.UnreadMsgCount = 0;
                // chat.AtMeTimestamp = 0;
                $scope.view.broadMsg = '';
                $scope.view.currentView = 'chat';
                $scope.chatData.currentChat = chatId;
                $scope.chatList = chatService.handlerChatList($scope.chatList);
            })
        } else {
            chatService.getNewChat(chatId, function (res) {
                if (res.Data) {
                    chatService.addChat(res.Data);
                    var chat = chatService.getChat(chatId);
                    chat.ActiveTimestamp = util.getNow();
                    $timeout(function () {
                        $scope.creating.status = 0;
                        $scope.chatData.currentChat = chatId;
                        $scope.chatList = chatService.handlerChatList($scope.chatList);
                        $scope.view.currentView = 'chat';
                    })
                } else {
                    if (chatService.isExist(chatId)) {
                        var chat = chatService.getChat(chatId);
                        chat.ActiveTimestamp = util.getNow();
                        $timeout(function () {
                            $scope.creating.status = 0;
                            $scope.chatData.currentChat = chatId;
                            $scope.chatList = chatService.handlerChatList($scope.chatList);
                            $scope.view.currentView = 'chat';
                        })
                    }
                }
            })
        }
    })

    $scope.$on('updateChatReadTime', function (e, res) {
        if (res.Flag == 0) {
            var chatId = res.Data.Id;
            if (chatService.isExist(chatId)) {
                var chat = chatService.getChat(chatId);
                $timeout(function () {
                    chat.UnreadMsgCount = res.Data.UnreadMsgCount;
                })
            } else {
                // 获取新聊天
                // chatService.getNewChat(chatId,function(res){
                // chatService.addChat(res.Data);
                // var chat = chatService.getChat(chatId);
                // $timeout(function(){
                // chat.UnreadMsgCount = res.Data.UnreadMsgCount;
                // })
                // })
            }
        }
    });
    // 双击托盘时，直接定位到最后一条消息的chat，并且聊天列表滚动到顶部 -- 后商定不用定位到聊天
    $scope.$on('wakedByTray', function (e, hasNewMsg) {
        $('#chat_list').scrollTop(0);
        frameService.stopTwinkle();
        // return;
        if (hasNewMsg) {
            var list = [];
            for (var i = 0; i < $scope.chatList.length; i++) {
                if (!$scope.chatList[i].Undisturbed) {
                    list.push({
                        chatId: $scope.chatList[i].Id,
                        MsgTimestamp: $scope.chatList[i].MsgTimestamp
                    })
                }
            }
            list.sort(function (v1, v2) {
                return v1.MsgTimestamp > v2.MsgTimestamp ? -1 : 1;
            })
            var first = list[0];
            if (first) {
                $timeout(function () {
                    $scope.chatWith(first.chatId);
                    $('#chat_list').scrollTop(0);
                })
            }
        }
    });
    // 激活窗口时，直接停止闪动
    $scope.$on('activeWindow', function (e) {
        frameService.stopTwinkle();
    });

    // $scope.$on('deleteChat',function(ev,chatId){
    // $timeout(function(){
    // var chat = chatService.getChat(chatId);
    // var unread = chat.unread;
    // $scope.totalUnreadNum = Math.max(0,$scope.totalUnreadNum - unread);
    // });
    // })
    $scope.$on('deleteChat', function (ev, chatId, type) {
        $timeout(function () {
            chatService.deleteChat([chatId], type);
            chatService.removeChat(chatId);
        });
    })

    $scope.$on('setChatStatus', function (ev, idList) {
        $timeout(function () {
            chatService.handlerChatList($scope.chatList);
        })
    })

    $scope.$on('cancelChatStatus', function (ev, type, idList) {
        $timeout(function () {
            chatService.handlerChatList($scope.chatList);
        })
    })


    $scope.$on('chatUpdated', function (ev, res) {
        var data = res.Data;
        var chatId = data.Id;
        var chat = chatService.getChat(chatId);
        if (chat) {
            $timeout(function () {
                chat.Avatar = data.Avatar + '?_=' + new Date().getTime();
            })
        } else {
            chatService.setChatAvatar(chatId, data.Avatar);
        }
    })

    $scope.$on('changeGroupNameSuccess', function (ev, chatId, name) {
        if (chatService.isExist(chatId)) {
            var chat = chatService.getChat(chatId);
            $timeout(function () {
                chat.Name = name;
            })
        }
    })

    $scope.$on('groupUpdate', function (ev, res) {
        var newData = res.Data;
        var chatId = newData.Id;
        if (newData.SDKAction == 17 && $scope.creating[chatId]) {
            $rootScope.$broadcast('chatWith', chatId);
        }
        if (!chatService.isExist(chatId)) return;
        var chat = chatService.getChat(chatId);
        $timeout(function () {
            chat.Avatar = newData.Avatar + '?_=' + new Date().getTime();
            chat.Name = newData.Name;
            chat.ShowName = newData.ShowName;
            chat.MemberCount = newData.MemberCount;
        })
    })
}]);

controllers.controller('messageController', ['$stateParams', '$scope', 'empService', 'chatService', 'domain', 'util', '$timeout', 'pops', 'concatService', 'webConfig', 'servers', '$rootScope', '$compile', 'langPack', 'socketConnect', 'ajaxService', '$templateCache', '$filter', 'frameService', '$interval', 'rtcRoomObj','getChatIdInfo','getChatIdObj', function ($params, $scope, empService, chatService, domain, util, $timeout, pops, concatService, webConfig, servers, $rootScope, $compile, langPack, socketConnect, ajaxService, $templateCache, $filter, frameService, $interval, rtcRoomObj,getChatIdInfo,getChatIdObj) {
    var msgListWrap = {
        length: 0
    };
    $scope.loading = false;
    var ele = angular.element;
    var timer;
    var msgWraper;
    var prevShowMsgScope = {}; // 记录上一次需要显示聊天时间的消息scope
    var prevShowMsgTimeStart = {}; // 记录上一次显示聊天时间的下一条消息的时间
    var page = 9, pageSize = chatService.count;
    var MAX_MESSAGE_LIST_WRAP = 20;
    var MAX_MSG_LENGTH = 500;
    var startRecordNewMsgHeight = 400;
    $scope.newMsgId = '';
    $scope.newMsgCount = 0;
    $scope.startRecordNewMsgId = false;
    $scope.unreadCount = 0;
    $scope.isNewChat = false;
    $scope.currentChatType = undefined;
    $scope.lockScroll = false;
    $scope.$watch('chatData.currentChat', function (v, old) {
        if (!v) return;
        if ($scope.showing && $scope.openingDialogId) {
            pops.close($scope.openingDialogId);
            $scope.openingDialogId = '';
        }
        $scope.newMsgId = '';
        $scope.startRecordNewMsgId = false;
        $scope.newMsgCount = 0;
        $scope.unreadCount = 0;
        $scope.isNewChat = false;
        $scope.lockScroll = false;
        $scope.showing = false;
        $scope.concat = chatService.getChat(v);
        $scope.isGroup = $scope.concat.isGroup;
        if (util.isBroad(v)) {
            $scope.currentChatType = 'b';
        } else if (util.isService(v)) {
            $scope.currentChatType = 's';
        } else {
            $scope.currentChatType = undefined;
        }
        var chat = chatService.getChat(v);
        $timeout(function () {
            $scope.unreadCount = chat.UnreadMsgCount;
            chat.UnreadMsgCount = 0;
            chat.AtMeTimestamp = 0;
        })

        prevShowMsgTimeStart[v] = prevShowMsgTimeStart[v] || chat.MsgTimestamp || 0;
        $scope.chat = chatService.getChat(v);
        var id = 'msgList_' + v;
        var oldId = 'msgList_' + old;
        // if(old && msgListWrap[oldId]){
        // msgListWrap[oldId].hide();
        // }
        if (!msgListWrap[id]) {
            $scope.isNewChat = true;
            var _scope = $scope.$new();
            _scope.chatId = v;
            msgWraper = $compile('<div context-menu-hepler menu-data="{{chatId}}" menu-type="chat_wrap" class="msg_list" copy-msg chatId="{{chatId}}" ng-class="{no_select:chatData.currentChat != chatId}" ng-style="{display:chatData.currentChat == chatId?\'block\':\'none\',zIndex:chatData.currentChat == chatId ? 2 : 1}"></div>')(_scope);
            msgWraper.attr('id', id);
            msgListWrap[id] = msgWraper;
            msgListWrap.length++;
            $('.msg_list_wrap').append(msgWraper);
            msgWraper.bind('scroll', function () {
                var dom = this;
                $timeout(function () {
                    var scrollHeight = dom.scrollHeight;
                    var scrollTop = dom.scrollTop;
                    var clientHeight = dom.clientHeight;
                    if (scrollHeight - scrollTop - clientHeight > startRecordNewMsgHeight) {
                        $scope.startRecordNewMsgId = true;
                    } else {
                        $scope.startRecordNewMsgId = false;
                    }
                    if (scrollHeight - scrollTop - clientHeight == 0) {
                        $scope.startRecordNewMsgId = false;
                        $scope.newMsgId = '';
                        $scope.newMsgCount = 0;
                    }
                    checkFirstUnreadMsgIsShowing();
                    // if($scope.unreadCount){
                    // if($(dom).find('.msg').size() >= $scope.unreadCount){
                    // $timeout(function(){
                    // $scope.unreadCount = 0;
                    // $scope.isNewChat = false;
                    // })
                    // }
                    // }
                })
                if (this.scrollTop == 0 && !$scope.lockScroll && (this.scrollHeight - this.scrollTop > 0)) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        getMoreMsg(true, msgWraper);
                    }, 50);
                }
            })
            msgWraper.html('');
            $timeout(function () {
                $scope.loading = false;
                v && init();
            })
        } else {
            $scope.isNewChat = false;
            msgWraper = msgListWrap[id];
            setTimeout(function () {
                if (msgWraper.find('.msg').size() >= page * pageSize) {
                    $scope.lockScroll = true;
                    var loadMore;
                    if (msgWraper.find('.load_more').size()) {
                        loadMore = msgWraper.find('.load_more');
                    } else {
                        loadMore = '<p class="load_more" style="text-align:center;padding-bottom:10px;">' + langPack.getKey('loadMoreMsg') + '，<a href="javascript:;" ng-click="showHistory()">' + langPack.getKey('openRecords') + '</a></p>';
                        loadMore = $compile(loadMore)($scope);
                    }
                    msgWraper.prepend(loadMore);
                }
                msgWraper.find('.msg').each(function () {
                    var time = parseInt($(this).attr('time'));
                    var str = $filter('msgDetailTimeFormat')(time);
                    $(this).find('.msg_time span').html(str);
                })
                msgWraper.show();
                msgWraper.scrollTop(msgWraper[0].scrollHeight);
                checkFirstUnreadMsgIsShowing();
            })
        }

        if (old) {
            var oldChat = chatService.getChat(old);
            var oldWrap = document.getElementById('msgList_' + old);
            var msgs = $(oldWrap).find('.msg');
            var lastMsgId = msgs.last().parent().attr('id');
            oldChat.LastMsgId = lastMsgId;
            if ($(oldWrap).find('.msg').size() > MAX_MSG_LENGTH) {
                var deleteIdx = $(oldWrap).find('.msg').size() - MAX_MSG_LENGTH;
                for (var i = 0; i < deleteIdx; i++) {
                    $(oldWrap).find('.msg').eq(i).parent().remove();
                }
            }
        }
        if (msgListWrap.length > MAX_MESSAGE_LIST_WRAP) {
            var first = $('.msg_list').eq(1);
            var firstId = first.attr('id');
            var chatId = first.attr('chatid');
            first.html('');
            first.remove();
            delete msgListWrap[firstId];
            msgListWrap.length = MAX_MESSAGE_LIST_WRAP;
            chatService.clearLastMsgTime(chatId);
            chatService.clearCacheData(chatId);
        }
    })
    $rootScope.$on('frameStatusChangeCallBack', function (e, status) {
        if (status == 1) {
            var chatId = $scope.chatData.currentChat;
            if (chatId) {
                var msgWraper = msgListWrap['msgList_' + chatId];
                if (msgWraper) {
                    msgWraper.find('.msg').each(function () {
                        var time = parseInt($(this).attr('time'));
                        var str = $filter('msgDetailTimeFormat')(time);
                        $(this).find('.msg_time span').html(str);
                    })
                }
            }
        }
    });
    function checkFirstUnreadMsgIsShowing() {
        var chatId = $scope.chatData.currentChat;
        var chat = chatService.getChat(chatId);
        if ($scope.unreadCount && chat.firstUnReadId) {
            var id = 'msgList_' + chatId;
            var msgWraper = document.getElementById(id);
            var firstUnreadMsgDom = document.getElementById(chat.firstUnReadId);
            if (firstUnreadMsgDom) {
                var offsetTop = firstUnreadMsgDom.offsetTop;
                if (offsetTop >= msgWraper.scrollTop) {
                    $timeout(function () {
                        $scope.unreadCount = 0;
                        chat.firstUnReadId = '';
                    })
                }
            }
        }
    }

    $scope.loadMoreUnreadMsg = function () {
        // $timeout(function(){
        // $scope.unreadCount = 0;
        // $scope.isNewChat = false;
        // })
        var chat = chatService.getChat($scope.chatData.currentChat);
        if ($scope.isNewChat) {
            var total = $scope.unreadCount - chatService.count;
            var getOneTime = 50;
            if (total > 0) { // 如果大于20条
                var count = Math.min(getOneTime, total);
                clickLoadMore(count);
                function clickLoadMore(_count) {
                    getMoreMsg(true, undefined, false, _count, function () {
                        var wrap = document.getElementById('msgList_' + $scope.chatData.currentChat);
                        $(wrap).scrollTop(10);
                        if (total - _count <= 0) {
                            $timeout(function () {
                                $scope.unreadCount = 0;
                                chat.firstUnReadId = '';
                                $scope.isNewChat = false;
                                $scope.loading = false;
                            })
                        } else {
                            total = total - _count;
                            clickLoadMore(Math.min(getOneTime, total));
                        }
                    });
                }
            } else {
                if ($scope.isNewChat && $scope.unreadCount <= chatService.count) {
                    var wrap = document.getElementById('msgList_' + $scope.chatData.currentChat);
                    var msgs = $(wrap).find('.msg');
                    // 未读数小于20条，并且渲染出的消息数大于未读数，则定位到第chatService.count - $scope.unreadCount 条
                    if (msgs.size() >= chatService.count) {
                        scrollToMsgByIdx($scope.chatData.currentChat, chatService.count - $scope.unreadCount);
                    } else {
                        scrollToMsgByIdx($scope.chatData.currentChat, 0); // 渲染出的消息数不满20条，则直接定位到第一条
                    }
                    $scope.isNewChat = false;
                    $scope.unreadCount = 0;
                    chat.firstUnReadId = '';
                }
            }
        } else {

            var wrap = document.getElementById('msgList_' + $scope.chatData.currentChat);
            var firstUnReadId = chat.firstUnReadId;
            if (firstUnReadId) {
                var firstUnMsgDom = document.getElementById(firstUnReadId);
                if (firstUnMsgDom) {
                    $(wrap).scrollTop(firstUnMsgDom.offsetTop);
                }
            }
            $timeout(function () {
                $scope.unreadCount = 0;
                chat.firstUnReadId = '';
            })
        }
    }
    $scope.scrollToNewMsg = function () {
        var msgDom = document.getElementById($scope.newMsgId);
        var msgWraper = msgListWrap['msgList_' + $scope.chatData.currentChat];
        $(msgWraper).scrollTop(msgDom.offsetTop);
        $timeout(function () {
            $scope.newMsgId = '';
            $scope.newMsgCount = 0;
        })
    }
    $scope.getBottom = function () {
        var editorHeight = parseInt($('.msg_editor').css('height'));
        return $scope.record.status != 0 ? editorHeight + 28 : editorHeight;
    }
    $scope.$on('ngRepeatFinished', function () {
        msgWraper.scrollTop(msgWraper[0].scrollHeight);
    })
    if ($scope.chatData.currentChat) {
        init();
    }
    var lastestShowMsgTime = {}; // 记录最后一条消息时间，主要用于在接收到消息的时候判断是否需要显示时间

    function getMoreMsg(resetScroll, msgWraper, isFirstTime, count, finalCallback) {

        var chatId = $scope.chatData.currentChat;
        if (!msgWraper) {
            msgWraper = msgListWrap['msgList_' + chatId];
        }
        $timeout(function () {
            $scope.loading = true;
        })

        chatService.getMsgList(chatId, function (res, source) {
            if (source.Flag == 1) {
                var dom = document.getElementById('msgList_' + chatId);
                $(dom).remove();
                delete msgListWrap['msgList_' + chatId];
                msgListWrap.length--;
                $scope.loading = false;
                return;
            }

            var list = res;
            var scopes = [];
            var html = '';
            // var reg = /^group_.*?_[\d.]+$/; // 确认根据 list[i].msgObj.chatRoomId 判断是否为群
            if (list.length) {
                for (var i = list.length - 1; i >= 0; i--) {
                    var _msgId = list[i].messageid;
                    var dom = document.getElementById('msg_' + _msgId);
                    // 消息id页面存在的 删除对应数据 
                    if ($(dom).size()) {
                        list.splice(i, 1);
                    }
                }
            }
            if (list.length) {

                if (lastestShowMsgTime[chatId] !== undefined) {
                    lastestShowMsgTime[chatId] = Math.max(list[0].timeStamp, lastestShowMsgTime[chatId]);
                } else {
                    lastestShowMsgTime[chatId] = list[0].timeStamp;
                }
                prevShowMsgTimeStart[chatId] = list[0].timeStamp;
            }
            function caclMsgHeight(wrap, callback) {
                // if(isFirstTime){
                // renderingMore =  true;
                // }
                $timeout(function () {
                    $scope.loading = false;
                })
                for (var i = 0; i < list.length; i++) {

                    var _scope = $scope.$new();

                    _scope._msg = list[i];
                    if (prevShowMsgScope[chatId]) {
                        if (prevShowMsgTimeStart[chatId] - list[i].timeStamp > webConfig.SHOW_MSGTIME_DIS) {
                            prevShowMsgScope[chatId]._msg.showTime = true;
                            prevShowMsgTimeStart[chatId] = list[i].timeStamp;
                        } else {
                            // prevShowMsgScope[chatId]._msg.showTime = false;
                        }
                        if (i == 0) {
                            try {
                                prevShowMsgScope[chatId].$digest();
                            } catch (e) { }
                            prevShowMsgScope[chatId].$destroy();
                        }
                        prevShowMsgScope[chatId] = _scope;
                    } else {
                        prevShowMsgScope[chatId] = _scope;
                    }
                    if (i == list.length - 1) {
                        prevShowMsgScope[chatId] = _scope;
                        prevShowMsgScope[chatId]._msg.showTime = true;
                    }
                    var _ele = ele('<div id="{{_msg.messageid}}" class="msg-item"></div>');
                    var tpl = $templateCache.get('message.html');
                    _ele.html(tpl);
                    $compile(_ele)(_scope);
                    // wrap.prepend(_ele);
                    // try{
                    // _scope.$digest();
                    // }catch(e){}
                    scopes.push({
                        scope: _scope,
                        ele: _ele
                    });
                    _ele = null;
                }

                var idx = 0, len = scopes.length;
                var added = {};
                setTimeout(function () {
                    var frag = document.createDocumentFragment();
                    for (var i = 0; i < scopes.length; i++) {
                        frag.appendChild(scopes[i].ele[0]);
                    }
                    wrap.prepend(frag);
                    frag = null;
                    for (var i = 0; scopes && i < scopes.length; i++) {
                        changeMsgUI({
                            ResId: list[i].messageid,
                            Status: list[i].fileStatus,
                            FilePath: list[i].filePath
                        });
                        try {
                            scopes[i].scope.$digest();
                        } catch (e) { }
                        var fn = computeHeight(function (x, _idx, id, startTime) {
                            // var endTime = new Date();
                            // console.log('id:%s,花费:%s,',id,endTime - startTime);
                            if (added[_idx]) {
                                added[_idx] = Math.max(x, added[_idx]);
                                scopes[_idx].ele.attr('h_' + new Date().getTime(), x)
                            } else {
                                added[_idx] = x;
                                idx++;
                                scopes[_idx].ele.attr('h', x);
                            }
                            if (idx >= len) {
                                var h = 0;
                                for (var x in added) {
                                    h += added[x];
                                }
                                callback && callback(h);
                            }
                        }, scopes[i].scope._msg.messageid);
                        fn(scopes[i].ele, i);
                        fn = null;
                    }
                })
            }

            var wrap = resetScroll ? $('#cacl_msg_height') : msgWraper;
            var renderStartTime = new Date();
            caclMsgHeight(wrap, function (h) {
                if (resetScroll) {
                    if (msgWraper.scrollTop() == 0 || finalCallback) {
                        var frag = document.createDocumentFragment();
                        for (var i = 0; i < scopes.length; i++) {
                            frag.prepend(scopes[i].ele[0]);
                        }
                        msgWraper.prepend(frag);
                        // if(waitRender.length){
                        // renderReceiveMsg(waitRender);
                        // waitRender.length = 0;
                        // }
                        // renderingMore =  false;
                        frag = null;
                        msgWraper.scrollTop(h);
                        var renderEndTime = new Date();
                        console.log('全部渲染结束，开始时间:%s，结束时间:%s，花费：%s', renderStartTime.getTime(), renderEndTime.getTime(), renderEndTime - renderStartTime);
                    }
                    finalCallback && finalCallback();
                    checkFirstUnreadMsgIsShowing();
                    if (msgWraper.find('.msg').size() > page * pageSize && count === undefined) {
                        var loadMore;
                        if (msgWraper.find('.load_more').size()) {
                            loadMore = msgWraper.find('.load_more');
                        } else {
                            loadMore = '<p class="load_more" style="text-align:center;padding-bottom:10px;">' + langPack.getKey('loadMoreMsg') + '，<a href="javascript:;" ng-click="showHistory()">' + langPack.getKey('openRecords') + '</a></p>';
                            loadMore = $compile(loadMore)($scope);
                        }
                        msgWraper.prepend(loadMore);
                        $scope.lockScroll = true;
                        // msgWraper.unbind('scroll');
                        loadMore = null;
                    }
                } else {
                    scrollWrap(msgWraper);
                }
                for (var i = 0; i < scopes.length; i++) {
                    bindEvent(scopes[i].ele, list[i].messageid);
                    if (prevShowMsgScope[chatId]) {
                        if (prevShowMsgScope[chatId] != scopes[i].scope) {
                            scopes[i].scope.$destroy();
                            scopes[i].ele = null;
                            scopes[i].scope = null;
                        }
                    }
                }
                scopes = null;
                list = null;
            });
        }, isFirstTime, count || chatService.count);
    }
    function computeHeight(callback, id) {
        return function (ele, idx) {
            var start = new Date();
            if (ele.find('.load_img').size()) {
                if (ele.find('.load_img').attr('src')) {
                    if (ele.find('.load_img')[0].complete) {
                        callback(ele.height(), idx, id, start);
                    } else {
                        ele.find('.load_img').load(function () {
                            callback(ele.height(), idx, id, start);
                        }).on('error', function () {
                            if (this.getAttribute('loadfail') == '1') {
                                $(this).unbind('error');
                                return;
                            }
                            this.setAttribute('loadfail', 1);
                            this.src = webConfig.ERROR_IMAGE;
                            end = new Date();
                        })
                    }
                } else {
                    ele.find('.load_img').attr('src', webConfig.ERROR_IMAGE);
                    ele.find('.load_img').attr('loadfail', 1);
                    ele.find('.load_img').load(function () {
                        callback(ele.height(), idx, id, start);
                    })
                }
            } else {
                callback(ele.height(), idx, id, start);
            }
        }
    }
    function scrollWrap(wrap, ele, isSend) {
        wrap = $(wrap);
        var scrollHeigth = wrap[0].scrollHeight;
        var scrollTop = wrap[0].scrollTop;
        if (!isSend && $scope.startRecordNewMsgId) {
            return;
        }
        if (ele === true) {
            if (wrap.find('.load_img').size()) {
                wrap.find('.load_img').load(function () {
                    wrap.scrollTop(wrap[0].scrollHeight);
                }).error(function () {
                    wrap.scrollTop(wrap[0].scrollHeight);
                })
            } else {
                wrap.scrollTop(wrap[0].scrollHeight);
            }
        } else if (ele && ele.find('.load_img').size()) {
            ele.find('.load_img').load(function () {
                wrap.scrollTop(wrap[0].scrollHeight);
            }).error(function () {
                wrap.scrollTop(wrap[0].scrollHeight);
            })
            wrap.scrollTop(wrap[0].scrollHeight);
        } else {
            wrap.scrollTop(wrap[0].scrollHeight);
        }
    }
    function scrollToMsg(chatId, msgId) {
        var wrap = document.getElementById('msgList_' + chatId);
        var msgDom = document.getElementById(msgId);
        $(wrap).scrollTop(msgDom.offsetTop);
    }
    function scrollToMsgByIdx(chatId, idx) {
        var wrap = document.getElementById('msgList_' + chatId);
        var msgs = $(wrap).find('.msg');
        var msgDom;
        if (msgs.size() < idx) {
            msgDom = $(wrap).find('.msg')[0];
        } else {
            msgDom = $(wrap).find('.msg')[idx];
        }
        $(wrap).scrollTop(msgDom.offsetTop);
    }
    function init() {
        getMoreMsg(true, undefined, true);
    }
    $scope.messageClick = function (msgId) {
        console.log(msgId);
    }

    $scope.showChatInfo = function (e) {
        if ($scope.currentChatType == 'b') return;
        if ($scope.showing) {
            pops.closeAllPop();
            return;
        }
        $scope.showing = true;
        var chat = chatService.getChat($scope.chatData.currentChat);
        if (chat) {
            $scope.openingDialogId = pops.openDialog({
                isDialog: true,
                templateUrl: 'groupInfo.html',
                className: 'group_info_inner slide-down',
                container: $('#group_info_warp'),
                auto: true,
                data: {
                    chat: chat
                    // group : $scope.concat,
                    // isGroup : $scope.concat.isGroup,
                },
                controller: "groupInfoController"
            })
        }
        e.stopPropagation();
    }
    $scope.openFile = function () {
        console.log('openFile');
    }
    $scope.$on('groupInfoPopuClosed', function () {
        $scope.showing = false;
        $scope.openingDialogId = '';
    })

    var sendingMsg = {};
    var sendMsgSource = {};
    $scope.$on('msgSendResult', function (ev, res) {
        var msgId = res.Data.Id;
        var chatId = res.Data.ChatId;
        $timeout(function () {
            if (res.Data.Type == webConfig.MSG_TYPE_MAP[webConfig.MSG_SERVICE_TYPE]) {
                // var msgObj = angular.fromJson(res.Data.Content);
                // if(msgObj.type == 1){
                // var tempMsg = {};
                // tempMsg.msg = res.Data;
                // tempMsg.sender = {};
                // tempMsg.sender.Avatar = $scope.user.Avatar;
                // tempMsg.sender.Name = $scope.user.Name;
                // tempMsg.sender.Id = $scope.user.Id;
                // $rootScope.$broadcast('receiveMsgFromCef',{
                // Data : [tempMsg]
                // });
                // changeMsgUI({
                // Id : msgObj.msgId,
                // Status : 2
                // });
                // return;
                // }
            }
            if (res.Flag == 0 && (chatService.isSending(msgId) || chatService.isReSending(msgId))) {
                if (res.Data.Status == 1) {
                    if (sendingMsg[msgId]) {
                        sendingMsg[msgId].message.timestamp = res.Data.Timestamp;
                        sendingMsg[msgId].message.status = webConfig.MSG_SENDSUCCESS;
                        sendingMsg[msgId].message.fileUrl = res.Data.FileUrl;
                        if (res.Data.Type == 10) {
                            changeMsgUI(res.Data);
                        }
                        if (sendingMsg[msgId].scope) {
                            sendingMsg[msgId].scope._msg.fileUrl = res.Data.FileUrl;
                            sendingMsg[msgId].scope.$apply();
                            sendingMsg[msgId].scope.$destroy();
                        } else {
                            changeHistoryMsgUI(msgId, res.Data);
                            changeMsgUI(res.Data);
                        }
                        delete sendingMsg[msgId];
                        delete sendMsgSource[msgId];
                        var msgWraper = msgListWrap['msgList_' + $scope.chatData.currentChat];
                        if (msgWraper && res.Data.ChatId == $scope.chatData.currentChat) {
                            scrollWrap(msgWraper);
                        }
                    } else {
                        changeHistoryMsgUI(msgId, res.Data);
                        changeMsgUI(res.Data);
                    }
                } else {
                    if (sendingMsg[msgId]) {
                        sendingMsg[msgId].message.status = webConfig.MSG_SENDFAIL;
                        sendingMsg[msgId].scope.$apply();
                    } else {
                        changeHistoryMsgUI(msgId, res.Data);
                        changeMsgUI(res.Data);
                    }
                }
                chatService.deleteSending(msgId);
            }
        })
    })
    $scope.$on('messageSendFail', function (ev, msgId) {
        $timeout(function () {
            if (chatService.isSending(msgId) || chatService.isReSending(msgId)) {
                if (sendingMsg[msgId]) {
                    sendingMsg[msgId].message.status = webConfig.MSG_SENDFAIL;
                } else {
                    changeHistoryMsgUI(msgId, {
                        Status: 0
                    });
                }
            }
        });
    })

    $scope.resendMsg = function (msg) {
        var msgId;
        if (typeof msg === 'string') {
            msgId = msg;
        } else {
            msgId = msg.messageid;
        }
        if (sendMsgSource[msgId]) {
            $timeout(function () {
                sendingMsg[msgId].message.status = webConfig.MSG_SENDING;
            })
        }
        chatService.resendMsg(msgId, $scope.chatData.currentChat, function (res) { });
    }

    $scope.$on('sendingMsg', function (ev, msg, msgTime) {
        var user = webConfig.getUser();
        sendingMsg[msg.id] = {};
        sendMsgSource[msg.id] = msg;
        var message = {
            sender: user,
            chatId: msg.chatId,
            chatType: msg.chatType,
            type: webConfig.MSG_TYPE_ARR[msg.type],
            msgType: msg.type,
            content: msg.content,
            fileLength: msg.fileLength,
            filePath: msg.filePath,
            fileStatus: 0, // 文件状态 默认0(尚未请求文件服务器)，传输中 1，已取消 2，错误 3，成功 4，对方已下载 5，已过期 6
            fileUrl: '',
            messageid: msg.id,
            senderId: user.Id,
            status: webConfig.MSG_SENDING,
            timeStamp: msgTime,
            showTime: false,
            transProgess: 0, // 传输进度
            speed: 0
        }

        if (msg.type == 10) {
            message.msgObj = angular.fromJson(msg.content);
            if (message.msgObj.n_TYPE == 9) {
                message.onlineFiles = msg.onlineFiles;
                message.fileStatus = 0;
            }
        }
        sendingMsg[msg.id].message = message;
        // console.log(JSON.stringify(sendingMsg))
        renderMessage(message, true);

    });
    $scope.$on('changeFileMessageUploadProgess', function (e, res) {
        var msgId = res.ResId;
        // console.log(JSON.stringify(sendingMsg))
        if (sendingMsg[msgId]) {
            // console.log(res);
            var msg = sendingMsg[msgId];
            $timeout(function () {
                msg.message.fileStatus = res.Status;
                msg.message.speed = $filter('fileSizeFormat')(res.Kbps, 1);
                msg.message.transProgess = res.Percent;
                changeMsgUI(res, 1);
            })
        } else {
            changeMsgUI(res, 1);
        }
    })
    function changeMsgUI(res, isProgess) {
        var msgId = res.ResId || res.Id;
        var status = res.FileStatus !== undefined ? res.FileStatus : res.Status;
        // res.Status = status;
        var dom = document.getElementById('msg_' + msgId);
        var msgDom = $(dom);
        msgDom.find('.file_operate a').hide();
        msgDom.find('.file_status').hide();
        msgDom.find('.progess_bar').hide();
        msgDom.find('.trans_icon').hide();
        msgDom.find('.trans_icon').removeClass('trans_error');
        msgDom.find('.trans_icon').removeClass('trans_success');
        msgDom.find('.file_size').hide();
        var isSender = msgDom.hasClass('me');
        var isLargeFile = msgDom.find('.intranet').size() == 1;
        if (isSender) {
            msgDom.find('.receive_operate').hide();
            msgDom.find('.sender_operate').show().css('visibility', 'visible');
            if (status == 0) { // 当收到文件消息未保存文件就转发文件消息时，显示下载跟另存为按钮
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.download').show(); // 显示下载按钮
                msgDom.find('.save_as').show(); // 显示另存为按钮
                // msgDom.find('.trans_status').show().html(langPack.getKey('fileCacheDay'));// 显示文件暂存7天
                msgDom.find('.forward_file').show(); // 显示转发
                if (!isLargeFile) {
                    // msgDom.find('.trans_status').show().html(langPack.getKey('fileCacheDay'));// 显示文件暂存7天
                } else {
                    msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                    msgDom.find('.cancel_send').show();// 显示取消按钮
                }
            }
            if (status == 1) { // 传输中
                if (!isLargeFile) { // 是离线文件则更新发送方上传进度，是内网大文件不做任何反应
                    msgDom.find('.file_size').show();// 显示文件大小
                    msgDom.find('.progess_bar').show();// 显示传输进度
                    msgDom.find('.complete_bar').css('width', res.Percent + '%');
                    msgDom.find('.trans_speed').show().html($filter('fileSizeFormat')(res.Kbps, 1) + '/S');// 显示传输速度
                    if (res.Type == 1) {
                        msgDom.find('.cancel_download').show(); // 显示取消上传按钮
                    }
                    if (res.Type == 0) {
                        msgDom.find('.cancel_upload').show(); // 显示取消上传按钮
                    }
                } else {
                    msgDom.find('.file_size').show();// 显示文件大小
                    msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                    msgDom.find('.cancel_send').show();// 显示取消按钮
                }
            }
            if (status == 2) { // 取消传输/大文件取消
                if (!isLargeFile) {
                    msgDom.find('.re_upload').show();// 显示重新上传按钮
                    msgDom.find('.trans_status').show().html(langPack.getKey('cancelTrans'));// 文件状态显示传输已取消
                    msgDom.find('.file_size').hide(); // 隐藏文件大小
                    msgDom.find('.complete_bar').css('width', '0%'); // 上传进度归0
                } else {
                    if (!res.UserId) {
                        msgDom.find('.sender_operate').hide();
                        // msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                        msgDom.find('.file_size').show(); // 隐藏文件大小
                        msgDom.find('.trans_status').show().html(langPack.getKey('cancelLargeFile'));// 文件状态显示传输已取消
                    }
                }
            }
            if (status == 3) { // 传输失败
                msgDom.find('.file_size').hide(); // 隐藏文件大小
                if (!isLargeFile) {
                    msgDom.find('.trans_status').show().html(langPack.getKey('fileSendFail'));// 显示文件发送失败
                    msgDom.find('.trans_icon').show().addClass('trans_error'); // 显示传输错误图标
                    msgDom.find('.re_upload').show();// 显示重新上传按钮
                } else {
                    msgDom.find('.trans_status').show().html(langPack.getKey('fileSendFail'));// 显示文件发送失败
                    if (!res.UserId) {
                        msgDom.find('.sender_operate').hide();
                        msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                    } else {
                        if (res.UserId) {
                            msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                            msgDom.find('.cancel_send').show();// 显示取消按钮
                            msgDom.find('.sender_operate').show();
                        }
                    }
                }
            }
            if (status == 9) { // 发送方转发文件后，再下载失败的情况
                if (!isLargeFile) {
                    msgDom.find('.trans_status').show().html(langPack.getKey('downloadFail')); // 显示文件下载失败
                    msgDom.find('.re_download').show(); // 显示重新下载按钮
                    msgDom.find('.save_as').show(); // 显示另存为按钮
                }
            }
            if (status == 4) { // 上传成功 / 大文件接收方全部处于终态
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.open').show(); // 显示打开按钮
                msgDom.find('.open_dir').show(); // 显示打开文件夹按钮
                msgDom.find('.forward_file').show(); // 显示转发
                if (!isLargeFile) {
                    msgDom.find('.trans_status').show().html(langPack.getKey('fileCacheDay'));// 显示文件暂存7天
                } else {
                    if (isProgess) {
                        if (msgDom.find('.file_msg').attr('finished') == '1') {
                            msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                            msgDom.find('.cancel_send').hide();// 隐藏取消按钮
                        } else {
                            if (!res.UserId) {
                                msgDom.find('.file_msg').attr('finished', 1);
                                msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                                msgDom.find('.cancel_send').hide();// 隐藏取消按钮
                            } else {
                                msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                                msgDom.find('.cancel_send').show();// 隐藏取消按钮
                            }
                        }
                    } else {
                        msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                        msgDom.find('.cancel_send').hide();// 隐藏取消按钮
                    }
                }
            }
            if (status == 5) { // 对方已接收
                msgDom.find('.trans_icon').show().addClass('trans_success'); // 显示对方已接收图标
                msgDom.find('.trans_status').show().html(langPack.getKey('receiverDonwloaded'));// 显示对方已接收文字
                var path = msgDom.find('.file_msg').attr('path');
                if (path === '') {
                    msgDom.find('.file_size').show();// 显示文件大小
                    msgDom.find('.download').show(); // 显示下载按钮
                    msgDom.find('.save_as').show(); // 显示另存为按钮
                    msgDom.find('.forward_file').show(); // 显示转发
                } else {
                    msgDom.find('.file_size').show();// 显示文件大小
                    msgDom.find('.open').show(); // 显示打开按钮
                    msgDom.find('.open_dir').show(); // 显示打开文件夹按钮
                    msgDom.find('.forward_file').show(); // 显示转发
                }
            }
            if (status == 6) { // 文件已过期
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.trans_status').show().html(langPack.getKey('fileOutOfDay'));// 显示文件已过期
                msgDom.find('.open').show(); // 显示打开按钮
                msgDom.find('.open_dir').show(); // 显示打开文件夹按钮
            }
            if (status == 8) { // 大文件接收方取消
                msgDom.find('.file_size').show();// 显示文件大小
                if (!res.UserId || msgDom.find('.file_msg').attr('finished') == 1) {
                    msgDom.find('.file_msg').attr('finished', '1');
                    msgDom.find('.trans_status').show().html(langPack.getKey('receiveCancel'));// 显示取消发送
                    msgDom.find('.sender_operate').hide();
                } else {
                    if (res.UserId) {
                        msgDom.find('.receive_status').show();// 显示查看接收状态按钮
                        msgDom.find('.cancel_send').show();// 显示取消按钮
                        msgDom.find('.sender_operate').show();
                    }
                }
            }
        } else {
            msgDom.find('.sender_operate').hide();
            msgDom.find('.receive_operate').show().css('visibility', 'visible');
            if (res.NewFileName) {
                var fileNames = msgDom.find('.file_name').html();
                var _fileName = util.replaceMetaStr(res.OriginalFileName);
                var reg = new RegExp('\s*' + _fileName + '\s*');
                if (fileNames) {
                    fileNames = fileNames.replace(reg, res.NewFileName);
                    msgDom.find('.file_name').html(fileNames);
                    msgDom.find('.file_name').attr('title', fileNames);
                }
            }
            if (status == 0) {// 默认状态
                msgDom.find('.file_size').show();// 显示文件大小
                if (!isLargeFile) {
                    msgDom.find('.trans_status').show().html(langPack.getKey('fileCacheDay'));// 显示文件暂存7天
                }
                msgDom.find('.forward_file').show(); // 显示转发
                msgDom.find('.download').show(); // 显示下载按钮
                msgDom.find('.save_as').show(); // 显示另存为按钮
                // 大文件消息相关
                msgDom.find('.receive').show();
                msgDom.find('.reject').show();
            }
            if (status == 1) { // 传输中
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.progess_bar').show();// 显示传输进度

                if (!isLargeFile) {
                    msgDom.find('.cancel_download').show(); // 显示取消下载按钮
                    msgDom.find('.complete_bar').css('width', res.Percent + '%');
                    msgDom.find('.trans_speed').show().html($filter('fileSizeFormat')(res.Kbps, 1) + '/S');// 显示传输速度
                } else {
                    msgDom.find('.cancel_receive').show();
                    msgDom.find('.complete_bar').css('width', res.Percent + '%');
                    msgDom.find('.trans_speed').show().html($filter('fileSizeFormat')(res.Kbps, 1) + '/S');// 显示传输速度
                }
                // 大文件消息相关
                // msgDom.find('.receive').show();
                // msgDom.find('.reject').show();
            }
            if (status == 2) { // 传输取消 / 接收方取消接收
                msgDom.find('.file_size').show();// 显示文件大小
                // msgDom.find('.re_download').show(); // 显示重新下载按钮
                if (!isLargeFile) {
                    msgDom.find('.forward_file').show(); // 显示转发
                    msgDom.find('.download').show(); // 显示下载按钮
                    msgDom.find('.save_as').show(); // 显示另存为按钮
                    msgDom.find('.trans_status').show().html(langPack.getKey('cancelTrans'));// 显示传输已取消
                    msgDom.find('.complete_bar').css('width', '0%'); // 下载进度归0
                } else {
                    // msgDom.find('.receive').show();
                    msgDom.find('.trans_status').show().html(langPack.getKey('cancelReceive'));// 显示取消接收
                    msgDom.find('.receive_operate').hide();
                    // msgDom.find('.receive').html(langPack.getKey('stillReceive'));
                }
            }
            if (status == 3) { // 传输失败 / 大文件接收失败
                if (isLargeFile) {
                    msgDom.find('.receive_operate').hide();
                    msgDom.find('.trans_status').show().html(langPack.getKey('transFail'));// 显示传输失败
                } else {
                    msgDom.find('.trans_status').show().html(langPack.getKey('downloadFail'));// 显示传输失败
                    msgDom.find('.re_download').show(); // 显示重新下载按钮
                }
            }
            if (status == 9) { // 新加接收失败状态
                if (!isLargeFile) {
                    msgDom.find('.trans_status').show().html(langPack.getKey('downloadFail'));// 显示传输失败
                    msgDom.find('.re_download').show(); // 显示重新下载按钮
                }
            }
            if (status == 4 || status == 5) { //  传输成功
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.forward_file').show(); // 显示转发
                msgDom.find('.trans_status').show().html(langPack.getKey('downloaded'));// 显示接收成功
                if (!isLargeFile) {
                    msgDom.find('.open').show(); // 显示打开按钮
                    msgDom.find('.open_dir').show(); // 显示打开文件夹按钮
                } else {
                    var fileLength = msgDom.find('.file_msg').attr('fileLength');
                    if (fileLength == 1) {
                        msgDom.find('.open').show(); // 显示打开按钮
                    }
                    msgDom.find('.open_dir').show(); // 显示打开文件夹按钮
                }
            }

            if (status == 6) { // 文件过期
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.trans_status').show().html(langPack.getKey('fileOutOfDay'));// 显示文件已过期
                msgDom.find('.sender_operate').css('visibility', 'hidden'); // 隐藏所有操作按钮
            }
            if (status == 8) { // 大文件发送方取消
                // msgDom.find('.receive').show();
                // msgDom.find('.receive').html(langPack.getKey('stillReceive'));
                msgDom.find('.file_size').show();// 显示文件大小
                msgDom.find('.trans_status').show().html(langPack.getKey('senderCancel'));// 显示发送方已取消
                // msgDom.find('.save_as').show(); // 显示另存为按钮
                msgDom.find('.receive_operate').hide();
            }
        }
    }
    function changeHistoryMsgUI(msgId, res) {
        var dom = document.getElementById('msg_' + msgId);
        var msgDom = $(dom);
        msgDom.find('.sending').hide();
        msgDom.find('.resend').hide();
        msgDom.find('.sending').removeClass('ng-hide');
        msgDom.find('.resend').removeClass('ng-hide');
        if (res.Status != 1) {
            msgDom.find('.resend').show();
        }
        if (chatService.isReSending(msgId)) {
            var wrap = $('#msgList_' + res.ChatId);
            if (wrap.size()) {
                wrap.append(msgDom);
                if (res.Timestamp - prevShowMsgTimeStart[res.ChatId] > webConfig.SHOW_MSGTIME_DIS) {
                    prevShowMsgTimeStart[res.ChatId] = res.Timestamp;
                    msgDom.find('.msg_time  span').html($filter('msgDetailTimeFormat')(res.Timestamp));
                    wrap.find('.msg_time').show();
                }
            }
        }
    }
    // var renderingMore = false;
    // var waitRender = [];
    $scope.$on('receiveMsgFromCef', function (ev, res) {
        // if(renderingMore){
        // if(res.Data.length){
        // for(var i=0;i<res.Data.length;i++){
        // if(res.Data[i].msg.ChatId == $scope.chatData.currentChat){
        // waitRender.push(res.Data[i]); // 如果当前聊天列表消息还在渲染，则将新消息压入待渲染列表
        // }else{
        // onReceiveMsg(res.Data[i]); // 如果新消息不是当前打开的聊天的，则直接渲染
        // }
        // }
        // }
        // }else{
        // renderReceiveMsg(res.Data); // 如果当前聊天没有在渲染消息列表，则直接渲染消息
        // }
        renderReceiveMsg(res.Data);
    });
    function renderReceiveMsg(list) {
        for (var i = 0; i < list.length; i++) {
            if ($scope.startRecordNewMsgId && i == 0 && !$scope.newMsgId && list[i].msg.ChatId == $scope.chatData.currentChat && $scope.unreadCount == 0) {
                var msgId = list[i].msg.Id;
                $timeout(function () {
                    $scope.newMsgId = msgId;
                })
            }
            if (list[i].msg.ChatId == $scope.chatData.currentChat && $scope.startRecordNewMsgId && $scope.unreadCount == 0) {
                $scope.newMsgCount++;
            }
            onReceiveMsg(list[i]);
        }
    }
    function onReceiveMsg(res) {
        var currentUser = webConfig.getUser();
        var msg = chatService.cefMsgToFrontMsg(res);
        var chatId = msg.chatId;
        if (chatService.isExist(chatId)) {
            if (msg.type == webConfig.MSG_SERVICE_TYPE) {
                var contentJson = angular.fromJson(msg.content);
                var nType = contentJson.n_TYPE;
                if (nType == 5) return; // 过滤公司邀请消息
                // 0：系统分享，1 ： 广播   2：服务号   3：语音会议 4：添加好友 5:公司邀请 6:置顶/免打扰/添加常用联系人同步消息 7:消息撤回 8:离线文件接收回执)
                // 3,4,5,6暂时不做处理
                if (nType == 4 || nType == 6) {

                } else if (nType == 8) {
                    // 标识文件已接收
                    if (msg.senderId != currentUser.Id) {
                        changeMsgUI({
                            ResId: contentJson.strMsgId,
                            Status: 5
                        })
                    }
                } else if (nType == 7) {
                    // 消息撤回
                    var targetMessageId = msg.msgObj.messageid;
                    var _dom = document.getElementById('msg_' + targetMessageId);
                    var dom = $(_dom);
                    var showTime = dom.find('.msg_time ').is(':hidden');
                    msg.showTime = !showTime;
                    renderMessage(msg, false, function (ele) {
                        if (dom.size()) {
                            dom.after(ele);
                            dom.remove();
                        }
                    })
                } else if (nType == 9) {
                    if (contentJson.type == 0) {
                        renderMessage(msg);
                    } else {
                        return;
                    }
                } else {
                    renderMessage(msg);
                }
            } else {
                renderMessage(msg);
            }
        }
    }
   async function renderMessage(message, isSend, insertCallBack) {
        let userList = webConfig.getUser();
        if (message.type == "service" && message.msgObj.n_TYPE == 10) {
            if (message.msgObj.chatRoomId.indexOf('group_') >= 0) {
                message.chatId = message.msgObj.chatRoomId;
            }
        }
        var msgId = message.messageid; // 页面上已存在消息不添加至页面
        var dom = document.getElementById('msg_' + msgId);
        // chatService.getMsgList(message.chatId, function (res, source) {
        //     console.log(res)
        // },true,20)
        console.log(chatService.chatList);
        console.log(message);
        if ($(dom).size()) {
            return;
        }
        // 视频会议 - 接收+发送消息体+渲染UI 处理
        if(message.type == "service" && message.msgObj && message.msgObj.n_TYPE == 10  ){
            // 正在视频会议中 接收到其他会议邀请
            // if(message.senderId != userList.Id && rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid != message.msgObj.voiceRoomKey){
            //     message.msgObj.message = '当前正在通话 已拒绝' + message.sender.Name + '的会议邀请';
            //     // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
            //     if (chatService.getChat(message.sender.Id) == undefined) {
            //         // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
            //         let params = { userId: message.sender.Id };
            //         let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
            //         // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
            //         getChatIdObj.setData(ChatIdInfo);
            //             // console.log(ChatIdInfo)
            //     }
            //     if (message.msgObj.chatRoomId.indexOf('group_') >= 0) {
            //         // 群聊保留会议 会议室未关闭的情况下可点击进入会议
            //         var content = { "chatRoomId": message.msgObj.chatRoomId, "message": '正在会议中', "n_TYPE": 10, "type": 0, "voiceMeetingType": "refuse", "voiceRoomKey": message.msgObj.voiceRoomKey, };
            //     } else {
            //         // 不是群聊 直接拒绝 修改会议状态
            //         message.msgObj.voiceMeetingType = "busy";
            //         var content = { "chatRoomId": message.sender.Id, "message": '正在会议中', "n_TYPE": 10, "type": 0, "voiceMeetingType": "refuse", "voiceRoomKey": message.msgObj.voiceRoomKey, };
            //     };
            //     let newMessage = chatService.createMessage(message.sender.Id, 10, JSON.stringify(content));
            //     chatService.sendMsg(newMessage);
            // };
            // 其他人发送过来的消息处理
            if(message.senderId != userList.Id && document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0 && message.msgObj.voiceMeetingType != "invite"){
            
                // 群视频会议  或者 会议小助手id s_f84d705ae09f475d9343623e350fef42
                if(message.msgObj.chatRoomId.indexOf('group_') >= 0 || message.msgObj.chatRoomId.indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0){
                    // 收到视频会议类型是 拒绝refuse 或者 忙线 busy
                    if(message.msgObj.voiceMeetingType == 'refuse' || message.msgObj.voiceMeetingType == 'busy'){
						// 修改提示内容 message
						// message.msgObj.message = (message.msgObj.message == '' ?  message.sender.Name + '拒绝了您的邀请：拒绝视频邀请' : message.sender.Name + '现在不能加入您的会议：他正在另一个会议中' );
                        message.msgObj.message = (message.msgObj.message == '' ? '拒绝了您的邀请：拒绝视频邀请' : '现在不能加入您的会议：他正在另一个会议中');
                    }else if( message.msgObj.voiceMeetingType == 'destroy'){
                        // 修改提示内容 message
						message.msgObj.message =   message.sender.Name + ' 已取消视频会议邀请';
                        // destroy 结束 或者 取消房间状态
                        // 加入过该房间号的  接收到消息状态为destroy 是结束
                        // if(rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey){
                        //    message.msgObj.message =  message.sender.Name+'已结束了视频会议';
                        // }
                        if(util.getLs('joinedVideoMeeting')){
                            let obj=util.getLs('joinedVideoMeeting');
                            for(let i in obj){
                                if(obj[i].roomId == message.msgObj.voiceRoomKey){
                                    message.msgObj.message =  message.sender.Name+'已结束了视频会议';
                                    // 删除本地存储的这条数据 重新存入
                                    util.setLs('joinedVideoMeeting',JSON.stringify(obj.splice(i,1)));
                                    // 数据为空 删除本地localStorage
                                    if(obj.splice(i,1).length<=0){
                                        util.removeLs('joinedVideoMeeting');
                                    }
                                }
                            };
                        }
                        $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_vt')).each(function () {
                            // 替换 等于邀请状态的 那条titele
                            if ($(this).attr("data-voiceMeetingType") == 'invite') {
                                $(this).find('p').text(message.msgObj.message);
                            };
                        });
                        $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
                            // 替换标签自定义 data 消息类型
                            $(this).attr('data-voicemeetingtype',message.msgObj.voiceMeetingType);
                            // 替换标签自定义 data 数据 
                            $(this).find('span').attr('source', JSON.stringify(message));
                            // 添加禁止点击按钮样式
                            $(this).find('span').addClass('Prohibit_btn');
                        });
                        // 销毁群视频会议房间数据
                        rtcRoomObj.setData(null);
                        return;
                    }
                 }else{
                    let dataMsg= null;
                    if(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0){
                        dataMsg = JSON.parse($(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).find('span').attr('source'));
                    }
                    // 单人房间已经不等于邀请状态 return
					if(dataMsg.msgObj.voiceRoomKey ==  message.msgObj.voiceRoomKey && dataMsg.msgObj.voiceMeetingType != "invite"){
					    return;
					}
                    // 收到视频会议类型是 拒绝refuse 或者 忙线 busy
                    if(message.msgObj.voiceMeetingType == 'refuse' || message.msgObj.voiceMeetingType == 'busy'){
						// 修改提示内容 message
						// message.msgObj.message = (message.msgObj.message == '' ?  message.sender.Name + '拒绝了您的邀请：拒绝视频邀请' : message.sender.Name + '现在不能加入您的会议：他正在另一个会议中');
                        message.msgObj.message = (message.msgObj.message == '' ? '拒绝了您的邀请：拒绝视频邀请' :  '现在不能加入您的会议：他正在另一个会议中');
                        //  自己发送的邀请 - 接收到别人发送的拒绝 或 忙线 busy
                    //     if(dataMsg.sender.Id == userList.Id && dataMsg.sender.Id != message.sender.Id  ){

                    //    }
                        $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
                            // 替换标签自定义 data 消息类型
                            $(this).attr('data-voicemeetingtype',message.msgObj.voiceMeetingType);
                            // 替换标签自定义 data 数据 
                            $(this).find('span').attr('source', JSON.stringify(message));
                            // 添加禁止点击按钮样式
                            $(this).find('span').addClass('Prohibit_btn');
                        });
                          // 单人视频会议 已经进入房间 消息状态不是邀请状态的 销毁 视频会议房间
                        if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
                            // 销毁存入的 发起视频会议数据
                            // rtcRoomObj.setData(null);
                            // 销毁关闭房间 发送通知消息
                            frameService.notice({
                                message: JSON.stringify(message),
                                timestamp: util.getNow(),
                                frameId: 'vidioMeeting',
                                // action: 'closeMsgWebrtcSdk'
                                action: 'closeWebrtcSdk'
                            }, function (res) { 
                                console.log('closeWebrtcSdk==>',res)
                            });
                        };
                    };
                  
                    if(message.msgObj.voiceMeetingType == 'destroy'){
                         // 修改提示内容 message
						message.msgObj.message =   message.sender.Name + ' 已取消视频会议邀请';
                         // destroy 结束 或者 取消房间状态
						// 加入过该房间号的  接收到消息状态为destroy 是结束
                        if(rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey){
                            message.msgObj.message =  message.sender.Name+'已结束了视频会议';
                        }
                        $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_vt')).each(function () {
                            // 替换 等于邀请状态的 那条titele
                            if ($(this).attr("data-voiceMeetingType") == 'invite') {
                                $(this).find('p').text(message.msgObj.message);
                            };
                        });
                        $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
                            // 替换标签自定义 data 消息类型
                            $(this).attr('data-voicemeetingtype',message.msgObj.voiceMeetingType);
                            // 替换标签自定义 data 数据 
                            $(this).find('span').attr('source', JSON.stringify(message));
                            // 添加禁止点击按钮样式
                            $(this).find('span').addClass('Prohibit_btn');
                        });
                          // 单人视频会议 已经进入房间 消息状态不是邀请状态的 销毁 视频会议房间
                        if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
                            // 销毁存入的 发起视频会议数据 
                            // rtcRoomObj.setData(null);
                            // 仅销毁关闭房间 不发送消息
                            frameService.notice({
                                message: JSON.stringify(message),
                                timestamp: util.getNow(),
                                frameId: 'vidioMeeting',
                                // action: 'closeMsgWebrtcSdk'
                                action: 'closeWebrtcSdk'
                            }, function (res) { 
                                console.log('closeWebrtcSdk==>',res)
                            });
                        };
                        return;
                    }
                 }
            }
            // 发送人 = 自己的id 消息处理
            if(message.senderId == userList.Id){
                // 本端 通知其他端 已经在本端进入视频会议 通知消息 ( 自己发送给自己的 ) 不处理本条消息更新 ChatId
                if ( message.msgObj.voiceMeetingType == "answered" ) {
                    // alert('阻止answered状态渲染ui')
                    return;
                }
                // 群视频会议  或者 会议小助手id s_f84d705ae09f475d9343623e350fef42
                if(message.msgObj.chatRoomId.indexOf('group_') >= 0 || message.msgObj.chatRoomId.indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0){
                    if( message.msgObj.voiceMeetingType == "invite"){
                        // 多人会议- 房间已经在页面渲染 自己发送的 多次邀请 - 不重复渲染ui
                        if(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0){
                            return;
                        }
                    }else{
                        let dataMsg= null;
                        if(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0){
                            dataMsg = JSON.parse($(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).find('span').attr('source'));
                        }
                        //  当前视频会议消息状态已经是销毁状态 不在更新消息显示
                        if(dataMsg.msgObj.voiceRoomKey ==  message.msgObj.voiceRoomKey && dataMsg.msgObj.voiceMeetingType == "destroy"){
                            return;
                        }
                         //  正在进行视频会议 - 收到其他人邀请的视频会议 特殊处理
                        //  if(dataMsg.msgObj.voiceRoomKey ==  message.msgObj.voiceRoomKey && message.msgObj.voiceMeetingType == "busy"){
                        //     return;
                        // }
                        if(dataMsg && dataMsg.msgObj.voiceRoomKey == message.msgObj.voiceRoomKey){
                            if ( message.msgObj.voiceMeetingType == "refuse" || message.msgObj.voiceMeetingType == 'busy' ) {
                                message.msgObj.message = (message.msgObj.message == '' ?   '已拒绝' :  '正在会议中');
                                if(dataMsg.msgObj.voiceMeetingType ==  "invite" &&rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid != message.msgObj.voiceRoomKey){
                                    message.msgObj.message = '当前正在通话 已拒绝' + dataMsg.sender.Name + '的会议邀请';
                                };
                                // 点击按钮 拒绝 多人视频会议  不发送拒绝通知消息 前面点击按钮已经发送完了
                                if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
                                    
                                    // 通知视频会议窗口 销毁关闭视频会议窗
                                    frameService.notice({
                                        message: JSON.stringify(message),
                                        timestamp: util.getNow(),
                                        frameId: 'vidioMeeting',
                                        // action: 'closeMsgWebrtcSdk'
                                        action: 'closeWebrtcSdk'
                                    }, function (res) { 
                                        console.log('closeWebrtcSdk==>',res)
                                    });
                                };
                            };
                            // 会议状态 destroy 结束 或者 取消房间的数据 更新房间状态为邀请的那一条数据 其他拒绝状态的数据添加到数据列表中
                            if (message.msgObj.voiceMeetingType == "destroy") {
                                // 未加入房间  取消房间
                                message.msgObj.message =  '您取消了视频会议';
                                // 已经加入房间时 结束会议
                                if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
                                    message.msgObj.message = '您结束了视频会议';
                                };
                                if(util.getLs('joinedVideoMeeting')){
                                    let obj=util.getLs('joinedVideoMeeting');
                                    for(let i in obj){
                                        if(obj[i].roomId == message.msgObj.voiceRoomKey){
                                            message.msgObj.message = '您结束了视频会议';
                                            // 删除本地存储的这条数据 重新存入
                                            util.setLs('joinedVideoMeeting',JSON.stringify(obj.splice(i,1)));
                                            // 数据为空 删除本地localStorage
                                            if(obj.splice(i,1).length<=0){
                                                util.removeLs('joinedVideoMeeting');
                                            }
                                        }
                                    };
                                }
                                //  变量内部有特殊符号 获取dom元素的方法
                                //  修改title 内容
                                // 可能有多次邀请记录 each 遍历元素  全部修改UI显示状态+数据
                                $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_vt')).each(function () {
                                    // 替换 等于邀请状态的 那条titele
                                    if ($(this).attr("data-voiceMeetingType") == 'invite') {
                                        $(this).find('p').text(message.msgObj.message);
                                    };
                                });
                                $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
                                    // 替换标签自定义 data 消息类型
                                    $(this).attr('data-voicemeetingtype',message.msgObj.voiceMeetingType);
                                    // 替换标签自定义 data 数据 
                                    $(this).find('span').attr('source', JSON.stringify(message));
                                    // 添加禁止点击按钮样式
                                    $(this).find('span').addClass('Prohibit_btn');
                                });
                                // 销毁群视频会议房间数据
                                rtcRoomObj.setData(null);
                                return;
                            };
                        }
                    } 
                }else{
                    // 单人视频会议
                    if(message.msgObj.voiceMeetingType != "invite"){
                        let dataMsg= null;
                        if(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0){
                            dataMsg = JSON.parse($(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).find('span').attr('source'));
                        }
                         // 单人房间已经不等于邀请状态 return
                        // if(dataMsg.msgObj.voiceRoomKey ==  message.msgObj.voiceRoomKey &&  dataMsg.msgObj.voiceMeetingType  == "destroy"){
                        //     // alert('222',dataMsg.msgObj.voiceMeetingType);
                        //     return;
                        // }
                        if(dataMsg){
                            if ( message.msgObj.voiceMeetingType == "refuse" || message.msgObj.voiceMeetingType == 'busy' ) {
                                message.msgObj.message = (message.msgObj.message == '' ?   '已拒绝' :  '正在会议中');
                                if(dataMsg.msgObj.voiceMeetingType ==  "invite" &&rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid != message.msgObj.voiceRoomKey){
                                    message.msgObj.message = '当前正在通话 已拒绝' + dataMsg.sender.Name + '的会议邀请';
                                }
                            };
                            if (message.msgObj.voiceMeetingType == "destroy") {
                                // 未加入房间  取消房间
                                message.msgObj.message =  '您取消了视频会议';
                                // 已经加入房间时 结束会议
                                if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
                                    message.msgObj.message = '您结束了视频会议';
                                };
                            }
                             // 单人视频会议 已经进入房间 消息状态不是邀请状态的 销毁 视频会议房间
                                if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
                                    // 销毁存入的 发起视频会议数据 
                                    // rtcRoomObj.setData(null);
                                    // 销毁关闭房间 发送通知消息
                                    frameService.notice({
                                        message: JSON.stringify(message),
                                        timestamp: util.getNow(),
                                        frameId: 'vidioMeeting',
                                        action: 'closeMsgWebrtcSdk'
                                    }, function (res) {
                                        console.log('closeWebrtcSdk==>',res)
                                    }); 
                                };
                                $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_vt')).each(function () {
                                    // 替换 等于邀请状态的 那条titele
                                    if ($(this).attr("data-voiceMeetingType") == 'invite') {
                                        $(this).find('p').text(message.msgObj.message);
                                    };
                                });
                                $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
                                    // 替换标签自定义 data 消息类型
                                    $(this).attr('data-voicemeetingtype',message.msgObj.voiceMeetingType);
                                    // 替换标签自定义 data 数据 
                                    $(this).find('span').attr('source', JSON.stringify(message));
                                    // 添加禁止点击按钮样式
                                    $(this).find('span').addClass('Prohibit_btn');
                                });
                                return;
                            }
                        }
                       
                }
            }
        }
        // 多人会议- 房间已经在页面渲染 自己发送的 多次邀请 - 不重复渲染ui
        // if (message.type == "service" && message.msgObj && message.msgObj.n_TYPE == 10 && message.senderId == userList.Id && message.msgObj.chatRoomId.indexOf('group_') >= 0 && document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0 && message.msgObj.voiceMeetingType == "invite") {
        //     return;
        // }


        // if(message.type == "service" && message.msgObj && message.msgObj.chatRoomId.indexOf('group_')>=0 && message.msgObj.chatRoomId != message.chatId){
        //     // 群id  在群中 添加一条本地消息（仅自己可见）
        //     message.chatId = message.msgObj.chatRoomId;
        // }
        // 视频会议 房间id 在页面dom已经创建的 并且是邀请状态invite 之后收到多次邀请视频会议信息
        // if (message.type == "service" && message.msgObj && message.msgObj.n_TYPE == 10 && message.msgObj.voiceMeetingType && document.getElementsByClassName(message.msgObj.voiceRoomKey+'_btn') && message.msgObj.voiceMeetingType == "invite") {
        //     // 是否显示消息时间 
        //     if(message.showTime){
        //         // 添加css 权重写法
        //         $('.'+message.msgObj.voiceRoomKey+'_time').css('cssText','display: block !important');
        //         // 修改时间
        //         $('.'+message.msgObj.voiceRoomKey+'_time').find('span').text(message.showTime);
        //     };

        //     // .unwrap().wrap('<p class="msg_time {{message.msgObj.voiceRoomKey}}_time"  ng-show="message.showTime"><span>{{message.timeStamp|msgDetailTimeFormat}}</span></p>')
        //     return;
        // }
        // 视频会议特殊处理 不是邀请状态（invite）  voiceRoomKey在页面中不存在的 说明是其他端同步过来的消息 直接在页面中显示
        // if (message.type == "service" && message.msgObj && message.msgObj.n_TYPE == 10 && message.msgObj.voiceMeetingType && document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn').length > 0 && message.msgObj.voiceMeetingType != "invite") {

        //     // chatRoomId 是群id 多人视频会议 消息状态不是邀请状态的 删除dom元素 重新创建dom
        //     if (message.msgObj.chatRoomId.indexOf('group_') >= 0) {


        //     } else {
        //         // 单人视频会议 已经进入房间 消息状态不是邀请状态的 销毁 视频会议房间
        //         if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
        //             frameService.notice({
        //                 message: message,
        //                 timestamp: util.getNow(),
        //                 frameId: 'vidioMeeting',
        //                 action: 'closeWebrtcSdk'
        //             }, function (res) {
        //                 // $scope.close();
        //             });
        //         };
        //     };
        //     // 获取消息列表  接收的消息数据 发送人id 不等于自己的id 其他人拒绝自己的消息
        //     if ((message.msgObj.voiceMeetingType == "refuse" || message.msgObj.voiceMeetingType == 'busy') && message.senderId != userList.Id) {
        //         message.msgObj.message = (message.msgObj.message == '' ? message.sender.Name + '拒绝了您的邀请：拒绝视频邀请' : message.sender.Name + '现在不能加入您的会议：他正在另一个会议中');
        //     };
        //     // 会议状态 destroy 结束 或者 取消房间的数据 更新房间状态为邀请的那一条数据 其他拒绝状态的数据添加到数据列表中
        //     if (message.msgObj.voiceMeetingType == "destroy") {
        //         // 未加入房间  取消房间
        //         message.msgObj.message = (message.senderId != userList.Id ? message.sender.Name + '已取消了视频会议' : '您已取消了视频会议');
        //         // 已经加入房间时 结束会议
        //         if (rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid == message.msgObj.voiceRoomKey) {
        //             message.msgObj.message = (message.senderId != userList.Id ? message.sender.Name + '结束了视频会议' : '您结束了视频会议');
        //         };
        //         //  变量内部有特殊符号 获取dom元素的方法
        //         //  修改title 内容
        //         // 可能有多次邀请记录 each 遍历元素  全部修改UI显示状态+数据
        //         $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_vt')).each(function () {
        //             // 替换 等于邀请状态的 那条titele
        //             if ($(this).attr("data-voiceMeetingType") == 'invite') {
        //                 $(this).find('p').text(message.msgObj.message);
        //             };
        //         });
        //         $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
        //             // 替换标签自定义 data 数据 
        //             $(this).find('span').attr('source', JSON.stringify(message));
        //             // 添加禁止点击按钮样式
        //             $(this).find('span').addClass('Prohibit_btn');
        //         });
        //         return;
        //     }
        //     // chatRoomId 是群id 多人视频会议 消息状态不是邀请状态的 删除dom元素 重新创建dom
        //     if (message.msgObj.chatRoomId.indexOf('group_') >= 0) {


        //     } else {
        //         console.log('测试==》',message);
        //         // 更新 单人视频会议  页面数据显示状态 
        //         //  修改title 内容
        //         // $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_vt')).each(function () {
        //         //     // 替换 等于邀请状态的 那条titele
        //         //     if ($(this).attr("data-voiceMeetingType") == 'invite') {
        //         //         $(this).find('p').text(message.msgObj.message);
        //         //     };
        //         // });
        //         $(document.getElementsByClassName(message.msgObj.voiceRoomKey + '_btn')).each(function () {
        //             // 替换标签自定义 data 数据 
        //             $(this).find('span').attr('source', JSON.stringify(message));
        //             // 添加禁止点击按钮样式
        //             $(this).find('span').addClass('Prohibit_btn');
        //         });
        //         // return;

        //     }


        // };
        var chatId = message.chatId;
        var wrapId = 'msgList_' + chatId;
        var chat = chatService.getChat(chatId);
        if (msgListWrap[wrapId]) {
            // if(message.timeStamp - chat.MsgTimestamp > webConfig.SHOW_MSGTIME_DIS){
            // message.showTime = true;
            // chat.MsgTimestamp = message.timeStamp;
            // }
            var _scope = $scope.$new();
            var msgWraper = msgListWrap[wrapId];
            // if(msgWraper.find('.msg').size() > MAX_MSG_LENGTH && !$scope.startRecordNewMsgId){
            // var deleteIdx = msgWraper.find('.msg').size() - MAX_MSG_LENGTH;
            // for(var i=0;i<deleteIdx;i++){
            // msgWraper.find('.msg').eq(i).parent().remove();
            // }
            // }
            _scope._msg = message;
            console.log(_scope._msg)
            if (!message.showTime) {
                if (!lastestShowMsgTime[chatId] || (message.timeStamp - lastestShowMsgTime[chatId] > webConfig.SHOW_MSGTIME_DIS)) {
                    console.log('lastestShowMsgTime:%s,消息时间:%s,相差:%s', lastestShowMsgTime[chatId], message.timeStamp, message.timeStamp - lastestShowMsgTime[chatId]);
                    message.showTime = true;
                    // chat.MsgTimestamp = message.timeStamp;
                    lastestShowMsgTime[chatId] = message.timeStamp;
                }
            }
            if (!message.sender) {
                concatService.getUser(message.senderId, function (res) {
                    console.log(res);
                    message.sender = res.Data;
                    compile(insertCallBack);
                })
            } else {
                compile(insertCallBack);
            }
        }
        function compile(insertCallBack) {
            var _ele = ele('<div id="{{_msg.messageid}}" class="msg-item"></div>');
            var tpl = $templateCache.get('message.html');
            _ele.html(tpl);
            $compile(_ele)(_scope);
            isSend && (sendingMsg[message.messageid].scope = _scope);
            if (insertCallBack) {
                insertCallBack(_ele);
            } else {
                msgWraper.append(_ele);
            }
            try {
                _scope.$digest();
            } catch (e) { }
            setTimeout(function () {
                if (message.msgType == 3) {
                    changeMsgUI({
                        Status: 0,
                        ResId: message.messageid
                    })
                }
                if (message.msgType == 10 && message.msgObj.n_TYPE == 9 && message.msgObj.type == 0) {
                    changeMsgUI({
                        Status: isSend ? 4 : 0,
                        ResId: message.messageid
                    })
                }
                bindEvent(_ele, message.messageid);
                scrollWrap(msgWraper, _ele, isSend);
                if (!isSend) {
                    _scope.$destroy();
                }
            })
        };

         // 视频会议 - 接收+发送消息体+渲染UI完成之后  判断当前是否正在视频会议
         if(message.type == "service" && message.msgObj && message.msgObj.n_TYPE == 10  ){
            // 接收到视频会议邀请消息 判断 自己是不是正在视频会议  正在视频会议 发送一条消息通知对方
            if(message.senderId != userList.Id && rtcRoomObj.getData() != undefined && rtcRoomObj.getData().roomid != message.msgObj.voiceRoomKey && message.msgObj.voiceMeetingType == "invite"){
                // message.msgObj.message = '当前正在通话 已拒绝' + message.sender.Name + '的会议邀请';
                // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框或者没有与该联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined ，chatService.createMessage 函数内部报错 重新调用接口 获取联系人的个人信息 存入factory自定义方法
                if (chatService.getChat(message.sender.Id) == undefined) {
                    // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息
                    let params = { userId: message.sender.Id };
                    let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                    // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                    getChatIdObj.setData(ChatIdInfo);
                        // console.log(ChatIdInfo)
                }
                if (message.msgObj.chatRoomId.indexOf('group_') >= 0) {
                    // 群聊保留会议 会议室未关闭的情况下可点击进入会议
                    var content = { "multiplayer":true,"chatRoomId": message.msgObj.chatRoomId, "message": '正在会议中', "n_TYPE": 10, "type": 0, "voiceMeetingType": "busy", "voiceRoomKey": message.msgObj.voiceRoomKey, };
                } else {
                    // 不是群聊 直接拒绝 修改会议状态
                    // message.msgObj.voiceMeetingType = "busy";
                    var content = { "multiplayer":false, "chatRoomId": message.sender.Id, "message": '正在会议中', "n_TYPE": 10, "type": 0, "voiceMeetingType": "busy", "voiceRoomKey": message.msgObj.voiceRoomKey, };
                };
                let newMessage = chatService.createMessage(message.sender.Id, 10, JSON.stringify(content));
                chatService.sendMsg(newMessage);
            };
        }
    }
    function bindEvent(dom, msgId) {
        msgActions(dom, msgId);
        dom = null;
    };
    // 判断是否是群会议 群会议 
    $scope.OnIsGroup = function (_msg) {
        if (_msg.type == webConfig.MSG_SERVICE_TYPE && _msg.msgObj.n_TYPE == 10) {
            // 多人视频会议 自己发起的视频会议 除非会议状态为销毁否则 接受按钮一直显示可点击 拒绝按钮显示不可以点击 
            if (_msg.msgObj.chatRoomId.indexOf('group_') >= 0 || _msg.msgObj.chatRoomId.indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0) {
                if( _msg.msgObj.voiceMeetingType ==  'destroy' ){
                    return true;
                }else{
                    return false;
                }
            }else{
                // 单人视频会议 发起的视频会议不等于自己 并且 会议状态为邀请状态 invite 按钮才能显示可点击 否则全部显示无法点击
                if(_msg.msgObj.voiceMeetingType == 'invite' && _msg.senderId != webConfig.getUser().Id){
                    return false;
                }else{
                    return true;
                }

            }
        }
    };
    
    // chatRoomId 是否是群消息 判断显示条件
    $scope.msgChatRoomIdIs = function (_msg) {
        if (_msg.type == webConfig.MSG_SERVICE_TYPE && _msg.msgObj.n_TYPE == 10) {
            if (_msg.msgObj.chatRoomId.indexOf('group_') >= 0 || _msg.msgObj.chatRoomId.indexOf('s_f84d705ae09f475d9343623e350fef42') >= 0) {
                // 群消息 只显示邀请状态（invite）和   destroy 状态 destroy包含了 结束视频状态 和 取消视频 的状态 其他的拒绝或者忙碌中仅显示提示文字
                if (_msg.msgObj.voiceMeetingType == 'invite' || _msg.msgObj.voiceMeetingType == 'destroy' ) {
                    return true;
                } else {
                    return false;
                };
            } else {
                // 发送人 不是自己 只显示邀请和销毁的状态 视频会议 
                if(_msg.senderId != webConfig.getUser().Id){
                    if (_msg.msgObj.voiceMeetingType == 'invite' || _msg.msgObj.voiceMeetingType == 'destroy' ) {
                        return true;
                    } else {
                        return false;
                    };
                }else{
                     // chatRoomId消息为单人视频  状态全部显示
                    return true;
                }
            };
        };
    };
    function msgActions(dom, msgId) {
        dom = $(dom);
        var isLargeFile = dom.find('.intranet').size() == 1;
        dom.find('.load_img').on('error', function () {
            if (this.getAttribute('loadfail') == '1') {
                $(this).unbind('error');
                return;
            }
            this.setAttribute('loadfail', 1);
            this.src = webConfig.ERROR_IMAGE;
        })
        if (!dom.find('.load_img').attr('src')) {
            dom.find('.load_img').attr('src', webConfig.ERROR_IMAGE);
            dom.find('.load_img').attr('loadfail', 1);
            $(this).unbind('error');
        }
        dom.find('.resend').click(function () {
            if (!sendingMsg[msgId]) {
                dom.find('.sending').removeClass('ng-hide');
                dom.find('.resend').removeClass('ng-hide');
                dom.find('.sending').show();
                $(this).hide();
                $scope.resendMsg(msgId);
            }
            return false;
        })
        dom.find('.forward_file').click(function () {
            var params = {};
            params.action = 'forward';
            params.msgId = msgId;
            frameService.open('forward', 'forward.html', params, 600, 550, true, langPack.getKey('forward'));
        })
        dom.find('.cancel_upload').click(function () {
            // console.log('cancel_upload',msgId)
            frameService.cancelTransfer({
                id: msgId
            })
        });
        dom.find('.re_upload').click(function () {
            // console.log('re_upload',msgId)
            chatService.resendMsg(msgId, $scope.chatData.currentChat, function (res) {
                changeMsgUI(res.Data)
            })
            // $rootScope.$broadcast('reUploadFile',msgId);
        })
        dom.find('.open').click(function () {
            // console.log('open',msgId)
            frameService.openMsg({
                id: msgId,
                type: 0
            })
        })
        dom.find('.open_dir').click(function () {
            // console.log('open_dir',msgId)
            frameService.openMsg({
                id: msgId,
                type: 1
            })
        })
        dom.find('.download').click(function () {
            // console.log('download',msgId)
            frameService.downLoad({
                id: msgId
            }, function (res) {
                changeMsgUI(res.Data);
            })
        })
        dom.find('.save_as').click(function () {
            // console.log('save_as',msgId)
            // 如果是大文件则选择目录，folderOnlye:true
            if (isLargeFile) {
                frameService.saveDialog({
                    folderOnly: true
                }, function (_res) {
                    frameService.downLoad({
                        id: msgId,
                        filePath: _res.Data
                    }, function (res) {
                        changeMsgUI(res.Data);
                    })
                })
            } else {
                // 是离线文件则不用只能选择目录
                frameService.saveDialog({
                    fileName: dom.find('.file_name').text()
                }, function (_res) {
                    frameService.downLoad({
                        id: msgId,
                        filePath: _res.Data
                    }, function (res) {
                        changeMsgUI(res.Data);
                    })
                })
            }
        })
        // 离线文件取消下载 / 大文件接收方取消接收
        dom.find('.cancel_download,.cancel_receive').click(function () {
            // console.log('cancel_download',msgId);
            frameService.cancelTransfer({
                id: msgId
            })
        });
        // 离线文件重新下载
        dom.find('.re_download').click(function () {
            // console.log('re_download',msgId);
            frameService.downLoad({
                id: msgId
            }, function (res) {
                changeMsgUI(res.Data);
            })
        })

        dom.find('.go_broad_detail').click(function () {
            $scope.view.broadMsg = msgId;
        })
        // dom.find('.go_service_detail').click(function(){
        // $scope.view.broadMsg = '';
        // })

        dom.find('.voice_area').click(function () {
            playVoice(msgId);
        })
        dom.find('.video_area').click(function () {
            playVideo(msgId);
        })
        // 加入 预约视频会议
        dom.find('.msg_reserveVideo_list_footer_item_join').click(function () {
            let msg = JSON.parse($(this).attr('source'));
               // 会议状态为取消状态 - 禁止任何操作
            if(msg.msgObj.optionType == 'cancel'){
                return;
            };
            let that = this;
            let userList = webConfig.getUser();
            // let img= userList.Avatar!=''?window.location.origin+userList.Avatar:"http://org.jj.woniu.com/IM/avatars/snail_woman.png";// 正式开发使用
            let img = userList.Avatar != '' ? userList.Avatar : "IM/avatars/snail_woman.png";// 开发 域名不正确 测试使用
            let token = userList.Token;
            let name = userList.Name;
            let userid = userList.Id;
            var phone = userList.Mobile;
             
            console.log(msg);
            console.log(userList);
            let roomObj = {
                chatRoomId: [],
                img: img,
                roomid: msg.msgObj.meetingRoomKey,// '88888888' || 
                jjtoken: token,
                phone: phone,
                // rytoken: data.rongYunToken.token,
                userId: userid,
                username: name,
                MeetingId: '',//用户属性 c字段-成员在群里传群id 不在群里面是会议小助手id
                status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                audioPause: false, //是否暂停音频流
                videoPause: false,
                master: '',//会议创建者
                manager: [], // 会议管理员
                mode: msg.msgObj.meetingType,// 房间模式 视频 + 音频
                medias: 'av',//流属性 视频+音频
                ClientId: msg.chatId,//服务端生成的id
                ClientKey: userid,//  登录的KEY 是静静id
                selected: [{
                    id: userid,//静静id
                    name: name,
                    img: img,
                    MeetingId: '',//用户属性 c字段-成员在群里传群id 不在群里面是会议小助手id
                    status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                    audioPause: false, //是否暂停音频流
                    videoPause: false,
                    mode: 'video',//房间模式 video 视频+音频  seceen-屏幕共享
                    medias: '',//流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    master: '',//房主 值等于用户id
                    manager: '',//会议管理员 
                    ClientKey: userid,//静静id
                    ClientId: msg.chatId,//服务端生成的id
                    Zoom: 0, //显示的屏幕缩放的大小
                }],
            };
            if(msg.chatId.indexOf('s_f8') >= 0 ){
                //多人会议 但自己不在群里 会议小助手ID
                roomObj.chatRoomId.push(msg.chatId);
                alert('接听-会议小助手ID',msg.chatId)
            };
            // 打开视频会议页面窗口 传入的参数 - params
            let params = {};
            params.roomObj = JSON.stringify(roomObj);
            // 打开视频会议页面窗口
            frameService.open('vidioMeeting', 'vidioMeeting.html', params, 1080, 680, false, langPack.getKey('startChat'), true, true);
              // 发送 会议邀请 数据容器  视频会议控制器 从这里取值 
              rtcRoomObj.setData(roomObj)
        });
     // 取消 预约视频会议
     dom.find('.msg_reserveVideo_list_footer_item_cancel').click(function () {
        let msg = JSON.parse($(this).attr('source'));
        // 会议状态为取消状态 - 禁止任何操作
        if(msg.msgObj.optionType == 'cancel'){
            return;
        }
        let params = {"roomKey":  msg.msgObj.meetingRoomKey};
        callCefMethod('chat/CancelAppointmentMeeting',params , function (res) {
            console.log(res); 
        })
     })
     // 编辑 预约视频会议
        dom.find('.msg_reserveVideo_list_footer_item_edit').click(function () {
            let msg = JSON.parse($(this).attr('source'));
            // 会议状态为取消状态 - 禁止任何操作
        if(msg.msgObj.optionType == 'cancel'){
            return;
        }
            let params = {};
            //  edit 编辑 预约视频会议
            params.action = 'edit';
            //会议 主题
            params.theme = msg.msgObj.subject;
            //会议 类型
            params.type = msg.msgObj.meetingType;
            //会议 时间
            params.roomtime = msg.msgObj.beginTime;
            //  房间号
            params.roomKey = msg.msgObj.meetingRoomKey;
            //  成员列表
            params.selected = JSON.stringify(msg.msgObj.members);
            frameService.open('BookAMeeting', 'BookAMeeting.html', params, 350, 550, true, '预约会议');
        })
        // 拒绝 视频
        dom.find('.msg_video_refuse').click(async function () {
            let userList = webConfig.getUser();
            // 获取视频会议房间号
            let msg = JSON.parse($(this).attr('source'));
            var reg = /^group_.*?_[\d.]+$/;
            // if(msg.sender.Id == userList.Id){
            //     return alert('无法拒绝自己发起的视频会议');
            // }
            // if ( msg.msgObj.voiceMeetingType == "invite" ) {
            if (!$(this).hasClass("Prohibit_btn") && msg.msgObj.voiceMeetingType == "invite") {
                // 不是群id 当前房间是邀请状态 拒绝之后禁止点击进入房间
                if(!reg.test(msg.msgObj.chatRoomId)){
                    $(this).addClass('Prohibit_btn').siblings('.msg_video_agree').addClass('Prohibit_btn');
                }
                // 获取页面展示的item 长度
                // let ListLen = $(this).parents(".msg-item").siblings().length + 1;
                //    console.log(msg.messageid);  "message": '拒绝视频邀请'
                //  调用getChat函数获取不到联系人的个人信息返回undefined 
                if (chatService.getChat(msg.sender.Id) == undefined) { 
                    let params = { userId:msg.sender.Id};
                    // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息 
                    let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
                    // 设置 联系人的个人信息 存入factory自定义方法(getChatIdObj.setData)
                    getChatIdObj.setData(ChatIdInfo);
                    console.log(ChatIdInfo)
                }
                var content = { "chatRoomId": reg.test(msg.msgObj.chatRoomId) ? msg.msgObj.chatRoomId : msg.sender.Id, "message": '', "n_TYPE": 10, "voiceMeetingType": "refuse", "voiceRoomKey": msg.msgObj.voiceRoomKey };
                var message = chatService.createMessage(msg.sender.Id, 10, JSON.stringify(content));

                console.log(message);
                // 发送消息通知对方拒绝视频通话
                chatService.sendMsg(message);
            }
        })
        // 接听 视频
        dom.find('.msg_video_agree').click(function () {
             // 获取视频会议房间信息
             let msg = JSON.parse($(this).attr('source'));
            if ($(this).hasClass("Prohibit_btn") && msg.msgObj.voiceMeetingType != "invite") {
                return;
            }; 
            if ( $(document.getElementsByClassName( msg.msgObj.voiceRoomKey +'_btn')).data('voicemeetingtype') == 'answered' ) {
                 alert('已在其他端接听');
                //  return
            };
            if( rtcRoomObj.getData()){
                return alert('当前正在进行视频会议，无法重复接听');
            };
             //查询是否允许进入会议
             chatService.CanJoinRoom(msg.msgObj.voiceRoomKey,function(res){
                if((res.Code != 0 || res.Flag != 0 ) && !res.Data){
                    return alert('无法进入该房间')
                }else{
                    // alert('允许进入会议');
                }
            });
            let that = this;
            let userList = webConfig.getUser();
            // let img= userList.Avatar!=''?window.location.origin+userList.Avatar:"http://org.jj.woniu.com/IM/avatars/snail_woman.png";// 正式开发使用
            let img = userList.Avatar != '' ? userList.Avatar : "IM/avatars/snail_woman.png";// 开发 域名不正确 测试使用
            let token = userList.Token;
            let name = userList.Name;
            let userid = userList.Id;
            var phone = userList.Mobile;
            
            let msgdata = JSON.parse(msg.content);
            console.log(msg);
            console.log(userList);
            let roomObj = {
                chatRoomId: [],
                img: img,
                roomid: msg.msgObj.voiceRoomKey,// '88888888' || 
                jjtoken: token,
                phone: phone,
                // rytoken: data.rongYunToken.token,
                userId: userid,
                username: name,
                MeetingId: '',//用户属性 c字段-成员在群里传群id 不在群里面是会议小助手id
                status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                audioPause: false, //是否暂停音频流
                videoPause: false,
                master: '',//会议创建者
                manager: [], // 会议管理员
                mode: 'video',// 房间模式 视频 + 音频
                medias: 'av',//流属性 视频+音频
                ClientId: msg.chatId,//服务端生成的id
                ClientKey: userid,//  登录的KEY 是静静id
                selected: [{
                    id: userid,//静静id
                    name: name,
                    img: img,
                    MeetingId: '',//用户属性 c字段-成员在群里传群id 不在群里面是会议小助手id
                    status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                    audioPause: false, //是否暂停音频流
                    videoPause: false,
                    mode: 'video',//房间模式 video 视频+音频  seceen-屏幕共享
                    medias: '',//流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    master: '',//房主 值等于用户id
                    manager: '',//会议管理员 
                    ClientKey: userid,//静静id
                    ClientId: msg.chatId,//服务端生成的id
                    Zoom: 0, //显示的屏幕缩放的大小
                }],
            };
            // 打开视频会议页面窗口 传入的参数 - params
            let params = {};
            
            // params.action = 'new';
            // 接听 特殊处理-成功加入房间之后 给其他端发送消息  告诉其他端已经加入房间 key
            params.action = 'answered';
            // 发送的消息id 包含group_是群id 传群id 是多人聊天
            if (msg.msgObj.chatRoomId.indexOf('group_') >= 0) {
                roomObj.chatRoomId.push(msg.msgObj.chatRoomId);
                let chat = chatService.getChat(msg.msgObj.chatRoomId);
                params.groupId = chat.id;//群 id
                params.groupName = chat.Name || chat.ShowName;//群 name 
            }else if(msg.msgObj.chatRoomId.indexOf('s_f8') >= 0 ){
                //多人会议 但自己不在群里 会议小助手ID
                roomObj.chatRoomId.push(msg.msgObj.chatRoomId);
                alert('接听-会议小助手ID',msg.msgObj.chatRoomId)
            } else {
                // 发送的消息id 不包含group_ 是单人聊天 传对方id 关闭房间留用
                roomObj.chatRoomId.push(msg.chatId);
                // 不是群视频会议 点击之后添加禁止点击样式
                $(this).addClass('Prohibit_btn').siblings('.msg_video_refuse').addClass('Prohibit_btn');
            };
            // 邀请消息体
            params.msgContent= JSON.stringify(msgdata);
            params.roomObj = JSON.stringify(roomObj);
            // 打开视频会议页面窗口
            frameService.open('vidioMeeting', 'vidioMeeting.html', params, 1080, 680, false, langPack.getKey('startChat'), true, true);
            // frameService.open('vidioMeeting', 'vidioMeeting.html', {
            //     action: 'new',
            //     roomObj: JSON.stringify(roomObj),
            // }, 1080, 680, false, langPack.getKey('startChat'), true, true);
            // 发送 会议邀请 数据容器  视频会议控制器 从这里取值 
            rtcRoomObj.setData(roomObj)
            // 获取融云token
            // callCefMethod('account/loginRongYun', {}, function (res) {
            //     if (res.Code == 0) {
            //         let data = JSON.parse(res.Data);
            //         if (data.rongYunToken.code = 200) {
            //             // 解码
            //             var str = decodeURIComponent(data.rongYunToken.reqBody);
            //             var jsonList = {};
            //             var strs = str.split("&");
            //             for (var i = 0; i < strs.length; i++) {
            //                 jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1];
            //             }
            //             console.log(jsonList);
            //             var roomObj = {
            //                 appKey: 'cpj2xarlcm2jn',
            //                 img: jsonList.portraitUri,
            //                 roomid: msgdata.voiceRoomKey,
            //                 jjtoken: jjtoken,
            //                 phone:phone,
            //                 // rytoken:data.rongYunToken.token,
            //                 rytoken: data.rongYunToken.token,
            //                 userId: userid,
            //                 username: name,
            //             };
            //             // 本次视频会议是自己发起的 选中的会议成员列表
            //             if($(that).attr('data-vSelected')){
            //                 roomObj.selected=$(that).attr('data-vSelected');
            //             }
            //             // encodeURIComponent 现将json（roomObj）转换为字符串再进行编码
            //             window.open("http://172.18.70.26:8080/?obj=" + encodeURIComponent(JSON.stringify(roomObj)));
            //         }
            //         console.log(data);

            //     }
            // });

        })
        dom.find('.pic_msg').on('click', function () {
            var params = {};
            var srcs = [];
            var msgWraper = msgListWrap['msgList_' + $scope.chatData.currentChat];
            var thisImg = $(this).find('.thumb_img')[0];
            if (thisImg.getAttribute('loadfail') == 1) {
                return;
            }
            var nh = thisImg.naturalHeight, nw = thisImg.naturalWidth; // 图片源尺寸
            var newSize = util.getNewSize(nw, nh);
            var width = newSize.width;
            var height = newSize.height;
            var idx = 0;
            msgWraper.find('.pic_msg .thumb_img').each(function (_idx) {
                srcs.push(this.src);
                if (thisImg == this) {
                    idx = _idx;
                }
            })
            var time = dom.find('.msg').attr('time');
            // params.imgs = srcs;
            // params.idx = idx;
            params.width = width;
            params.img = $(this).find('.thumb_img').attr('source');
            params.msgId = msgId;
            params.chatId = $scope.chatData.currentChat;
            params.height = height;
            params.msgTime = time;
            frameService.open('previewImg', 'previewImg.html', params, width + 20, height + 50, false, langPack.getKey('imgView'), false, true);
        })
        // 大文件发送方查看接收状态
        dom.find('.receive_status').click(function () { // 查看接收状态
            chatService.onlineFileStatus(msgId, function (res) {
                pops.append({
                    templateUrl: 'largeFileReceiveStatus.html',
                    // className : 'group_info_inner',
                    auto: true,
                    data: {
                        res: res,
                        msgId: msgId
                    },
                    controller: "largeFileReceiveStatusController"
                })
                // console.log(res);
            })
        })
        // 大文件接收方接收文件
        dom.find('.receive').click(function () { // 接收大文件
            frameService.downLoad({
                id: msgId
            }, function (res) {
                if (res.Data) {
                    changeMsgUI(res.Data);
                }
            })
        })
        // 大文件接收方拒绝大文件 等于 取消接收
        dom.find('.reject').click(function () { // 
            frameService.cancelTransfer({
                id: msgId
            }, function (res) {
                changeMsgUI({
                    Id: msgId,
                    Status: 2
                })
            })
        })
        // 大文件发送方取消发送
        dom.find('.cancel_send').click(function () {
            frameService.cancelTransfer({
                id: msgId
            })
        })
        // 服务号消息查看详情
        dom.find('.msg_servive_wrap').click(function () {
            frameService.openMsg({
                id: msgId,
                type: 0
            })
            return false;
        })
        // 打开服务号消息
        // dom.find('.go_service_detail').click(function(){
        // frameService.openMsg({
        // id : msgId,
        // type : 0
        // })
        // return false;
        // })
        // dom = null;
    }
    function playVideo(msgId) {
        frameService.play(msgId, function () {
        })
    }
    $scope.playVoice = function (msg) {
        var msgId = msg.id;
        playVoice(msgId);
    }
    var playTimer, playing;
    function playVoice(msgId) {
        var _dom = document.getElementById('msg_' + msgId);
        dom = $(_dom);
        if (dom.find('.playing').size()) {
            $interval.cancel(playTimer);
            frameService.stop(function () {
                $('.playing').removeClass('playing');
                dom.find('.voice_time').html(dom.find('.voice_time').attr('time') + '\'\'');
            });
            return;
        }
        if (playing) {
            var _dom = document.getElementById('msg_' + playing);
            var playingDom = $(_dom);
            playingDom.find('.voice_time').html(playingDom.find('.voice_time').attr('time') + '\'\'');
        }
        $interval.cancel(playTimer);
        playing = msgId;
        dom.find('.unread').hide();
        frameService.play(msgId, function () {
            $('.playing').removeClass('playing');
            dom.find('.voice_icon').addClass('playing');
            var time = dom.find('.voice_time').attr('time');
            time = parseInt(time);
            playTimer = $interval(function () {
                if (time <= 0) {
                    $interval.cancel(playTimer);
                    dom.find('.voice_icon').removeClass('playing');
                    dom.find('.voice_time').html(dom.find('.voice_time').attr('time') + '\'\'');
                    return;
                }
                time = time - 1;
                dom.find('.voice_time').html(time + '\'\'');
            }, 1000);
        })
    }
    $scope.$on('deleteChat', function (ev, chatId) {
        var wrapId = 'msgList_' + chatId;
        delete lastestShowMsgTime[chatId];
        if (msgListWrap[wrapId]) {
            msgListWrap[wrapId].remove();
            delete msgListWrap[wrapId];
            msgListWrap.length -= 1;
        }
    })
    $scope.$on('clearMsgs', function () {
        var chatId = $scope.chatData.currentChat;
        $scope.lockScroll = true;
        var dom = document.getElementById('msgList_' + chatId);
        $(dom).children().remove();
        delete lastestShowMsgTime[chatId];
        chatService.clearLastMsgTime(chatId);
        var chat = chatService.getChat(chatId);
        $timeout(function () {
            chat.MsgContent = '';
            chat.MsgTimestamp = '';
        })
        setTimeout(function () {
            $scope.lockScroll = false;
        }, 100)
    })
}]);
controllers.controller('editorController', ['$stateParams', '$scope', 'empService', 'chatService', 'domain', 'util', '$timeout', 'pops', 'concatService', 'webConfig', 'servers', '$rootScope', '$compile', 'langPack', 'socketConnect', 'ajaxService', 'frameService', 'rtcRoomObj','getChatIdInfo', function ($params, $scope, empService, chatService, domain, util, $timeout, pops, concatService, webConfig, servers, $rootScope, $compile, langPack, socketConnect, ajaxService, frameService, rtcRoomObj,getChatIdInfo) {
    var $editArea = $('#msg_edit_area');
    var editArea = $editArea[0];
    var area = editArea;
    var atEmpContainer;
    var atPos, atContainer;
    // console.log($params)
    var parent = editArea.parentNode;
    var posHelper = document.getElementById('caretPosHelper');
    var editSelection, editRange;
    $scope.showLargePC = false;
    $scope.showHistoryBtn = true;
    // editArea.addEventListener('drop',function(e){
    // console.log(e.dataTransfer.files.length);
    // e.preventDefault();
    // })
    $scope.msg = {
        msgContent: ''
    }
    var tempContent = {};
    $scope.$watch('chatData.currentChat', function (v, old) {
        atEmpContainer = undefined;
        atPos = undefined, atContainer = undefined;
        $scope.atEmpScope = undefined;
        if (old) {
            var chat = chatService.getChat(old);
            if (chat) {
                if (!$scope.msg.msgContent) {
                    chat.msgTemp = '';
                    tempContent[old] = '';
                } else {
                    if (!/^\s*(\s*<br\s*\/*>\s*\n*)*\s*$/.test($scope.msg.msgContent)) {
                        chat.msgTemp = $scope.msg.msgContent;
                        tempContent[old] = $scope.msg.msgContent;
                    } else {
                        chat.msgTemp = '';
                        tempContent[old] = '';
                    }
                }
            }
        }
        if (v) {
            if (tempContent[v]) {
                $timeout(function () {
                    $scope.msg.msgContent = tempContent[v];
                    setTimeout(function () {
                        var childs = editArea.childNodes;
                        if (childs.length) {
                            editArea.focus();
                            var lastChild = childs[childs.length - 1];
                            var sel = editSelection || window.getSelection();
                            var range = editRange || sel.getRangeAt(0);
                            range.setStartAfter(lastChild);
                            range.setEndAfter(lastChild);
                            sel.removeAllRanges();
                            sel.addRange(range);
                            setSelection();
                        }
                    })
                })
            } else {
                $scope.msg.msgContent = '';
                editArea.focus();
                editAreaFocus();
                setSelection();
            }
            $scope.showHistoryBtn = !util.isService(v);
        }
        // $scope.inertHtmlToEditArea('');
    });
    setTimeout(function () {
        editArea.focus();
        editAreaFocus();
        setSelection();
    }, 20);
    function setInRange(node) {
        if (node.tagName == "IMG") {
            var sel = editSelection || window.getSelection();
            var range = editRange || sel.getRangeAt(0);
            // range.collapse(true);
            range.selectNode(node);
            // range.setStartBefore(node);
            // range.setEndAfter(node);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };
    $scope.showFace = function (e) {
        pops.openDialog({
            scope: $scope,
            data: {
                parent: $scope
            },
            templateUrl: 'face.html',
            container: $('#tool_bar'),
            controller: 'faceController',
            isDialog: true,
            className: 'face_dialog',
            left: 0,
            top: 'auto'
        })
        e.preventDefault();
    }
    // 发起视频通话 1v1
    $scope.goVideoCall =    function () {
        if( rtcRoomObj.getData()){
            return alert('当前正在进行视频会议，请先关闭后在创建房间');
        }
        //  return;
        // 个人信息
        let userList = webConfig.getUser();
        let jjtoken = userList.Token;
        let userid = userList.Id;
        // let img= userList.Avatar!=''?window.location.origin+userList.Avatar:"http://org.jj.woniu.com/IM/avatars/snail_woman.png";// 正式开发使用
        let img = userList.Avatar != '' ?  userList.Avatar:userList.Gender==0?"../images/video/defaultHeadImage.jpg":"http://org.jj.woniu.com/IM/avatars/snail_woman.png";// 开发 域名不正确 测试使用
        let name = userList.Name;
        var phone = userList.Mobile;
        // 对方id
        let concatId = $scope.chatData.currentChat;
        // 获取聊天信息 查询对方 信息
        var chat = chatService.getChat(concatId);
        // let params = { userId:concatId};
        // 使用 async/await 等待异步 调用接口 factory（getChatIdInfo函数）自定义方法封装 等待接口返回 获取联系人的个人信息 
        // let ChatIdInfo = await getChatIdInfo(JSON.stringify(params), 'user/getAllInfoById');
        // console.log(ChatIdInfo)
        console.log(chat);
        // callCefMethod('user/getAllInfoById', { userId:"5bfcdc99aa55498aa1c5da6be672c136" }, function (res) { 
        //     console.log(res)
        // })
        //获取 生成房间号函数
        var guid = new GUID();
        // 生成房间号
        let roomid = guid.newGUID();
         //查询是否允许进入会议
        chatService.CanJoinRoom(roomid,function(res){
            if((res.Code != 0 || res.Flag != 0 ) && !res.Data){
                return alert('无法进入该房间')
            }else{
                // alert('允许进入会议');
            }
        });
        // console.log('是视频房间号：' + roomid);
      
        // jj.fetch("frame/open", JSON.stringify({ data: { id: "vidioMeeting",name:"视频会议", width: 1080, height: 680, contentPath: "vidioMeeting.html", isModal: false, draggable: true, resizable:true}, callback: "callback" }));

        // callCefMethod("frame/open",  { id: "vidioMeeting",name:"视频会议", width: 1080, height: 680, contentPath: "vidioMeeting.html", isModal: false, draggable: true, resizable:true},function(res){
        //     console.log(res)
        // }); chooseUser  vidioMeeting
        let roomObj = {
            chatRoomId: [],
            img: img,
            roomid: roomid,//'88888888' ||
            jjtoken: jjtoken,
            phone: phone,
            userId: userid,
            username: name,
            status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
            mode: 'video',// 房间模式 视频 + 音频
            medias: 'av',//流属性 视频+音频
            master: userid,//会议发起人（房主）
            manager: [],//会议管理员
            ClientId: chat.Id,//服务端生成的id
            ClientKey: userid,//  登录的KEY 是静静id
            // id-用户id  n-用户name名 i-用户头像
            selected: [
                {
                    id: userid,
                    name: name,
                    img: img,
                    status: '0', //成员状态 0-待加入 1-在线 2-断线  3-离开
                    audioPause: false, //是否暂停音频流
                    videoPause: false,
                    mode: 'video',//房间模式 video 视频+音频  seceen-屏幕共享
                    medias: '',//流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    master: '',//房主 值等于用户id
                    manager: '',//会议管理员
                    ClientKey: userid,//静静id
                    ClientId:  chat.Id,//服务端生成的id
                    Zoom: 0, //显示的屏幕缩放的大小
                },
                {
                    id: concatId, name: chat.Name || chat.name, img: chat.Avatar ? chat.Avatar : "http://org.jj.woniu.com/IM/avatars/snail_woman.png", status: '0', audioPause: false, //是否暂停音频流
                    videoPause: false,
                    mode: "video", // video 摄像头  seceen-屏幕共享
                    medias: "", //流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    orderSwitch: false,//是否订阅过
                    master: '',//房主 值等于用户id
                    manager: '',//会议管理员 
                    ClientKey: concatId,//静静id
                    ClientId:  userid,//对方的 ClientId  服务端生成的id 发送消息调用
                    Zoom: 0, //显示的屏幕缩放的大小
                }
            ],//选中的加入视频会议人员列表
        };
        // 发送的消息id 对方id或者群id 判断多人还是单人
        roomObj.chatRoomId.push(concatId)
        // 发送 会议邀请 数据容器  视频会议控制器 从这里取值
        // rtcRoomObj.msg = roomObj;
        rtcRoomObj.setData(roomObj);

       // 单人 multiplayer: false  打开视频通话窗口显示   selected需要发送消息的成员id 消息内容  NoticeMainInviteMsg 
       var content = { multiplayer: false, "chatRoomId": concatId, "message": '视频会议邀请', "n_TYPE": 10, "voiceMeetingType": "invite", "voiceRoomKey": roomid };
        frameService.open('vidioMeeting', 'vidioMeeting.html', {
            action: 'new',
            msgContent: JSON.stringify(content),// 发送的消息内容
            selected:  JSON.stringify(roomObj.chatRoomId), // 发送 邀请消息的消息体
            roomObj: JSON.stringify(roomObj),//视频会议信息跟在URL后面传入 视频会议页
        }, 1080, 680, false, langPack.getKey('startChat'), true, true);

        // "width":1080,"height":680,"isModal":false,"draggable":true,"resizable":true};
        
        //   // 获取融云token
        //   callCefMethod('account/loginRongYun', {}, function (res) {
        //     if (res.Code == 0) {
        //         let data = JSON.parse(res.Data);
        //         if (data.rongYunToken.code = 200) {
        //             // 解码
        //             var str = decodeURIComponent(data.rongYunToken.reqBody)
        //             var jsonList = {};
        //             var strs = str.split("&");
        //             for (var i = 0; i < strs.length; i++) {
        //                 jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1];
        //             }
        //             let roomObj = {
        //                 appKey: 'cpj2xarlcm2jn',
        //                 img: jsonList.portraitUri,
        //                 roomid: roomid,
        //                 jjtoken: jjtoken,
        //                 phone:phone,
        //                 rytoken: data.rongYunToken.token,
        //                 userId:jsonList.userId,
        //                 username: name,
        //                 // id-用户id  n-用户name名 i-用户头像
        //                 selected:[{id:jsonList.userId,n:name,i:jsonList.portraitUri,status:'0'},{id:concatId,n:chat.Name,i:'',status:'0'}],//选中的加入视频会议人员列表
        //             };
        //             // 本次视频会议是自己发起的 选中的会议成员列表 点击接听时调用
        //             // $('#'+roomid).find('.msg_video_agree').attr('data-vSelected',JSON.stringify(roomObj.selected));
        //             // encodeURIComponent 现将json（roomObj）转换为字符串再进行编码
        //             window.open("http://172.18.70.26:8080/?obj=" + encodeURIComponent(JSON.stringify(roomObj)));
        //         }
        //         console.log(data);

        //     }
        // });


    }
    // 发起多人视频通话 
    $scope.videoselected = function () {
        if( rtcRoomObj.getData()){
            return alert('当前正在进行视频会议，请先关闭后在创建房间');
        }
        // 获取群 信息
        // concatService.getGroup(chat.id,function(res){
        //     if(res.Code == 0){

        //         console.log(res.Data.Members);
        //         console.log(chat);
        //         $scope.delChecked = false;
        //         var params = {};
        //         // add为默认群里的全部人员并且无法去除  new新建添加视频的人数 弹出类型  添加视频通话人数 
        //         params.action = 'new';
        //         params.groupId = chat.id;//群 id
        //         params.grouplist =  encodeURIComponent(JSON.stringify(res.Data.Members)); // 群成员列表 将json 转换为字符串再进行encodeURIComponent编码 使用decodeURIComponent 解码
        //         params.groupName = encodeURIComponent(res.Data.ShowName); // 群名称
        //         params.videoConference = true,//多人视频控制器
        //         frameService.open('chooseUser', 'choose.html', params, 600, 550, true, langPack.getKey('videoConference'));
        //     }
        //    })
        // 获取群id 信息
        var chat = chatService.getChat($scope.chatData.currentChat);
        console.log(chat);
        $scope.delChecked = false;
        var params = {};
        // add为默认群里的全部人员并且无法去除  new新建添加视频的人数 弹出类型  添加视频通话人数 
        // params.action = 'new';
        params.groupId = chat.id;//群 id
        params.videoConference = true;//多人视频控制器
        params.groupName = chat.Name || chat.ShowName;// 群名称
        frameService.open('chooseUser', 'choose.html', params, 600, 550, true, langPack.getKey('videoConference'));
    }

    // 预约视频会议 - 创建 预约 多人视频通话 
    $scope.videoMakeAnAppointment = function(){
        // var content = {"beginTime":"2022-03-01 13:40","creator":{"name":" 邢鑫","userId":"f43245bd9824430b973fbf57320bb38b"},"meetingRoomKey":"rtc_164611306885717","meetingType":"video","members":[{"name":"123","userId":"5bfcdc99aa55498aa1c5da6be672c136"}],"multiplayer":false,"n_TYPE":12,"optionType":"cancel","subject":"测试"};

        // 创建预约会议 roomKey 传空
        // callCefMethod('chat/SaveAppointmentMeeting', {"roomKey": "","subject": "测试预约接口", "meetingType": "video", "beginTime": "2021-12-30 16:26", "members": ["5bfcdc99aa55498aa1c5da6be672c136"]}, function (res) {
        //     console.log(res);
        //     // callback && callback(res);
        // })
        let params = {};
        //  new新建 预约视频会议
        params.action = 'new';
        frameService.open('BookAMeeting', 'BookAMeeting.html', params, 350, 550, true, '预约会议');
        // jj.fetch('chat/SaveAppointmentMeeting', JSON.stringify({ data: {"roomKey": "","subject": "下周工作安排1", "meetingType": "voice", "beginTime": "2021-12-30 16:26", "members": ["5bfcdc99aa55498aa1c5da6be672c136"]  }, callback: "callback" }))
//保存预约会议
// jj.fetch("chat/SaveAppointmentMeeting", JSON.stringify({ data: { "roomKey": "rtc_164076724767039", "subject": "下周工作安排1", "meetingType": "voice", "beginTime": "2021-12-30 16:26", "members": ["8c0f2a0f9e1d49f59fde5092fa7cff9d", "d6de88cdd0be414ba9b4c44269c4de25", "d7b9ae1297e142ffb64be64ba7d8dae7"] }, callback: "callback" }));

// jj.fetch("chat/SaveAppointmentMeeting", JSON.stringify({ data: { "subject": "下周工作安排1", "meetingType": "voice", "beginTime": "2021-12-30 16:26", "members": ["8c0f2a0f9e1d49f59fde5092fa7cff9d", "d6de88cdd0be414ba9b4c44269c4de25", "d7b9ae1297e142ffb64be64ba7d8dae7"] }, callback: "callback" }));
// //取消预约会议
// jj.fetch("chat/CancelAppointmentMeeting", JSON.stringify({ data: { "roomKey": "rtc_164620707334138" }, callback: "callback" }));

        // if( rtcRoomObj.getData()){
        //     return alert('当前正在进行视频会议，请先关闭后在创建房间');
        // };
          // 获取群id 信息
        //   var chat = chatService.getChat($scope.chatData.currentChat);
        //   console.log(chat);
        //   $scope.delChecked = false;
        //   var params = {};
        //   // add为默认群里的全部人员并且无法去除  new新建添加视频的人数 弹出类型  添加视频通话人数 
        //   // params.action = 'new';
        //   params.groupId = chat.id;//群 id
        //   params.videoMakeAnAppointment = true;//预约 多人视频会议控制器
        //   params.groupName = chat.Name || chat.ShowName;// 群名称
        //   frameService.open('chooseUser', 'choose.html', params, 600, 550, true, langPack.getKey('videoConference'));
    }
    // 创建视频会议生成房间号 roomid
    function GUID() {
        this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
        if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
            GUID.prototype.newGUID = function () {
                this.date = new Date(); var guidStr = '';
                sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                for (var i = 0; i < 9; i++) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                guidStr += sexadecimalDate;
                guidStr += sexadecimalTime;
                while (guidStr.length < 32) {
                    guidStr += Math.floor(Math.random() * 16).toString(16);
                }
                return this.formatGUID(guidStr);
            }
            /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
            GUID.prototype.getGUIDDate = function () {
                return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
            }
            /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
            GUID.prototype.getGUIDTime = function () {
                return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
            }
            /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
            GUID.prototype.addZero = function (num) {
                if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                    return '0' + Math.floor(num);
                } else {
                    return num.toString();
                }
            }
				/*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
                if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
                else { return parseInt(num.toString()).toString(x); }
            }
            /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
            GUID.prototype.formatGUID = function (guidStr) {
                var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
                return str1 + str2 + str3 + str4 + str5;
            }
        }
    }
    $scope.capture = function (e) {
        frameService.capture(function (res) {
            var img = new Image();
            img.src = res.Data;
            $scope.inertHtmlToEditArea(img.outerHTML);
        });
        e && e.preventDefault();
    }
    $scope.insertHtmlByCommand = function (html, brCount) {
        var sel = editSelection;
        html = html + '<span id="insert_helper" style="position:absolute;left:auto;top:auto;z-index:99999;"></span>';
        if (editRange) {
            if (editRange.commonAncestorContainer = !editArea || (editRange.commonAncestorContainer != editArea && $editArea.find(editRange.commonAncestorContainer).size() == 0)) {
                editAreaFocus();
                setSelection();
            }
            editSelection.removeAllRanges(editRange);
            editSelection.addRange(editRange);
            var endContainer = editRange.endContainer;
            if (endContainer.nodeType == 3) {
                var text = endContainer.nodeValue;
                if (text.length == editRange.endOffset) {
                    if (endContainer.nextElementSibling && endContainer.nextElementSibling.tagName == 'BR') {
                        html = html + '<br>';
                    }
                }
            }
        }
        $timeout(function () {
            var oldScrollHeight = area.scrollHeight;
            var scrollTop = area.scrollTop;
            document.execCommand('insertHTML', false, html);
            $scope.msg.msgContent = area.innerHTML;
            if (editSelection && editRange) {
                editSelection.removeAllRanges(editRange);
            }
            setTimeout(function () {
                // console.log(area.scrollTop)
                var correctScrollTop = area.scrollTop;
                if (correctScrollTop != scrollTop) {
                    correctScrollTop = scrollTop;
                }
                scrollEditArea(oldScrollHeight, brCount, correctScrollTop);
            });
        })
        return;
    }
    function scrollEditArea(oldScrollHeight, brCount, correctScrollTop) {
        var areaHeight = area.clientHeight;
        setTimeout(function () {
            var helper = document.getElementById('insert_helper');
            if (helper) {
                var addHeight = area.scrollHeight - oldScrollHeight;
                var helperOffsetTop = helper.offsetTop;
                if (helperOffsetTop >= area.scrollHeight - 10) { // 超过最大滚动距离，减去panddingTop
                    area.scrollTop = area.scrollHeight - areaHeight;
                } else {
                    var lines = Math.ceil((helperOffsetTop - areaHeight + addHeight) / 22);
                    if (helperOffsetTop >= (area.scrollTop + areaHeight - 10)) {
                        var lines = Math.ceil((helperOffsetTop - areaHeight) / 22) + 1;
                        area.scrollTop = lines * 22;
                    } else {
                        if (helperOffsetTop < area.scrollTop) {
                            area.scrollTop = helperOffsetTop;
                        } else {
                            if (correctScrollTop != area.scrollTop) {
                                area.scrollTop = Math.max(lines * 22, correctScrollTop);
                            }
                        }
                    }
                }
                if (editSelection && editRange) {
                    var focusNode = editSelection.focusNode;
                    editSelection.removeAllRanges(editRange);
                    if (brCount == 2) {
                        editRange.setStartBefore(helper.previousElementSibling);
                        editRange.setEndBefore(helper.previousElementSibling);
                    } else {
                        editRange.setStartBefore(helper);
                        editRange.setEndBefore(helper);
                    }
                    editSelection.addRange(editRange);
                }
                helper.parentNode.removeChild(helper);
                $scope.msg.msgContent = area.innerHTML;
            }
        })
    }
    function getSelectionCoords(win) {
        win = win || window;
        var doc = win.document;
        var sel = doc.selection, range, rects, rect;
        var x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                range.collapse(true);
                x = range.boundingLeft;
                y = range.boundingTop;
            }
        } else if (win.getSelection) {
            sel = win.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getClientRects) {
                    range.collapse(true);
                    rects = range.getClientRects();
                    if (rects.length > 0) {
                        rect = rects[0];
                    }
                    // 光标在行首时，rect为undefined
                    if (rect) {
                        x = rect.left;
                        y = rect.top;
                    }
                }
                // Fall back to inserting a temporary element
                if ((x == 0 && y == 0) || rect === undefined) {
                    var span = doc.createElement("span");
                    if (span.getClientRects) {
                        // Ensure span has dimensions and position by
                        // adding a zero-width space character
                        span.appendChild(doc.createTextNode("\u200b"));
                        range.insertNode(span);
                        rect = span.getClientRects()[0];
                        x = rect.left;
                        y = rect.top;
                        var spanParent = span.parentNode;
                        spanParent.removeChild(span);

                        // Glue any broken text nodes back together
                        spanParent.normalize();
                    }
                }
            }
        }
        return { x: x, y: y };
    }
    $scope.inertHtmlToEditArea = function (html) {
        var temp = document.getElementById('temp_span');
        if (temp) {
            $(temp).remove();
        }
        if (editRange) {
            if (editRange.commonAncestorContainer = !editArea || (editRange.commonAncestorContainer != editArea && $editArea.find(editRange.commonAncestorContainer).size() == 0)) {
                editAreaFocus();
                setSelection();
            }
            editSelection.removeAllRanges(editRange);
            editSelection.addRange(editRange);
        }
        var sel = editSelection || window.getSelection();
        html += '<span id="temp_span"></span>';
        insertHtmlAtCaret(html);
        $scope.msg.msgContent = editArea.innerHTML;
        $timeout(function () {
            temp = document.getElementById('temp_span');
            var range = editRange || sel.getRangeAt(0);
            range.setStartBefore(temp);
            range.setEndBefore(temp);
            range.collapse(true);
            range.deleteContents();
            sel.removeAllRanges();
            sel.addRange(range);
            $(temp).remove();
            $scope.msg.msgContent = editArea.innerHTML;
        });
    }
    function setSelection() {
        if (document.getSelection) {
            editSelection = document.getSelection();
            if (editSelection.rangeCount) {
                editRange = editSelection.getRangeAt(0);
            }
        } else {
            editRange = document.selection.createRange();
        }
    }

    function selectRange() {
        editRange ? window.getSelection ? (editSelection.removeAllRanges(), editSelection.addRange(editRange), editRange.collapse(false)) : editRange.select() : editAreaFocus();
    }
    function editAreaFocus() {
        var e, t;
        if (document.createRange) {
            e = document.createRange();
            e.selectNodeContents(editArea);
            e.collapse(false);
            t = window.getSelection();
            t.removeAllRanges();
            t.addRange(e);
        } else {
            document.selection && (e = document.body.createTextRange(), e.moveToElementText(editArea), e.collapse(false), e.select());
        }
    }
    var selectedImgs = [], inSelectAreaImg = [];
    $scope.editAreaClick = function (e) {
        seeAtMsg = false;
        atEmpContainer = undefined;
        setSelection();
        var node = e.target;
        var selection = document.getSelection();
        var range = selection.getRangeAt(0);
        var selectingContent = range.cloneContents();
        var childNodes = selectingContent.childNodes;
        setTimeout(function () {
            setSelection();
            if (node && node.tagName == 'IMG') {
                setInRange(node);
                $editArea.find('.selected_img').removeClass('selected_img');
                $(node).addClass('selected_img');
            } else {
                $editArea.find('.selected_img').removeClass('selected_img');
            }
            selectImgInRange();
            selectedImgs = [];
            inSelectAreaImg = [];
        })
    }
    $scope.editAreaInput = function (e) {
        seeAtMsg = false;
        collapseRange();
    }
    var posHelperOffset = {};
    function resetPosHelper() {
        if (window.getSelection) {
            var range = window.getSelection().getRangeAt(0).cloneRange();
            range.insertNode(posHelper);
            posHelperOffset.left = posHelper.offsetLeft;
            posHelperOffset.top = posHelper.offsetTop - editArea.scrollTop;
            parent.appendChild(posHelper);
        }
    }
    function collapseRange() {
        if (window.getSelection) {
            setSelection();
            if (editRange.endContainer.nodeType != 3) {
                editRange.collapse(false);
            }
        }
    }
    $scope.atEmp = {
        keyword: ''
    }
    var atEmpContainer = undefined;
    var atPos = undefined;
    var brIdx = 1;
    $scope.keyDownSend = function (e) {
        // setSelection();
        if (e.keyCode == util.KEYMAP.TAB) {
            e.preventDefault();
        }
        if (e.keyCode >= util.KEYMAP.LEFT && e.keyCode <= util.KEYMAP.DOWN) {
            if ($editArea.find('.selected_img').size()) {
                $editArea.find('.selected_img').removeClass('selected_img');
            }
        }
        if ($scope.atEmpScope && $scope.atEmpScope.result.length && (e.keyCode == util.KEYMAP.UP || e.keyCode == util.KEYMAP.DOWN || e.keyCode == util.KEYMAP.ENTER)) {
            e.preventDefault();
            if (e.keyCode == util.KEYMAP.ENTER) {
                if ($scope.atEmpScope.index == -1) return;
                var _keyword = util.replaceMetaStr($scope.atEmp.keyword);
                var reg = new RegExp('@' + _keyword, 'g');
                var child = editArea.childNodes;
                var totalLen = 0;
                for (var i = 0; i < child.length; i++) {
                    if (child[i].nodeType == 3) {
                        if (atContainer == child[i]) {
                            break;
                        }
                        totalLen += (child[i].whileContent || child[i]).length;
                    }
                }
                if (atContainer.textContent == '@' + $scope.atEmp.keyword || atContainer.textContent == '＠' + $scope.atEmp.keyword) {
                    atContainer.textContent = '';
                } else {
                    atContainer.textContent = atContainer.textContent.replace(reg, function (v, pos) {
                        if (pos + totalLen == atPos - 1) return '';
                        return v;
                    })
                    var _keyword = util.replaceMetaStr($scope.atEmp.keyword);
                    atContainer.textContent = atContainer.textContent.replace(new RegExp('＠' + _keyword, 'g'), function (v, pos) {
                        if (pos + totalLen == atPos - 1) return '';
                        return v;
                    })
                }
                if (atContainer) {
                    editRange.setStartAfter(atContainer);
                    editRange.setEndAfter(atContainer);
                    editSelection.removeAllRanges();
                    editSelection.addRange(editRange);
                }
                $scope.atEmpScope.keydown(e);
                $scope.atEmpScope = undefined;
            } else {
                $scope.atEmpScope.keydown(e);
            }
            return;
        }

        area = area || document.getElementById('msg_edit_area');
        var sendType = $scope.userSetting ? $scope.userSetting.SendMsgMode : '0';
        if (e.keyCode == util.KEYMAP.ENTER) {
            // $scope.msg.msgContent = area.innerHTML;
            e.preventDefault();
            if (e.ctrlKey && sendType == '0' || !e.ctrlKey && sendType == '1') {
                var br = '<br />';
                // var br = '<br idx="'+brIdx+'"/>';
                // brIdx ++;
                var brCount = 1;
                if (!util.browser.msie && window.getSelection) {
                    var sel = window.getSelection();
                    var focusOffset = sel.focusOffset;
                    var focusNode = window.getSelection().focusNode;
                    if (focusNode && focusNode != editArea) {
                        if (focusNode.nodeType == 3) {
                            if (focusOffset != 0 && focusNode.wholeText.length == focusOffset) {
                                // br += '<br idx="'+brIdx+'"/>';
                                // brIdx ++;
                                br += br;
                                brCount = 2;
                            }
                        } else {
                            var next = window.getSelection().focusNode.nextSibling;
                            do
                                if (!next || next.nodeValue || "BR" == next.tagName || next.id == 'caretPosHelper')
                                    break;
                            while (next = next.nextSibling);
                            if (!next) {

                            } else {
                                if ($scope.msg.msgContent == '' || next.tagName == 'BR') {
                                    // br += '<br idx="'+brIdx+'"/>';
                                    // brIdx ++;
                                    br += br;
                                    brCount = 2;
                                }
                            }
                        }
                    } else {
                        // br += '<br idx="'+brIdx+'"/>';
                        // brIdx ++;
                        br += br;
                        brCount = 2;
                    }
                }
                var oldScrollHeight = area.scrollHeight;
                $scope.insertHtmlByCommand(br, brCount);
                // scrollEditArea(oldScrollHeight);
            }
            if (e.ctrlKey && sendType == '1' || !e.ctrlKey && sendType == '0') {
                $scope.sendTextMsg();
                e.preventDefault();
                e.stopPropagation();
            }
        }
        if (e.keyCode == util.KEYMAP.S && e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            $scope.sendTextMsg();
        }
    }
    function initAtEmp() {
        atEmpContainer && atEmpContainer.remove();
        $scope.atEmpScope && $scope.atEmpScope.$destroy();
        var containerId = pops.openDialog({
            scope: {
                inertHtmlToEditArea: $scope.inertHtmlToEditArea,
                style: {
                    left: posHelperOffset.left,
                    top: posHelperOffset.top
                }
            },
            data: {
                chatId: $scope.chatData.currentChat,
                parentScope: $scope
            },
            templateUrl: 'at_emp.html',
            container: $('#edit_area_warper'),
            controller: 'atEmpController',
            isDialog: true,
            left: posHelperOffset.left,
            top: posHelperOffset.top
        })
        atEmpContainer = $('#' + containerId);
    }
    $scope.$on('atEmpControllerDestroy', function () {
        // atEmpContainer = undefined;
        // atPos = undefined;
        // atContainer = undefined;
        delete $scope.atEmpScope;
    })
    $scope.resetAtEmp = function () {
        atEmpContainer = undefined;
        atPos = undefined;
        atContainer = undefined;
        delete $scope.atEmpScope;
    }
    var sending = {};
    $scope.sendTextMsg = (function () {
        var forbidden = false;
        var lastSendTime = 0;
        var max = 5, minSeconds = 1000;
        var count = 0;
        var stopTime = 2000;
        return function () {
            if (forbidden) {
                return;
            };
            var now = util.getNow();
            if (lastSendTime) {
                if (now - lastSendTime < minSeconds) {
                    count++;
                }
                if (count >= max) {
                    forbidden = true;
                }
            } else {
                count++;
            }
            lastSendTime = util.getNow();
            setTimeout(function () {
                forbidden = false;
                lastSendTime = 0;
                count = 0;
            }, stopTime);
            var res = splitContent();
            var reg1 = /^\s+|\s+$/g;
            var isOneBr = /^<br\s*\/*>$/;
            var preEnd = /<\/pre>$/;
            if (res.length) {
                for (var i = 0; i < res.length; i++) {
                    var content = res[i];
                    if (typeof content == 'string') {
                        content = content.replace(preEnd, '');
                        if (content != '' && !isOneBr.test(content)) {
                            content = chatService.convertMsg(content);
                            if (content.length > 10000) {
                                alert(langPack.getKey('msgTooLong'));
                                return;
                            }
                            var msg = createMessage($scope.chatData.currentChat, webConfig.MSG_TYPE_MAP[webConfig.MSG_TEXT_TYPE], content);
                            sendMsg(msg);
                        }
                    } else {
                        var src = content.src;
                        var size = 0;
                        var file = {
                            Path: src,
                            Size: size
                        };
                        var nameArr = src.split('/');
                        var name = nameArr[nameArr.length - 1];
                        try {
                            name = decodeURIComponent(name);
                        } catch (e) {
                        }
                        var message = createMessage($scope.chatData.currentChat, webConfig.MSG_TYPE_MAP[webConfig.MSG_PIC_TYPE], name, file);
                        sendMsg(message);
                    }
                }
                $scope.msg.msgContent = '';
                delete tempContent[$scope.chatData.currentChat];
            }
        }
    })();
    function createMessage(chatId, msgType, content, file, thumb) {
        var msg = chatService.createMessage.apply(undefined, arguments);
        var messageId = msg.msg.id;
        sending[messageId] = 1;
        return msg;
    }
    function sendMsg(message) {
        var now = new Date().getTime();
        // $rootScope.$broadcast('sendingMsg',message.msg,message.now);
        chatService.sendMsg(message, function (res) {
            if (res.Data == 0) {
                delete sending[message.msg.id];
            }
        })
    }

    $scope.createMessage = createMessage;
    $scope.sendMsg = sendMsg;

    $scope.sendOnlinFileMsg = function (message) {
        chatService.sendOnlineFileMsg(message, function (res) {
            if (res.Data == 0) {
                delete sending[message.msg.id];
            }
        })
    }

    $scope.chooseFile = function () {
        frameService.getCurrentUser(function (res) {
            if (res.Data.global.IsOfflineFileForbidden) {
                $scope.openLargeFileTransPage();
            } else {
                frameService.fileDialog({
                    extFilter: langPack.getKey('allFiles')
                }, function (res) {
                    var fileList = res.Data;
                    if (fileList) {
                        for (var i = 0; i < fileList.length; i++) {
                            var nameArr = fileList[i].Path.split('/');
                            var name = nameArr[nameArr.length - 1];
                            name = decodeURIComponent(name);
                            var message = createMessage($scope.chatData.currentChat, webConfig.MSG_TYPE_MAP[webConfig.MSG_FILE_TYPE], name, fileList[i]);
                            sendMsg(message);
                        }
                    }
                })
            }
        });
    }
    $scope.chooseImage = function (e) {
        e.preventDefault()
        $editArea.focus();
        frameService.fileDialog({
            extFilter: langPack.getKey('imageFiles')
        }, function (res) {
            var fileList = res.Data;
            if (fileList) {
                var html = '';
                for (var i = 0; i < fileList.length; i++) {
                    html += '<img src="' + fileList[i].Path + '"/>'
                }
                $scope.inertHtmlToEditArea(html);
            }
        })
    }
    $scope.startRecord = function () {
        if ($scope.record.status != 0) return;
        frameService.getCurrentUser(function (res) {
            if (!res.Data.global.IsOfflineFileForbidden) {
                frameService.startRecord(function (res) {
                    $rootScope.$broadcast('startRecord');
                })
            }
        });

    }
    function splitContent(node, res, keep) {
        var tempSpan = $('#temp_span');
        tempSpan.remove();
        var insterHelper = $('#insert_helper');
        insterHelper.remove();
        node = node || editArea;
        res = res || [];
        var childNodes = node.childNodes;
        var cur;
        for (var i = 0; i < childNodes.length; i++) {
            cur = childNodes[i];
            var nodeType = cur.nodeType;
            var prev = res[Math.max(0, res.length - 1)];
            if (!prev) {
                prev = '';
            }
            if (nodeType == 1) {
                var tagName = cur.tagName.toLowerCase();
                if (tagName == 'div') {
                    splitContent(cur, res);
                } else if (tagName == 'img') {
                    if (cur.getAttribute('isface')) {
                        res[Math.max(0, res.length - 1)] = prev + cur.outerHTML;
                    } else {
                        var reg = /\?_=\w+$/g;
                        cur.src = cur.src.replace(reg, '');
                        res.push(cur);
                        res.push('');
                    }
                } else {
                    res[Math.max(0, res.length - 1)] = prev + cur.outerHTML;
                }
            } else if (nodeType == 3) {
                res[Math.max(0, res.length - 1)] = prev + cur.nodeValue;
            }
        }
        if (!keep) {
            for (var i = res.length - 1; i >= 0; i--) {
                if (typeof res[i] == 'string') {
                    res[i] = res[i].replace(/<br\s*\/*>\s*\n*$/, '');
                    res[i] = res[i].replace(/^<br\s*\/*>\s*\n*/, '');
                }
                if (/^\s*(\s*<br\s*\/*>\s*\n*)*\s*$/.test(res[i])) {
                    res.splice(i, 1);
                }
            }
        }
        return res;
    }
    $scope.splitContent = splitContent;
    function insertHtmlAtCaret(html, resetRange) {
        var sel, range;
        sel = editSelection || window.getSelection();
        if (sel.getRangeAt && sel.rangeCount || editRange) {
            range = editRange || sel.getRangeAt(0);
            range.deleteContents();
            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var frag;
            var lastNode;
            if (range.createContextualFragment) {
                frag = range.createContextualFragment(html);
            } else {
                var el = document.createElement("div");
                el.innerHTML = html;
                frag = document.createDocumentFragment(), node;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
            }
            lastNode = frag.lastChild;
            range.insertNode(frag);
            if (lastNode) {
                range.setStartAfter(lastNode);
                range.setEndAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
    var getLastestInput = function () {
        var selection = window.getSelection();
        range = selection.getRangeAt(0).cloneRange();
        range.collapse(true);
        range.setStart(editArea, 0);
        var str = range.toString();
        return str.slice(-1);
    }
    $scope.keyUp = function (e) {
        if ($scope.atEmpScope && e.keyCode == util.KEYMAP.ESC) {
            atEmpContainer && atEmpContainer.remove();
            containerId = '';
            $scope.atEmpScope.$destroy();
            e.stopPropagation();
            return;
        }
        setSelection();
        var chat = chatService.getChat($scope.chatData.currentChat);
        if (e.keyCode == util.KEYMAP['2'] && (getLastestInput() == '@' || getLastestInput() == '＠')) {
            if (chat.isGroup) {
                var selection = window.getSelection();
                var range;
                if (selection.rangeCount > 0) {
                    range = selection.getRangeAt(0).cloneRange();
                    atContainer = range.startContainer;
                    range.collapse(true);
                    range.setStart(editArea, 0);
                    var str = range.toString();
                    atPos = str.length;
                    resetPosHelper();
                }
                $scope.atEmp.keyword = '';
                initAtEmp();
            }
            return;
        } else {
            if (e.keyCode >= util.KEYMAP.LEFT && e.keyCode <= util.KEYMAP.DOWN) {
                setSelection();
            }

            // console.log(e.keyCode)
            $timeout(function () {
                if (atPos !== undefined) {
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        var range = selection.getRangeAt(0).cloneRange();
                        range.collapse(true);
                        range.setStart(editArea, 0);
                        var str = range.toString();
                        var len = str.length;
                        if (len < atPos) {
                            $scope.atEmpScope && $scope.atEmpScope.closeThisPop();
                            atEmpContainer = undefined;
                            atPos = undefined;
                            return;
                        } else {
                            !$scope.atEmpScope && initAtEmp();
                        }
                        var keyword = str.substr(atPos, len);
                        $scope.atEmp.keyword = keyword;
                    }
                }
            }, 50);
        }
        // $scope.rememberRange();
    }
    $scope.rememberRange = function () {
        setSelection();
    }
    $scope.keyPressHandler = function (e) {
        if (e.altKey && e.keyCode == util.KEYMAP.S) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    $scope.editAreaMouseUp = function () {
        var selection = document.getSelection();
        var range = selection.getRangeAt(0);
        var selectingContent = range.cloneContents();
        var childNodes = selectingContent.childNodes;
        if (childNodes.length > 1) {
            for (var i = 0; i < childNodes.length; i++) {
                var node = childNodes[i];
                if (node.tagName == 'IMG') {
                    var idx = node.getAttribute('idx');
                    inSelectAreaImg.push(idx);
                }
            }
        } else {
            if (childNodes.length == 1) {
                var node = childNodes[0];
                if (node.tagName == 'IMG') {
                    var idx = node.getAttribute('idx');
                    selectedImgs.push(idx);
                }
            }
        }
    }
    function selectImg(node) {
        setInRange(node);
        $editArea.find('.selected_img').removeClass('selected_img');
        $(node).addClass('selected_img');
    }
    var selecting = false;
    $editArea.bind('mousedown', function (e) {
        selecting = true;
        selectedImgs = [];
        inSelectAreaImg = [];
        $editArea.find('img').each(function (i) {
            $(this).attr('idx', i);
        })
    });
    $editArea.bind('mouseup', function (e) {
        selecting = false;
        var node = e.target;
        var selection = document.getSelection();
        var range = selection.getRangeAt(0);
        var selectingContent = range.cloneContents();
        var childNodes = selectingContent.childNodes;
        if (node && node.tagName == 'IMG' && (childNodes.length == 1 || childNodes.length == 0)) {
            selectedImgs.push(node.getAttribute('idx'));
        }
        setSelection();
    });
    $editArea.bind('mousemove', function (e) {
        if (!selecting) {
            return;
        }
        selectedImgs = [];
        inSelectAreaImg = [];
        $scope.editAreaMouseUp();
        selectImgInRange();
        setSelection();
    });
    function selectImgInRange() {
        $editArea.find('.select_img').removeClass('select_img');
        $editArea.find('.selected_img').removeClass('selected_img');
        if (selectedImgs.length) {
            var idx = selectedImgs[0];
            $editArea.find('img[idx=' + idx + ']').addClass('selected_img');
            $editArea.find('img[idx=' + idx + ']').removeClass('select_img');
        } else {
            for (var i = 0; i < inSelectAreaImg.length; i++) {
                var idx = inSelectAreaImg[i];
                $editArea.find('img[idx=' + idx + ']').addClass('select_img');
                $editArea.find('img[idx=' + idx + ']').removeClass('selected_img');
            }
        }
    }
    /* 处理拖动文本框中内容 */
    var dragContent;
    $editArea.bind('dragstart', function (e) {
        if (dragContent) {
            e.preventDefault();
            e.stopPropagation();
        }
    })
    $editArea.bind('drag', function (e) {
        if (e.target) {
            var selection = document.getSelection();
            var range = selection.getRangeAt(0);
            dragContent = range.cloneContents();
            var childNodes = dragContent.childNodes;
            var len = childNodes.length;
            if (len == 1) {
                var tarName = childNodes[0].tagName;
                if (tarName == 'IMG') {
                    selectImg(e.target);
                }
            }
            e.stopPropagation();
        } else {

        }
        e.preventDefault();
        return false;
    })

    $editArea.bind('dropmove', function (e) {
        if (dragContent) {
            e.preventDefault();
            e.stopPropagation();
        }
    })
    $editArea.bind('dragend', function (e) {
        if (dragContent) {
            var selection = document.getSelection();
            var range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(dragContent);
            selection.removeAllRanges();
            selection.addRange(range);
            dragContent = undefined;
        }
    })
    $editArea.bind('drop', function (e) {
        var selection = document.getSelection();
        var chatId = $scope.chatData.currentChat;
        var range = selection.getRangeAt(0);
        if (!dragContent) {
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
            if (hasFiles) {
                frameService.getCurrentUser(function (res) {
                    var isOfflineFileForbidden = res.Data.global.IsOfflineFileForbidden;
                    // var isOfflineFileForbidden = true;
                    var fileDomain = res.Data.global.LocalDomain;
                    // fileDomain = fileDomain ? fileDomain + '/' : '';
                    var _fileDomain = util.replaceMetaStr(fileDomain);
                    var fileDomainReg = new RegExp('^' + _fileDomain);
                    frameService.getDragFiles(function (res) {
                        var fileList = res.Data;
                        var hasDir = false;
                        var list = [];
                        if (!isOfflineFileForbidden) {
                            var hasTooLargeFile = false;
                            for (var i = 0; i < fileList.length; i++) {
                                if (fileList[i].Size > webConfig.MAX_FILE_SIZE) {
                                    hasTooLargeFile = true;
                                    break;
                                }
                            }
                            if (hasTooLargeFile) {
                                alert(langPack.getKey(fileList.length == 1 ? 'fileTooLarge' : 'tooLargeFile'));
                                return;
                            }
                        }
                        for (var i = 0; i < fileList.length; i++) {
                            if (fileList[i].IsDirectory && !isOfflineFileForbidden) {
                                hasDir = true;
                                continue;
                            };
                            if (isOfflineFileForbidden) {
                                list.push({
                                    // Path : fileDomain ? fileList[i].Path.replace(fileDomainReg,'') : fileList[i].Path,
                                    Path: fileList[i].Path,
                                    Size: fileList[i].Size,
                                    IsDirectory: fileList[i].IsDirectory
                                });
                            } else {
                                var nameArr = fileList[i].Path.split('/');
                                var name = nameArr[nameArr.length - 1];
                                name = decodeURIComponent(name);
                                var message = createMessage($scope.chatData.currentChat, webConfig.MSG_TYPE_MAP[webConfig.MSG_FILE_TYPE], name, {
                                    Path: fileList[i].Path,
                                    Size: fileList[i].Size
                                });
                                sendMsg(message);
                            }
                        }
                        if (hasDir) {
                            alert(langPack.getKey('notSupportSendFileDir'));
                        }
                        if (isOfflineFileForbidden) {
                            if (fileList.length == 1) {
                                var isImg = util.isImg(list[0].Path);
                                if (isImg) {
                                    var message = chatService.createMessage(chatId, webConfig.MSG_TYPE_MAP[webConfig.MSG_PIC_TYPE], '', list[0]);
                                    chatService.sendMsg(message);
                                    return;
                                }
                            }
                            var message = createMessage($scope.chatData.currentChat, 10, '', '', list);
                            $scope.sendOnlinFileMsg(message);
                        }
                    })
                })
            } else {
                var type = types[types.length - 1];
                var content = transfer.getData(type);
                if (hasHtml) {
                    content = util.contentReplace(content);
                }
                $scope.insertHtmlByCommand(content);
            }
            e.preventDefault();
        }
    })
    $scope.$on('frameFocus', function () {
        if ($scope.view.currentView == 'chat') {
            // $editArea.focus();
        }
    })

    $scope.$on('deleteChat', function (ev, chatId) {
        $timeout(function () {
            if ($scope.chatData.currentChat == chatId) {
                $scope.chatData.currentChat = '';
                $scope.msg.msgContent = '';
                chatService.clearLastMsgTime(chatId);
                chatService.clearCacheData(chatId);
            }
            delete tempContent[chatId];
        });
    });
    $scope.$on('document.click', function () {
        $scope.showLargePC = false;
    })
    $scope.openLargeFileTransPage = function () {
        $scope.showLargePC = false;
        var params = {};
        params.chatId = $scope.chatData.currentChat;
        frameService.open('sendFile' + params.chatId, 'sendFile.html', params, 320, 530, false, langPack.getKey('largeFile'), true);
    }
    $scope.$on('hotkeyDetected', function (ev, type) {
        if ($scope.frame.status == 1) {
            if (type == 1002) {
                $scope.sendTextMsg();
            }
            if (type == 1003) {
                $scope.startRecord();
            }
        }
        if (type == 1001) {
            if ($scope.frame.status == 1) {
                $scope.capture();
            } else {
                frameService.capture(function (res) {
                });
            }
        }
    })
}]);

controllers.controller('empController', ['$scope', '$stateParams', '$state', 'empService', 'pops', '$rootScope', 'concatService', 'util', function ($scope, $stateParams, $state, empService, pops, $rootScope, concatService, util) {
    var emp = $scope.emp = $scope.data.emp;
    // $scope.leader = empService.getEmpInfoFromEnt(emp.SEntId,emp.SLeader);
    // $scope.leader = $scope.leader.length ? $scope.leader[0] : {};
    $scope.loginEmp = empService.getLoginEmp();
    $scope.concatId = emp.SUserId;
    $scope.isGroup = false;
    $scope.userEnts = [];
    $scope.idx = 0;
    $scope.canSendMessage = false;

    $scope.isFriend = concatService.isFriend(emp.SUserId);
    $scope.isBroad = util.isBroad(emp.SUserId);
    if (emp.SUserId == $scope.loginEmp.SUserId) {
        $scope.isFriend = false;
    }
    var loginUserEnts = empService.getLoginUserEnts();
    var currentUserEntMap = {};
    for (var i = 0; i < loginUserEnts.length; i++) {
        currentUserEntMap[loginUserEnts[i].SEntId] = loginUserEnts[i];
    }
    var empName = emp.SName;
    var userEnts = emp.entInfo;
    for (var i = 0; i < userEnts.length; i++) {
        var entId = userEnts[i].SEntId;
        if ((userEnts[i].SShowEnt != '1' || userEnts[i].SStatus.toLowerCase() == 'n') || !empService.isColleague(emp.SUserId, entId)) continue;
        var ent = {};
        ent.entName = userEnts[i].SEntName;
        ent.showDetail = true;
        if (currentUserEntMap[entId]) {
            var empBaseInfo = empService.getUserBaseInfo(entId, emp.SUserId);
            // ent.showDetail = true;
            $scope.canSendMessage = true;
            ent.depts = empService.getUserEntDepts(entId, emp.SUserId);
            if (!ent.depts.length) {
                ent.depts = [ent.entName];
            }
            ent.userName = userEnts[i].SEmpName || empBaseInfo.SShowName || empBaseInfo.SName || empBaseInfo.SEmpName || empName;
            ent.empPost = userEnts[i].SShowPost == '1' ? userEnts[i].SPost : '';
            ent.companyEmail = empBaseInfo.SEmpMail;
            ent.empNo = empBaseInfo.SEmpNo;
            ent.address = emp.SNowAddress;
            var leader = empService.getEmpInfoFromEnt(entId, empBaseInfo.SLeader);
            ent.leader = leader.length ? leader[0] : {};
        } else {
            ent.depts = [ent.entName];
            ent.userName = userEnts[i].SEmpName || empName;
            ent.empPost = userEnts[i].SShowPost == '1' ? userEnts[i].SPost : '';
        }
        $scope.userEnts.push(ent);
    }
    $scope.scrollEnt = function (idx) {
        $scope.idx = idx;
        $('.user_ents').animate({
            scrollLeft: idx * 493
        }, 200);
    }
    $scope.scrollEntByArrow = function (add) {
        $scope.idx = $scope.idx + add;
        $scope.idx = Math.max(0, $scope.idx);
        $scope.idx = Math.min($scope.idx, $scope.userEnts.length - 1);
        $('.user_ents').animate({
            scrollLeft: $scope.idx * 493
        }, 200);
    }
    $scope.delFriend = function (userId) {
        concatService.delFriend(userId, function () {
            $scope.closeThisPop(true);
        });
    }

    $scope.chatWith = function () {
        if ($state.current.name === 'chat') {
            $rootScope.$broadcast('chatWith', emp.SUserId, false);
        } else {
            $state.go('chat', {
                concat: emp.SUserId,
                isGroup: false,
                selected: '',
                msgContent: ''
            }, {
                reload: true
            })
        }
        $scope.closeThisPop();
        pops.closeAllPop();
    }
}])

controllers.controller('groupInfoController', ['$scope', 'concatService', 'empService', '$rootScope', 'pops', 'domain', 'chatService', '$timeout', 'langPack', 'webConfig', 'frameService', function ($scope, concatService, empService, $rootScope, pops, domain, chatService, $timeout, langPack, webConfig, frameService) {
    // var currentEmp = empService.getLoginEmp();
    var currentEmp = webConfig.getUser();
    var chat = $scope.data.chat;
    $scope.currentChat = chat;
    $scope.groupMembers = [];
    $scope.isInGroup = false;
    if (chat.isGroup) {
        concatService.getGroup(chat.id, function (res) {
            $timeout(function () {
                if (res.Flag == 1) {
                    return;
                }
                var members = res.Data.Members;
                for (var i = 0; i < members.length; i++) {
                    if (members[i].Id == currentEmp.Id) {
                        $scope.isInGroup = true;
                    }
                    if (members[i].Id == res.Data.OwnerId) {
                        members[i].isAdmin = 1;
                    } else {
                        members[i].isAdmin = 0;
                    }
                    members[i].namePinyin = '';
                    if (members[i].Name) {
                        members[i].namePinyin = util.getPinyin(members[i].Name);
                    }
                    members[i].banned = false;
                    if (members[i].Id == currentEmp.Id) {
                        members[i].IMStatus = 1;
                    }
                    $scope.groupMembers.push(res.Data.Members[i]);
                }
                $scope.isAdminEmp = res.Data.OwnerId == currentEmp.Id;
            })
            setTimeout(function () {
                $('.switch').removeClass('no_an');
            }, 1000);
        })
        var group_members = $scope.groupMembers;
        $scope.room = {};
        $scope.room.name = chat.Name || chat.ShowName;;
        $scope.room.inputName = util.htmlDecode(chat.Name || chat.ShowName);
        // $scope.$on('empStatusChange',function(e,empAccounts,status,resource){
        // for(var i=0;i<empAccounts.length;i++){
        // for(var j=0;j<group_members.length;j++){
        // if(group_members[j] && empAccounts[i] == group_members[j].Id){
        // }
        // }
        // }
        // });
    } else {
        setTimeout(function () {
            $('.switch').removeClass('no_an');
        }, 1000);
    }
    $scope.isBroad = function () {
        var chatId = $scope.currentChat.Id;
        return util.isBroad(chatId);
    }
    var oldName;
    $scope.change = function (event) {
        oldName = $scope.room.inputName;
        $scope.changeTag = true;
    };
    $scope.$on('$destroy', function () {
        $rootScope.$broadcast('groupInfoPopuClosed');
    })
    $scope.$on('hiddenGroupInfo', function () {
        pops.close($scope.$dialogId);
    })

    $scope.nameChanged = function (e) {
        var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if ($scope.room.inputName.match(regRule)) {
            $scope.room.inputName = $scope.room.inputName.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
            alert(langPack.getKey('errorEmjgroupName'));
        }
        if ($scope.room.inputName.length > 16) {
            alert(langPack.getKey('errorGroupName'));
            $scope.changeTag = false;
            // $timeout(function(){
            // e.target.focus();
            // },100);
            return;
        }
        $scope.changeTag = false;
        if ($scope.room.inputName == '') {
            $scope.room.name = chat.Name || chat.ShowName;
            $scope.room.inputName = util.htmlDecode(chat.Name || chat.ShowName);
        } else {
            if (oldName != $scope.room.inputName) {
                $scope.room.name = $scope.room.inputName;
                chatService.changeGroupName(chat.id, $scope.room.inputName, function (res) {
                    $rootScope.$broadcast('changeGroupNameSuccess', chat.id, $scope.room.inputName);
                })
                // socketConnect.changeRoomSubject(group.id,$scope.room.inputName);
            }
        }
    };
    $scope.addEmp = function () {
        // var selected = $scope.currentChat.isGroup ? $scope.groupMembers : [{
        // Id : $scope.chat.Id,
        // Name : $scope.chat.Name,
        // Avatar : $scope.chat.Avatar
        // }];
        $scope.delChecked = false;
        var params = {};
        if (chat.isGroup) {
            params.action = 'add';
            params.groupId = chat.id;
        } else {
            params.action = 'new';
            params.selected = chat.id;
        }
        frameService.open('chooseUser', 'choose.html', params, 600, 550, true, langPack.getKey('addStaff'));
    }

    //减人
    $scope.delEmp = function () {
        $scope.delChecked = !$scope.delChecked;
    };
    var deling = {};
    $scope.del = function (emp) {
        var _acc = emp.Id;
        if (deling[_acc]) return;
        deling[_acc] = 1;
        chatService.kickUser(chat.id, _acc);
    };
    $scope.$on('document.click', function () {
        $timeout(function () {
            pops.close($scope.$dialogId);
        })
    });
    function empLeaveRoom(roomId, emps) {
        $timeout(function () {
            var len = $scope.groupMembers.length;
            var len1 = emps.length;
            chat.MemberCount -= len1;
            var isIn = false;
            for (var j = 0; j < len1; j++) {
                var emp = emps[j];
                delete deling[emp];
                for (var i = len - 1; i >= 0; i--) {
                    var member = $scope.groupMembers[i];
                    if (emp == $scope.groupMembers[i].Id) {
                        $scope.groupMembers.splice(i, 1);
                        isIn = true;
                    }
                }
            }
            if (isIn) {
                // chatService.removeChat(roomId);
                if (roomId == chat.id) {
                    $scope.closeThisPop();
                }
            }
        })
    }
    $scope.$on('groupUpdate', function (ev, res) {
        if (!chat.isGroup) {
            return;
        }
        var members = $scope.groupMembers;
        var map = {};
        for (var i = 0; i < members.length; i++) {
            map[members[i].Id] = 1;
        }
        $timeout(function () {
            $scope.room.name = res.Data.Name || res.Data.ShowName;
            $scope.room.inputName = util.htmlDecode(chat.Name || chat.ShowName);
            if (res.Data.SDKAction == 18) {
                for (var i = 0; i < res.Data.Members.length; i++) {
                    var member = res.Data.Members[i];
                    member.namePinyin = util.getPinyin(member.Name);
                    member.isAdmin = 0;
                    if (!map[member.Id]) {
                        members.push(member);
                    }
                }
            }
            if (res.Data.SDKAction == 19) {
                var kickMap = {};
                for (var i = 0; i < res.Data.Members.length; i++) {
                    kickMap[res.Data.Members[i].Id] = 1;
                    delete deling[res.Data.Members[i].Id];
                }
                for (var i = members.length - 1; i >= 0; i--) {
                    if (kickMap[members[i].Id]) {
                        members.splice(i, 1);
                    }
                }
            }
            if (res.Data.SDKAction == 54 || res.Data.SDKAction == 56) {
                var bannedMap = {};
                if (res.Data.Members == null) {
                    res.Data.Members = []
                }
                for (var i = 0; i < res.Data.Members.length; i++) {
                    bannedMap[res.Data.Members[i].Id] = 1;
                }
                for (var i = members.length - 1; i >= 0; i--) {
                    if (bannedMap[members[i].Id]) {
                        members[i].banned = true;
                    }
                }
            }
            if (res.Data.SDKAction == 55) {
                var bannedMap = {};
                for (var i = 0; i < res.Data.Members.length; i++) {
                    bannedMap[res.Data.Members[i].Id] = 1;
                }
                for (var i = members.length - 1; i >= 0; i--) {
                    if (bannedMap[members[i].Id]) {
                        members[i].banned = false;
                    }
                }
            }
        })
    });
    //添加/删除常用群组
    $scope.saveGroup = function (event) {
        var chatId = $scope.currentChat.id;
        var ids = [];
        ids.push(chatId);
        var chat = chatService.getChat(chatId);
        var type = chat.isGroup ? 2 : 0;
        if (!$scope.currentChat.Favorite) {
            concatService.setFavorite(type, ids, function () {
                $timeout(function () {
                    for (var i = 0; i < ids.length; i++) {
                        chatService.setChatStatus(ids[i], 2);
                    }
                })
            });
        } else {
            concatService.cancelFavorite(type, ids, function () {
                $timeout(function () {
                    for (var i = 0; i < ids.length; i++) {
                        chatService.cancelChatStatus(ids[i], 2);
                    }
                })
            });
        }
        // chatService.changeChatStatus(2,params);
    }
    //添加/删除置顶
    $scope.setTop = function (event) {
        var chatId = $scope.currentChat.id;
        var params = {};
        params.idList = [];
        params.idList.push(chatId);
        if (!$scope.currentChat.Sticky) {
            params.value = 1;
        } else {
            params.value = 0;
        }
        chatService.changeChatStatus(0, params);
    }
    // 消息免打扰设置
    $scope.setDisturb = function (event) {
        var chatId = $scope.currentChat.id;
        var params = {};
        params.idList = [];
        params.idList.push(chatId);
        if (!$scope.currentChat.Undisturbed) {
            params.value = 1;
        } else {
            params.value = 0;
        }
        chatService.changeChatStatus(1, params);
    }
    $scope.canDel = function () {
        if (currentEmp.SUserId == group.group_admin.SUserId) {
            return true;
        }
    }
    $scope.isAdmin = function (emp) {
        var flag = false;
        if (emp.SUserId == group.group_admin.SUserId) {
            flag = true;
        }
        return flag;
    }
    $scope.leaveRoom = function () {
        if ($scope.isAdminEmp) {
            alert(langPack.getKey('leaveError'));
            return;
        }
        // chatService.removeChat(group.id);
        // strophe.leaveRoom(group.id);
        // socketConnect.leaveRoom(group.id);
        if (confirm(langPack.getKey('leaveGroupConfirm'))) {
            chatService.leaveGroup(chat.Id, function (res) {
                // $rootScope.$broadcast('deleteChat',chat.Id,2);
            });
            $scope.closeThisPop();
        }
    }
    $scope.checkShutUpStatus = function (userId) {
        return false;
        // return socketConnect.checkShutUpStatus($scope.data.group.id,userId);
    }
}])

controllers.controller('recordController', ['$scope', '$timeout', 'frameService', 'chatService', 'webConfig', '$rootScope', '$interval', function ($scope, $timeout, frameService, chatService, webConfig, $rootScope, $interval) {
    var record = $scope.record;
    $scope.cancel = function () {
        $scope.cancelRecord();
        // frameService.stopRecord(0,function(){

        // })
    }
    $scope.sendRecord = function () {
        if (record.status == 2) {
            sendVoiceMessage();
        } else {
            $interval.cancel($scope.record.recordTimer)
            frameService.stopRecord(1, function (res) {
                record.recordFile = res.Data;
                sendVoiceMessage();
            })
        }
        function sendVoiceMessage() {
            var message = chatService.createMessage($scope.chatData.currentChat, webConfig.MSG_TYPE_MAP[webConfig.MSG_VOICE_TYPE], record.recordTime + '', {
                Path: record.recordFile
            });
            $timeout(function () {
                record.recordFile = '';
                record.status = 0;
                record.recordTime = 0;
            })
            // $rootScope.$broadcast('sendingMsg',message.msg,message.now);
            chatService.sendMsg(message, function (res) {

            })
        }
    }
}])

controllers.controller('faceController', ['$scope', 'pops', 'faces', '$rootScope', '$timeout', function ($scope, pops, faces, $rootScope, $timeout) {
    var cates = faces.cates;
    var decs = faces.titles;
    $scope.cates = cates;
    $scope.decs = decs;

    $scope.current = 0;
    $scope.faces = decs[$scope.current];

    $scope.$on('document.click', function () {
        $timeout(function () {
            pops.close($scope.$dialogId);
        })
    });
    $scope.insertFace = function (idx) {
        var name = cates[$scope.current];
        var title = $scope.faces[idx];
        idx = idx < 10 ? '0' + idx : idx;
        $scope.inertHtmlToEditArea('<img isface="1" src="img/qqemoji/e1' + idx + '.png" class="' + name + '_face" title="[' + title + ']" />');
        pops.close($scope.$dialogId);
    }
    $scope.changeCate = function (idx) {
        $scope.current = idx;
        $scope.faces = decs[$scope.current];
    }
    $scope.faceKeyDown = function (e) {
        if (e.keyCode == util.KEYMAP.ENTER) {
            e.preventDefault();
        }
    }
    $scope.faceKeyUp = function (e) {
        if (e.keyCode == util.KEYMAP.ENTER) {
            $scope.data.parent.sendTextMsg();
            e.preventDefault();
        }
    }
    $scope.$on('onSendMsg', function () {
        pops.close($scope.$dialogId);
    })
}]);


controllers.controller('atEmpController', ['$scope', 'pops', '$rootScope', 'util', 'webConfig', 'concatService', '$timeout', function ($scope, pops, $rootScope, util, webConfig, concatService, $timeout) {
    $scope.atEmp = $scope.data.parentScope.atEmp;
    $scope.data.parentScope.atEmpScope = $scope;
    $scope.$on('$destroy', function () {
        $rootScope.$broadcast('atEmpControllerDestroy');
    })
    var currentEmp = webConfig.getUser();
    var chatId = $scope.data.chatId;
    var memberReturned = false;
    var dms = [], dml = 0;
    $scope.$on('ngRepeatFinished', function (ev, menuData, pos) {
        resetPos();
    });
    $scope.border = 'none';
    function resetPos() {
        var tw = document.documentElement.clientWidth, th = document.documentElement.clientHeight;
        var w = $('#at_emp_wrap').width(), h = Math.min(380, $('#at_emp_wrap').height());
        var parentOffset = $('#msg_edit_area').offset();
        // console.log($scope.style,w,h,tw,tw - w - parentOffset.left,parentOffset)
        $timeout(function () {
            // console.log(w + $scope.style.left + parentOffset.left >= tw)
            if (w + $scope.style.left + parentOffset.left >= tw) {
                $scope.style.left = tw - w - parentOffset.left;
            }
            if (h + $scope.style.top > th) {
                $scope.style.top = 'auto';
                $scope.style.bottom = '0';
            }
            // $('#'+$scope.$dialogId).css($scope.style);
            // console.log($scope.style)
        })
    }
    concatService.getGroup(chatId, function (res) {
        if (res.Flag == 0) {
            memberReturned = true;
            dms = res.Data.Members;
            dml = dms.length;
            $timeout(function () {
                for (var i = 0; i < dml; i++) {
                    if (currentEmp.Id != dms[i].Id) {
                        $scope.members.push(dms[i]);
                        $scope.result.push(dms[i]);
                    }
                }
                if (dml) {
                    $scope.index = 0;
                    $scope.border = 'at_emp_wrap';
                }
            })
        }
    })
    $scope.result = [];
    $scope.members = [];
    $scope.index = -1;
    // $('#'+$scope.$dialogId).hide();
    var isZhcn = /^[a-z0-9]/;
    function filterEmp() {
        $scope.result = [];
        $scope.index = -1;
        var keyword = $scope.data.parentScope.atEmp.keyword;
        keyword = keyword.toLowerCase();
        var pushed = {};
        var pyKey = util.getPinyin(keyword);
        if (!isZhcn.test(keyword)) {
            var idx;
            var temp = [];
            for (var i = 0; i < dms.length; i++) {
                if (dms[i].Id == currentEmp.Id || !dms[i].Id) continue;
                dms[i].IsEmp = true;
                var empName = dms[i].Name;
                idx = empName.indexOf(keyword);
                if (idx != -1) {
                    temp.push([idx, dms[i]]);
                    pushed[dms[i].Id] = 1;
                }
            }
            temp.sort(function (v1, v2) {
                return v1[0] < v2[0] ? -1 : 1;
            })
            for (var i = 0; i < temp.length; i++) {
                $scope.result.push(temp[i][1]);
            }
        } else {
            for (var i = 0; i < dms.length; i++) {
                if (dms[i].Id == currentEmp.Id || !dms[i].Id) continue;
                var empName = dms[i].Name;
                var namePinyin = util.getPinyin(empName);
                if (dms[i].Id && !pushed[dms[i].Id] && (dms[i].Id.indexOf(pyKey) != -1 || namePinyin.indexOf(pyKey) != -1)) {
                    $scope.result.push(dms[i]);
                    pushed[dms[i].Id] = 1;
                }
            }
        }
        if ($scope.result.length == 0) {
            // console.log($('#'+$scope.$dialogId))
            $('#' + $scope.$dialogId).hide();
            $scope.border = 'at_emp_wrap';
        } else {
            $scope.border = 'none';
            $scope.index = 0;
            $('#' + $scope.$dialogId).show();
        }
    }
    $scope.$watch('data.parentScope.atEmp.keyword', function (v) {
        if (!memberReturned) return;
        $scope.result.length = 0;
        $scope.index = -1;
        if (v == '') {
            [].push.apply($scope.result, $scope.members);
            $('#' + $scope.$dialogId).show();
        } else {
            filterEmp();
        }
    })

    var container = $('#at_emp_con')[0];

    $scope.keydown = function (e) {
        var temp = $scope.index;
        var change = 0;
        if (e.keyCode == util.KEYMAP.UP) {
            // temp --;
            $scope.index = temp <= 0 ? (temp = $scope.result.length - 1) : Math.max(0, --temp);
            e.preventDefault();
        }
        if (e.keyCode == util.KEYMAP.DOWN) {
            // temp ++;
            $scope.index = temp >= $scope.result.length - 1 ? (temp = 0) : Math.min($scope.result.length - 1, ++temp);
            e.preventDefault();
        }
        if (e.keyCode == util.KEYMAP.ENTER) {
            if ($scope.result[$scope.index]) {
                atEmp($scope.result[$scope.index]);
                $scope.$destroy();
                $scope.closeThisPop();
            }
        }
        var activeTop = temp * 33;
        var newActiveTop = $scope.index * 33;
        var totalHeight = container.offsetHeight - 20;
        var scrollTop = container.scrollTop;
        var scrollHeight = container.scrollHeight;
        if (newActiveTop > totalHeight + scrollTop) {
            container.scrollTop = newActiveTop - totalHeight;
        } else {
            if ($scope.index == 0) {
                container.scrollTop = 0;
            } else {
                if (newActiveTop < scrollTop) {
                    container.scrollTop = newActiveTop;
                }
            }
        }
    }
    function atEmp(emp) {
        var name = emp.Name;
        var userId = emp.Id;
        var width = util.getStringWidth('@' + name);
        $scope.inertHtmlToEditArea('<input class="_at_emp" type="text" readonly="readonly" at="' + userId + '|' + name + '" value="@' + name + '" style="line-height:16px;width:' + width + 'px"/> ');
        $scope.data.parentScope.resetAtEmp();
    }
    $scope.atEmp = function (emp, e) {
        for (var i = 0; i < $scope.result.length; i++) {
            if (emp.Id == $scope.result[i].Id) {
                $scope.index = i;
            }
        }
        $scope.data.parentScope.keyDownSend({
            keyCode: util.KEYMAP.ENTER,
            preventDefault: function () { },
            isClick: true
        })
        e.preventDefault();
        e.stopPropagation();
    }
    $scope.empMouseDown = function (emp) {
        $scope.data.parentScope.rememberRange();
    }
    $scope.$on('document.click', function () {
        pops.close($scope.$dialogId);
    });
}]);

controllers.controller('contextMenuController', ['$scope', 'domain', '$timeout', '$rootScope', 'util', 'empService', 'chatService', 'concatService', 'langPack', 'webConfig', 'frameService', 'envConfig', function ($scope, domain, $timeout, $rootScope, util, empService, chatService, concatService, langPack, webConfig, frameService, envConfig) {
    $scope.menuList = [];
    $scope.style = {
        top: 0, left: 0
    }
    $scope.showMenu = false;
    var target;
    // 鼠标右击事件
    $scope.$on('contextMenu', function (ev, menuData, pos) {
        //  禁止转发 视频会议
        if(menuData.msg && menuData.msg.type=="service" && menuData.msg.msgType == 10 && menuData.msg.msgObj){
            return;
        }
        target = ev.target;
        $timeout(function () {
            angular.extend($scope.style, pos);
            initMenu(menuData.type, menuData);
            $scope.menuList.length && ($scope.showMenu = true);
        })
    })
    $scope.$on('ngRepeatFinished', function (ev, menuData, pos) {
        var tw = document.documentElement.clientWidth, th = document.documentElement.clientHeight;
        var w = $('#context_menu').width(), h = $('#context_menu').height();
        $timeout(function () {
            if (w + $scope.style.left > tw) {
                $scope.style.left = tw - w;
            }
            if (h + $scope.style.top > th) {
                $scope.style.top = th - h;
            }
        })
    });
    function callbackWarper(callback) {
        return function ($event) {
            callback && callback.apply(undefined, arguments);
            $scope.showMenu = false;
            $scope.menuList.length = 0;
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    function initMenu(type, menuData) {
        $scope.menuList.length = 0;
        switch (type) {
            case 'chat':
                // var chatList = chatService.getChatList();
                var chat = chatService.getChat(menuData.data);
                if (menuData.data == 'service_chat_converge') {
                    break;
                }
                //修改聊天状态，type:0置顶标识，1免打扰，标识值value：0常规，1置顶或免打扰
                // jj.fetch("chat/changeStatus", JSON.stringify({ data: { idList: ["ad645390a63b468bbffe383fea437bcc"], type: 0, value: 1 }, callback: "callback" }));
                $scope.menuList.push({
                    name: chat.Sticky ? langPack.getKey('cancelTop') : langPack.getKey('setTop'),
                    callback: callbackWarper(function () {
                        var params = {};
                        params.idList = [];
                        params.idList.push(menuData.data);
                        if (!chat.Sticky) {
                            params.value = 1;
                        } else {
                            params.value = 0;
                        }
                        chatService.changeChatStatus(0, params);
                    })
                });
                var menuContent = !chat.isGroup ? langPack.getKey('setUserToFavorite') : langPack.getKey('setGroupToFavorite');
                if (chat.Favorite) {
                    menuContent = !chat.isGroup ? langPack.getKey('cancelUserToFavorite') : langPack.getKey('cancelGroupToFavorite');
                }
                $scope.menuList.push({
                    name: menuContent,
                    callback: callbackWarper(function () {
                        var ids = [];
                        ids.push(menuData.data);
                        var chat = chatService.getChat(menuData.data);
                        var type = chat.isGroup ? 2 : 0;
                        if (!chat.Favorite) {
                            concatService.setFavorite(type, ids, function () {
                                $timeout(function () {
                                    for (var i = 0; i < ids.length; i++) {
                                        chatService.setChatStatus(ids[i], 2);
                                    }
                                })
                            });
                        } else {
                            concatService.cancelFavorite(type, ids, function () {
                                $timeout(function () {
                                    for (var i = 0; i < ids.length; i++) {
                                        chatService.cancelChatStatus(ids[i], 2);
                                    }
                                })
                            });
                        }
                    })
                });
                $scope.menuList.push({
                    name: langPack.getKey('deleteChat'),
                    callback: callbackWarper(function () {
                        $rootScope.$broadcast('deleteChat', menuData.data, 1);
                    })
                });
                $scope.menuList.push({
                    name: langPack.getKey('removeChat'),
                    callback: callbackWarper(function () {
                        if (confirm(langPack.getKey('removeChatConfirm'))) {
                            $rootScope.$broadcast('deleteChat', menuData.data, 2);
                        }
                    })
                });
                break;
            case 'msg':
            case 'file':
                var msgType = menuData.msg.type;
                // console.log(menuData.msg);
                if (menuData.forwardable == 1) {
                    $scope.menuList.push({
                        name: langPack.getKey('forward'),
                        callback: callbackWarper(function () {
                            // $rootScope.$broadcast('forward',menuData.data);
                            var params = {};
                            params.action = 'forward';
                            params.msgId = menuData.data;
                            frameService.open('forward', 'forward.html', params, 600, 550, true, langPack.getKey('forward'));
                        })
                    });
                }

                if (msgType == webConfig.MSG_TEXT_TYPE || msgType == webConfig.MSG_PIC_TYPE) {
                    $scope.menuList.push({
                        name: langPack.getKey('copy'),
                        callback: callbackWarper(function (e) {
                            if (msgType == webConfig.MSG_TEXT_TYPE) {
                                var _content = menuData.msg.content.replace(/&/g, '&amp;');
                                var html = util.copyDom(_content);
                                var selection = document.getSelection();
                                if (selection.rangeCount) {
                                    var range = selection.getRangeAt(0);
                                    if (range.startOffset != range.endOffset) {
                                        var node = range.cloneContents();
                                        var div = document.createElement('div');
                                        div.appendChild(node);
                                        var temp = document.createElement('div');
                                        if ($(div).find('.msg_txt').size()) {
                                            $(div).find('.msg_txt').each(function () {
                                                temp.appendChild(this);
                                                temp.appendChild(document.createElement('br'));
                                            })
                                        } else {
                                            temp.appendChild(div);
                                        }
                                        var _html = temp.innerHTML.replace(/\s*\n/g, '');
                                        var res = util.copyDom(_html);
                                        frameService.copy({
                                            html: res.html,
                                            text: res.text,
                                        });
                                        div = null;
                                    } else {
                                        frameService.copy({
                                            html: menuData.msg.sender.Name + '：' + html.html,
                                            text: menuData.msg.sender.Name + '：' + html.text,
                                        });
                                    }

                                } else {
                                    frameService.copy({
                                        html: menuData.msg.sender.Name + '：' + html.html,
                                        text: menuData.msg.sender.Name + '：' + html.text,
                                    });
                                }
                            }
                            // console.log(menuData.msg);
                            if (msgType == webConfig.MSG_PIC_TYPE) {
                                var envData = envConfig.getEnvData();
                                var fileDomain = envData.LocalDomain;
                                var src = menuData.msg.filePath;
                                if (fileDomain) {
                                    var _fileDomain = util.replaceMetaStr(fileDomain);
                                    var reg = new RegExp('^' + _fileDomain);
                                    if (reg.test(src)) {
                                        src = src.replace(reg, '');
                                    }
                                }
                                frameService.copy({
                                    html: '<img src="' + decodeURIComponent(src) + '"/>',
                                    text: langPack.getKey('img'),
                                    imagePath: decodeURIComponent(src)
                                });
                            }
                        })
                    });
                    if (msgType == webConfig.MSG_PIC_TYPE) {
                        $scope.menuList.push({
                            name: langPack.getKey('saveImg'),
                            callback: callbackWarper(function (e) {
                                frameService.saveDialog({
                                    extFilter: langPack.getKey('imageFiles'),
                                    fileName: langPack.getKey('saveImgPifx') + new Date().getTime()
                                }, function (_res) {
                                    frameService.downLoad({
                                        id: menuData.data,
                                        filePath: _res.Data,
                                        fromLocal: true
                                    }, function (res) {
                                    })
                                })
                            })
                        });
                    }
                }
                var canBeWithDraw = false;
                var currentUser = webConfig.getUser();
                if (menuData.msg.sender.Id == currentUser.Id) {
                    var _now = util.getNow();
                    var allowTime = 2 * 60 * 1000;
                    if (_now - menuData.msg.timeStamp < allowTime) {
                        if (msgType == webConfig.MSG_TEXT_TYPE || msgType == webConfig.MSG_PIC_TYPE || msgType == webConfig.MSG_FILE_TYPE) {
                            canBeWithDraw = true;
                        }
                    }
                }
                if (canBeWithDraw) {
                    $scope.menuList.push({
                        name: langPack.getKey('withDraw'),
                        callback: callbackWarper(function (e) {
                            var _now = util.getNow();
                            if (_now - menuData.msg.timeStamp > allowTime) {
                                alert(langPack.getKey('canNotWithDraw'));
                                return;
                            }
                            chatService.withDrawMsg(menuData.data, function () {
                            })
                            // $rootScope.$broadcast('withDrawMyMsg',menuData.data);
                        })
                    });
                }
                $scope.menuList.push({
                    name: langPack.getKey('clear'),
                    callback: callbackWarper(function () {
                        $rootScope.$broadcast('clearMsgs');
                    })
                });
                break;
            // case webConfig.MSG_PIC_TYPE :
            // case 'pic' :
            // var currentUser = webConfig.getUser();
            // if(menuData.msg.sender.Id == currentUser.Id){
            // var _now = util.getNow();
            // var allowTime = 2 * 60 * 1000;
            // if(_now - menuData.msg.timeStamp < allowTime){
            // $scope.menuList.push({
            // name : langPack.getKey('withDraw'),
            // callback : callbackWarper(function(e){
            // var _now = util.getNow();
            // if(_now - menuData.msg.timeStamp > allowTime){
            // alert(langPack.getKey('canNotWithDraw'));
            // return;
            // }
            // chatService.withDrawMsg(menuData.data,function(){
            // })
            // })
            // });
            // }
            // }
            // break;
            case 'dept':
                $scope.menuList.push({
                    name: langPack.getKey('favoriteDept'),
                    callback: callbackWarper(function () {
                        var ids = [];
                        ids.push(menuData.data);
                        concatService.setFavorite(1, ids, function (res) {

                        })
                    })
                });
                $scope.menuList.push({
                    name: langPack.getKey('sendInstantMessage'),
                    callback: callbackWarper(function () {
                        var currentUser = webConfig.getUser();
                        var groupId = ['group', currentUser.Id, util.getNow()].join('_');
                        frameService.notice({
                            chatId: groupId,
                            timestamp: util.getNow(),
                            frameId: 'main',
                            action: 'creatingGroup'
                        });
                        chatService.createGroupByDeptId(menuData.data, groupId, function (res, groupId) {
                            if (res.Flag != 0 || res.Code != 0) {
                                frameService.notice({
                                    chatId: groupId,
                                    timestamp: util.getNow(),
                                    frameId: 'main',
                                    action: 'createGroupReturn'
                                });
                            }
                        })
                        // $rootScope.$broadcast('sendInstantMessage',menuData.data);
                    })
                });
                $scope.menuList.push({
                    name: langPack.getKey('refreshEnts'),
                    callback: callbackWarper(function () {
                        $rootScope.$broadcast('refreshEnts');
                    })
                });
                break;
            case 'reloadEnt':
                $scope.menuList.push({
                    name: langPack.getKey('refreshEnts'),
                    callback: callbackWarper(function () {
                        $rootScope.$broadcast('refreshEnts');
                    })
                });
                break;
            case 'emp':
                $scope.menuList.push({
                    name: langPack.getKey('favoriteEmp'),
                    callback: callbackWarper(function () {
                        var ids = [];
                        ids.push(menuData.data);
                        concatService.setFavorite(0, ids, function (res) {

                        })
                    })
                });
                $scope.menuList.push({
                    name: langPack.getKey('refreshEnts'),
                    callback: callbackWarper(function () {
                        $rootScope.$broadcast('refreshEnts');
                    })
                });
                break;
            case 'favorite':
                var favType = menuData.favType;
                var nameMap = {
                    user: 'cancelUserToFavorite',
                    group: 'cancelGroupToFavorite',
                    dept: 'cancelDeptToFavorite'
                }
                var typeMap = {
                    user: 0,
                    dept: 1,
                    group: 2
                };
                var ids = [];
                ids.push(menuData.data);
                $scope.menuList.push({
                    name: langPack.getKey(nameMap[favType]),
                    callback: callbackWarper(function () {
                        concatService.cancelFavorite(typeMap[favType], ids, function () {
                            // $rootScope.$broadcast('cancelFavorite',ids);
                        });
                    })
                });
                if (favType == 'dept') {
                    $scope.menuList.push({
                        name: langPack.getKey('sendInstantMessage'),
                        callback: callbackWarper(function () {
                            var currentUser = webConfig.getUser();
                            var groupId = ['group', currentUser.Id, util.getNow()].join('_');
                            frameService.notice({
                                chatId: groupId,
                                timestamp: util.getNow(),
                                frameId: 'main',
                                action: 'creatingGroup'
                            });
                            chatService.createGroupByDeptId(menuData.data, groupId, function (res, groupId) {
                                if (res.Flag != 0 || res.Code != 0) {
                                    frameService.notice({
                                        chatId: groupId,
                                        timestamp: util.getNow(),
                                        frameId: 'main',
                                        action: 'createGroupReturn'
                                    });
                                }
                            })
                        })
                    });
                }
                break;
            case 'editor':
                var selection = document.getSelection();
                if (selection.rangeCount) {
                    var range = selection.getRangeAt(0);
                    console.log(range);
                    if (range.endOffset != range.startOffset) {
                        $scope.menuList.push({
                            name: langPack.getKey('copy'),
                            callback: callbackWarper(function () {
                                $('#msg_edit_area').trigger('copy');
                            })
                        });
                        $scope.menuList.push({
                            name: langPack.getKey('cut'),
                            callback: callbackWarper(function () {
                                $('#msg_edit_area').trigger('copy', true);
                            })
                        });
                        $scope.menuList.push({
                            name: langPack.getKey('deleteContent'),
                            callback: callbackWarper(function () {
                                range.deleteContents();
                                selection.removeAllRanges();
                                selection.addRange(range);
                            })
                        });
                    }
                }

                $scope.menuList.push({
                    name: langPack.getKey('paste'),
                    callback: callbackWarper(function () {
                        $('#msg_edit_area').trigger('paste');
                    })
                });
                break;
            case 'chat_wrap':
                var chatId = menuData.data;
                var dom = document.getElementById('msgList_' + chatId);
                $scope.menuList.push({
                    name: langPack.getKey('clear'),
                    callback: callbackWarper(function () {
                        $rootScope.$broadcast('clearMsgs');
                    })
                });
            default:
                break;
        }
    }
    $scope.$on('document.click', function () {
        $timeout(function () {
            $scope.showMenu = false;
            $scope.menuList.length = 0;
        })
    });
    $scope.$on('hiddenMenu', function () {
        $timeout(function () {
            $scope.showMenu = false;
            $scope.menuList.length = 0;
        })
    })
}]);

controllers.controller('concatController', ['$rootScope', '$state', '$stateParams', '$scope', 'concatService', 'empService', '$timeout', 'webConfig', 'socketConnect', '$templateCache', '$compile', '$interval', 'langPack', function ($rootScope, $state, $params, $scope, concatService, empService, $timeout, webConfig, socketConnect, $templateCache, $compile, $interval, langPack) {
    var elem = angular.element;
    $scope.show = {
        friend: false,
        user: false,
        dept: false,
        group: false
    }
    $scope.users = [];
    $scope.groups = [];
    $scope.friends = [];
    $scope.loadingDept = 1;
    $scope.deptLoadingString = '';
    var inited = false;
    $scope.$watch('view.currentView', function (v) {
        if (v == 'concat') {
            init();
        }
    })
    $scope.$on('goDept', function (ev) {
        goDept();
    })
    $scope.$on('refreshEnts', function () {
        $('.ents').html('');
        inited = false;
        $scope.loadingDept = 1;
        $timeout(function () {
            concatService.refreshEnts(function () {
                init();
            })
        })
    })
    var timer;
    var num = -3;
    $scope.$watch('loadingDept', function (v) {
        if (v == 1) {
            if (timer) {
                $interval.cancel(timer);
            }
            $scope.deptLoadingString = langPack.getKey('deptLoading').slice(0, num);
            timer = $interval(function () {
                if (num >= 0) {
                    num = -3;
                } else {
                    num++;
                }
                $scope.deptLoadingString = num == 0 ? langPack.getKey('deptLoading') : langPack.getKey('deptLoading').slice(0, num);
            }, 500);
        } else {
            $interval.cancel(timer);
            timer = undefined;
            num = -3;
        }
    })
    $scope.$on('chatUpdated', function (ev, res) {
        $timeout(function () {
            for (var i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i].Id == res.Data.Id) {
                    $scope.users[i].Avatar = res.Data.Avatar;
                }
            }
            for (var i = 0; i < $scope.groups.length; i++) {
                if ($scope.groups[i].Id == res.Data.Id) {
                    $scope.groups[i].Avatar = res.Data.Avatar;
                }
            }
            for (var i = 0; i < $scope.friends.length; i++) {
                if ($scope.friends[i].Id == res.Data.Id) {
                    $scope.friends[i].Avatar = res.Data.Avatar;
                }
            }
        })
    })
    $scope.$on('changeGroupNameSuccess', function (ev, chatId, name) {
        for (var i = 0; i < $scope.groups.length; i++) {
            if ($scope.groups[i].Id == chatId) {
                $scope.groups[i].Name = name;
            }
        }
    })
    $scope.$on('cancelFavorite', function (ev, type, ids) {
        if (type == 1) {
            for (var i = 0; i < ids.length; i++) {
                $('#fav_root_' + ids[i]).remove();
            }
        } else {
            $timeout(function () {
                var target = type == 0 ? $scope.users : $scope.groups;
                for (var i = target.length - 1; i >= 0; i--) {
                    for (var j = 0; j < ids.length; j++) {
                        if (ids[j] == target[i].Id) {
                            target.splice(i, 1);
                        }
                    }
                }
            })
        }
    })
    $scope.$on('setFavorite', function (ev, type, ids) {
        if (type == 1) {
            for (var i = 0; i < ids.length; i++) {
                $scope.show.dept && createFavDept(ids[i]);
            }
        } else {
            for (var i = 0; i < ids.length; i++) {
                if (type == 0) {
                    $scope.show.user && getUser(ids[i]);
                } else {
                    $scope.show.group && getGroup(ids[i]);
                }
            }
        }
        function createFavDept(id) {
            if ($('#fav_root_' + id).size() != 0) return;
            concatService.getDept(id, function (res) {
                createEnts([res.Data], $('#fav_depts'), 1, true);
            });
        }
        function getUser(id) {
            var index = util.indexOf($scope.user, id, function (_user, id) {
                if (_user.Id == id) {
                    return true;
                }
                return false;
            })
            if (index == -1) {
                concatService.getUser(id, function (res) {
                    $timeout(function () {
                        $scope.users.push(res.Data);
                    })
                })
            }
        }
        function getGroup(id) {
            var index = util.indexOf($scope.groups, id, function (_group, id) {
                if (_group.Id == id) {
                    return true;
                }
                return false;
            })
            if (index == -1) {
                concatService.getGroup(id, function (res) {
                    $timeout(function () {
                        $scope.groups.push(res.Data);
                    })
                })
            }
        }
    })
    function init() {
        if (inited) {
            goDept();
            return;
        }
        concatService.getEnts(function (res) {
            $timeout(function () {
                if (res.Data) {
                    $('.ents').html('');
                    createEnts(res.Data);
                    $scope.loadingDept = 2;
                    goDept();
                } else {
                    $scope.loadingDept = 3;
                }
            });
        })
        inited = true;
    }
    $scope.reloadEnt = function () {
        inited = false;
        init();
    }

    $scope.select = '';
    $scope.switchSelect = function (type, id) {
        $('.ent_tree .select').removeClass('select');
        $scope.select = id;
        $rootScope.$broadcast('onSelectConcat', type, id);
    }
    $scope.chatWith = function (id) {
        // $scope.view.currentView = 'chat';
        $rootScope.$broadcast('chatWith', id);
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
    $scope.getFavorite = function (type) {
        var keys = ['user', 'dept', 'group'];
        if (!$scope.show[keys[type]]) {
            $scope.show[keys[type]] = true;
            concatService.getFavorite(type, function (res) {
                $timeout(function () {
                    if (type == 0) {
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
    $scope.goChatWith = function (userId) {
        $rootScope.$broadcast('chatWith', userId);
    }
    function createEnts(ents, container, level, isFav, callback) {
        container = container || $('.ents');
        for (var i = 0; i < ents.length; i++) {
            var _scope = $scope.$new();
            var tplName = isFav ? 'favDept.html' : 'ent.html';
            var tpl = $templateCache.get(tplName);
            var _ele = elem(tpl);
            _scope.ent = ents[i];
            $compile(_ele)(_scope);
            if (level) {
                _ele.find('.ent_dept').first().attr('level', (level + 1));
                _ele.find('.ent_dept').first().css('paddingLeft', (level + 1) * 14)
            } else {
                _ele.find('.ent_dept').first().attr('level', 1);
            }
            if (callback) {
                callback(ents[i], _ele);
            } else {
                container.append(_ele);
            }
            _scope.$digest();
            _ele.find('.ent_dept').first().click(function () {
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
                        createBranchs(res.Data.Children, level, dom, false);
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
    function createBranchs(list, level, container, isEmp, callback) {
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
            _scope.branch = list[i];
            $compile(_ele)(_scope);
            _ele.find('.ent_dept').first().attr('level', level + 1);
            _ele.find('.ent_dept').first().css('paddingLeft', (level + 1) * 14);
            container.append(_ele);
            _scope.$digest();
            _ele.find('.ent_dept').first().click(function () {
                var that = $(this);
                toggleSelect.call(this);
                var id = $(this).attr('did');
                var entId = $(this).parents('.childs').last().prev().attr('cid');
                if (isEmp) {
                    $rootScope.$broadcast('onSelectConcat', 0, id, entId);
                } else {
                    $rootScope.$broadcast('onSelectConcat', 2, id, entId);
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
                            createBranchs(res.Data.Children, level, dom, false);
                            that.attr('get', true);
                        }
                        $rootScope.$broadcast('onSelectDept', res.Data);
                    })
                }
            })
            callback && callback(level + 1, list[i], _ele, isEmp);
        }
    }

    function goDept() {
        if (!$scope.view.goDeptId) {
            return;
        }
        if ($scope.loadingDept != 2) {
            return;
        }
        $timeout(function () {
            $scope.loadingDept = 1;
        });
        var deptId = $scope.view.goDeptId;
        concatService.getTreeById(deptId, function (res) {
            $timeout(function () {
                if (!res.Data) {
                    $scope.loadingDept = 3;
                    return;
                }
                $scope.loadingDept = 2;
                $scope.view.goDeptId = '';
                var frag = document.createDocumentFragment();
                var root = $('#root_' + res.Data.Id);
                createEnts([res.Data], '', 0, false, function (obj, ele) {
                    frag.appendChild(ele[0]);
                    var dom = ele.find('.ent_dept').first().next();
                    if (obj.Staffs || obj.Children) {
                        ele.find('.ent_dept').first().addClass('show');
                        ele.find('.ent_dept').first().attr('get', true);
                    }
                    createBranchs(obj.Staffs, 1, dom, true, function (_level, _obj, _ele) {
                        callbackWarper(_level, _obj, _ele, true);
                    });
                    createBranchs(obj.Children, 1, dom, false, function (_level, _obj, _ele) {
                        callbackWarper(_level, _obj, _ele, false);
                    });
                })
                root.after(frag);
                root.remove();
                var targetDept = $('#dept_' + deptId)[0] || $('#root_' + deptId)[0];
                if (targetDept) {
                    $('.concat_wrap').scrollTop(targetDept.offsetTop);
                    $('#dept_' + deptId).addClass('select');
                }
            })
        })
        function callbackWarper(level, obj, ele, isEmp) {
            var dom = ele.find('.ent_dept').first().next();
            if ((obj.Staffs || obj.Children) && !isEmp) {
                ele.find('.ent_dept').first().addClass('show');
                ele.find('.ent_dept').first().attr('get', true);
            }
            if (obj.Id == deptId) {
                $rootScope.$broadcast('onSelectDept', obj);
            }
            createBranchs(obj.Staffs || [], level, dom, true, function (_level, _obj, _ele) {
                callbackWarper(_level, _obj, _ele, true);
            });
            createBranchs(obj.Children || [], level, dom, false, function (_level, _obj, _ele) {
                callbackWarper(_level, _obj, _ele, false);
            });
        }
    }
}]);

controllers.controller('concatDetailController', ['$rootScope', '$state', '$stateParams', '$scope', 'concatService', 'empService', '$timeout', 'webConfig', 'socketConnect', '$templateCache', '$compile', 'frameService', function ($rootScope, $state, $params, $scope, concatService, empService, $timeout, webConfig, socketConnect, $templateCache, $compile, frameService) {
    $scope.current = {
        type: -1, // -1 默认，0 个人 , 1 公司  2部门 3 服务号 4 好友
        id: ''
    };
    $scope.ent = {};
    $scope.dept = {};
    $scope.servicesEnts = [];
    $scope.user = {};
    $scope.idx = 0;
    $scope.entId = '';

    $scope.prev = function () {
        if ($scope.idx <= 0) return;
        $scope.idx = $scope.idx - 1;
    }
    $scope.next = function () {
        if ($scope.idx >= $scope.user.Staffs.length - 1) return;
        $scope.idx = $scope.idx + 1;
    }
    $scope.go = function (idx) {
        $scope.idx = idx;
    }
    $scope.chatWith = function (id) {
        $rootScope.$broadcast('chatWith', id);
    }
    var creating = false;
    $scope.chatWithDept = function (id) {
        if (creating) return;
        creating = true;
        // $scope.view.currentView = 'chat';
        var currentUser = webConfig.getUser();
        var groupId = ['group', currentUser.Id, util.getNow()].join('_');
        frameService.notice({
            chatId: groupId,
            timestamp: util.getNow(),
            frameId: 'main',
            action: 'creatingGroup'
        });
        chatService.createGroupByDeptId(id, groupId, function (res, groupId) {
            creating = false;
            if (res.Flag != 0 || res.Code != 0) {
                frameService.notice({
                    chatId: groupId,
                    timestamp: util.getNow(),
                    frameId: 'main',
                    action: 'createGroupReturn'
                });
            }
        })
    }
    $scope.$watch('idx', function (v) {
        $('#user_ents_wrap').stop(true, true).animate({ 'scrollLeft': v * 315 }, 300);
    })
    $scope.$on('onSelectConcat', function (ev, type, id, entId) {
        $scope.idx = 0;
        $('#user_ents_wrap').scrollLeft(0);
        $timeout(function () {
            $scope.current.type = type;
            $scope.current.id = id;
            $scope.entId = entId;
            if (type == 0 || type == 4) {
                getUserDetail(id);
            }
            if (type == 3) {
                getServices();
            }
        })
    });
    $scope.$on('onSelectEnt', function (ev, data, entId) {
        $timeout(function () {
            $scope.entId = entId;
            data.logo = 'img/icon_companylogo.png'
            $scope.ent = data;
        })
    })
    $scope.$on('onSelectDept', function (ev, data) {
        $scope.current.type = 2;
        $timeout(function () {
            $scope.dept = data;
        });
    })
    function getUserDetail(id) {
        concatService.getUserDetail(id, function (res) {
            $timeout(function () {
                // res.Data.Staffs = res.Data.Staffs.concat(res.Data.Staffs);
                if (res.Data.Staffs) {
                    for (var i = 0; i < res.Data.Staffs.length; i++) {
                        if (res.Data.Staffs[i].Company && (res.Data.Staffs[i].Company.Id == $scope.entId)) {
                            $scope.idx = i;
                        }
                    }
                }
                $scope.user = res.Data;
            });
        });
    }
    function getServices() {
        concatService.getServices(function (res) {
            $timeout(function () {
                $scope.servicesEnts = res.Data;
            })
        })
    }
}]);

controllers.controller('screenShootImageController', ['$rootScope', '$state', '$stateParams', '$scope', 'concatService', 'empService', 'webConfig', 'langPack', function ($rootScope, $state, $params, $scope, concatService, empService, webConfig, langPack) {
    $scope.send = function () {
        if ($scope.data.message.uploadStatus == webConfig.FILE_COMPLETE) {
            $scope.data.sendMsg($scope.data.message);
            $scope.closeThisPop();
        } else {
            alert(langPack.getKey('uploading'));
        }
    }
}]);
controllers.controller('languageSetting', ['$rootScope', '$state', '$scope', 'langPack', function ($rootScope, $state, $scope, langPack) {
    var data = $scope.data;
    $scope.langs = langPack.langs;
    $scope.setLanguage = function (lang) {
        data.changeLanguage(lang);
        $scope.closeThisPop();
    }
}])
controllers.controller('broadcastDetailController', ['$rootScope', '$state', '$scope', 'langPack', 'util', function ($rootScope, $state, $scope, langPack, util) {
    $scope._title = $scope.msg.broadcasttitle;
    $scope.broadcasttitle = $scope.msg.broadcasttitle;
    $scope.encodeContent = $scope.msg.content
}]);
controllers.controller('broadDetailController', ['$rootScope', '$state', '$scope', 'langPack', 'util', '$timeout', 'chatService', function ($rootScope, $state, $scope, langPack, util, $timeout, chatService) {
    $scope.$watch('view.broadMsg', function (v) {
        if (v) {
            chatService.getMsgDetail(v, function (res) {
                var msg = res.Data.msg;
                var msgObj = angular.fromJson(msg.Content);
                $timeout(function () {
                    $scope.broad = {
                        s_TITLE: msgObj.s_TITLE,
                        s_CONTENTS: msgObj.s_CONTENTS
                    }
                })
            })
        } else {
            $scope.broad = {};
        }
    })
    $scope.goBack = function () {
        $scope.broad = {};
        $scope.view.broadMsg = '';
    }
}]);
controllers.controller('largeFileReceiveStatusController', ['$rootScope', '$state', '$scope', 'langPack', 'util', '$timeout', 'chatService', '$filter', function ($rootScope, $state, $scope, langPack, util, $timeout, chatService, $filter) {
    $scope.list = $scope.data.res.Data;
    $scope.$on('changeFileMessageUploadProgess', function (e, res) {
        if (res.ResId == $scope.data.msgId) {
            $timeout(function () {
                for (var i = 0; i < $scope.list.length; i++) {
                    if ($scope.list[i].UserId == res.UserId) {
                        $scope.list[i].Kbps = $filter('fileSizeFormat')(res.Kbps, 1);
                        $scope.list[i].Percent = res.Percent;
                        $scope.list[i].Status = res.Status;
                    }
                }
            })
        }
    });
    $scope.$on('document.click', function () {
        $scope.closeThisPop();
    })
}]);
