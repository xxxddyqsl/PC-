// class rtc {
//     id = null;
//     say = null;
//     timeout = null;
//     FlowParameter = null;
//     // 底层 回调部分
//     // users 返回在线成员
//     onRegisteRsp(startAt, serverTime, roomAttrs, users) {
//         let that = this;
//         console.log(this.say);
//         console.log(this.timeout)
//         if (users.length > 0) {
//             // timeout 函数 实时 更新 数据 + view视图
//             this.timeout(() => {
//                 for (let i in users) {
//                     if (that.say.user.Id == users[i].clientId) {
//                         that.id = users[i].clientId;
//                     }
//                     if (!users[i].stream) {
//                         // 视频 流 存储容器
//                         users[i].stream = null;
//                     }
//                     this.say.videoObj.userList.push(users[i]);
//                 };
//             });
//             that.OnSetUserList(that.say.videoObj.userList, this.FlowParameter, that.say.videoObj.switchvtitle);
//         };
//         // this.timeout(()=> {
//         // this.getLocalStream()
//         // })
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
//         let that = this;
//         let userList = this.say.videoObj.userList;
//         console.log(userList);
//         if (userList.length >= 0) {
//             //  timeout  函数 实时 更新 数据 + view视图
//             this.timeout(() => {
//                 for (let k in users) {
//                     for (let i in userList) {
//                         if (userList[i].clientId == users[k].clientId) {
//                             is = false;
//                             if (!users[k].stream) {
//                                 //自定义 视频 流 存储容器
//                                 users[k].stream = null;
//                             }
//                             //id相同 替换对应数据 break跳出当前循环
//                             userList.splice(i, 1, users[k]);
//                             break;
//                         } else {
//                             is = true;
//                         }
//                     };
//                     if (is) {
//                         if (!users[k].stream) {
//                             //自定义 视频 流 存储容器
//                             users[k].stream = null;
//                         }
//                         userList.push(users[k]);
//                     };
//                 };
//                 if (that.say.videoObj.ModeSwitch) {
//                     // 4个平分 翻页
//                     that.say.videoObj.StreamList = that.dataHandling([], 4, that.say.videoObj.userList);
//                 } else {
//                     // 1大5小 翻页
//                     that.say.videoObj.StreamList = that.say.rtc.dataHandling([], 6, that.say.videoObj.userList);
//                 }
//                 console.log(that.say.videoObj.StreamList);
//                 console.log(userList);
//                 //将对scope的修改进行传播
//             });
//         };
//         this.say.$apply("");

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

//     // 自定义逻辑 数据 处理部分
//     // 自己的数据 赋值 视频流
//     async OnSetUserList(userList, displayMediaOptions, switchvtitle) {
//         // displayMediaOptions = { video: true, audio: true }
//         // 获取本地视频流
//         let mediaStream = await this.getLocalStream(displayMediaOptions, switchvtitle);
//         let that = this;
//         that.timeout(() => {
//             //本地资源 赋值
//             that.say.videoObj.localStream = mediaStream;
//             userList.forEach(function (item, index) {
//                 // if (that.say.user.Id == item.clientId) {
//                 //     item.stream = mediaStream;
//                 // }
//                 // if ('11115' == item.clientId) {
//                 item.stream = mediaStream;
//                 // }
//             })
//             if (that.say.videoObj.ModeSwitch) {
//                 // 4个平分 翻页
//                 that.say.videoObj.StreamList = that.dataHandling([], 4, that.say.videoObj.userList);
//             } else {
//                 // 1大5小 翻页
//                 that.say.videoObj.StreamList = that.say.rtc.dataHandling([], 6, that.say.videoObj.userList);
//             }
//             // if($scope.videoObj.ModeSwitch){
//             // 4个平分 翻页
//             // if(userList.length>4){
//             //     alert('true:'+111);
//             // that.say.videoObj.StreamList = that.dataHandling([], 1 , that.say.videoObj.userList);
//             // }else{
//             //     that.say.videoObj.StreamList = userList;
//             // }
//             // that.html('BisectorMode',  that.say.videoObj.StreamList[that.say.videoObj.page] ,that.say.videoObj.ModeSwitch)
//             // }else{
//             //     // 1大5小 翻页
//             //     if($scope.videoObj.userList.length>6){
//             //         alert('false:'+222);
//             //         $scope.videoObj.StreamList = $scope.rtc.dataHandling([], 6 , $scope.videoObj.userList);
//             //     }else{
//             //         $scope.videoObj.StreamList = $scope.videoObj.userList;
//             //     }
//             // }
//             console.log(that.say.videoObj.StreamList)
//         });
//         console.log(that.say.videoObj.StreamList)
//         console.log(that.say.videoObj);
//         console.log(userList)
//     };
//     // html(id,data,ModeSwitch) {
//     //     // let that = this;
//     //     // console.log(data)
//     //     // $('#'+id).find('ul').html();
//     //     // let h = "";
//     //     // data.forEach(function (item) {
//     //     //     if(ModeSwitch){
//     //     //         console.log(item.stream)
//     //     //         h +=  `<li id="a" class="Bisector-list-item" data-index="0">
//     //     //         <video class="Bisector-list-item-stream" id="${item.clientId}"></video>

//     //     //         <div class="Bisector-list-item-stream-opt gg-flex-1">
//     //     //             <!-- 控制-关闭打开摄像头 -->
//     //     //             <i class="Bisector-list-item-stream-opt-btn" ng-class="${that.say.videoObj.vWebcam?'Bisector-list-item-stream-opt-btn-video':'Bisector-list-item-stream-opt-btn-video-disabled'}" ng-click="closeVideo($event)"></i>
//     //     //             <!-- 控制-关闭打开麦克风 -->
//     //     //             <i class="Bisector-list-item-stream-opt-btn" ng-class="that.say.videoObj.aMike?'Bisector-list-item-stream-opt-btn-audio':'Bisector-list-item-stream-opt-btn-audio-disabled'" ng-click="closeAudio($event)"></i>
//     //     //             <!-- 控制-是否全屏 -->
//     //     //             <i class="Bisector-list-item-stream-opt-btn Bisector-list-item-stream-opt-btn-FullScreen"   ng-click="requestFullScreen($event)"></i>
//     //     //         </div>
//     //     //     </li>`;
//     //     //     }else{
//     //     //         h +=  `<li id="a1" class="MasterMode-list-item" data-index="0"></li>`;
//     //     //     }
//     //     // }) 


//     //     // $('#'+id).find('ul').html(h);
//     //     data.forEach(function (item){
//     //         if(item.stream){
//     //             console.log(item.stream); 
//     //             console.log(item.clientId)
//     //             let node = document.getElementById(item.clientId);
//     //             console.log(node);

//     //             node.autoplay = true;
//     //             node.srcObject = item.stream;
//     //         }
//     //     })
//     // };
//     // 切割 数组 翻页调用
//     dataHandling(newArr, numb, arr) {
//         newArr = [];
//         let arrLength = arr.length; // 数组长度
//         let num = numb;  // 每页显示 10 条
//         let index = 0;
//         for (let i = 0; i < arrLength; i++) {
//             if (i % num === 0 && i !== 0) { // 可以被 10 整除
//                 newArr.push(arr.slice(index, i));
//                 index = i;
//             };
//             if ((i + 1) === arrLength) {
//                 newArr.push(arr.slice(index, (i + 1)));
//             }
//         };
//         return newArr;
//     };
//     // 获取本地的 视频数据和音频数据 流
//     getLocalStream(displayMediaOptions, switchvtitle) {
//         let that=this;
//         console.log(switchvtitle);
//         // { video: {width:  {  min: w , ideal: w , max: w }, height:  { min: h , ideal: h , max: h },   frameRate: 2000, }, audio: true }
//         return new Promise(function (resolve) {
//             // true 获取本地的 视频数据和音频数据
//             if (switchvtitle) {
//                 // 获取本地的 视频数据和音频数据 
//                 navigator.mediaDevices.getUserMedia(displayMediaOptions).then(stream => {
//                     that.say.videoObj.localStream=stream;
//                     resolve(stream);
//                 }).catch(Error => {
//                     alert(Error)
//                     console.group(Error);
//                     resolve(Error);
//                 });
//             } else {
//                 // 原生 屏幕共享  音频输出的电脑自身的声音 无法输出外部的声音 需特殊处理
//                 navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then(MediaStream => { 
//                     if (MediaStream.getAudioTracks()[0]) {
//                         // 删除屏幕共享 音频轨（必须先删除已有的音频，才能添加音频。否则无效）
//                         MediaStream.removeTrack(MediaStream.getAudioTracks()[0]);
//                     }
//                     console.log(displayMediaOptions);
//                     // 配置 displayMediaOptions.audio = true  获取本地音频 赋给 屏幕共享流 否则 直接返回屏幕视频流 无音频流
//                     if(displayMediaOptions.audio){
//                         // 获取本地的 视频数据和音频数据
//                         navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(stream => {
//                             //     // 本地麦克风 音频轨添加 屏幕共享里面
//                             MediaStream.addTrack(stream.getAudioTracks()[0]);
//                             that.say.videoObj.localStream=MediaStream;
//                             // node.autoplay = true;
//                             // node.srcObject = MediaStream; 
//                             //     // 返回 屏幕共享 流
//                             resolve(MediaStream);
//                         }).catch(Error => {
//                             alert(2(Error)
//                             console.group(Error);
//                             resolve(Error);

//                         });
//                     }else{
//                         resolve(MediaStream);
//                     }

//                 }).catch(Error => {
//                     alert(Error)
//                     console.group(Error);
//                     resolve(Error);

//                 });
//             }
//         })

//     };
//     // 设置 控制 流  屏幕共享或者本地摄像头 + 视频摄像头 音频 是否关闭 切换
//     async OnSetStream(data, id, displayMediaOptions, switchvtitle) {
//         let that = this;
//         // 获取 视频资源 流
//         let mediaStream = await this.getLocalStream(displayMediaOptions, switchvtitle);
//         console.log(mediaStream);
//         for (let i in data) {
//             if (data[i].clientId == id) {
//                 // 清空 数据里的 流资源
//                 // data[i].stream = '';
//                 // console.log(data[i])
//                 //更新数据
//                 that.timeout(() => {
//                     data[i].stream = mediaStream;
//                 })

//             }
//         }
//         // 更新视图
//         // this.say.$apply("");
//         // console.log(that.say.videoObj.StreamList[that.say.videoObj.page])

//     };
//     // 设置 控制 流 视频摄像头是否关闭
//     // async OnSetStreamV(data, id, displayMediaOptions, switchvtitle) {
//     //     let that = this;
//     //     // 获取 视频资源 流
//     //     let mediaStream = await this.getLocalStream(displayMediaOptions, switchvtitle);
//     //     console.log(mediaStream);
//     //     for (let i in data) {
//     //         if (data[i].clientId == id) { 
//     //             //更新数据
//     //             that.timeout(() => {
//     //                 data[i].stream = mediaStream;
//     //                 // let node=document.getElementById(id);
//     //                 // node.srcObject=  data[i].stream ;
//     //             })

//     //         }
//     //     }
//     //     // 更新视图
//     //     // this.say.$apply("");
//     //     // console.log(that.say.videoObj.StreamList[that.say.videoObj.page])
//     // };
// };

class rtc {
    frequency=0;//登录次数
    id = null;
    say = null;
    stream_type = {v:'_video',a:'_audio'};// 订阅的流类型 拼接字段 大流（{v:'_video',a:'_audio'}）小流（{v:'_video_1',a:'_audio'}）
    afreshInitRtc = false; //当前sdk 是否是重新登录
    isNoticeMainInviteMsg = false; //登录房间成功后 通知主页面发送邀请视频会议了消息记录值 在SDK异常返回调用-要不要通知主页面发送销毁房间的消息 还是直接销毁房间
    rootScope = null;
    logFirstPauseVi = false; // 登录成功后 回调的房间属性中 暂停列表中 包含自己
    logFirstPauseAu = false; // 登录成功后 回调的房间属性中 暂停列表中 包含自己
    timer = null; //定时器
    WebRtcSDK = null;// RTCSDK  实例
    apply = null; //apply 强制更新数据 + view视图
    timeout = null;  // timeout 函数 实时 更新 数据 + view视图
    constraints = null;//通话约束条件
    // cfgUri 服务器地址    //  eType INDEX = 1    MCU = 2
    setUrl(url, type, AuthoKey) {
        console.log(this.WebRtcSDK)
        this.WebRtcSDK.MakeRtcClient().setAuthoKey(AuthoKey);
        this.WebRtcSDK.MakeRtcClient().setUrl(url, type);
    };
    // 登录
    login(id, room, roomModel) {
        let that = this;
        this.WebRtcSDK.MakeRtcClient().login(id, room, roomModel);
        console.log(this.WebRtcSDK.MakeRtcClient())
        // 调用轮询 回调
        that.poll();
    };
    // 退出登录
    logout() {
        if (this.say.webRTC.ErrorTitle.length <= 0) {
            // 创建 正在加载 提示标签
            let node = document.createElement("div");
            node.className = 'gg-flex-1 gg-flex-2 loading-box';
            let title = document.createElement("div");
            title.innerText = '正在退出房间';
            node.appendChild(title);
            let img = document.createElement("img");
            img.src = 'img/ico_loading.gif';
            node.appendChild(img);
            document.getElementsByClassName('webRTC-wrapper')[0].appendChild(node);
        };
        // SDK 退出登录
        this.WebRtcSDK.MakeRtcClient().logout();
    };
    //  发布传入 setLocalStream 接口内的 资源
    publish(sendFlag, streamType, clientId) {
        // streamType
        //         1 ,//是音频
        //   2 ,//2是视频
        //   3 ,//是音频+视频  + 屏幕共享
        // send(sendFlag : boolean, streamType: number, clientId:string):number;
        //send发送资源流接口 sendFlag 是否发送资源  streamType资源类型：(1 = 音频) ( 2 = 视频)  ( 3 = 音频+视频  或者 屏幕共享)  clientId用户id
        this.WebRtcSDK.MakeRtcClient().publish(sendFlag, streamType, clientId);
    };
    // 获取SDK回调
    poll() {
        let that = this;
        // 创建定时器 轮询调用接口 返回值
        this.timer = setInterval(() => {
            that.timeout(async () => {
                // that.say.webRTC.orderType=that.say.webRTC.orderType+=1;
                // console.log(that.say.webRTC.orderType)
                let msgs = that.WebRtcSDK.MakeRtcClient().poll();
                if (msgs) {
                    console.log('msgs==>' ,msgs);
                    if (msgs.length > 0) {
                        for (let i in msgs) {
                            let msg = msgs[i];
                            // 非异常返回 关闭异常提示 处理
                            // if (msg._eventId != 48 || msg._eventId != 49 || msg._eventId != 50 || msg._eventId != 51) {
                            //     that.say.webRTC.ErrorTitle = [];
                            // }
                            // console.log('msg==>' , msg._eventId, msg);
                            switch (msg._eventId) {
                                case 1:
                                    if (that.WebRtcSDK.MakeRtcClient().getRemoteAudioIds().length > 0) {
                                        console.log(that.WebRtcSDK.MakeRtcClient().getRemoteAudioIds());
                                        that.say.webRTC.AudioIds = that.WebRtcSDK.MakeRtcClient().getRemoteAudioIds();
                                        // 创建 音频输出标签
                                        that.WebRtcSDK.MakeRtcClient().getRemoteAudioIds().map((item) => {
                                            if (!document.getElementById(item)) {
                                                let a = document.createElement("video");
                                                a.className = 'content_item_Audio';
                                                a.id = item;
                                                // a.innerText= item + '--音频标签';
                                                a.autoplay = true;
                                                document.getElementById('audio-box').appendChild(a);
                                            };
                                            if (document.getElementById(item)) {
                                                // 音频标签传给SDK
                                                that.WebRtcSDK.MakeRtcClient().setRemoteAudio(item, document.getElementById(item));
                                            }
                                        })
                                        // that.setCreateAudioTags(that.WebRtcSDK.MakeRtcClient().getRemoteAudioIds());
                                    }
                                    //  登录异常 sdk  返回的非0 提示登录失败  并且重新登录
                                    if (msg._map[1]) {
                                        //  msg._map[1] 返回的非0  要求客户端重新登录
                                        if (msg._map[1] != 0) {
                                            that.say.webRTC.ErrorTitle = '登录失败，正在重新登录'.replace(/\s*/g, "").split('');
                                            //  调用 在logout()退出SDK 判断是否重新登录
                                            that.afreshInitRtc = true;
                                            that.logout();
                                            // 连续登录失败5次  关闭视频会议窗口 强制退出
                                            if(that.frequency>=5){
                                                that.afreshInitRtc = false;
                                                that.say.webRTC.ErrorTitle = [];
                                            }else{
                                                that.frequency++;
                                            };
                                            // console.log('重新登录次数：'+that.frequency);
                                        }
                                        break;
                                        // alert('登录失败， 无法连接服务器：'+ msg._map[1]);
                                        // console.log('_logined==>', that.WebRtcSDK.MakeRtcClient()._logined);

                                        // // 记录邀请消息是否已经发送 SDK 返回异常时 是否发送房间销毁消息调用
                                        // // that.isNoticeMainInviteMsg=false;
                                        // if(!that.isNoticeMainInviteMsg){
                                        //      // 不发送通知 退出SDK 销毁当前房间
                                        //     that.rootScope.$broadcast('close-webrtcsdk');
                                        // }else{
                                        //     // 关闭窗口$scope.close 通知取消了当前视频会议房间
                                        //     that.rootScope.$broadcast('closeMsg-webrtcsdk');
                                        // }

                                        // that.logout();
                                        // return;
                                    } else {
                                        // 登录成功之后 清空 异常提示
                                        // if (msg._eventId != 48 || msg._eventId != 49 || msg._eventId != 50 || msg._eventId != 51) {
                                            that.say.webRTC.ErrorTitle = [];
                                        // }
                                        //  调用 在logout()退出SDK 判断是否重新登录 登录成功 重置 afreshInitRtc值
                                        that.afreshInitRtc = false;
                                        // afreshInitRtc 为false 当前 sdk 不是重新登录
                                        if (!that.afreshInitRtc) {
                                            // that.isNoticeMainInviteMsg 为false 未发送过邀请消息 需要发送邀请消息
                                            if (!that.isNoticeMainInviteMsg) {
                                                // 登录成功 通知主页面发送视频会议邀请消息
                                                that.say.NoticeMainInviteMsg();
                                                // 记录邀请消息是否已经发送 SDK 返回异常时 是否发送房间销毁消息调用
                                                that.isNoticeMainInviteMsg = true;
                                            }
                                        }
                                    };
                                    //  obj_type_users = 1,  //用户列表  array_objs*
                                    // obj_type_atrrs = 2,  //房间属性  base_object*
                                    // 1 登录成功 后 获取返回已在房间内的成员- 包含自己  用户列表 + 用户属性
                                    if (msg._arrays[1]) {
                                        // 存入容器
                                        msg._arrays[1]._objs.map(item => {
                                            console.log(item._map, msg._eventId);
                                            // 添加 登录成功 返回的成员列表
                                            that.OnsetList(that, item._map);
                                            // 登录成功收到的用户属性 - medias 流 属性  有添加至 订阅列表orderList 自己的id不添加进去
                                            if (item._map.medias && item._map[3] != that.say.webRTC.msg.userId) {
                                                // 需要订阅的远端 流
                                                that.say.webRTC.orderList.push(item._map[3]);
                                            }
                                        })

                                    }
                                    console.log(that.say.webRTC.orderList)
                                    // 1 登录成功 后 获取返回房间属性
                                    if (msg._objs[2]._map) {
                                        //  默认房间属性 mode存在
                                        if (msg._objs[2]._map.mode) {
                                            // if (msg._objs[2]._map.mode != that.say.webRTC.msg.mode) {
                                            //     // 修改房间属性
                                            //     // for (let i in that.say.webRTC.userList) {
                                            //     //     that.say.webRTC.userList[i].mode = msg._objs[2]._map.mode;
                                            //     // }
                                            //     // that.OnsetLocalList(that.say.webRTC.msg.userId, { 'mode': msg._objs[2]._map.mode });
                                            //     // //   id+ '_video';//大流 
                                            //     that.say.webRTC.msg.mode = msg._objs[2]._map.mode;

                                            //     // that.OnSetRoomAttr([{ 'mode': that.say.webRTC.msg.mode }]);
                                            //     console.log(that.say.webRTC.orderList);
                                            // }
                                            //  默认房间属性是 video 如果创建的房间模式不是video 则重新设置房间模式 模式相同则不设置房间模式
                                            if (msg._objs[2]._map.mode == "screen") {
                                                // 修改房间属性
                                                for (let i in that.say.webRTC.userList) {
                                                    if (that.say.webRTC.userList[i].id == msg._objs[2]._map.shared) {
                                                        that.say.webRTC.userList[i].mode = msg._objs[2]._map.mode;
                                                        that.say.webRTC.userList[i].Zoom = 2;
                                                    }
                                                }
                                                that.say.webRTC.Headershow = false;
                                                // 画面大屏 显示
                                                that.say.webRTC.selectItemId = msg._objs[2]._map.shared;
                                                // 切换显示模式
                                                that.say.webRTC.ModeSwitch = false;
                                                // 最小化 时显示 屏幕共享让的流
                                                that.say.webRTC.minimize.id = msg._objs[2]._map.shared;
                                                // 房间属性  id+ '_video';//大流 
                                                that.say.webRTC.msg.mode = msg._objs[2]._map.mode;
                                                that.say.webRTC.modeId = msg._objs[2]._map.shared;
                                                //屏幕共享 在线成员列表显示时 隐藏成员列表
                                                if (that.say.webRTC.MemberListshow) {
                                                    that.say.webRTC.MemberListshow = false;
                                                }
                                                //  let clientId = '';// P2P模式  clientId= 对方用户id
                                                //  let streamType = null;//资源类型：(1 = 音频) ( 2 = 视频)  ( 3 = 音频+视频  或者 屏幕共享)
                                                //  if (that.say.webRTC.msg.mode == 'audio') {
                                                //      streamType = 1;
                                                //  } else if (that.say.webRTC.msg.mode == 'video' || that.say.webRTC.msg.mode == 'screen') {
                                                //      streamType = 3;
                                                //  }

                                                if (msg._objs[2]._map.shared != that.say.webRTC.msg.userId) {
                                                    // 获取本地资源流
                                                    await that.OnLocalCamera();
                                                    // that.OnLocalCamera()
                                                    // 订阅该成员流 
                                                    let id = msg._objs[2]._map.shared + that.stream_type.v + msg._objs[2]._map.shared + that.stream_type.a;
                                                    // 小流 只传 id 不需要拼接 id + '_video_1'
                                                    // let id = msg._objs[2]._map.shared ;
                                                    console.log('订阅成员:' +  msg._objs[2]._map.shared + '资源');
                                                    that.WebRtcSDK.MakeRtcClient().orderStream(id);
                                                    that.timeout(() => {
                                                        // setTimeout(() => {
                                                        $('#webRTC-main video').css({ 'object-fit': 'contain' });

                                                        // 获取创建好的 demo元素
                                                        let video = document.getElementById(msg._objs[2]._map.shared);
                                                        // 渲染 其他成员    流资源
                                                        that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
                                                        console.log('渲染' + id + '资源');
                                                    }, 100)
                                                    // })
                                                } else {
                                                    // 屏幕共享 流 
                                                    await that.Onscreenshare();
                                                    that.timeout(() => {
                                                        $('#webRTC-main video').css({ 'object-fit': 'contain' });
                                                    }, 100)

                                                }
                                            } else {
                                                // 获取本地资源流
                                                // that.OnLocalCamera();
                                                await that.OnLocalCamera();
                                                // 修改房间属性
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].mode = msg._objs[2]._map.mode;
                                                    that.say.webRTC.userList[i].Zoom = 0;
                                                }
                                                // 房间属性  id+ '_video';//大流 
                                                that.say.webRTC.msg.mode = 'video';
                                                that.say.webRTC.modeId = '';
                                                // 头部显示
                                                that.say.webRTC.Headershow = true;
                                                // 登录成功之后房间模式 不是屏幕共享  mode: "screen" 是mode: "video"
                                                if (that.say.webRTC.orderList.length > 0) {
                                                    let neworderList = [];
                                                    that.say.webRTC.orderList.map((item, i) => {
                                                        // 小屏也改为大流
                                                        neworderList.push(item + that.stream_type.v);
                                                        // 小流 只传 id 不需要拼接 id + '_video_1'
                                                        // neworderList.push(item );
                                                        neworderList.push(item + that.stream_type.a);
                                                    })
                                                    // 转字符串 
                                                    let id = neworderList.join(';');
                                                    // 订阅该成员流
                                                    that.WebRtcSDK.MakeRtcClient().orderStream(id);
                                                    // 列表渲染完 执行订阅 渲染流
                                                    $('#webRTC-main video').css({ 'object-fit': 'contain' });
                                                    that.timeout(() => {
                                                        // setTimeout(() => {

                                                        that.say.webRTC.orderList.map((item, i) => {
                                                            // 获取创建好的 demo元素  去掉id拼接的 小流字段
                                                            let video = document.getElementById(item);
                                                            // 渲染 其他成员    流资源
                                                            that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
                                                            console.log('渲染' + id + '资源');
                                                        })
                                                    }, 100)
                                                    // }, 100)

                                                }

                                                // let clientId = '';// P2P模式  clientId= 对方用户id
                                                // let streamType = null;//资源类型：(1 = 音频) ( 2 = 视频)  ( 3 = 音频+视频  或者 屏幕共享)
                                                // if (that.say.webRTC.msg.mode == 'audio') {
                                                //     streamType = 1;
                                                // } else if (that.say.webRTC.msg.mode == 'video' || that.say.webRTC.msg.mode == 'screen') {
                                                //     streamType = 3;
                                                // }

                                            }
                                        }
                                        // that.timeout(() => {
                                        // 房主id不等于undefined 添加到 成员列表中
                                        if (typeof (msg._objs[2]._map.master) != 'undefined') {

                                            for (let i in that.say.webRTC.userList) {
                                                // 给列表中的每条数据增加 房主的id
                                                that.say.webRTC.userList[i].master = msg._objs[2]._map.master;
                                                // 房主id 等于 自己 id
                                                if (that.say.webRTC.userList[i].id == msg._objs[2]._map.master) {
                                                    that.say.webRTC.msg.master = msg._objs[2]._map.master;
                                                }
                                            }
                                            // 设置显示的 ui 列表数据
                                            that.OnsetStreamList();
                                        } else if (that.say.webRTC.msg.master != '' && that.say.webRTC.msg.master == that.say.webRTC.msg.userId) {
                                            // 房主id 等于undefined 设置房间属性 房主为自己
                                            //设置房间属性  "master";//会议创建者 房主
                                            that.OnSetRoomAttr([{ 'master': that.say.webRTC.msg.userId }]);
                                            // // 房主为自己时设置添加的成员用户属性
                                            // that.say.webRTC.userList.map((item) => {
                                            //     if (item.id == that.say.webRTC.msg.userId) {
                                            //         item.status = '1';
                                            //     } else {
                                            //         //添加其他成员
                                            //         let data = [{ 'n': item.name }, { 'i': item.img },{'c': item.ClientId}];
                                            //         that.OnsetAddParticipant(item.id,data);
                                            //     }
                                            // });

                                        }
                                        // 会议管理员
                                        if (typeof (msg._objs[2]._map.manager) != 'undefined') {
                                            if (msg._objs[2]._map.manager != '') {
                                                that.say.webRTC.msg.manager = msg._objs[2]._map.manager.split(',');
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].manager = msg._objs[2]._map.manager
                                                    // 会议管理员 包含自己
                                                    // if( msg._objs[2]._map.manager.indexOf(that.say.webRTC.userList[i].id)>=0){
                                                    //     that.say.webRTC.userList[i].manager = that.say.webRTC.userList[i].id;
                                                    // }else{
                                                    //     that.say.webRTC.userList[i].manager = '' ;
                                                    // }
                                                }
                                            } else {
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].manager = '';
                                                }
                                                that.say.webRTC.msg.manager = [];
                                            }
                                            // 设置显示的 ui 列表数据
                                            that.OnsetStreamList()
                                        }
                                        //  暂停麦克风
                                        if (typeof (msg._objs[2]._map.banAudio) != 'undefined') {
                                            // 登录成功后 回调的房间属性中 暂停列表中 包含自己
                                            if (msg._objs[2]._map.banAudio.indexOf(that.say.webRTC.msg.userId) >= 0) {
                                                that.setPauseAV(that, msg._objs[2]._map.banAudio, 1, { 'audioPause': '' });
                                            }
                                            that.say.webRTC.PauseAulist = msg._objs[2]._map.banAudio.split(',');
                                            if (msg._objs[2]._map.banAudio == '') {
                                                // 暂停 麦克风 列表
                                                that.say.webRTC.PauseAulist = [];
                                            }
                                            console.log(that.say.webRTC.PauseAulist)
                                        }
                                        // 暂停视频
                                        if (typeof (msg._objs[2]._map.banVideo) != 'undefined') {
                                            // 登录成功后 回调的房间属性中 暂停列表中 包含自己
                                            if (msg._objs[2]._map.banVideo.indexOf(that.say.webRTC.msg.userId) >= 0) {
                                                that.setPauseAV(that, msg._objs[2]._map.banVideo, 2, { 'videoPause': '' });
                                            }
                                            that.say.webRTC.PauseVilist = msg._objs[2]._map.banVideo.split(',');
                                            if (msg._objs[2]._map.banVideo == '') {
                                                // 暂停 视频 列表
                                                that.say.webRTC.PauseVilist = [];
                                            }
                                            console.log(that.say.webRTC.PauseVilist);
                                        }
                                        // },100)
                                    }
                                    // //发送 本地资源流 
                                    let clientId = '';// P2P模式  clientId= 对方用户id
                                    let streamType = null;//资源类型：(1 = 音频) ( 2 = 视频)  ( 3 = 音频+视频  或者 屏幕共享)
                                    if (that.say.webRTC.msg.mode == 'audio') {
                                        streamType = 1;
                                    } else if (that.say.webRTC.msg.mode == 'video' || that.say.webRTC.msg.mode == 'screen') {
                                        streamType = 3;
                                    }
                                    // that.timeout(() => {
                                    that.publish(true, streamType, clientId);
                                    // },100)

                                    // 修改用户列表里的 自己登录状态
                                    that.say.webRTC.msg.status = '1';

                                    // 设置自己的用户属性 发送信令 c字段-成员在群里传群id 不在群里面是会议小助手id
                                    let obj = [{ 'n': that.say.webRTC.msg.username }, { 'i': that.say.webRTC.msg.img }, { 'c': that.say.webRTC.msg.ClientId }];
                                    this.OnSetUserAttr(obj);

                                    break;
                                case 2:// 自己设置的房间属性
                                    if (msg._map) {
                                        //房主id 添加到 成员列表中
                                        if (typeof (msg._map.master) != 'undefined') {
                                            for (let i in that.say.webRTC.userList) {
                                                that.say.webRTC.userList[i].master = msg._map.master;
                                                // 房主id 等于 自己 id
                                                if (that.say.webRTC.msg.userId == msg._map.master) {
                                                    that.say.webRTC.msg.master = msg._map.master;
                                                    // 房主为自己时设置邀请的其他成员用户属性
                                                    if (that.say.webRTC.userList[i].id != that.say.webRTC.msg.userId) {
                                                        //添加其他成员
                                                        let data = [{ 'n': that.say.webRTC.userList[i].name }, { 'i': that.say.webRTC.userList[i].img }, { 'c': that.say.webRTC.userList[i].ClientId }];
                                                        that.OnsetAddParticipant(that.say.webRTC.userList[i].id, data);
                                                    }
                                                }
                                            }
                                            // 设置显示的 ui 列表数据
                                            that.OnsetStreamList()
                                        }
                                        // 会议管理员
                                        // if (typeof (msg._map.manager) != 'undefined') {
                                        //      // 会议管理员 包含自己
                                        //     if(msg._map.manager.indexOf(that.say.webRTC.msg.userId)>=0){
                                        //         for (let i in that.say.webRTC.userList) {
                                        //             that.say.webRTC.userList[i].manager = that.say.webRTC.msg.userId;
                                        //         }
                                        //     }else{
                                        //         for (let i in that.say.webRTC.userList) {
                                        //             that.say.webRTC.userList[i].manager = '';
                                        //         }
                                        //     }
                                        //     that.say.webRTC.msg.manager =  msg._map.manager.split(',');
                                        //     if(msg._map.manager == ''){
                                        //         that.say.webRTC.msg.manager =  [];
                                        //     }
                                        //      // 设置显示的 ui 列表数据
                                        //      that.OnsetStreamList()
                                        // }
                                        if (typeof (msg._map.manager) != 'undefined') {
                                            if (msg._map.manager != '') {
                                                that.say.webRTC.msg.manager = msg._map.manager.split(',');
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].manager = msg._map.manager;
                                                    // 会议管理员 包含自己
                                                    // if( msg._map.manager.indexOf(that.say.webRTC.userList[i].id)>=0){
                                                    //     that.say.webRTC.userList[i].manager = that.say.webRTC.userList[i].id;
                                                    // }else{
                                                    //     that.say.webRTC.userList[i].manager = '' ;
                                                    // }
                                                }
                                            } else {
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].manager = '';
                                                }
                                                that.say.webRTC.msg.manager = [];
                                            }
                                            // 设置显示的 ui 列表数据
                                            that.OnsetStreamList()
                                        }
                                        // 暂停列表中有多个成员时  自己设置的房间属性
                                        //  暂停或者打开 麦克风
                                        if (typeof (msg._map.banAudio) != 'undefined') {
                                            that.setPauseAV(that, msg._map.banAudio, 1, { 'audioPause': '' });
                                            // 暂停音频列表
                                            that.say.webRTC.PauseAulist = msg._map.banAudio.split(',');
                                            if (msg._map.banAudio == '') {
                                                // 暂停 视频 列表
                                                that.say.webRTC.PauseAulist = [];
                                            }
                                            console.log(that.say.webRTC.PauseAulist);

                                        }
                                        // 暂停或者打开 视频
                                        if (typeof (msg._map.banVideo) != 'undefined') {
                                            //  banVideo关闭摄像头 关闭资源流 视频  bPause：true暂停 false不暂停    pauseSend(bPause:boolean, streamType:Entity.EStreamType, clientId:string):number;   streamType：1 关闭音频  2 关闭视频 3//是关闭音频+视频  + 屏幕共享
                                            that.setPauseAV(that, msg._map.banVideo, 2, { 'videoPause': '' });
                                            // 暂停 视频 列表
                                            that.say.webRTC.PauseVilist = msg._map.banVideo.split(',');
                                            if (msg._map.banVideo == '') {
                                                // 暂停 视频 列表
                                                that.say.webRTC.PauseVilist = [];
                                            }
                                            console.log(that.say.webRTC.PauseVilist);
                                        }
                                    }
                                    break;
                                case 3:// 自己设置的用户属性

                                    break;
                                case 6:// 退出登录 resp_logout
                                    // 销毁定时器
                                    clearInterval(that.timer);
                                    that.timer = null;
                                    if (that.say.webRTC.localStream) {
                                        that.say.webRTC.localStream.getTracks().forEach(track => {
                                            console.log('stop==>', track);
                                            track.stop();
                                        });
                                        that.say.webRTC.localStream = null;
                                    }
                                    // 检查父元素是否包含子元素
                                    if (document.getElementsByClassName('webRTC-wrapper')[0].contains(document.getElementsByClassName('loading-box')[0])) {
                                        // 删除正在加载提示标签
                                        document.getElementsByClassName('webRTC-wrapper')[0].removeChild(document.getElementsByClassName('loading-box')[0]);
                                    }
                                    // SDK 返回异常 正在进行销毁 + 重新登录 调用登录函数 不需要关闭cef视频会议窗口
                                    if (that.afreshInitRtc) {
                                        // 当前为重新登录
                                        that.login(that.say.webRTC.msg.userId, that.say.webRTC.msg.roomid, that.say.webRTC.roomModel);
                                        // that.say.initRtc();
                                    } else {
                                        // that.timeout(() => {
                                        // 关闭cef视频会议窗口
                                        that.say.closeTheCefWindow();
                                        // })
                                    }

                                    break;
                                case 48:// 网络断开，等待重连
                                    that.say.webRTC.ErrorTitle = '网络断开，等待重连'.replace(/\s*/g, "").split('');
                                    // console.log('  网络断开 等待重连 ===> ', msg);
                                    break;
                                case 49:// 开始重新登录 eKeyRoomKey eKeyClientKey
                                    // console.log('  开始重新登录 ===> ', msg);
                                    that.say.webRTC.ErrorTitle = ' 开始重新登录 '.replace(/\s*/g, "").split('');
                                    break;
                                case 50:// 断开 eKeyRoomKey eKeyClientKey
                                    that.say.webRTC.ErrorTitle = ' 网络断开重新登录失败，正在退出房间 '.replace(/\s*/g, "").split('');
                                    //  视频会议邀请消息已发送 视频会议房间异常 正在销毁房间 通知主页面 销毁存储的临时房间数据  closeMsg-webrtcsdk函数内部判断是否满足发送房间销毁消息
                                    if (that.isNoticeMainInviteMsg ) {
                                        that.rootScope.$broadcast('closeMsg-webrtcsdk');
                                    } else {
                                        // 视频会议邀请消息未发送 视频会议房间异常 正在销毁房间  通知主页面 销毁存储的临时房间数据 但不发送房间销毁消息
                                        that.rootScope.$broadcast('close-webrtcsdk');
                                    }
                                    // console.log('  断开  ===> ', msg);
                                    break;
                                case 51://  自己异地登录
                                    that.say.webRTC.ErrorTitle = ' 异地登录，正在退出房间 '.replace(/\s*/g, "").split('');
                                    //  视频会议邀请消息已发送 视频会议房间异常 正在销毁房间 通知主页面 销毁存储的临时房间数据  closeMsg-webrtcsdk函数内部判断是否满足发送房间销毁消息
                                    if (that.isNoticeMainInviteMsg ) {
                                        that.rootScope.$broadcast('closeMsg-webrtcsdk');
                                    } else {
                                        // 视频会议邀请消息未发送 视频会议房间异常 正在销毁房间  通知主页面 销毁存储的临时房间数据 但不发送房间销毁消息
                                        that.rootScope.$broadcast('close-webrtcsdk');
                                    }
                                    // console.log('  自己异地登录  ===> ', msg);
                                    break;
                                case 52://其他成员 登录 ntf_status_chaned:52
                                    if (msg._map) {
                                        //  新成员加入房间 数据存入 用户列表
                                        that.OnsetList(that, msg._map)
                                    }
                                    break;
                                case 60:// 其他成员设置房间属性 ntf_setroom_attr：60
                                    if (msg._map) {
                                        // 房间属性
                                        if (typeof (msg._map.mode) != 'undefined') {
                                            if (msg._map.mode == 'screen' && msg._map.shared) {
                                                // 调用angularjs 原生 timeout 更新视图
                                                // that.timeout(() => {
                                                // 头部不显示
                                                that.say.webRTC.Headershow = false;
                                                // 画面大屏 显示
                                                that.say.webRTC.selectItemId = msg._map.shared;
                                                // 切换显示模式
                                                that.say.webRTC.ModeSwitch = false;
                                                //屏幕共享 在线成员列表显示时 隐藏成员列表
                                                if (that.say.webRTC.MemberListshow) {
                                                    that.say.webRTC.MemberListshow = false;
                                                }
                                                // 最小化 时显示 屏幕共享让的流
                                                that.say.webRTC.minimize.id = msg._map.shared;
                                                // //   id+ '_video';//大流 
                                                that.say.webRTC.msg.mode = msg._map.mode;
                                                that.say.webRTC.modeId = msg._map.shared;
                                                let id = msg._map.shared + that.stream_type.v + ";" + msg._map.shared + that.stream_type.a;
                                                // 小流 只传 id 不需要拼接 id + '_video_1'
                                                // let id = msg._map.shared + '_video_1';
                                                // 订阅该成员流
                                                that.WebRtcSDK.MakeRtcClient().orderStream(id);

                                                for (let i in that.say.webRTC.userList) {
                                                    // 修改房间属性
                                                    if (that.say.webRTC.userList[i].id == msg._map.shared) {
                                                        that.say.webRTC.userList[i].mode = msg._map.mode;
                                                        // 屏幕等级 - 2 （全屏）
                                                        that.say.webRTC.userList[i].Zoom = 2;
                                                    }
                                                    if (that.say.webRTC.userList[i].id == msg._map.shared && (that.say.webRTC.userList[i].orderSwitch == undefined || !that.say.webRTC.userList[i].orderSwitch)) {
                                                        // 订阅之后修改数据赋值 记录
                                                        that.say.webRTC.userList[i].orderSwitch = true;
                                                        break;//跳出循环
                                                    }
                                                }
                                                that.timeout(() => {
                                                    $('#webRTC-main video').css({ 'object-fit': 'contain' });
                                                    // that.timeout(() => {
                                                    // 获取创建好的 demo元素
                                                    let video = document.getElementById(msg._map.shared);
                                                    // 渲染 其他成员    流资源
                                                    that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
                                                    // })
                                                }, 100)
                                                // }, 100)
                                                // that.timeout(() => {
                                                //     // 获取创建好的 demo元素
                                                //     let video = document.getElementById(msg._map.shared);
                                                //     // 渲染 其他成员    流资源
                                                //     that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
                                                // },10000)
                                            } else if (msg._map.mode == 'video' && that.say.webRTC.msg.mode != msg._map.mode) {
                                                // that.timeout(() => {

                                                for (let i in that.say.webRTC.userList) {
                                                    // 修改房间属性
                                                    that.say.webRTC.userList[i].mode = msg._map.mode;
                                                    // 屏幕等级 - 0 （最小 订阅多个有流的成员）
                                                    that.say.webRTC.userList[i].Zoom = 0;
                                                }
                                                console.log(that.say.webRTC.localStream);
                                                // 头部显示
                                                that.say.webRTC.Headershow = true;
                                                // 画面大屏 显示
                                                that.say.webRTC.selectItemId = '';
                                                // 切换显示模式
                                                that.say.webRTC.ModeSwitch = true;
                                                // 最小化 时显示 默认给自己
                                                that.say.webRTC.minimize.id = that.say.webRTC.msg.userId;
                                                // //   id+ '_video';//大流 
                                                that.say.webRTC.msg.mode = msg._map.mode;
                                                that.say.webRTC.modeId = '';
                                                //     setTimeout(() => {
                                                $('#webRTC-main video').css({ 'object-fit': 'contain' });
                                                that.OnCutoverAgainRendering();
                                                // }, 100)
                                                // })
                                            }

                                        }
                                        //房主id 添加到 成员列表中
                                        if (typeof (msg._map.master) != 'undefined') {
                                            for (let i in that.say.webRTC.userList) {
                                                that.say.webRTC.userList[i].master = msg._map.master;
                                                // 房主id 等于 自己 id
                                                if (that.say.webRTC.userList[i].id == msg._map.master) {
                                                    that.say.webRTC.msg.master = msg._map.master;
                                                }
                                            }
                                            // 设置显示的 ui 列表数据
                                            that.OnsetStreamList()
                                        }
                                        // 会议管理员
                                        if (typeof (msg._map.manager) != 'undefined') {
                                            if (msg._map.manager != '') {
                                                that.say.webRTC.msg.manager = msg._map.manager.split(',');
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].manager = msg._map.manager;
                                                    // for (let k in that.say.webRTC.userList) {
                                                    //     that.say.webRTC.userList[i].manager = that.say.webRTC.userList[i].id;

                                                    //     }
                                                    // 会议管理员 包含自己
                                                    // if( msg._map.manager.indexOf(that.say.webRTC.userList[i].id)>=0){
                                                    //     that.say.webRTC.userList[i].manager = that.say.webRTC.userList[i].id;
                                                    // }else{
                                                    //     that.say.webRTC.userList[i].manager = '' ;
                                                    // }
                                                }
                                            } else {
                                                for (let i in that.say.webRTC.userList) {
                                                    that.say.webRTC.userList[i].manager = '';
                                                }
                                                that.say.webRTC.msg.manager = [];
                                            }
                                            // 设置显示的 ui 列表数据
                                            that.OnsetStreamList()
                                        }
                                        // if (typeof (msg._map.manager) != 'undefined' ) {
                                        //       // 会议管理员 包含自己
                                        //     if(msg._map.manager.indexOf(that.say.webRTC.msg.userId)>=0){
                                        //         for (let i in that.say.webRTC.userList) {
                                        //             that.say.webRTC.userList[i].manager = that.say.webRTC.msg.userId;
                                        //         }
                                        //     }else{
                                        //         for (let i in that.say.webRTC.userList) {
                                        //             that.say.webRTC.userList[i].manager = '';
                                        //         }
                                        //     }
                                        //     // for (let i in that.say.webRTC.userList) {
                                        //     //     if( msg._map.manager.indexOf(that.say.webRTC.userList[i].id )>=0){
                                        //     //         that.say.webRTC.userList[i].manager = that.say.webRTC.userList[i].id;
                                        //     //     }else{
                                        //     //         that.say.webRTC.userList[i].manager ='';
                                        //     //     }
                                        //     // }
                                        //     that.say.webRTC.msg.manager =  msg._map.manager.split(',');
                                        //     if(msg._map.manager == ''){
                                        //         that.say.webRTC.msg.manager =  [];
                                        //     }
                                        //      // 设置显示的 ui 列表数据
                                        //      that.OnsetStreamList()
                                        // }
                                        // 暂停自己的音频
                                        if (typeof (msg._map.banAudio) != 'undefined') {
                                            that.setPauseAV(that, msg._map.banAudio, 1, { 'audioPause': '' });
                                            // 暂停音频列表
                                            if (msg._map.banAudio != '') {
                                                that.say.webRTC.PauseAulist = msg._map.banAudio.split(',');
                                            } else {
                                                that.say.webRTC.PauseAulist = [];
                                            }

                                            console.log(that.say.webRTC.PauseAulist);
                                        }
                                        // 暂停自己的视频
                                        if (typeof (msg._map.banVideo) != 'undefined') {
                                            //  banVideo关闭摄像头 关闭资源流 视频  bPause：true暂停 false不暂停    pauseSend(bPause:boolean, streamType:Entity.EStreamType, clientId:string):number;   streamType：1 关闭音频  2 关闭视频 3//是关闭音频+视频  + 屏幕共享
                                            that.setPauseAV(that, msg._map.banVideo, 2, { 'videoPause': '' });
                                            // 暂停 视频 列表 
                                            if (msg._map.banVideo != '') {
                                                that.say.webRTC.PauseVilist = msg._map.banVideo.split(',');
                                            } else {
                                                that.say.webRTC.PauseVilist = [];
                                            }
                                            console.log(that.say.webRTC.PauseVilist);
                                        }
                                    }
                                    break;
                                case 61:// 其他成员设置用户属性 ntf_setuser_attr：61
                                    if (msg._map) {
                                        // medias 其他成员设置用户属性:流 属性（a，v，av）， msg._map[2] id
                                        // 个人属性  { 'medias': 'a' }//音频 { 'medias': 'v' }//视频 { 'medias': 'av' }//视频+音频  { 'medias': '' }//没有画面和语音
                                        if (msg._map.medias && msg._map[2]) {
                                            // 需要订阅的远端 流 列表中没有对应id时添加 
                                            if (that.say.webRTC.orderList.join().indexOf(msg._map[2]) < 0) {
                                                that.say.webRTC.orderList.push(msg._map[2]);

                                            }
                                            // 不是屏幕共享
                                            if (that.say.webRTC.ModeSwitch && that.say.webRTC.msg.mode != 'screen') {
                                                // 头部显示
                                                that.say.webRTC.Headershow = true;
                                                for (let i in that.say.webRTC.userList) {
                                                    // id 相同  且 未订阅的发送订阅接口(orderStream) 已订阅的直接调用渲染接口(setRemoteVideo)
                                                    if (that.say.webRTC.userList[i].id == msg._map[2] && that.say.webRTC.userList[i].orderSwitch != 'undefined' && !that.say.webRTC.userList[i].orderSwitch) {
                                                        // 订阅之后修改数据赋值 记录
                                                        that.say.webRTC.userList[i].orderSwitch = true;
                                                        break;//跳出循环
                                                    }
                                                }
                                                let neworderList = [];
                                                that.say.webRTC.orderList.map((item, i) => {
                                                    // 小屏也改为大流
                                                    neworderList.push(item + that.stream_type.v);
                                                    // 小流 只传 id 不需要拼接 item + '_video_1'
                                                    // neworderList.push(item + '_video_1');
                                                    neworderList.push(item + that.stream_type.a);
                                                })
                                                // 转字符串  多个资源id分号;切割
                                                let id = that.utf8ToSting(neworderList.join(';'));
                                                // 订阅该成员流
                                                that.WebRtcSDK.MakeRtcClient().orderStream(id);
                                                // 列表渲染完 执行订阅 渲染流
                                                that.timeout(() => {
                                                    //     setTimeout(() => {
                                                    $('#webRTC-main video').css({ 'object-fit': 'contain' });
                                                    that.say.webRTC.orderList.map((item, i) => {
                                                        // 获取创建好的 demo元素  去掉id拼接的 小流字段
                                                        let video = document.getElementById(item);
                                                        // 标签存在
                                                        if (video) {
                                                            // 渲染 其他成员    流资源
                                                            that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
                                                        }
                                                    })
                                                    console.log('渲染' + id + '资源');

                                                }, 100);
                                                // })
                                            }


                                        }
                                        if (msg._map.medias == '' && msg._map[2]) {
                                            // 无视频或者音频 流 列表中存在的 删除对应id
                                            for (let i in that.say.webRTC.orderList) {
                                                if (that.say.webRTC.orderList[i] == msg._map[2]) {
                                                    that.say.webRTC.orderList.split(i, 1)
                                                }
                                            }
                                        }
                                        // // 根据用户属性 n i 修改用户列表
                                        that.OnsetList(that, msg._map);
                                    }
                                    break;
                                case 63: //ntf_recv_msg：63 返回 其他成员 发送 消息
                                    if (msg._map && msg._map[11]) {
                                        // 消息内容
                                        let body = that.utf8ToSting(msg._map[11]);
                                        let id = that.utf8ToSting(msg._map[2]);
                                        console.log(id, body);
                                        // 收到消息 修改消息列表
                                        // homelogic.setMsgList(that, id, body);
                                    }
                                    break;
                                default:
                                // alert(msg._eventId);
                            }
                        }
                    }
                } else {
                    return console.log(msgs);
                };
            }, 0, true);
        }, 1000)

    };
    // webRtc poll回调 修改 用户列表
    async OnsetList(that, msg) {
        var is = false;
        // 自己的 msg.c （ClientId） 为群id 修改 that.say.webRTC.msg.chatRoomId内的会议小助手ID
        // if(msg.c){
        //     if (msg.c.indexOf('group_') >= 0 && that.say.webRTC.msg.userId ==   msg['2'] ) {
        //         if (that.say.webRTC.msg.chatRoomId.join(',').indexOf('s_f8') >= 0) {
        //             that.say.webRTC.msg.chatRoomId.map((item,index) => {
        //                 if (item.indexOf('s_f8') >= 0) {
        //                     that.say.webRTC.msg.chatRoomId.splice(index,1,msg.c);
        //                 }
        //             })
        //         }
        //     };
        // };
        return new Promise((resolve) => {
            for (let i in that.say.webRTC.userList) {
                // 2 客户端ID用户id  3 登录的KEY  4用户状态
                if (msg['2'] && msg['2'].replace(/\s+/g, "") != '') {
                    // ClientKey 静静id
                    if (that.say.webRTC.userList[i].ClientKey == msg['2']) {
                        // if (that.say.webRTC.userList[i].id == msg['2']) {

                        that.say.webRTC.userList[i].ClientId = msg.c ? msg.c : that.say.webRTC.userList[i].ClientId;//服务端生成的id
                        //成员状态  0-待加入 1-在线 2-断线  3-离开
                        that.say.webRTC.userList[i].status = msg['4'] ? msg['4'] : that.say.webRTC.userList[i].status;
                        that.say.webRTC.userList[i].img = msg.i && msg.i.indexOf('http://org.jj.woniu.com')>=0 ?msg.i : msg.i && msg.i.indexOf('IM')>=0 && msg.i.indexOf('http://org.jj.woniu.com')< 0 ? 'http://org.jj.woniu.com' + msg.i : that.say.webRTC.userList[i].img;
                        that.say.webRTC.userList[i].name = msg.n ? that.utf8ToSting(msg.n) : that.say.webRTC.userList[i].name;
                        that.say.webRTC.userList[i].medias = typeof (msg.medias) != 'undefined' ? msg.medias : that.say.webRTC.userList[i].medias;
                        if (typeof (msg.medias) != 'undefined') {
                            //  音频控制器  是否暂停 音频 
                            that.say.webRTC.userList[i].audioPause = msg.medias.indexOf("a") < 0 ? true : false;
                            //  音频控制器  是否暂停 音频 
                            that.say.webRTC.userList[i].videoPause = msg.medias.indexOf("v") < 0 ? true : false;
                        }
                        is = false;
                        break;//跳出当前循环
                    } else {
                        is = true;
                    }
                }
            }
            if (is) {
                that.say.webRTC.userList.push({
                    ClientKey: msg['2'],//静静id
                    ClientId: msg.c ? msg.c : '',//服务端生成的id
                    id: msg['3'],
                    img:  msg.i && msg.i.indexOf('http://org.jj.woniu.com')>=0 ?msg.i : msg.i && msg.i.indexOf('IM')>=0 && msg.i.indexOf('http://org.jj.woniu.com')< 0 ? 'http://org.jj.woniu.com' + msg.i : "http://org.jj.woniu.com/IM/avatars/snail_woman.png",
                    name: msg.n ? that.utf8ToSting(msg.n) : '',
                    status: msg['4'] ? msg['4'] : '1', //成员状态  0-待加入 1-在线 2-断线  3-离开
                    // stream: false,
                    master: that.say.webRTC.msg.master,//会议创建者
                    manager: that.say.webRTC.msg.manager.length > 0 ? that.say.webRTC.msg.manager.join(',') : '',//会议管理员
                    mode: '',// 房间模式 视频 + 音频
                    audioPause: msg.medias && msg.medias.indexOf("a") < 0 ? true : false,
                    videoPause: msg.medias && msg.medias.indexOf("v") < 0 ? true : false,
                    mode: that.say.webRTC.msg.mode, //  video 摄像头  seceen-屏幕共享
                    medias: msg.medias ? msg.medias : '', //流属性 a-仅包含音频 v-仅包含视频 av-包含音视频
                    Zoom: 0,//放大倍数
                })
            };
            // 设置显示的 ui 列表数据
            that.OnsetStreamList()
            resolve();
        }).catch(Error => {
            console.group(Error);
            resolve(Error);
        });

    };
    // 数组对象排序 有流的排在前面
    OnsortKey(a, b) {
        //排序规则： 在线status：1(有画面 流包含v)、在线status：1(无画面 没有流或者流不包含v)、断线（status：2）、待加入 （status：0）
        // status  状态 ： 0, //待加入   1, //在线  2, //断线   3, //离开
        // 返回小于 0（如 return -1） ，那么 a 会被排列到 b 之前； 等于 0 （如 return 0） ， a 和 b 的相对位置不变；  大于 0（如 return 1） ， b 会被排列到 a 之前。
        // a（ 后一条数据 ） b（前一条数据） 都是在线时
        if (a.status == '1' && b.status == '1') {
            // a 数据里参数medias 有包含视频流（indexOf('v')>=1） b数据里参数medias 没有不包含视频流（indexOf('v')<0） 时 a>b 返回一个小于0的结果  a则和b互相换位置 a排在b数据的前面
            if (a.medias.indexOf('v') > b.medias.indexOf('v')) {
                return -1;
                // a 数据里参数medias 没有不包含视频流（indexOf('v')<0） b数据里参数medias 有包含视频流（indexOf('v')>=1） 时 a<b 返回一个大于0的结果  a则和b不换位置 b数据不动还是排在a数据的前面  （b本身就是在a数据的前面）
            } else if (a.medias.indexOf('v') < b.medias.indexOf('v')) {
                return 1;
            }
            // a，b都是在线状态 参数medias  都是有包含视频    位置不动返回 return 0；
            return 0;
        } else {
            // 只有 a 数据是在线状态  并且有包含视频流（indexOf('v')>=1） 直接返回一个小于0的结果  return -1; ； a则和b互相换位置 a排在b数据的前面
            if (Number(a.status) == 1 && a.medias.indexOf('v') >= 0) {
                return -1;
                // 只有 b 数据是在线状态  并且有包含视频流（indexOf('v')>=1） 直接返回一个大于0的结果  return 1; ； b 会被排列到 a 之前
            } else if (Number(b.status) == 1 && b.medias.indexOf('v') >= 0) {
                return 1;
                //   a 数据是在线状态  并且 b数据不是在线状态 直接返回一个小于0的结果  return -1; ； a则和b互相换位置 a排在b数据的前面
            } else if (Number(a.status) == 1 && Number(b.status) != 1) {
                return -1;
                //   b 数据是在线状态  并且 a 数据不是在线状态 直接返回一个大于0的结果  return 1; ；  b 会被排列到 a 之前
            } else if (Number(a.status) != 1 && Number(b.status) == 1) {
                return 1;
                //  a 数据不是在线状态    b数据也不是在线状态  a数据status是断线（2）并且  b数据status是待加入状态（0）  直接返回一个小于0的结果  return -1; ； a则和b互相换位置 a排在b数据的前面
            } else if (Number(a.status) == 2 && Number(b.status) == 0) {
                return -1;
                //  a 数据不是在线状态    b数据也不是在线状态  a数据status是待加入状态（0） 并且 b数据status是断线（2）  直接返回一个大于0的结果  return 1; ； b 会被排列到 a 之前
            } else if (Number(a.status) == 0 && Number(b.status) == 2) {
                return 1;
                // a 数据status在线状态（是0, //待加入或者 是2, //断线 ）   并且  b数据status在线状态（是 3, //离开）    直接返回一个小于0的结果  return -1; ； a则和b互相换位置 a排在b数据的前面
            } else if ((Number(a.status) == 0 || Number(a.status) == 2) && Number(b.status) == 3) {
                return -1;
                //  b 数据status在线状态（是0, //待加入或者 是2, //断线 ）   并且  a数据status在线状态（是 3, //离开））  直接返回一个大于0的结果  return 1; ； b 会被排列到 a 之前
            } else if ((Number(b.status) == 0 || Number(b.status) == 2) && Number(a.status) == 3) {
                return 1;
            }
            // a，b都不是在线状态  并且在线状态 status 相同 时 位置不动返回 return 0；
            return 0;
        };
    };
    // 设置添加的其他成员 用户属性
    OnsetAddParticipant(id, data) {
        console.log('添加其他成员==>', id, data);
        let that = this;
        data.map(item => {
            // 获取 obj内 的 键名
            let sKey = Object.keys(item);
            // 获取 obj内 key 键名的 键值 obj[Object.keys(obj)]
            let sValue = item[sKey];
            //添加其他成员 设置成员的属性
            that.WebRtcSDK.MakeRtcClient().addParticipant(id, sKey[0], sValue);
        })
        // addParticipant添加完成之后 或者 setParticipantAttr修改添加的用户属性之后 都需调用commitParticipants() 接口
        that.WebRtcSDK.MakeRtcClient().commitParticipants();
    };
    // 设置用户属性
    OnSetUserAttr(obj) {
        let that = this;
        // 设置个人属性
        // let obj = [{ 'n': this.UserObj.name + '张三' }, { 'i': this.UserObj.img}, { 'medias': 'av' }];
        obj.map(item => {
            console.log(item);
            // 获取 obj内 的 键名
            let key = Object.keys(item);
            // 获取 obj内 key 键名的 键值 obj[Object.keys(obj)]
            let val = item[key];
            if (key[0] == 'medias') {
                that.say.webRTC.msg.medias = val;
            }
            console.log('预设-用户属性===>' + that.say.webRTC.msg.userId, key[0], val);
            //本地设置自己的 用户属性 或者 房间属性  修改用户列表中自己的数据
            that.OnsetLocalList(that.say.webRTC.msg.userId, item);
            // useVal=自己id    key[0]（medias） 键名  val键值（av）
            that.WebRtcSDK.MakeRtcClient().setUserAttr(that.say.webRTC.msg.userId, key[0], val);
            //  setUserAttr(sClientId:string, sKey:string, sValue:string):number;
        });
    };
    //  设置房间属性
    OnSetRoomAttr(obj) {
        let that = this;
        // 设置房间属性[{ 'mode': 'screen' }, { 'mode': 'video' }, { 'mode': 'audio' },]
        // "manager";//会议管理员    "master";//会议创建者  "banVideo";//禁用视频功能   "banAudio";//禁用音频功能
        // let obj = [{ 'mode': objv }];
        obj.map(item => {
            //本地设置自己的 用户属性 或者 房间属性  修改用户列表中自己的数据
            that.OnsetLocalList(that.say.webRTC.msg.userId, item);
            console.log('预设- 房间属性 ===>' + item);
            // 获取 obj内 的 键名
            let key = Object.keys(item);
            // 获取 obj内 key 键名的 键值 obj[Object.keys(obj)]
            let val = item[key];
            // useVal=自己id  item=设置的属性   2 = 设置房间属性 状态值 
            // 发送信令 房间属性 设置消息
            that.WebRtcSDK.MakeRtcClient().setRoomAttr(key[0], val);
        });
    };
    //本地设置自己的 用户属性 或者 房间属性  修改用户列表中自己的数据
    OnsetLocalList(id, msg) {
        let that = this;
        that.timeout(() => {
            for (let i in that.say.webRTC.userList) {
                if (that.say.webRTC.userList[i].id == id) {
                    that.say.webRTC.userList[i].img =  msg.i && msg.i.indexOf('IM')>=0 ? 'http://org.jj.woniu.com' + msg.i : that.say.webRTC.userList[i].img;
                    that.say.webRTC.userList[i].name = msg.n ? msg.n : that.say.webRTC.userList[i].name;
                    // 房间属性
                    that.say.webRTC.userList[i].mode = msg.mode ? msg.mode : that.say.webRTC.userList[i].mode;
                    // 用户属性
                    that.say.webRTC.userList[i].medias = typeof (msg.medias) != 'undefined' ? msg.medias : that.say.webRTC.userList[i].medias;
                    //  音频控制器  是否暂停 音频 
                    that.say.webRTC.userList[i].audioPause = typeof (msg.audioPause) != 'undefined' ? msg.audioPause : that.say.webRTC.userList[i].audioPause;
                    // 视频控制器  是否暂停含视频
                    that.say.webRTC.userList[i].videoPause = typeof (msg.videoPause) != 'undefined' ? msg.videoPause : that.say.webRTC.userList[i].videoPause;
                }
            }
            // 设置显示的 ui 列表数据
            that.OnsetStreamList();
        }, 0, true)

    };
    // 设置显示的 ui 列表数据
    OnsetStreamList() {
        let that = this;
        // 数组对象排序 在线(有画面) > 在线(无画面) > 断线 > 待加入    sort() 方法用于对数组或者对象的元素进行排序。 第一个参数必须是函数
        that.say.webRTC.userList.sort(that.OnsortKey);
        that.timeout(() => {
            // 在线成员人数 统计
            that.say.webRTC.listStatus = 0;
            for (let i in that.say.webRTC.userList) {
                // 在线的成员 计数器 +1
                if (that.say.webRTC.userList[i].status == 1) {
                    that.say.webRTC.listStatus += 1;
                }
            }
            // 获取 DOM 元素 等于自己的 给video标签赋值
            let node = document.getElementById(that.say.webRTC.msg.userId);
            if (node && node.srcObject == null) {
                // 禁止标签输出自己的音频 否则有回音
                node.muted = true;
                node.srcObject = that.say.webRTC.localStream;
                console.log(node.srcObject)
            };
            //     if (that.say.webRTC.ModeSwitch) {
            //         // 4个平分 翻页
            //         that.say.webRTC.StreamList = that.dataHandling([], 4, that.say.webRTC.userList);
            //     } else {
            //         // 1大5小 翻页
            //         that.say.webRTC.StreamList = that.dataHandling([], 6, that.say.webRTC.userList);
            //     }
            console.log(that.say.webRTC.userList)
        }, 100, true);
    };
    // 返回的房间属性 设置是否 暂停视频 或者 音频
    setPauseAV(that, msg, type, obj) {
        var key = Object.keys(obj);
        var setkn = key[0];//用户列表中 暂停视频或者音频的 键名
        var val = '';// 用户属性的-流 值
        var setlist = {};//设置本地用户列表中 暂停视频或者音频的 对象
        var medias = '';
        var is = null; //之前音频或者视频 值是true 禁止状态的 并且 房间属性返回的 暂停视频或者音频列表中没有自己id的时候 重新启动音频或者视频
        for (let i in that.say.webRTC.userList) {
            if (that.say.webRTC.userList[i].id == that.say.webRTC.msg.userId) {
                // 取出用户列表内自己的 用户属性- 流属性
                medias = that.say.webRTC.userList[i].medias;
                // 取出用户列表内自己的 音频或者视频属性是否在暂停 true 暂停状态 false未暂停状态
                is = that.say.webRTC.userList[i][key[0]];
                break;
            }
        }
        // msg 暂停列表中没有自己的id是打开被暂停的   type ：1 关闭音频  2 关闭视频 3//是关闭音频+视频  + 屏幕共享
        if (msg == '' || msg.indexOf(that.say.webRTC.msg.userId) < 0) {
            // 打开音频或者视频
            if (is) {
                // false 不暂停  true 暂停 音频或者视频
                that.WebRtcSDK.MakeRtcClient().pauseSend(false, type, that.say.webRTC.msg.userId);
                var newmedias = '';
                if (type == 1) {
                    val = 'a';
                    if (medias.indexOf(val) < 0) {
                        newmedias = val + medias;
                    } else {
                        newmedias = medias;
                    }
                } else if (type == 2) {
                    val = 'v';
                    if (medias.indexOf(val) < 0) {
                        newmedias = medias + val;
                    } else {
                        newmedias = medias;
                    }
                }
                //重新设置发布用户属性 + 修改列表数据中 自己的medias属性
                let obj = [{ 'medias': newmedias }];
                that.OnSetUserAttr(obj);

                setlist[setkn] = false;
                // 修改 列表数据 里自己的 暂停麦克风audioPause 或者 暂停视频videoPause 值
                this.OnsetLocalList(that.say.webRTC.msg.userId, setlist);
            }

        } else {
            // msg中包含自己的id是 暂停的
            // 关闭音频
            that.WebRtcSDK.MakeRtcClient().pauseSend(true, type, that.say.webRTC.msg.userId);
            var newmedias = '';
            if (type == 1) {
                val = 'a';
            } else if (type == 2) {
                val = 'v';
            }
            if (medias.indexOf(val) >= 0) {
                newmedias = medias.replace(val, "");
            } else {
                newmedias = medias;
            }
            console.log(newmedias)
            //重新设置发布用户属性 + 修改列表数据中 自己的medias属性
            // let obj = [{ 'medias': 'v' }];
            let obj = [{ 'medias': newmedias }];
            that.OnSetUserAttr(obj);
            setlist[setkn] = true;
            // 修改 列表数据 里自己的 暂停麦克风audioPause 或者 暂停视频videoPause 值
            this.OnsetLocalList(that.say.webRTC.msg.userId, setlist);
        }

    };
    // 获取本地摄像头资源
    OnLocalCamera() {
        let that = this;
        console.log(that.constraints);
        return new Promise((resolve) => {
            navigator.mediaDevices.getUserMedia(that.constraints).then(stream => {
                // 本地流
                that.say.webRTC.localStream = stream;
                // 本地音频轨 
                that.say.webRTC.localAudioTracks = stream.getAudioTracks()[0];
                console.log(stream)
                that.say.webRTC.cutover = false; //资源切换控制器

                // 设置自己的用户属性 发送信令
                let obj = [{ 'medias': that.say.webRTC.msg.medias }];
                that.OnSetUserAttr(obj);
                console.log(obj)

                // 发送信令 本地资源 传入 接口  资源是屏幕共享或者本地視頻的时参数screenflag是 true    音视频是 false
                that.WebRtcSDK.MakeRtcClient().setLocalStream(that.say.webRTC.localStream, false);
                // 当前房间不等于屏幕共享 ||  屏幕共享id 等于自己id 可设置房间属性
                if (that.say.webRTC.msg.mode != 'screen' || that.say.webRTC.modeId == that.say.webRTC.msg.userId) {
                    for (let i in that.say.webRTC.userList) {
                        // 修改房间属性
                        if (that.say.webRTC.userList[i].id == that.say.webRTC.msg.userId) {
                            that.say.webRTC.userList[i].mode = 'video';
                            that.say.webRTC.userList[i].Zoom = 0;
                        }
                    }
                    that.say.webRTC.modeId = '';
                    that.say.webRTC.Headershow = true;
                    // 修改房间属性
                    that.say.webRTC.msg.mode = 'video';
                    that.OnSetRoomAttr([{ 'mode': 'video' }]);
                }
                that.timeout(() => {
                    // 获取 DOM 元素 等于自己的 给video标签赋值
                    let node = document.getElementById(that.say.webRTC.msg.userId);
                    if (node) {
                        // 禁止标签输出自己的音频 否则有回音
                        node.muted = true;
                        node.srcObject = stream;
                        console.log(node.srcObject)
                    }
                })
                resolve();
            }).catch(Error => {
                // 获取不到本地摄像头 麦克风资源 退出房间
                alert(Error);
                that.logout();
                console.group(Error);
                resolve(Error);
            });
        });
    };
    //   获取 屏幕共享资源
    Onscreenshare() {
        let that = this;
        return new Promise((resolve) => {
            // 原生 屏幕共享    音频输出的电脑自身的声音 无法输出外部的声音 需特殊处理
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then(function (MediaStream) {
                // 取消发布的资源 异步等待结果处理
                // await that.OnUnpublish();
                if (MediaStream.getAudioTracks()[0]) {
                    // 删除屏幕共享 音频轨（必须先删除已有的音频，才能添加音频。否则无效）
                    MediaStream.removeTrack(MediaStream.getAudioTracks()[0]);
                }
                // resolve();
                // // 获取本地的 视频数据和音频数据
                // navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                //     // 本地音频轨添加 屏幕共享里面
                MediaStream.addTrack(that.say.webRTC.localAudioTracks);
                // 本地流
                that.say.webRTC.localStream = MediaStream;
                // 获取 DOM 元素 等于自己的 给video标签赋值
                that.say.webRTC.cutover = true; //资源切换控制器

                // 点击浏览器默认 停止屏幕共享按钮
                MediaStream.getVideoTracks()[0].onended = (e) => {
                    // 切换至本地摄像头 + 关闭浏览器默认弹出屏幕共享窗口 
                    that.say.OnVideoSwitch();
                }
                // 发送信令 本地资源 传入 接口  资源是屏幕共享或者本地視頻的时参数screenflag是 true   純音頻是 false
                that.WebRtcSDK.MakeRtcClient().setLocalStream(that.say.webRTC.localStream, true);
                // 修改房间属性
                that.say.webRTC.msg.mode = 'screen';
                for (let i in that.say.webRTC.userList) {
                    // 修改房间属性
                    if (that.say.webRTC.userList[i].id == that.say.webRTC.msg.userId) {
                        that.say.webRTC.userList[i].mode = 'screen';
                        that.say.webRTC.userList[i].Zoom = 2;
                    }
                    that.say.webRTC.modeId = that.say.webRTC.msg.userId;
                }
                if (that.say.webRTC.MemberListshow) {
                    that.say.webRTC.MemberListshow = false;
                }
                that.say.webRTC.Headershow = false;
                that.OnSetRoomAttr([{ 'mode': 'screen' }]);
                // 设置自己的用户属性 发送信令
                let obj = [{ 'medias': 'av' }];
                that.OnSetUserAttr(obj);
                that.timeout(() => {
                    console.log('MediaStream===>', MediaStream)
                    // 获取 DOM 元素 等于自己的 给video标签赋值
                    let node = document.getElementById(that.say.webRTC.msg.userId);
                    // 禁止标签输出自己的音频 否则有回音
                    node.muted = true;
                    node.srcObject = MediaStream;
                    console.log(node.srcObject);
                }, 100)
                resolve();
                // }).catch(Error => {
                //     resolve(Error);
                //     console.log(Error);
                // });
            }).catch(Error => {
                // 获取 DOM 元素 等于自己的 给video标签赋值
                that.say.webRTC.cutover = true; //资源切换控制器
                // 切换至本地摄像头 + 关闭浏览器默认弹出屏幕共享窗口 
                that.say.OnVideoSwitch();
                console.log(Error);
                resolve(Error);
            });
        });
    };
    // 翻页  切换uI显示 重新渲染 video
    OnCutoverAgainRendering() {
        let that = this;
        let neworderList = [];
        // 不是屏幕共享  
        if (that.say.webRTC.ModeSwitch) {
            // if (that.say.webRTC.ModeSwitch && that.say.webRTC.msg.mode != 'screen') {
            // 头部显示
            that.say.webRTC.Headershow = true;
            let is = false;
            that.say.webRTC.orderList.map((item, i) => {
                for (let i in that.say.webRTC.userList) {
                    if (that.say.webRTC.userList[i].id == item && that.say.webRTC.userList[i].mode == 'screen') {
                        is = true;
                        // 大流
                        neworderList.push(item + that.stream_type.v);
                        neworderList.push(item + that.stream_type.a);
                        break;
                    }
                }
                if (!is) {
                    // 小屏也改为大流
                    neworderList.push(item + that.stream_type.v);
                    // 小流 只传 id 不需要拼接 item + '_video_1'
                    // neworderList.push(item + '_video_1');
                    neworderList.push(item + that.stream_type.a);
                }
            })
            // 转字符串  多个资源id分号;切割
            let id = that.utf8ToSting(neworderList.join(';'));
            // 订阅该成员流
            that.WebRtcSDK.MakeRtcClient().orderStream(id);
            // 列表渲染完 执行订阅 渲染流
            that.timeout(() => {
                that.say.webRTC.orderList.map((item, i) => {
                    // 获取创建好的 demo元素  去掉id拼接的 小流字段
                    let video = document.getElementById(item);
                    // 标签存在
                    if (video) {
                        // 渲染 其他成员    流资源
                        that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
                    }
                })
                // 渲染自己的流
                that.say.webRTC.userList.map(item => {
                    if (item.id == that.say.webRTC.msg.userId && item.medias != '') {
                        let node = document.getElementById(item.id);
                        // 禁止标签输出自己的音频 否则有回音
                        node.muted = true;
                        node.srcObject = that.say.webRTC.localStream;
                    }
                })
                console.log('渲染' + id + '资源');
            })
        }
        // this.say.webRTC.StreamList[this.say.webRTC.page].map(item => {
        //     console.log(item);
        //     if (item.status == "1" && item.medias != "") {
        //         if (item.id == that.say.webRTC.msg.userId) {
        //             let node = document.getElementById(that.say.webRTC.msg.userId);
        //             node.srcObject = that.say.webRTC.localStream;
        //         } else {
        //             if (item.orderSwitch) {
        //                 // 其他成员 标签
        //                 let video = document.getElementById(item.id);
        //                 // 渲染 其他成员    流资源
        //                 that.WebRtcSDK.MakeRtcClient().setRemoteVideo(video.id, video);
        //             } else {

        //             }
        //         }
        //     }
        // })
    };
    // 切割 列表数据 翻页调用
    dataHandling(newArr, numb, arr) {
        newArr = [];
        let arrLength = arr.length; // 数组长度
        let num = numb;  // 每页显示 10 条
        let index = 0;
        for (let i = 0; i < arrLength; i++) {
            if (i % num === 0 && i !== 0) { // 可以被 10 整除
                newArr.push(arr.slice(index, i));
                index = i;
            };
            if ((i + 1) === arrLength) {
                newArr.push(arr.slice(index, (i + 1)));
            }
        };
        console.log(newArr)
        return newArr;
    };
    // UTF8解码 转成汉字字符串 
    utf8ToSting(str) {
        var rs = '';
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            // console.log(code);
            if ((240 & code) == 240) {
                var code1 = str.charCodeAt(i + 1),
                    code2 = str.charCodeAt(i + 2),
                    code3 = str.charCodeAt(i + 3);
                rs += String.fromCodePoint(((code & 7) << 18) | ((code1 & 63) << 12) | ((code2 & 63) << 6) | (code3 & 63));
                i += 3;
            } else if ((224 & code) == 224) {
                var code1 = str.charCodeAt(i + 1),
                    code2 = str.charCodeAt(i + 2);
                rs += String.fromCodePoint(((code & 15) << 12) | ((code1 & 63) << 6) | (code2 & 63));
                i += 2;
            } else if ((192 & code) == 192) {
                var code1 = str.charCodeAt(i + 1);
                rs += String.fromCodePoint(((code & 31) << 6) | (code1 & 63));
                i++;
            } else if ((128 & code) == 0) {
                rs += String.fromCharCode(code);
            }
        }
        return rs;
    };
    //  汉字字符串转成 UTF8编码
    StingToUtf8(str) {
        var rs = '';
        for (var i of str) {
            var code = i.codePointAt(0);
            if (code < 128) {
                rs += i;
            } else if (code > 127 && code < 2048) {
                rs += String.fromCharCode((code >> 6) | 192, (code & 63) | 128);
            } else if (code > 2047 && code < 65536) {
                rs += String.fromCharCode((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
            } else if (code > 65536 && code < 1114112) {
                rs += String.fromCharCode((code >> 18) | 240, ((code >> 12) & 63) | 128, ((code >> 6) & 63) | 128, (code & 63) | 128);
            }
        }
        console.log(rs);
        return rs;
    };
}