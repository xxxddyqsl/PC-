var services = angular.module('Services');
// var showNotice = false;
// window.onblur = function(){
// showNotice = true;
// }

// services.value('server','http://webim.mysnail.com/http-bind/');
services.factory('domain', [function () {
    var name = 'eim.snail.com';
    var recourse = 'Web';
    return {
        // name : '@' + name,
        // room : '@conference.' + name,
        // web : '@' + name + '/' + recourse,
        name: '',
        room: '',
        web: '',
        source: recourse,
        recouse: recourse,
        recourse: recourse,
        resource: recourse,
        upload: '/IMFileServer/file/user/upload'
    }
}])

// 发送 会议邀请 数据容器  视频会议控制器 从这里取值
services.factory('rtcRoomObj', function () {
    var service={};
    var data;//定义一个私有化的变量
    //对私有属性写getter和setter方法
    service.setData = function(msg){
        data = msg;
    }
    service.getData = function(){
        return data;
    }
    return service;//返回这个Object对象
});
// 自己发起视频会议邀请 但是对方正在通话或者拒绝时 视频会议窗口还没有打开 需要销毁的视频会议房间 存入当前接收到的消息 + 本地存储 通知视频会议窗口需要关闭 视频会议窗口初始化时获取本地存储当前窗口是否需要关闭
services.factory('closeVideoMessage', function () {
    var service={};
    var data;//定义一个私有化的变量
    //对私有属性写getter和setter方法
    service.setData = function(msg){
        data = msg;
    }
    service.getData = function(){
        return data;
    }
    return service;//返回这个Object对象
});
// 多人视频会议 个人信息数据查询  
services.factory('getChatIdInfo', function() {
    var chatObj={};
    return function(obj,url){
        let newobj=JSON.parse(obj);
        return new Promise(function (resolve) {
            callCefMethod(url,newobj, function (res) {
                try{
                    if(res.Flag!=0 ){
                        // 根据获取的值，抛出错误
                        throw res;
                    }else{
                        chatObj=res.Data;
                        console.log('chatObj===>',chatObj);
                        resolve(chatObj);
                    }
                }catch(err){
                    // 接口返回异常 
                   return console.log(err);
                    // resolve(err);
                }
            })
        })
    }
})
// 多人视频会议 个人信息数据容器
services.factory('getChatIdObj', function() {
    var service={};
    var data;//定义一个私有化的变量
        //对私有属性写getter和setter方法
        service.setData = function(msg){
            data = msg;
        }
        service.getData = function(){
            return data;
        }
        return service;//返回这个Object对象
})
services.factory('langPack', ['util', function (util) {
    var lang = util.cookie.get('lang') || 'cn';
    // window.onfocus = document.onmousemove = function(){
    // clearInterval(changeTitleTimer);
    // document.title = obj.getKey('appNameWeb');
    // showNotice = false;
    // }
    var LANGMAP = {
        cn: {
            langName: '中文',
            unsupport: '不支持此浏览器',
            unsupportAd: '建议使用Chrome或者FirefoX浏览器',
            appName: '静静办公',
            newMessage: '有新的消息',

            countryArea: '国家/地区',
            phone: '手机号码',
            phone2: '手机号码',
            password: '密码',
            captcha: '验证码',
            loginButton: '登录',
            InvitationCode: '邀请码',
            forget: '忘记密码?',
            forgetTitle: '忘记密码',
            forgetInfo: '修改登录密码请联系以下人员：',
            tel: '电话：',
            wechat: '微信：',
            QQ: 'QQ：',
            forgetLine1: '使用静静办公APP，找回密码（注册/登录界面，点击忘记密码按钮）',
            forgetLine2: '也可扫描下方二维码下载静静办公APP',

            search: '搜索',
            message: '消息',
            concat: '联系人',
            organize: '组织架构',
            department: '部门',
            loadmore: '加载更多',

            startChat: '发起群聊',
            fcontacts: '常用联系人',
            rcontacts: '最近联系人',
            friends: '我的好友',
            maxNum: '注意：本次选择人数已达上限',
            forwardTitle: '转发消息',
            addStaff: '添加成员',
            videoConference: '发起视频会议',
            noResult: '没有搜索到相关人员',
            noFrequentContacts: '没有常用联系人',
            noGroupChat: '没有群聊',
            noRecentContacts: '没有最近联系人',
            noFirends: '没有好友',
            expand: '展开',
            collapse: '收起',
            mineGroup: '我的群聊',

            turnOffNotif: '关闭桌面通知',
            turnOnNotif: '开启桌面通知',
            turnOffSounds: '关闭声音提示',
            turnOnSounds: '开启声音提示',
            downloadApp: '下载应用',
            updatePersonnel: '更新组织架构',
            exit: '退出应用',

            setTop: '置顶聊天',
            cancelTop: '取消置顶',
            deleteChat: '移除',
            removeChat: '移除并删除消息',
            removeChatConfirm: '确定要移除该聊天并删除该聊天的所有聊天记录？',
            forward: '转发',
            copy: '复制',

            groupName: '群聊名称',
            saveToContacts: '保存到通讯录',
            stickOnTop: '消息置顶',
            groupInfo: '群聊详情',
            groupOwner: '群主',
            leaveGroup: '离开了群聊',

            profile: '详情',
            firendProfile: '好友详情',
            manager: '直接主管',
            profileDepartment: '所在部门',
            sendMessage: '发消息',
            sendEmail: '发邮件',
            sendGroupEmail: '群发邮件',

            loginFail: '登录失败，请确定手机号密码正确',
            failCreateRoom: '群聊创建失败',
            audioFailed: '语音播放失败',
            videoFailed: '视频播放失败',
            maxUpload: '文件上传最多支持',
            mb: 'MB',
            zeroFile: '文件大小为0，无法上传',
            maxMembers: '无法创建超过80人的群组聊天',
            selectStaff: '请选择要转发的人员',
            confirmForward: '确定要转发给这些人？',
            errorGroupName: '群聊名称在0-16个字符',
            errorEmjgroupName: '群聊名称不支持表情',
            leaveError: '创建者无法退出群聊',
            uploading: '图片上传中，请稍后',
            imageError: '无法加载图片',
            unknownPhone: '该手机号未注册',
            unknownLoginError: '登录异常，请联系管理员',
            incorrectPhone: '请输入正确的手机号码',
            sendMsgTips: '按下Ctrl+Enter换行',
            closeBrowser: '关闭浏览器聊天内容将会丢失。',
            webuploaderError: 'webuploader出错，请重试。',
            loginInOther: '相同账号在其他地方登录,您已退出!',

            xxpb: '',
            xxpe: '人',

            downloadViewTitle: '下载静静办公',
            scanQr: '手机扫一扫下载静静办公',
            downloadTips: '(iPhone,安卓客户端下载)',

            uploadingViewTitle: '发送图片',

            am: '上午',
            pm: '下午',
            draft: '[草稿]',
            someoneAt: '[有人＠我]',
            atedby: '提到了你',
            changeGroupName: '修改群名为',
            removedMember: '被移出群聊',
            removedMemberAdminStart: '您将',
            removedMemberAdminEnd: '移出群聊',
            leftGroup: '离开群聊',
            addGroup: '加入群聊',
            invitedIntoGroup: '邀请了',
            invitedIntoGroupEnd: '加入群聊',
            you: '您',
            download: '下载',

            file: '[文件]',
            img: '[图片]',
            video: '[视频]',
            audio: '[语音]',
            link: '[链接]',

            languageSettingTitle: '语言设置',
            languageSettingTip: '点击图片设置语言',
            languageSettingTitle1: 'language setting',

            joinEnt: '加入了',
            inviteEnt: '邀请你加入公司',
            voiceConference: '语音会议',
            invitedIntoMetting: ' 邀请你参加语音会议，请在手机上加入。',
            invitedIntoMettingInSender: '发起了语音会议，请在手机上查看。',
            invitedVideoconferencing: ' 邀请你参加视频会议。',
            invitedVideoconferencingInSender: ' 发起了视频会议。',
            seeInMobile: '请在手机上查看。',

            loading: '加载中 ...',
            serviceNumber: '服务号',
            noChat: '还没有任何聊天记录',
            start: '发起聊天',
            send: '发送',
            cancel: '取消',
            back: '返回',
            group: '群组',
            rgroup: '常用群组',
            confirm: '确定',

            userName: '姓名',
            userPost: '职位',
            userEntEmail: '公司邮箱',
            userEmpNo: '工号',
            userAddress: '地址',
            userDept: '组织架构',
            userLeader: '直接主管',
            weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            yesterday: '昨天',
            thedaybeforeyesterday: '前天',
            stranger: '陌生人',
            broad: '广播消息',
            addToFriends: '加为好友',
            addToFrequents: '加入常用联系人',
            removeFriends: '删除好友',
            removeFrequents: '删除联系人',
            msgdisturb: '消息免打扰',
            noSign: '这家伙很懒，什么都没有留下...',
            shutUpAction: '被{name}禁言',
            shutUpWarn: '被{name}禁言，请稍后重试',
            minutes: '分钟',
            forever: '永久',
            shutUpForever: '已被群主永久禁言',
            cancelShutUp: '的禁言已被取消',
            banned: '禁言',
            loginFail: '手机号或密码不正确',
            requestError: '请求出错，请稍后重试',
            connectServer: '连接服务器...',
            connectSuccess: '服务器连接成功',
            connectFail: '服务器连接失败',
            afterSSOSuccess: '验证成功，连接聊天服务器',
            loginSuccess: '聊天服务器连接成功，等待界面初始化',
            sessionExpired: '身份过期请重新登录',
            chatServerTimeout: '聊天服务器连接超时，请稍后重试',
            downApp: '下载静静办公',
            companyLogin: '企业登录',
            appNameWeb: '静静办公网页版',
            china: '中国',
            taiwan: '台湾',
            usa: '美国',
            korea: '韩国',
            russia: '俄罗斯',
            japan: '日本',
            deptLoading: '组织架构加载中...',
            withDrawMsg: '撤回了一条消息',
            withDraw: '撤回',
            canNotWithDraw: '超过2分钟无法撤回',
            privacyAttention: '与您不是好友或同事，请您注意保护隐私',
            loadMoreMsg: '更多消息请在聊天记录中查看',
            openRecords: '打开消息记录',
            seeDetail: '查看详情',

            cancelUpload: '取消上传',
            reupload: '重新上传',
            open: '打开',
            openDir: '打开文件夹',
            fileCacheDay: '文件暂存7天',
            receiverDonwloaded: '对方已接收',
            fileSendFail: '文件发送失败',

            cancelDownload: '取消下载',
            reDownload: '重新下载',
            cancelTrans: '传输已取消',
            downloaded: '接收成功',
            downloadFail: '下载失败',
            transFail: '传输失败',
            saveAs: '另存为',
            fileOutOfDay: '文件已过期',
            allFiles: '所有文件|*.*',
            imageFiles: '图片文件|*.png;*.jpg;*.gif',

            setting: '设置',
            about: '关于',
            switchAccount: '切换账号',
            quit: '退出',

            serviceAccount: '服务号',
            fdepts: '常用部门',
            fgroups: '常用群聊',
            entCharger: '企业负责人',
            entEmpCount: '企业总人数',

            deptLeader: '部门主管',
            deptDirector: '分管领导',
            deptEmpCount: '部门人数',
            noEmp: '暂无',

            'ent.userName': '姓名',
            'ent.job': '职位',
            'ent.email': '企业邮箱',
            'ent.empNo': '工号',
            'ent.depts': '组织架构',
            'ent.leader': '直接主管',
            'user.userName': '姓名',
            'user.mobile': '电话',
            'user.email': '邮箱',
            'user.noSignature': '这家伙很懒,什么都没有留下...',

            favoriteDept: '添加常用部门',
            favoriteEmp: '添加常用联系人',
            sendInstantMessage: '发送即时消息',
            refreshEnts: '刷新组织架构',

            setUserToFavorite: '添加常用联系人',
            setGroupToFavorite: '添加常用群聊',
            cancelUserToFavorite: '移除常用联系人',
            cancelGroupToFavorite: '移除常用群聊',
            cancelDeptToFavorite: '移除常用部门',

            goback: '<返回',
            broadDetailTitle: '广播详情',

            quitGroup: '退出群聊',
            chooseUser: '选择群聊成员',
            vidioMeeting: '视频会议',
            selectedUsers: '已选择成员：',
            selectedUsersUnit: '人',

            clickToEditEmail: '点击编辑邮箱',

            account: '账号',
            serviceLogin: '服务号登录',
            autoLogin: '自动登录',
            resetPwd: '重置密码',
            pwdLogin: '密码登录',
            register: '注册',
            smsCode: '验证码',
            wrongSmsCode: '验证码错误',
            blankSmsCode: '请输入验证码',
            diffPassword: '两次输入的密码不一致',
            alreadyInUse: '手机号已经被使用',
            writeInvitationCode: '请填写邀请码',
            finish: '完成',
            next: '下一步',
            skip: '跳过',
            getCode: '获取验证码',
            countDown: '{d}秒后重新获取',
            newPwd: '新密码',
            confirmNewPwd: '再次输入新密码',
            confirmPwd: '确认密码',
            repeatPwd: '再次输入密码',

            safeTipTitle: '安全提示',
            safeTipContentLine1: '公共环境请勿开启自动登录功能，',
            safeTipContentLine2: '以免数据泄露',
            donNotOpen: '不开启',
            confirmOpen: '确认开启',

            forgetPwdTitle: '忘记密码',
            forgetPwdContentLine1: '请通知总管理员，登录管理后台重置',
            forgetPwdContentLine2: '密码http://mgr.jj.snail.com',
            getThat: '我知道了',

            loadEntError: '组织架构加载错误',
            clickToRetry: '点此重新加载',

            'setting.login': '登录',
            'setting.hotkey': '热键',
            'setting.sound': '声音',
            'setting.backup': '聊天备份',
            autoStart: '开机自动启动',
            getMsg: '提取消息',
            showMainIframe: '显示主面板',
            capture: '捕捉屏幕',
            quickSend: '快速发送',
            recordingVoice: '语音按键说话',
            openChatHistory: '打开聊天记录',
            setToDefault: '恢复默认设置',
            sendMsgHotKey: '会话窗口发送消息',
            hasSameHotKey: '冲突',
            CESend: '按Ctrl+Enter键',
            ESend: 'Enter键',
            closeTone: '关闭消息提示音',
            backupToPC: '备份到电脑',
            backupBtn: '备份',
            recoverToPhone: '恢复到手机',
            recoverBtn: '恢复',
            managerBackup: '管理备份',
            managerBackupBtn: '管理',

            close: '关闭',
            scanQrCode: '扫二维码下载手机版',
            copyRight: '苏州蜗牛数字科技股份有限公司©版权所有',

            backupTips: '请在手机上确认，以开始备份',
            restoreTips: '请在手机上确认，以开始还原',
            managerTips: '小提示：修改备份存储目录将会迁移所有已存储的备份，暂不支持中文路径',
            currentBackUpDir: '备份存储位置目录：',
            modify: '更改',
            backupName: '备份名称',
            firstBackupTime: '首次备份时间',
            lastBackupTime: '上次备份时间',
            operate: '操作',
            deleteBackup: '删除备份',

            backupComplete: '备份已完成',
            restoreComplete: '传输已完成，请在手机上继续恢复',
            notCloseApp: '为了保证良好的网络链接，请不要关闭静静办公',
            transError: '传输出错，请重试',
            backuped: '已备份',
            restoreed: '已还原',

            sendFail: '[发送失败]',

            recording: '正在录音...',
            recordFinish: '录音完成',

            noMicroPhone: '未找到麦克风',
            noBroadcaster: '未找到播放设备',

            recentChat: '最近聊天',

            msgTooLong: '内容过长，请删除部分内容后重试',

            shareLink: '分享了一个链接',

            hasBeenShutup: '已被群主禁言，还剩 ',

            largeFileMsg: '[大文件]',
            largeFile: '大文件传输助手',
            largeFilePC: '大文件传输助手(仅局域网PC间)',
            largeFIleMsgTip: '(仅限同一局域网PC端接收)',
            receiveFileTitle: '来自{name}的接收事项',
            dragFileTips: '拖拽文件（文件夹）到此或者点击添加按钮',
            deleteFile: '删除',

            messageManager: '消息管理器',
            contacts: '联系人',
            addressBook: '通讯录',
            content: '内容',
            searchRange: '查找范围',

            all: '全部',
            recentOneMonth: '最近一个月',
            recentThreeMonth: '最近三个月',
            recentOneYear: '最近一年',

            searchText: '查看文本',
            searchFile: '查看文件',

            remark: '备注',
            notSupportSendFileDir: '对不起，暂时不支持发送文件夹。请使用大文件传送功能发送文件夹。',

            fileMsgHistory: '文件[{name}]，请在聊天窗口查看',

            allResult: '全部结果',

            imgView: '图片查看器',
            sourceSize: '实际尺寸',
            optimumSize: '最佳比例',
            zoomout: '放大',
            zoomin: '缩小',
            prevImg: '上一张',
            nextImg: '下一张',
            rotateAntiWise: '逆时针旋转90度',
            rotateWise: '顺时针旋转90度',
            saveImg: '保存',
            saveSuccess: '保存成功',
            imageLoadFail: '无法加载图片',
            lastImg: '已经是最后一张图片',
            firstImg: '已经是第一张图片',

            loadingMsg: '消息加载中',

            receiveStatus: '查看接收状态',
            receive: '接收',
            reject: '拒绝',
            cancelReceive: '取消接收',
            reReceive: '重新接收',
            stillReceive: '仍然接收',
            hasReject: '已拒绝',
            waitReceive: '等待接收',
            receiveError: '接收中断',
            receiveComplete: '已接收',
            intranetPicTips: '当前为内网环境，该图仅限内网用户查看',
            senderCancel: '发送方取消发送',
            cancelLargeFile: '取消发送',
            receiveCancel: '对方取消接收',
            cancelLargeFileMsgInSender: '您已取消发送大文件',
            cancelLargeFileMsgInReceiver: '已取消发送大文件',
            fileTransfering: '有文件正在传输，确定要退出？',

            unreadMsg: '条未读消息',
            newMsg: '条新消息',

            'btn.face': '插入表情',
            'btn.file': '发送文件',
            'btn.img': '插入图片',
            'btn.voice': '开始录音',
            'btn.capture': '截图',
            'btn.history': '消息记录',

            offlineTip: '静静已离线，请检查网络',

            paste: '粘贴',

            minwin: '最小化',
            restorewin: '向下还原',
            maxwin: '最大化',

            error107: '文件不存在',
            error108: '文件夹不存在',
            error8: '无法开启文件发送端口，请检查网络或防火墙设置',
            loginError100: '用户不存在',
            loginError12: '用户名或密码错误',
            loginError2: '用户名或密码错误',
            loginError10: '网络异常',
            loginError15: '您的账号已登录，无法重复登录。',
            loginError16: '请输入正确的验证码',
            noStaffs: '所选部门没有员工，无法创建群聊',
            saveImgPifx: '静静图片',
            leaveGroupConfirm: '是否确认退出该群？',
            imageWasWithDrawBySender: '图片已被撤回',
            noMessage: '没有聊天记录',
            noSearchMsg: '没有搜索到相关消息',
            outOfToken: '身份已过期，请重新登录。',
            clear: '清屏',
            cut: '剪切',
            deleteContent: '删除',
            fileTooLarge: '文件大小超过80M，请使用大文件传输助手发送',
            tooLargeFile: '存在超过80M的文件无法发送，请使用大文件传输助手发送'
        },
        en: {
            langName: 'English',
            unsupport: 'Browser not supported.',
            unsupportAd: 'Try Chrome or Firefox instead.',
            appName: '静静办公',
            newMessage: 'New Message',

            countryArea: 'Country/Area',
            phone: 'Mobile number',
            phone2: 'Phone',
            password: 'Password',
            InvitationCode: 'InvitationCode',
            captcha: '验证码',
            loginButton: 'Log in',

            forget: 'Forgot password?',
            forgetTitle: 'Forgot password',
            forgetInfo: 'To change your password, contact the following staff:',
            tel: 'Tel:',
            wechat: 'Wechat:',
            QQ: 'QQ:',
            forgetLine1: 'Use Snail IM App,recover your password by clicking Forgot Password;Scan the QR Code and download the app now!',
            forgetLine2: '',

            search: 'Search',
            message: 'Message',
            concat: 'Contacts',
            organize: 'Personnel',
            department: 'Department',
            loadmore: 'More',

            startChat: 'Group chat',
            fcontacts: 'Frequent contacts',
            rcontacts: 'Recent contacts',
            friends: 'Friends',
            maxNum: 'Maximum number of members reached',
            forwardTitle: 'Forward',
            addStaff: 'Add staff',
            videoConference: 'Start a video conference',
            noResult: 'No results found',
            noFrequentContacts: 'No frequent contacts found',
            noGroupChat: 'No group chats found',
            noRecentContacts: 'No recent contacts found',
            noFirends: 'No friends found',
            expand: 'Expand',
            collapse: 'Collapse',
            mineGroup: 'Mine Groups',

            turnOffNotif: 'Turn off notifications',
            turnOnNotif: 'Turn on notifications',
            turnOffSounds: 'Turn off notifications sounds',
            turnOnSounds: 'Turn on notifications sounds',
            downloadApp: 'Download app',
            updatePersonnel: 'Update personnel',
            exit: 'Exit',

            setTop: 'Stick on top',
            cancelTop: 'Remove from top',
            deleteChat: 'Remove',
            removeChat: '移除并删除消息',
            removeChatConfirm: '确定要移除该聊天并删除该聊天的所有聊天记录？',
            forward: 'Forward',
            copy: 'Copy',

            groupName: 'Group name',
            saveToContacts: 'Save to contacts',
            stickOnTop: 'Stick on top',
            groupInfo: 'Chat history',
            groupOwner: 'Owner',
            leaveGroup: 'Leave',

            profile: 'Profile',
            firendProfile: 'Friend Profile',
            manager: 'Manager',
            profileDepartment: 'Department',
            sendMessage: 'Send message',
            sendEmail: 'Send email',
            sendGroupEmail: 'Send group email',

            loginFail: 'Incorrect phone number or password',
            failCreateRoom: 'Failed to create group',
            audioFailed: 'Failed to play the audio',
            videoFailed: 'Failed to play the video',
            maxUpload: 'Upload a file no larger than',
            mb: 'MB',
            zeroFile: 'Incorrect file size. Unable to upload.',
            maxMembers: 'The maximum number of members is 80',
            selectStaff: 'Select a staff',
            confirmForward: 'Are you sure that you want to forward the message?',
            errorGroupName: 'Group name must be no more than 16 characters',
            errorEmjgroupName: 'Group name does not support emoji',
            leaveError: 'Group leader cannot leave the group',
            uploading: 'Uploading pictures…',
            imageError: 'Failed to load pictures',
            unknownPhone: 'This phone number has not been registered yet.',
            unknownLoginError: 'Unknown error. Contact the Admin.',
            incorrectPhone: 'Incorrect phone number',
            sendMsgTips: 'Press Ctrl-Enter to start a new line',
            closeBrowser: 'You\'ll lose your chats after closing the browser.',
            webuploaderError: 'Webuploader error. Try again later.',
            loginInOther: '相同账号在其他地方登录,您已退出!',

            xxpb: '(',
            xxpe: ')',

            downloadViewTitle: 'Downloads IM App',
            scanQr: 'Scan the QR Code and download now!',
            downloadTips: '(Available on iOS and Android)',

            uploadingViewTitle: 'Send picture',

            am: 'A.M.',
            pm: 'P.M.',
            draft: '[Draft]',
            someoneAt: '[Someone mentioned me]',
            atedby: ' mentioned you',
            changeGroupName: ' has changed the group name to',
            removedMember: ' was removed out of the group',
            removedMemberAdminStart: 'You removed ',
            removedMemberAdminEnd: ' out of the group',
            leftGroup: ' left the group',
            addGroup: ' were added to the group',
            invitedIntoGroup: ' have invited ',
            invitedIntoGroupEnd: ' into the group',
            you: 'You',
            download: 'Download',

            file: '[File]',
            img: '[Image]',
            video: '[Video]',
            audio: '[Audio]',
            link: '[Link]',

            languageSettingTitle: 'Language Setting',
            languageSettingTip: 'Click image to set Language',
            languageSettingTitle1: '语言设置',

            joinEnt: '加入了',
            inviteEnt: '邀请你加入公司',
            voiceConference: 'Voice conference',
            invitedIntoMetting: ' attend voice conference , please check on your mobile phone.',
            invitedIntoMettingInSender: ' 发起了语音会议，请在手机上查看。',
            seeInMobile: 'please check it on your phone.',

            loading: 'loading...',
            serviceNumber: 'Service number',
            noChat: 'No Content',
            start: 'Get Start',
            send: 'Send',
            cancel: 'Cancel',
            back: 'Back',
            group: 'Group',
            confirm: 'Confirm',

            userName: 'Name',
            userPost: 'Post',
            userEntEmail: 'Company Email',
            userEmpNo: 'EmpNo',
            userAddress: 'Address',
            userDept: 'Department',
            userLeader: 'Leader',
            weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            yesterday: 'yesterday',
            thedaybeforeyesterday: 'the day before yesterday',
            stranger: 'stranger',
            broad: 'broad',
            addToFriends: 'Add to friend',
            addToFrequents: 'Add to frequent',
            removeFriends: 'Remove friend',
            removeFrequents: 'Remove from frequent',
            msgdisturb: 'Message Don\'t disturb',
            noSign: 'No Contents',
            shutUpAction: ' have been banned',
            shutUpWarn: ' have been banned , please try later',
            minutes: 'minutes',
            forever: 'forever',
            shutUpForever: ' have been banned forever',
            cancelShutUp: 'can speak now',
            banned: 'banned',
            loginFail: 'Phone number or password incorrect',
            requestError: 'Request error, please try again later',
            connectServer: 'connecting server...',
            connectSuccess: 'Server connection success',
            connectFail: 'Server connection fail',
            afterSSOSuccess: 'Verify successful , connection to chat server',
            loginSuccess: 'Chat server connection is successful, waiting for initialization',
            sessionExpired: 'Session expired , Please log in again',
            chatServerTimeout: 'Chat server connection timed out, please try again later',
            downApp: 'Download Jingjing',
            companyLogin: 'Company Login',
            appNameWeb: 'Web Jingjing',
            china: 'China',
            taiwan: 'Taiwan',
            usa: 'U.S.A',
            korea: 'Korea',
            russia: 'Russia',
            japan: 'Japan',
            deptLoading: 'Personnel data loading...',
            withDrawMsg: 'withdrew a message',
            withDraw: 'Withdraw',
            canNotWithDraw: 'More than 2 minutes can not be withdrawn',
            privacyAttention: ' not your friends or colleagues, please pay attention to the protection of privacy',
            loadMoreMsg: '更多消息请在聊天记录中查看',
            openRecords: '打开消息记录',
            seeDetail: '查看详情',

            cancelUpload: '传输已取消',
            reupload: '重新上传',
            open: '打开',
            openDir: '打开文件夹',
            fileCacheDay: '文件暂存7天',
            receiverDonwloaded: '对方已接收',
            fileSendFail: '文件发送失败',

            cancelDownload: '取消下载',
            reDownload: '重新下载',
            cancelTrans: '传输已取消',
            downloaded: '接收成功',
            downloadFail: '下载失败',
            transFail: '传输失败',
            saveAs: '另存为',
            fileOutOfDay: '文件已过期',
            allFiles: 'All Files|*.*',
            imageFiles: 'Images|*.png;*.jpg;*.gif',

            setting: 'Setting',
            about: 'About',
            switchAccount: 'Switch Account',
            quit: 'Quit',

            serviceAccount: '服务号',
            fdepts: '常用部门',
            fgroups: '常用群聊 ',
            entCharger: '企业负责人',
            entEmpCount: '企业总人数',

            deptLeader: '部门主管',
            deptDirector: '分管领导',
            deptEmpCount: '部门人数',
            noEmp: '暂无',

            'ent.userName': '姓名',
            'ent.job': '职位',
            'ent.email': '企业邮箱',
            'ent.empNo': '工号',
            'ent.depts': '组织架构',
            'ent.leader': '直接主管',
            'user.userName': '姓名',
            'user.mobile': '电话',
            'user.email': '邮箱',
            'user.noSignature': '这家伙很懒,什么都没有留下...',

            favoriteDept: '添加常用部门',
            favoriteEmp: '添加常用联系人',
            sendInstantMessage: '发送即时消息',
            refreshEnts: '刷新组织架构',

            setUserToFavorite: '添加常用联系人',
            setGroupToFavorite: '添加常用群聊',
            cancelUserToFavorite: '移除常用联系人',
            cancelGroupToFavorite: '移除常用群聊',
            cancelDeptToFavorite: '移除常用部门',

            goback: '<返回',
            broadDetailTitle: '广播详情',

            quitGroup: 'quit group chat',
            chooseUser: '选择群聊成员',

            selectedUsers: '已选择成员：',
            selectedUsersUnit: '人',

            clickToEditEmail: 'click  to edit email',

            account: '账号',
            serviceLogin: '服务号登录',
            autoLogin: '自动登录',
            resetPwd: '重置密码',
            pwdLogin: '密码登录',
            register: '注册',
            smsCode: '验证码',
            wrongSmsCode: '验证码错误',
            blankSmsCode: '请输入验证码',
            diffPassword: '两次输入的密码不一致',
            alreadyInUse: '手机号已经被使用',
            writeInvitationCode: '请填写邀请码',
            finish: '完成',
            next: '下一步',
            skip: '跳过',
            getCode: '获取验证码',
            countDown: '{d}秒后重新获取',
            newPwd: '新密码',
            confirmNewPwd: '再次输入新密码',
            confirmPwd: '确认密码',
            repeatPwd: '再次输入密码',

            safeTipTitle: '安全提示',
            safeTipContentLine1: '公共环境请勿开启自动登录功能，',
            safeTipContentLine2: '以免数据泄露',
            donNotOpen: '不开启',
            confirmOpen: '确认开启',

            forgetPwdTitle: '忘记密码',
            forgetPwdContentLine1: '请通知总管理员，登录管理后台重置',
            forgetPwdContentLine2: '密码http://mgr.jj.snail.com',
            getThat: '我知道了',

            loadEntError: '组织架构加载错误',
            clickToRetry: '点此重新加载',

            'setting.login': '登录',
            'setting.hotkey': '热键',
            'setting.sound': '声音',
            'setting.backup': '聊天备份',
            autoStart: '开机自动启动',
            getMsg: '提取消息',
            showMainIframe: '显示主面板',
            capture: '捕捉屏幕',
            quickSend: '快速发送',
            recordingVoice: '语音按键说话',
            openChatHistory: '打开聊天记录',
            setToDefault: '恢复默认设置',
            sendMsgHotKey: '会话窗口发送消息',
            hasSameHotKey: '冲突',
            CESend: '按Ctrl+Enter键',
            ESend: 'Enter键',
            closeTone: '关闭消息提示音',
            backupToPC: '备份到电脑',
            backupBtn: '备份',
            recoverToPhone: '恢复到手机',
            recoverBtn: '恢复',
            managerBackup: '管理备份',
            managerBackupBtn: '管理',

            close: '关闭',
            scanQrCode: '扫二维码下载手机版',
            copyRight: '苏州蜗牛数字科技股份有限公司©版权所有',

            backupTips: '请在手机上确认，以开始备份',
            restoreTips: '请在手机上确认，以开始还原',
            managerTips: '小提示：修改备份存储目录将会迁移所有已存储的备份，暂不支持中文路径',
            currentBackUpDir: '备份存储位置目录：',
            modify: '更改',
            backupName: '备份名称',
            firstBackupTime: '首次备份时间',
            lastBackupTime: '上次备份时间',
            operate: '操作',
            deleteBackup: '删除备份',

            backupComplete: '备份已完成',
            restoreComplete: '传输已完成，请在手机上继续恢复',
            notCloseApp: '为了保证良好的网络链接，请不要关闭静静办公',
            backuped: '已备份',
            restoreed: '已还原',

            sendFail: '[发送失败]',

            recording: '正在录音...',
            recordFinish: '录音完成',

            noMicroPhone: '未找到麦克风',
            noBroadcaster: '未找到播放设备',

            recentChat: '最近聊天',

            msgTooLong: '内容过长，请删除部分内容后重试',

            shareLink: '分享了一个链接',

            hasBeenShutup: '已被群主禁言，还剩 ',

            largeFileMsg: '[大文件]',
            largeFile: '大文件传输助手',
            largeFilePC: '大文件传输助手(仅局域网PC间)',
            largeFIleMsgTip: '(仅限同一局域网PC端接收)',
            receiveFileTitle: '来自{name}的接收事项',
            stillReceive: '仍然接收',
            hasReject: '已拒绝',
            waitReceive: '等待接收',
            receiveError: '接收中断',
            dragFileTips: '拖拽文件（文件夹）到此或者点击添加按钮',
            deleteFile: '删除',

            messageManager: '消息管理器',
            contacts: '联系人',
            addressBook: '通讯录',
            content: '内容',
            searchRange: '查找范围',

            all: '全部',
            recentOneMonth: '最近一个月',
            recentThreeMonth: '最近三个月',
            recentOneYear: '最近一年',

            text: '查看文本',
            file: '查看文件',

            remark: '备注',
            notSupportSendFileDir: '对不起，暂时不支持发送文件夹。请使用大文件传送功能发送文件夹。',

            fileMsgHistory: '文件[{name}]，请在聊天窗口查看',
            allResult: '全部结果',

            imgView: '图片查看器',
            sourceSize: '实际尺寸',
            optimumSize: '最佳比例',
            zoomout: '放大',
            zoomin: '缩小',
            prevImg: '上一张',
            nextImg: '下一张',
            rotateAntiWise: '逆时针旋转90度',
            rotateWise: '顺时针旋转90度',
            saveImg: '保存',
            saveSuccess: '保存成功',
            imageLoadFail: '无法加载图片',
            lastImg: '已经是最后一张图片',
            firstImg: '已经是第一张图片',

            loadingMsg: '消息加载中',

            receiveStatus: '查看接收状态',
            receive: '接收',
            reject: '拒绝',
            cancelReceive: '取消接收',
            reReceive: '重新接收',
            stillReceive: '仍然接收',
            hasReject: '已拒绝',
            waitReceive: '等待接收',
            receiveError: '接收中断',
            receiveComplete: '已接收',
            intranetPicTips: '当前为内网环境，该图仅限内网用户查看',
            senderCancel: '发送方取消发送',
            cancelLargeFile: '取消发送',
            receiveCancel: '对方取消接收',
            cancelLargeFileMsgInSender: '您已取消发送大文件',
            cancelLargeFileMsgInReceiver: '已取消发送大文件',
            fileTransfering: '有文件正在传输，确定要退出？',

            unreadMsg: '条未读消息',
            newMsg: '条新消息',

            'btn.face': '插入表情',
            'btn.file': '发送文件',
            'btn.img': '插入图片',
            'btn.voice': '开始录音',
            'btn.capture': '截图',
            'btn.history': '消息记录',

            offlineTip: '静静已离线，请检查网络',
            paste: '粘贴',

            minwin: '最小化',
            restorewin: '向下还原',
            maxwin: '最大化',

            error107: '文件不存在',
            error108: '文件夹不存在',
            error8: '无法开启文件发送端口，请检查网络或防火墙设置',
            loginError2: '用户名或密码错误',
            loginError12: '用户名或密码错误',
            loginError10: '网络异常',
            loginError15: '您的账号已登录，无法重复登录。',
            loginError16: '请输入正确的验证码',
            loginError100: '用户不存在',
            noStaffs: '所选部门没有员工，无法创建群聊',
            saveImgPifx: '静静图片',
            leaveGroupConfirm: '是否确认退出该群？',
            imageWasWithDrawBySender: '图片已被撤回',
            noMessage: '没有聊天记录',
            noSearchMsg: '没有搜索到相关消息',
            outOfToken: '身份已过期，请重新登录。',
            clear: '清屏',
            cut: 'cut',
            deleteContent: 'delete',
            fileTooLarge: '文件大小超过80M，请使用大文件传输助手发送',
            tooLargeFile: '存在超过80M的文件无法发送，请使用大文件传输助手发送'
        }
    }
    var langs = [];
    for (var p in LANGMAP) {
        langs.push({
            langName: LANGMAP[p].langName,
            langValue: p
        });
    }
    var obj = {
        langs: langs,
        setLang: function (_lang) {
            localStorage.setItem('lang', _lang);
            // lang = _lang;
        },
        getLang: function () {
            // if(lang) return lang;
            return localStorage.getItem('lang') || util.cookie.get('lang') || 'cn';
        },
        getKey: function (key, returnBlank) {
            var _l = this.getLang();
            if (LANGMAP[_l] && LANGMAP[_l][key] !== undefined) {
                return LANGMAP[_l][key];
            }
            return !returnBlank ? key : '';
        },
        isSeted: function () {
            if (!(localStorage.getItem('lang') || util.cookie.get('lang'))) return false;
            return true;
        }
    }
    util.getKey = function (k) {
        return obj.getKey(k);
    }
    util.langPack = obj;
    return obj;
}]);

services.factory('faces', [function () {
    // var woniuTitles = [
    // '可爱','惊喜','满足','愉快','微笑','开心','傻笑','狂笑','偷笑','坏笑',
    // '奸笑','色'   ,'使坏','逗逼','认真','勇气','呆萌','发傻','呐尼','发呆',
    // '嘟嘴','好吃','斜视','纠结','晕'   ,'木'   ,'苦笑','无奈','尴尬','流汗',
    // '低落','烦躁','无辜','撇嘴','左哼哼','右哼哼','惊讶','惊恐','伤心','感动',
    // '哽咽','哭'   ,'生气','发怒','噗'   ,'烦'   ,'怂'   ,'赞'
    // ];
    // var qqTitles = ["微笑","撇嘴","色","发呆","得意","流泪","害羞","闭嘴","睡","大哭","尴尬","发怒","调皮","龇牙","惊讶","难过","酷","冷汗","抓狂","吐","偷笑","愉快","白眼","傲慢","饥饿","困","惊恐","流汗","憨笑","悠闲","奋斗","咒骂","疑问","嘘","晕","疯了","衰","骷髅","敲打","再见","擦汗","抠鼻","鼓掌","糗大了","坏笑","左哼哼","右哼哼","哈欠","鄙视","委屈","快哭了","阴险","亲亲","吓","可怜","菜刀","西瓜","啤酒","篮球","乒乓","咖啡","饭","猪头","玫瑰","凋谢","嘴唇","爱心","心碎","蛋糕","闪电","炸弹","刀","足球","瓢虫","便便","月亮","太阳","礼物","拥抱","强","弱","握手","胜利","抱拳","勾引","拳头","差劲","爱你","NO","OK"];
    var qqTitles = ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "大笑", "惊讶", "难过", "囧", "抓狂", "吐", "偷笑", "愉快", "吐舌", "傲慢", "困", "惊恐", "流汗", "悠闲", "奋斗", "咒骂", "恶魔", "邪恶", "外星人", "僵尸", "机器人", "大便", "疑问", "嘘", "晕", "衰", "骷髅", "打击", "再见", "抠鼻", "鼓掌", "坏笑", "哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "怪物", "幽灵", "感冒", "苦笑", "瞪眼", "尖叫", "遗憾", "斜眼", "嘿哈", "捂脸", "奸笑", "眨眼", "机智", "皱眉", "耶", "菜刀", "西瓜", "啤酒", "咖啡", "猪头", "玫瑰", "凋谢", "嘴唇", "爱心", "心碎", "蛋糕", "炸弹", "晚安", "太阳", "抱抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "OK", "不对", "双手合十", "加油", "庆祝", "礼物", "茶", "红包", "蜡烛"];
    var titles = {
        qq: qqTitles
        // woniu : woniuTitles
    }
    var titlesArr = [];
    var cates = [];
    var maps = {};
    for (var p in titles) {
        cates.push(p);
        titlesArr.push(titles[p]);
        !maps[p] && (maps[p] = {});
        for (var i = 0; i < titles[p].length; i++) {
            maps[p][titles[p][i]] = i;
        }
    }
    return {
        cates: cates,
        titles: titlesArr,
        maps: maps
    }
}])
services.factory('servers', ['util', function (util) {
    function getSearch(url) {
        var a = url || location.search;
        var obj = {};
        var ps = a.substr(1, a.length).split('&')
        for (var i = 0; i < ps.length; i++) {
            var _a = ps[i].split('=');
            var k = _a[0], v = _a[1];
            if (obj[k]) {
                obj[k] = [obj[k]];
                obj[k].push(v);
            } else {
                obj[k] = v;
            }
        }
        return obj;
    }
    var ipMap = {
        ip1: '10.200.23.69',
        ip2: '10.200.23.179',
        ip3: '10.199.4.39',
        // ip4 : '115.182.75.251',
        ip4: '122.144.201.28',
        ip5: '172.18.70.54'
        // ip4 : '10.199.4.34'
    }
    var search = getSearch();
    search.server = search.server || 'ip4';
    var ip = ipMap[search.server] || search.server;
    if (!util.isDev()) {
        ip = ipMap.ip4;
    } else {
        ip = search.server || ipMap.ip5;
    }
    var port = search.port || '9876';
    var socketUrl = (location.protocol == 'https:' ? 'wss://' : 'ws://') + ip + ':' + port;
    return {
        socketUrl: socketUrl,
        // socketUrl : 'ws://10.200.23.179:9876',
        downLoad: util.isDev() ? 'http://eim.snail.com:8086' : 'http://im.yun.woniu.com:8086',
        // downLoad : 'http://10.103.4.12:8086',
        httpbind: location.href.indexOf('localhost') != -1 ? 'http://127.0.0.1:7070/http-bind/' : '/http-bind/'
    }
}])

services.factory('envConfig', [function () {
    var env = {
    };
    return {
        getEnvData: function () {
            return env;
        },
        setEnvData: function (_env) {
            if (_env.LocalDomain) {
                _env.LocalDomain = _env.LocalDomain + '/';
            }
            env = _env;
        }
    }
}]);
services.factory('webConfig', ['util', function (util) {
    var MAX_UPLOAD_SIZE_M = 80;
    var user = {};

    var token;
    var devHostName = {
        'webimnew.mysnail.com': 1,
        'jjwebim.mysnail.com': 1,
        'jjwebim-test.mysnail.com': 1
    }
    var config = {
        setUser: function (_user) {
            if (_user.STicket) {
                token = _user.STicket;
            }
            if (!_user.STicket && token) {
                _user.STicket = token;
            }
            user.SUserId = _user.Id;
            user = _user;
        },
        getUser: function () {
            return user;
        },
        getToken: function () {
            return token;
        },
        setToken: function (_token) {
            token = _token;
        },

        SHOW_MSGTIME_DIS: 5 * 60 * 1000,
        MSG_SEND_TIMEOUT: 15 * 1000,
        MAX_FILE_SIZE: 8 * 10 * 1024 * 1024,
        // REQUEST_PIX : ,
        REQUEST_PIX: util.isDev() ? (devHostName[location.hostname] ? '/qixin' : '') : '',
        IM_ACCOUNT: 'im_account',
        LOGIN_KEY: 'login_key',
        PHONE_PIX: 'phone_pix',
        LOGIN_USER: 'login_user',
        URL_PATH: 'http://im.yun.woniu.com:3344/IM/avatars/',
        MAN: 'img/defaultHeadImage.jpg',
        WOMEN: 'img/defaultHeadImage.jpg',
        version: '2.0',
        // 文件上传状态
        FILE_WAITTING: 'waitting',
        FILE_UPLOADING: 'uploading',
        FILE_COMPLETE: 'complete',
        FILE_ERROR: 'error',
        FILE_CANCEL: 'cancel',
        // 消息发送状态
        MSG_SENDING: '0',
        MSG_SENDSUCCESS: '1',
        MSG_SENDFAIL: '2',
        MSG_CANCEL: '3',
        // 消息查看状态
        MSG_UNREAD: 'unread',
        MSG_READED: 'readed',
        // 消息类型
        MSG_TEXT_TYPE: 'text',
        MSG_VOICE_TYPE: 'voice',
        MSG_VIDEO_TYPE: 'video',
        MSG_SYSTEM_TYPE: 'system',
        MSG_FILE_TYPE: 'file',
        MSG_PIC_TYPE: 'image',
        MSG_NEWS_TYPE: 'news',
        MSG_METTING_TYPE: 'metting',
        MSG_HTML_TYPE: 'html',
        MSG_READMSG_TYPE: 'readmsg',
        MSG_CLEAR_TYPE: 'clear',
        MSG_SERVICE_TYPE: 'service',
        MSG_NAME: 'msg',
        // 多媒体消息是否在播放
        MSG_ISPLAYING: false,
        // 文件上传限制
        MAX_UPLOAD_SIZE_M: MAX_UPLOAD_SIZE_M,
        MAX_UPLOAD_SIZE: MAX_UPLOAD_SIZE_M * 1024 * 1024,
        SERVICE_MSG_PIFX: util.isDev() ? 'http://manager.snail.com' : 'http://mgr.jj.woniu.com/', // 服务号消息连接地址
        SERVICE_AVATAR_PIFX: 'http://mgr.jj.woniu.com', // 服务号头像地址
        ENT_AVATAR_PIFX: 'http://mgr.jj.woniu.com', // 企业logo地址
        USER_AVATAR_PIFX: 'http://jj.woniu.com', // 用户头像地址
        ERROR_IMAGE: 'img/img_error.png'
    };
    config.MSG_TYPE_ARR = [
        config.MSG_TEXT_TYPE,
        config.MSG_VOICE_TYPE,
        config.MSG_VIDEO_TYPE,
        config.MSG_FILE_TYPE,
        config.MSG_PIC_TYPE,
        config.MSG_NEWS_TYPE,
        config.MSG_METTING_TYPE,
        config.MSG_HTML_TYPE,
        config.MSG_READMSG_TYPE,
        config.MSG_CLEAR_TYPE,
        config.MSG_SERVICE_TYPE
    ];

    config.MSG_TYPE_MAP = {};
    for (var i = 0; i < config.MSG_TYPE_ARR.length; i++) {
        config.MSG_TYPE_MAP[config.MSG_TYPE_ARR[i]] = i;
    }
    return config;
}]);
services.factory('userConfig', [function () {
    return {
        allowNotice: true,
        allowVoice: true
    }
}]);
services.factory('util', ['userConfig', 'envConfig', 'faces', function (userConfig, envConfig, faces) {
    Date.prototype.format = function (join) {
        return (join || "YYYY-MM-DD").replace(/YYYY/g, this.getFullYear())
            .replace(/YY/g, String(this.getYear()).slice(-2))
            .replace(/MM/g, ("0" + (this.getMonth() + 1)).slice(-2))
            .replace(/M/g, this.getMonth() + 1)
            .replace(/DD/g, ("0" + this.getDate()).slice(-2))
            .replace(/D/g, this.getDate())
            .replace(/hh/g, ("0" + this.getHours()).slice(-2))
            .replace(/h/g, this.getHours())
            .replace(/mm/g, ("0" + this.getMinutes()).slice(-2))
            .replace(/m/g, this.getMinutes())
            .replace(/ss/g, ("0" + this.getSeconds()).slice(-2))
            .replace(/s/g, this.getSeconds());
    };
    String.prototype.toDate = function (format) {
        if (this.toString() === '') return '';
        var str;
        if (this.indexOf('.') != -1) {
            str = this.substring(0, this.indexOf('.'));
        } else {
            str = this.toString();
        }
        var reg = /-/g;
        str = str.replace(reg, '/');
        if (str.indexOf('T')) {
            str = str.replace('T', ' ');
        }
        if (format) {
            return new Date(str).format(format);
        } else {
            return new Date(str);
        }
    }
    var util = {};
    window.util = util;
    util.loadXml = function (xmlString) {
        var xmlDoc;
        if (window.ActiveXObject) {
            xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
            if (!xmlDoc) xmldoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlString);
        } else if (document.implementation && document.implementation.createDocument) {
            var domParser = new DOMParser();
            xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
        } else {
            return null;
        }
        return xmlDoc;
    }
    util.xmlStringToObj = function (xml) {
        xml = xml.replace(/>(\s+)</gi, function (v, x) {
            return '><';
        });
        var _xml = util.loadXml(xml);
        return util.xmlToObj(_xml);
    }
    util.xmlToObj = function (xml) {
        var nodes = xml.childNodes;
        var len = nodes.length;
        var obj = {};
        // if(xml.documentElement){
        // var attrs = xml.documentElement.attributes;
        // for(var i=0;i<attrs.length;i++){
        // obj[attrs[i].nodeName] = attrs[i].nodeValue;
        // }
        // }
        var attrs = xml.attributes;
        if (attrs) {
            for (var i = 0; i < attrs.length; i++) {
                obj[attrs[i].nodeName] = attrs[i].nodeValue;
            }
        }
        for (var i = 0; i < len; i++) {
            if (nodes[i].nodeName == 'xml') continue;
            var nn = nodes[i].nodeName;
            if (obj[nn]) {
                obj[nn] = [obj[nn]];
                var temp = {};
                obj[nn].push(temp);
                util.nodeToObj(nodes[i], temp);
            } else {
                obj[nn] = {};
                util.nodeToObj(nodes[i], obj[nn]);
            }
        }
        return obj;
    }
    util.nodeToObj = function (node, branch) {
        var nt = node.nodeType;
        var cns = node.childNodes;
        var len = cns.length;
        var nn = node.nodeName;
        if (node.attributes) {
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                branch[attrs[i].nodeName] = attrs[i].nodeValue;
            }
        }
        for (var i = 0; i < len; i++) {
            var cnn = cns[i].nodeName;
            var cnt = cns[i].nodeType;
            if (cnt == 3) {
                branch['__TEXT__'] = util.htmlEncode(cns[i].wholeText);
            } else {
                if (branch[cnn] !== undefined) {
                    var temp = branch[cnn];
                    if (Object.prototype.toString.call(temp) === '[object Array]') {
                        temp.push(util.nodeToObj(cns[i], {}));
                    } else {
                        branch[cnn] = [];
                        if (!branch[cnn].length) {
                            branch[cnn].push(temp);
                        }
                        branch[cnn].push(util.nodeToObj(cns[i], {}));
                    }
                } else {
                    branch[cnn] = {};
                    branch[cnn] = util.nodeToObj(cns[i], branch[cnn]);
                }
            }
        }
        return branch;
    }

    util.cookie = {
        //获取对应cookie的建的值
        get: function (k) {
            return new RegExp("[?:; ]*" + k + "=([^;]*);?").test(document.cookie + "") ? decodeURIComponent(RegExp["$1"]) : "";
        },
        //设置Cookie 建 值 有效期 目录 域 安全
        set: function (k, v, t, p, m, s) {
            var r = k + "=" + encodeURIComponent(v);
            if (t) {
                if (typeof t == "string") {
                    t = new Date(t.replace(/-/g, "/").replace(/\.\d+$/, ""));
                }
                else if (typeof t == "number") {
                    t = new Date(new Date().getTime() + t * 60000);
                }
                r += "; expires=" + t.toGMTString();
            }
            if (p) {
                r += "; path=" + p;
            }
            if (m) {
                r += "; domain=" + m;
            }
            if (s) {
                r += "; secure";
            }
            document.cookie = r;
            return this;
        },
        //删除Cookie
        del: function (k, p, m) {
            var r = k + "=; expires=" + (new Date(0)).toGMTString();
            if (p) {
                r += "; path=" + p;
            }
            if (m) {
                r += "; domain=" + m;
            }
            document.cookie = r;
            return this;
        }
    };
    util.utf16to8 = function utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }
    var _mod = '- Emoji Modifier Fitzpatrick Type-';
    var table = [{ u: '1F600', e: '😀', n: 'Grinning Face', f: 1, s: 'grinning' }, { u: '1F62C', e: '😬', n: 'Grimacing Face', f: 1, s: 'grimacing' }, { u: '1F601', e: '😁', n: 'Grinning Face With Smiling Eyes', f: 1, s: 'grin' }, { u: '1F602', e: '😂', n: 'Face With Tears Of Joy', f: 1, s: 'joy' }, { u: '1F603', e: '😃', n: 'Smiling Face With Open Mouth', f: 1, s: 'smiley' }, { u: '1F604', e: '😄', n: 'Smiling Face With Open Mouth And Smiling Eyes', f: 1, s: 'smile' }, { u: '1F605', e: '😅', n: 'Smiling Face With Open Mouth And Cold Sweat', f: 1, s: 'sweat_smile' }, { u: '1F606', e: '😆', n: 'Smiling Face With Open Mouth And Tightly-closed Eyes', f: 1, s: 'laughing' }, { u: '1F607', e: '😇', n: 'Smiling Face With Halo', f: 1, s: 'innocent' }, { u: '1F609', e: '😉', n: 'Winking Face', f: 1, s: 'wink' }, { u: '1F60A', e: '😊', n: 'Smiling Face With Smiling Eyes', f: 1, s: 'blush' }, { u: '1F642', e: '🙂', n: 'Slightly Smiling Face', f: 1, s: 'slight_smile' }, { u: '1F643', e: '🙃', n: 'Upside-down Face', f: 1 }, { u: '263A', e: '☺️', n: 'White Smiling Face', f: 1, s: 'relaxed' }, { u: '1F60B', e: '😋', n: 'Face Savouring Delicious Food', f: 1, s: 'yum' }, { u: '1F60C', e: '😌', n: 'Relieved Face', f: 1, s: 'relieved' }, { u: '1F60D', e: '😍', n: 'Smiling Face With Heart-shaped Eyes', f: 1, s: 'heart_eyes' }, { u: '1F618', e: '😘', n: 'Face Throwing A Kiss', f: 1, s: 'kissing_heart' }, { u: '1F617', e: '😗', n: 'Kissing Face', f: 1, s: 'kissing' }, { u: '1F619', e: '😙', n: 'Kissing Face With Smiling Eyes', f: 1, s: 'kissing_smiling_eyes' }, { u: '1F61A', e: '😚', n: 'Kissing Face With Closed Eyes', f: 1, s: 'kissing_closed_eyes' }, { u: '1F61C', e: '😜', n: 'Face With Stuck-out Tongue And Winking Eye', f: 1, s: 'stuck_out_tongue_winking_eye' }, { u: '1F61D', e: '😝', n: 'Face With Stuck-out Tongue And Tightly-closed Eyes', f: 1, s: 'stuck_out_tongue_closed_eyes' }, { u: '1F61B', e: '😛', n: 'Face With Stuck-out Tongue', f: 1, s: 'stuck_out_tongue' }, { u: '1F911', e: '🤑', n: 'Money-mouth Face', f: 1 }, { u: '1F913', e: '🤓', n: 'Nerd Face', f: 1 }, { u: '1F60E', e: '😎', n: 'Smiling Face With Sunglasses', f: 1, s: 'sunglasses' }, { u: '1F917', e: '🤗', n: 'Hugging Face', f: 1 }, { u: '1F60F', e: '😏', n: 'Smirking Face', f: 1, s: 'smirk' }, { u: '1F636', e: '😶', n: 'Face Without Mouth', f: 1, s: 'no_mouth' }, { u: '1F610', e: '😐', n: 'Neutral Face', f: 1, s: 'neutral_face' }, { u: '1F611', e: '😑', n: 'Expressionless Face', f: 1, s: 'expressionless' }, { u: '1F612', e: '😒', n: 'Unamused Face', f: 1, s: 'unamused' }, { u: '1F644', e: '🙄', n: 'Face With Rolling Eyes', f: 1 }, { u: '1F914', e: '🤔', n: 'Thinking Face', f: 1 }, { u: '1F633', e: '😳', n: 'Flushed Face', f: 1, s: 'flushed' }, { u: '1F61E', e: '😞', n: 'Disappointed Face', f: 1, s: 'disappointed' }, { u: '1F61F', e: '😟', n: 'Worried Face', f: 1, s: 'worried' }, { u: '1F620', e: '😠', n: 'Angry Face', f: 1, s: 'angry' }, { u: '1F621', e: '😡', n: 'Pouting Face', f: 1, s: 'rage' }, { u: '1F614', e: '😔', n: 'Pensive Face', f: 1, s: 'pensive' }, { u: '1F615', e: '😕', n: 'Confused Face', f: 1, s: 'confused' }, { u: '1F641', e: '🙁', n: 'Slightly Frowning Face', f: 1, s: 'slight_frown' }, { u: '2639', e: '☹️', n: 'White Frowning Face', f: 1 }, { u: '1F623', e: '😣', n: 'Persevering Face', f: 1, s: 'persevere' }, { u: '1F616', e: '😖', n: 'Confounded Face', f: 1, s: 'confounded' }, { u: '1F62B', e: '😫', n: 'Tired Face', f: 1, s: 'tired_face' }, { u: '1F629', e: '😩', n: 'Weary Face', f: 1, s: 'weary' }, { u: '1F624', e: '😤', n: 'Face With Look Of Triumph', f: 1, s: 'triumph' }, { u: '1F62E', e: '😮', n: 'Face With Open Mouth', f: 1, s: 'open_mouth' }, { u: '1F631', e: '😱', n: 'Face Screaming In Fear', f: 1, s: 'scream' }, { u: '1F628', e: '😨', n: 'Fearful Face', f: 1, s: 'fearful' }, { u: '1F630', e: '😰', n: 'Face With Open Mouth And Cold Sweat', f: 1, s: 'cold_sweat' }, { u: '1F62F', e: '😯', n: 'Hushed Face', f: 1, s: 'hushed' }, { u: '1F626', e: '😦', n: 'Frowning Face With Open Mouth', f: 1, s: 'frowning' }, { u: '1F627', e: '😧', n: 'Anguished Face', f: 1, s: 'anguished' }, { u: '1F622', e: '😢', n: 'Crying Face', f: 1, s: 'cry' }, { u: '1F625', e: '😥', n: 'Disappointed But Relieved Face', f: 1, s: 'disappointed_relieved' }, { u: '1F62A', e: '😪', n: 'Sleepy Face', f: 1, s: 'sleepy' }, { u: '1F613', e: '😓', n: 'Face With Cold Sweat', f: 1, s: 'sweat' }, { u: '1F62D', e: '😭', n: 'Loudly Crying Face', f: 1, s: 'sob' }, { u: '1F635', e: '😵', n: 'Dizzy Face', f: 1, s: 'dizzy_face' }, { u: '1F632', e: '😲', n: 'Astonished Face', f: 1, s: 'astonished' }, { u: '1F910', e: '🤐', n: 'Zipper-mouth Face', f: 1 }, { u: '1F637', e: '😷', n: 'Face With Medical Mask', f: 1, s: 'mask' }, { u: '1F912', e: '🤒', n: 'Face With Thermometer', f: 1 }, { u: '1F915', e: '🤕', n: 'Face With Head-bandage', f: 1 }, { u: '1F634', e: '😴', n: 'Sleeping Face', f: 1, s: 'sleeping' }, { u: '1F4A4', e: '💤', n: 'Sleeping Symbol', f: 1, s: 'zzz' }, { u: '1F4A9', e: '💩', n: 'Pile Of Poo', f: 1, s: 'poop' }, { u: '1F608', e: '😈', n: 'Smiling Face With Horns', f: 1, s: 'smiling_imp' }, { u: '1F47F', e: '👿', n: 'Imp', f: 1, s: 'imp' }, { u: '1F479', e: '👹', n: 'Japanese Ogre', f: 1, s: 'japanese_ogre' }, { u: '1F47A', e: '👺', n: 'Japanese Goblin', f: 1, s: 'japanese_goblin' }, { u: '1F480', e: '💀', n: 'Skull', f: 1, s: 'skull' }, { u: '1F47B', e: '👻', n: 'Ghost', f: 1, s: 'ghost' }, { u: '1F47D', e: '👽', n: 'Extraterrestrial Alien', f: 1, s: 'alien' }, { u: '1F916', e: '🤖', n: 'Robot Face', f: 1 }, { u: '1F63A', e: '😺', n: 'Smiling Cat Face With Open Mouth', f: 1, s: 'smiley_cat' }, { u: '1F638', e: '😸', n: 'Grinning Cat Face With Smiling Eyes', f: 1, s: 'smile_cat' }, { u: '1F639', e: '😹', n: 'Cat Face With Tears Of Joy', f: 1, s: 'joy_cat' }, { u: '1F63B', e: '😻', n: 'Smiling Cat Face With Heart-shaped Eyes', f: 1, s: 'heart_eyes_cat' }, { u: '1F63C', e: '😼', n: 'Cat Face With Wry Smile', f: 1, s: 'smirk_cat' }, { u: '1F63D', e: '😽', n: 'Kissing Cat Face With Closed Eyes', f: 1, s: 'kissing_cat' }, { u: '1F640', e: '🙀', n: 'Weary Cat Face', f: 1, s: 'scream_cat' }, { u: '1F63F', e: '😿', n: 'Crying Cat Face', f: 1, s: 'crying_cat_face' }, { u: '1F63E', e: '😾', n: 'Pouting Cat Face', f: 1, s: 'pouting_cat' }, { u: '1F64C-1F3FB', e: '🙌🏻', n: 'Person Raising Both Hands In Celebration' + _mod + '1-2', f: 1, s: 'raised_hands' }, { u: '1F64C', e: '🙌', n: 'Person Raising Both Hands In Celebration', f: 1, s: 'raised_hands' }, { u: '1F64C-1F3FC', e: '🙌🏼', n: 'Person Raising Both Hands In Celebration' + _mod + '3', f: 1, s: 'raised_hands' }, { u: '1F64C-1F3FD', e: '🙌🏽', n: 'Person Raising Both Hands In Celebration' + _mod + '4', f: 1, s: 'raised_hands' }, { u: '1F64C-1F3FE', e: '🙌🏾', n: 'Person Raising Both Hands In Celebration' + _mod + '5', f: 1, s: 'raised_hands' }, { u: '1F64C-1F3FF', e: '🙌🏿', n: 'Person Raising Both Hands In Celebration' + _mod + '6', f: 1, s: 'raised_hands' }, { u: '1F44F', e: '👏', n: 'Clapping Hands Sign', f: 1, s: 'clap' }, { u: '1F44F-1F3FB', e: '👏🏻', n: 'Clapping Hands Sign' + _mod + '1-2', f: 1, s: 'clap' }, { u: '1F44F-1F3FC', e: '👏🏼', n: 'Clapping Hands Sign' + _mod + '3', f: 1, s: 'clap' }, { u: '1F44F-1F3FD', e: '👏🏽', n: 'Clapping Hands Sign' + _mod + '4', f: 1, s: 'clap' }, { u: '1F44F-1F3FE', e: '👏🏾', n: 'Clapping Hands Sign' + _mod + '5', f: 1, s: 'clap' }, { u: '1F44F-1F3FF', e: '👏🏿', n: 'Clapping Hands Sign' + _mod + '6', f: 1, s: 'clap' }, { u: '1F44B', e: '👋', n: 'Waving Hand Sign', f: 1, s: 'wave' }, { u: '1F44B-1F3FB', e: '👋🏻', n: 'Waving Hand Sign' + _mod + '1-2', f: 1, s: 'wave' }, { u: '1F44B-1F3FC', e: '👋🏼', n: 'Waving Hand Sign' + _mod + '3', f: 1, s: 'wave' }, { u: '1F44B-1F3FD', e: '👋🏽', n: 'Waving Hand Sign' + _mod + '4', f: 1, s: 'wave' }, { u: '1F44B-1F3FE', e: '👋🏾', n: 'Waving Hand Sign' + _mod + '5', f: 1, s: 'wave' }, { u: '1F44B-1F3FF', e: '👋🏿', n: 'Waving Hand Sign' + _mod + '6', f: 1, s: 'wave' }, { u: '1F44D', e: '👍', n: 'Thumbs Up Sign', f: 1, s: 'thumbsup' }, { u: '1F44D-1F3FB', e: '👍🏻', n: 'Thumbs Up Sign' + _mod + '1-2', f: 1, s: 'thumbsup' }, { u: '1F44D-1F3FC', e: '👍🏼', n: 'Thumbs Up Sign' + _mod + '3', f: 1, s: 'thumbsup' }, { u: '1F44D-1F3FD', e: '👍🏽', n: 'Thumbs Up Sign' + _mod + '4', f: 1, s: 'thumbsup' }, { u: '1F44D-1F3FE', e: '👍🏾', n: 'Thumbs Up Sign' + _mod + '5', f: 1, s: 'thumbsup' }, { u: '1F44D-1F3FF', e: '👍🏿', n: 'Thumbs Up Sign' + _mod + '6', f: 1, s: 'thumbsup' }, { u: '1F44E', e: '👎', n: 'Thumbs Down Sign', f: 1, s: 'thumbsdown' }, { u: '1F44E-1F3FB', e: '👎🏻', n: 'Thumbs Down Sign' + _mod + '1-2', f: 1, s: 'thumbsdown' }, { u: '1F44E-1F3FC', e: '👎🏼', n: 'Thumbs Down Sign' + _mod + '3', f: 1, s: 'thumbsdown' }, { u: '1F44E-1F3FD', e: '👎🏽', n: 'Thumbs Down Sign' + _mod + '4', f: 1, s: 'thumbsdown' }, { u: '1F44E-1F3FE', e: '👎🏾', n: 'Thumbs Down Sign' + _mod + '5', f: 1, s: 'thumbsdown' }, { u: '1F44E-1F3FF', e: '👎🏿', n: 'Thumbs Down Sign' + _mod + '6', f: 1, s: 'thumbsdown' }, { u: '1F44A', e: '👊', n: 'Fisted Hand Sign', f: 1, s: 'punch' }, { u: '1F44A-1F3FB', e: '👊🏻', n: 'Fisted Hand Sign' + _mod + '1-2', f: 1, s: 'punch' }, { u: '1F44A-1F3FC', e: '👊🏼', n: 'Fisted Hand Sign' + _mod + '3', f: 1, s: 'punch' }, { u: '1F44A-1F3FD', e: '👊🏽', n: 'Fisted Hand Sign' + _mod + '4', f: 1, s: 'punch' }, { u: '1F44A-1F3FE', e: '👊🏾', n: 'Fisted Hand Sign' + _mod + '5', f: 1, s: 'punch' }, { u: '1F44A-1F3FF', e: '👊🏿', n: 'Fisted Hand Sign' + _mod + '6', f: 1, s: 'punch' }, { u: '270A', e: '✊', n: 'Raised Fist', f: 1, s: 'fist' }, { u: '270A-1F3FB', e: '✊🏻', n: 'Raised Fist' + _mod + '1-2', f: 1, s: 'fist' }, { u: '270A-1F3FC', e: '✊🏼', n: 'Raised Fist' + _mod + '3', f: 1, s: 'fist' }, { u: '270A-1F3FD', e: '✊🏽', n: 'Raised Fist' + _mod + '4', f: 1, s: 'fist' }, { u: '270A-1F3FE', e: '✊🏾', n: 'Raised Fist' + _mod + '5', f: 1, s: 'fist' }, { u: '270A-1F3FF', e: '✊🏿', n: 'Raised Fist' + _mod + '6', f: 1, s: 'fist' }, { u: '270C', e: '✌️', n: 'Victory Hand', f: 1, s: 'v' }, { u: '270C-1F3FB', e: '✌️🏻', n: 'Victory Hand' + _mod + '1-2', f: 1, s: 'v' }, { u: '270C-1F3FC', e: '✌️🏼', n: 'Victory Hand' + _mod + '3', f: 1, s: 'v' }, { u: '270C-1F3FD', e: '✌️🏽', n: 'Victory Hand' + _mod + '4', f: 1, s: 'v' }, { u: '270C-1F3FE', e: '✌️🏾', n: 'Victory Hand' + _mod + '5', f: 1, s: 'v' }, { u: '270C-1F3FF', e: '✌️🏿', n: 'Victory Hand' + _mod + '6', f: 1, s: 'v' }, { u: '1F44C-1F3FB', e: '👌🏻', n: 'Ok Hand Sign' + _mod + '1-2', f: 1, s: 'ok_hand' }, { u: '1F44C', e: '👌', n: 'Ok Hand Sign', f: 1, s: 'ok_hand' }, { u: '1F44C-1F3FC', e: '👌🏼', n: 'Ok Hand Sign' + _mod + '3', f: 1, s: 'ok_hand' }, { u: '1F44C-1F3FD', e: '👌🏽', n: 'Ok Hand Sign' + _mod + '4', f: 1, s: 'ok_hand' }, { u: '1F44C-1F3FE', e: '👌🏾', n: 'Ok Hand Sign' + _mod + '5', f: 1, s: 'ok_hand' }, { u: '1F44C-1F3FF', e: '👌🏿', n: 'Ok Hand Sign' + _mod + '6', f: 1, s: 'ok_hand' }, { u: '270B', e: '✋', n: 'Raised Hand', f: 1, s: 'raised_hand' }, { u: '270B-1F3FB', e: '✋🏻', n: 'Raised Hand' + _mod + '1-2', f: 1, s: 'raised_hand' }, { u: '270B-1F3FC', e: '✋🏼', n: 'Raised Hand' + _mod + '3', f: 1, s: 'raised_hand' }, { u: '270B-1F3FD', e: '✋🏽', n: 'Raised Hand' + _mod + '4', f: 1, s: 'raised_hand' }, { u: '270B-1F3FE', e: '✋🏾', n: 'Raised Hand' + _mod + '5', f: 1, s: 'raised_hand' }, { u: '270B-1F3FF', e: '✋🏿', n: 'Raised Hand' + _mod + '6', f: 1, s: 'raised_hand' }, { u: '1F450', e: '👐', n: 'Open Hands Sign', f: 1, s: 'open_hands' }, { u: '1F450-1F3FB', e: '👐🏻', n: 'Open Hands Sign' + _mod + '1-2', f: 1, s: 'open_hands' }, { u: '1F450-1F3FC', e: '👐🏼', n: 'Open Hands Sign' + _mod + '3', f: 1, s: 'open_hands' }, { u: '1F450-1F3FD', e: '👐🏽', n: 'Open Hands Sign' + _mod + '4', f: 1, s: 'open_hands' }, { u: '1F450-1F3FE', e: '👐🏾', n: 'Open Hands Sign' + _mod + '5', f: 1, s: 'open_hands' }, { u: '1F450-1F3FF', e: '👐🏿', n: 'Open Hands Sign' + _mod + '6', f: 1, s: 'open_hands' }, { u: '1F4AA', e: '💪', n: 'Flexed Biceps', f: 1, s: 'muscle' }, { u: '1F4AA-1F3FB', e: '💪🏻', n: 'Flexed Biceps' + _mod + '1-2', f: 1, s: 'muscle' }, { u: '1F4AA-1F3FC', e: '💪🏼', n: 'Flexed Biceps' + _mod + '3', f: 1, s: 'muscle' }, { u: '1F4AA-1F3FD', e: '💪🏽', n: 'Flexed Biceps' + _mod + '4', f: 1, s: 'muscle' }, { u: '1F4AA-1F3FE', e: '💪🏾', n: 'Flexed Biceps' + _mod + '5', f: 1, s: 'muscle' }, { u: '1F4AA-1F3FF', e: '💪🏿', n: 'Flexed Biceps' + _mod + '6', f: 1, s: 'muscle' }, { u: '1F64F', e: '🙏', n: 'Person With Folded Hands', f: 1, s: 'pray' }, { u: '1F64F-1F3FB', e: '🙏🏻', n: 'Person With Folded Hands' + _mod + '1-2', f: 1, s: 'pray' }, { u: '1F64F-1F3FC', e: '🙏🏼', n: 'Person With Folded Hands' + _mod + '3', f: 1, s: 'pray' }, { u: '1F64F-1F3FD', e: '🙏🏽', n: 'Person With Folded Hands' + _mod + '4', f: 1, s: 'pray' }, { u: '1F64F-1F3FE', e: '🙏🏾', n: 'Person With Folded Hands' + _mod + '5', f: 1, s: 'pray' }, { u: '1F64F-1F3FF', e: '🙏🏿', n: 'Person With Folded Hands' + _mod + '6', f: 1, s: 'pray' }, { u: '261D', e: '☝️', n: 'White Up Pointing Index', f: 1, s: 'point_up' }, { u: '261D-1F3FB', e: '☝️🏻', n: 'White Up Pointing Index' + _mod + '1-2', f: 1, s: 'point_up' }, { u: '261D-1F3FC', e: '☝️🏼', n: 'White Up Pointing Index' + _mod + '3', f: 1, s: 'point_up' }, { u: '261D-1F3FD', e: '☝️🏽', n: 'White Up Pointing Index' + _mod + '4', f: 1, s: 'point_up' }, { u: '261D-1F3FE', e: '☝️🏾', n: 'White Up Pointing Index' + _mod + '5', f: 1, s: 'point_up' }, { u: '261D-1F3FF', e: '☝️🏿', n: 'White Up Pointing Index' + _mod + '6', f: 1, s: 'point_up' }, { u: '1F446', e: '👆', n: 'White Up Pointing Backhand Index', f: 1, s: 'point_up_2' }, { u: '1F446-1F3FB', e: '👆🏻', n: 'White Up Pointing Backhand Index' + _mod + '1-2', f: 1, s: 'point_up_2' }, { u: '1F446-1F3FC', e: '👆🏼', n: 'White Up Pointing Backhand Index' + _mod + '3', f: 1, s: 'point_up_2' }, { u: '1F446-1F3FD', e: '👆🏽', n: 'White Up Pointing Backhand Index' + _mod + '4', f: 1, s: 'point_up_2' }, { u: '1F446-1F3FE', e: '👆🏾', n: 'White Up Pointing Backhand Index' + _mod + '5', f: 1, s: 'point_up_2' }, { u: '1F446-1F3FF', e: '👆🏿', n: 'White Up Pointing Backhand Index' + _mod + '6', f: 1, s: 'point_up_2' }, { u: '1F447', e: '👇', n: 'White Down Pointing Backhand Index', f: 1, s: 'point_down' }, { u: '1F447-1F3FB', e: '👇🏻', n: 'White Down Pointing Backhand Index' + _mod + '1-2', f: 1, s: 'point_down' }, { u: '1F447-1F3FC', e: '👇🏼', n: 'White Down Pointing Backhand Index' + _mod + '3', f: 1, s: 'point_down' }, { u: '1F447-1F3FD', e: '👇🏽', n: 'White Down Pointing Backhand Index' + _mod + '4', f: 1, s: 'point_down' }, { u: '1F447-1F3FE', e: '👇🏾', n: 'White Down Pointing Backhand Index' + _mod + '5', f: 1, s: 'point_down' }, { u: '1F447-1F3FF', e: '👇🏿', n: 'White Down Pointing Backhand Index' + _mod + '6', f: 1, s: 'point_down' }, { u: '1F448', e: '👈', n: 'White Left Pointing Backhand Index', f: 1, s: 'point_left' }, { u: '1F448-1F3FB', e: '👈🏻', n: 'White Left Pointing Backhand Index' + _mod + '1-2', f: 1, s: 'point_left' }, { u: '1F448-1F3FC', e: '👈🏼', n: 'White Left Pointing Backhand Index' + _mod + '3', f: 1, s: 'point_left' }, { u: '1F448-1F3FD', e: '👈🏽', n: 'White Left Pointing Backhand Index' + _mod + '4', f: 1, s: 'point_left' }, { u: '1F448-1F3FE', e: '👈🏾', n: 'White Left Pointing Backhand Index' + _mod + '5', f: 1, s: 'point_left' }, { u: '1F448-1F3FF', e: '👈🏿', n: 'White Left Pointing Backhand Index' + _mod + '6', f: 1, s: 'point_left' }, { u: '1F449', e: '👉', n: 'White Right Pointing Backhand Index', f: 1, s: 'point_right' }, { u: '1F449-1F3FB', e: '👉🏻', n: 'White Right Pointing Backhand Index' + _mod + '1-2', f: 1, s: 'point_right' }, { u: '1F449-1F3FC', e: '👉🏼', n: 'White Right Pointing Backhand Index' + _mod + '3', f: 1, s: 'point_right' }, { u: '1F449-1F3FD', e: '👉🏽', n: 'White Right Pointing Backhand Index' + _mod + '4', f: 1, s: 'point_right' }, { u: '1F449-1F3FE', e: '👉🏾', n: 'White Right Pointing Backhand Index' + _mod + '5', f: 1, s: 'point_right' }, { u: '1F449-1F3FF', e: '👉🏿', n: 'White Right Pointing Backhand Index' + _mod + '6', f: 1, s: 'point_right' }, { u: '1F595-1F3FB', e: '🖕🏻', n: 'Reversed Hand With Middle Finger Extended' + _mod + '1-2', f: 1, s: 'middle_finger' }, { u: '1F595', e: '🖕', n: 'Reversed Hand With Middle Finger Extended', f: 1, s: 'middle_finger' }, { u: '1F595-1F3FC', e: '🖕🏼', n: 'Reversed Hand With Middle Finger Extended' + _mod + '3', f: 1, s: 'middle_finger' }, { u: '1F595-1F3FD', e: '🖕🏽', n: 'Reversed Hand With Middle Finger Extended' + _mod + '4', f: 1, s: 'middle_finger' }, { u: '1F595-1F3FE', e: '🖕🏾', n: 'Reversed Hand With Middle Finger Extended' + _mod + '5', f: 1, s: 'middle_finger' }, { u: '1F595-1F3FF', e: '🖕🏿', n: 'Reversed Hand With Middle Finger Extended' + _mod + '6', f: 1, s: 'middle_finger' }, { u: '1F590-1F3FB', e: '🖐🏻', n: 'Raised Hand With Fingers Splayed' + _mod + '1-2', f: 1, s: 'hand_splayed' }, { u: '1F590', e: '🖐', n: 'Raised Hand With Fingers Splayed', f: 1, s: 'hand_splayed' }, { u: '1F590-1F3FC', e: '🖐🏼', n: 'Raised Hand With Fingers Splayed' + _mod + '3', f: 1, s: 'hand_splayed' }, { u: '1F590-1F3FD', e: '🖐🏽', n: 'Raised Hand With Fingers Splayed' + _mod + '4', f: 1, s: 'hand_splayed' }, { u: '1F590-1F3FE', e: '🖐🏾', n: 'Raised Hand With Fingers Splayed' + _mod + '5', f: 1, s: 'hand_splayed' }, { u: '1F590-1F3FF', e: '🖐🏿', n: 'Raised Hand With Fingers Splayed' + _mod + '6', f: 1, s: 'hand_splayed' }, { u: '1F918', e: '🤘', n: 'Sign Of The Horns', f: 1 }, { u: '1F918-1F3FB', e: '🤘🏻', n: 'Sign Of The Horns' + _mod + '1-2', f: 1 }, { u: '1F918-1F3FC', e: '🤘🏼', n: 'Sign Of The Horns' + _mod + '3', f: 1 }, { u: '1F918-1F3FD', e: '🤘🏽', n: 'Sign Of The Horns' + _mod + '4', f: 1 }, { u: '1F918-1F3FE', e: '🤘🏾', n: 'Sign Of The Horns' + _mod + '5', f: 1 }, { u: '1F918-1F3FF', e: '🤘🏿', n: 'Sign Of The Horns' + _mod + '6', f: 1 }, { u: '1F596', e: '🖖', n: 'Raised Hand With Part Between Middle And Ring Fingers', f: 1, s: 'vulcan' }, { u: '1F596-1F3FB', e: '🖖🏻', n: 'Raised Hand With Part Between Middle And Ring Fingers' + _mod + '1-2', f: 1, s: 'vulcan' }, { u: '1F596-1F3FC', e: '🖖🏼', n: 'Raised Hand With Part Between Middle And Ring Fingers' + _mod + '3', f: 1, s: 'vulcan' }, { u: '1F596-1F3FD', e: '🖖🏽', n: 'Raised Hand With Part Between Middle And Ring Fingers' + _mod + '4', f: 1, s: 'vulcan' }, { u: '1F596-1F3FE', e: '🖖🏾', n: 'Raised Hand With Part Between Middle And Ring Fingers' + _mod + '5', f: 1, s: 'vulcan' }, { u: '1F596-1F3FF', e: '🖖🏿', n: 'Raised Hand With Part Between Middle And Ring Fingers' + _mod + '6', f: 1, s: 'vulcan' }, { u: '270D', e: '✍', n: 'Writing Hand', f: 1 }, { u: '270D-1F3FB', e: '✍🏻', n: 'Writing Hand' + _mod + '1-2', f: 1 }, { u: '270D-1F3FC', e: '✍🏼', n: 'Writing Hand' + _mod + '3', f: 1 }, { u: '270D-1F3FD', e: '✍🏽', n: 'Writing Hand' + _mod + '4', f: 1 }, { u: '270D-1F3FE', e: '✍🏾', n: 'Writing Hand' + _mod + '5', f: 1 }, { u: '270D-1F3FF', e: '✍🏿', n: 'Writing Hand' + _mod + '6', f: 1 }, { u: '1F485', e: '💅', n: 'Nail Polish', f: 1, s: 'nail_care' }, { u: '1F485-1F3FB', e: '💅🏻', n: 'Nail Polish' + _mod + '1-2', f: 1, s: 'nail_care' }, { u: '1F485-1F3FC', e: '💅🏼', n: 'Nail Polish' + _mod + '3', f: 1, s: 'nail_care' }, { u: '1F485-1F3FD', e: '💅🏽', n: 'Nail Polish' + _mod + '4', f: 1, s: 'nail_care' }, { u: '1F485-1F3FE', e: '💅🏾', n: 'Nail Polish' + _mod + '5', f: 1, s: 'nail_care' }, { u: '1F485-1F3FF', e: '💅🏿', n: 'Nail Polish' + _mod + '6', f: 1, s: 'nail_care' }, { u: '1F444', e: '👄', n: 'Mouth', f: 1, s: 'lips' }, { u: '1F445', e: '👅', n: 'Tongue', f: 1, s: 'tongue' }, { u: '1F442', e: '👂', n: 'Ear', f: 1, s: 'ear' }, { u: '1F442-1F3FB', e: '👂🏻', n: 'Ear' + _mod + '1-2', f: 1, s: 'ear' }, { u: '1F442-1F3FC', e: '👂🏼', n: 'Ear' + _mod + '3', f: 1, s: 'ear' }, { u: '1F442-1F3FD', e: '👂🏽', n: 'Ear' + _mod + '4', f: 1, s: 'ear' }, { u: '1F442-1F3FE', e: '👂🏾', n: 'Ear' + _mod + '5', f: 1, s: 'ear' }, { u: '1F442-1F3FF', e: '👂🏿', n: 'Ear' + _mod + '6', f: 1, s: 'ear' }, { u: '1F443', e: '👃', n: 'Nose', f: 1, s: 'nose' }, { u: '1F443-1F3FB', e: '👃🏻', n: 'Nose' + _mod + '1-2', f: 1, s: 'nose' }, { u: '1F443-1F3FC', e: '👃🏼', n: 'Nose' + _mod + '3', f: 1, s: 'nose' }, { u: '1F443-1F3FD', e: '👃🏽', n: 'Nose' + _mod + '4', f: 1, s: 'nose' }, { u: '1F443-1F3FE', e: '👃🏾', n: 'Nose' + _mod + '5', f: 1, s: 'nose' }, { u: '1F443-1F3FF', e: '👃🏿', n: 'Nose' + _mod + '6', f: 1, s: 'nose' }, { u: '1F441', e: '👁', n: 'Eye', f: 1, s: 'eye' }, { u: '1F440', e: '👀', n: 'Eyes', f: 1, s: 'eyes' }, { u: '1F464', e: '👤', n: 'Bust In Silhouette', f: 1, s: 'bust_in_silhouette' }, { u: '1F465', e: '👥', n: 'Busts In Silhouette', f: 1, s: 'busts_in_silhouette' }, { u: '1F5E3', e: '🗣', n: 'Speaking Head In Silhouette', f: 1, s: 'speaking_head' }, { u: '1F476', e: '👶', n: 'Baby', f: 1, s: 'baby' }, { u: '1F476-1F3FB', e: '👶🏻', n: 'Baby' + _mod + '1-2', f: 1, s: 'baby' }, { u: '1F476-1F3FC', e: '👶🏼', n: 'Baby' + _mod + '3', f: 1, s: 'baby' }, { u: '1F476-1F3FD', e: '👶🏽', n: 'Baby' + _mod + '4', f: 1, s: 'baby' }, { u: '1F476-1F3FE', e: '👶🏾', n: 'Baby' + _mod + '5', f: 1, s: 'baby' }, { u: '1F476-1F3FF', e: '👶🏿', n: 'Baby' + _mod + '6', f: 1, s: 'baby' }, { u: '1F466', e: '👦', n: 'Boy', f: 1, s: 'boy' }, { u: '1F466-1F3FB', e: '👦🏻', n: 'Boy' + _mod + '1-2', f: 1, s: 'boy' }, { u: '1F466-1F3FC', e: '👦🏼', n: 'Boy' + _mod + '3', f: 1, s: 'boy' }, { u: '1F466-1F3FD', e: '👦🏽', n: 'Boy' + _mod + '4', f: 1, s: 'boy' }, { u: '1F466-1F3FE', e: '👦🏾', n: 'Boy' + _mod + '5', f: 1, s: 'boy' }, { u: '1F466-1F3FF', e: '👦🏿', n: 'Boy' + _mod + '6', f: 1, s: 'boy' }, { u: '1F467', e: '👧', n: 'Girl', f: 1, s: 'girl' }, { u: '1F467-1F3FB', e: '👧🏻', n: 'Girl' + _mod + '1-2', f: 1, s: 'girl' }, { u: '1F467-1F3FC', e: '👧🏼', n: 'Girl' + _mod + '3', f: 1, s: 'girl' }, { u: '1F467-1F3FD', e: '👧🏽', n: 'Girl' + _mod + '4', f: 1, s: 'girl' }, { u: '1F467-1F3FE', e: '👧🏾', n: 'Girl' + _mod + '5', f: 1, s: 'girl' }, { u: '1F467-1F3FF', e: '👧🏿', n: 'Girl' + _mod + '6', f: 1, s: 'girl' }, { u: '1F468', e: '👨', n: 'Man', f: 1, s: 'man' }, { u: '1F468-1F3FB', e: '👨🏻', n: 'Man' + _mod + '1-2', f: 1, s: 'man' }, { u: '1F468-1F3FC', e: '👨🏼', n: 'Man' + _mod + '3', f: 1, s: 'man' }, { u: '1F468-1F3FD', e: '👨🏽', n: 'Man' + _mod + '4', f: 1, s: 'man' }, { u: '1F468-1F3FE', e: '👨🏾', n: 'Man' + _mod + '5', f: 1, s: 'man' }, { u: '1F468-1F3FF', e: '👨🏿', n: 'Man' + _mod + '6', f: 1, s: 'man' }, { u: '1F469', e: '👩', n: 'Woman', f: 1, s: 'woman' }, { u: '1F469-1F3FB', e: '👩🏻', n: 'Woman' + _mod + '1-2', f: 1, s: 'woman' }, { u: '1F469-1F3FC', e: '👩🏼', n: 'Woman' + _mod + '3', f: 1, s: 'woman' }, { u: '1F469-1F3FD', e: '👩🏽', n: 'Woman' + _mod + '4', f: 1, s: 'woman' }, { u: '1F469-1F3FE', e: '👩🏾', n: 'Woman' + _mod + '5', f: 1, s: 'woman' }, { u: '1F469-1F3FF', e: '👩🏿', n: 'Woman' + _mod + '6', f: 1, s: 'woman' }, { u: '1F471-1F3FB', e: '👱🏻', n: 'Person With Blond Hair' + _mod + '1-2', f: 1, s: 'person_with_blond_hair' }, { u: '1F471', e: '👱', n: 'Person With Blond Hair', f: 1, s: 'person_with_blond_hair' }, { u: '1F471-1F3FC', e: '👱🏼', n: 'Person With Blond Hair' + _mod + '3', f: 1, s: 'person_with_blond_hair' }, { u: '1F471-1F3FD', e: '👱🏽', n: 'Person With Blond Hair' + _mod + '4', f: 1, s: 'person_with_blond_hair' }, { u: '1F471-1F3FE', e: '👱🏾', n: 'Person With Blond Hair' + _mod + '5', f: 1, s: 'person_with_blond_hair' }, { u: '1F471-1F3FF', e: '👱🏿', n: 'Person With Blond Hair' + _mod + '6', f: 1, s: 'person_with_blond_hair' }, { u: '1F474', e: '👴', n: 'Older Man', f: 1, s: 'older_man' }, { u: '1F474-1F3FB', e: '👴🏻', n: 'Older Man' + _mod + '1-2', f: 1, s: 'older_man' }, { u: '1F474-1F3FC', e: '👴🏼', n: 'Older Man' + _mod + '3', f: 1, s: 'older_man' }, { u: '1F474-1F3FD', e: '👴🏽', n: 'Older Man' + _mod + '4', f: 1, s: 'older_man' }, { u: '1F474-1F3FE', e: '👴🏾', n: 'Older Man' + _mod + '5', f: 1, s: 'older_man' }, { u: '1F474-1F3FF', e: '👴🏿', n: 'Older Man' + _mod + '6', f: 1, s: 'older_man' }, { u: '1F475', e: '👵', n: 'Older Woman', f: 1, s: 'older_woman' }, { u: '1F475-1F3FB', e: '👵🏻', n: 'Older Woman' + _mod + '1-2', f: 1, s: 'older_woman' }, { u: '1F475-1F3FC', e: '👵🏼', n: 'Older Woman' + _mod + '3', f: 1, s: 'older_woman' }, { u: '1F475-1F3FD', e: '👵🏽', n: 'Older Woman' + _mod + '4', f: 1, s: 'older_woman' }, { u: '1F475-1F3FE', e: '👵🏾', n: 'Older Woman' + _mod + '5', f: 1, s: 'older_woman' }, { u: '1F475-1F3FF', e: '👵🏿', n: 'Older Woman' + _mod + '6', f: 1, s: 'older_woman' }, { u: '1F472-1F3FB', e: '👲🏻', n: 'Man With Gua Pi Mao' + _mod + '1-2', f: 1, s: 'man_with_gua_pi_mao' }, { u: '1F472', e: '👲', n: 'Man With Gua Pi Mao', f: 1, s: 'man_with_gua_pi_mao' }, { u: '1F472-1F3FC', e: '👲🏼', n: 'Man With Gua Pi Mao' + _mod + '3', f: 1, s: 'man_with_gua_pi_mao' }, { u: '1F472-1F3FD', e: '👲🏽', n: 'Man With Gua Pi Mao' + _mod + '4', f: 1, s: 'man_with_gua_pi_mao' }, { u: '1F472-1F3FE', e: '👲🏾', n: 'Man With Gua Pi Mao' + _mod + '5', f: 1, s: 'man_with_gua_pi_mao' }, { u: '1F472-1F3FF', e: '👲🏿', n: 'Man With Gua Pi Mao' + _mod + '6', f: 1, s: 'man_with_gua_pi_mao' }, { u: '1F473-1F3FB', e: '👳🏻', n: 'Man With Turban' + _mod + '1-2', f: 1, s: 'man_with_turban' }, { u: '1F473', e: '👳', n: 'Man With Turban', f: 1, s: 'man_with_turban' }, { u: '1F473-1F3FC', e: '👳🏼', n: 'Man With Turban' + _mod + '3', f: 1, s: 'man_with_turban' }, { u: '1F473-1F3FD', e: '👳🏽', n: 'Man With Turban' + _mod + '4', f: 1, s: 'man_with_turban' }, { u: '1F473-1F3FE', e: '👳🏾', n: 'Man With Turban' + _mod + '5', f: 1, s: 'man_with_turban' }, { u: '1F473-1F3FF', e: '👳🏿', n: 'Man With Turban' + _mod + '6', f: 1, s: 'man_with_turban' }, { u: '1F46E', e: '👮', n: 'Police Officer', f: 1, s: 'cop' }, { u: '1F46E-1F3FB', e: '👮🏻', n: 'Police Officer' + _mod + '1-2', f: 1, s: 'cop' }, { u: '1F46E-1F3FC', e: '👮🏼', n: 'Police Officer' + _mod + '3', f: 1, s: 'cop' }, { u: '1F46E-1F3FD', e: '👮🏽', n: 'Police Officer' + _mod + '4', f: 1, s: 'cop' }, { u: '1F46E-1F3FE', e: '👮🏾', n: 'Police Officer' + _mod + '5', f: 1, s: 'cop' }, { u: '1F46E-1F3FF', e: '👮🏿', n: 'Police Officer' + _mod + '6', f: 1, s: 'cop' }, { u: '1F477', e: '👷', n: 'Construction Worker', f: 1, s: 'construction_worker' }, { u: '1F477-1F3FB', e: '👷🏻', n: 'Construction Worker' + _mod + '1-2', f: 1, s: 'construction_worker' }, { u: '1F477-1F3FC', e: '👷🏼', n: 'Construction Worker' + _mod + '3', f: 1, s: 'construction_worker' }, { u: '1F477-1F3FD', e: '👷🏽', n: 'Construction Worker' + _mod + '4', f: 1, s: 'construction_worker' }, { u: '1F477-1F3FE', e: '👷🏾', n: 'Construction Worker' + _mod + '5', f: 1, s: 'construction_worker' }, { u: '1F477-1F3FF', e: '👷🏿', n: 'Construction Worker' + _mod + '6', f: 1, s: 'construction_worker' }, { u: '1F482', e: '💂', n: 'Guardsman', f: 1, s: 'guardsman' }, { u: '1F482-1F3FB', e: '💂🏻', n: 'Guardsman' + _mod + '1-2', f: 1, s: 'guardsman' }, { u: '1F482-1F3FC', e: '💂🏼', n: 'Guardsman' + _mod + '3', f: 1, s: 'guardsman' }, { u: '1F482-1F3FD', e: '💂🏽', n: 'Guardsman' + _mod + '4', f: 1, s: 'guardsman' }, { u: '1F482-1F3FE', e: '💂🏾', n: 'Guardsman' + _mod + '5', f: 1, s: 'guardsman' }, { u: '1F482-1F3FF', e: '💂🏿', n: 'Guardsman' + _mod + '6', f: 1, s: 'guardsman' }, { u: '1F575', e: '🕵', n: 'Sleuth Or Spy', f: 1, s: 'spy' }, { u: '1F385', e: '🎅', n: 'Father Christmas', f: 1, s: 'santa' }, { u: '1F385-1F3FB', e: '🎅🏻', n: 'Father Christmas' + _mod + '1-2', f: 1, s: 'santa' }, { u: '1F385-1F3FC', e: '🎅🏼', n: 'Father Christmas' + _mod + '3', f: 1, s: 'santa' }, { u: '1F385-1F3FD', e: '🎅🏽', n: 'Father Christmas' + _mod + '4', f: 1, s: 'santa' }, { u: '1F385-1F3FE', e: '🎅🏾', n: 'Father Christmas' + _mod + '5', f: 1, s: 'santa' }, { u: '1F385-1F3FF', e: '🎅🏿', n: 'Father Christmas' + _mod + '6', f: 1, s: 'santa' }, { u: '1F47C', e: '👼', n: 'Baby Angel', f: 1, s: 'angel' }, { u: '1F47C-1F3FB', e: '👼🏻', n: 'Baby Angel' + _mod + '1-2', f: 1, s: 'angel' }, { u: '1F47C-1F3FC', e: '👼🏼', n: 'Baby Angel' + _mod + '3', f: 1, s: 'angel' }, { u: '1F47C-1F3FD', e: '👼🏽', n: 'Baby Angel' + _mod + '4', f: 1, s: 'angel' }, { u: '1F47C-1F3FE', e: '👼🏾', n: 'Baby Angel' + _mod + '5', f: 1, s: 'angel' }, { u: '1F47C-1F3FF', e: '👼🏿', n: 'Baby Angel' + _mod + '6', f: 1, s: 'angel' }, { u: '1F478', e: '👸', n: 'Princess', f: 1, s: 'princess' }, { u: '1F478-1F3FB', e: '👸🏻', n: 'Princess' + _mod + '1-2', f: 1, s: 'princess' }, { u: '1F478-1F3FC', e: '👸🏼', n: 'Princess' + _mod + '3', f: 1, s: 'princess' }, { u: '1F478-1F3FD', e: '👸🏽', n: 'Princess' + _mod + '4', f: 1, s: 'princess' }, { u: '1F478-1F3FE', e: '👸🏾', n: 'Princess' + _mod + '5', f: 1, s: 'princess' }, { u: '1F478-1F3FF', e: '👸🏿', n: 'Princess' + _mod + '6', f: 1, s: 'princess' }, { u: '1F470', e: '👰', n: 'Bride With Veil', f: 1, s: 'bride_with_veil' }, { u: '1F470-1F3FB', e: '👰🏻', n: 'Bride With Veil' + _mod + '1-2', f: 1, s: 'bride_with_veil' }, { u: '1F470-1F3FC', e: '👰🏼', n: 'Bride With Veil' + _mod + '3', f: 1, s: 'bride_with_veil' }, { u: '1F470-1F3FD', e: '👰🏽', n: 'Bride With Veil' + _mod + '4', f: 1, s: 'bride_with_veil' }, { u: '1F470-1F3FE', e: '👰🏾', n: 'Bride With Veil' + _mod + '5', f: 1, s: 'bride_with_veil' }, { u: '1F470-1F3FF', e: '👰🏿', n: 'Bride With Veil' + _mod + '6', f: 1, s: 'bride_with_veil' }, { u: '1F6B6', e: '🚶', n: 'Pedestrian', f: 1, s: 'walking' }, { u: '1F6B6-1F3FB', e: '🚶🏻', n: 'Pedestrian' + _mod + '1-2', f: 1, s: 'walking' }, { u: '1F6B6-1F3FC', e: '🚶🏼', n: 'Pedestrian' + _mod + '3', f: 1, s: 'walking' }, { u: '1F6B6-1F3FD', e: '🚶🏽', n: 'Pedestrian' + _mod + '4', f: 1, s: 'walking' }, { u: '1F6B6-1F3FE', e: '🚶🏾', n: 'Pedestrian' + _mod + '5', f: 1, s: 'walking' }, { u: '1F6B6-1F3FF', e: '🚶🏿', n: 'Pedestrian' + _mod + '6', f: 1, s: 'walking' }, { u: '1F3C3-1F3FB', e: '🏃🏻', n: 'Runner' + _mod + '1-2', f: 1, s: 'runner' }, { u: '1F3C3', e: '🏃', n: 'Runner', f: 1, s: 'runner' }, { u: '1F3C3-1F3FC', e: '🏃🏼', n: 'Runner' + _mod + '3', f: 1, s: 'runner' }, { u: '1F3C3-1F3FD', e: '🏃🏽', n: 'Runner' + _mod + '4', f: 1, s: 'runner' }, { u: '1F3C3-1F3FE', e: '🏃🏾', n: 'Runner' + _mod + '5', f: 1, s: 'runner' }, { u: '1F3C3-1F3FF', e: '🏃🏿', n: 'Runner' + _mod + '6', f: 1, s: 'runner' }, { u: '1F483', e: '💃', n: 'Dancer', f: 1, s: 'dancer' }, { u: '1F483-1F3FB', e: '💃🏻', n: 'Dancer' + _mod + '1-2', f: 1, s: 'dancer' }, { u: '1F483-1F3FC', e: '💃🏼', n: 'Dancer' + _mod + '3', f: 1, s: 'dancer' }, { u: '1F483-1F3FD', e: '💃🏽', n: 'Dancer' + _mod + '4', f: 1, s: 'dancer' }, { u: '1F483-1F3FE', e: '💃🏾', n: 'Dancer' + _mod + '5', f: 1, s: 'dancer' }, { u: '1F483-1F3FF', e: '💃🏿', n: 'Dancer' + _mod + '6', f: 1, s: 'dancer' }, { u: '1F46F', e: '👯', n: 'Woman With Bunny Ears', f: 1, s: 'dancers' }, { u: '1F46B', e: '👫', n: 'Man And Woman Holding Hands', f: 1, s: 'couple' }, { u: '1F46C', e: '👬', n: 'Two Men Holding Hands', f: 1, s: 'two_men_holding_hands' }, { u: '1F46D', e: '👭', n: 'Two Women Holding Hands', f: 1, s: 'two_women_holding_hands' }, { u: '1F647', e: '🙇', n: 'Person Bowing Deeply', f: 1, s: 'bow' }, { u: '1F647-1F3FB', e: '🙇🏻', n: 'Person Bowing Deeply' + _mod + '1-2', f: 1, s: 'bow' }, { u: '1F647-1F3FC', e: '🙇🏼', n: 'Person Bowing Deeply' + _mod + '3', f: 1, s: 'bow' }, { u: '1F647-1F3FD', e: '🙇🏽', n: 'Person Bowing Deeply' + _mod + '4', f: 1, s: 'bow' }, { u: '1F647-1F3FE', e: '🙇🏾', n: 'Person Bowing Deeply' + _mod + '5', f: 1, s: 'bow' }, { u: '1F647-1F3FF', e: '🙇🏿', n: 'Person Bowing Deeply' + _mod + '6', f: 1, s: 'bow' }, { u: '1F481', e: '💁', n: 'Information Desk Person', f: 1, s: 'information_desk_person' }, { u: '1F481-1F3FB', e: '💁🏻', n: 'Information Desk Person' + _mod + '1-2', f: 1, s: 'information_desk_person' }, { u: '1F481-1F3FC', e: '💁🏼', n: 'Information Desk Person' + _mod + '3', f: 1, s: 'information_desk_person' }, { u: '1F481-1F3FD', e: '💁🏽', n: 'Information Desk Person' + _mod + '4', f: 1, s: 'information_desk_person' }, { u: '1F481-1F3FE', e: '💁🏾', n: 'Information Desk Person' + _mod + '5', f: 1, s: 'information_desk_person' }, { u: '1F481-1F3FF', e: '💁🏿', n: 'Information Desk Person' + _mod + '6', f: 1, s: 'information_desk_person' }, { u: '1F645-1F3FB', e: '🙅🏻', n: 'Face With No Good Gesture' + _mod + '1-2', f: 1, s: 'no_good' }, { u: '1F645', e: '🙅', n: 'Face With No Good Gesture', f: 1, s: 'no_good' }, { u: '1F645-1F3FC', e: '🙅🏼', n: 'Face With No Good Gesture' + _mod + '3', f: 1, s: 'no_good' }, { u: '1F645-1F3FD', e: '🙅🏽', n: 'Face With No Good Gesture' + _mod + '4', f: 1, s: 'no_good' }, { u: '1F645-1F3FE', e: '🙅🏾', n: 'Face With No Good Gesture' + _mod + '5', f: 1, s: 'no_good' }, { u: '1F645-1F3FF', e: '🙅🏿', n: 'Face With No Good Gesture' + _mod + '6', f: 1, s: 'no_good' }, { u: '1F646', e: '🙆', n: 'Face With Ok Gesture', f: 1, s: 'ok_woman' }, { u: '1F646-1F3FB', e: '🙆🏻', n: 'Face With Ok Gesture' + _mod + '1-2', f: 1, s: 'ok_woman' }, { u: '1F646-1F3FC', e: '🙆🏼', n: 'Face With Ok Gesture' + _mod + '3', f: 1, s: 'ok_woman' }, { u: '1F646-1F3FD', e: '🙆🏽', n: 'Face With Ok Gesture' + _mod + '4', f: 1, s: 'ok_woman' }, { u: '1F646-1F3FE', e: '🙆🏾', n: 'Face With Ok Gesture' + _mod + '5', f: 1, s: 'ok_woman' }, { u: '1F646-1F3FF', e: '🙆🏿', n: 'Face With Ok Gesture' + _mod + '6', f: 1, s: 'ok_woman' }, { u: '1F64B-1F3FB', e: '🙋🏻', n: 'Happy Person Raising One Hand' + _mod + '1-2', f: 1, s: 'raising_hand' }, { u: '1F64B', e: '🙋', n: 'Happy Person Raising One Hand', f: 1, s: 'raising_hand' }, { u: '1F64B-1F3FC', e: '🙋🏼', n: 'Happy Person Raising One Hand' + _mod + '3', f: 1, s: 'raising_hand' }, { u: '1F64B-1F3FD', e: '🙋🏽', n: 'Happy Person Raising One Hand' + _mod + '4', f: 1, s: 'raising_hand' }, { u: '1F64B-1F3FE', e: '🙋🏾', n: 'Happy Person Raising One Hand' + _mod + '5', f: 1, s: 'raising_hand' }, { u: '1F64B-1F3FF', e: '🙋🏿', n: 'Happy Person Raising One Hand' + _mod + '6', f: 1, s: 'raising_hand' }, { u: '1F64E-1F3FB', e: '🙎🏻', n: 'Person With Pouting Face' + _mod + '1-2', f: 1, s: 'person_with_pouting_face' }, { u: '1F64E', e: '🙎', n: 'Person With Pouting Face', f: 1, s: 'person_with_pouting_face' }, { u: '1F64E-1F3FC', e: '🙎🏼', n: 'Person With Pouting Face' + _mod + '3', f: 1, s: 'person_with_pouting_face' }, { u: '1F64E-1F3FD', e: '🙎🏽', n: 'Person With Pouting Face' + _mod + '4', f: 1, s: 'person_with_pouting_face' }, { u: '1F64E-1F3FE', e: '🙎🏾', n: 'Person With Pouting Face' + _mod + '5', f: 1, s: 'person_with_pouting_face' }, { u: '1F64E-1F3FF', e: '🙎🏿', n: 'Person With Pouting Face' + _mod + '6', f: 1, s: 'person_with_pouting_face' }, { u: '1F64D-1F3FB', e: '🙍🏻', n: 'Person Frowning' + _mod + '1-2', f: 1, s: 'person_frowning' }, { u: '1F64D', e: '🙍', n: 'Person Frowning', f: 1, s: 'person_frowning' }, { u: '1F64D-1F3FC', e: '🙍🏼', n: 'Person Frowning' + _mod + '3', f: 1, s: 'person_frowning' }, { u: '1F64D-1F3FD', e: '🙍🏽', n: 'Person Frowning' + _mod + '4', f: 1, s: 'person_frowning' }, { u: '1F64D-1F3FE', e: '🙍🏾', n: 'Person Frowning' + _mod + '5', f: 1, s: 'person_frowning' }, { u: '1F64D-1F3FF', e: '🙍🏿', n: 'Person Frowning' + _mod + '6', f: 1, s: 'person_frowning' }, { u: '1F487', e: '💇', n: 'Haircut', f: 1, s: 'haircut' }, { u: '1F487-1F3FB', e: '💇🏻', n: 'Haircut' + _mod + '1-2', f: 1, s: 'haircut' }, { u: '1F487-1F3FC', e: '💇🏼', n: 'Haircut' + _mod + '3', f: 1, s: 'haircut' }, { u: '1F487-1F3FD', e: '💇🏽', n: 'Haircut' + _mod + '4', f: 1, s: 'haircut' }, { u: '1F487-1F3FE', e: '💇🏾', n: 'Haircut' + _mod + '5', f: 1, s: 'haircut' }, { u: '1F487-1F3FF', e: '💇🏿', n: 'Haircut' + _mod + '6', f: 1, s: 'haircut' }, { u: '1F486', e: '💆', n: 'Face Massage', f: 1, s: 'massage' }, { u: '1F486-1F3FB', e: '💆🏻', n: 'Face Massage' + _mod + '1-2', f: 1, s: 'massage' }, { u: '1F486-1F3FC', e: '💆🏼', n: 'Face Massage' + _mod + '3', f: 1, s: 'massage' }, { u: '1F486-1F3FD', e: '💆🏽', n: 'Face Massage' + _mod + '4', f: 1, s: 'massage' }, { u: '1F486-1F3FE', e: '💆🏾', n: 'Face Massage' + _mod + '5', f: 1, s: 'massage' }, { u: '1F486-1F3FF', e: '💆🏿', n: 'Face Massage' + _mod + '6', f: 1, s: 'massage' }, { u: '1F491', e: '💑', n: 'Couple With Heart', f: 1, s: 'couple_with_heart' }, { u: '1F469-2764-1F469', e: '👩‍❤️‍👩', n: 'Couple (Woman, Woman)', f: 1, s: 'couple_ww' }, { u: '1F468-2764-1F468', e: '👨‍❤️‍👨', n: 'Couple (Man, Man)', f: 1, s: 'couple_mm' }, { u: '1F48F', e: '💏', n: 'Kiss', f: 1, s: 'couplekiss' }, { u: '1F469-2764-1F48B-1F469', e: '👩‍❤️‍💋‍👩', n: 'Kiss (Woman, Woman)', f: 1, s: 'kiss_ww' }, { u: '1F468-2764-1F48B-1F468', e: '👨‍❤️‍💋‍👨', n: 'Kiss (Man, Man)', f: 1, s: 'kiss_mm' }, { u: '1F46A', e: '👪', n: 'Family', f: 1, s: 'family' }, { u: '1F468-1F469-1F467', e: '👨‍👩‍👧', n: 'Family (Man, Woman, Girl)', f: 1, s: 'family_mwg' }, { u: '1F468-1F469-1F467-1F466', e: '👨‍👩‍👧‍👦', n: 'Family (Man, Woman, Girl, Boy)', f: 1, s: 'family_mwgb' }, { u: '1F468-1F469-1F466-1F466', e: '👨‍👩‍👦‍👦', n: 'Family (Man, Woman, Boy, Boy)', f: 1, s: 'family_mwbb' }, { u: '1F468-1F469-1F467-1F467', e: '👨‍👩‍👧‍👧', n: 'Family (Man, Woman, Girl, Girl)', f: 1, s: 'family_mwgg' }, { u: '1F469-1F469-1F466', e: '👩‍👩‍👦', n: 'Family (Woman, Woman, Boy)', f: 1, s: 'family_wwb' }, { u: '1F469-1F469-1F467', e: '👩‍👩‍👧', n: 'Family (Woman, Woman, Girl)', f: 1, s: 'family_wwg' }, { u: '1F469-1F469-1F467-1F466', e: '👩‍👩‍👧‍👦', n: 'Family (Woman, Woman, Girl, Boy)', f: 1, s: 'family_wwgb' }, { u: '1F469-1F469-1F466-1F466', e: '👩‍👩‍👦‍👦', n: 'Family (Woman, Woman, Boy, Boy)', f: 1, s: 'family_wwbb' }, { u: '1F469-1F469-1F467-1F467', e: '👩‍👩‍👧‍👧', n: 'Family (Woman, Woman, Girl, Girl)', f: 1, s: 'family_wwgg' }, { u: '1F468-1F468-1F466', e: '👨‍👨‍👦', n: 'Family (Man, Man, Boy)', f: 1, s: 'family_mmb' }, { u: '1F468-1F468-1F467', e: '👨‍👨‍👧', n: 'Family (Man, Man, Girl)', f: 1, s: 'family_mmg' }, { u: '1F468-1F468-1F467-1F466', e: '👨‍👨‍👧‍👦', n: 'Family (Man, Man, Girl, Boy)', f: 1, s: 'family_mmgb' }, { u: '1F468-1F468-1F466-1F466', e: '👨‍👨‍👦‍👦', n: 'Family (Man, Man, Boy, Boy)', f: 1, s: 'family_mmbb' }, { u: '1F468-1F468-1F467-1F467', e: '👨‍👨‍👧‍👧', n: 'Family (Man, Man, Girl, Girl)', f: 1, s: 'family_mmgg' }, { u: '1F45A', e: '👚', n: 'Womans Clothes', f: 1, s: 'womans_clothes' }, { u: '1F455', e: '👕', n: 'T-shirt', f: 1, s: 'shirt' }, { u: '1F456', e: '👖', n: 'Jeans', f: 1, s: 'jeans' }, { u: '1F454', e: '👔', n: 'Necktie', f: 1, s: 'necktie' }, { u: '1F457', e: '👗', n: 'Dress', f: 1, s: 'dress' }, { u: '1F459', e: '👙', n: 'Bikini', f: 1, s: 'bikini' }, { u: '1F458', e: '👘', n: 'Kimono', f: 1, s: 'kimono' }, { u: '1F484', e: '💄', n: 'Lipstick', f: 1, s: 'lipstick' }, { u: '1F48B', e: '💋', n: 'Kiss Mark', f: 1, s: 'kiss' }, { u: '1F463', e: '👣', n: 'Footprints', f: 1, s: 'footprints' }, { u: '1F460', e: '👠', n: 'High-heeled Shoe', f: 1, s: 'high_heel' }, { u: '1F461', e: '👡', n: 'Womans Sandal', f: 1, s: 'sandal' }, { u: '1F462', e: '👢', n: 'Womans Boots', f: 1, s: 'boot' }, { u: '1F45E', e: '👞', n: 'Mans Shoe', f: 1, s: 'mans_shoe' }, { u: '1F45F', e: '👟', n: 'Athletic Shoe', f: 1, s: 'athletic_shoe' }, { u: '1F452', e: '👒', n: 'Womans Hat', f: 1, s: 'womans_hat' }, { u: '1F3A9', e: '🎩', n: 'Top Hat', f: 1, s: 'tophat' }, { u: '26D1', e: '⛑', n: 'Helmet With White Cross', f: 1 }, { u: '1F393', e: '🎓', n: 'Graduation Cap', f: 1, s: 'mortar_board' }, { u: '1F451', e: '👑', n: 'Crown', f: 1, s: 'crown' }, { u: '1F392', e: '🎒', n: 'School Satchel', f: 1, s: 'school_satchel' }, { u: '1F45D', e: '👝', n: 'Pouch', f: 1, s: 'pouch' }, { u: '1F45B', e: '👛', n: 'Purse', f: 1, s: 'purse' }, { u: '1F45C', e: '👜', n: 'Handbag', f: 1, s: 'handbag' }, { u: '1F4BC', e: '💼', n: 'Briefcase', f: 1, s: 'briefcase' }, { u: '1F453', e: '👓', n: 'Eyeglasses', f: 1, s: 'eyeglasses' }, { u: '1F576', e: '🕶', n: 'Dark Sunglasses', f: 1, s: 'dark_sunglasses' }, { u: '1F48D', e: '💍', n: 'Ring', f: 1, s: 'ring' }, { u: '1F302', e: '🌂', n: 'Closed Umbrella', f: 1, s: 'closed_umbrella' }, { u: '1F436', e: '🐶', n: 'Dog Face', f: 2, s: 'dog' }, { u: '1F431', e: '🐱', n: 'Cat Face', f: 2, s: 'cat' }, { u: '1F42D', e: '🐭', n: 'Mouse Face', f: 2, s: 'mouse' }, { u: '1F439', e: '🐹', n: 'Hamster Face', f: 2, s: 'hamster' }, { u: '1F430', e: '🐰', n: 'Rabbit Face', f: 2, s: 'rabbit' }, { u: '1F43B', e: '🐻', n: 'Bear Face', f: 2, s: 'bear' }, { u: '1F43C', e: '🐼', n: 'Panda Face', f: 2, s: 'panda_face' }, { u: '1F428', e: '🐨', n: 'Koala', f: 2, s: 'koala' }, { u: '1F42F', e: '🐯', n: 'Tiger Face', f: 2, s: 'tiger' }, { u: '1F981', e: '🦁', n: 'Lion Face', f: 2 }, { u: '1F42E', e: '🐮', n: 'Cow Face', f: 2, s: 'cow' }, { u: '1F437', e: '🐷', n: 'Pig Face', f: 2, s: 'pig' }, { u: '1F43D', e: '🐽', n: 'Pig Nose', f: 2, s: 'pig_nose' }, { u: '1F438', e: '🐸', n: 'Frog Face', f: 2, s: 'frog' }, { u: '1F419', e: '🐙', n: 'Octopus', f: 2, s: 'octopus' }, { u: '1F435', e: '🐵', n: 'Monkey Face', f: 2, s: 'monkey_face' }, { u: '1F648', e: '🙈', n: 'See-no-evil Monkey', f: 2, s: 'see_no_evil' }, { u: '1F649', e: '🙉', n: 'Hear-no-evil Monkey', f: 2, s: 'hear_no_evil' }, { u: '1F64A', e: '🙊', n: 'Speak-no-evil Monkey', f: 2, s: 'speak_no_evil' }, { u: '1F412', e: '🐒', n: 'Monkey', f: 2, s: 'monkey' }, { u: '1F414', e: '🐔', n: 'Chicken', f: 2, s: 'chicken' }, { u: '1F427', e: '🐧', n: 'Penguin', f: 2, s: 'penguin' }, { u: '1F426', e: '🐦', n: 'Bird', f: 2, s: 'bird' }, { u: '1F424', e: '🐤', n: 'Baby Chick', f: 2, s: 'baby_chick' }, { u: '1F423', e: '🐣', n: 'Hatching Chick', f: 2, s: 'hatching_chick' }, { u: '1F425', e: '🐥', n: 'Front-facing Baby Chick', f: 2, s: 'hatched_chick' }, { u: '1F43A', e: '🐺', n: 'Wolf Face', f: 2, s: 'wolf' }, { u: '1F417', e: '🐗', n: 'Boar', f: 2, s: 'boar' }, { u: '1F434', e: '🐴', n: 'Horse Face', f: 2, s: 'horse' }, { u: '1F984', e: '🦄', n: 'Unicorn Face', f: 2 }, { u: '1F41D', e: '🐝', n: 'Honeybee', f: 2, s: 'bee' }, { u: '1F41B', e: '🐛', n: 'Bug', f: 2, s: 'bug' }, { u: '1F40C', e: '🐌', n: 'Snail', f: 2, s: 'snail' }, { u: '1F41E', e: '🐞', n: 'Lady Beetle', f: 2, s: 'beetle' }, { u: '1F41C', e: '🐜', n: 'Ant', f: 2, s: 'ant' }, { u: '1F577', e: '🕷', n: 'Spider', f: 2, s: 'spider' }, { u: '1F982', e: '🦂', n: 'Scorpion', f: 2 }, { u: '1F980', e: '🦀', n: 'Crab', f: 2 }, { u: '1F40D', e: '🐍', n: 'Snake', f: 2, s: 'snake' }, { u: '1F422', e: '🐢', n: 'Turtle', f: 2, s: 'turtle' }, { u: '1F420', e: '🐠', n: 'Tropical Fish', f: 2, s: 'tropical_fish' }, { u: '1F41F', e: '🐟', n: 'Fish', f: 2, s: 'fish' }, { u: '1F421', e: '🐡', n: 'Blowfish', f: 2, s: 'blowfish' }, { u: '1F42C', e: '🐬', n: 'Dolphin', f: 2, s: 'dolphin' }, { u: '1F433', e: '🐳', n: 'Spouting Whale', f: 2, s: 'whale' }, { u: '1F40B', e: '🐋', n: 'Whale', f: 2, s: 'whale2' }, { u: '1F40A', e: '🐊', n: 'Crocodile', f: 2, s: 'crocodile' }, { u: '1F406', e: '🐆', n: 'Leopard', f: 2, s: 'leopard' }, { u: '1F405', e: '🐅', n: 'Tiger', f: 2, s: 'tiger2' }, { u: '1F403', e: '🐃', n: 'Water Buffalo', f: 2, s: 'water_buffalo' }, { u: '1F402', e: '🐂', n: 'Ox', f: 2, s: 'ox' }, { u: '1F404', e: '🐄', n: 'Cow', f: 2, s: 'cow2' }, { u: '1F42A', e: '🐪', n: 'Dromedary Camel', f: 2, s: 'dromedary_camel' }, { u: '1F42B', e: '🐫', n: 'Bactrian Camel', f: 2, s: 'camel' }, { u: '1F418', e: '🐘', n: 'Elephant', f: 2, s: 'elephant' }, { u: '1F410', e: '🐐', n: 'Goat', f: 2, s: 'goat' }, { u: '1F40F', e: '🐏', n: 'Ram', f: 2, s: 'ram' }, { u: '1F411', e: '🐑', n: 'Sheep', f: 2, s: 'sheep' }, { u: '1F40E', e: '🐎', n: 'Horse', f: 2, s: 'racehorse' }, { u: '1F416', e: '🐖', n: 'Pig', f: 2, s: 'pig2' }, { u: '1F400', e: '🐀', n: 'Rat', f: 2, s: 'rat' }, { u: '1F401', e: '🐁', n: 'Mouse', f: 2, s: 'mouse2' }, { u: '1F413', e: '🐓', n: 'Rooster', f: 2, s: 'rooster' }, { u: '1F983', e: '🦃', n: 'Turkey', f: 2 }, { u: '1F54A', e: '🕊', n: 'Dove Of Peace', f: 2, s: 'dove' }, { u: '1F415', e: '🐕', n: 'Dog', f: 2, s: 'dog2' }, { u: '1F429', e: '🐩', n: 'Poodle', f: 2, s: 'poodle' }, { u: '1F408', e: '🐈', n: 'Cat', f: 2, s: 'cat2' }, { u: '1F407', e: '🐇', n: 'Rabbit', f: 2, s: 'rabbit2' }, { u: '1F43F', e: '🐿', n: 'Chipmunk', f: 2, s: 'chipmunk' }, { u: '1F43E', e: '🐾', n: 'Paw Prints', f: 2, s: 'feet' }, { u: '1F409', e: '🐉', n: 'Dragon', f: 2, s: 'dragon' }, { u: '1F432', e: '🐲', n: 'Dragon Face', f: 2, s: 'dragon_face' }, { u: '1F335', e: '🌵', n: 'Cactus', f: 2, s: 'cactus' }, { u: '1F384', e: '🎄', n: 'Christmas Tree', f: 2, s: 'christmas_tree' }, { u: '1F332', e: '🌲', n: 'Evergreen Tree', f: 2, s: 'evergreen_tree' }, { u: '1F333', e: '🌳', n: 'Deciduous Tree', f: 2, s: 'deciduous_tree' }, { u: '1F334', e: '🌴', n: 'Palm Tree', f: 2, s: 'palm_tree' }, { u: '1F331', e: '🌱', n: 'Seedling', f: 2, s: 'seedling' }, { u: '1F33F', e: '🌿', n: 'Herb', f: 2, s: 'herb' }, { u: '2618', e: '☘', n: 'Shamrock', f: 2 }, { u: '1F340', e: '🍀', n: 'Four Leaf Clover', f: 2, s: 'four_leaf_clover' }, { u: '1F38D', e: '🎍', n: 'Pine Decoration', f: 2, s: 'bamboo' }, { u: '1F38B', e: '🎋', n: 'Tanabata Tree', f: 2, s: 'tanabata_tree' }, { u: '1F343', e: '🍃', n: 'Leaf Fluttering In Wind', f: 2, s: 'leaves' }, { u: '1F342', e: '🍂', n: 'Fallen Leaf', f: 2, s: 'fallen_leaf' }, { u: '1F341', e: '🍁', n: 'Maple Leaf', f: 2, s: 'maple_leaf' }, { u: '1F33E', e: '🌾', n: 'Ear Of Rice', f: 2, s: 'ear_of_rice' }, { u: '1F33A', e: '🌺', n: 'Hibiscus', f: 2, s: 'hibiscus' }, { u: '1F33B', e: '🌻', n: 'Sunflower', f: 2, s: 'sunflower' }, { u: '1F339', e: '🌹', n: 'Rose', f: 2, s: 'rose' }, { u: '1F337', e: '🌷', n: 'Tulip', f: 2, s: 'tulip' }, { u: '1F33C', e: '🌼', n: 'Blossom', f: 2, s: 'blossom' }, { u: '1F338', e: '🌸', n: 'Cherry Blossom', f: 2, s: 'cherry_blossom' }, { u: '1F490', e: '💐', n: 'Bouquet', f: 2, s: 'bouquet' }, { u: '1F344', e: '🍄', n: 'Mushroom', f: 2, s: 'mushroom' }, { u: '1F330', e: '🌰', n: 'Chestnut', f: 2, s: 'chestnut' }, { u: '1F383', e: '🎃', n: 'Jack-o-lantern', f: 2, s: 'jack_o_lantern' }, { u: '1F41A', e: '🐚', n: 'Spiral Shell', f: 2, s: 'shell' }, { u: '1F578', e: '🕸', n: 'Spider Web', f: 2, s: 'spider_web' }, { u: '1F30E', e: '🌎', n: 'Earth Globe Americas', f: 2, s: 'earth_americas' }, { u: '1F30D', e: '🌍', n: 'Earth Globe Europe-africa', f: 2, s: 'earth_africa' }, { u: '1F30F', e: '🌏', n: 'Earth Globe Asia-australia', f: 2, s: 'earth_asia' }, { u: '1F315', e: '🌕', n: 'Full Moon Symbol', f: 2, s: 'full_moon' }, { u: '1F316', e: '🌖', n: 'Waning Gibbous Moon Symbol', f: 2, s: 'waning_gibbous_moon' }, { u: '1F317', e: '🌗', n: 'Last Quarter Moon Symbol', f: 2, s: 'last_quarter_moon' }, { u: '1F318', e: '🌘', n: 'Waning Crescent Moon Symbol', f: 2, s: 'waning_crescent_moon' }, { u: '1F311', e: '🌑', n: 'New Moon Symbol', f: 2, s: 'new_moon' }, { u: '1F312', e: '🌒', n: 'Waxing Crescent Moon Symbol', f: 2, s: 'waxing_crescent_moon' }, { u: '1F313', e: '🌓', n: 'First Quarter Moon Symbol', f: 2, s: 'first_quarter_moon' }, { u: '1F314', e: '🌔', n: 'Waxing Gibbous Moon Symbol', f: 2, s: 'waxing_gibbous_moon' }, { u: '1F31A', e: '🌚', n: 'New Moon With Face', f: 2, s: 'new_moon_with_face' }, { u: '1F31D', e: '🌝', n: 'Full Moon With Face', f: 2, s: 'full_moon_with_face' }, { u: '1F31B', e: '🌛', n: 'First Quarter Moon With Face', f: 2, s: 'first_quarter_moon_with_face' }, { u: '1F31C', e: '🌜', n: 'Last Quarter Moon With Face', f: 2, s: 'last_quarter_moon_with_face' }, { u: '1F31E', e: '🌞', n: 'Sun With Face', f: 2, s: 'sun_with_face' }, { u: '1F319', e: '🌙', n: 'Crescent Moon', f: 2, s: 'crescent_moon' }, { u: '2B50', e: '⭐️', n: 'White Medium Star', f: 2, s: 'star' }, { u: '1F31F', e: '🌟', n: 'Glowing Star', f: 2, s: 'star2' }, { u: '1F4AB', e: '💫', n: 'Dizzy Symbol', f: 2, s: 'dizzy' }, { u: '2728', e: '✨', n: 'Sparkles', f: 2, s: 'sparkles' }, { u: '2604', e: '☄', n: 'Comet', f: 2 }, { u: '2600', e: '☀️', n: 'Black Sun With Rays', f: 2, s: 'sunny' }, { u: '1F324', e: '🌤', n: 'White Sun With Small Cloud', f: 2 }, { u: '26C5', e: '⛅️', n: 'Sun Behind Cloud', f: 2, s: 'partly_sunny' }, { u: '1F325', e: '🌥', n: 'White Sun Behind Cloud', f: 2 }, { u: '1F326', e: '🌦', n: 'White Sun Behind Cloud With Rain', f: 2 }, { u: '2601', e: '☁️', n: 'Cloud', f: 2, s: 'cloud' }, { u: '1F327', e: '🌧', n: 'Cloud With Rain', f: 2, s: 'cloud_rain' }, { u: '26C8', e: '⛈', n: 'Thunder Cloud And Rain', f: 2 }, { u: '1F329', e: '🌩', n: 'Cloud With Lightning', f: 2, s: 'cloud_lightning' }, { u: '26A1', e: '⚡️', n: 'High Voltage Sign', f: 2, s: 'zap' }, { u: '1F525', e: '🔥', n: 'Fire', f: 2, s: 'fire' }, { u: '1F4A5', e: '💥', n: 'Collision Symbol', f: 2, s: 'boom' }, { u: '2744', e: '❄️', n: 'Snowflake', f: 2, s: 'snowflake' }, { u: '1F328', e: '🌨', n: 'Cloud With Snow', f: 2, s: 'cloud_snow' }, { u: '2603', e: '☃️', n: 'Snowman', f: 2 }, { u: '26C4', e: '⛄️', n: 'Snowman Without Snow', f: 2, s: 'snowman' }, { u: '1F32C', e: '🌬', n: 'Wind Blowing Face', f: 2, s: 'wind_blowing_face' }, { u: '1F4A8', e: '💨', n: 'Dash Symbol', f: 2, s: 'dash' }, { u: '1F32A', e: '🌪', n: 'Cloud With Tornado', f: 2, s: 'cloud_tornado' }, { u: '1F32B', e: '🌫', n: 'Fog', f: 2, s: 'fog' }, { u: '2602', e: '☂️', n: 'Umbrella', f: 2 }, { u: '2614', e: '☔️', n: 'Umbrella With Rain Drops', f: 2, s: 'umbrella' }, { u: '1F4A7', e: '💧', n: 'Droplet', f: 2, s: 'droplet' }, { u: '1F4A6', e: '💦', n: 'Splashing Sweat Symbol', f: 2, s: 'sweat_drops' }, { u: '1F30A', e: '🌊', n: 'Water Wave', f: 2, s: 'ocean' }, { u: '1F34F', e: '🍏', n: 'Green Apple', f: 3, s: 'green_apple' }, { u: '1F34E', e: '🍎', n: 'Red Apple', f: 3, s: 'apple' }, { u: '1F350', e: '🍐', n: 'Pear', f: 3, s: 'pear' }, { u: '1F34A', e: '🍊', n: 'Tangerine', f: 3, s: 'tangerine' }, { u: '1F34B', e: '🍋', n: 'Lemon', f: 3, s: 'lemon' }, { u: '1F34C', e: '🍌', n: 'Banana', f: 3, s: 'banana' }, { u: '1F349', e: '🍉', n: 'Watermelon', f: 3, s: 'watermelon' }, { u: '1F347', e: '🍇', n: 'Grapes', f: 3, s: 'grapes' }, { u: '1F353', e: '🍓', n: 'Strawberry', f: 3, s: 'strawberry' }, { u: '1F348', e: '🍈', n: 'Melon', f: 3, s: 'melon' }, { u: '1F352', e: '🍒', n: 'Cherries', f: 3, s: 'cherries' }, { u: '1F351', e: '🍑', n: 'Peach', f: 3, s: 'peach' }, { u: '1F34D', e: '🍍', n: 'Pineapple', f: 3, s: 'pineapple' }, { u: '1F345', e: '🍅', n: 'Tomato', f: 3, s: 'tomato' }, { u: '1F346', e: '🍆', n: 'Aubergine', f: 3, s: 'eggplant' }, { u: '1F336', e: '🌶', n: 'Hot Pepper', f: 3, s: 'hot_pepper' }, { u: '1F33D', e: '🌽', n: 'Ear Of Maize', f: 3, s: 'corn' }, { u: '1F360', e: '🍠', n: 'Roasted Sweet Potato', f: 3, s: 'sweet_potato' }, { u: '1F36F', e: '🍯', n: 'Honey Pot', f: 3, s: 'honey_pot' }, { u: '1F35E', e: '🍞', n: 'Bread', f: 3, s: 'bread' }, { u: '1F9C0', e: '🧀', n: 'Cheese Wedge', f: 3 }, { u: '1F357', e: '🍗', n: 'Poultry Leg', f: 3, s: 'poultry_leg' }, { u: '1F356', e: '🍖', n: 'Meat On Bone', f: 3, s: 'meat_on_bone' }, { u: '1F364', e: '🍤', n: 'Fried Shrimp', f: 3, s: 'fried_shrimp' }, { u: '1F373', e: '🍳', n: 'Cooking', f: 3, s: 'egg' }, { u: '1F354', e: '🍔', n: 'Hamburger', f: 3, s: 'hamburger' }, { u: '1F35F', e: '🍟', n: 'French Fries', f: 3, s: 'fries' }, { u: '1F32D', e: '🌭', n: 'Hot Dog', f: 3 }, { u: '1F355', e: '🍕', n: 'Slice Of Pizza', f: 3, s: 'pizza' }, { u: '1F35D', e: '🍝', n: 'Spaghetti', f: 3, s: 'spaghetti' }, { u: '1F32E', e: '🌮', n: 'Taco', f: 3 }, { u: '1F32F', e: '🌯', n: 'Burrito', f: 3 }, { u: '1F35C', e: '🍜', n: 'Steaming Bowl', f: 3, s: 'ramen' }, { u: '1F372', e: '🍲', n: 'Pot Of Food', f: 3, s: 'stew' }, { u: '1F365', e: '🍥', n: 'Fish Cake With Swirl Design', f: 3, s: 'fish_cake' }, { u: '1F363', e: '🍣', n: 'Sushi', f: 3, s: 'sushi' }, { u: '1F371', e: '🍱', n: 'Bento Box', f: 3, s: 'bento' }, { u: '1F35B', e: '🍛', n: 'Curry And Rice', f: 3, s: 'curry' }, { u: '1F359', e: '🍙', n: 'Rice Ball', f: 3, s: 'rice_ball' }, { u: '1F35A', e: '🍚', n: 'Cooked Rice', f: 3, s: 'rice' }, { u: '1F358', e: '🍘', n: 'Rice Cracker', f: 3, s: 'rice_cracker' }, { u: '1F362', e: '🍢', n: 'Oden', f: 3, s: 'oden' }, { u: '1F361', e: '🍡', n: 'Dango', f: 3, s: 'dango' }, { u: '1F367', e: '🍧', n: 'Shaved Ice', f: 3, s: 'shaved_ice' }, { u: '1F368', e: '🍨', n: 'Ice Cream', f: 3, s: 'ice_cream' }, { u: '1F366', e: '🍦', n: 'Soft Ice Cream', f: 3, s: 'icecream' }, { u: '1F370', e: '🍰', n: 'Shortcake', f: 3, s: 'cake' }, { u: '1F382', e: '🎂', n: 'Birthday Cake', f: 3, s: 'birthday' }, { u: '1F36E', e: '🍮', n: 'Custard', f: 3, s: 'custard' }, { u: '1F36C', e: '🍬', n: 'Candy', f: 3, s: 'candy' }, { u: '1F36D', e: '🍭', n: 'Lollipop', f: 3, s: 'lollipop' }, { u: '1F36B', e: '🍫', n: 'Chocolate Bar', f: 3, s: 'chocolate_bar' }, { u: '1F37F', e: '🍿', n: 'Popcorn', f: 3 }, { u: '1F369', e: '🍩', n: 'Doughnut', f: 3, s: 'doughnut' }, { u: '1F36A', e: '🍪', n: 'Cookie', f: 3, s: 'cookie' }, { u: '1F37A', e: '🍺', n: 'Beer Mug', f: 3, s: 'beer' }, { u: '1F37B', e: '🍻', n: 'Clinking Beer Mugs', f: 3, s: 'beers' }, { u: '1F377', e: '🍷', n: 'Wine Glass', f: 3, s: 'wine_glass' }, { u: '1F378', e: '🍸', n: 'Cocktail Glass', f: 3, s: 'cocktail' }, { u: '1F379', e: '🍹', n: 'Tropical Drink', f: 3, s: 'tropical_drink' }, { u: '1F37E', e: '🍾', n: 'Bottle With Popping Cork', f: 3 }, { u: '1F376', e: '🍶', n: 'Sake Bottle And Cup', f: 3, s: 'sake' }, { u: '1F375', e: '🍵', n: 'Teacup Without Handle', f: 3, s: 'tea' }, { u: '2615', e: '☕️', n: 'Hot Beverage', f: 3, s: 'coffee' }, { u: '1F37C', e: '🍼', n: 'Baby Bottle', f: 3, s: 'baby_bottle' }, { u: '1F374', e: '🍴', n: 'Fork And Knife', f: 3, s: 'fork_and_knife' }, { u: '1F37D', e: '🍽', n: 'Fork And Knife With Plate', f: 3, s: 'fork_knife_plate' }, { u: '26BD', e: '⚽️', n: 'Soccer Ball', f: 4, s: 'soccer' }, { u: '1F3C0', e: '🏀', n: 'Basketball And Hoop', f: 4, s: 'basketball' }, { u: '1F3C8', e: '🏈', n: 'American Football', f: 4, s: 'football' }, { u: '26BE', e: '⚾️', n: 'Baseball', f: 4, s: 'baseball' }, { u: '1F3BE', e: '🎾', n: 'Tennis Racquet And Ball', f: 4, s: 'tennis' }, { u: '1F3D0', e: '🏐', n: 'Volleyball', f: 4 }, { u: '1F3C9', e: '🏉', n: 'Rugby Football', f: 4, s: 'rugby_football' }, { u: '1F3B1', e: '🎱', n: 'Billiards', f: 4, s: '8ball' }, { u: '26F3', e: '⛳️', n: 'Flag In Hole', f: 4, s: 'golf' }, { u: '1F3CC', e: '🏌', n: 'Golfer', f: 4, s: 'golfer' }, { u: '1F3D3', e: '🏓', n: 'Table Tennis Paddle And Ball', f: 4 }, { u: '1F3F8', e: '🏸', n: 'Badminton Racquet And Shuttlecock', f: 4 }, { u: '1F3D2', e: '🏒', n: 'Ice Hockey Stick And Puck', f: 4 }, { u: '1F3D1', e: '🏑', n: 'Field Hockey Stick And Ball', f: 4 }, { u: '1F3CF', e: '🏏', n: 'Cricket Bat And Ball', f: 4 }, { u: '1F3BF', e: '🎿', n: 'Ski And Ski Boot', f: 4, s: 'ski' }, { u: '26F7', e: '⛷', n: 'Skier', f: 4 }, { u: '1F3C2', e: '🏂', n: 'Snowboarder', f: 4, s: 'snowboarder' }, { u: '26F8', e: '⛸', n: 'Ice Skate', f: 4 }, { u: '1F3F9', e: '🏹', n: 'Bow And Arrow', f: 4 }, { u: '1F3A3', e: '🎣', n: 'Fishing Pole And Fish', f: 4, s: 'fishing_pole_and_fish' }, { u: '1F6A3', e: '🚣', n: 'Rowboat', f: 4, s: 'rowboat' }, { u: '1F6A3-1F3FB', e: '🚣🏻', n: 'Rowboat' + _mod + '1-2', f: 4, s: 'rowboat' }, { u: '1F6A3-1F3FC', e: '🚣🏼', n: 'Rowboat' + _mod + '3', f: 4, s: 'rowboat' }, { u: '1F6A3-1F3FD', e: '🚣🏽', n: 'Rowboat' + _mod + '4', f: 4, s: 'rowboat' }, { u: '1F6A3-1F3FE', e: '🚣🏾', n: 'Rowboat' + _mod + '5', f: 4, s: 'rowboat' }, { u: '1F6A3-1F3FF', e: '🚣🏿', n: 'Rowboat' + _mod + '6', f: 4, s: 'rowboat' }, { u: '1F3CA', e: '🏊', n: 'Swimmer', f: 4, s: 'swimmer' }, { u: '1F3CA-1F3FB', e: '🏊🏻', n: 'Swimmer' + _mod + '1-2', f: 4, s: 'swimmer' }, { u: '1F3CA-1F3FC', e: '🏊🏼', n: 'Swimmer' + _mod + '3', f: 4, s: 'swimmer' }, { u: '1F3CA-1F3FD', e: '🏊🏽', n: 'Swimmer' + _mod + '4', f: 4, s: 'swimmer' }, { u: '1F3CA-1F3FE', e: '🏊🏾', n: 'Swimmer' + _mod + '5', f: 4, s: 'swimmer' }, { u: '1F3CA-1F3FF', e: '🏊🏿', n: 'Swimmer' + _mod + '6', f: 4, s: 'swimmer' }, { u: '1F3C4-1F3FB', e: '🏄🏻', n: 'Surfer' + _mod + '1-2', f: 4, s: 'surfer' }, { u: '1F3C4', e: '🏄', n: 'Surfer', f: 4, s: 'surfer' }, { u: '1F3C4-1F3FC', e: '🏄🏼', n: 'Surfer' + _mod + '3', f: 4, s: 'surfer' }, { u: '1F3C4-1F3FD', e: '🏄🏽', n: 'Surfer' + _mod + '4', f: 4, s: 'surfer' }, { u: '1F3C4-1F3FE', e: '🏄🏾', n: 'Surfer' + _mod + '5', f: 4, s: 'surfer' }, { u: '1F3C4-1F3FF', e: '🏄🏿', n: 'Surfer' + _mod + '6', f: 4, s: 'surfer' }, { u: '1F6C0', e: '🛀', n: 'Bath', f: 4, s: 'bath' }, { u: '1F6C0-1F3FB', e: '🛀🏻', n: 'Bath' + _mod + '1-2', f: 4, s: 'bath' }, { u: '1F6C0-1F3FC', e: '🛀🏼', n: 'Bath' + _mod + '3', f: 4, s: 'bath' }, { u: '1F6C0-1F3FD', e: '🛀🏽', n: 'Bath' + _mod + '4', f: 4, s: 'bath' }, { u: '1F6C0-1F3FE', e: '🛀🏾', n: 'Bath' + _mod + '5', f: 4, s: 'bath' }, { u: '1F6C0-1F3FF', e: '🛀🏿', n: 'Bath' + _mod + '6', f: 4, s: 'bath' }, { u: '26F9', e: '⛹', n: 'Person With Ball', f: 4 }, { u: '26F9-1F3FB', e: '⛹🏻', n: 'Person With Ball' + _mod + '1-2', f: 4 }, { u: '26F9-1F3FC', e: '⛹🏼', n: 'Person With Ball' + _mod + '3', f: 4 }, { u: '26F9-1F3FD', e: '⛹🏽', n: 'Person With Ball' + _mod + '4', f: 4 }, { u: '26F9-1F3FE', e: '⛹🏾', n: 'Person With Ball' + _mod + '5', f: 4 }, { u: '26F9-1F3FF', e: '⛹🏿', n: 'Person With Ball' + _mod + '6', f: 4 }, { u: '1F3CB', e: '🏋', n: 'Weight Lifter', f: 4, s: 'lifter' }, { u: '1F3CB-1F3FB', e: '🏋🏻', n: 'Weight Lifter' + _mod + '1-2', f: 4, s: 'lifter' }, { u: '1F3CB-1F3FC', e: '🏋🏼', n: 'Weight Lifter' + _mod + '3', f: 4, s: 'lifter' }, { u: '1F3CB-1F3FD', e: '🏋🏽', n: 'Weight Lifter' + _mod + '4', f: 4, s: 'lifter' }, { u: '1F3CB-1F3FE', e: '🏋🏾', n: 'Weight Lifter' + _mod + '5', f: 4, s: 'lifter' }, { u: '1F3CB-1F3FF', e: '🏋🏿', n: 'Weight Lifter' + _mod + '6', f: 4, s: 'lifter' }, { u: '1F6B4-1F3FB', e: '🚴🏻', n: 'Bicyclist' + _mod + '1-2', f: 4, s: 'bicyclist' }, { u: '1F6B4', e: '🚴', n: 'Bicyclist', f: 4, s: 'bicyclist' }, { u: '1F6B4-1F3FC', e: '🚴🏼', n: 'Bicyclist' + _mod + '3', f: 4, s: 'bicyclist' }, { u: '1F6B4-1F3FD', e: '🚴🏽', n: 'Bicyclist' + _mod + '4', f: 4, s: 'bicyclist' }, { u: '1F6B4-1F3FE', e: '🚴🏾', n: 'Bicyclist' + _mod + '5', f: 4, s: 'bicyclist' }, { u: '1F6B4-1F3FF', e: '🚴🏿', n: 'Bicyclist' + _mod + '6', f: 4, s: 'bicyclist' }, { u: '1F6B5-1F3FB', e: '🚵🏻', n: 'Mountain Bicyclist' + _mod + '1-2', f: 4, s: 'mountain_bicyclist' }, { u: '1F6B5', e: '🚵', n: 'Mountain Bicyclist', f: 4, s: 'mountain_bicyclist' }, { u: '1F6B5-1F3FC', e: '🚵🏼', n: 'Mountain Bicyclist' + _mod + '3', f: 4, s: 'mountain_bicyclist' }, { u: '1F6B5-1F3FD', e: '🚵🏽', n: 'Mountain Bicyclist' + _mod + '4', f: 4, s: 'mountain_bicyclist' }, { u: '1F6B5-1F3FE', e: '🚵🏾', n: 'Mountain Bicyclist' + _mod + '5', f: 4, s: 'mountain_bicyclist' }, { u: '1F6B5-1F3FF', e: '🚵🏿', n: 'Mountain Bicyclist' + _mod + '6', f: 4, s: 'mountain_bicyclist' }, { u: '1F3C7-1F3FB', e: '🏇🏻', n: 'Horse Racing' + _mod + '1-2', f: 4, s: 'horse_racing' }, { u: '1F3C7', e: '🏇', n: 'Horse Racing', f: 4, s: 'horse_racing' }, { u: '1F3C7-1F3FC', e: '🏇🏼', n: 'Horse Racing' + _mod + '3', f: 4, s: 'horse_racing' }, { u: '1F3C7-1F3FD', e: '🏇🏽', n: 'Horse Racing' + _mod + '4', f: 4, s: 'horse_racing' }, { u: '1F3C7-1F3FE', e: '🏇🏾', n: 'Horse Racing' + _mod + '5', f: 4, s: 'horse_racing' }, { u: '1F3C7-1F3FF', e: '🏇🏿', n: 'Horse Racing' + _mod + '6', f: 4, s: 'horse_racing' }, { u: '1F574', e: '🕴', n: 'Man In Business Suit Levitating', f: 4, s: 'levitate' }, { u: '1F3C6', e: '🏆', n: 'Trophy', f: 4, s: 'trophy' }, { u: '1F3BD', e: '🎽', n: 'Running Shirt With Sash', f: 4, s: 'running_shirt_with_sash' }, { u: '1F3C5', e: '🏅', n: 'Sports Medal', f: 4, s: 'medal' }, { u: '1F396', e: '🎖', n: 'Military Medal', f: 4, s: 'military_medal' }, { u: '1F397', e: '🎗', n: 'Reminder Ribbon', f: 4, s: 'reminder_ribbon' }, { u: '1F3F5', e: '🏵', n: 'Rosette', f: 4, s: 'rosette' }, { u: '1F3AB', e: '🎫', n: 'Ticket', f: 4, s: 'ticket' }, { u: '1F39F', e: '🎟', n: 'Admission Tickets', f: 4, s: 'tickets' }, { u: '1F3AD', e: '🎭', n: 'Performing Arts', f: 4, s: 'performing_arts' }, { u: '1F3A8', e: '🎨', n: 'Artist Palette', f: 4, s: 'art' }, { u: '1F3AA', e: '🎪', n: 'Circus Tent', f: 4, s: 'circus_tent' }, { u: '1F3A4', e: '🎤', n: 'Microphone', f: 4, s: 'microphone' }, { u: '1F3A7', e: '🎧', n: 'Headphone', f: 4, s: 'headphones' }, { u: '1F3BC', e: '🎼', n: 'Musical Score', f: 4, s: 'musical_score' }, { u: '1F3B9', e: '🎹', n: 'Musical Keyboard', f: 4, s: 'musical_keyboard' }, { u: '1F3B7', e: '🎷', n: 'Saxophone', f: 4, s: 'saxophone' }, { u: '1F3BA', e: '🎺', n: 'Trumpet', f: 4, s: 'trumpet' }, { u: '1F3B8', e: '🎸', n: 'Guitar', f: 4, s: 'guitar' }, { u: '1F3BB', e: '🎻', n: 'Violin', f: 4, s: 'violin' }, { u: '1F3AC', e: '🎬', n: 'Clapper Board', f: 4, s: 'clapper' }, { u: '1F3AE', e: '🎮', n: 'Video Game', f: 4, s: 'video_game' }, { u: '1F47E', e: '👾', n: 'Alien Monster', f: 4, s: 'space_invader' }, { u: '1F3AF', e: '🎯', n: 'Direct Hit', f: 4, s: 'dart' }, { u: '1F3B2', e: '🎲', n: 'Game Die', f: 4, s: 'game_die' }, { u: '1F3B0', e: '🎰', n: 'Slot Machine', f: 4, s: 'slot_machine' }, { u: '1F3B3', e: '🎳', n: 'Bowling', f: 4, s: 'bowling' }, { u: '1F697', e: '🚗', n: 'Automobile', f: 5, s: 'red_car' }, { u: '1F695', e: '🚕', n: 'Taxi', f: 5, s: 'taxi' }, { u: '1F699', e: '🚙', n: 'Recreational Vehicle', f: 5, s: 'blue_car' }, { u: '1F68C', e: '🚌', n: 'Bus', f: 5, s: 'bus' }, { u: '1F68E', e: '🚎', n: 'Trolleybus', f: 5, s: 'trolleybus' }, { u: '1F3CE', e: '🏎', n: 'Racing Car', f: 5, s: 'race_car' }, { u: '1F693', e: '🚓', n: 'Police Car', f: 5, s: 'police_car' }, { u: '1F691', e: '🚑', n: 'Ambulance', f: 5, s: 'ambulance' }, { u: '1F692', e: '🚒', n: 'Fire Engine', f: 5, s: 'fire_engine' }, { u: '1F690', e: '🚐', n: 'Minibus', f: 5, s: 'minibus' }, { u: '1F69A', e: '🚚', n: 'Delivery Truck', f: 5, s: 'truck' }, { u: '1F69B', e: '🚛', n: 'Articulated Lorry', f: 5, s: 'articulated_lorry' }, { u: '1F69C', e: '🚜', n: 'Tractor', f: 5, s: 'tractor' }, { u: '1F3CD', e: '🏍', n: 'Racing Motorcycle', f: 5, s: 'motorcycle' }, { u: '1F6B2', e: '🚲', n: 'Bicycle', f: 5, s: 'bike' }, { u: '1F6A8', e: '🚨', n: 'Police Cars Revolving Light', f: 5, s: 'rotating_light' }, { u: '1F694', e: '🚔', n: 'Oncoming Police Car', f: 5, s: 'oncoming_police_car' }, { u: '1F68D', e: '🚍', n: 'Oncoming Bus', f: 5, s: 'oncoming_bus' }, { u: '1F698', e: '🚘', n: 'Oncoming Automobile', f: 5, s: 'oncoming_automobile' }, { u: '1F696', e: '🚖', n: 'Oncoming Taxi', f: 5, s: 'oncoming_taxi' }, { u: '1F6A1', e: '🚡', n: 'Aerial Tramway', f: 5, s: 'aerial_tramway' }, { u: '1F6A0', e: '🚠', n: 'Mountain Cableway', f: 5, s: 'mountain_cableway' }, { u: '1F69F', e: '🚟', n: 'Suspension Railway', f: 5, s: 'suspension_railway' }, { u: '1F683', e: '🚃', n: 'Railway Car', f: 5, s: 'railway_car' }, { u: '1F68B', e: '🚋', n: 'Tram Car', f: 5, s: 'train' }, { u: '1F69D', e: '🚝', n: 'Monorail', f: 5, s: 'monorail' }, { u: '1F684', e: '🚄', n: 'High-speed Train', f: 5, s: 'bullettrain_side' }, { u: '1F685', e: '🚅', n: 'High-speed Train With Bullet Nose', f: 5, s: 'bullettrain_front' }, { u: '1F688', e: '🚈', n: 'Light Rail', f: 5, s: 'light_rail' }, { u: '1F69E', e: '🚞', n: 'Mountain Railway', f: 5, s: 'mountain_railway' }, { u: '1F682', e: '🚂', n: 'Steam Locomotive', f: 5, s: 'steam_locomotive' }, { u: '1F686', e: '🚆', n: 'Train', f: 5, s: 'train2' }, { u: '1F687', e: '🚇', n: 'Metro', f: 5, s: 'metro' }, { u: '1F68A', e: '🚊', n: 'Tram', f: 5, s: 'tram' }, { u: '1F689', e: '🚉', n: 'Station', f: 5, s: 'station' }, { u: '1F681', e: '🚁', n: 'Helicopter', f: 5, s: 'helicopter' }, { u: '1F6E9', e: '🛩', n: 'Small Airplane', f: 5, s: 'airplane_small' }, { u: '2708', e: '✈️', n: 'Airplane', f: 5, s: 'airplane' }, { u: '1F6EB', e: '🛫', n: 'Airplane Departure', f: 5, s: 'airplane_departure' }, { u: '1F6EC', e: '🛬', n: 'Airplane Arriving', f: 5, s: 'airplane_arriving' }, { u: '26F5', e: '⛵️', n: 'Sailboat', f: 5, s: 'sailboat' }, { u: '1F6E5', e: '🛥', n: 'Motor Boat', f: 5, s: 'motorboat' }, { u: '1F6A4', e: '🚤', n: 'Speedboat', f: 5, s: 'speedboat' }, { u: '26F4', e: '⛴', n: 'Ferry', f: 5 }, { u: '1F6F3', e: '🛳', n: 'Passenger Ship', f: 5, s: 'cruise_ship' }, { u: '1F680', e: '🚀', n: 'Rocket', f: 5, s: 'rocket' }, { u: '1F6F0', e: '🛰', n: 'Satellite', f: 5, s: 'satellite_orbital' }, { u: '1F4BA', e: '💺', n: 'Seat', f: 5, s: 'seat' }, { u: '2693', e: '⚓️', n: 'Anchor', f: 5, s: 'anchor' }, { u: '1F6A7', e: '🚧', n: 'Construction Sign', f: 5, s: 'construction' }, { u: '26FD', e: '⛽️', n: 'Fuel Pump', f: 5, s: 'fuelpump' }, { u: '1F68F', e: '🚏', n: 'Bus Stop', f: 5, s: 'busstop' }, { u: '1F6A6', e: '🚦', n: 'Vertical Traffic Light', f: 5, s: 'vertical_traffic_light' }, { u: '1F6A5', e: '🚥', n: 'Horizontal Traffic Light', f: 5, s: 'traffic_light' }, { u: '1F3C1', e: '🏁', n: 'Chequered Flag', f: 5, s: 'checkered_flag' }, { u: '1F6A2', e: '🚢', n: 'Ship', f: 5, s: 'ship' }, { u: '1F3A1', e: '🎡', n: 'Ferris Wheel', f: 5, s: 'ferris_wheel' }, { u: '1F3A2', e: '🎢', n: 'Roller Coaster', f: 5, s: 'roller_coaster' }, { u: '1F3A0', e: '🎠', n: 'Carousel Horse', f: 5, s: 'carousel_horse' }, { u: '1F3D7', e: '🏗', n: 'Building Construction', f: 5, s: 'contruction_site' }, { u: '1F301', e: '🌁', n: 'Foggy', f: 5, s: 'foggy' }, { u: '1F5FC', e: '🗼', n: 'Tokyo Tower', f: 5, s: 'tokyo_tower' }, { u: '1F3ED', e: '🏭', n: 'Factory', f: 5, s: 'factory' }, { u: '26F2', e: '⛲️', n: 'Fountain', f: 5, s: 'fountain' }, { u: '1F391', e: '🎑', n: 'Moon Viewing Ceremony', f: 5, s: 'rice_scene' }, { u: '26F0', e: '⛰', n: 'Mountain', f: 5 }, { u: '1F3D4', e: '🏔', n: 'Snow Capped Mountain', f: 5, s: 'mountain_snow' }, { u: '1F5FB', e: '🗻', n: 'Mount Fuji', f: 5, s: 'mount_fuji' }, { u: '1F30B', e: '🌋', n: 'Volcano', f: 5, s: 'volcano' }, { u: '1F5FE', e: '🗾', n: 'Silhouette Of Japan', f: 5, s: 'japan' }, { u: '1F3D5', e: '🏕', n: 'Camping', f: 5, s: 'camping' }, { u: '26FA', e: '⛺️', n: 'Tent', f: 5, s: 'tent' }, { u: '1F3DE', e: '🏞', n: 'National Park', f: 5, s: 'park' }, { u: '1F6E3', e: '🛣', n: 'Motorway', f: 5, s: 'motorway' }, { u: '1F6E4', e: '🛤', n: 'Railway Track', f: 5, s: 'railway_track' }, { u: '1F305', e: '🌅', n: 'Sunrise', f: 5, s: 'sunrise' }, { u: '1F304', e: '🌄', n: 'Sunrise Over Mountains', f: 5, s: 'sunrise_over_mountains' }, { u: '1F3DC', e: '🏜', n: 'Desert', f: 5, s: 'desert' }, { u: '1F3D6', e: '🏖', n: 'Beach With Umbrella', f: 5, s: 'beach' }, { u: '1F3DD', e: '🏝', n: 'Desert Island', f: 5, s: 'island' }, { u: '1F307', e: '🌇', n: 'Sunset Over Buildings', f: 5, s: 'city_sunset' }, { u: '1F306', e: '🌆', n: 'Cityscape At Dusk', f: 5, s: 'city_dusk' }, { u: '1F3D9', e: '🏙', n: 'Cityscape', f: 5, s: 'cityscape' }, { u: '1F303', e: '🌃', n: 'Night With Stars', f: 5, s: 'night_with_stars' }, { u: '1F309', e: '🌉', n: 'Bridge At Night', f: 5, s: 'bridge_at_night' }, { u: '1F30C', e: '🌌', n: 'Milky Way', f: 5, s: 'milky_way' }, { u: '1F320', e: '🌠', n: 'Shooting Star', f: 5, s: 'stars' }, { u: '1F387', e: '🎇', n: 'Firework Sparkler', f: 5, s: 'sparkler' }, { u: '1F386', e: '🎆', n: 'Fireworks', f: 5, s: 'fireworks' }, { u: '1F308', e: '🌈', n: 'Rainbow', f: 5, s: 'rainbow' }, { u: '1F3D8', e: '🏘', n: 'House Buildings', f: 5, s: 'homes' }, { u: '1F3F0', e: '🏰', n: 'European Castle', f: 5, s: 'european_castle' }, { u: '1F3EF', e: '🏯', n: 'Japanese Castle', f: 5, s: 'japanese_castle' }, { u: '1F3DF', e: '🏟', n: 'Stadium', f: 5, s: 'stadium' }, { u: '1F5FD', e: '🗽', n: 'Statue Of Liberty', f: 5, s: 'statue_of_liberty' }, { u: '1F3E0', e: '🏠', n: 'House Building', f: 5, s: 'house' }, { u: '1F3E1', e: '🏡', n: 'House With Garden', f: 5, s: 'house_with_garden' }, { u: '1F3DA', e: '🏚', n: 'Derelict House Building', f: 5, s: 'house_abandoned' }, { u: '1F3E2', e: '🏢', n: 'Office Building', f: 5, s: 'office' }, { u: '1F3EC', e: '🏬', n: 'Department Store', f: 5, s: 'department_store' }, { u: '1F3E3', e: '🏣', n: 'Japanese Post Office', f: 5, s: 'post_office' }, { u: '1F3E4', e: '🏤', n: 'European Post Office', f: 5, s: 'european_post_office' }, { u: '1F3E5', e: '🏥', n: 'Hospital', f: 5, s: 'hospital' }, { u: '1F3E6', e: '🏦', n: 'Bank', f: 5, s: 'bank' }, { u: '1F3E8', e: '🏨', n: 'Hotel', f: 5, s: 'hotel' }, { u: '1F3EA', e: '🏪', n: 'Convenience Store', f: 5, s: 'convenience_store' }, { u: '1F3EB', e: '🏫', n: 'School', f: 5, s: 'school' }, { u: '1F3E9', e: '🏩', n: 'Love Hotel', f: 5, s: 'love_hotel' }, { u: '1F492', e: '💒', n: 'Wedding', f: 5, s: 'wedding' }, { u: '1F3DB', e: '🏛', n: 'Classical Building', f: 5, s: 'classical_building' }, { u: '26EA', e: '⛪️', n: 'Church', f: 5, s: 'church' }, { u: '1F54C', e: '🕌', n: 'Mosque', f: 5 }, { u: '1F54D', e: '🕍', n: 'Synagogue', f: 5 }, { u: '1F54B', e: '🕋', n: 'Kaaba', f: 5 }, { u: '26E9', e: '⛩', n: 'Shinto Shrine', f: 5 }, { u: '231A', e: '⌚️', n: 'Watch', f: 6, s: 'watch' }, { u: '1F4F1', e: '📱', n: 'Mobile Phone', f: 6, s: 'iphone' }, { u: '1F4F2', e: '📲', n: 'Mobile Phone With Rightwards Arrow At Left', f: 6, s: 'calling' }, { u: '1F4BB', e: '💻', n: 'Personal Computer', f: 6, s: 'computer' }, { u: '2328', e: '⌨', n: 'Keyboard', f: 6 }, { u: '1F5A5', e: '🖥', n: 'Desktop Computer', f: 6, s: 'desktop' }, { u: '1F5A8', e: '🖨', n: 'Printer', f: 6, s: 'printer' }, { u: '1F5B1', e: '🖱', n: 'Three Button Mouse', f: 6 }, { u: '1F5B2', e: '🖲', n: 'Trackball', f: 6, s: 'trackball' }, { u: '1F579', e: '🕹', n: 'Joystick', f: 6, s: 'joystick' }, { u: '1F5DC', e: '🗜', n: 'Compression', f: 6, s: 'compression' }, { u: '1F4BD', e: '💽', n: 'Minidisc', f: 6, s: 'minidisc' }, { u: '1F4BE', e: '💾', n: 'Floppy Disk', f: 6, s: 'floppy_disk' }, { u: '1F4BF', e: '💿', n: 'Optical Disc', f: 6, s: 'cd' }, { u: '1F4C0', e: '📀', n: 'Dvd', f: 6, s: 'dvd' }, { u: '1F4FC', e: '📼', n: 'Videocassette', f: 6, s: 'vhs' }, { u: '1F4F7', e: '📷', n: 'Camera', f: 6, s: 'camera' }, { u: '1F4F8', e: '📸', n: 'Camera With Flash', f: 6, s: 'camera_with_flash' }, { u: '1F4F9', e: '📹', n: 'Video Camera', f: 6, s: 'video_camera' }, { u: '1F3A5', e: '🎥', n: 'Movie Camera', f: 6, s: 'movie_camera' }, { u: '1F4FD', e: '📽', n: 'Film Projector', f: 6, s: 'projector' }, { u: '1F39E', e: '🎞', n: 'Film Frames', f: 6, s: 'film_frames' }, { u: '1F4DE', e: '📞', n: 'Telephone Receiver', f: 6, s: 'telephone_receiver' }, { u: '260E', e: '☎️', n: 'Black Telephone', f: 6, s: 'telephone' }, { u: '1F4DF', e: '📟', n: 'Pager', f: 6, s: 'pager' }, { u: '1F4E0', e: '📠', n: 'Fax Machine', f: 6, s: 'fax' }, { u: '1F4FA', e: '📺', n: 'Television', f: 6, s: 'tv' }, { u: '1F4FB', e: '📻', n: 'Radio', f: 6, s: 'radio' }, { u: '1F399', e: '🎙', n: 'Studio Microphone', f: 6, s: 'microphone2' }, { u: '1F39A', e: '🎚', n: 'Level Slider', f: 6, s: 'level_slider' }, { u: '1F39B', e: '🎛', n: 'Control Knobs', f: 6, s: 'control_knobs' }, { u: '23F1', e: '⏱', n: 'Stopwatch', f: 6 }, { u: '23F2', e: '⏲', n: 'Timer Clock', f: 6 }, { u: '23F0', e: '⏰', n: 'Alarm Clock', f: 6, s: 'alarm_clock' }, { u: '1F570', e: '🕰', n: 'Mantelpiece Clock', f: 6, s: 'clock' }, { u: '23F3', e: '⏳', n: 'Hourglass With Flowing Sand', f: 6, s: 'hourglass_flowing_sand' }, { u: '231B', e: '⌛️', n: 'Hourglass', f: 6, s: 'hourglass' }, { u: '1F4E1', e: '📡', n: 'Satellite Antenna', f: 6, s: 'satellite' }, { u: '1F50B', e: '🔋', n: 'Battery', f: 6, s: 'battery' }, { u: '1F50C', e: '🔌', n: 'Electric Plug', f: 6, s: 'electric_plug' }, { u: '1F4A1', e: '💡', n: 'Electric Light Bulb', f: 6, s: 'bulb' }, { u: '1F526', e: '🔦', n: 'Electric Torch', f: 6, s: 'flashlight' }, { u: '1F56F', e: '🕯', n: 'Candle', f: 6, s: 'candle' }, { u: '1F5D1', e: '🗑', n: 'Wastebasket', f: 6, s: 'wastebasket' }, { u: '1F6E2', e: '🛢', n: 'Oil Drum', f: 6, s: 'oil' }, { u: '1F4B8', e: '💸', n: 'Money With Wings', f: 6, s: 'money_with_wings' }, { u: '1F4B5', e: '💵', n: 'Banknote With Dollar Sign', f: 6, s: 'dollar' }, { u: '1F4B4', e: '💴', n: 'Banknote With Yen Sign', f: 6, s: 'yen' }, { u: '1F4B6', e: '💶', n: 'Banknote With Euro Sign', f: 6, s: 'euro' }, { u: '1F4B7', e: '💷', n: 'Banknote With Pound Sign', f: 6, s: 'pound' }, { u: '1F4B0', e: '💰', n: 'Money Bag', f: 6, s: 'moneybag' }, { u: '1F4B3', e: '💳', n: 'Credit Card', f: 6, s: 'credit_card' }, { u: '1F48E', e: '💎', n: 'Gem Stone', f: 6, s: 'gem' }, { u: '2696', e: '⚖', n: 'Scales', f: 6 }, { u: '1F527', e: '🔧', n: 'Wrench', f: 6, s: 'wrench' }, { u: '1F528', e: '🔨', n: 'Hammer', f: 6, s: 'hammer' }, { u: '2692', e: '⚒', n: 'Hammer And Pick', f: 6 }, { u: '1F6E0', e: '🛠', n: 'Hammer And Wrench', f: 6, s: 'tools' }, { u: '26CF', e: '⛏', n: 'Pick', f: 6 }, { u: '1F529', e: '🔩', n: 'Nut And Bolt', f: 6, s: 'nut_and_bolt' }, { u: '2699', e: '⚙', n: 'Gear', f: 6 }, { u: '26D3', e: '⛓', n: 'Chains', f: 6 }, { u: '1F52B', e: '🔫', n: 'Pistol', f: 6, s: 'gun' }, { u: '1F4A3', e: '💣', n: 'Bomb', f: 6, s: 'bomb' }, { u: '1F52A', e: '🔪', n: 'Hocho', f: 6, s: 'knife' }, { u: '1F5E1', e: '🗡', n: 'Dagger Knife', f: 6, s: 'dagger' }, { u: '2694', e: '⚔', n: 'Crossed Swords', f: 6 }, { u: '1F6E1', e: '🛡', n: 'Shield', f: 6, s: 'shield' }, { u: '1F6AC', e: '🚬', n: 'Smoking Symbol', f: 6, s: 'smoking' }, { u: '2620', e: '☠', n: 'Skull And Crossbones', f: 6 }, { u: '26B0', e: '⚰', n: 'Coffin', f: 6 }, { u: '26B1', e: '⚱', n: 'Funeral Urn', f: 6 }, { u: '1F3FA', e: '🏺', n: 'Amphora', f: 6 }, { u: '1F52E', e: '🔮', n: 'Crystal Ball', f: 6, s: 'crystal_ball' }, { u: '1F4FF', e: '📿', n: 'Prayer Beads', f: 6 }, { u: '1F488', e: '💈', n: 'Barber Pole', f: 6, s: 'barber' }, { u: '2697', e: '⚗', n: 'Alembic', f: 6 }, { u: '1F52D', e: '🔭', n: 'Telescope', f: 6, s: 'telescope' }, { u: '1F52C', e: '🔬', n: 'Microscope', f: 6, s: 'microscope' }, { u: '1F573', e: '🕳', n: 'Hole', f: 6, s: 'hole' }, { u: '1F48A', e: '💊', n: 'Pill', f: 6, s: 'pill' }, { u: '1F489', e: '💉', n: 'Syringe', f: 6, s: 'syringe' }, { u: '1F321', e: '🌡', n: 'Thermometer', f: 6, s: 'thermometer' }, { u: '1F3F7', e: '🏷', n: 'Label', f: 6, s: 'label' }, { u: '1F516', e: '🔖', n: 'Bookmark', f: 6, s: 'bookmark' }, { u: '1F6BD', e: '🚽', n: 'Toilet', f: 6, s: 'toilet' }, { u: '1F6BF', e: '🚿', n: 'Shower', f: 6, s: 'shower' }, { u: '1F6C1', e: '🛁', n: 'Bathtub', f: 6, s: 'bathtub' }, { u: '1F511', e: '🔑', n: 'Key', f: 6, s: 'key' }, { u: '1F5DD', e: '🗝', n: 'Old Key', f: 6, s: 'key2' }, { u: '1F6CB', e: '🛋', n: 'Couch And Lamp', f: 6, s: 'couch' }, { u: '1F6CC', e: '🛌', n: 'Sleeping Accommodation', f: 6, s: 'sleeping_accommodation' }, { u: '1F6CF', e: '🛏', n: 'Bed', f: 6, s: 'bed' }, { u: '1F6AA', e: '🚪', n: 'Door', f: 6, s: 'door' }, { u: '1F6CE', e: '🛎', n: 'Bellhop Bell', f: 6, s: 'bellhop' }, { u: '1F5BC', e: '🖼', n: 'Frame With Picture', f: 6, s: 'frame_photo' }, { u: '1F5FA', e: '🗺', n: 'World Map', f: 6, s: 'map' }, { u: '26F1', e: '⛱', n: 'Umbrella On Ground', f: 6 }, { u: '1F5FF', e: '🗿', n: 'Moyai', f: 6, s: 'moyai' }, { u: '1F6CD', e: '🛍', n: 'Shopping Bags', f: 6, s: 'shopping_bags' }, { u: '1F388', e: '🎈', n: 'Balloon', f: 6, s: 'balloon' }, { u: '1F38F', e: '🎏', n: 'Carp Streamer', f: 6, s: 'flags' }, { u: '1F380', e: '🎀', n: 'Ribbon', f: 6, s: 'ribbon' }, { u: '1F381', e: '🎁', n: 'Wrapped Present', f: 6, s: 'gift' }, { u: '1F38A', e: '🎊', n: 'Confetti Ball', f: 6, s: 'confetti_ball' }, { u: '1F389', e: '🎉', n: 'Party Popper', f: 6, s: 'tada' }, { u: '1F38E', e: '🎎', n: 'Japanese Dolls', f: 6, s: 'dolls' }, { u: '1F390', e: '🎐', n: 'Wind Chime', f: 6, s: 'wind_chime' }, { u: '1F38C', e: '🎌', n: 'Crossed Flags', f: 6, s: 'crossed_flags' }, { u: '1F3EE', e: '🏮', n: 'Izakaya Lantern', f: 6, s: 'izakaya_lantern' }, { u: '2709', e: '✉️', n: 'Envelope', f: 6, s: 'envelope' }, { u: '1F4E9', e: '📩', n: 'Envelope With Downwards Arrow Above', f: 6, s: 'envelope_with_arrow' }, { u: '1F4E8', e: '📨', n: 'Incoming Envelope', f: 6, s: 'incoming_envelope' }, { u: '1F4E7', e: '📧', n: 'E-mail Symbol', f: 6, s: 'e-mail' }, { u: '1F48C', e: '💌', n: 'Love Letter', f: 6, s: 'love_letter' }, { u: '1F4EE', e: '📮', n: 'Postbox', f: 6, s: 'postbox' }, { u: '1F4EA', e: '📪', n: 'Closed Mailbox With Lowered Flag', f: 6, s: 'mailbox_closed' }, { u: '1F4EB', e: '📫', n: 'Closed Mailbox With Raised Flag', f: 6, s: 'mailbox' }, { u: '1F4EC', e: '📬', n: 'Open Mailbox With Raised Flag', f: 6, s: 'mailbox_with_mail' }, { u: '1F4ED', e: '📭', n: 'Open Mailbox With Lowered Flag', f: 6, s: 'mailbox_with_no_mail' }, { u: '1F4E6', e: '📦', n: 'Package', f: 6, s: 'package' }, { u: '1F4EF', e: '📯', n: 'Postal Horn', f: 6, s: 'postal_horn' }, { u: '1F4E5', e: '📥', n: 'Inbox Tray', f: 6, s: 'inbox_tray' }, { u: '1F4E4', e: '📤', n: 'Outbox Tray', f: 6, s: 'outbox_tray' }, { u: '1F4DC', e: '📜', n: 'Scroll', f: 6, s: 'scroll' }, { u: '1F4C3', e: '📃', n: 'Page With Curl', f: 6, s: 'page_with_curl' }, { u: '1F4D1', e: '📑', n: 'Bookmark Tabs', f: 6, s: 'bookmark_tabs' }, { u: '1F4CA', e: '📊', n: 'Bar Chart', f: 6, s: 'bar_chart' }, { u: '1F4C8', e: '📈', n: 'Chart With Upwards Trend', f: 6, s: 'chart_with_upwards_trend' }, { u: '1F4C9', e: '📉', n: 'Chart With Downwards Trend', f: 6, s: 'chart_with_downwards_trend' }, { u: '1F4C4', e: '📄', n: 'Page Facing Up', f: 6, s: 'page_facing_up' }, { u: '1F4C5', e: '📅', n: 'Calendar', f: 6, s: 'date' }, { u: '1F4C6', e: '📆', n: 'Tear-off Calendar', f: 6, s: 'calendar' }, { u: '1F5D3', e: '🗓', n: 'Spiral Calendar Pad', f: 6, s: 'calendar_spiral' }, { u: '1F4C7', e: '📇', n: 'Card Index', f: 6, s: 'card_index' }, { u: '1F5C3', e: '🗃', n: 'Card File Box', f: 6, s: 'card_box' }, { u: '1F5F3', e: '🗳', n: 'Ballot Box With Ballot', f: 6, s: 'ballot_box' }, { u: '1F5C4', e: '🗄', n: 'File Cabinet', f: 6, s: 'file_cabinet' }, { u: '1F4CB', e: '📋', n: 'Clipboard', f: 6, s: 'clipboard' }, { u: '1F5D2', e: '🗒', n: 'Spiral Note Pad', f: 6, s: 'notepad_spiral' }, { u: '1F4C1', e: '📁', n: 'File Folder', f: 6, s: 'file_folder' }, { u: '1F4C2', e: '📂', n: 'Open File Folder', f: 6, s: 'open_file_folder' }, { u: '1F5C2', e: '🗂', n: 'Card Index Dividers', f: 6, s: 'dividers' }, { u: '1F5DE', e: '🗞', n: 'Rolled-up Newspaper', f: 6, s: 'newspaper2' }, { u: '1F4F0', e: '📰', n: 'Newspaper', f: 6, s: 'newspaper' }, { u: '1F4D3', e: '📓', n: 'Notebook', f: 6, s: 'notebook' }, { u: '1F4D5', e: '📕', n: 'Closed Book', f: 6, s: 'closed_book' }, { u: '1F4D7', e: '📗', n: 'Green Book', f: 6, s: 'green_book' }, { u: '1F4D8', e: '📘', n: 'Blue Book', f: 6, s: 'blue_book' }, { u: '1F4D9', e: '📙', n: 'Orange Book', f: 6, s: 'orange_book' }, { u: '1F4D4', e: '📔', n: 'Notebook With Decorative Cover', f: 6, s: 'notebook_with_decorative_cover' }, { u: '1F4D2', e: '📒', n: 'Ledger', f: 6, s: 'ledger' }, { u: '1F4DA', e: '📚', n: 'Books', f: 6, s: 'books' }, { u: '1F4D6', e: '📖', n: 'Open Book', f: 6, s: 'book' }, { u: '1F517', e: '🔗', n: 'Link Symbol', f: 6, s: 'link' }, { u: '1F4CE', e: '📎', n: 'Paperclip', f: 6, s: 'paperclip' }, { u: '1F587', e: '🖇', n: 'Linked Paperclips', f: 6, s: 'paperclips' }, { u: '2702', e: '✂️', n: 'Black Scissors', f: 6, s: 'scissors' }, { u: '1F4D0', e: '📐', n: 'Triangular Ruler', f: 6, s: 'triangular_ruler' }, { u: '1F4CF', e: '📏', n: 'Straight Ruler', f: 6, s: 'straight_ruler' }, { u: '1F4CC', e: '📌', n: 'Pushpin', f: 6, s: 'pushpin' }, { u: '1F4CD', e: '📍', n: 'Round Pushpin', f: 6, s: 'round_pushpin' }, { u: '1F6A9', e: '🚩', n: 'Triangular Flag On Post', f: 6, s: 'triangular_flag_on_post' }, { u: '1F3F3', e: '🏳', n: 'Waving White Flag', f: 6, s: 'flag_white' }, { u: '1F3F4', e: '🏴', n: 'Waving Black Flag', f: 6, s: 'flag_black' }, { u: '1F510', e: '🔐', n: 'Closed Lock With Key', f: 6, s: 'closed_lock_with_key' }, { u: '1F512', e: '🔒', n: 'Lock', f: 6, s: 'lock' }, { u: '1F513', e: '🔓', n: 'Open Lock', f: 6, s: 'unlock' }, { u: '1F50F', e: '🔏', n: 'Lock With Ink Pen', f: 6, s: 'lock_with_ink_pen' }, { u: '1F58A', e: '🖊', n: 'Lower Left Ballpoint Pen', f: 6, s: 'pen_ballpoint' }, { u: '1F58B', e: '🖋', n: 'Lower Left Fountain Pen', f: 6, s: 'pen_fountain' }, { u: '2712', e: '✒️', n: 'Black Nib', f: 6, s: 'black_nib' }, { u: '1F4DD', e: '📝', n: 'Memo', f: 6, s: 'pencil' }, { u: '270F', e: '✏️', n: 'Pencil', f: 6, s: 'pencil2' }, { u: '1F58D', e: '🖍', n: 'Lower Left Crayon', f: 6, s: 'crayon' }, { u: '1F58C', e: '🖌', n: 'Lower Left Paintbrush', f: 6, s: 'paintbrush' }, { u: '1F50D', e: '🔍', n: 'Left-pointing Magnifying Glass', f: 6, s: 'mag' }, { u: '1F50E', e: '🔎', n: 'Right-pointing Magnifying Glass', f: 6, s: 'mag_right' }, { u: '2764', e: '❤️', n: 'Heavy Black Heart', f: 7, s: 'heart' }, { u: '1F49B', e: '💛', n: 'Yellow Heart', f: 7, s: 'yellow_heart' }, { u: '1F49A', e: '💚', n: 'Green Heart', f: 7, s: 'green_heart' }, { u: '1F499', e: '💙', n: 'Blue Heart', f: 7, s: 'blue_heart' }, { u: '1F49C', e: '💜', n: 'Purple Heart', f: 7, s: 'purple_heart' }, { u: '1F494', e: '💔', n: 'Broken Heart', f: 7, s: 'broken_heart' }, { u: '2763', e: '❣️', n: 'Heavy Heart Exclamation Mark Ornament', f: 7 }, { u: '1F495', e: '💕', n: 'Two Hearts', f: 7, s: 'two_hearts' }, { u: '1F49E', e: '💞', n: 'Revolving Hearts', f: 7, s: 'revolving_hearts' }, { u: '1F493', e: '💓', n: 'Beating Heart', f: 7, s: 'heartbeat' }, { u: '1F497', e: '💗', n: 'Growing Heart', f: 7, s: 'heartpulse' }, { u: '1F496', e: '💖', n: 'Sparkling Heart', f: 7, s: 'sparkling_heart' }, { u: '1F498', e: '💘', n: 'Heart With Arrow', f: 7, s: 'cupid' }, { u: '1F49D', e: '💝', n: 'Heart With Ribbon', f: 7, s: 'gift_heart' }, { u: '1F49F', e: '💟', n: 'Heart Decoration', f: 7, s: 'heart_decoration' }, { u: '262E', e: '☮', n: 'Peace Symbol', f: 7 }, { u: '271D', e: '✝️', n: 'Latin Cross', f: 7 }, { u: '262A', e: '☪', n: 'Star And Crescent', f: 7 }, { u: '1F549', e: '🕉', n: 'Om Symbol', f: 7, s: 'om_symbol' }, { u: '2638', e: '☸', n: 'Wheel Of Dharma', f: 7 }, { u: '2721', e: '✡️', n: 'Star Of David', f: 7 }, { u: '1F52F', e: '🔯', n: 'Six Pointed Star With Middle Dot', f: 7, s: 'six_pointed_star' }, { u: '1F54E', e: '🕎', n: 'Menorah With Nine Branches', f: 7 }, { u: '262F', e: '☯️', n: 'Yin Yang', f: 7 }, { u: '2626', e: '☦', n: 'Orthodox Cross', f: 7 }, { u: '1F6D0', e: '🛐', n: 'Place Of Worship', f: 7 }, { u: '26CE', e: '⛎', n: 'Ophiuchus', f: 7, s: 'ophiuchus' }, { u: '2648', e: '♈️', n: 'Aries', f: 7, s: 'aries' }, { u: '2649', e: '♉️', n: 'Taurus', f: 7, s: 'taurus' }, { u: '264A', e: '♊️', n: 'Gemini', f: 7, s: 'gemini' }, { u: '264B', e: '♋️', n: 'Cancer', f: 7, s: 'cancer' }, { u: '264C', e: '♌️', n: 'Leo', f: 7, s: 'leo' }, { u: '264D', e: '♍️', n: 'Virgo', f: 7, s: 'virgo' }, { u: '264E', e: '♎️', n: 'Libra', f: 7, s: 'libra' }, { u: '264F', e: '♏️', n: 'Scorpius', f: 7, s: 'scorpius' }, { u: '2650', e: '♐️', n: 'Sagittarius', f: 7, s: 'sagittarius' }, { u: '2651', e: '♑️', n: 'Capricorn', f: 7, s: 'capricorn' }, { u: '2652', e: '♒️', n: 'Aquarius', f: 7, s: 'aquarius' }, { u: '2653', e: '♓️', n: 'Pisces', f: 7, s: 'pisces' }, { u: '1F194', e: '🆔', n: 'Squared Id', f: 7, s: 'id' }, { u: '269B', e: '⚛', n: 'Atom Symbol', f: 7 }, { u: '1F233', e: '🈳', n: 'Squared Cjk Unified Ideograph-7a7a', f: 7, s: 'u7a7a' }, { u: '1F239', e: '🈹', n: 'Squared Cjk Unified Ideograph-5272', f: 7, s: 'u5272' }, { u: '2622', e: '☢', n: 'Radioactive Sign', f: 7 }, { u: '2623', e: '☣', n: 'Biohazard Sign', f: 7 }, { u: '1F4F4', e: '📴', n: 'Mobile Phone Off', f: 7, s: 'mobile_phone_off' }, { u: '1F4F3', e: '📳', n: 'Vibration Mode', f: 7, s: 'vibration_mode' }, { u: '1F236', e: '🈶', n: 'Squared Cjk Unified Ideograph-6709', f: 7, s: 'u6709' }, { u: '1F21A', e: '🈚️', n: 'Squared Cjk Unified Ideograph-7121', f: 7, s: 'u7121' }, { u: '1F238', e: '🈸', n: 'Squared Cjk Unified Ideograph-7533', f: 7, s: 'u7533' }, { u: '1F23A', e: '🈺', n: 'Squared Cjk Unified Ideograph-55b6', f: 7, s: 'u55b6' }, { u: '1F237', e: '🈷️', n: 'Squared Cjk Unified Ideograph-6708', f: 7, s: 'u6708' }, { u: '2734', e: '✴️', n: 'Eight Pointed Black Star', f: 7, s: 'eight_pointed_black_star' }, { u: '1F19A', e: '🆚', n: 'Squared Vs', f: 7, s: 'vs' }, { u: '1F251', e: '🉑', n: 'Circled Ideograph Accept', f: 7, s: 'accept' }, { u: '1F4AE', e: '💮', n: 'White Flower', f: 7, s: 'white_flower' }, { u: '1F250', e: '🉐', n: 'Circled Ideograph Advantage', f: 7, s: 'ideograph_advantage' }, { u: '3299', e: '㊙️', n: 'Circled Ideograph Secret', f: 7, s: 'secret' }, { u: '3297', e: '㊗️', n: 'Circled Ideograph Congratulation', f: 7, s: 'congratulations' }, { u: '1F234', e: '🈴', n: 'Squared Cjk Unified Ideograph-5408', f: 7, s: 'u5408' }, { u: '1F235', e: '🈵', n: 'Squared Cjk Unified Ideograph-6e80', f: 7, s: 'u6e80' }, { u: '1F232', e: '🈲', n: 'Squared Cjk Unified Ideograph-7981', f: 7, s: 'u7981' }, { u: '1F170', e: '🅰️', n: 'Negative Squared Latin Capital Letter A', f: 7, s: 'a' }, { u: '1F171', e: '🅱️', n: 'Negative Squared Latin Capital Letter B', f: 7, s: 'b' }, { u: '1F18E', e: '🆎', n: 'Negative Squared Ab', f: 7, s: 'ab' }, { u: '1F191', e: '🆑', n: 'Squared Cl', f: 7, s: 'cl' }, { u: '1F17E', e: '🅾️', n: 'Negative Squared Latin Capital Letter O', f: 7, s: 'o2' }, { u: '1F198', e: '🆘', n: 'Squared Sos', f: 7, s: 'sos' }, { u: '26D4', e: '⛔️', n: 'No Entry', f: 7, s: 'no_entry' }, { u: '1F4DB', e: '📛', n: 'Name Badge', f: 7, s: 'name_badge' }, { u: '1F6AB', e: '🚫', n: 'No Entry Sign', f: 7, s: 'no_entry_sign' }, { u: '274C', e: '❌', n: 'Cross Mark', f: 7, s: 'x' }, { u: '2B55', e: '⭕️', n: 'Heavy Large Circle', f: 7, s: 'o' }, { u: '1F4A2', e: '💢', n: 'Anger Symbol', f: 7, s: 'anger' }, { u: '2668', e: '♨️', n: 'Hot Springs', f: 7, s: 'hotsprings' }, { u: '1F6B7', e: '🚷', n: 'No Pedestrians', f: 7, s: 'no_pedestrians' }, { u: '1F6AF', e: '🚯', n: 'Do Not Litter Symbol', f: 7, s: 'do_not_litter' }, { u: '1F6B3', e: '🚳', n: 'No Bicycles', f: 7, s: 'no_bicycles' }, { u: '1F6B1', e: '🚱', n: 'Non-potable Water Symbol', f: 7, s: 'non-potable_water' }, { u: '1F51E', e: '🔞', n: 'No One Under Eighteen Symbol', f: 7, s: 'underage' }, { u: '1F4F5', e: '📵', n: 'No Mobile Phones', f: 7, s: 'no_mobile_phones' }, { u: '2757', e: '❗️', n: 'Heavy Exclamation Mark Symbol', f: 7, s: 'exclamation' }, { u: '2755', e: '❕', n: 'White Exclamation Mark Ornament', f: 7, s: 'grey_exclamation' }, { u: '2753', e: '❓', n: 'Black Question Mark Ornament', f: 7, s: 'question' }, { u: '2754', e: '❔', n: 'White Question Mark Ornament', f: 7, s: 'grey_question' }, { u: '203C', e: '‼️', n: 'Double Exclamation Mark', f: 7, s: 'bangbang' }, { u: '2049', e: '⁉️', n: 'Exclamation Question Mark', f: 7, s: 'interrobang' }, { u: '1F4AF', e: '💯', n: 'Hundred Points Symbol', f: 7, s: '100' }, { u: '1F505', e: '🔅', n: 'Low Brightness Symbol', f: 7, s: 'low_brightness' }, { u: '1F506', e: '🔆', n: 'High Brightness Symbol', f: 7, s: 'high_brightness' }, { u: '1F531', e: '🔱', n: 'Trident Emblem', f: 7, s: 'trident' }, { u: '269C', e: '⚜', n: 'Fleur-de-lis', f: 7 }, { u: '303D', e: '〽️', n: 'Part Alternation Mark', f: 7, s: 'part_alternation_mark' }, { u: '26A0', e: '⚠️', n: 'Warning Sign', f: 7, s: 'warning' }, { u: '1F6B8', e: '🚸', n: 'Children Crossing', f: 7, s: 'children_crossing' }, { u: '1F530', e: '🔰', n: 'Japanese Symbol For Beginner', f: 7, s: 'beginner' }, { u: '267B', e: '♻️', n: 'Black Universal Recycling Symbol', f: 7, s: 'recycle' }, { u: '1F22F', e: '🈯️', n: 'Squared Cjk Unified Ideograph-6307', f: 7, s: 'u6307' }, { u: '1F4B9', e: '💹', n: 'Chart With Upwards Trend And Yen Sign', f: 7, s: 'chart' }, { u: '2747', e: '❇️', n: 'Sparkle', f: 7, s: 'sparkle' }, { u: '2733', e: '✳️', n: 'Eight Spoked Asterisk', f: 7, s: 'eight_spoked_asterisk' }, { u: '274E', e: '❎', n: 'Negative Squared Cross Mark', f: 7, s: 'negative_squared_cross_mark' }, { u: '2705', e: '✅', n: 'White Heavy Check Mark', f: 7, s: 'white_check_mark' }, { u: '1F4A0', e: '💠', n: 'Diamond Shape With A Dot Inside', f: 7, s: 'diamond_shape_with_a_dot_inside' }, { u: '1F300', e: '🌀', n: 'Cyclone', f: 7, s: 'cyclone' }, { u: '27BF', e: '➿', n: 'Double Curly Loop', f: 7, s: 'loop' }, { u: '1F310', e: '🌐', n: 'Globe With Meridians', f: 7, s: 'globe_with_meridians' }, { u: '24C2', e: 'Ⓜ️', n: 'Circled Latin Capital Letter M', f: 7, s: 'm' }, { u: '1F3E7', e: '🏧', n: 'Automated Teller Machine', f: 7, s: 'atm' }, { u: '1F202', e: '🈂️', n: 'Squared Katakana Sa', f: 7, s: 'sa' }, { u: '1F6C2', e: '🛂', n: 'Passport Control', f: 7, s: 'passport_control' }, { u: '1F6C3', e: '🛃', n: 'Customs', f: 7, s: 'customs' }, { u: '1F6C4', e: '🛄', n: 'Baggage Claim', f: 7, s: 'baggage_claim' }, { u: '1F6C5', e: '🛅', n: 'Left Luggage', f: 7, s: 'left_luggage' }, { u: '267F', e: '♿️', n: 'Wheelchair Symbol', f: 7, s: 'wheelchair' }, { u: '1F6AD', e: '🚭', n: 'No Smoking Symbol', f: 7, s: 'no_smoking' }, { u: '1F6BE', e: '🚾', n: 'Water Closet', f: 7, s: 'wc' }, { u: '1F17F', e: '🅿️', n: 'Negative Squared Latin Capital Letter P', f: 7, s: 'parking' }, { u: '1F6B0', e: '🚰', n: 'Potable Water Symbol', f: 7, s: 'potable_water' }, { u: '1F6B9', e: '🚹', n: 'Mens Symbol', f: 7, s: 'mens' }, { u: '1F6BA', e: '🚺', n: 'Womens Symbol', f: 7, s: 'womens' }, { u: '1F6BC', e: '🚼', n: 'Baby Symbol', f: 7, s: 'baby_symbol' }, { u: '1F6BB', e: '🚻', n: 'Restroom', f: 7, s: 'restroom' }, { u: '1F6AE', e: '🚮', n: 'Put Litter In Its Place Symbol', f: 7, s: 'put_litter_in_its_place' }, { u: '1F3A6', e: '🎦', n: 'Cinema', f: 7, s: 'cinema' }, { u: '1F4F6', e: '📶', n: 'Antenna With Bars', f: 7, s: 'signal_strength' }, { u: '1F201', e: '🈁', n: 'Squared Katakana Koko', f: 7, s: 'koko' }, { u: '1F196', e: '🆖', n: 'Squared Ng', f: 7, s: 'ng' }, { u: '1F197', e: '🆗', n: 'Squared Ok', f: 7, s: 'ok' }, { u: '1F199', e: '🆙', n: 'Squared Up With Exclamation Mark', f: 7, s: 'up' }, { u: '1F192', e: '🆒', n: 'Squared Cool', f: 7, s: 'cool' }, { u: '1F195', e: '🆕', n: 'Squared New', f: 7, s: 'new' }, { u: '1F193', e: '🆓', n: 'Squared Free', f: 7, s: 'free' }, { u: '0030-20E3', e: '0️⃣', n: 'Keycap Digit Zero', f: 7, s: 'zero' }, { u: '0031-20E3', e: '1️⃣', n: 'Keycap Digit One', f: 7, s: 'one' }, { u: '0032-20E3', e: '2️⃣', n: 'Keycap Digit Two', f: 7, s: 'two' }, { u: '0033-20E3', e: '3️⃣', n: 'Keycap Digit Three', f: 7, s: 'three' }, { u: '0034-20E3', e: '4️⃣', n: 'Keycap Digit Four', f: 7, s: 'four' }, { u: '0035-20E3', e: '5️⃣', n: 'Keycap Digit Five', f: 7, s: 'five' }, { u: '0036-20E3', e: '6️⃣', n: 'Keycap Digit Six', f: 7, s: 'six' }, { u: '0037-20E3', e: '7️⃣', n: 'Keycap Digit Seven', f: 7, s: 'seven' }, { u: '0038-20E3', e: '8️⃣', n: 'Keycap Digit Eight', f: 7, s: 'eight' }, { u: '0039-20E3', e: '9️⃣', n: 'Keycap Digit Nine', f: 7, s: 'nine' }, { u: '1F51F', e: '🔟', n: 'Keycap Ten', f: 7, s: 'keycap_ten' }, { u: '1F522', e: '🔢', n: 'Input Symbol For Numbers', f: 7, s: '1234' }, { u: '25B6', e: '▶️', n: 'Black Right-pointing Triangle', f: 7, s: 'arrow_forward' }, { u: '23F8', e: '⏸', n: 'Double Vertical Bar', f: 7 }, { u: '23EF', e: '⏯', n: 'Black Right-pointing Triangle With Double Vertical Bar', f: 7 }, { u: '23F9', e: '⏹', n: 'Black Square For Stop', f: 7 }, { u: '23FA', e: '⏺', n: 'Black Circle For Record', f: 7 }, { u: '23ED', e: '⏭', n: 'Black Right-pointing Double Triangle With Vertical Bar', f: 7 }, { u: '23EE', e: '⏮', n: 'Black Left-pointing Double Triangle With Vertical Bar', f: 7 }, { u: '23E9', e: '⏩', n: 'Black Right-pointing Double Triangle', f: 7, s: 'fast_forward' }, { u: '23EA', e: '⏪', n: 'Black Left-pointing Double Triangle', f: 7, s: 'rewind' }, { u: '1F500', e: '🔀', n: 'Twisted Rightwards Arrows', f: 7, s: 'twisted_rightwards_arrows' }, { u: '1F501', e: '🔁', n: 'Clockwise Rightwards And Leftwards Open Circle Arrows', f: 7, s: 'repeat' }, { u: '1F502', e: '🔂', n: 'Clockwise Rightwards And Leftwards Open Circle Arrows With Circled One Overlay', f: 7, s: 'repeat_one' }, { u: '25C0', e: '◀️', n: 'Black Left-pointing Triangle', f: 7, s: 'arrow_backward' }, { u: '1F53C', e: '🔼', n: 'Up-pointing Small Red Triangle', f: 7, s: 'arrow_up_small' }, { u: '1F53D', e: '🔽', n: 'Down-pointing Small Red Triangle', f: 7, s: 'arrow_down_small' }, { u: '23EB', e: '⏫', n: 'Black Up-pointing Double Triangle', f: 7, s: 'arrow_double_up' }, { u: '23EC', e: '⏬', n: 'Black Down-pointing Double Triangle', f: 7, s: 'arrow_double_down' }, { u: '27A1', e: '➡️', n: 'Black Rightwards Arrow', f: 7, s: 'arrow_right' }, { u: '2B05', e: '⬅️', n: 'Leftwards Black Arrow', f: 7, s: 'arrow_left' }, { u: '2B06', e: '⬆️', n: 'Upwards Black Arrow', f: 7, s: 'arrow_up' }, { u: '2B07', e: '⬇️', n: 'Downwards Black Arrow', f: 7, s: 'arrow_down' }, { u: '2197', e: '↗️', n: 'North East Arrow', f: 7, s: 'arrow_upper_right' }, { u: '2198', e: '↘️', n: 'South East Arrow', f: 7, s: 'arrow_lower_right' }, { u: '2199', e: '↙️', n: 'South West Arrow', f: 7, s: 'arrow_lower_left' }, { u: '2196', e: '↖️', n: 'North West Arrow', f: 7, s: 'arrow_upper_left' }, { u: '2195', e: '↕️', n: 'Up Down Arrow', f: 7, s: 'arrow_up_down' }, { u: '2194', e: '↔️', n: 'Left Right Arrow', f: 7, s: 'left_right_arrow' }, { u: '1F504', e: '🔄', n: 'Anticlockwise Downwards And Upwards Open Circle Arrows', f: 7, s: 'arrows_counterclockwise' }, { u: '21AA', e: '↪️', n: 'Rightwards Arrow With Hook', f: 7, s: 'arrow_right_hook' }, { u: '21A9', e: '↩️', n: 'Leftwards Arrow With Hook', f: 7, s: 'leftwards_arrow_with_hook' }, { u: '2934', e: '⤴️', n: 'Arrow Pointing Rightwards Then Curving Upwards', f: 7, s: 'arrow_heading_up' }, { u: '2935', e: '⤵️', n: 'Arrow Pointing Rightwards Then Curving Downwards', f: 7, s: 'arrow_heading_down' }, { u: '0023-20E3', e: '#️⃣', n: 'Keycap Number Sign', f: 7, s: 'hash' }, { u: '002A-20E3', e: '*️⃣', n: 'Keycap Asterisk', f: 7 }, { u: '2139', e: 'ℹ️', n: 'Information Source', f: 7, s: 'information_source' }, { u: '1F524', e: '🔤', n: 'Input Symbol For Latin Letters', f: 7, s: 'abc' }, { u: '1F521', e: '🔡', n: 'Input Symbol For Latin Small Letters', f: 7, s: 'abcd' }, { u: '1F520', e: '🔠', n: 'Input Symbol For Latin Capital Letters', f: 7, s: 'capital_abcd' }, { u: '1F523', e: '🔣', n: 'Input Symbol For Symbols', f: 7, s: 'symbols' }, { u: '1F3B5', e: '🎵', n: 'Musical Note', f: 7, s: 'musical_note' }, { u: '1F3B6', e: '🎶', n: 'Multiple Musical Notes', f: 7, s: 'notes' }, { u: '3030', e: '〰️', n: 'Wavy Dash', f: 7, s: 'wavy_dash' }, { u: '27B0', e: '➰', n: 'Curly Loop', f: 7, s: 'curly_loop' }, { u: '2714', e: '✔️', n: 'Heavy Check Mark', f: 7, s: 'heavy_check_mark' }, { u: '1F503', e: '🔃', n: 'Clockwise Downwards And Upwards Open Circle Arrows', f: 7, s: 'arrows_clockwise' }, { u: '2795', e: '➕', n: 'Heavy Plus Sign', f: 7, s: 'heavy_plus_sign' }, { u: '2796', e: '➖', n: 'Heavy Minus Sign', f: 7, s: 'heavy_minus_sign' }, { u: '2797', e: '➗', n: 'Heavy Division Sign', f: 7, s: 'heavy_division_sign' }, { u: '2716', e: '✖️', n: 'Heavy Multiplication X', f: 7, s: 'heavy_multiplication_x' }, { u: '1F4B2', e: '💲', n: 'Heavy Dollar Sign', f: 7, s: 'heavy_dollar_sign' }, { u: '1F4B1', e: '💱', n: 'Currency Exchange', f: 7, s: 'currency_exchange' }, { u: '00A9', e: '©️', n: 'Copyright Sign', f: 7, s: 'copyright' }, { u: '00AE', e: '®️', n: 'Registered Sign', f: 7, s: 'registered' }, { u: '2122', e: '™️', n: 'Trade Mark Sign', f: 7, s: 'tm' }, { u: '1F51A', e: '🔚', n: 'End With Leftwards Arrow Above', f: 7, s: 'end' }, { u: '1F519', e: '🔙', n: 'Back With Leftwards Arrow Above', f: 7, s: 'back' }, { u: '1F51B', e: '🔛', n: 'On With Exclamation Mark With Left Right Arrow Above', f: 7, s: 'on' }, { u: '1F51D', e: '🔝', n: 'Top With Upwards Arrow Above', f: 7, s: 'top' }, { u: '1F51C', e: '🔜', n: 'Soon With Rightwards Arrow Above', f: 7, s: 'soon' }, { u: '2611', e: '☑️', n: 'Ballot Box With Check', f: 7, s: 'ballot_box_with_check' }, { u: '1F518', e: '🔘', n: 'Radio Button', f: 7, s: 'radio_button' }, { u: '26AA', e: '⚪️', n: 'Medium White Circle', f: 7, s: 'white_circle' }, { u: '26AB', e: '⚫️', n: 'Medium Black Circle', f: 7, s: 'black_circle' }, { u: '1F534', e: '🔴', n: 'Large Red Circle', f: 7, s: 'red_circle' }, { u: '1F535', e: '🔵', n: 'Large Blue Circle', f: 7, s: 'large_blue_circle' }, { u: '1F538', e: '🔸', n: 'Small Orange Diamond', f: 7, s: 'small_orange_diamond' }, { u: '1F539', e: '🔹', n: 'Small Blue Diamond', f: 7, s: 'small_blue_diamond' }, { u: '1F536', e: '🔶', n: 'Large Orange Diamond', f: 7, s: 'large_orange_diamond' }, { u: '1F537', e: '🔷', n: 'Large Blue Diamond', f: 7, s: 'large_blue_diamond' }, { u: '1F53A', e: '🔺', n: 'Up-pointing Red Triangle', f: 7, s: 'small_red_triangle' }, { u: '25AA', e: '▪️', n: 'Black Small Square', f: 7, s: 'black_small_square' }, { u: '25AB', e: '▫️', n: 'White Small Square', f: 7, s: 'white_small_square' }, { u: '2B1B', e: '⬛️', n: 'Black Large Square', f: 7, s: 'black_large_square' }, { u: '2B1C', e: '⬜️', n: 'White Large Square', f: 7, s: 'white_large_square' }, { u: '1F53B', e: '🔻', n: 'Down-pointing Red Triangle', f: 7, s: 'small_red_triangle_down' }, { u: '25FC', e: '◼️', n: 'Black Medium Square', f: 7, s: 'black_medium_square' }, { u: '25FB', e: '◻️', n: 'White Medium Square', f: 7, s: 'white_medium_square' }, { u: '25FE', e: '◾️', n: 'Black Medium Small Square', f: 7, s: 'black_medium_small_square' }, { u: '25FD', e: '◽️', n: 'White Medium Small Square', f: 7, s: 'white_medium_small_square' }, { u: '1F532', e: '🔲', n: 'Black Square Button', f: 7, s: 'black_square_button' }, { u: '1F533', e: '🔳', n: 'White Square Button', f: 7, s: 'white_square_button' }, { u: '1F508', e: '🔈', n: 'Speaker', f: 7, s: 'speaker' }, { u: '1F509', e: '🔉', n: 'Speaker With One Sound Wave', f: 7, s: 'sound' }, { u: '1F50A', e: '🔊', n: 'Speaker With Three Sound Waves', f: 7, s: 'loud_sound' }, { u: '1F507', e: '🔇', n: 'Speaker With Cancellation Stroke', f: 7, s: 'mute' }, { u: '1F4E3', e: '📣', n: 'Cheering Megaphone', f: 7, s: 'mega' }, { u: '1F4E2', e: '📢', n: 'Public Address Loudspeaker', f: 7, s: 'loudspeaker' }, { u: '1F514', e: '🔔', n: 'Bell', f: 7, s: 'bell' }, { u: '1F515', e: '🔕', n: 'Bell With Cancellation Stroke', f: 7, s: 'no_bell' }, { u: '1F0CF', e: '🃏', n: 'Playing Card Black Joker', f: 7, s: 'black_joker' }, { u: '1F004', e: '🀄️', n: 'Mahjong Tile Red Dragon', f: 7, s: 'mahjong' }, { u: '2660', e: '♠️', n: 'Black Spade Suit', f: 7, s: 'spades' }, { u: '2663', e: '♣️', n: 'Black Club Suit', f: 7, s: 'clubs' }, { u: '2665', e: '♥️', n: 'Black Heart Suit', f: 7, s: 'hearts' }, { u: '2666', e: '♦️', n: 'Black Diamond Suit', f: 7, s: 'diamonds' }, { u: '1F3B4', e: '🎴', n: 'Flower Playing Cards', f: 7, s: 'flower_playing_cards' }, { u: '1F4AD', e: '💭', n: 'Thought Balloon', f: 7, s: 'thought_balloon' }, { u: '1F5EF', e: '🗯', n: 'Right Anger Bubble', f: 7, s: 'anger_right' }, { u: '1F4AC', e: '💬', n: 'Speech Balloon', f: 7, s: 'speech_balloon' }, { u: '1F550', e: '🕐', n: 'Clock Face One Oclock', f: 7, s: 'clock1' }, { u: '1F551', e: '🕑', n: 'Clock Face Two Oclock', f: 7, s: 'clock2' }, { u: '1F552', e: '🕒', n: 'Clock Face Three Oclock', f: 7, s: 'clock3' }, { u: '1F553', e: '🕓', n: 'Clock Face Four Oclock', f: 7, s: 'clock4' }, { u: '1F554', e: '🕔', n: 'Clock Face Five Oclock', f: 7, s: 'clock5' }, { u: '1F555', e: '🕕', n: 'Clock Face Six Oclock', f: 7, s: 'clock6' }, { u: '1F556', e: '🕖', n: 'Clock Face Seven Oclock', f: 7, s: 'clock7' }, { u: '1F557', e: '🕗', n: 'Clock Face Eight Oclock', f: 7, s: 'clock8' }, { u: '1F558', e: '🕘', n: 'Clock Face Nine Oclock', f: 7, s: 'clock9' }, { u: '1F559', e: '🕙', n: 'Clock Face Ten Oclock', f: 7, s: 'clock10' }, { u: '1F55A', e: '🕚', n: 'Clock Face Eleven Oclock', f: 7, s: 'clock11' }, { u: '1F55B', e: '🕛', n: 'Clock Face Twelve Oclock', f: 7, s: 'clock12' }, { u: '1F55C', e: '🕜', n: 'Clock Face One-thirty', f: 7, s: 'clock130' }, { u: '1F55D', e: '🕝', n: 'Clock Face Two-thirty', f: 7, s: 'clock230' }, { u: '1F55E', e: '🕞', n: 'Clock Face Three-thirty', f: 7, s: 'clock330' }, { u: '1F55F', e: '🕟', n: 'Clock Face Four-thirty', f: 7, s: 'clock430' }, { u: '1F560', e: '🕠', n: 'Clock Face Five-thirty', f: 7, s: 'clock530' }, { u: '1F561', e: '🕡', n: 'Clock Face Six-thirty', f: 7, s: 'clock630' }, { u: '1F562', e: '🕢', n: 'Clock Face Seven-thirty', f: 7, s: 'clock730' }, { u: '1F563', e: '🕣', n: 'Clock Face Eight-thirty', f: 7, s: 'clock830' }, { u: '1F564', e: '🕤', n: 'Clock Face Nine-thirty', f: 7, s: 'clock930' }, { u: '1F565', e: '🕥', n: 'Clock Face Ten-thirty', f: 7, s: 'clock1030' }, { u: '1F566', e: '🕦', n: 'Clock Face Eleven-thirty', f: 7, s: 'clock1130' }, { u: '1F567', e: '🕧', n: 'Clock Face Twelve-thirty', f: 7, s: 'clock1230' }, { u: '1F5E8', e: '🗨', n: 'Left Speech Bubble', f: 7, s: 'speech_left' }, { u: '1F441-1F5E8', e: '👁‍🗨', n: 'Eye in Speech Bubble', f: 7 }, { u: '23CF', e: '⏏', n: 'Eject Symbol', f: 7 }, { u: '1F1E6-1F1EB', e: '🇦🇫', n: 'Flag For Afghanistan', f: 8, s: 'flag_af' }, { u: '1F1E6-1F1FD', e: '🇦🇽', n: 'Flag For ÅLand Islands', f: 8, s: 'flag_ax' }, { u: '1F1E6-1F1F1', e: '🇦🇱', n: 'Flag For Albania', f: 8, s: 'flag_al' }, { u: '1F1E9-1F1FF', e: '🇩🇿', n: 'Flag For Algeria', f: 8, s: 'flag_dz' }, { u: '1F1E6-1F1F8', e: '🇦🇸', n: 'Flag For American Samoa', f: 8, s: 'flag_as' }, { u: '1F1E6-1F1E9', e: '🇦🇩', n: 'Flag For Andorra', f: 8, s: 'flag_ad' }, { u: '1F1E6-1F1F4', e: '🇦🇴', n: 'Flag For Angola', f: 8, s: 'flag_ao' }, { u: '1F1E6-1F1EE', e: '🇦🇮', n: 'Flag For Anguilla', f: 8, s: 'flag_ai' }, { u: '1F1E6-1F1F6', e: '🇦🇶', n: 'Flag For Antarctica', f: 8, s: 'flag_aq' }, { u: '1F1E6-1F1EC', e: '🇦🇬', n: 'Flag For Antigua & Barbuda', f: 8, s: 'flag_ag' }, { u: '1F1E6-1F1F7', e: '🇦🇷', n: 'Flag For Argentina', f: 8, s: 'flag_ar' }, { u: '1F1E6-1F1F2', e: '🇦🇲', n: 'Flag For Armenia', f: 8, s: 'flag_am' }, { u: '1F1E6-1F1FC', e: '🇦🇼', n: 'Flag For Aruba', f: 8, s: 'flag_aw' }, { u: '1F1E6-1F1FA', e: '🇦🇺', n: 'Flag For Australia', f: 8, s: 'flag_au' }, { u: '1F1E6-1F1F9', e: '🇦🇹', n: 'Flag For Austria', f: 8, s: 'flag_at' }, { u: '1F1E6-1F1FF', e: '🇦🇿', n: 'Flag For Azerbaijan', f: 8, s: 'flag_az' }, { u: '1F1E7-1F1F8', e: '🇧🇸', n: 'Flag For Bahamas', f: 8, s: 'flag_bs' }, { u: '1F1E7-1F1ED', e: '🇧🇭', n: 'Flag For Bahrain', f: 8, s: 'flag_bh' }, { u: '1F1E7-1F1E9', e: '🇧🇩', n: 'Flag For Bangladesh', f: 8, s: 'flag_bd' }, { u: '1F1E7-1F1E7', e: '🇧🇧', n: 'Flag For Barbados', f: 8, s: 'flag_bb' }, { u: '1F1E7-1F1FE', e: '🇧🇾', n: 'Flag For Belarus', f: 8, s: 'flag_by' }, { u: '1F1E7-1F1EA', e: '🇧🇪', n: 'Flag For Belgium', f: 8, s: 'flag_be' }, { u: '1F1E7-1F1FF', e: '🇧🇿', n: 'Flag For Belize', f: 8, s: 'flag_bz' }, { u: '1F1E7-1F1EF', e: '🇧🇯', n: 'Flag For Benin', f: 8, s: 'flag_bj' }, { u: '1F1E7-1F1F2', e: '🇧🇲', n: 'Flag For Bermuda', f: 8, s: 'flag_bm' }, { u: '1F1E7-1F1F9', e: '🇧🇹', n: 'Flag For Bhutan', f: 8, s: 'flag_bt' }, { u: '1F1E7-1F1F4', e: '🇧🇴', n: 'Flag For Bolivia', f: 8, s: 'flag_bo' }, { u: '1F1E7-1F1F6', e: '🇧🇶', n: 'Flag For Caribbean Netherlands', f: 8, s: 'flag_bq' }, { u: '1F1E7-1F1E6', e: '🇧🇦', n: 'Flag For Bosnia & Herzegovina', f: 8, s: 'flag_ba' }, { u: '1F1E7-1F1FC', e: '🇧🇼', n: 'Flag For Botswana', f: 8, s: 'flag_bw' }, { u: '1F1E7-1F1F7', e: '🇧🇷', n: 'Flag For Brazil', f: 8, s: 'flag_br' }, { u: '1F1EE-1F1F4', e: '🇮🇴', n: 'Flag For British Indian Ocean Territory', f: 8, s: 'flag_io' }, { u: '1F1FB-1F1EC', e: '🇻🇬', n: 'Flag For British Virgin Islands', f: 8, s: 'flag_vg' }, { u: '1F1E7-1F1F3', e: '🇧🇳', n: 'Flag For Brunei', f: 8, s: 'flag_bn' }, { u: '1F1E7-1F1EC', e: '🇧🇬', n: 'Flag For Bulgaria', f: 8, s: 'flag_bg' }, { u: '1F1E7-1F1EB', e: '🇧🇫', n: 'Flag For Burkina Faso', f: 8, s: 'flag_bf' }, { u: '1F1E7-1F1EE', e: '🇧🇮', n: 'Flag For Burundi', f: 8, s: 'flag_bi' }, { u: '1F1E8-1F1FB', e: '🇨🇻', n: 'Flag For Cape Verde', f: 8, s: 'flag_cv' }, { u: '1F1F0-1F1ED', e: '🇰🇭', n: 'Flag For Cambodia', f: 8, s: 'flag_kh' }, { u: '1F1E8-1F1F2', e: '🇨🇲', n: 'Flag For Cameroon', f: 8, s: 'flag_cm' }, { u: '1F1E8-1F1E6', e: '🇨🇦', n: 'Flag For Canada', f: 8, s: 'flag_ca' }, { u: '1F1EE-1F1E8', e: '🇮🇨', n: 'Flag For Canary Islands', f: 8, s: 'flag_ic' }, { u: '1F1F0-1F1FE', e: '🇰🇾', n: 'Flag For Cayman Islands', f: 8, s: 'flag_ky' }, { u: '1F1E8-1F1EB', e: '🇨🇫', n: 'Flag For Central African Republic', f: 8, s: 'flag_cf' }, { u: '1F1F9-1F1E9', e: '🇹🇩', n: 'Flag For Chad', f: 8, s: 'flag_td' }, { u: '1F1E8-1F1F1', e: '🇨🇱', n: 'Flag For Chile', f: 8, s: 'flag_cl' }, { u: '1F1E8-1F1F3', e: '🇨🇳', n: 'Flag For China', f: 8, s: 'flag_cn' }, { u: '1F1E8-1F1FD', e: '🇨🇽', n: 'Flag For Christmas Island', f: 8, s: 'flag_cx' }, { u: '1F1E8-1F1E8', e: '🇨🇨', n: 'Flag For Cocos Islands', f: 8, s: 'flag_cc' }, { u: '1F1E8-1F1F4', e: '🇨🇴', n: 'Flag For Colombia', f: 8, s: 'flag_co' }, { u: '1F1F0-1F1F2', e: '🇰🇲', n: 'Flag For Comoros', f: 8, s: 'flag_km' }, { u: '1F1E8-1F1EC', e: '🇨🇬', n: 'Flag For Congo - Brazzaville', f: 8, s: 'flag_cg' }, { u: '1F1E8-1F1E9', e: '🇨🇩', n: 'Flag For Congo - Kinshasa', f: 8, s: 'flag_cd' }, { u: '1F1E8-1F1F0', e: '🇨🇰', n: 'Flag For Cook Islands', f: 8, s: 'flag_ck' }, { u: '1F1E8-1F1F7', e: '🇨🇷', n: 'Flag For Costa Rica', f: 8, s: 'flag_cr' }, { u: '1F1ED-1F1F7', e: '🇭🇷', n: 'Flag For Croatia', f: 8, s: 'flag_hr' }, { u: '1F1E8-1F1FA', e: '🇨🇺', n: 'Flag For Cuba', f: 8, s: 'flag_cu' }, { u: '1F1E8-1F1FC', e: '🇨🇼', n: 'Flag For Curaçao', f: 8, s: 'flag_cw' }, { u: '1F1E8-1F1FE', e: '🇨🇾', n: 'Flag For Cyprus', f: 8, s: 'flag_cy' }, { u: '1F1E8-1F1FF', e: '🇨🇿', n: 'Flag For Czech Republic', f: 8, s: 'flag_cz' }, { u: '1F1E9-1F1F0', e: '🇩🇰', n: 'Flag For Denmark', f: 8, s: 'flag_dk' }, { u: '1F1E9-1F1EF', e: '🇩🇯', n: 'Flag For Djibouti', f: 8, s: 'flag_dj' }, { u: '1F1E9-1F1F2', e: '🇩🇲', n: 'Flag For Dominica', f: 8, s: 'flag_dm' }, { u: '1F1E9-1F1F4', e: '🇩🇴', n: 'Flag For Dominican Republic', f: 8, s: 'flag_do' }, { u: '1F1EA-1F1E8', e: '🇪🇨', n: 'Flag For Ecuador', f: 8, s: 'flag_ec' }, { u: '1F1EA-1F1EC', e: '🇪🇬', n: 'Flag For Egypt', f: 8, s: 'flag_eg' }, { u: '1F1F8-1F1FB', e: '🇸🇻', n: 'Flag For El Salvador', f: 8, s: 'flag_sv' }, { u: '1F1EC-1F1F6', e: '🇬🇶', n: 'Flag For Equatorial Guinea', f: 8, s: 'flag_gq' }, { u: '1F1EA-1F1F7', e: '🇪🇷', n: 'Flag For Eritrea', f: 8, s: 'flag_er' }, { u: '1F1EA-1F1EA', e: '🇪🇪', n: 'Flag For Estonia', f: 8, s: 'flag_ee' }, { u: '1F1EA-1F1F9', e: '🇪🇹', n: 'Flag For Ethiopia', f: 8, s: 'flag_et' }, { u: '1F1EA-1F1FA', e: '🇪🇺', n: 'Flag For European Union', f: 8, s: 'flag_eu' }, { u: '1F1EB-1F1F0', e: '🇫🇰', n: 'Flag For Falkland Islands', f: 8, s: 'flag_fk' }, { u: '1F1EB-1F1F4', e: '🇫🇴', n: 'Flag For Faroe Islands', f: 8, s: 'flag_fo' }, { u: '1F1EB-1F1EF', e: '🇫🇯', n: 'Flag For Fiji', f: 8, s: 'flag_fj' }, { u: '1F1EB-1F1EE', e: '🇫🇮', n: 'Flag For Finland', f: 8, s: 'flag_fi' }, { u: '1F1EB-1F1F7', e: '🇫🇷', n: 'Flag For France', f: 8, s: 'flag_fr' }, { u: '1F1EC-1F1EB', e: '🇬🇫', n: 'Flag For French Guiana', f: 8, s: 'flag_gf' }, { u: '1F1F5-1F1EB', e: '🇵🇫', n: 'Flag For French Polynesia', f: 8, s: 'flag_pf' }, { u: '1F1F9-1F1EB', e: '🇹🇫', n: 'Flag For French Southern Territories', f: 8 }, { u: '1F1EC-1F1E6', e: '🇬🇦', n: 'Flag For Gabon', f: 8, s: 'flag_ga' }, { u: '1F1EC-1F1F2', e: '🇬🇲', n: 'Flag For Gambia', f: 8, s: 'flag_gm' }, { u: '1F1EC-1F1EA', e: '🇬🇪', n: 'Flag For Georgia', f: 8, s: 'flag_ge' }, { u: '1F1E9-1F1EA', e: '🇩🇪', n: 'Flag For Germany', f: 8, s: 'flag_de' }, { u: '1F1EC-1F1ED', e: '🇬🇭', n: 'Flag For Ghana', f: 8, s: 'flag_gh' }, { u: '1F1EC-1F1EE', e: '🇬🇮', n: 'Flag For Gibraltar', f: 8, s: 'flag_gi' }, { u: '1F1EC-1F1F7', e: '🇬🇷', n: 'Flag For Greece', f: 8, s: 'flag_gr' }, { u: '1F1EC-1F1F1', e: '🇬🇱', n: 'Flag For Greenland', f: 8, s: 'flag_gl' }, { u: '1F1EC-1F1E9', e: '🇬🇩', n: 'Flag For Grenada', f: 8, s: 'flag_gd' }, { u: '1F1EC-1F1F5', e: '🇬🇵', n: 'Flag For Guadeloupe', f: 8, s: 'flag_gp' }, { u: '1F1EC-1F1FA', e: '🇬🇺', n: 'Flag For Guam', f: 8, s: 'flag_gu' }, { u: '1F1EC-1F1F9', e: '🇬🇹', n: 'Flag For Guatemala', f: 8, s: 'flag_gt' }, { u: '1F1EC-1F1EC', e: '🇬🇬', n: 'Flag For Guernsey', f: 8, s: 'flag_gg' }, { u: '1F1EC-1F1F3', e: '🇬🇳', n: 'Flag For Guinea', f: 8, s: 'flag_gn' }, { u: '1F1EC-1F1FC', e: '🇬🇼', n: 'Flag For Guinea-bissau', f: 8, s: 'flag_gw' }, { u: '1F1EC-1F1FE', e: '🇬🇾', n: 'Flag For Guyana', f: 8, s: 'flag_gy' }, { u: '1F1ED-1F1F9', e: '🇭🇹', n: 'Flag For Haiti', f: 8, s: 'flag_ht' }, { u: '1F1ED-1F1F3', e: '🇭🇳', n: 'Flag For Honduras', f: 8, s: 'flag_hn' }, { u: '1F1ED-1F1F0', e: '🇭🇰', n: 'Flag For Hong Kong', f: 8, s: 'flag_hk' }, { u: '1F1ED-1F1FA', e: '🇭🇺', n: 'Flag For Hungary', f: 8, s: 'flag_hu' }, { u: '1F1EE-1F1F8', e: '🇮🇸', n: 'Flag For Iceland', f: 8, s: 'flag_is' }, { u: '1F1EE-1F1F3', e: '🇮🇳', n: 'Flag For India', f: 8, s: 'flag_in' }, { u: '1F1EE-1F1E9', e: '🇮🇩', n: 'Flag For Indonesia', f: 8, s: 'flag_id' }, { u: '1F1EE-1F1F7', e: '🇮🇷', n: 'Flag For Iran', f: 8, s: 'flag_ir' }, { u: '1F1EE-1F1F6', e: '🇮🇶', n: 'Flag For Iraq', f: 8, s: 'flag_iq' }, { u: '1F1EE-1F1EA', e: '🇮🇪', n: 'Flag For Ireland', f: 8, s: 'flag_ie' }, { u: '1F1EE-1F1F2', e: '🇮🇲', n: 'Flag For Isle Of Man', f: 8, s: 'flag_im' }, { u: '1F1EE-1F1F1', e: '🇮🇱', n: 'Flag For Israel', f: 8, s: 'flag_il' }, { u: '1F1EE-1F1F9', e: '🇮🇹', n: 'Flag For Italy', f: 8, s: 'flag_it' }, { u: '1F1E8-1F1EE', e: '🇨🇮', n: 'Flag For Côte D’ivoire', f: 8, s: 'flag_ci' }, { u: '1F1EF-1F1F2', e: '🇯🇲', n: 'Flag For Jamaica', f: 8, s: 'flag_jm' }, { u: '1F1EF-1F1F5', e: '🇯🇵', n: 'Flag For Japan', f: 8, s: 'flag_jp' }, { u: '1F1EF-1F1EA', e: '🇯🇪', n: 'Flag For Jersey', f: 8, s: 'flag_je' }, { u: '1F1EF-1F1F4', e: '🇯🇴', n: 'Flag For Jordan', f: 8, s: 'flag_jo' }, { u: '1F1F0-1F1FF', e: '🇰🇿', n: 'Flag For Kazakhstan', f: 8, s: 'flag_kz' }, { u: '1F1F0-1F1EA', e: '🇰🇪', n: 'Flag For Kenya', f: 8, s: 'flag_ke' }, { u: '1F1F0-1F1EE', e: '🇰🇮', n: 'Flag For Kiribati', f: 8, s: 'flag_ki' }, { u: '1F1FD-1F1F0', e: '🇽🇰', n: 'Flag For Kosovo', f: 8, s: 'flag_xk' }, { u: '1F1F0-1F1FC', e: '🇰🇼', n: 'Flag For Kuwait', f: 8, s: 'flag_kw' }, { u: '1F1F0-1F1EC', e: '🇰🇬', n: 'Flag For Kyrgyzstan', f: 8, s: 'flag_kg' }, { u: '1F1F1-1F1E6', e: '🇱🇦', n: 'Flag For Laos', f: 8, s: 'flag_la' }, { u: '1F1F1-1F1FB', e: '🇱🇻', n: 'Flag For Latvia', f: 8, s: 'flag_lv' }, { u: '1F1F1-1F1E7', e: '🇱🇧', n: 'Flag For Lebanon', f: 8, s: 'flag_lb' }, { u: '1F1F1-1F1F8', e: '🇱🇸', n: 'Flag For Lesotho', f: 8, s: 'flag_ls' }, { u: '1F1F1-1F1F7', e: '🇱🇷', n: 'Flag For Liberia', f: 8, s: 'flag_lr' }, { u: '1F1F1-1F1FE', e: '🇱🇾', n: 'Flag For Libya', f: 8, s: 'flag_ly' }, { u: '1F1F1-1F1EE', e: '🇱🇮', n: 'Flag For Liechtenstein', f: 8, s: 'flag_li' }, { u: '1F1F1-1F1F9', e: '🇱🇹', n: 'Flag For Lithuania', f: 8, s: 'flag_lt' }, { u: '1F1F1-1F1FA', e: '🇱🇺', n: 'Flag For Luxembourg', f: 8, s: 'flag_lu' }, { u: '1F1F2-1F1F4', e: '🇲🇴', n: 'Flag For Macau', f: 8, s: 'flag_mo' }, { u: '1F1F2-1F1F0', e: '🇲🇰', n: 'Flag For Macedonia', f: 8, s: 'flag_mk' }, { u: '1F1F2-1F1EC', e: '🇲🇬', n: 'Flag For Madagascar', f: 8, s: 'flag_mg' }, { u: '1F1F2-1F1FC', e: '🇲🇼', n: 'Flag For Malawi', f: 8, s: 'flag_mw' }, { u: '1F1F2-1F1FE', e: '🇲🇾', n: 'Flag For Malaysia', f: 8, s: 'flag_my' }, { u: '1F1F2-1F1FB', e: '🇲🇻', n: 'Flag For Maldives', f: 8, s: 'flag_mv' }, { u: '1F1F2-1F1F1', e: '🇲🇱', n: 'Flag For Mali', f: 8, s: 'flag_ml' }, { u: '1F1F2-1F1F9', e: '🇲🇹', n: 'Flag For Malta', f: 8, s: 'flag_mt' }, { u: '1F1F2-1F1ED', e: '🇲🇭', n: 'Flag For Marshall Islands', f: 8, s: 'flag_mh' }, { u: '1F1F2-1F1F6', e: '🇲🇶', n: 'Flag For Martinique', f: 8, s: 'flag_mq' }, { u: '1F1F2-1F1F7', e: '🇲🇷', n: 'Flag For Mauritania', f: 8, s: 'flag_mr' }, { u: '1F1F2-1F1FA', e: '🇲🇺', n: 'Flag For Mauritius', f: 8, s: 'flag_mu' }, { u: '1F1FE-1F1F9', e: '🇾🇹', n: 'Flag For Mayotte', f: 8, s: 'flag_yt' }, { u: '1F1F2-1F1FD', e: '🇲🇽', n: 'Flag For Mexico', f: 8, s: 'flag_mx' }, { u: '1F1EB-1F1F2', e: '🇫🇲', n: 'Flag For Micronesia', f: 8, s: 'flag_fm' }, { u: '1F1F2-1F1E9', e: '🇲🇩', n: 'Flag For Moldova', f: 8, s: 'flag_md' }, { u: '1F1F2-1F1E8', e: '🇲🇨', n: 'Flag For Monaco', f: 8, s: 'flag_mc' }, { u: '1F1F2-1F1F3', e: '🇲🇳', n: 'Flag For Mongolia', f: 8, s: 'flag_mn' }, { u: '1F1F2-1F1EA', e: '🇲🇪', n: 'Flag For Montenegro', f: 8, s: 'flag_me' }, { u: '1F1F2-1F1F8', e: '🇲🇸', n: 'Flag For Montserrat', f: 8, s: 'flag_ms' }, { u: '1F1F2-1F1E6', e: '🇲🇦', n: 'Flag For Morocco', f: 8, s: 'flag_ma' }, { u: '1F1F2-1F1FF', e: '🇲🇿', n: 'Flag For Mozambique', f: 8, s: 'flag_mz' }, { u: '1F1F2-1F1F2', e: '🇲🇲', n: 'Flag For Myanmar', f: 8, s: 'flag_mm' }, { u: '1F1F3-1F1E6', e: '🇳🇦', n: 'Flag For Namibia', f: 8, s: 'flag_na' }, { u: '1F1F3-1F1F7', e: '🇳🇷', n: 'Flag For Nauru', f: 8, s: 'flag_nr' }, { u: '1F1F3-1F1F5', e: '🇳🇵', n: 'Flag For Nepal', f: 8, s: 'flag_np' }, { u: '1F1F3-1F1F1', e: '🇳🇱', n: 'Flag For Netherlands', f: 8, s: 'flag_nl' }, { u: '1F1F3-1F1E8', e: '🇳🇨', n: 'Flag For New Caledonia', f: 8, s: 'flag_nc' }, { u: '1F1F3-1F1FF', e: '🇳🇿', n: 'Flag For New Zealand', f: 8, s: 'flag_nz' }, { u: '1F1F3-1F1EE', e: '🇳🇮', n: 'Flag For Nicaragua', f: 8, s: 'flag_ni' }, { u: '1F1F3-1F1EA', e: '🇳🇪', n: 'Flag For Niger', f: 8, s: 'flag_ne' }, { u: '1F1F3-1F1EC', e: '🇳🇬', n: 'Flag For Nigeria', f: 8, s: 'flag_ng' }, { u: '1F1F3-1F1FA', e: '🇳🇺', n: 'Flag For Niue', f: 8, s: 'flag_nu' }, { u: '1F1F3-1F1EB', e: '🇳🇫', n: 'Flag For Norfolk Island', f: 8, s: 'flag_nf' }, { u: '1F1F2-1F1F5', e: '🇲🇵', n: 'Flag For Northern Mariana Islands', f: 8, s: 'flag_mp' }, { u: '1F1F0-1F1F5', e: '🇰🇵', n: 'Flag For North Korea', f: 8, s: 'flag_kp' }, { u: '1F1F3-1F1F4', e: '🇳🇴', n: 'Flag For Norway', f: 8, s: 'flag_no' }, { u: '1F1F4-1F1F2', e: '🇴🇲', n: 'Flag For Oman', f: 8, s: 'flag_om' }, { u: '1F1F5-1F1F0', e: '🇵🇰', n: 'Flag For Pakistan', f: 8, s: 'flag_pk' }, { u: '1F1F5-1F1FC', e: '🇵🇼', n: 'Flag For Palau', f: 8, s: 'flag_pw' }, { u: '1F1F5-1F1F8', e: '🇵🇸', n: 'Flag For Palestinian Territories', f: 8, s: 'flag_ps' }, { u: '1F1F5-1F1E6', e: '🇵🇦', n: 'Flag For Panama', f: 8, s: 'flag_pa' }, { u: '1F1F5-1F1EC', e: '🇵🇬', n: 'Flag For Papua New Guinea', f: 8, s: 'flag_pg' }, { u: '1F1F5-1F1FE', e: '🇵🇾', n: 'Flag For Paraguay', f: 8, s: 'flag_py' }, { u: '1F1F5-1F1EA', e: '🇵🇪', n: 'Flag For Peru', f: 8, s: 'flag_pe' }, { u: '1F1F5-1F1ED', e: '🇵🇭', n: 'Flag For Philippines', f: 8, s: 'flag_ph' }, { u: '1F1F5-1F1F3', e: '🇵🇳', n: 'Flag For Pitcairn Islands', f: 8, s: 'flag_pn' }, { u: '1F1F5-1F1F1', e: '🇵🇱', n: 'Flag For Poland', f: 8, s: 'flag_pl' }, { u: '1F1F5-1F1F9', e: '🇵🇹', n: 'Flag For Portugal', f: 8, s: 'flag_pt' }, { u: '1F1F5-1F1F7', e: '🇵🇷', n: 'Flag For Puerto Rico', f: 8, s: 'flag_pr' }, { u: '1F1F6-1F1E6', e: '🇶🇦', n: 'Flag For Qatar', f: 8, s: 'flag_qa' }, { u: '1F1F7-1F1EA', e: '🇷🇪', n: 'Flag For Réunion', f: 8, s: 'flag_re' }, { u: '1F1F7-1F1F4', e: '🇷🇴', n: 'Flag For Romania', f: 8, s: 'flag_ro' }, { u: '1F1F7-1F1FA', e: '🇷🇺', n: 'Flag For Russia', f: 8, s: 'flag_ru' }, { u: '1F1F7-1F1FC', e: '🇷🇼', n: 'Flag For Rwanda', f: 8, s: 'flag_rw' }, { u: '1F1E7-1F1F1', e: '🇧🇱', n: 'Flag For St. Barthélemy', f: 8, s: 'flag_bl' }, { u: '1F1F8-1F1ED', e: '🇸🇭', n: 'Flag For St. Helena', f: 8, s: 'flag_sh' }, { u: '1F1F0-1F1F3', e: '🇰🇳', n: 'Flag For St. Kitts & Nevis', f: 8, s: 'flag_kn' }, { u: '1F1F1-1F1E8', e: '🇱🇨', n: 'Flag For St. Lucia', f: 8, s: 'flag_lc' }, { u: '1F1F5-1F1F2', e: '🇵🇲', n: 'Flag For St. Pierre & Miquelon', f: 8, s: 'flag_pm' }, { u: '1F1FB-1F1E8', e: '🇻🇨', n: 'Flag For St. Vincent & Grenadines', f: 8, s: 'flag_vc' }, { u: '1F1FC-1F1F8', e: '🇼🇸', n: 'Flag For Samoa', f: 8, s: 'flag_ws' }, { u: '1F1F8-1F1F2', e: '🇸🇲', n: 'Flag For San Marino', f: 8, s: 'flag_sm' }, { u: '1F1F8-1F1F9', e: '🇸🇹', n: 'Flag For São Tomé & Príncipe', f: 8, s: 'flag_st' }, { u: '1F1F8-1F1E6', e: '🇸🇦', n: 'Flag For Saudi Arabia', f: 8, s: 'flag_sa' }, { u: '1F1F8-1F1F3', e: '🇸🇳', n: 'Flag For Senegal', f: 8, s: 'flag_sn' }, { u: '1F1F7-1F1F8', e: '🇷🇸', n: 'Flag For Serbia', f: 8, s: 'flag_rs' }, { u: '1F1F8-1F1E8', e: '🇸🇨', n: 'Flag For Seychelles', f: 8, s: 'flag_sc' }, { u: '1F1F8-1F1F1', e: '🇸🇱', n: 'Flag For Sierra Leone', f: 8, s: 'flag_sl' }, { u: '1F1F8-1F1EC', e: '🇸🇬', n: 'Flag For Singapore', f: 8, s: 'flag_sg' }, { u: '1F1F8-1F1FD', e: '🇸🇽', n: 'Flag For Sint Maarten', f: 8, s: 'flag_sx' }, { u: '1F1F8-1F1F0', e: '🇸🇰', n: 'Flag For Slovakia', f: 8, s: 'flag_sk' }, { u: '1F1F8-1F1EE', e: '🇸🇮', n: 'Flag For Slovenia', f: 8, s: 'flag_si' }, { u: '1F1F8-1F1E7', e: '🇸🇧', n: 'Flag For Solomon Islands', f: 8, s: 'flag_sb' }, { u: '1F1F8-1F1F4', e: '🇸🇴', n: 'Flag For Somalia', f: 8, s: 'flag_so' }, { u: '1F1FF-1F1E6', e: '🇿🇦', n: 'Flag For South Africa', f: 8, s: 'flag_za' }, { u: '1F1EC-1F1F8', e: '🇬🇸', n: 'Flag For South Georgia & South Sandwich Islands', f: 8, s: 'flag_gs' }, { u: '1F1F0-1F1F7', e: '🇰🇷', n: 'Flag For South Korea', f: 8, s: 'flag_kr' }, { u: '1F1F8-1F1F8', e: '🇸🇸', n: 'Flag For South Sudan', f: 8, s: 'flag_ss' }, { u: '1F1EA-1F1F8', e: '🇪🇸', n: 'Flag For Spain', f: 8, s: 'flag_es' }, { u: '1F1F1-1F1F0', e: '🇱🇰', n: 'Flag For Sri Lanka', f: 8, s: 'flag_lk' }, { u: '1F1F8-1F1E9', e: '🇸🇩', n: 'Flag For Sudan', f: 8, s: 'flag_sd' }, { u: '1F1F8-1F1F7', e: '🇸🇷', n: 'Flag For Suriname', f: 8, s: 'flag_sr' }, { u: '1F1F8-1F1FF', e: '🇸🇿', n: 'Flag For Swaziland', f: 8, s: 'flag_sz' }, { u: '1F1F8-1F1EA', e: '🇸🇪', n: 'Flag For Sweden', f: 8, s: 'flag_se' }, { u: '1F1E8-1F1ED', e: '🇨🇭', n: 'Flag For Switzerland', f: 8, s: 'flag_ch' }, { u: '1F1F8-1F1FE', e: '🇸🇾', n: 'Flag For Syria', f: 8, s: 'flag_sy' }, { u: '1F1F9-1F1FC', e: '🇹🇼', n: 'Flag For Taiwan', f: 8, s: 'flag_tw' }, { u: '1F1F9-1F1EF', e: '🇹🇯', n: 'Flag For Tajikistan', f: 8, s: 'flag_tj' }, { u: '1F1F9-1F1FF', e: '🇹🇿', n: 'Flag For Tanzania', f: 8, s: 'flag_tz' }, { u: '1F1F9-1F1ED', e: '🇹🇭', n: 'Flag For Thailand', f: 8, s: 'flag_th' }, { u: '1F1F9-1F1F1', e: '🇹🇱', n: 'Flag For Timor-leste', f: 8, s: 'flag_tl' }, { u: '1F1F9-1F1EC', e: '🇹🇬', n: 'Flag For Togo', f: 8, s: 'flag_tg' }, { u: '1F1F9-1F1F0', e: '🇹🇰', n: 'Flag For Tokelau', f: 8, s: 'flag_tk' }, { u: '1F1F9-1F1F4', e: '🇹🇴', n: 'Flag For Tonga', f: 8, s: 'flag_to' }, { u: '1F1F9-1F1F9', e: '🇹🇹', n: 'Flag For Trinidad & Tobago', f: 8, s: 'flag_tt' }, { u: '1F1F9-1F1F3', e: '🇹🇳', n: 'Flag For Tunisia', f: 8, s: 'flag_tn' }, { u: '1F1F9-1F1F7', e: '🇹🇷', n: 'Flag For Turkey', f: 8, s: 'flag_tr' }, { u: '1F1F9-1F1F2', e: '🇹🇲', n: 'Flag For Turkmenistan', f: 8, s: 'flag_tm' }, { u: '1F1F9-1F1E8', e: '🇹🇨', n: 'Flag For Turks & Caicos Islands', f: 8, s: 'flag_tc' }, { u: '1F1F9-1F1FB', e: '🇹🇻', n: 'Flag For Tuvalu', f: 8, s: 'flag_tv' }, { u: '1F1FA-1F1EC', e: '🇺🇬', n: 'Flag For Uganda', f: 8, s: 'flag_ug' }, { u: '1F1FA-1F1E6', e: '🇺🇦', n: 'Flag For Ukraine', f: 8, s: 'flag_ua' }, { u: '1F1E6-1F1EA', e: '🇦🇪', n: 'Flag For United Arab Emirates', f: 8, s: 'flag_ae' }, { u: '1F1EC-1F1E7', e: '🇬🇧', n: 'Flag For United Kingdom', f: 8, s: 'flag_gb' }, { u: '1F1FA-1F1F8', e: '🇺🇸', n: 'Flag For United States', f: 8, s: 'flag_us' }, { u: '1F1FB-1F1EE', e: '🇻🇮', n: 'Flag For U.S. Virgin Islands', f: 8, s: 'flag_vi' }, { u: '1F1FA-1F1FE', e: '🇺🇾', n: 'Flag For Uruguay', f: 8, s: 'flag_uy' }, { u: '1F1FA-1F1FF', e: '🇺🇿', n: 'Flag For Uzbekistan', f: 8, s: 'flag_uz' }, { u: '1F1FB-1F1FA', e: '🇻🇺', n: 'Flag For Vanuatu', f: 8, s: 'flag_vu' }, { u: '1F1FB-1F1E6', e: '🇻🇦', n: 'Flag For Vatican City', f: 8, s: 'flag_va' }, { u: '1F1FB-1F1EA', e: '🇻🇪', n: 'Flag For Venezuela', f: 8, s: 'flag_ve' }, { u: '1F1FB-1F1F3', e: '🇻🇳', n: 'Flag For Vietnam', f: 8, s: 'flag_vn' }, { u: '1F1FC-1F1EB', e: '🇼🇫', n: 'Flag For Wallis & Futuna', f: 8, s: 'flag_wf' }, { u: '1F1EA-1F1ED', e: '🇪🇭', n: 'Flag For Western Sahara', f: 8, s: 'flag_eh' }, { u: '1F1FE-1F1EA', e: '🇾🇪', n: 'Flag For Yemen', f: 8, s: 'flag_ye' }, { u: '1F1FF-1F1F2', e: '🇿🇲', n: 'Flag For Zambia', f: 8, s: 'flag_zm' }, { u: '1F1FF-1F1FC', e: '🇿🇼', n: 'Flag For Zimbabwe', f: 8, s: 'flag_zw' }, { u: '1F1E6-1F1E8', e: '🇦🇨', n: 'Flag For Ascension Island', f: 8, s: 'flag_ac' }, { u: '1F1E7-1F1FB', e: '🇧🇻', n: 'Flag For Bouvet Island', f: 8, s: 'flag_bv' }, { u: '1F1E8-1F1F5', e: '🇨🇵', n: 'Flag For Clipperton Island', f: 8, s: 'flag_cp' }, { u: '1F1E9-1F1EC', e: '🇩🇬', n: 'Flag For Diego Garcia', f: 8, s: 'flag_dg' }, { u: '1F1EA-1F1E6', e: '🇪🇦', n: 'Flag For Ceuta & Melilla', f: 8, s: 'flag_ea' }, { u: '1F1ED-1F1F2', e: '🇭🇲', n: 'Flag For Heard & Mcdonald Islands', f: 8, s: 'flag_hm' }, { u: '1F1F2-1F1EB', e: '🇲🇫', n: 'Flag For St. Martin', f: 8, s: 'flag_mf' }, { u: '1F1F8-1F1EF', e: '🇸🇯', n: 'Flag For Svalbard & Jan Mayen', f: 8, s: 'flag_sj' }, { u: '1F1F9-1F1E6', e: '🇹🇦', n: 'Flag For Tristan Da Cunha', f: 8, s: 'flag_ta' }, { u: '1F1FA-1F1F2', e: '🇺🇲', n: 'Flag For U.S. Outlying Islands', f: 8, s: 'flag_um' }, { u: '1F3FB', e: '🏻', n: 'Emoji Modifier Fitzpatrick Type-1-2', f: 9 }, { u: '1F3FC', e: '🏼', n: 'Emoji Modifier Fitzpatrick Type-3', f: 9 }, { u: '1F3FD', e: '🏽', n: 'Emoji Modifier Fitzpatrick Type-4', f: 9 }, { u: '1F3FE', e: '🏾', n: 'Emoji Modifier Fitzpatrick Type-5', f: 9 }, { u: '1F3FF', e: '🏿', n: 'Emoji Modifier Fitzpatrick Type-6', f: 9 }];
    var emojiFaceMap = {};
    var emojiTitleMap = {};
    for (var i = 0; i < table.length; i++) {
        if (table[i].s) {
            emojiFaceMap[table[i].u.toLowerCase()] = {
                code: table[i].u,
                title: table[i].s
            };
            if (table[i].u.indexOf('-') == -1) {
                emojiTitleMap[table[i].s] = {
                    code: table[i].u,
                    title: table[i].s
                }
            };
        }
    }
    function utf16toEntities(str) {
        var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
        // 检测utf16字符正则
        str = str.replace(patt, function (_char) {
            var H, L, code;
            if (_char.length === 2) {
                H = _char.charCodeAt(0);
                // 取出高位
                L = _char.charCodeAt(1);
                // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                // 转换算法
                return "&#" + code + ";";
            } else {
                return _char;
            }
        });
        return str;
    }
    util.emojiFaceReplace = function (str) {
        if (!str) return str;
        var patt = /[\ud800-\udbff][\udc00-\udfff]/g;
        str = str.replace(patt, function (_char) {
            var H, L, code;
            if (_char.length === 2) {
                H = _char.charCodeAt(0);
                // 取出高位
                L = _char.charCodeAt(1);
                // 取出低位
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00;
                // 转换算法
                code = code.toString(16).toLowerCase();
                if (emojiFaceMap[code]) {
                    return '<img src="img/emoji/' + code + '.png" title1="[emoji_' + emojiFaceMap[code].title + ']" class="emoji_face"/>';
                } else {
                    return '';
                }
            } else {
                return _char;
            }
        })
        var patt2 = /[\u0000-\uffff]/g;
        str = str.replace(patt2, function (_char) {
            var code;
            if (_char.length === 1) {
                code = _char.charCodeAt(0).toString(16).toLowerCase();;
                if (emojiFaceMap[code]) {
                    return '<img isface="1" src="img/emoji/' + code + '.png" title1="[emoji_' + emojiFaceMap[code].title + ']" class="emoji_face"/>';
                } else {
                    return _char;
                }
            } else {
                return _char;
            }
        })
        return str;
    }
    util.emojiFaceToImg = function (str) {
        var reg = /(title1=)?(?:'|")?(\[([^\]]+)\])(?:'|")?/gi;
        str = str.replace(reg, function (v1, v2, v3, v4) {
            var reg2 = /^emoji_/;
            if (reg2.test(v4)) {
                v4 = v4.replace(reg2, '');
                if (v2 === undefined && emojiTitleMap[v4] && emojiTitleMap[v4].code) {
                    return '<img isface="1" src="img/emoji/' + emojiTitleMap[v4].code.toLowerCase() + '.png" title1="[emoji_' + v4 + ']" class="emoji_face">';
                }
            }
            return v1;
        })
        return str;
    }
    util.emojiImgToUnicode = function (html) {
        var reg1 = /<img[^>]+(title1="(\[([^>]+)\])")[^>]*\/*>/gi;
        html = html.replace(reg1, function (v1, v2, v3, v4) {
            var reg = /^emoji_/;
            if (reg.test(v4)) {
                v4 = v4.replace(reg, '');
                if (emojiTitleMap[v4]) {
                    var code = parseInt(emojiTitleMap[v4].code, 16);
                    return String.fromCodePoint(code);
                }
            }
            return v1;
        })
        return html;
    }
    util.utf8To16 = function (str) {
        return str;
        var out, i, len, c;
        var char2, char3;

        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                    // 0xxxxxxx
                    out += str.charAt(i - 1);
                    break;
                case 12: case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    }
    util.urlify = function (obj) {
        var str = [];
        for (var p in obj) {
            if (Object.prototype.toString.call(obj[p]) === "[object Array]") {
                for (var i = 0; i < obj[p].length; i += 1) {
                    str.push(p + "=" + encodeURIComponent(obj[p][i]));
                }
            } else {
                str.push(p + "=" + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }

    var browser = (function () {
        var _browser, agent = navigator.userAgent.toLowerCase();
        if (null != agent.match(/trident/)) {
            _browser = {
                browser: 'msie',
                version: null != agent.match(/msie ([\d.]+)/) ? agent.match(/msie ([\d.]+)/)[1] : agent.match(/rv:([\d.]+)/)[1]
            };
        } else {
            var matches = /(msie) ([\w.]+)/.exec(agent) || /(chrome)[ \/]([\w.]+)/.exec(agent) || /(webkit)[ \/]([\w.]+)/.exec(agent) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(agent) || agent.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(agent) || [];
            _browser = {
                browser: matches[1] || '',
                version: matches[2] || "0"
            }
        }
        var result = {};
        if (_browser.browser) {
            result[_browser.browser] = true;
            result.version = _browser.version;
            result.name = _browser.browser;
            result.chrome ? result.webkit = !0 : result.webkit && (result.safari = !0);
        }
        return result;
    })();

    util.browser = browser;
    util.filterHtmlTag = function (str) {
        var reg = /<img\s+[^>]+\/*>/g;
        str = str.replace(reg, util.getKey('img'));
        reg = /<[^>]+>|<\/[^>]+>/g;
        str = str.replace(reg, '');
        return str;
    }
    var PinYin = { "a": "\u554a\u963f\u9515", "ai": "\u57c3\u6328\u54ce\u5509\u54c0\u7691\u764c\u853c\u77ee\u827e\u788d\u7231\u9698\u8bf6\u6371\u55f3\u55cc\u5ad2\u7477\u66a7\u7839\u953f\u972d", "an": "\u978d\u6c28\u5b89\u4ffa\u6309\u6697\u5cb8\u80fa\u6848\u8c19\u57ef\u63de\u72b4\u5eb5\u6849\u94f5\u9e4c\u9878\u9eef", "ang": "\u80ae\u6602\u76ce", "ao": "\u51f9\u6556\u71ac\u7ff1\u8884\u50b2\u5965\u61ca\u6fb3\u5773\u62d7\u55f7\u5662\u5c99\u5ed2\u9068\u5aaa\u9a9c\u8071\u87af\u93ca\u9ccc\u93d6", "ba": "\u82ad\u634c\u6252\u53ed\u5427\u7b06\u516b\u75a4\u5df4\u62d4\u8dcb\u9776\u628a\u8019\u575d\u9738\u7f62\u7238\u8307\u83dd\u8406\u636d\u5c9c\u705e\u6777\u94af\u7c91\u9c85\u9b43", "bai": "\u767d\u67cf\u767e\u6446\u4f70\u8d25\u62dc\u7a17\u859c\u63b0\u97b4", "ban": "\u6591\u73ed\u642c\u6273\u822c\u9881\u677f\u7248\u626e\u62cc\u4f34\u74e3\u534a\u529e\u7eca\u962a\u5742\u8c73\u94a3\u7622\u764d\u8228", "bang": "\u90a6\u5e2e\u6886\u699c\u8180\u7ed1\u68d2\u78c5\u868c\u9551\u508d\u8c24\u84a1\u8783", "bao": "\u82de\u80de\u5305\u8912\u96f9\u4fdd\u5821\u9971\u5b9d\u62b1\u62a5\u66b4\u8c79\u9c8d\u7206\u52f9\u8446\u5b80\u5b62\u7172\u9e28\u8913\u8db5\u9f85", "bo": "\u5265\u8584\u73bb\u83e0\u64ad\u62e8\u94b5\u6ce2\u535a\u52c3\u640f\u94c2\u7b94\u4f2f\u5e1b\u8236\u8116\u818a\u6e24\u6cca\u9a73\u4eb3\u8543\u5575\u997d\u6a97\u64d8\u7934\u94b9\u9e41\u7c38\u8ddb", "bei": "\u676f\u7891\u60b2\u5351\u5317\u8f88\u80cc\u8d1d\u94a1\u500d\u72c8\u5907\u60eb\u7119\u88ab\u5b5b\u9642\u90b6\u57e4\u84d3\u5457\u602b\u6096\u789a\u9e4e\u8919\u943e", "ben": "\u5954\u82ef\u672c\u7b28\u755a\u574c\u951b", "beng": "\u5d29\u7ef7\u752d\u6cf5\u8e66\u8ff8\u552a\u5623\u750f", "bi": "\u903c\u9f3b\u6bd4\u9119\u7b14\u5f7c\u78a7\u84d6\u853d\u6bd5\u6bd9\u6bd6\u5e01\u5e87\u75f9\u95ed\u655d\u5f0a\u5fc5\u8f9f\u58c1\u81c2\u907f\u965b\u5315\u4ef3\u4ffe\u8298\u835c\u8378\u5421\u54d4\u72f4\u5eb3\u610e\u6ed7\u6fde\u5f3c\u59a3\u5a62\u5b16\u74a7\u8d32\u7540\u94cb\u79d5\u88e8\u7b5a\u7b85\u7be6\u822d\u895e\u8df8\u9ac0", "bian": "\u97ad\u8fb9\u7f16\u8d2c\u6241\u4fbf\u53d8\u535e\u8fa8\u8fa9\u8fab\u904d\u533e\u5f01\u82c4\u5fed\u6c74\u7f0f\u7178\u782d\u78a5\u7a39\u7a86\u8759\u7b3e\u9cca", "biao": "\u6807\u5f6a\u8198\u8868\u5a4a\u9aa0\u98d1\u98d9\u98da\u706c\u9556\u9573\u762d\u88f1\u9cd4", "bie": "\u9cd6\u618b\u522b\u762a\u8e69\u9cd8", "bin": "\u5f6c\u658c\u6fd2\u6ee8\u5bbe\u6448\u50a7\u6d5c\u7f24\u73a2\u6ba1\u8191\u9554\u9acc\u9b13", "bing": "\u5175\u51b0\u67c4\u4e19\u79c9\u997c\u70b3\u75c5\u5e76\u7980\u90b4\u6452\u7ee0\u678b\u69df\u71f9", "bu": "\u6355\u535c\u54fa\u8865\u57e0\u4e0d\u5e03\u6b65\u7c3f\u90e8\u6016\u62ca\u535f\u900b\u74ff\u6661\u949a\u91ad", "ca": "\u64e6\u5693\u7924", "cai": "\u731c\u88c1\u6750\u624d\u8d22\u776c\u8e29\u91c7\u5f69\u83dc\u8521", "can": "\u9910\u53c2\u8695\u6b8b\u60ed\u60e8\u707f\u9a96\u74a8\u7cb2\u9eea", "cang": "\u82cd\u8231\u4ed3\u6ca7\u85cf\u4f27", "cao": "\u64cd\u7cd9\u69fd\u66f9\u8349\u8279\u5608\u6f15\u87ac\u825a", "ce": "\u5395\u7b56\u4fa7\u518c\u6d4b\u5202\u5e3b\u607b", "ceng": "\u5c42\u8e6d\u564c", "cha": "\u63d2\u53c9\u832c\u8336\u67e5\u78b4\u643d\u5bdf\u5c94\u5dee\u8be7\u7339\u9987\u6c4a\u59f9\u6748\u6942\u69ce\u6aab\u9497\u9538\u9572\u8869", "chai": "\u62c6\u67f4\u8c7a\u4faa\u8308\u7625\u867f\u9f87", "chan": "\u6400\u63ba\u8749\u998b\u8c17\u7f20\u94f2\u4ea7\u9610\u98a4\u5181\u8c04\u8c36\u8487\u5edb\u5fcf\u6f7a\u6fb6\u5b71\u7fbc\u5a75\u5b17\u9aa3\u89c7\u7985\u9561\u88e3\u87fe\u8e94", "chang": "\u660c\u7316\u573a\u5c1d\u5e38\u957f\u507f\u80a0\u5382\u655e\u7545\u5531\u5021\u4f25\u9b2f\u82cc\u83d6\u5f9c\u6005\u60dd\u960a\u5a3c\u5ae6\u6636\u6c05\u9cb3", "chao": "\u8d85\u6284\u949e\u671d\u5632\u6f6e\u5de2\u5435\u7092\u600a\u7ec9\u6641\u8016", "che": "\u8f66\u626f\u64a4\u63a3\u5f7b\u6f88\u577c\u5c6e\u7817", "chen": "\u90f4\u81e3\u8fb0\u5c18\u6668\u5ff1\u6c89\u9648\u8d81\u886c\u79f0\u8c0c\u62bb\u55d4\u5bb8\u741b\u6987\u809c\u80c2\u789c\u9f80", "cheng": "\u6491\u57ce\u6a59\u6210\u5448\u4e58\u7a0b\u60e9\u6f84\u8bda\u627f\u901e\u9a8b\u79e4\u57d5\u5d4a\u5fb5\u6d48\u67a8\u67fd\u6a18\u665f\u584d\u77a0\u94d6\u88ce\u86cf\u9172", "chi": "\u5403\u75f4\u6301\u5319\u6c60\u8fdf\u5f1b\u9a70\u803b\u9f7f\u4f88\u5c3a\u8d64\u7fc5\u65a5\u70bd\u50ba\u5880\u82aa\u830c\u640b\u53f1\u54e7\u557b\u55e4\u5f73\u996c\u6cb2\u5ab8\u6555\u80dd\u7719\u7735\u9e31\u761b\u892b\u86a9\u87ad\u7b1e\u7bea\u8c49\u8e05\u8e1f\u9b51", "chong": "\u5145\u51b2\u866b\u5d07\u5ba0\u833a\u5fe1\u61a7\u94f3\u825f", "chou": "\u62bd\u916c\u7574\u8e0c\u7a20\u6101\u7b79\u4ec7\u7ef8\u7785\u4e11\u4fe6\u5733\u5e31\u60c6\u6eb4\u59af\u7633\u96e0\u9c8b", "chu": "\u81ed\u521d\u51fa\u6a71\u53a8\u8e87\u9504\u96cf\u6ec1\u9664\u695a\u7840\u50a8\u77d7\u6410\u89e6\u5904\u4e8d\u520d\u61b7\u7ecc\u6775\u696e\u6a17\u870d\u8e70\u9edc", "chuan": "\u63e3\u5ddd\u7a7f\u693d\u4f20\u8239\u5598\u4e32\u63be\u821b\u60f4\u9044\u5ddb\u6c1a\u948f\u9569\u8221", "chuang": "\u75ae\u7a97\u5e62\u5e8a\u95ef\u521b\u6006", "chui": "\u5439\u708a\u6376\u9524\u5782\u9672\u68f0\u69cc", "chun": "\u6625\u693f\u9187\u5507\u6df3\u7eaf\u8822\u4fc3\u83bc\u6c8c\u80ab\u6710\u9e51\u877d", "chuo": "\u6233\u7ef0\u851f\u8fb6\u8f8d\u955e\u8e14\u9f8a", "ci": "\u75b5\u8328\u78c1\u96cc\u8f9e\u6148\u74f7\u8bcd\u6b64\u523a\u8d50\u6b21\u8360\u5472\u5d6f\u9e5a\u8785\u7ccd\u8d91", "cong": "\u806a\u8471\u56f1\u5306\u4ece\u4e1b\u506c\u82c1\u6dd9\u9aa2\u742e\u7481\u679e", "cu": "\u51d1\u7c97\u918b\u7c07\u731d\u6b82\u8e59", "cuan": "\u8e7f\u7be1\u7a9c\u6c46\u64ba\u6615\u7228", "cui": "\u6467\u5d14\u50ac\u8106\u7601\u7cb9\u6dec\u7fe0\u8403\u60b4\u7480\u69b1\u96b9", "cun": "\u6751\u5b58\u5bf8\u78cb\u5fd6\u76b4", "cuo": "\u64ae\u6413\u63aa\u632b\u9519\u539d\u811e\u9509\u77ec\u75e4\u9e7e\u8e49\u8e9c", "da": "\u642d\u8fbe\u7b54\u7629\u6253\u5927\u8037\u54d2\u55d2\u601b\u59b2\u75b8\u8921\u7b2a\u977c\u9791", "dai": "\u5446\u6b79\u50a3\u6234\u5e26\u6b86\u4ee3\u8d37\u888b\u5f85\u902e\u6020\u57ed\u7519\u5454\u5cb1\u8fe8\u902f\u9a80\u7ed0\u73b3\u9edb", "dan": "\u803d\u62c5\u4e39\u5355\u90f8\u63b8\u80c6\u65e6\u6c2e\u4f46\u60ee\u6de1\u8bde\u5f39\u86cb\u4ebb\u510b\u5369\u840f\u5556\u6fb9\u6a90\u6b9a\u8d55\u7708\u7605\u8043\u7baa", "dang": "\u5f53\u6321\u515a\u8361\u6863\u8c20\u51fc\u83ea\u5b95\u7800\u94db\u88c6", "dao": "\u5200\u6363\u8e48\u5012\u5c9b\u7977\u5bfc\u5230\u7a3b\u60bc\u9053\u76d7\u53e8\u5541\u5fc9\u6d2e\u6c18\u7118\u5fd1\u7e9b", "de": "\u5fb7\u5f97\u7684\u951d", "deng": "\u8e6c\u706f\u767b\u7b49\u77aa\u51f3\u9093\u5654\u5d9d\u6225\u78f4\u956b\u7c26", "di": "\u5824\u4f4e\u6ef4\u8fea\u654c\u7b1b\u72c4\u6da4\u7fdf\u5ae1\u62b5\u5e95\u5730\u8482\u7b2c\u5e1d\u5f1f\u9012\u7f14\u6c10\u7c74\u8bcb\u8c1b\u90b8\u577b\u839c\u837b\u5600\u5a23\u67e2\u68e3\u89cc\u7825\u78b2\u7747\u955d\u7f9d\u9ab6", "dian": "\u98a0\u6382\u6ec7\u7898\u70b9\u5178\u975b\u57ab\u7535\u4f43\u7538\u5e97\u60e6\u5960\u6dc0\u6bbf\u4e36\u963d\u576b\u57dd\u5dc5\u73b7\u765c\u766b\u7c1f\u8e2e", "diao": "\u7889\u53fc\u96d5\u51cb\u5201\u6389\u540a\u9493\u8c03\u8f7a\u94de\u8729\u7c9c\u8c82", "die": "\u8dcc\u7239\u789f\u8776\u8fed\u8c0d\u53e0\u4f5a\u57a4\u581e\u63f2\u558b\u6e2b\u8f76\u7252\u74de\u8936\u800b\u8e40\u9cbd\u9cce", "ding": "\u4e01\u76ef\u53ee\u9489\u9876\u9f0e\u952d\u5b9a\u8ba2\u4e22\u4ec3\u5576\u738e\u815a\u7887\u753a\u94e4\u7594\u8035\u914a", "dong": "\u4e1c\u51ac\u8463\u61c2\u52a8\u680b\u4f97\u606b\u51bb\u6d1e\u578c\u549a\u5cbd\u5cd2\u5902\u6c21\u80e8\u80f4\u7850\u9e2b", "dou": "\u515c\u6296\u6597\u9661\u8c46\u9017\u75d8\u8538\u94ad\u7aa6\u7aac\u86aa\u7bfc\u9161", "du": "\u90fd\u7763\u6bd2\u728a\u72ec\u8bfb\u5835\u7779\u8d4c\u675c\u9540\u809a\u5ea6\u6e21\u5992\u828f\u561f\u6e0e\u691f\u6a50\u724d\u8839\u7b03\u9ad1\u9ee9", "duan": "\u7aef\u77ed\u953b\u6bb5\u65ad\u7f0e\u5f56\u6934\u7145\u7c16", "dui": "\u5806\u5151\u961f\u5bf9\u603c\u619d\u7893", "dun": "\u58a9\u5428\u8e72\u6566\u987f\u56e4\u949d\u76fe\u9041\u7096\u7818\u7905\u76f9\u9566\u8db8", "duo": "\u6387\u54c6\u591a\u593a\u579b\u8eb2\u6735\u8dfa\u8235\u5241\u60f0\u5815\u5484\u54da\u7f0d\u67c1\u94ce\u88f0\u8e31", "e": "\u86fe\u5ce8\u9e45\u4fc4\u989d\u8bb9\u5a25\u6076\u5384\u627c\u904f\u9102\u997f\u5669\u8c14\u57a9\u57ad\u82ca\u83aa\u843c\u5443\u6115\u5c59\u5a40\u8f6d\u66f7\u816d\u786a\u9507\u9537\u9e57\u989a\u9cc4", "en": "\u6069\u84bd\u6441\u5514\u55ef", "er": "\u800c\u513f\u8033\u5c14\u9975\u6d31\u4e8c\u8d30\u8fe9\u73e5\u94d2\u9e38\u9c95", "fa": "\u53d1\u7f5a\u7b4f\u4f10\u4e4f\u9600\u6cd5\u73d0\u57a1\u781d", "fan": "\u85e9\u5e06\u756a\u7ffb\u6a0a\u77fe\u9492\u7e41\u51e1\u70e6\u53cd\u8fd4\u8303\u8d29\u72af\u996d\u6cdb\u8629\u5e61\u72ad\u68b5\u6535\u71d4\u7548\u8e6f", "fang": "\u574a\u82b3\u65b9\u80aa\u623f\u9632\u59a8\u4eff\u8bbf\u7eba\u653e\u531a\u90a1\u5f77\u94ab\u822b\u9c82", "fei": "\u83f2\u975e\u5561\u98de\u80a5\u532a\u8bfd\u5420\u80ba\u5e9f\u6cb8\u8d39\u82be\u72d2\u60b1\u6ddd\u5983\u7ecb\u7eef\u69a7\u8153\u6590\u6249\u7953\u7829\u9544\u75f1\u871a\u7bda\u7fe1\u970f\u9cb1", "fen": "\u82ac\u915a\u5429\u6c1b\u5206\u7eb7\u575f\u711a\u6c7e\u7c89\u594b\u4efd\u5fff\u6124\u7caa\u507e\u7035\u68fc\u610d\u9cbc\u9f22", "feng": "\u4e30\u5c01\u67ab\u8702\u5cf0\u950b\u98ce\u75af\u70fd\u9022\u51af\u7f1d\u8bbd\u5949\u51e4\u4ff8\u9146\u8451\u6ca3\u781c", "fu": "\u4f5b\u5426\u592b\u6577\u80a4\u5b75\u6276\u62c2\u8f90\u5e45\u6c1f\u7b26\u4f0f\u4fd8\u670d\u6d6e\u6daa\u798f\u88b1\u5f17\u752b\u629a\u8f85\u4fef\u91dc\u65a7\u812f\u8151\u5e9c\u8150\u8d74\u526f\u8986\u8d4b\u590d\u5085\u4ed8\u961c\u7236\u8179\u8d1f\u5bcc\u8ba3\u9644\u5987\u7f1a\u5490\u5310\u51eb\u90db\u8299\u82fb\u832f\u83a9\u83d4\u544b\u5e5e\u6ecf\u8274\u5b5a\u9a78\u7ec2\u6874\u8d59\u9efb\u9efc\u7f58\u7a03\u99a5\u864d\u86a8\u8709\u8760\u876e\u9eb8\u8dba\u8dd7\u9cc6", "ga": "\u5676\u560e\u86e4\u5c2c\u5477\u5c15\u5c1c\u65ee\u9486", "gai": "\u8be5\u6539\u6982\u9499\u76d6\u6e89\u4e10\u9654\u5793\u6224\u8d45\u80f2", "gan": "\u5e72\u7518\u6746\u67d1\u7aff\u809d\u8d76\u611f\u79c6\u6562\u8d63\u5769\u82f7\u5c34\u64c0\u6cd4\u6de6\u6f89\u7ec0\u6a44\u65f0\u77f8\u75b3\u9150", "gang": "\u5188\u521a\u94a2\u7f38\u809b\u7eb2\u5c97\u6e2f\u6206\u7f61\u9883\u7b7b", "gong": "\u6760\u5de5\u653b\u529f\u606d\u9f9a\u4f9b\u8eac\u516c\u5bab\u5f13\u5de9\u6c5e\u62f1\u8d21\u5171\u857b\u5efe\u54a3\u73d9\u80b1\u86a3\u86e9\u89e5", "gao": "\u7bd9\u768b\u9ad8\u818f\u7f94\u7cd5\u641e\u9550\u7a3f\u544a\u777e\u8bf0\u90dc\u84bf\u85c1\u7f1f\u69d4\u69c1\u6772\u9506", "ge": "\u54e5\u6b4c\u6401\u6208\u9e3d\u80f3\u7599\u5272\u9769\u845b\u683c\u9601\u9694\u94ec\u4e2a\u5404\u9b32\u4ee1\u54ff\u5865\u55dd\u7ea5\u643f\u8188\u784c\u94ea\u9549\u88bc\u988c\u867c\u8238\u9abc\u9ac2", "gei": "\u7ed9", "gen": "\u6839\u8ddf\u4e98\u831b\u54cf\u826e", "geng": "\u8015\u66f4\u5e9a\u7fb9\u57c2\u803f\u6897\u54fd\u8d53\u9ca0", "gou": "\u94a9\u52fe\u6c9f\u82df\u72d7\u57a2\u6784\u8d2d\u591f\u4f5d\u8bdf\u5ca3\u9058\u5abe\u7f11\u89cf\u5f40\u9e32\u7b31\u7bdd\u97b2", "gu": "\u8f9c\u83c7\u5495\u7b8d\u4f30\u6cbd\u5b64\u59d1\u9f13\u53e4\u86ca\u9aa8\u8c37\u80a1\u6545\u987e\u56fa\u96c7\u560f\u8bc2\u83f0\u54cc\u5d2e\u6c69\u688f\u8f71\u726f\u727f\u80cd\u81cc\u6bc2\u77bd\u7f5f\u94b4\u9522\u74e0\u9e2a\u9e44\u75fc\u86c4\u9164\u89da\u9cb4\u9ab0\u9e58", "gua": "\u522e\u74dc\u5250\u5be1\u6302\u8902\u5366\u8bd6\u5471\u681d\u9e39", "guai": "\u4e56\u62d0\u602a\u54d9", "guan": "\u68fa\u5173\u5b98\u51a0\u89c2\u7ba1\u9986\u7f50\u60ef\u704c\u8d2f\u500c\u839e\u63bc\u6dab\u76e5\u9e73\u9ccf", "guang": "\u5149\u5e7f\u901b\u72b7\u6844\u80f1\u7592", "gui": "\u7470\u89c4\u572d\u7845\u5f52\u9f9f\u95fa\u8f68\u9b3c\u8be1\u7678\u6842\u67dc\u8dea\u8d35\u523d\u5326\u523f\u5e8b\u5b84\u59ab\u6867\u7085\u6677\u7688\u7c0b\u9c91\u9cdc", "gun": "\u8f8a\u6eda\u68cd\u4e28\u886e\u7ef2\u78d9\u9ca7", "guo": "\u9505\u90ed\u56fd\u679c\u88f9\u8fc7\u9998\u8803\u57da\u63b4\u5459\u56d7\u5e3c\u5d1e\u7313\u6901\u8662\u951e\u8052\u872e\u873e\u8748", "ha": "\u54c8", "hai": "\u9ab8\u5b69\u6d77\u6c26\u4ea5\u5bb3\u9a87\u54b4\u55e8\u988f\u91a2", "han": "\u9163\u61a8\u90af\u97e9\u542b\u6db5\u5bd2\u51fd\u558a\u7f55\u7ff0\u64bc\u634d\u65f1\u61be\u608d\u710a\u6c57\u6c49\u9097\u83e1\u6496\u961a\u701a\u6657\u7113\u9894\u86b6\u9f3e", "hen": "\u592f\u75d5\u5f88\u72e0\u6068", "hang": "\u676d\u822a\u6c86\u7ed7\u73e9\u6841", "hao": "\u58d5\u568e\u8c6a\u6beb\u90dd\u597d\u8017\u53f7\u6d69\u8585\u55e5\u5686\u6fe0\u704f\u660a\u7693\u98a2\u869d", "he": "\u5475\u559d\u8377\u83cf\u6838\u79be\u548c\u4f55\u5408\u76d2\u8c89\u9602\u6cb3\u6db8\u8d6b\u8910\u9e64\u8d3a\u8bc3\u52be\u58d1\u85ff\u55d1\u55ec\u9616\u76cd\u86b5\u7fee", "hei": "\u563f\u9ed1", "heng": "\u54fc\u4ea8\u6a2a\u8861\u6052\u8a07\u8605", "hong": "\u8f70\u54c4\u70d8\u8679\u9e3f\u6d2a\u5b8f\u5f18\u7ea2\u9ec9\u8ba7\u836d\u85a8\u95f3\u6cd3", "hou": "\u5589\u4faf\u7334\u543c\u539a\u5019\u540e\u5820\u5f8c\u9005\u760a\u7bcc\u7cc7\u9c8e\u9aba", "hu": "\u547c\u4e4e\u5ffd\u745a\u58f6\u846b\u80e1\u8774\u72d0\u7cca\u6e56\u5f27\u864e\u552c\u62a4\u4e92\u6caa\u6237\u51b1\u553f\u56eb\u5cb5\u7322\u6019\u60da\u6d52\u6ef9\u7425\u69f2\u8f77\u89f3\u70c0\u7173\u623d\u6248\u795c\u9e55\u9e71\u7b0f\u9190\u659b", "hua": "\u82b1\u54d7\u534e\u733e\u6ed1\u753b\u5212\u5316\u8bdd\u5290\u6d4d\u9a85\u6866\u94e7\u7a1e", "huai": "\u69d0\u5f8a\u6000\u6dee\u574f\u8fd8\u8e1d", "huan": "\u6b22\u73af\u6853\u7f13\u6362\u60a3\u5524\u75ea\u8c62\u7115\u6da3\u5ba6\u5e7b\u90c7\u5942\u57b8\u64d0\u571c\u6d39\u6d63\u6f36\u5bf0\u902d\u7f33\u953e\u9ca9\u9b1f", "huang": "\u8352\u614c\u9ec4\u78fa\u8757\u7c27\u7687\u51f0\u60f6\u714c\u6643\u5e4c\u604d\u8c0e\u968d\u5fa8\u6e5f\u6f62\u9051\u749c\u8093\u7640\u87e5\u7bc1\u9cc7", "hui": "\u7070\u6325\u8f89\u5fbd\u6062\u86d4\u56de\u6bc1\u6094\u6167\u5349\u60e0\u6666\u8d3f\u79fd\u4f1a\u70e9\u6c47\u8bb3\u8bf2\u7ed8\u8bd9\u8334\u835f\u8559\u54d5\u5599\u96b3\u6d04\u5f57\u7f0b\u73f2\u6656\u605a\u867a\u87ea\u9ebe", "hun": "\u8364\u660f\u5a5a\u9b42\u6d51\u6df7\u8be8\u9984\u960d\u6eb7\u7f17", "huo": "\u8c41\u6d3b\u4f19\u706b\u83b7\u6216\u60d1\u970d\u8d27\u7978\u6509\u56af\u5925\u94ac\u952a\u956c\u8020\u8816", "ji": "\u51fb\u573e\u57fa\u673a\u7578\u7a3d\u79ef\u7b95\u808c\u9965\u8ff9\u6fc0\u8ba5\u9e21\u59ec\u7ee9\u7f09\u5409\u6781\u68d8\u8f91\u7c4d\u96c6\u53ca\u6025\u75be\u6c72\u5373\u5ac9\u7ea7\u6324\u51e0\u810a\u5df1\u84df\u6280\u5180\u5b63\u4f0e\u796d\u5242\u60b8\u6d4e\u5bc4\u5bc2\u8ba1\u8bb0\u65e2\u5fcc\u9645\u5993\u7ee7\u7eaa\u5c45\u4e0c\u4e69\u525e\u4f76\u4f74\u8114\u58bc\u82a8\u82b0\u8401\u84ba\u857a\u638e\u53fd\u54ad\u54dc\u5527\u5c8c\u5d74\u6d0e\u5f50\u5c50\u9aa5\u757f\u7391\u696b\u6b9b\u621f\u6222\u8d4d\u89ca\u7284\u9f51\u77f6\u7f81\u5d47\u7a37\u7620\u7635\u866e\u7b08\u7b04\u66a8\u8dfb\u8dfd\u9701\u9c9a\u9cab\u9afb\u9e82", "jia": "\u5609\u67b7\u5939\u4f73\u5bb6\u52a0\u835a\u988a\u8d3e\u7532\u94be\u5047\u7a3c\u4ef7\u67b6\u9a7e\u5ac1\u4f3d\u90cf\u62ee\u5cac\u6d43\u8fe6\u73c8\u621b\u80db\u605d\u94d7\u9553\u75c2\u86f1\u7b33\u8888\u8dcf", "jian": "\u6b7c\u76d1\u575a\u5c16\u7b3a\u95f4\u714e\u517c\u80a9\u8270\u5978\u7f04\u8327\u68c0\u67ec\u78b1\u7877\u62e3\u6361\u7b80\u4fed\u526a\u51cf\u8350\u69db\u9274\u8df5\u8d31\u89c1\u952e\u7bad\u4ef6\u5065\u8230\u5251\u996f\u6e10\u6e85\u6da7\u5efa\u50ed\u8c0f\u8c2b\u83c5\u84b9\u641b\u56dd\u6e54\u8e47\u8b07\u7f23\u67a7\u67d9\u6957\u620b\u622c\u726e\u728d\u6bfd\u8171\u7751\u950f\u9e63\u88e5\u7b15\u7bb4\u7fe6\u8dbc\u8e3a\u9ca3\u97af", "jiang": "\u5F3A\u50f5\u59dc\u5c06\u6d46\u6c5f\u7586\u848b\u6868\u5956\u8bb2\u5320\u9171\u964d\u8333\u6d1a\u7edb\u7f30\u729f\u7913\u8029\u7ce8\u8c47", "jiao": "\u8549\u6912\u7901\u7126\u80f6\u4ea4\u90ca\u6d47\u9a84\u5a07\u56bc\u6405\u94f0\u77eb\u4fa5\u811a\u72e1\u89d2\u997a\u7f34\u7ede\u527f\u6559\u9175\u8f7f\u8f83\u53eb\u4f7c\u50ec\u832d\u6322\u564d\u5ce4\u5fbc\u59e3\u7e9f\u656b\u768e\u9e6a\u86df\u91ae\u8de4\u9c9b", "jie": "\u7a96\u63ed\u63a5\u7686\u79f8\u8857\u9636\u622a\u52ab\u8282\u6854\u6770\u6377\u776b\u7aed\u6d01\u7ed3\u89e3\u59d0\u6212\u85c9\u82a5\u754c\u501f\u4ecb\u75a5\u8beb\u5c4a\u5048\u8ba6\u8bd8\u5588\u55df\u736c\u5a55\u5b51\u6840\u7352\u78a3\u9534\u7596\u88b7\u9889\u86a7\u7faf\u9c92\u9ab1\u9aeb", "jin": "\u5dfe\u7b4b\u65a4\u91d1\u4eca\u6d25\u895f\u7d27\u9526\u4ec5\u8c28\u8fdb\u9773\u664b\u7981\u8fd1\u70ec\u6d78\u5c3d\u537a\u8369\u5807\u5664\u9991\u5ed1\u5997\u7f19\u747e\u69ff\u8d46\u89d0\u9485\u9513\u887f\u77dc", "jing": "\u52b2\u8346\u5162\u830e\u775b\u6676\u9cb8\u4eac\u60ca\u7cbe\u7cb3\u7ecf\u4e95\u8b66\u666f\u9888\u9759\u5883\u656c\u955c\u5f84\u75c9\u9756\u7adf\u7ade\u51c0\u522d\u5106\u9631\u83c1\u734d\u61ac\u6cfe\u8ff3\u5f2a\u5a67\u80bc\u80eb\u8148\u65cc", "jiong": "\u70af\u7a98\u5182\u8fe5\u6243", "jiu": "\u63ea\u7a76\u7ea0\u7396\u97ed\u4e45\u7078\u4e5d\u9152\u53a9\u6551\u65e7\u81fc\u8205\u548e\u5c31\u759a\u50e6\u557e\u9604\u67e9\u6855\u9e6b\u8d73\u9b0f", "ju": "\u97a0\u62d8\u72d9\u75bd\u9a79\u83ca\u5c40\u5480\u77e9\u4e3e\u6cae\u805a\u62d2\u636e\u5de8\u5177\u8ddd\u8e1e\u952f\u4ff1\u53e5\u60e7\u70ac\u5267\u5028\u8bb5\u82e3\u82f4\u8392\u63ac\u907d\u5c66\u741a\u67b8\u6910\u6998\u6989\u6a58\u728b\u98d3\u949c\u9514\u7aad\u88fe\u8d84\u91b5\u8e3d\u9f83\u96ce\u97ab", "juan": "\u6350\u9e43\u5a1f\u5026\u7737\u5377\u7ee2\u9104\u72f7\u6d93\u684a\u8832\u9529\u954c\u96bd", "jue": "\u6485\u652b\u6289\u6398\u5014\u7235\u89c9\u51b3\u8bc0\u7edd\u53a5\u5282\u8c32\u77cd\u8568\u5658\u5d1b\u7357\u5b53\u73cf\u6877\u6a5b\u721d\u9562\u8e76\u89d6", "jun": "\u5747\u83cc\u94a7\u519b\u541b\u5cfb\u4fca\u7ae3\u6d5a\u90e1\u9a8f\u6343\u72fb\u76b2\u7b60\u9e87", "ka": "\u5580\u5496\u5361\u4f67\u5494\u80e9", "ke": "\u54af\u5777\u82db\u67ef\u68f5\u78d5\u9897\u79d1\u58f3\u54b3\u53ef\u6e34\u514b\u523b\u5ba2\u8bfe\u5ca2\u606a\u6e98\u9a92\u7f02\u73c2\u8f72\u6c2a\u778c\u94b6\u75b4\u7aa0\u874c\u9ac1", "kai": "\u5f00\u63e9\u6977\u51ef\u6168\u5240\u57b2\u8488\u5ffe\u607a\u94e0\u950e", "kan": "\u520a\u582a\u52d8\u574e\u780d\u770b\u4f83\u51f5\u83b0\u83b6\u6221\u9f9b\u77b0", "kang": "\u5eb7\u6177\u7ce0\u625b\u6297\u4ea2\u7095\u5751\u4f09\u95f6\u94aa", "kao": "\u8003\u62f7\u70e4\u9760\u5c3b\u6832\u7292\u94d0", "ken": "\u80af\u5543\u57a6\u6073\u57a0\u88c9\u9880", "keng": "\u542d\u5fd0\u94ff", "kong": "\u7a7a\u6050\u5b54\u63a7\u5025\u5d06\u7b9c", "kou": "\u62a0\u53e3\u6263\u5bc7\u82a4\u853b\u53e9\u770d\u7b58", "ku": "\u67af\u54ed\u7a9f\u82e6\u9177\u5e93\u88e4\u5233\u5800\u55be\u7ed4\u9ab7", "kua": "\u5938\u57ae\u630e\u8de8\u80ef\u4f89", "kuai": "\u5757\u7b77\u4fa9\u5feb\u84af\u90d0\u8489\u72ef\u810d", "kuan": "\u5bbd\u6b3e\u9acb", "kuang": "\u5321\u7b50\u72c2\u6846\u77ff\u7736\u65f7\u51b5\u8bd3\u8bf3\u909d\u5739\u593c\u54d0\u7ea9\u8d36", "kui": "\u4e8f\u76d4\u5cbf\u7aa5\u8475\u594e\u9b41\u5080\u9988\u6127\u6e83\u9997\u532e\u5914\u9697\u63c6\u55b9\u559f\u609d\u6126\u9615\u9035\u668c\u777d\u8069\u8770\u7bd1\u81fe\u8dec", "kun": "\u5764\u6606\u6346\u56f0\u6083\u9603\u7428\u951f\u918c\u9cb2\u9ae1", "kuo": "\u62ec\u6269\u5ed3\u9614\u86de", "la": "\u5783\u62c9\u5587\u8721\u814a\u8fa3\u5566\u524c\u647a\u908b\u65ef\u782c\u760c", "lai": "\u83b1\u6765\u8d56\u5d03\u5f95\u6d9e\u6fd1\u8d49\u7750\u94fc\u765e\u7c41", "lan": "\u84dd\u5a6a\u680f\u62e6\u7bee\u9611\u5170\u6f9c\u8c30\u63fd\u89c8\u61d2\u7f06\u70c2\u6ee5\u5549\u5c9a\u61d4\u6f24\u6984\u6593\u7f71\u9567\u8934", "lang": "\u7405\u6994\u72fc\u5eca\u90ce\u6717\u6d6a\u83a8\u8497\u5577\u9606\u9512\u7a02\u8782", "lao": "\u635e\u52b3\u7262\u8001\u4f6c\u59e5\u916a\u70d9\u6d9d\u5520\u5d02\u6833\u94d1\u94f9\u75e8\u91aa", "le": "\u52d2\u4e50\u808b\u4ec2\u53fb\u561e\u6cd0\u9cd3", "lei": "\u96f7\u956d\u857e\u78ca\u7d2f\u5121\u5792\u64c2\u7c7b\u6cea\u7fb8\u8bd4\u837d\u54a7\u6f2f\u5ad8\u7f27\u6a91\u8012\u9179", "ling": "\u68f1\u62ce\u73b2\u83f1\u96f6\u9f84\u94c3\u4f36\u7f9a\u51cc\u7075\u9675\u5cad\u9886\u53e6\u4ee4\u9143\u5844\u82d3\u5464\u56f9\u6ce0\u7eeb\u67c3\u68c2\u74f4\u8046\u86c9\u7fce\u9cae", "leng": "\u695e\u6123\u51b7", "li": "\u5398\u68a8\u7281\u9ece\u7bf1\u72f8\u79bb\u6f13\u7406\u674e\u91cc\u9ca4\u793c\u8389\u8354\u540f\u6817\u4e3d\u5389\u52b1\u783e\u5386\u5229\u5088\u4f8b\u4fd0\u75e2\u7acb\u7c92\u6ca5\u96b6\u529b\u7483\u54e9\u4fea\u4fda\u90e6\u575c\u82c8\u8385\u84e0\u85dc\u6369\u5456\u5533\u55b1\u7301\u6ea7\u6fa7\u9026\u5a0c\u5ae0\u9a8a\u7f21\u73de\u67a5\u680e\u8f79\u623e\u783a\u8a48\u7f79\u9502\u9e42\u75a0\u75ac\u86ce\u870a\u8821\u7b20\u7be5\u7c9d\u91b4\u8dde\u96f3\u9ca1\u9ce2\u9ee7", "lian": "\u4fe9\u8054\u83b2\u8fde\u9570\u5ec9\u601c\u6d9f\u5e18\u655b\u8138\u94fe\u604b\u70bc\u7ec3\u631b\u8539\u5941\u6f4b\u6fc2\u5a08\u740f\u695d\u6b93\u81c1\u81a6\u88e2\u880a\u9ca2", "liang": "\u7cae\u51c9\u6881\u7cb1\u826f\u4e24\u8f86\u91cf\u667e\u4eae\u8c05\u589a\u690b\u8e09\u9753\u9b49", "liao": "\u64a9\u804a\u50da\u7597\u71ce\u5be5\u8fbd\u6f66\u4e86\u6482\u9563\u5ed6\u6599\u84fc\u5c25\u5639\u7360\u5bee\u7f2d\u948c\u9e69\u8022", "lie": "\u5217\u88c2\u70c8\u52a3\u730e\u51bd\u57d2\u6d0c\u8d94\u8e90\u9b23", "lin": "\u7433\u6797\u78f7\u9716\u4e34\u90bb\u9cde\u6dcb\u51db\u8d41\u541d\u853a\u5d99\u5eea\u9074\u6aa9\u8f9a\u77b5\u7cbc\u8e8f\u9e9f", "liu": "\u6e9c\u7409\u69b4\u786b\u998f\u7559\u5218\u7624\u6d41\u67f3\u516d\u62a1\u507b\u848c\u6cd6\u6d4f\u905b\u9a9d\u7efa\u65d2\u7198\u950d\u954f\u9e68\u938f", "long": "\u9f99\u804b\u5499\u7b3c\u7abf\u9686\u5784\u62e2\u9647\u5f04\u5785\u830f\u6cf7\u73d1\u680a\u80e7\u783b\u7643", "lou": "\u697c\u5a04\u6402\u7bd3\u6f0f\u964b\u55bd\u5d5d\u9542\u7618\u8027\u877c\u9ac5", "lu": "\u82a6\u5362\u9885\u5e90\u7089\u63b3\u5364\u864f\u9c81\u9e93\u788c\u9732\u8def\u8d42\u9e7f\u6f5e\u7984\u5f55\u9646\u622e\u5786\u6445\u64b8\u565c\u6cf8\u6e0c\u6f09\u7490\u680c\u6a79\u8f73\u8f82\u8f98\u6c07\u80ea\u9565\u9e2c\u9e6d\u7c0f\u823b\u9c88", "lv": "\u9a74\u5415\u94dd\u4fa3\u65c5\u5c65\u5c61\u7f15\u8651\u6c2f\u5f8b\u7387\u6ee4\u7eff\u634b\u95fe\u6988\u8182\u7a06\u891b", "luan": "\u5ce6\u5b6a\u6ee6\u5375\u4e71\u683e\u9e3e\u92ae", "lue": "\u63a0\u7565\u950a", "lun": "\u8f6e\u4f26\u4ed1\u6ca6\u7eb6\u8bba\u56f5", "luo": "\u841d\u87ba\u7f57\u903b\u9523\u7ba9\u9aa1\u88f8\u843d\u6d1b\u9a86\u7edc\u502e\u8366\u645e\u7321\u6cfa\u6924\u8136\u9559\u7630\u96d2", "ma": "\u5988\u9ebb\u739b\u7801\u8682\u9a6c\u9a82\u561b\u5417\u551b\u72b8\u5b37\u6769\u9ebd", "mai": "\u57cb\u4e70\u9ea6\u5356\u8fc8\u8109\u52a2\u836c\u54aa\u973e", "man": "\u7792\u9992\u86ee\u6ee1\u8513\u66fc\u6162\u6f2b\u8c29\u5881\u5e54\u7f26\u71b3\u9558\u989f\u87a8\u9cd7\u9794", "mang": "\u8292\u832b\u76f2\u5fd9\u83bd\u9099\u6f2d\u6726\u786d\u87d2", "meng": "\u6c13\u840c\u8499\u6aac\u76df\u9530\u731b\u68a6\u5b5f\u52d0\u750d\u77a2\u61f5\u791e\u867b\u8722\u8813\u824b\u8268\u9efe", "miao": "\u732b\u82d7\u63cf\u7784\u85d0\u79d2\u6e3a\u5e99\u5999\u55b5\u9088\u7f08\u7f2a\u676a\u6dfc\u7707\u9e4b\u8731", "mao": "\u8305\u951a\u6bdb\u77db\u94c6\u536f\u8302\u5192\u5e3d\u8c8c\u8d38\u4f94\u88a4\u52d6\u8306\u5cc1\u7441\u6634\u7266\u8004\u65c4\u61cb\u7780\u86d1\u8765\u87ca\u9ae6", "me": "\u4e48", "mei": "\u73ab\u679a\u6885\u9176\u9709\u7164\u6ca1\u7709\u5a92\u9541\u6bcf\u7f8e\u6627\u5bd0\u59b9\u5a9a\u5776\u8393\u5d4b\u7338\u6d7c\u6e44\u6963\u9545\u9e5b\u8882\u9b45", "men": "\u95e8\u95f7\u4eec\u626a\u739f\u7116\u61d1\u9494", "mi": "\u772f\u919a\u9761\u7cdc\u8ff7\u8c1c\u5f25\u7c73\u79d8\u89c5\u6ccc\u871c\u5bc6\u5e42\u8288\u5196\u8c27\u863c\u5627\u7315\u736f\u6c68\u5b93\u5f2d\u8112\u6549\u7cf8\u7e3b\u9e8b", "mian": "\u68c9\u7720\u7ef5\u5195\u514d\u52c9\u5a29\u7f05\u9762\u6c94\u6e4e\u817c\u7704", "mie": "\u8511\u706d\u54a9\u881b\u7bfe", "min": "\u6c11\u62bf\u76bf\u654f\u60af\u95fd\u82e0\u5cb7\u95f5\u6cef\u73c9", "ming": "\u660e\u879f\u9e23\u94ed\u540d\u547d\u51a5\u8317\u6e9f\u669d\u7791\u9169", "miu": "\u8c2c", "mo": "\u6478\u6479\u8611\u6a21\u819c\u78e8\u6469\u9b54\u62b9\u672b\u83ab\u58a8\u9ed8\u6cab\u6f20\u5bde\u964c\u8c1f\u8309\u84e6\u998d\u5aeb\u9546\u79e3\u763c\u8031\u87c6\u8c8a\u8c98", "mou": "\u8c0b\u725f\u67d0\u53b6\u54de\u5a7a\u7738\u936a", "mu": "\u62c7\u7261\u4ea9\u59c6\u6bcd\u5893\u66ae\u5e55\u52df\u6155\u6728\u76ee\u7766\u7267\u7a46\u4eeb\u82dc\u5452\u6c90\u6bea\u94bc", "na": "\u62ff\u54ea\u5450\u94a0\u90a3\u5a1c\u7eb3\u5185\u637a\u80ad\u954e\u8872\u7bac", "nai": "\u6c16\u4e43\u5976\u8010\u5948\u9f10\u827f\u8418\u67f0", "nan": "\u5357\u7537\u96be\u56ca\u5583\u56e1\u6960\u8169\u877b\u8d67", "nao": "\u6320\u8111\u607c\u95f9\u5b6c\u57b4\u7331\u7459\u7847\u94d9\u86f2", "ne": "\u6dd6\u5462\u8bb7", "nei": "\u9981", "nen": "\u5ae9\u80fd\u6798\u6041", "ni": "\u59ae\u9713\u502a\u6ce5\u5c3c\u62df\u4f60\u533f\u817b\u9006\u6eba\u4f32\u576d\u730a\u6029\u6ee0\u6635\u65ce\u7962\u615d\u7768\u94cc\u9cb5", "nian": "\u852b\u62c8\u5e74\u78be\u64b5\u637b\u5ff5\u5eff\u8f87\u9ecf\u9c87\u9cb6", "niang": "\u5a18\u917f", "niao": "\u9e1f\u5c3f\u8311\u5b32\u8132\u8885", "nie": "\u634f\u8042\u5b7d\u556e\u954a\u954d\u6d85\u4e5c\u9667\u8616\u55eb\u8080\u989e\u81ec\u8e51", "nin": "\u60a8\u67e0", "ning": "\u72de\u51dd\u5b81\u62e7\u6cde\u4f5e\u84e5\u549b\u752f\u804d", "niu": "\u725b\u626d\u94ae\u7ebd\u72c3\u5ff8\u599e\u86b4", "nong": "\u8113\u6d53\u519c\u4fac", "nu": "\u5974\u52aa\u6012\u5476\u5e11\u5f29\u80ec\u5b65\u9a7d", "nv": "\u5973\u6067\u9495\u8844", "nuan": "\u6696", "nuenue": "\u8650", "nue": "\u759f\u8c11", "nuo": "\u632a\u61e6\u7cef\u8bfa\u50a9\u6426\u558f\u9518", "ou": "\u54e6\u6b27\u9e25\u6bb4\u85d5\u5455\u5076\u6ca4\u6004\u74ef\u8026", "pa": "\u556a\u8db4\u722c\u5e15\u6015\u7436\u8469\u7b62", "pai": "\u62cd\u6392\u724c\u5f98\u6e43\u6d3e\u4ff3\u848e", "pan": "\u6500\u6f58\u76d8\u78d0\u76fc\u7554\u5224\u53db\u723f\u6cee\u88a2\u897b\u87e0\u8e52", "pang": "\u4e53\u5e9e\u65c1\u802a\u80d6\u6ec2\u9004", "pao": "\u629b\u5486\u5228\u70ae\u888d\u8dd1\u6ce1\u530f\u72cd\u5e96\u812c\u75b1", "pei": "\u5478\u80da\u57f9\u88f4\u8d54\u966a\u914d\u4f69\u6c9b\u638a\u8f94\u5e14\u6de0\u65c6\u952b\u9185\u9708", "pen": "\u55b7\u76c6\u6e53", "peng": "\u7830\u62a8\u70f9\u6f8e\u5f6d\u84ec\u68da\u787c\u7bf7\u81a8\u670b\u9e4f\u6367\u78b0\u576f\u580b\u562d\u6026\u87db", "pi": "\u7812\u9739\u6279\u62ab\u5288\u7435\u6bd7\u5564\u813e\u75b2\u76ae\u5339\u75de\u50fb\u5c41\u8b6c\u4e15\u9674\u90b3\u90eb\u572e\u9f19\u64d7\u567c\u5e80\u5ab2\u7eb0\u6787\u7513\u7765\u7f74\u94cd\u75e6\u7656\u758b\u868d\u8c94", "pian": "\u7bc7\u504f\u7247\u9a97\u8c1d\u9a88\u728f\u80fc\u890a\u7fe9\u8e41", "piao": "\u98d8\u6f02\u74e2\u7968\u527d\u560c\u5ad6\u7f25\u6b8d\u779f\u87b5", "pie": "\u6487\u77a5\u4e3f\u82e4\u6c15", "pin": "\u62fc\u9891\u8d2b\u54c1\u8058\u62da\u59d8\u5ad4\u6980\u725d\u98a6", "ping": "\u4e52\u576a\u82f9\u840d\u5e73\u51ed\u74f6\u8bc4\u5c4f\u4fdc\u5a09\u67b0\u9c86", "po": "\u5761\u6cfc\u9887\u5a46\u7834\u9b44\u8feb\u7c95\u53f5\u9131\u6ea5\u73c0\u948b\u94b7\u76a4\u7b38", "pou": "\u5256\u88d2\u8e23", "pu": "\u6251\u94fa\u4ec6\u8386\u8461\u83e9\u84b2\u57d4\u6734\u5703\u666e\u6d66\u8c31\u66dd\u7011\u530d\u5657\u6fee\u749e\u6c06\u9564\u9568\u8e7c", "qi": "\u671f\u6b3a\u6816\u621a\u59bb\u4e03\u51c4\u6f06\u67d2\u6c8f\u5176\u68cb\u5947\u6b67\u7566\u5d0e\u8110\u9f50\u65d7\u7948\u7941\u9a91\u8d77\u5c82\u4e5e\u4f01\u542f\u5951\u780c\u5668\u6c14\u8fc4\u5f03\u6c7d\u6ce3\u8bab\u4e9f\u4e93\u573b\u8291\u840b\u847a\u5601\u5c7a\u5c90\u6c54\u6dc7\u9a90\u7eee\u742a\u7426\u675e\u6864\u69ed\u6b39\u797a\u61a9\u789b\u86f4\u871e\u7da6\u7dae\u8dbf\u8e4a\u9ccd\u9e92", "qia": "\u6390\u6070\u6d3d\u845c", "qian": "\u7275\u6266\u948e\u94c5\u5343\u8fc1\u7b7e\u4edf\u8c26\u4e7e\u9ed4\u94b1\u94b3\u524d\u6f5c\u9063\u6d45\u8c34\u5811\u5d4c\u6b20\u6b49\u4f65\u9621\u828a\u82a1\u8368\u63ae\u5c8d\u60ad\u614a\u9a9e\u6434\u8930\u7f31\u6920\u80b7\u6106\u94a4\u8654\u7b9d", "qiang": "\u67aa\u545b\u8154\u7f8c\u5899\u8537\u5f3a\u62a2\u5af1\u6a2f\u6217\u709d\u9516\u9535\u956a\u8941\u8723\u7f9f\u8deb\u8dc4", "qiao": "\u6a47\u9539\u6572\u6084\u6865\u77a7\u4e54\u4fa8\u5de7\u9798\u64ac\u7fd8\u5ced\u4fcf\u7a8d\u5281\u8bee\u8c2f\u835e\u6100\u6194\u7f32\u6a35\u6bf3\u7857\u8df7\u9792", "qie": "\u5207\u8304\u4e14\u602f\u7a83\u90c4\u553c\u60ec\u59be\u6308\u9532\u7ba7", "qin": "\u94a6\u4fb5\u4eb2\u79e6\u7434\u52e4\u82b9\u64d2\u79bd\u5bdd\u6c81\u82a9\u84c1\u8572\u63ff\u5423\u55ea\u5659\u6eb1\u6a8e\u8793\u887e", "qing": "\u9752\u8f7b\u6c22\u503e\u537f\u6e05\u64ce\u6674\u6c30\u60c5\u9877\u8bf7\u5e86\u5029\u82d8\u570a\u6aa0\u78ec\u873b\u7f44\u7b90\u8b26\u9cad\u9ee5", "qiong": "\u743c\u7a77\u909b\u8315\u7a79\u7b47\u928e", "qiu": "\u79cb\u4e18\u90b1\u7403\u6c42\u56da\u914b\u6cc5\u4fc5\u6c3d\u5def\u827d\u72b0\u6e6b\u9011\u9052\u6978\u8d47\u9e20\u866c\u86af\u8764\u88d8\u7cd7\u9cc5\u9f3d", "qu": "\u8d8b\u533a\u86c6\u66f2\u8eaf\u5c48\u9a71\u6e20\u53d6\u5a36\u9f8b\u8da3\u53bb\u8bce\u52ac\u8556\u8627\u5c96\u8862\u9612\u74a9\u89d1\u6c0d\u795b\u78f2\u766f\u86d0\u883c\u9eb4\u77bf\u9ee2", "quan": "\u5708\u98a7\u6743\u919b\u6cc9\u5168\u75ca\u62f3\u72ac\u5238\u529d\u8be0\u8343\u737e\u609b\u7efb\u8f81\u754e\u94e8\u8737\u7b4c\u9b08", "que": "\u7f3a\u7094\u7638\u5374\u9e4a\u69b7\u786e\u96c0\u9619\u60ab", "qun": "\u88d9\u7fa4\u9021", "ran": "\u7136\u71c3\u5189\u67d3\u82d2\u9aef", "rang": "\u74e4\u58e4\u6518\u56b7\u8ba9\u79b3\u7a70", "rao": "\u9976\u6270\u7ed5\u835b\u5a06\u6861", "ruo": "\u60f9\u82e5\u5f31", "re": "\u70ed\u504c", "ren": "\u58ec\u4ec1\u4eba\u5fcd\u97e7\u4efb\u8ba4\u5203\u598a\u7eab\u4ede\u834f\u845a\u996a\u8f6b\u7a14\u887d", "reng": "\u6254\u4ecd", "ri": "\u65e5", "rong": "\u620e\u8338\u84c9\u8363\u878d\u7194\u6eb6\u5bb9\u7ed2\u5197\u5d58\u72e8\u7f1b\u6995\u877e", "rou": "\u63c9\u67d4\u8089\u7cc5\u8e42\u97a3", "ru": "\u8339\u8815\u5112\u5b7a\u5982\u8fb1\u4e73\u6c5d\u5165\u8925\u84d0\u85b7\u5685\u6d33\u6ebd\u6fe1\u94f7\u8966\u98a5", "ruan": "\u8f6f\u962e\u670a", "rui": "\u854a\u745e\u9510\u82ae\u8564\u777f\u868b", "run": "\u95f0\u6da6", "sa": "\u6492\u6d12\u8428\u5345\u4ee8\u6332\u98d2", "sai": "\u816e\u9cc3\u585e\u8d5b\u567b", "san": "\u4e09\u53c1\u4f1e\u6563\u5f61\u9993\u6c35\u6bf5\u7cc1\u9730", "sang": "\u6851\u55d3\u4e27\u6421\u78c9\u98a1", "sao": "\u6414\u9a9a\u626b\u5ac2\u57fd\u81ca\u7619\u9ccb", "se": "\u745f\u8272\u6da9\u556c\u94e9\u94ef\u7a51", "sen": "\u68ee", "seng": "\u50e7", "sha": "\u838e\u7802\u6740\u5239\u6c99\u7eb1\u50bb\u5565\u715e\u810e\u6b43\u75e7\u88df\u970e\u9ca8", "shai": "\u7b5b\u6652\u917e", "shan": "\u73ca\u82eb\u6749\u5c71\u5220\u717d\u886b\u95ea\u9655\u64c5\u8d61\u81b3\u5584\u6c55\u6247\u7f2e\u5261\u8baa\u912f\u57cf\u829f\u6f78\u59d7\u9a9f\u81bb\u9490\u759d\u87ee\u8222\u8dda\u9cdd", "shang": "\u5892\u4f24\u5546\u8d4f\u664c\u4e0a\u5c1a\u88f3\u57a7\u7ef1\u6b87\u71b5\u89de", "shao": "\u68a2\u634e\u7a0d\u70e7\u828d\u52fa\u97f6\u5c11\u54e8\u90b5\u7ecd\u52ad\u82d5\u6f72\u86f8\u7b24\u7b72\u8244", "she": "\u5962\u8d4a\u86c7\u820c\u820d\u8d66\u6444\u5c04\u6151\u6d89\u793e\u8bbe\u538d\u4f58\u731e\u7572\u9e9d", "shen": "\u7837\u7533\u547b\u4f38\u8eab\u6df1\u5a20\u7ec5\u795e\u6c88\u5ba1\u5a76\u751a\u80be\u614e\u6e17\u8bdc\u8c02\u5432\u54c2\u6e16\u6939\u77e7\u8703", "sheng": "\u58f0\u751f\u7525\u7272\u5347\u7ef3\u7701\u76db\u5269\u80dc\u5723\u4e1e\u6e11\u5ab5\u771a\u7b19", "shi": "\u5e08\u5931\u72ee\u65bd\u6e7f\u8bd7\u5c38\u8671\u5341\u77f3\u62fe\u65f6\u4ec0\u98df\u8680\u5b9e\u8bc6\u53f2\u77e2\u4f7f\u5c4e\u9a76\u59cb\u5f0f\u793a\u58eb\u4e16\u67ff\u4e8b\u62ed\u8a93\u901d\u52bf\u662f\u55dc\u566c\u9002\u4ed5\u4f8d\u91ca\u9970\u6c0f\u5e02\u6043\u5ba4\u89c6\u8bd5\u8c25\u57d8\u83b3\u84cd\u5f11\u5511\u9963\u8f7c\u8006\u8d33\u70bb\u793b\u94c8\u94ca\u87ab\u8210\u7b6e\u8c55\u9ca5\u9cba", "shou": "\u6536\u624b\u9996\u5b88\u5bff\u6388\u552e\u53d7\u7626\u517d\u624c\u72e9\u7ef6\u824f", "shu": "\u852c\u67a2\u68b3\u6b8a\u6292\u8f93\u53d4\u8212\u6dd1\u758f\u4e66\u8d4e\u5b70\u719f\u85af\u6691\u66d9\u7f72\u8700\u9ecd\u9f20\u5c5e\u672f\u8ff0\u6811\u675f\u620d\u7ad6\u5885\u5eb6\u6570\u6f31\u6055\u500f\u587e\u83fd\u5fc4\u6cad\u6d91\u6f8d\u59dd\u7ebe\u6bf9\u8167\u6bb3\u956f\u79eb\u9e6c", "shua": "\u5237\u800d\u5530\u6dae", "shuai": "\u6454\u8870\u7529\u5e05\u87c0", "shuan": "\u6813\u62f4\u95e9", "shuang": "\u971c\u53cc\u723d\u5b40", "shui": "\u8c01\u6c34\u7761\u7a0e", "shun": "\u542e\u77ac\u987a\u821c\u6042", "shuo": "\u8bf4\u7855\u6714\u70c1\u84b4\u6420\u55cd\u6fef\u5981\u69ca\u94c4", "si": "\u65af\u6495\u5636\u601d\u79c1\u53f8\u4e1d\u6b7b\u8086\u5bfa\u55e3\u56db\u4f3a\u4f3c\u9972\u5df3\u53ae\u4fdf\u5155\u83e5\u549d\u6c5c\u6cd7\u6f8c\u59d2\u9a77\u7f0c\u7940\u7960\u9536\u9e36\u801c\u86f3\u7b25", "song": "\u677e\u8038\u6002\u9882\u9001\u5b8b\u8bbc\u8bf5\u51c7\u83d8\u5d27\u5d69\u5fea\u609a\u6dde\u7ae6", "sou": "\u641c\u8258\u64de\u55fd\u53df\u55d6\u55fe\u998a\u6eb2\u98d5\u778d\u953c\u878b", "su": "\u82cf\u9165\u4fd7\u7d20\u901f\u7c9f\u50f3\u5851\u6eaf\u5bbf\u8bc9\u8083\u5919\u8c21\u850c\u55c9\u612b\u7c0c\u89eb\u7a23", "suan": "\u9178\u849c\u7b97", "sui": "\u867d\u968b\u968f\u7ee5\u9ad3\u788e\u5c81\u7a57\u9042\u96a7\u795f\u84d1\u51ab\u8c07\u6fc9\u9083\u71e7\u772d\u7762", "sun": "\u5b59\u635f\u7b0b\u836a\u72f2\u98e7\u69ab\u8de3\u96bc", "suo": "\u68ad\u5506\u7f29\u7410\u7d22\u9501\u6240\u5522\u55e6\u5a11\u686b\u7743\u7fa7", "ta": "\u584c\u4ed6\u5b83\u5979\u5854\u736d\u631e\u8e4b\u8e0f\u95fc\u6ebb\u9062\u69bb\u6c93", "tai": "\u80ce\u82d4\u62ac\u53f0\u6cf0\u915e\u592a\u6001\u6c70\u90b0\u85b9\u80bd\u70b1\u949b\u8dc6\u9c90", "tan": "\u574d\u644a\u8d2a\u762b\u6ee9\u575b\u6a80\u75f0\u6f6d\u8c2d\u8c08\u5766\u6bef\u8892\u78b3\u63a2\u53f9\u70ad\u90ef\u8548\u6619\u94bd\u952c\u8983", "tang": "\u6c64\u5858\u642a\u5802\u68e0\u819b\u5510\u7cd6\u50a5\u9967\u6e8f\u746d\u94f4\u9557\u8025\u8797\u87b3\u7fb0\u91a3", "thang": "\u5018\u8eba\u6dcc", "theng": "\u8d9f\u70eb", "tao": "\u638f\u6d9b\u6ed4\u7ee6\u8404\u6843\u9003\u6dd8\u9676\u8ba8\u5957\u6311\u9f17\u5555\u97ec\u9955", "te": "\u7279", "teng": "\u85e4\u817e\u75bc\u8a8a\u6ed5", "ti": "\u68af\u5254\u8e22\u9511\u63d0\u9898\u8e44\u557c\u4f53\u66ff\u568f\u60d5\u6d95\u5243\u5c49\u8351\u608c\u9016\u7ee8\u7f07\u9e48\u88fc\u918d", "tian": "\u5929\u6dfb\u586b\u7530\u751c\u606c\u8214\u8146\u63ad\u5fdd\u9617\u6b84\u754b\u94bf\u86ba", "tiao": "\u6761\u8fe2\u773a\u8df3\u4f7b\u7967\u94eb\u7a95\u9f86\u9ca6", "tie": "\u8d34\u94c1\u5e16\u841c\u992e", "ting": "\u5385\u542c\u70c3\u6c40\u5ef7\u505c\u4ead\u5ead\u633a\u8247\u839b\u8476\u5a77\u6883\u8713\u9706", "tong": "\u901a\u6850\u916e\u77b3\u540c\u94dc\u5f64\u7ae5\u6876\u6345\u7b52\u7edf\u75db\u4f5f\u50ee\u4edd\u833c\u55f5\u6078\u6f7c\u783c", "tou": "\u5077\u6295\u5934\u900f\u4ea0", "tu": "\u51f8\u79c3\u7a81\u56fe\u5f92\u9014\u6d82\u5c60\u571f\u5410\u5154\u580d\u837c\u83df\u948d\u9174", "tuan": "\u6e4d\u56e2\u7583", "tui": "\u63a8\u9893\u817f\u8715\u892a\u9000\u5fd2\u717a", "tun": "\u541e\u5c6f\u81c0\u9968\u66be\u8c5a\u7a80", "tuo": "\u62d6\u6258\u8131\u9e35\u9640\u9a6e\u9a7c\u692d\u59a5\u62d3\u553e\u4e47\u4f57\u5768\u5eb9\u6cb1\u67dd\u7823\u7ba8\u8204\u8dce\u9f0d", "wa": "\u6316\u54c7\u86d9\u6d3c\u5a03\u74e6\u889c\u4f64\u5a32\u817d", "wai": "\u6b6a\u5916", "wan": "\u8c4c\u5f2f\u6e7e\u73a9\u987d\u4e38\u70f7\u5b8c\u7897\u633d\u665a\u7696\u60cb\u5b9b\u5a49\u4e07\u8155\u525c\u8284\u82cb\u83c0\u7ea8\u7efe\u742c\u8118\u7579\u873f\u7ba2", "wang": "\u6c6a\u738b\u4ea1\u6789\u7f51\u5f80\u65fa\u671b\u5fd8\u5984\u7f54\u5c22\u60d8\u8f8b\u9b4d", "wei": "\u5a01\u5dcd\u5fae\u5371\u97e6\u8fdd\u6845\u56f4\u552f\u60df\u4e3a\u6f4d\u7ef4\u82c7\u840e\u59d4\u4f1f\u4f2a\u5c3e\u7eac\u672a\u851a\u5473\u754f\u80c3\u5582\u9b4f\u4f4d\u6e2d\u8c13\u5c09\u6170\u536b\u502d\u504e\u8bff\u9688\u8473\u8587\u5e0f\u5e37\u5d34\u5d6c\u7325\u732c\u95f1\u6ca9\u6d27\u6da0\u9036\u5a13\u73ae\u97ea\u8ece\u709c\u7168\u71a8\u75ff\u8249\u9c94", "wen": "\u761f\u6e29\u868a\u6587\u95fb\u7eb9\u543b\u7a33\u7d0a\u95ee\u520e\u6120\u960c\u6c76\u74ba\u97eb\u6b81\u96ef", "weng": "\u55e1\u7fc1\u74ee\u84ca\u8579", "wo": "\u631d\u8717\u6da1\u7a9d\u6211\u65a1\u5367\u63e1\u6c83\u83b4\u5e44\u6e25\u674c\u809f\u9f8c", "wu": "\u5deb\u545c\u94a8\u4e4c\u6c61\u8bec\u5c4b\u65e0\u829c\u68a7\u543e\u5434\u6bcb\u6b66\u4e94\u6342\u5348\u821e\u4f0d\u4fae\u575e\u620a\u96fe\u6664\u7269\u52ff\u52a1\u609f\u8bef\u5140\u4ef5\u9622\u90ac\u572c\u82b4\u5e91\u6003\u5fe4\u6d6f\u5be4\u8fd5\u59a9\u9a9b\u727e\u7110\u9e49\u9e5c\u8708\u92c8\u9f2f", "xi": "\u6614\u7199\u6790\u897f\u7852\u77fd\u6670\u563b\u5438\u9521\u727a\u7a00\u606f\u5e0c\u6089\u819d\u5915\u60dc\u7184\u70ef\u6eaa\u6c50\u7280\u6a84\u88ad\u5e2d\u4e60\u5ab3\u559c\u94e3\u6d17\u7cfb\u9699\u620f\u7ec6\u50d6\u516e\u96b0\u90d7\u831c\u8478\u84f0\u595a\u550f\u5f99\u9969\u960b\u6d60\u6dc5\u5c63\u5b09\u73ba\u6a28\u66e6\u89cb\u6b37\u71b9\u798a\u79a7\u94b8\u7699\u7a78\u8725\u87cb\u823e\u7fb2\u7c9e\u7fd5\u91af\u9f37", "xia": "\u778e\u867e\u5323\u971e\u8f96\u6687\u5ce1\u4fa0\u72ed\u4e0b\u53a6\u590f\u5413\u6380\u846d\u55c4\u72ce\u9050\u7455\u7856\u7615\u7f45\u9ee0", "xian": "\u9528\u5148\u4ed9\u9c9c\u7ea4\u54b8\u8d24\u8854\u8237\u95f2\u6d8e\u5f26\u5acc\u663e\u9669\u73b0\u732e\u53bf\u817a\u9985\u7fa1\u5baa\u9677\u9650\u7ebf\u51bc\u85d3\u5c98\u7303\u66b9\u5a34\u6c19\u7946\u9e47\u75eb\u86ac\u7b45\u7c7c\u9170\u8df9", "xiang": "\u76f8\u53a2\u9576\u9999\u7bb1\u8944\u6e58\u4e61\u7fd4\u7965\u8be6\u60f3\u54cd\u4eab\u9879\u5df7\u6a61\u50cf\u5411\u8c61\u8297\u8459\u9977\u5ea0\u9aa7\u7f03\u87d3\u9c9e\u98e8", "xiao": "\u8427\u785d\u9704\u524a\u54ee\u56a3\u9500\u6d88\u5bb5\u6dc6\u6653\u5c0f\u5b5d\u6821\u8096\u5578\u7b11\u6548\u54d3\u54bb\u5d24\u6f47\u900d\u9a81\u7ee1\u67ad\u67b5\u7b71\u7bab\u9b48", "xie": "\u6954\u4e9b\u6b47\u874e\u978b\u534f\u631f\u643a\u90aa\u659c\u80c1\u8c10\u5199\u68b0\u5378\u87f9\u61c8\u6cc4\u6cfb\u8c22\u5c51\u5055\u4eb5\u52f0\u71ee\u85a4\u64b7\u5ee8\u7023\u9082\u7ec1\u7f2c\u69ad\u698d\u6b59\u8e9e", "xin": "\u85aa\u82af\u950c\u6b23\u8f9b\u65b0\u5ffb\u5fc3\u4fe1\u8845\u56df\u99a8\u8398\u6b46\u94fd\u946b", "xing": "\u661f\u8165\u7329\u60fa\u5174\u5211\u578b\u5f62\u90a2\u884c\u9192\u5e78\u674f\u6027\u59d3\u9649\u8347\u8365\u64e4\u60bb\u784e", "xiong": "\u5144\u51f6\u80f8\u5308\u6c79\u96c4\u718a\u828e", "xiu": "\u4f11\u4fee\u7f9e\u673d\u55c5\u9508\u79c0\u8896\u7ee3\u83a0\u5cab\u9990\u5ea5\u9e3a\u8c85\u9af9", "xu": "\u589f\u620c\u9700\u865a\u5618\u987b\u5f90\u8bb8\u84c4\u9157\u53d9\u65ed\u5e8f\u755c\u6064\u7d6e\u5a7f\u7eea\u7eed\u8bb4\u8be9\u5729\u84ff\u6035\u6d2b\u6e86\u987c\u6829\u7166\u7809\u76f1\u80e5\u7cc8\u9191", "xuan": "\u8f69\u55a7\u5ba3\u60ac\u65cb\u7384\u9009\u7663\u7729\u7eda\u5107\u8c16\u8431\u63ce\u9994\u6ceb\u6d35\u6e32\u6f29\u7487\u6966\u6684\u70ab\u714a\u78b9\u94c9\u955f\u75c3", "xue": "\u9774\u859b\u5b66\u7a74\u96ea\u8840\u5671\u6cf6\u9cd5", "xun": "\u52cb\u718f\u5faa\u65ec\u8be2\u5bfb\u9a6f\u5de1\u6b89\u6c5b\u8bad\u8baf\u900a\u8fc5\u5dfd\u57d9\u8340\u85b0\u5ccb\u5f87\u6d54\u66db\u7aa8\u91ba\u9c9f", "ya": "\u538b\u62bc\u9e26\u9e2d\u5440\u4e2b\u82bd\u7259\u869c\u5d16\u8859\u6daf\u96c5\u54d1\u4e9a\u8bb6\u4f22\u63e0\u5416\u5c88\u8fd3\u5a05\u740a\u6860\u6c29\u7811\u775a\u75d6", "yan": "\u7109\u54bd\u9609\u70df\u6df9\u76d0\u4e25\u7814\u8712\u5ca9\u5ef6\u8a00\u989c\u960e\u708e\u6cbf\u5944\u63a9\u773c\u884d\u6f14\u8273\u5830\u71d5\u538c\u781a\u96c1\u5501\u5f66\u7130\u5bb4\u8c1a\u9a8c\u53a3\u9765\u8d5d\u4fe8\u5043\u5156\u8ba0\u8c33\u90fe\u9122\u82ab\u83f8\u5d26\u6079\u95eb\u960f\u6d07\u6e6e\u6edf\u598d\u5ae3\u7430\u664f\u80ed\u814c\u7131\u7f68\u7b75\u917d\u9b47\u990d\u9f39", "yang": "\u6b83\u592e\u9e2f\u79e7\u6768\u626c\u4f6f\u75a1\u7f8a\u6d0b\u9633\u6c27\u4ef0\u75d2\u517b\u6837\u6f3e\u5f89\u600f\u6cf1\u7080\u70ca\u6059\u86d8\u9785", "yao": "\u9080\u8170\u5996\u7476\u6447\u5c27\u9065\u7a91\u8c23\u59da\u54ac\u8200\u836f\u8981\u8000\u592d\u723b\u5406\u5d3e\u5fad\u7039\u5e7a\u73e7\u6773\u66dc\u80b4\u9e5e\u7a88\u7e47\u9cd0", "ye": "\u6930\u564e\u8036\u7237\u91ce\u51b6\u4e5f\u9875\u6396\u4e1a\u53f6\u66f3\u814b\u591c\u6db2\u8c12\u90ba\u63f6\u9980\u6654\u70e8\u94d8", "yi": "\u4e00\u58f9\u533b\u63d6\u94f1\u4f9d\u4f0a\u8863\u9890\u5937\u9057\u79fb\u4eea\u80f0\u7591\u6c82\u5b9c\u59e8\u5f5d\u6905\u8681\u501a\u5df2\u4e59\u77e3\u4ee5\u827a\u6291\u6613\u9091\u5c79\u4ebf\u5f79\u81c6\u9038\u8084\u75ab\u4ea6\u88d4\u610f\u6bc5\u5fc6\u4e49\u76ca\u6ea2\u8be3\u8bae\u8c0a\u8bd1\u5f02\u7ffc\u7fcc\u7ece\u5208\u5293\u4f7e\u8bd2\u572a\u572f\u57f8\u61ff\u82e1\u858f\u5f08\u5955\u6339\u5f0b\u5453\u54a6\u54bf\u566b\u5cc4\u5db7\u7317\u9974\u603f\u6021\u6092\u6f2a\u8fe4\u9a7f\u7f22\u6baa\u8d3b\u65d6\u71a0\u9487\u9552\u9571\u75cd\u7617\u7654\u7fca\u8864\u8734\u8223\u7fbf\u7ff3\u914f\u9edf", "yin": "\u8335\u836b\u56e0\u6bb7\u97f3\u9634\u59fb\u541f\u94f6\u6deb\u5bc5\u996e\u5c39\u5f15\u9690\u5370\u80e4\u911e\u5819\u831a\u5591\u72fa\u5924\u6c24\u94df\u763e\u8693\u972a\u9f88", "ying": "\u82f1\u6a31\u5a74\u9e70\u5e94\u7f28\u83b9\u8424\u8425\u8367\u8747\u8fce\u8d62\u76c8\u5f71\u9896\u786c\u6620\u5b34\u90e2\u8314\u83ba\u8426\u6484\u5624\u81ba\u6ee2\u6f46\u701b\u745b\u748e\u6979\u9e66\u763f\u988d\u7f42", "yo": "\u54df\u5537", "yong": "\u62e5\u4f63\u81c3\u75c8\u5eb8\u96cd\u8e0a\u86f9\u548f\u6cf3\u6d8c\u6c38\u607f\u52c7\u7528\u4fd1\u58c5\u5889\u6175\u9095\u955b\u752c\u9cd9\u9954", "you": "\u5e7d\u4f18\u60a0\u5fe7\u5c24\u7531\u90ae\u94c0\u72b9\u6cb9\u6e38\u9149\u6709\u53cb\u53f3\u4f51\u91c9\u8bf1\u53c8\u5e7c\u5363\u6538\u4f91\u83b8\u5466\u56ff\u5ba5\u67da\u7337\u7256\u94d5\u75a3\u8763\u9c7f\u9edd\u9f2c", "yu": "\u8fc2\u6de4\u4e8e\u76c2\u6986\u865e\u611a\u8206\u4f59\u4fde\u903e\u9c7c\u6109\u6e1d\u6e14\u9685\u4e88\u5a31\u96e8\u4e0e\u5c7f\u79b9\u5b87\u8bed\u7fbd\u7389\u57df\u828b\u90c1\u5401\u9047\u55bb\u5cea\u5fa1\u6108\u6b32\u72f1\u80b2\u8a89\u6d74\u5bd3\u88d5\u9884\u8c6b\u9a6d\u79ba\u6bd3\u4f1b\u4fe3\u8c00\u8c15\u8438\u84e3\u63c4\u5581\u5704\u5709\u5d5b\u72f3\u996b\u5ebe\u9608\u59aa\u59a4\u7ea1\u745c\u6631\u89ce\u8174\u6b24\u65bc\u715c\u71e0\u807f\u94b0\u9e46\u7610\u7600\u7ab3\u8753\u7afd\u8201\u96e9\u9f89", "yuan": "\u9e33\u6e0a\u51a4\u5143\u57a3\u8881\u539f\u63f4\u8f95\u56ed\u5458\u5706\u733f\u6e90\u7f18\u8fdc\u82d1\u613f\u6028\u9662\u586c\u6c85\u5a9b\u7457\u6a7c\u7230\u7722\u9e22\u8788\u9f0b", "yue": "\u66f0\u7ea6\u8d8a\u8dc3\u94a5\u5cb3\u7ca4\u6708\u60a6\u9605\u9fa0\u6a3e\u5216\u94ba", "yun": "\u8018\u4e91\u90e7\u5300\u9668\u5141\u8fd0\u8574\u915d\u6655\u97f5\u5b55\u90d3\u82b8\u72c1\u607d\u7ead\u6b92\u6600\u6c32", "za": "\u531d\u7838\u6742\u62f6\u5482", "zai": "\u683d\u54c9\u707e\u5bb0\u8f7d\u518d\u5728\u54b1\u5d3d\u753e", "zan": "\u6512\u6682\u8d5e\u74d2\u661d\u7c2a\u7ccc\u8db1\u933e", "zang": "\u8d43\u810f\u846c\u5958\u6215\u81e7", "zao": "\u906d\u7cdf\u51ff\u85fb\u67a3\u65e9\u6fa1\u86a4\u8e81\u566a\u9020\u7682\u7076\u71e5\u5523\u7f2b", "ze": "\u8d23\u62e9\u5219\u6cfd\u4ec4\u8d5c\u5567\u8fee\u6603\u7b2e\u7ba6\u8234", "zei": "\u8d3c", "zen": "\u600e\u8c2e", "zeng": "\u589e\u618e\u66fe\u8d60\u7f2f\u7511\u7f7e\u9503", "zha": "\u624e\u55b3\u6e23\u672d\u8f67\u94e1\u95f8\u7728\u6805\u69a8\u548b\u4e4d\u70b8\u8bc8\u63f8\u5412\u54a4\u54f3\u600d\u781f\u75c4\u86b1\u9f44", "zhai": "\u7fdf\u6458\u658b\u5b85\u7a84\u503a\u5be8\u7826", "zhan": "\u77bb\u6be1\u8a79\u7c98\u6cbe\u76cf\u65a9\u8f97\u5d2d\u5c55\u8638\u6808\u5360\u6218\u7ad9\u6e5b\u7efd\u8c35\u640c\u65c3", "zhang": "\u6a1f\u7ae0\u5f70\u6f33\u5f20\u638c\u6da8\u6756\u4e08\u5e10\u8d26\u4ed7\u80c0\u7634\u969c\u4ec9\u9123\u5e5b\u5d82\u7350\u5adc\u748b\u87d1", "zhao": "\u62db\u662d\u627e\u6cbc\u8d75\u7167\u7f69\u5146\u8087\u53ec\u722a\u8bcf\u68f9\u948a\u7b0a", "zhe": "\u906e\u6298\u54f2\u86f0\u8f99\u8005\u9517\u8517\u8fd9\u6d59\u8c2a\u966c\u67d8\u8f84\u78d4\u9e67\u891a\u8707\u8d6d", "zhen": "\u73cd\u659f\u771f\u7504\u7827\u81fb\u8d1e\u9488\u4fa6\u6795\u75b9\u8bca\u9707\u632f\u9547\u9635\u7f1c\u6862\u699b\u8f78\u8d48\u80d7\u6715\u796f\u755b\u9e29", "zheng": "\u84b8\u6323\u7741\u5f81\u72f0\u4e89\u6014\u6574\u62ef\u6b63\u653f\u5e27\u75c7\u90d1\u8bc1\u8be4\u5ce5\u94b2\u94ee\u7b5d", "zhi": "\u829d\u679d\u652f\u5431\u8718\u77e5\u80a2\u8102\u6c41\u4e4b\u7ec7\u804c\u76f4\u690d\u6b96\u6267\u503c\u4f84\u5740\u6307\u6b62\u8dbe\u53ea\u65e8\u7eb8\u5fd7\u631a\u63b7\u81f3\u81f4\u7f6e\u5e1c\u5cd9\u5236\u667a\u79e9\u7a1a\u8d28\u7099\u75d4\u6ede\u6cbb\u7a92\u536e\u965f\u90c5\u57f4\u82b7\u646d\u5e19\u5fee\u5f58\u54ab\u9a98\u6809\u67b3\u6800\u684e\u8f75\u8f7e\u6534\u8d3d\u81a3\u7949\u7957\u9ef9\u96c9\u9e37\u75e3\u86ed\u7d77\u916f\u8dd6\u8e2c\u8e2f\u8c78\u89ef", "zhong": "\u4e2d\u76c5\u5fe0\u949f\u8877\u7ec8\u79cd\u80bf\u91cd\u4ef2\u4f17\u51a2\u953a\u87bd\u8202\u822f\u8e35", "zhou": "\u821f\u5468\u5dde\u6d32\u8bcc\u7ca5\u8f74\u8098\u5e1a\u5492\u76b1\u5b99\u663c\u9aa4\u5544\u7740\u501c\u8bf9\u836e\u9b3b\u7ea3\u80c4\u78a1\u7c40\u8233\u914e\u9cb7", "zhu": "\u73e0\u682a\u86db\u6731\u732a\u8bf8\u8bdb\u9010\u7af9\u70db\u716e\u62c4\u77a9\u5631\u4e3b\u8457\u67f1\u52a9\u86c0\u8d2e\u94f8\u7b51\u4f4f\u6ce8\u795d\u9a7b\u4f2b\u4f8f\u90be\u82ce\u8331\u6d19\u6e1a\u6f74\u9a7a\u677c\u69e0\u6a65\u70b7\u94e2\u75b0\u7603\u86b0\u7afa\u7bb8\u7fe5\u8e85\u9e88", "zhua": "\u6293", "zhuai": "\u62fd", "zhuan": "\u4e13\u7816\u8f6c\u64b0\u8d5a\u7bc6\u629f\u556d\u989b", "zhuang": "\u6869\u5e84\u88c5\u5986\u649e\u58ee\u72b6\u4e2c", "zhui": "\u690e\u9525\u8ffd\u8d58\u5760\u7f00\u8411\u9a93\u7f12", "zhun": "\u8c06\u51c6", "zhuo": "\u6349\u62d9\u5353\u684c\u7422\u8301\u914c\u707c\u6d4a\u502c\u8bfc\u5ef4\u855e\u64e2\u555c\u6d5e\u6dbf\u6753\u712f\u799a\u65ab", "zi": "\u5179\u54a8\u8d44\u59ff\u6ecb\u6dc4\u5b5c\u7d2b\u4ed4\u7c7d\u6ed3\u5b50\u81ea\u6e0d\u5b57\u8c18\u5d6b\u59ca\u5b73\u7f01\u6893\u8f8e\u8d40\u6063\u7726\u9531\u79ed\u8014\u7b2b\u7ca2\u89dc\u8a3e\u9cbb\u9aed", "zong": "\u9b03\u68d5\u8e2a\u5b97\u7efc\u603b\u7eb5\u8159\u7cbd", "zou": "\u90b9\u8d70\u594f\u63cd\u9139\u9cb0", "zu": "\u79df\u8db3\u5352\u65cf\u7956\u8bc5\u963b\u7ec4\u4fce\u83f9\u5550\u5f82\u9a75\u8e74", "zuan": "\u94bb\u7e82\u6525\u7f35", "zui": "\u5634\u9189\u6700\u7f6a", "zun": "\u5c0a\u9075\u6499\u6a3d\u9cdf", "zuo": "\u6628\u5de6\u4f50\u67de\u505a\u4f5c\u5750\u5ea7\u961d\u963c\u80d9\u795a\u9162", "cou": "\u85ae\u6971\u8f8f\u8160", "nang": "\u652e\u54dd\u56d4\u9995\u66e9", "o": "\u5594", "dia": "\u55f2", "chuai": "\u562c\u81aa\u8e39", "cen": "\u5c91\u6d94", "diu": "\u94e5", "nou": "\u8028", "fou": "\u7f36", "bia": "\u9adf" };
    var FanTiPinYin = { "a": "啊阿錒", "ai": "埃挨哎唉哀皚癌藹矮艾礙愛隘誒捱噯嗌嬡璦曖砹鎄靄", "an": "鞍氨安俺按暗岸胺案諳垵揞犴庵案銨鵪頇黯", "ang": "骯昂盎", "ao": "凹敖熬翺襖傲奧懊澳坳拗嗷噢嶴廒遨媼驁聱螯鏊鰲鏖", "ba": "芭捌扒叭吧笆八疤巴拔跋靶把耙壩霸罷爸茇拔卑捭岜灞杷鈀粑鮁魃", "bai": "白柏百擺佰敗拜稗薜掰韝", "ban": "斑班搬扳般頒板版扮拌伴瓣半辦絆阪阪幽鈑般斑舨", "bang": "邦幫梆榜膀綁棒磅蚌鎊傍謗蒡螃", "bao": "苞胞包褒雹保堡飽寶抱報暴豹鮑爆勹葆宀孢煲鴇褓趵齙", "bo": "剝薄玻菠播撥缽波博勃搏鉑箔伯帛舶脖膊渤泊駁亳蕃啵餑檗擘礴鈸鵓簸跛", "bei": "杯碑悲卑北輩背貝鋇倍狽備憊焙被孛陂邶埤蓓唄怫悖碚鵯褙鐾", "ben": "奔苯本笨畚坌錛", "beng": "崩繃甭泵蹦迸奉蹦甏", "bi": "逼鼻比鄙筆彼碧蓖蔽畢斃毖幣庇痹閉敝弊必辟壁臂避陛匕比俾芘蓽荸吡嗶狴庳愎潷濞弼妣婢嬖璧賁畀鉍秕脾篳箅篦舭襞蹕髀", "bian": "鞭邊編貶扁便變卞辨辯辮遍匾弁芐忭汴緶煸砭扁稹窆蝙籩鯿", "biao": "標彪膘表婊驃颮飆飈灬鏢鑣瘭裱鰾", "bie": "鱉憋別癟蹩鰵", "bin": "彬斌瀕濱賓擯儐浜繽吩殯臏鑌髕鬢", "bing": "兵冰柄丙秉餅炳病並稟邴摒綆枋檳燹", "bu": "捕蔔哺補埠不布步簿部怖拊補埔瓿晡鈈醭", "ca": "擦嚓礤", "cai": "猜裁材才財睬踩采彩菜蔡", "can": "餐參蠶殘慚慘燦驂璨粲黲", "cang": "蒼艙倉滄藏傖", "cao": "操糙槽曹草艹嘈漕螬艚", "ce": "廁策側冊測刂幘惻", "ceng": "層蹭噌", "cha": "插叉茬茶查碴搽察岔差詫猹餷汊姹杈查差檫釵鍤鑔衩", "chai": "拆柴豺儕茈瘥蠆齜", "chan": "攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆廛懺潺澶孱羼嬋嬗驏覘禪鐔襝蟾躔", "chang": "昌猖場嘗常長償腸廠敞暢唱倡倀鬯萇菖徜悵惝閶娼嫦昶氅鯧", "chao": "超抄鈔朝嘲潮巢吵炒怊縐晁耖", "che": "車扯撤掣徹澈坼屮硨", "chen": "郴臣辰塵晨忱沈陳趁襯稱諶抻嗔辰琛櫬肜胂磣齔", "cheng": "撐城橙成呈乘程懲澄誠承逞騁秤埕嵊徵湞棖檉樘晟塍瞠鋮裎蟶酲", "chi": "吃癡持匙池遲弛馳恥齒侈尺赤翅斥熾傺墀芪茌搋叱赤啻嗤彳飭沲媸敕胝眙眵鴟瘛褫蚩螭笞篪豉踅踟魑", "chong": "充沖蟲崇寵充忡憧銃艟", "chou": "抽酬疇躊稠愁籌仇綢瞅醜儔圳幬惆臭妯瘳讎鮒", "chu": "臭初出櫥廚躇鋤雛滁除楚礎儲矗搐觸處亍芻怵絀杵楮樗蜍躕黜", "chuan": "揣川穿椽傳船喘串掾舛惴揣川氚釧鑹舡", "chuang": "瘡窗幢床闖創愴", "chui": "吹炊捶錘垂陲棰槌", "chun": "春椿醇唇淳純蠢促蒓噸肫朐鶉蝽", "chuo": "戳綽族辶輟鏃踔齪", "ci": "疵茨磁雌辭慈瓷詞此刺賜次薺呲嵯鶿螅糍趑", "cong": "聰蔥囪匆從叢傯蓯淙驄棕璁樅", "cu": "湊粗醋簇猝殂蹙", "cuan": "躥篡竄汆攛昕爨", "cui": "摧崔催脆瘁粹淬翠萃悴璀榱隹", "cun": "村存寸磋忖皴", "cuo": "撮搓措挫錯昔脞銼矬痤鹺蹉躦", "da": "搭達答瘩打大耷噠塔怛妲疸褡笪靼韃", "dai": "呆歹傣戴帶殆代貸袋待逮怠埭甙汰岱迨逯駘紿玳黛", "dan": "耽擔丹單鄲撣膽旦氮但憚淡誕彈蛋亻儋卩萏啖淡檐殫賧眈癉聃簞", "dang": "當擋黨蕩檔讜氹菪宕碭鐺襠", "dao": "刀搗蹈倒島禱導到稻悼道盜刀啁忉桃氘燾忑纛", "de": "德得的鍀", "deng": "蹬燈登等瞪凳鄧噔嶝戳磴鐙蹬", "di": "堤低滴迪敵笛狄滌翟嫡抵底地蒂第帝弟遞締氐糴詆諦邸坻蓧荻滴娣柢棣覿砥碲睇鏑羝骶", "dian": "顛掂滇碘點典靛墊電佃甸店惦奠澱殿丶阽坫墊巔玷癜癲簟踮", "diao": "碉叼雕雕刁掉吊釣調軺銱雕糶貂", "die": "跌爹碟蝶叠諜疊佚垤堞揲喋碟軼牒跌褶耋蹀鰈鰨", "ding": "丁盯叮釘頂鼎錠定訂丟仃啶丁腚碇釘鋌疔耵酊", "dong": "東冬董懂動棟侗恫凍洞垌咚崠峒夂氡腖胴硐鶇", "dou": "兜抖鬥陡豆逗痘蔸鈄竇窬蚪篼酡", "du": "都督毒犢獨讀堵睹賭杜鍍肚度渡妒芏都瀆櫝橐牘蠹篤髑黷", "duan": "端短鍛段斷緞彖椴煆籪", "dui": "堆兌隊對懟憝堆", "dun": "墩噸蹲敦頓囤鈍盾遁燉砘礅盹鐓躉", "duo": "掇哆多奪垛躲朵跺舵剁惰墮咄哚綞柁鐸裰踱", "e": "蛾峨鵝俄額訛娥惡厄扼遏鄂餓噩諤堊埡厄我萼唉愕屙阿軛喝腭硪鋨鍔鶚顎鱷", "en": "恩蒽摁唔嗯", "er": "而兒耳爾餌洱二貳邇珥鉺鴯鮞", "fa": "發罰筏伐乏閥法琺垡砝", "fan": "藩帆番翻樊礬釩繁凡煩反返範販犯飯泛蘩幡犭梵攵燔畈蹯", "fang": "坊芳方肪房防妨仿訪紡放匚邡仿鈁舫魴", "fei": "菲非啡飛肥匪誹吠肺廢沸費芾狒非淝妃紼緋榧肺斐扉祓砩鐨痱蜚篚翡霏鯡", "fen": "芬酚吩氛分紛墳焚汾粉奮份忿憤糞僨瀵芬湣鱝鼢", "feng": "豐封楓蜂峰鋒風瘋烽逢馮縫諷奉鳳俸酆葑灃碸", "fu": "佛否夫敷膚孵扶拂輻幅氟符伏俘服浮涪福袱弗甫撫輔俯釜斧脯腑府腐赴副覆賦復傅付阜父腹負富訃附婦縛咐匐鳧郛芙符伏莩菔呋襆滏艴孚駙紱桴賻黻黼罘稃馥虍蚨蜉蝠蝮麩趺跗鰒", "ga": "噶嘎蛤尬押尕尜旭釓", "gai": "該改概鈣蓋溉丐孩垓戤賅胲", "gan": "幹甘桿柑竿肝趕感稈敢贛坩甘尷搟泔淦澉紺橄旰矸疳酐", "gang": "岡剛鋼缸肛綱崗港戇罡頏筻", "gong": "杠工攻功恭龔供躬公宮弓鞏汞拱貢共蕻廾咣拱肱蚣蛩觥", "gao": "篙臯高膏羔糕搞鎬稿告睪誥郜蒿槁縞橰槁杲鋯", "ge": "哥歌擱戈鴿胳疙割革葛格閣隔鉻個各鬲仡賀塥嗝紇搿膈硌鉿鎘袼頜虼舸骼髂", "gei": "給", "gen": "根跟亙跟狠根", "geng": "耕更庚羹埂耿梗硬賡鯁", "gou": "鉤勾溝茍狗垢構購夠拘詬岣遘構緱覯彀鴝笱篝鞲", "gu": "辜菇咕箍估沽孤姑鼓古蠱骨谷股故顧固雇嘏詁菇派崮汩梏軲牯牿胍臌轂瞽罟鈷錮瓠鴣鵠痼蛄酤觚鯝股鶻", "gua": "刮瓜剮寡掛褂卦詿瓜栝鴰", "guai": "乖拐怪噲", "guan": "棺關官冠觀管館罐慣灌貫倌莞摜管盥鸛鰥", "guang": "光廣逛獷桄胱病", "gui": "瑰規圭矽歸龜閨軌鬼詭癸桂櫃跪貴劊匭劌庋宄媯檜炅晷皈簋鮭鱖", "gun": "輥滾棍丨袞緄滾鯀", "guo": "鍋郭國果裹過馘蠃堝摑咼口幗崞猓槨虢錁聒蜮蜾蟈", "ha": "哈", "hai": "骸孩海氦亥害駭噅海頦醢", "han": "酣憨邯韓含涵寒函喊罕翰撼捍旱憾悍焊汗漢邗菡撖闞瀚晗焓頷蚶鼾", "hen": "夯痕很狠恨", "hang": "杭航沆絎珩桁", "hao": "壕嚎豪毫郝好耗號浩薅嗥嚆豪灝昊皓顥蠔", "he": "呵喝荷菏核禾和何合盒貉閡河涸赫褐鶴賀訶核壑藿咳荷闔盍蚵翮", "hei": "嘿黑", "heng": "哼亨橫衡恒訇衡", "hong": "轟哄烘虹鴻洪宏弘紅黌訌葒薨閎泓", "hou": "喉侯猴吼厚候後堠後逅瘊篌喉鱟骺", "hu": "呼乎忽瑚壺葫胡蝴狐糊湖弧虎唬護互滬戶冱忽囫岵猢怙惚滸滹琥槲軤觳烀糊戽扈祜鶘鸌笏醐斛", "hua": "花嘩華猾滑畫劃化話劐澮驊樺鏵稞", "huai": "槐徊懷淮壞還踝", "huan": "歡環桓緩換患喚瘓豢煥渙宦幻郇奐垸擐圈洹浣患環逭繯鍰鯇鬟", "huang": "荒慌黃磺蝗簧皇凰惶煌晃幌恍謊隍徨湟潢遑璜肓癀蟥篁鰉", "hui": "灰揮輝徽恢蛔回毀悔慧卉惠晦賄穢會燴匯諱誨繪詼茴薈蕙噦喙隳洄彗繢琿暉恚虺蟪麾", "hun": "葷昏婚魂渾混諢餛閽混緡", "huo": "豁活夥火獲或惑霍貨禍攉謔夥鈥鍃鑊耠蠖", "ji": "擊圾基機畸稽積箕肌饑跡激譏雞姬績緝吉極棘輯籍集及急疾汲即嫉級擠幾脊己薊技冀季伎祭劑悸濟寄寂計記既忌際妓繼紀居丌乩剞佶佴臠墼芨芰萁蒺蕺椅嘰吉嚌唧岌脊咱彐屐驥畿璣楫殛戟戢賫覬犄齏磯羈嵇稷瘠瘵蟣笈笄暨躋跽霽鱭鯽髻麂", "jia": "嘉枷夾佳家加莢頰賈甲鉀假稼價架駕嫁伽郟拮岬浹迦珈戛胛恝鋏鎵痂蛺笳袈跏", "jian": "殲監堅尖箋間煎兼肩艱奸緘繭檢柬堿鹼揀撿簡儉剪減薦檻鑒踐賤見鍵箭件健艦劍餞漸濺澗建僭諫譾棺蒹搛囝前蹇謇縑梘柙鍵戔戩牮犍毽腱瞼鐧鶼襇筧箴翦趼建鰹韉", "jiang": "僵姜將漿江疆蔣槳獎講匠醬降江洚絳韁犟礓耩糨豇", "jiao": "蕉椒礁焦膠交郊澆驕嬌嚼攪鉸矯僥腳狡角餃繳絞剿教酵轎較叫佼僬交撟噍嶠僥姣糸敫皎鷦蛟醮跤鮫", "jie": "窖揭接皆稭街階截劫節桔傑捷睫竭潔結解姐戒藉芥界借介疥誡屆偈訐詰諧嗟獬婕孑桀獒碣鍇癤袷頡蚧羯鮚骱髫", "jin": "巾筋斤金今津襟緊錦僅謹進靳晉禁近燼浸盡巹藎堇襟饉廑今縉瑾槿贐覲钅鋟衿矜", "jing": "勁荊兢莖睛晶鯨京驚精粳經井警景頸靜境敬鏡徑痙靖竟競凈剄儆阱菁竟景涇逕弳婧肼脛腈旌", "jiong": "炯窘冂迥扃", "jiu": "揪究糾玖韭久灸九酒廄救舊臼舅咎就疚就揪鬮柩桕鷲赳鬏", "ju": "鞠拘狙疽駒菊局咀矩舉沮聚拒據巨具距踞鋸俱句懼炬劇倨詎苣且莒掬遽屨據枸椐榘櫸橘犋颶鉅鋦窶裾趄醵踽齟雎鞫", "juan": "捐鵑娟倦眷卷絹鄄狷捐棬蠲錈鐫雋", "jue": "撅攫抉掘倔爵覺決訣絕厥劂譎矍蕨撅掘獗孓玨桷橛爝鐝蹶觖", "jun": "均菌鈞軍君峻俊竣浚郡駿捃狻皸筠麇", "ka": "喀咖卡佧哢胩", "ke": "咯坷苛柯棵磕顆科殼咳可渴克刻客課苛恪磕騍緙珂軻氪瞌鈳屙窠蝌髁", "kai": "開揩楷凱慨剴塏蒈愾愷鎧鐦", "kan": "刊堪勘坎砍看侃凵莰薟戡龕瞰", "kang": "康慷糠扛抗亢炕坑伉閌鈧", "kao": "考拷烤靠尻考犒銬", "ken": "肯啃墾懇垠裉頎", "keng": "吭忐鏗", "kong": "空恐孔控倥崆箜", "kou": "摳口扣寇孔蔻叩瞘筘", "ku": "枯哭窟苦酷庫褲刳堀嚳絝骷", "kua": "誇垮挎跨胯侉", "kuai": "塊筷儈快蒯鄶蕢獪膾", "kuan": "寬款髖", "kuang": "匡筐狂框礦眶曠況誆誑鄺壙夼哐纊貺", "kui": "虧盔巋窺葵奎魁傀饋愧潰馗匱夔愧揆奎喟悝憒闋逵暌睽聵蝰簣臾跬", "kun": "坤昆捆困悃閫琨錕醌鯤髡", "kuo": "括擴廓闊蛞", "la": "垃拉喇蠟臘辣啦刺摺邋旯砬瘌", "lai": "萊來賴崍徠淶瀨賚睞錸癩籟", "lan": "藍婪欄攔籃闌蘭瀾讕攬覽懶纜爛濫琳嵐懍濫欖斕罱鑭襤", "lang": "瑯榔狼廊郎朗浪莨蒗啷閬鋃稂螂", "lao": "撈勞牢老佬姥酪烙澇嘮嶗栳銠鐒癆醪", "le": "勒樂肋仂肋勒泐鰳", "lei": "雷鐳蕾磊累儡壘擂類淚羸誄荽咧漯嫘縲雷耒酹", "ling": "棱拎玲菱零齡鈴伶羚淩靈陵嶺領另令酃塄苓呤囹令綾拎欞瓴聆蛉翎鯪", "leng": "楞楞冷", "li": "厘梨犁黎籬貍離漓理李裏鯉禮莉荔吏栗麗厲勵礫歷利傈例俐痢立粒瀝隸力璃哩儷俚酈壢藶蒞蘺藜捩嚦唳喱猁溧澧邐娌嫠驪縭珞櫪櫟轢戾礪詈罹鋰鸝癘癧蠣蜊蠡笠篥糲醴躒靂鱺鱧黧", "lian": "倆聯蓮連鐮廉憐漣簾斂臉鏈戀煉練攣蘞奩瀲濂孌璉楝殮臁膦褳蠊鰱", "liang": "糧涼梁粱良兩輛量晾亮諒墚椋踉靚魎", "liao": "撩聊僚療燎寥遼潦了撂鐐廖料蓼尥嘹僚寮繚釕鷯耮", "lie": "列裂烈劣獵冽埒洌趔躐鬣", "lin": "琳林磷霖臨鄰鱗淋凜賃吝藺嶙廩遴檁轔瞵粼躪麟", "liu": "溜琉榴硫餾留劉瘤流柳六掄僂蔞泖瀏遛騮綹旒溜鋶鎦鷚鎏", "long": "龍聾嚨籠窿隆壟攏隴弄壟蘢瀧瓏櫳朧礱癃", "lou": "樓婁摟簍漏陋嘍嶁鏤瘺耬螻髏", "lu": "蘆盧顱廬爐擄鹵虜魯麓碌露路賂鹿潞祿錄陸戮壚攄擼嚕瀘淥漉璐櫨櫓轤輅轆氌臚鑥鸕鷺簏艫鱸", "lv": "驢呂鋁侶旅履屢縷慮氯律率濾綠捋閭櫚旅穭褸", "luan": "巒孿灤卵亂欒鸞鑾", "lue": "掠略鋝", "lun": "輪倫侖淪綸論圇", "luo": "蘿螺羅邏鑼籮騾裸落洛駱絡倮犖摞玀濼欏腡鏍瘰雒", "ma": "媽麻瑪碼螞馬罵嘛嗎嘜獁嬤榪麼", "mai": "埋買麥賣邁脈勱蕒咪霾", "man": "瞞饅蠻滿蔓曼慢漫謾墁幔縵熳鏝顢蟎鰻鞔", "mang": "芒茫盲忙莽邙莽朦硭蟒", "meng": "氓萌蒙檬盟錳猛夢孟猛甍瞢懵礞虻蜢蠓艋艨黽", "miao": "貓苗描瞄藐秒渺廟妙喵貌緲繆杪渺眇鶓蜱", "mao": "茅錨毛矛鉚卯茂冒帽貌貿侔袤勖卯峁瑁昴牦耄旄懋瞀蛑蝥蟊髦", "me": "麽", "mei": "玫枚梅酶黴煤沒眉媒鎂每美昧寐妹媚坶莓嵋猸浼湄楣鎇鶥袂魅", "men": "門悶們捫玟燜懣鍆", "mi": "瞇醚靡糜迷謎彌米秘覓泌蜜密冪羋冖謐蘼嘧獼獯淚宓弭脒敉糸縻麋", "mian": "棉眠綿冕免勉娩緬面沔湎靦眄", "mie": "蔑滅羊蠛蔑", "min": "民抿皿敏憫閩苠岷閔泯瑉", "ming": "明螟鳴銘名命冥茗溟暝瞑酩", "miu": "謬", "mo": "摸摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌謨茉驀饃嫫鏌秣瘼耱蟆貊貘", "mou": "謀牟某厶牟婺眸鍪", "mu": "拇牡畝姆母墓暮幕募慕木目睦牧穆仫苜嘸沐毪鉬", "na": "拿哪吶鈉那娜納內捺肭鎿衲箬", "nai": "氖乃奶耐奈鼐奶萘奈", "nan": "南男難囊喃女楠腩蝻赧", "nao": "撓腦惱鬧孬堖猱瑙硇鐃蟯", "ne": "淖呢訥", "nei": "餒", "nen": "嫩能枘恁", "ni": "妮霓倪泥尼擬妳匿膩逆溺伲坭猊怩灄昵旎禰慝睨鈮鯢", "nian": "蔫拈年碾攆撚念廿輦黏鮎鯰", "niang": "娘釀", "niao": "鳥尿蔦嬲脲裊", "nie": "捏聶孽嚙鑷鎳涅乜隉蘗囁肀顳臬躡", "nin": "您檸", "ning": "獰凝寧擰濘佞鎣嚀寧聹", "niu": "牛扭鈕紐紐醜鈕蚴", "nong": "膿濃農儂", "nu": "奴努怒呶帑弩胬孥駑", "nv": "女耐釹衄", "nuan": "暖", "nuenue": "虐", "nue": "瘧謔", "nuo": "挪懦糯諾儺搦諾鍩", "ou": "哦歐鷗毆藕嘔偶漚慪甌藕", "pa": "啪趴爬帕怕琶葩筢", "pai": "拍排牌徘湃派俳蒎", "pan": "攀潘盤磐盼畔判叛片泮袢攀蟠蹣", "pang": "乓龐旁耪胖滂逄", "pao": "拋咆刨炮袍跑泡匏麅庖脬皰", "pei": "呸胚培裴賠陪配佩沛培轡帔淠旆錇醅霈", "pen": "噴盆盆", "peng": "砰抨烹澎彭蓬棚硼篷膨朋鵬捧碰坯棚嘭怦蟛", "pi": "砒霹批披劈琵毗啤脾疲皮匹痞僻屁譬丕陴邳郫圮鼙擗劈庀媲紕枇甓睥羆鈹痦癖疋蚍貔", "pian": "篇偏片騙諞駢犏胼褊翩蹁", "piao": "飄漂瓢票剽票嫖縹殍瞟螵", "pie": "撇瞥丿苤氕", "pin": "拼頻貧品聘拼姘嬪榀牝顰", "ping": "乒坪蘋萍平憑瓶評屏俜聘枰鮃", "po": "坡潑頗婆破魄迫粕叵鄱溥珀釙鉕皤笸", "pou": "剖裒踣", "pu": "撲鋪仆莆葡菩蒲埔樸圃普浦譜曝瀑葡噗濮璞氆鏷鐠蹼", "qi": "期欺棲戚妻七淒漆柒沏其棋奇歧畦崎臍齊旗祈祁騎起豈乞企啟契砌器氣迄棄汽泣訖亟亓圻芑萋葺戚屺岐汔泣騏綺琪琦杞榿槭欹祺憩磧蠐蜞綦綮趿蹊鰭麒", "qia": "掐恰洽葜", "qian": "牽扡釬鉛千遷簽仟謙乾黔錢鉗前潛遣淺譴塹嵌欠歉僉阡芊欠蕁掮岍慳慊騫搴褰繾槧膁愆鈐虔箝", "qiang": "槍嗆腔羌墻薔強搶嬙檣戧熗錆鏘鏹繈蜣羥跫蹌", "qiao": "橇鍬敲悄橋瞧喬僑巧鞘撬翹峭俏竅劁誚譙蕎愀憔繰樵撬磽蹺鞽", "qie": "切茄且怯竊郤唼愜妾挈鍥篋", "qin": "欽侵親秦琴勤芹擒禽寢沁芩秦蘄撳唚嗪禽溱擒螓衾", "qing": "青輕氫傾卿清擎晴氰情頃請慶倩檾青警磬蜻罄箐謦鯖黥", "qiong": "瓊窮邛煢穹筇銎", "qiu": "秋丘邱球求囚酋泅俅氽巰艽犰湫逑遒楸賕鳩虬蚯蝤裘糗鰍鼽", "qu": "趨區蛆曲軀屈驅渠取娶齲趣去詘劬蕖蘧嶇衢闃璩覷氍祛磲臒蛐蠼麯瞿黢", "quan": "圈顴權醛泉全痊拳犬券勸詮荃獾悛綣輇畎銓蜷筌鬈", "que": "缺炔瘸卻鵲榷確雀闕愨", "qun": "裙群梭", "ran": "然燃冉染苒髯", "rang": "瓤壤攘嚷讓禳穰", "rao": "饒擾繞蕘嬈橈", "ruo": "惹若弱", "re": "熱偌", "ren": "壬仁人忍韌任認刃妊紉仞荏葚飪軔稔衽", "reng": "扔仍", "ri": "日", "rong": "戎茸蓉榮融熔溶容絨冗嶸狨縟榕蠑", "rou": "揉柔肉糅蹂鞣", "ru": "茹蠕儒孺如辱乳汝入褥蓐薷嚅如溽儒銣襦顬", "ruan": "軟阮阮", "rui": "蕊瑞銳芮蕤睿蚋", "run": "閏潤", "sa": "撒灑薩卅仨挲颯", "sai": "腮鰓塞賽塞", "san": "三三傘散三饊氵毿糝霰", "sang": "桑嗓喪搡磉顙", "sao": "搔騷掃嫂埽臊瘙鰠", "se": "瑟色澀嗇鎩銫穡", "sen": "森", "seng": "僧", "sha": "莎砂殺剎沙紗傻啥煞脎砍痧裟霎鯊", "shai": "篩曬釃", "shan": "珊苫杉山刪煽衫閃陜擅贍膳善汕扇繕剡訕鄯埏芟潸姍騸膻釤疝蟮舢跚鱔", "shang": "墑傷商賞晌上尚裳坰緔殤熵觴", "shao": "梢捎稍燒芍勺韶少哨邵紹劭苕潲蛸笤筲艄", "she": "奢賒蛇舌舍赦攝射懾涉社設厙佘猞畬麝", "shen": "砷申呻伸身深娠紳神沈審嬸甚腎慎滲詵諗引哂瀋椹矧蜃", "sheng": "聲生甥牲升繩省盛剩勝聖丞澠媵眚笙", "shi": "師失獅施濕詩屍虱十石拾時什食蝕實識史矢使屎駛始式示士世柿事拭誓逝勢是嗜噬適仕侍釋飾氏市恃室視試謚塒蒔蓍弒坐饣軾耆貰炻礻鈰鉈螫舐筮豕鰣鯴", "shou": "收手首守壽授售受瘦獸扌狩綬艏", "shu": "蔬樞梳殊抒輸叔舒淑疏書贖孰熟薯暑曙署蜀黍鼠屬術述樹束戍豎墅庶數漱恕倏塾菽忄述涑澍殊紓毹腧殳鐲秫鷸", "shua": "刷耍刷涮", "shuai": "摔衰甩帥蟀", "shuan": "栓拴閂", "shuang": "霜雙爽孀", "shui": "誰水睡稅", "shun": "吮瞬順舜恂", "shuo": "說碩朔爍蒴搠嗍濯妁槊鑠", "si": "斯撕嘶思私司絲死肆寺嗣四伺似飼巳廝俟兕折噝記泗澌似駟緦祀祠鍶鷥耜螄笥", "song": "松聳慫頌送宋訟誦凇松崧嵩忪悚淞竦", "sou": "搜艘擻嗽叟嗖嗾餿嫂颼瞍鎪螋", "su": "蘇酥俗素速粟僳塑溯宿訴肅夙謖蔌嗉愫簌觫穌", "suan": "酸蒜算", "sui": "雖隋隨綏髓碎歲穗遂隧祟蓑冫誶濉邃燧眭睢", "sun": "孫損筍蓀猻飧榫跣隼", "suo": "梭唆縮瑣索鎖所嗩嗦娑桫脧羧", "ta": "塌他它她塔獺撻蹋踏闥溻遢榻踏", "tai": "胎苔擡臺泰酞太態汰邰薹肽炱鈦跆鮐", "tan": "坍攤貪癱灘壇檀痰潭譚談坦毯袒碳探嘆炭郯蕈曇鉭錟覃", "tang": "湯塘搪堂棠膛唐糖儻餳塘唐鐋鏜耥螗螳羰醣", "thang": "倘躺淌", "theng": "趟燙", "tao": "掏濤滔絳萄桃逃淘陶討套挑鼗啕韜饕", "te": "特", "teng": "藤騰疼謄滕", "ti": "梯剔踢銻提題蹄啼體替嚏惕涕剃屜荑悌逖綈緹鵜裼醍", "tian": "天添填田甜恬舔腆掭忝闐殄畋鈿蚺", "tiao": "條迢眺跳佻祧銚窕齠鰷", "tie": "貼鐵帖貼餮", "ting": "廳聽烴汀廷停亭庭挺艇莛葶婷梃蜓霆", "tong": "通桐酮瞳同銅彤童桶捅筒統痛佟童仝筒通慟潼砼", "tou": "偷投頭透亠", "tu": "凸禿突圖徒途塗屠土吐兔堍荼菟釷酴", "tuan": "湍團疃", "tui": "推頹腿蛻褪退忒煺", "tun": "吞屯臀飩暾豚窀", "tuo": "拖托脫鴕陀馱駝橢妥拓唾乇佗坨庹沱柝砣籜舄跎鼉", "wa": "挖哇蛙窪娃瓦襪佤媧膃", "wai": "歪外", "wan": "豌彎灣玩頑丸烷完碗挽晚皖惋宛婉萬腕剜芄莧菀紈綰琬脘畹蜿箢", "wang": "汪王亡枉網往旺望忘妄罔尢惘輞魍", "wei": "威巍微危韋違桅圍唯惟為濰維葦萎委偉偽尾緯未蔚味畏胃餵魏位渭謂尉慰衛倭偎諉隈葳薇幃帷崴嵬猥猬闈溈有潿委娓瑋韙軎煒煨熨痿艉鮪", "wen": "瘟溫蚊文聞紋吻穩紊問刎慍閿汶璺韞歿雯", "weng": "嗡翁甕蓊蕹", "wo": "撾蝸渦窩我斡臥握沃萵幄渥杌肟齷", "wu": "巫嗚鎢烏汙誣屋無蕪梧吾吳毋武五捂午舞伍侮塢戊霧晤物勿務悟誤兀仵阢鄔圬芴廡憮忤浯寤迕嫵騖牾焐鵡鶩蜈鋈鼯", "xi": "昔熙析西硒矽晰嘻吸錫犧稀息希悉膝夕惜熄烯溪汐犀檄襲席習媳喜銑洗系隙戲細僖兮隰郗茜葸蓰奚希徒餼鬩稀浙屣嬉璽樨曦覡欷熹禊喜鈽皙穸蜥蟋舾羲粞翕醯鼷", "xia": "瞎蝦匣霞轄暇峽俠狹下廈夏嚇掀霞嘎狎遐瑕硤瘕罅黠", "xian": "鍁先仙鮮纖鹹賢銜舷閑涎弦嫌顯險現獻縣腺餡羨憲陷限線洗蘚峴獫暹嫻氙祆鷴癇蜆筅秈酰躚", "xiang": "相廂鑲香箱襄湘鄉翔祥詳想響享項巷橡像向象薌箱餉庠驤緗蟓鯗饗", "xiao": "蕭硝霄削哮囂銷消宵淆曉小孝校肖嘯笑效嘵休崤瀟逍驍綃梟枵筱簫魈", "xie": "楔些歇蠍鞋協挾攜邪斜脅諧寫械卸蟹懈泄瀉謝屑偕褻勰燮薤擷廨瀣邂紲纈榭榍歙躞", "xin": "薪芯鋅欣辛新忻心信釁囟馨莘歆鋱鑫", "xing": "星腥猩惺興刑型形邢行醒幸杏性姓陘荇滎擤性硎", "xiong": "兄兇胸匈洶雄熊芎", "xiu": "休修羞朽嗅銹秀袖繡秀岫饈庥鵂貅髹", "xu": "墟戌需虛噓須徐許蓄酗敘旭序畜恤絮婿緒續謳詡圩蓿怵血漵頊栩煦砉盱婿糈醑", "xuan": "軒喧宣懸旋玄選癬眩絢儇諼萱揎饌泫旬渲漩璇楦暄炫煊碹鉉鏇痃", "xue": "靴薛學穴雪血噱澩鱈", "xun": "勛熏循旬詢尋馴巡殉汛訓訊遜迅巽塤荀薰峋徇潯曛窨醺鱘", "ya": "壓押鴉鴨呀丫芽牙蚜崖衙涯雅啞亞訝伢揠呀岈迓婭琊椏氬砑睚瘂", "yan": "焉咽閹煙淹鹽嚴研蜒巖延言顏閻炎沿奄掩眼衍演艷堰燕厭硯雁唁彥焰宴諺驗厴靨贗儼偃兗訁讞郾鄢芫淤崦懨閆閼因演灩研嫣琰晏胭腌火罨筵釅魘饜鼴", "yang": "殃央鴦秧楊揚佯瘍羊洋陽氧仰癢養樣漾徉怏泱煬烊恙蛘鞅", "yao": "邀腰妖瑤搖堯遙窯謠姚咬舀藥要耀夭爻咬腰徭瀹幺珧杳曜肴鷂窈繇鰩", "ye": "椰噎耶爺野冶也頁掖業葉曳腋夜液謁鄴揶餘曄燁鋣", "yi": "壹壹醫揖銥依伊衣頤夷遺移儀胰疑沂宜姨彜椅蟻倚已乙矣以藝抑易邑屹億役臆逸肄疫亦裔意毅憶義益溢詣議誼譯異翼翌繹刈劓悄詒圪圯埸懿苡薏弈奕挹弋囈咦咿噫嶧嶷猗飴懌怡悒漪迤驛縊殪貽旖熠釔鎰鐿痍瘞癔翊衤蜴艤羿翳酏黟", "yin": "茵蔭因殷音陰姻吟銀淫寅飲尹引隱印胤鄞堙印喑狺寅氤銦癮蚓霪齦", "ying": "英櫻嬰鷹應纓瑩螢營熒蠅迎贏盈影穎硬映嬴郢塋鶯縈攖嚶膺瀅瀠瀛瑛瓔楹鸚癭潁罌", "yo": "喲育", "yong": "擁傭臃癰庸雍踴蛹詠泳湧永恿勇用俑壅墉慵邕鏞甬鱅饔", "you": "幽優悠憂尤由郵鈾猶油遊酉有友右佑釉誘又幼卣攸侑蕕呦囿宥柚猷牖銪疣蝣魷黝鼬", "yu": "迂淤於盂榆虞愚輿余俞逾魚愉渝漁隅予娛雨與嶼禹宇語羽玉域芋郁籲遇喻峪禦愈欲獄育譽浴寓裕預豫馭禺毓傴俁諛諭萸蕷俞遇吾幸崳狳飫庾閾嫗妤紆瑜昱覦腴歟於煜燠聿鈺鵒瘐瘀窳蝓竽舁雩齬", "yuan": "鴛淵冤元垣袁原援轅園員圓猿源緣遠苑願怨院塬元媛援櫞爰眢鳶螈黿", "yue": "曰約越躍鑰嶽粵月悅閱龠越刖鉞", "yun": "耘雲鄖勻隕允運蘊醞暈韻孕鄆蕓允惲紜殞昀氳", "za": "匝砸雜拶砸", "zai": "栽哉災宰載再在咱崽甾", "zan": "攢暫贊瓚昝簪糌趲鏨", "zang": "贓臟葬奘戕臧", "zao": "遭糟鑿藻棗早澡蚤躁噪造皂竈燥皂繅", "ze": "責擇則澤仄賾嘖迮昃笮簀舴", "zei": "賊", "zen": "怎譖", "zeng": "增憎曾贈繒甑罾鋥", "zha": "紮喳渣劄軋鍘閘眨柵榨咋乍炸詐摣咤咤哳炸砟痄蚱齇", "zhai": "翟摘齋宅窄債寨砦", "zhan": "瞻氈詹粘沾盞斬輾嶄展蘸棧占戰站湛綻譫搌旃", "zhang": "樟章彰漳張掌漲杖丈帳賬仗脹瘴障仉鄣幛章獐嫜璋蟑", "zhao": "招昭找沼趙照罩兆肇召爪詔桌釗笊", "zhe": "遮折哲蟄轍者鍺蔗這浙謫陬柘輒磔鷓褚蜇赭", "zhen": "珍斟真甄砧臻貞針偵枕疹診震振鎮陣縝楨榛軫賑胗朕禎畛鴆", "zheng": "蒸掙睜征猙爭怔整拯正政幀癥鄭證諍崢鉦錚箏", "zhi": "芝枝支吱蜘知肢脂汁之織職直植殖執值侄址指止趾只旨紙誌摯擲至致置幟峙制智秩稚質炙痔滯治窒卮陟郅埴芝摭帙歧彘咫騭櫛織梔桎軹輊攴贄膣祉祗黹稚鷙痣蛭縶酯跖躓躑豸觶", "zhong": "中盅忠鐘衷終種腫重仲眾冢鍾螽春舯踵", "zhou": "舟周州洲謅粥軸肘帚咒皺宙晝驟啄著倜諏葤鬻紂胄碡籀舳酎鯛", "zhu": "珠株蛛朱豬諸誅逐竹燭煮拄矚囑主著柱助蛀貯鑄築住註祝駐佇侏邾苧茱洙諸瀦騶抒櫧櫫主銖疰瘃蚰竺箸翥躅麈", "zhua": "抓", "zhuai": "拽", "zhuan": "專磚轉撰賺篆摶囀顓", "zhuang": "樁莊裝妝撞壯狀爿", "zhui": "椎錐追贅墜綴萑騅縋", "zhun": "諄準", "zhuo": "捉拙卓桌琢茁酌灼濁倬諑廴蕞擢啜捉涿杓綽禚斫", "zi": "茲咨資姿滋淄孜紫仔籽滓子自漬字諮嵫姊孳緇梓輜貲咨眥錙秭耔笫資嘴訾鯔髭", "zong": "鬃棕蹤宗綜總縱腙粽", "zou": "鄒走奏揍鄹鯫", "zu": "租足卒族祖詛阻組俎菹啐徂駔蹴", "zuan": "鉆纂攥纘", "zui": "嘴醉最罪", "zun": "尊遵撙樽鱒", "zuo": "昨左佐柞做作坐座阝阼胙祚酢", "cou": "藪奏輳腠", "nang": "攮噥囔饢曩", "o": "喔", "dia": "爹", "chuai": "嘬膪踹", "cen": "岑涔", "diu": "銩", "nou": "耨", "fou": "缶", "bia": "髟" };
    util.PinYin = PinYin;
    util.FanTiPinYin = FanTiPinYin;
    function encodeUnicode(str) {
        var res = [];
        for (var i = 0; i < str.length; i++) {
            res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return "\\u" + res.join("\\u");
    }
    function codefans_net_CC2PY(l1) {
        l1 = l1 || '';
        var l2 = l1.length;
        var I1 = [];
        var reg = new RegExp('[a-zA-Z0-9\- ]');
        for (var i = 0; i < l2; i++) {
            var val = l1.substr(i, 1);
            var name = arraySearch(val, PinYin);
            if (reg.test(val)) {
                I1.push([val]);
            } else if (name !== false) {
                I1.push(name);
            }
        }
        I1 = mixAllArray(I1);
        I1 = I1.join('|');
        I1 = I1.replace(/ /g, '-');
        while (I1.indexOf('--') > 0) {
            I1 = I1.replace('--', '-');
        }
        return I1 && I1.toLowerCase();
    }
    function mixTwoArray(arr1, arr2) {
        var res = [];
        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                res.push(arr1[i] + arr2[j]);
            }
        }
        return res;
    }
    function mixAllArray(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        var temp = arr[0];
        for (var i = 0; i < arr.length - 1; i++) {
            temp = mixTwoArray(temp, arr[i + 1]);
        }
        return temp;
    }
    function arraySearch(l1, l2) {
        var res = [];
        for (var name in PinYin) {
            if (PinYin[name].indexOf(l1) != -1) {
                res.push(ucfirst(name));
            }
        }
        return res.length ? res : false;
        for (var name in FanTiPinYin) {
            if (FanTiPinYin[name].indexOf(l1) != -1) {
                res.push(ucfirst(name));
            }
        }
        return res.length ? res : false;
    }

    function ucfirst(l1) {
        if (l1.length > 0) {
            var first = l1.substr(0, 1).toUpperCase();
            var spare = l1.substr(1, l1.length);
            return first + spare;
        }
    }
    util.playAudio = function () {
        if (!userConfig.allowVoice) return;
        var audio = document.getElementById('when_receive_msg');
        // console.log(audio);
        if (audio && audio.paused) {
            audio.play();
        } else {
            if (!audio) {
                var div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.left = '-1000px';
                div.style.top = '-1000px';
                var _player = document.createElement('audio');
                div.appendChild(_player);
                document.getElementsByTagName('body')[0].appendChild(div);
                _player.src = 'audio/msg.mp3';
                _player.id = 'when_receive_msg';
                _player.onloadedmetadata = function () {
                    this.play();
                }
            }
        }
    }
    util.getPinyin = codefans_net_CC2PY;
    util.getFileExt = function (name) {
        var nameArr = name.split('.'), len = nameArr.length;
        var ext = '';
        if (len > 1) {
            ext = nameArr[len - 1];
        }
        return ext.toLowerCase();
    }
    util.faceToImg = function (content) {
        var reg = /(title=)?(?:'|")?(\[([^\]]+)\])(?:'|")?/gi;
        content = content.replace(reg, function (v1, v2, v3, v4) {
            if (v2 === undefined) {
                for (var p in faces.maps) {
                    if (faces.maps[p][v4] !== undefined) {
                        var idx = faces.maps[p][v4];
                        idx = idx < 10 ? '0' + idx : idx;
                        return '<img draggable="false" isface="1" src="img/qqemoji/e1' + idx + '.png" class="' + p + '_face" title="[' + v4 + ']" />'
                        // return '<img title="['+v4+']" class="'+p+'_face '+p+'_'+faces.maps[p][v4]+'" src="img/spacer.gif">';
                    }
                }
            }
            return v1;
        })
        return content;
    }
    util.faceToFont = function (html) {
        var reg1 = /<img[^>]+(title="(\[[^>]+\])")[^>]*\/*>/gi;
        var reg2 = /<img[^>]+(title1="(\[[^>]+\])")[^>]*\/*>/gi;
        html = html.replace(reg1, function (v1, v2, v3) {
            return v3;
        })
        html = html.replace(reg2, function (v1, v2, v3) {
            return v3;
        })
        return html
    }
    var metaArr = ['\\', '?', '*', '^', '$', '+', '(', ')', '{', '}', '[', ']', '.'];
    for (var i = 0; i < metaArr.length; i++) {
        metaArr[i] = '\\' + metaArr[i];
    }
    var metaReg = new RegExp('(' + metaArr.join('|') + ')', 'g');
    util.metaReg = metaReg;
    util.replaceMetaStr = function (str) {
        str = str.replace(metaReg, function (v) {
            return '\\' + v;
        });
        return str;
    }
    util.createRegByStr = function (str, option) {
        str = util.replaceMetaStr(str);
        return new Reg(str, option);
    }
    util.hrefEncode = function (str) {
        var linkReg = "(http(s)?://.)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#!?(&|&amp;)//=]*)";
        linkReg = new RegExp(linkReg, 'gi');
        var ipReg = /(http(s)?:\/\/.)?((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))(?:\:\d{1-5})?[-_.%~!*';:@&=+$,/?#\[\]a-zA-Z0-9]*/g;
        // var ipReg = /(http(s)?:\/\/.)?((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))(?:\:\d{1-5})?[^()\s\u4e00-\u9fa5]*/g;
        // var ipReg = /(http(s)?:\/\/.)?((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/g;


        str = str.replace(linkReg, function (url, start, s) {
            if (start) {
                var _url = arguments[0].replace(/^(\s|\n|<br\s*\/*>)/, "");
                // _url = _url.replace(pre,'');
                // var whole = _url.indexOf('http://') == 0 ? '' : 'http://';
                var whole = (_url.indexOf('http://') == 0 || _url.indexOf('https://') == 0) ? '' : (s ? 'https://' : 'http://');
                return '<a draggable="false" target="_blank" href="' + whole + _url + '">' + _url + "</a>";
            } else {
                return url;
            }
        })
        return str.replace(ipReg, function (v) {
            var _v = v.replace(metaReg, function (v) {
                return '\\' + v;
            });
            var a = new RegExp('<a.*' + _v + '.*(<\/a>)', '');
            var matches = str.match(a);
            var start = '';
            if (!/http(s)*:\/\//.test(v)) {
                start = 'http://';
            }
            return matches != null ? v : '<a draggable="false" target="_blank" href="' + start + v + '">' + v + "</a>";
        })
    }

    util.getStringWidth = function (str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        div.className = 'string_width_width';
        $('body').append(div);
        setTimeout(function () {
            $(div).remove();
        }, 1000);
        return div.clientWidth;
    }
    util.convertAt = function (str, getEmpFn, getEmpNameFn) {
        var atReg = /<input(?:[^>]*)?(?:class="_at_emp"(?:[^>]*)?at="([\w]+\|[^"]+)"|at="(([\w]+\|[^"]+))"(?:[^>]*)?class="_at_emp")(?:[^>]*)\/*>/gi;
        str = str.replace(atReg, function (v, v1, v2) {
            var userId = v1 || v2;
            var arr = userId.split('|');
            var name = arr[1];
            return '<a class="msg_at_emp">@' + name + '</a> ';
        })
        return str;
    }
    util.convertAtToMob = function (str, getEmpFn, getEmpNameFn) {
        var atReg = /<input(?:[^>]*)?(?:class="_at_emp"(?:[^>]*)?at="(([\w]+\|[^"]+))"|at="(([\w]+\|[^"]+))"(?:[^>]*)?class="_at_emp")(?:[^>]*)\/*>/gi;
        var xx = '\u200B';
        str = str.replace(atReg, function (v, v1, v2) {
            var userId = v1 || v2;
            var arr = userId.split('|');
            var name = arr[1];
            return '@' + name + ' ' + xx;
        })
        return str;
    }

    util.convertAtFromMob = function (str) {
        var atReg = /@([^@]+)\s\u200B/gi;
        str = str.replace(atReg, function (v, name) {
            return '<a class="msg_at_emp">@' + name + '</a> ';
        })
        return str;
    }
    util.getAtUserName = function (str) {
        var atReg = /@([^@]+)\s\u200B/gi;
        var res;
        str.replace(atReg, function (v, name) {
            res = name;
        })
        return res;
    }
    util.htmlEncode = function (e) {
        return angular.isString(e) ? e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
    }

    util.htmlDecode = function (e) {
        return e && 0 != e.length ? e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : ""
    }

    util.getTime = function (needMs) {
        var now = (new Date()).getTime();
        return needMs ? now : parseInt(now / 1000);
    }
    util.getNow = function () {
        return util.getTime(1);
    }
    // type : info|error|warn
    var logTimer;
    util.log = function (str, type) {
        return;
        clearTimeout(logTimer);
        type = type || 'info';
        var con = document.getElementById('log_con');
        if (!con) {
            var con = document.createElement('div');
            con.className = 'log ' + type;
            con.id = 'log_con';
            document.body.appendChild(con);
            con.onmouseover = function () {
                clearTimeout(logTimer);
            }
            con.onmouseout = function () {
                logTimer = setTimeout(function () {
                    document.body.removeChild(con);
                }, 10000);
            }
        } else {
            con.className = 'log ' + type;
        }
        con.innerHTML = str;

        logTimer = setTimeout(function () {
            document.body.removeChild(con);
        }, 10000);
    }

    util.isBlank = function (obj) {
        var isBlank = true;
        for (var p in obj) {
            return false;
        }
        return isBlank;
    }
    util.showLog = function () {
        $('#log2').show();
        $('#log2').css({
            zIndex: 999999999,
            background: '#fff',
            overflow: 'auto'
        });
    }
    util.hideLog = function () {
        $('#log2').hide();
    }
    util.setLs = function (k, v) {
        var _v;
        if (typeof v === 'string' || typeof v === 'number') {
            _v = v;
        } else {
            _v = angular.toJson(v);
        }
        try {
            localStorage.setItem(k, _v);
            return true;
        } catch (e) {
            console.log('存储本地数据失败');
            return false;
        }
    }
    util.getLs = function (k) {
        var str = localStorage.getItem(k);
        try {
            str = angular.fromJson(str);
        } catch (e) {
        }
        return str === 'undefined' ? '' : str;
    }
    util.removeLs = function (k) {
        return localStorage.removeItem(k);
    }

    util.utf8ToBase64 = function (str) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
    }
    util.base64ToUTF8 = function (str) {
        return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(str));
    }
    var serviceReg = /^s_.*/;
    util.isService = function (userId) {
        return serviceReg.test(userId);
    }
    var broadChatReg = /^b_.+/;
    util.isBroad = function (userId) {
        return broadChatReg.test(userId);
    }
    var reg = /^group_.*?_[\d.]+$/;
    util.isGroup = function (id) {
        return reg.test(id);
    }
    function newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }
    util.getGuid = function () {
        var guid = util.getLs('guid');
        if (guid) {
            return guid;
        } else {
            var guid = newGuid();
            util.setLs('guid', guid);
            return guid;
        }
    }
    util.getGuid();
    util.isArray = function (t) {
        return Object.prototype.toString.call(t) === '[object Array]';
    }
    function detectOS() {
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows") || (navigator.platform == "Win64");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Windows 2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "Windows XP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Windows 2003";
            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "Windows Vista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Windows 7";
            var isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
            if (isWin8) return 'Windows 8';
            var isWin10 = sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return 'Windows 10';
        }
        return "other";
    }
    util.getOs = function () {
        return detectOS();
    }
    function getSearch(url) {
        var a = url || location.search;
        var obj = {};
        var ps = a.substr(1, a.length).split('&')
        for (var i = 0; i < ps.length; i++) {
            var _a = ps[i].split('=');
            var k = _a[0], v = _a[1];
            if (obj[k]) {
                if (util.isArray(obj[k])) {
                    obj[k].push(v);
                } else {
                    obj[k] = [obj[k]];
                    obj[k].push(v);
                }
            } else {
                obj[k] = v;
            }
        }
        return obj;
    }
    util.getSearch = getSearch;
    // window.getSearch = util.getSearch = getSearch;
    var _env = util.getSearch().env || 'prd';
    util.isDev = function () {
        return _env == 'dev';
    }
    util.indexOf = function (source, tar, filter) {
        var res = -1;
        if (filter) {
            for (var i = 0; i < source.length; i++) {
                if (filter(source[i], tar)) {
                    res = i;
                    break;
                }
            }
        } else {
            for (var i = 0; i < source.length; i++) {
                if (source[i] == tar) {
                    res = i;
                    break;
                }
            }
        }
        return res;
    }

    function contentReplace(pasteIn) {
        var a = document.createElement('div');
        a.innerHTML = pasteIn;
        $(a).find('.msg_sender_name').remove();
        $(a).find('textarea').remove();
        $(a).find('.selected_img').removeClass('selected_img');
        $(a).find('img[emp-avatar]').remove();
        pasteIn = a.innerHTML;
        var vmlReg = /<\!--\[if\s\!vml\]-->.*<\!--\[endif\]-->/g;
        pasteIn = pasteIn.replace(vmlReg, '');
        var htmlBegin = /^(<(div|table|tbody|p|tr|h[1-6])[^<>]*>)+/gi;
        var htmlInner = /<(?:div|td)[^<>]*>(<(div|table|tbody|p|tr|h[1-6])[^<>]*>)*|(<\/(div|table|tbody|p|h[1-6])>)*<\/(td|div)>/gi;
        var blockEnd = /(<\/(div|table|tbody|p|tr|h[1-6])>+)<(div|table|tbody|p|tr|h[1-6])[^<>]*>+/gi;
        var blockEndInner = /(<(div|table|tbody|p|tr|h[1-6])[^<>]*>)+|(<\/(div|table|tbody|p|tr|h[1-6])>)+/gi;

        var innerBegin = /<(input|span|img|i)[^<>]*>/g;
        var innerEnd = /<\/(span|i)>/g;

        var trimBlank = /^\s*|\s*$/gi;
        var blanks = /(\s*)<br/g;

        var str = pasteIn.replace(htmlBegin, '');
        var styleBr = /<br[^>]*\/*>/gi;
        str = str.replace(styleBr, '<br />');
        str = str.replace(blockEnd, '<br />');
        str = str.replace(blockEndInner, '<br />');
        str = str.replace(innerBegin, function (h, tag) {
            if (tag === 'img') {
                return h;
            }
            return '';
        });
        str = str.replace(innerEnd, '');
        str = str.replace(blanks, function () {
            return '<br';
        });

        var prev = '';
        str = util.faceToFont(str);
        str = util.faceToImg(str);
        str = str.replace(/<(?!br|img|input)[\s\S]*?>/g, '');
        var finalHtml = str;
        finalHtml = finalHtml.replace(/&nbsp;/g, " ");
        var anybr = /(\s*<br\s*\/*>\s*\n*)+/gi;
        finalHtml = finalHtml.replace(anybr, '<br />');
        finalHtml = util.convertAtFromMob(finalHtml);
        return finalHtml;
    }
    util.contentReplace = contentReplace;

    function DatePicker(options) {
        this.options = options;
        if (!this.options.format) {
            this.options.format = function (date, con) {
                var span = document.createElement('span');
                span.className = 'normal';
                span.innerHTML = date.format('D');
                con.appendChild(span);
            }
        }
        this.currentMonth = undefined;
        this.init();
    }

    DatePicker.prototype.init = function () {
        var el = this.options.el;
        this.create();
        this.inited = false;
    }
    DatePicker.prototype.create = function () {
        var el = this.options.el;
        var that = this;
        if (!this.inited) {
            var currentDate = this.options.date;
            if (typeof currentDate === 'string') {
                currentDate = this.options.date.toDate();
            }
            if (this.options.date === undefined) {
                currentDate = new Date();
            }
            currentDate.setHours(0);
            currentDate.setMinutes(0);
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            that.selectedDate = currentDate;
            var wrap = $('<div class="date_picker_wrap"></div>').appendTo(el);
            var title = $('<div class="date_picker_title"></div>').appendTo(wrap);
            var prevYear = $('<a href="javascript:;" class="prev_year"><i></i></a>').appendTo(title);
            var prevMonth = $('<a href="javascript:;" class="prev_month"><i></i></a>').appendTo(title);
            var dateCon = $('<div class="month_title"><i></i></div>').appendTo(title);
            var dateSpan = $('<span class="this_month"></span>').appendTo(dateCon);

            var nextMonth = $('<a href="javascript:;" class="next_month"><i></i></a>').appendTo(title);
            var nextYear = $('<a href="javascript:;" class="next_year"><i></i></a>').appendTo(title);
            var table = $('<table></table>').appendTo(wrap);
            var headStr = ['日', '一', '二', '三', '四', '五', '六'];
            var tableHead = $('<thead></thead>').appendTo(table);
            var tableHeadTr = $('<tr></tr>').appendTo(tableHead);
            for (var i = 0; i < headStr.length; i++) {
                var td = $('<td></td>').appendTo(tableHeadTr);
                if (i == 0 || i == 6) {
                    td.addClass('week_end');
                }
                td.html(headStr[i]);
            }
            var tableBody = $('<tbody></tbody>').appendTo(table);
            this.tableBody = tableBody;
            this.dateSpan = dateSpan;
            prevYear.click(function () {
                var prevMonth = that.currentMonth.setMonth(that.currentMonth.getMonth() - 12);
                if (that.options.onChangeMonth) {
                    that.options.onChangeMonth(new Date(prevMonth), function () {
                        that.renderDays(new Date(prevMonth));
                    })
                } else {
                    that.renderDays(new Date(prevMonth));
                }
            })
            prevMonth.click(function () {
                var prevMonth = that.currentMonth.setMonth(that.currentMonth.getMonth() - 1);
                if (that.options.onChangeMonth) {
                    that.options.onChangeMonth(new Date(prevMonth), function () {
                        that.renderDays(new Date(prevMonth));
                    })
                } else {
                    that.renderDays(new Date(prevMonth));
                }
            })
            nextMonth.click(function () {
                var nextMonth = that.currentMonth.setMonth(that.currentMonth.getMonth() + 1);
                if (that.options.onChangeMonth) {
                    that.options.onChangeMonth(new Date(nextMonth), function () {
                        that.renderDays(new Date(nextMonth));
                    })
                } else {
                    that.renderDays(new Date(nextMonth));
                }
            })
            nextYear.click(function () {
                var nextMonth = that.currentMonth.setMonth(that.currentMonth.getMonth() + 12);
                if (that.options.onChangeMonth) {
                    that.options.onChangeMonth(new Date(nextMonth), function () {
                        that.renderDays(new Date(nextMonth));
                    })
                } else {
                    that.renderDays(new Date(nextMonth));
                }
            })
        }
        this.renderDays(currentDate);
    }
    DatePicker.prototype.renderDays = function (currentDate) {
        this.tableBody.html('');
        var that = this;
        var oneDayMillSeconds = 24 * 60 * 60 * 1000;
        var thisDate = currentDate.getTime();
        var monthFirstDate = new Date(thisDate);
        monthFirstDate.setDate(1);
        that.currentMonth = monthFirstDate;
        this.dateSpan.html(monthFirstDate.format('YYYY-MM'));
        var monthFirstDay = monthFirstDate.getDay();
        var startDate = new Date(monthFirstDate.getTime() - monthFirstDay * oneDayMillSeconds);
        var lastMonthFirstDate = new Date(monthFirstDate.getTime());
        lastMonthFirstDate.setMonth(lastMonthFirstDate.getMonth() + 1);
        var monthLastDate = new Date(lastMonthFirstDate.getTime() - oneDayMillSeconds);
        var monthLastDay = monthLastDate.getDay();
        var endDate = new Date(monthLastDate.getTime() + (6 - monthLastDay) * oneDayMillSeconds);
        var days = ((endDate.getTime() - startDate.getTime()) / oneDayMillSeconds) + 1;
        if (days <= 35) {
            days = days + 7;
        }
        var tr;
        var beginTime = startDate.getTime();
        for (var i = 0; i < days; i++) {
            if (i % 7 == 0) {
                tr = document.createElement('tr');
                this.tableBody.append(tr);
            }
            var td = document.createElement('td');
            var thisDate = new Date(beginTime + i * oneDayMillSeconds);
            if (thisDate.getDay() % 6 == 0) {
                td.className = 'week_end';
            }
            if (thisDate.getMonth() < monthFirstDate.getMonth()) {
                td.className = 'last_month_day';
            }
            if (thisDate.getMonth() > monthFirstDate.getMonth()) {
                td.className = 'next_month_day';
            }
            if (that.selectedDate.getTime() == thisDate.getTime()) {
                td.className = 'selected';
            }
            this.options.format(thisDate, td);
            td.onclick = (function (thisDate) {
                return function () {
                    that.selectedDate = thisDate;
                    that.options.dateClick && that.options.dateClick(thisDate, this);
                    $('.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            })(thisDate);
            tr.appendChild(td);
        }
    }
    DatePicker.prototype.setDate = function (date) {
        this.renderDays(date);
    }
    util.DatePicker = DatePicker;
    util.getNewSize = function (naturalWidth, naturalHeight) {
        // var hp = maxHeight / this.height , wp = maxWidth / this.width;
        // var _scale = fixed(conCss.scale);
        // if(1 > hp && 1 > wp){
        // resetSize({scale: Math.min(hp,wp)});
        // }else{
        // if(1 > hp){
        // resetSize({scale: hp});
        // }else{
        // if(1 > wp){
        // resetSize({scale: wp});
        // }else{
        // container.css(conCss);
        // }
        // }
        // }
        var nh = naturalHeight, nw = naturalWidth; // 图片源尺寸
        var sh = screen.height * 0.8, sw = screen.width * 0.8; // 最大窗口宽度，为屏幕分辨率0.8倍
        var minh = 445, minw = 400; // 最小尺寸
        var height, width;
        var hp = sh / nh, wp = sw / nw;
        if (hp < 1 && wp < 1) {
            var p = Math.min(hp, wp);
            height = nh * p;
            width = nw * p;
        } else {
            if (hp < 1) {
                height = nh * hp;
                width = nw * hp;
            } else {
                if (wp < 1) {
                    height = nh * wp;
                    width = nw * wp;
                } else {
                    height = nh;
                    width = nw;
                }
            }
        }
        // if(nh / nw > 1){ // 竖着的长方形
        // height = Math.min(nh , sh);
        // width = height * nw / nh;
        // }else if(nh / nw < 1){ // 横着的长方形
        // width = Math.min(nw , sw);
        // height = width * nh / nw;
        // if(height > sh){
        // height = sh;
        // width = height * nw / nh;
        // }
        // }else{ // 正方形
        // height = width = Math.min(nw , sw);
        // }
        width = Math.max(minw, width);
        height = Math.max(minh, height);
        // width = Math.min(width,sw);
        // height = Math.min(height,sh);
        return {
            minWidth: minw,
            minHeight: minh,
            maxHeight: parseFloat(sh),
            maxWidth: parseFloat(sw),
            width: parseFloat(width),
            height: parseFloat(height)
        }
    }

    util.copyDom = function (str) {
        var envData = envConfig.getEnvData();
        var fileDomain = envData.LocalDomain;
        var html = str;
        var div = document.createElement('div');
        div.innerHTML = html;
        removeComment(div);
        $(div).find('img').each(function () {
            var src = this.src;
            if (fileDomain) {
                var reg = new RegExp('^' + fileDomain);
                if (reg.test(src)) {
                    src = src.replace(reg, '');
                }
            }
            src = src.replace(/^file:\/\/\//, '');
            this.src = src;
        })
        function removeComment(dom) {
            var childs = dom.childNodes;
            if (childs.length) {
                for (var i = childs.length - 1; i >= 0; i--) {
                    if (childs[i].nodeType == 8) {
                        childs[i].parentNode.removeChild(childs[i]);
                    } else {
                        if (childs[i].nodeType == 3) {
                            if (!$.trim(childs[i].nodeValue)) {
                                childs[i].parentNode.removeChild(childs[i]);
                            }
                        } else {
                            removeComment(childs[i]);
                        }
                    }
                }
            }
        }
        html = div.innerHTML;
        var text = str; // 复制的时候将br换成\n，确保在输入框粘贴时显示正常
        var htmlTag = /<([^>]+)\s*[^>]*>/g;
        html = util.faceToFont(html); // 表情图片直接转文字
        // html = util.convertAtToMob(html);
        html = html.replace(/<br\s*\/*>/g, '\n');
        html = html.replace(htmlTag, function (v, tag) { // 去除input、img标签以外html
            if (v.indexOf('<img ') == 0) {
                v = decodeURIComponent(v);
                // var srcreg = /src="([^"]+)"/
                // v = v.replace(srcreg,function(v1,v2){
                // return 'src="'+v2.replace(/\s/g,'%20')+'"';
                // })
                return v;
            }
            if (v.indexOf('<input ') == 0) {
                return v;
            }
            return '';
        });
        html = html.replace(/\s/g, function (v) { // 把空格换成&nbsp;
            if (/\n/.test(v)) {
                return v;
            }
            return '&nbsp;';
        });
        html = html.replace(/<.*(&nbsp;).*>/g, function (v) { // 把img标签中的&nbsp;再换回html代码空格
            return v.replace(/&nbsp;/g, ' ');
        })
        html = html.replace(/\n/g, '<br>');
        // html = html.replace(/&amp;/g,'&');
        // html = util.convertAtFromMob(html);

        text = text.replace(/<br\s*\/*>/g, '\r\n');
        text = util.faceToFont(text);
        text = text.replace(htmlTag, function (v, tag) {
            if (v.indexOf('<img ') == 0) {
                return util.langPack.getKey('img');
            }
            return '';
        });
        // text = text.replace(/\s/g,'&nbsp;');
        text = util.htmlDecode(text);
        text = text.replace(/&nbsp;/g, ' ');
        return {
            text: text,
            html: html
        }
    }
    util.KEYMAP = {
        TAB: 9,
        ENTER: 13,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        S: 83,
        Q: 81,
        '2': 50,
        ESC: 27,
        A: 65,
    }
    var imgExt = {
        png: 1,
        gif: 1,
        jpg: 1,
        jpeg: 1,
        bpm: 1,
        ico: 1
    }
    util.isImg = function (name) {
        var extArr = name.split('.');
        var ext = extArr[extArr.length - 1];
        ext = ext || '';
        ext = ext.toLowerCase();
        if (imgExt[ext]) {
            return true;
        }
        return false;
    }
    util.isGif = function (name) {
        var extArr = name.split('.');
        var ext = extArr[extArr.length - 1] || '';
        ext = ext.toLowerCase();
        if (ext === 'gif') {
            return true;
        }
        return false;
    }
    return util;
}])

services.factory('imSocket', function () {
    var ProtoBuf = dcodeIO.ProtoBuf;
    var map = {
        'SnailChat.User': 0x01,
        'SnailChat.Server': 0x02,
        'SnailChat.ServerGroup': 0x03,
        'SnailChat.Client': 0x04,
        'SnailChat.Message': 0x05,
        'SnailChat.OffMessage': 0x06,
        'SnailChat.TokenGroup': 0x07,
        'SnailChat.TokenRtmp': 0x08,
        'SnailChat.ShutUserUp': 0x09,
        'SnailChat.GroupShutupUsers': 0x0A,
        'SnailChat.ReportMsgTick': 0x0B,
        'SnailChat.MsgTickList': 0x0C,
        'SnailChat.ReportBindAddr': 0x0D,
        'SnailChat.QueryBindAddr': 0x0E,
        'SnailChat.Periodic': 0x0F
    };
    var messageTypeMap = {
        'text': 0,
        'voice': 1,
        'video': 2,
        'file': 3,
        'image': 4,
        'service': 10
    }
    var def = {
        beforeSend: function () { },
        onMessage: function (ev) { },
        onOpen: function () { },
        onClose: function () { }
    }
    function WebSocketIM(url, protoFile, options) {
        this.url = url;
        this.protoFile = protoFile;
        this.packages = {};
        this.options = options;
        for (var p in def) {
            if (!options[p]) options[p] = def[p];
        }
        this.beforeOpenRequest = [];
        this.initProto();
        // this.connect();
    }
    var fn = WebSocketIM.prototype;
    fn.initProto = function () {
        if (this.buildPackage) return;
        var protos = ProtoBuf.loadProtoFile(this.protoFile);
        protos.build();
        this.buildPackage = true;
        var _protosClasses = protos.result;
        for (var p in _protosClasses) {
            if (_protosClasses.hasOwnProperty(p)) {
                for (var _p in _protosClasses[p]) {
                    if (_protosClasses[p].hasOwnProperty(_p)) {
                        this.packages[[p, _p].join('.')] = _protosClasses[p][_p];
                    }
                }
            }
        }
    }
    fn.connect = function () {
        var that = this;
        try {
            var socket = this.socket = new WebSocket(this.url);
            console.log(this.url)
            socket.binaryType = 'arraybuffer';
            socket.onopen = function () {
                that.options.onOpen.call(that);
                while (that.beforeOpenRequest.length) {
                    var _fn = that.beforeOpenRequest.pop();
                    _fn.call(that);
                }
            }
            socket.onclose = function () {
                console.log('onclose')
                that.options.onClose.call(that);
            }
            socket.onmessage = function (ev) {
                // console.log(ev.data);
                that.options.onMessage.call(that, ev.data);
            }
            socket.onerror = function () {
                console.log(arguments);
                if (this.readyState < 3) {
                    that.options.onConnectFail && that.options.onConnectFail.call(that);
                }
            }
        } catch (e) {
            that.options.onConnectFail && that.options.onConnectFail.call(that);
        }
    }
    fn.send = function (name, obj) {
        var that = this;
        if (WebSocket.OPEN == this.socket.readyState) {
            var socket = this.socket;
            var _class = this.getClass(name);
            var msgBuffer = obj.toArrayBuffer();
            var msgUintBuffer = new Uint8Array(msgBuffer);
            if (this.options.beforeSend) {
                msgBuffer = this.options.beforeSend(name, msgBuffer, obj);
            }
            console.log('send %s by socket send method', name)
            socket.send(msgBuffer);
        } else {
            this.beforeOpenRequest.push(function () {
                that.send(name, obj);
            })
        }
    }
    fn.getClass = function (name) {
        return this.packages[name]
    }
    fn.buildClass = function (name) {
        var _class = this.getClass(name);
        return new _class();
    }
    fn.decodeBuffer = function (name, buffer) {
        var _class = this.getClass(name);
        return _class.decode(buffer);
    }
    fn.clearRequest = function () {
        this.beforeOpenRequest.length = 0;
    }
    fn.close = function () {
        this.socket.close();
    }
    WebSocketIM.idx = 1;
    return {
        WebSocketIM: WebSocketIM,
        map: map,
        messageTypeMap: messageTypeMap
    }
})

services.factory('socketConnect', ['$rootScope', 'servers', 'util', 'imSocket', '$state', 'userConfig', 'empService', '$timeout', 'webConfig', 'domain', 'langPack', 'empStatusService', function ($rootScope, servers, util, imSocket, $state, userConfig, empService, $timeout, webConfig, domain, langPack, empStatusService) {
    var map = imSocket.map;
    var messageTypeMap = imSocket.messageTypeMap;
    var _map = {};
    for (var p in map) {
        _map[map[p]] = p;
    }
    var info = {
        connectStatus: '',
        // account : '',
        // phone : '',
        userId: '',
        token: ''
        // uid : ''
    }
    var webSend = {};
    function beforeSend(name, buffer, obj) {
        var _buf = new ArrayBuffer(buffer.byteLength + 2);
        var _bufArr = new Uint8Array(_buf);

        var bufferArr = new Uint8Array(buffer);
        _bufArr[0] = map[name] / 256;
        _bufArr[1] = map[name] % 256;
        for (var i = 0; i < bufferArr.length; i++) {
            _bufArr[i + 2] = bufferArr[i];
        }
        webSend[obj.msgid] = obj;
        console.log('send %s', name, obj);
        return _buf;
    }
    function getNow(ms) {
        var time = (new Date()).getTime();
        return time; // ms ? time : parseInt( time / 1000);
    }
    function clearAllTimer() {
        clearTimeout(periodicTimer);
        clearTimeout(disConnentTimer);
        clearTimeout(getGroupInfoTimer);
        periodicTimer = undefined;
        disConnentTimer = undefined;
    }
    function socketOnOpen(username, token) {
        verOpened = true;
        util.log(langPack.getKey('afterSSOSuccess'));
        console.log('socket opened');
        var user = this.buildClass('SnailChat.User');
        user.setIdx(1);

        user.setTimestamp(getNow());
        user.setMsgid(username + getNow(1));
        user.setUsername(username);
        user.setServeraddr('0.0.0.0:0');
        // user.setUsrpwd(password);
        user.setUsrtoken(token);
        user.setStatus(0x01);
        user.setSource(domain.recourse);
        user.setAction(0x00);
        user.clientVersion = webConfig.version;
        user.deviceID = util.browser.name + ' ' + util.browser.version;
        user.deviceCode = util.getGuid().toUpperCase();
        user.os = util.getOs();
        this.send('SnailChat.User', user);
    }
    function socketOnClose() {
        console.log('socket close');
        // $rootScope.$broadcast('socketClose',info.account,0,info.phone);
        clearAllTimer();
        if (info.userId) {
            $rootScope.$broadcast('afterLogout');
        } else {
            util.log(langPack.getKey('connectFail'), 'error');
            $rootScope.$broadcast('connecntServerFail');
        }
    }
    function socketOnMessage(buffer) {
        var that = this;
        var bufferArr = new Uint8Array(buffer);

        var proto = bufferArr[1];
        var name = _map[proto];
        try {
            var msg = this.decodeBuffer(name, buffer);
            console.log('receive %s message : ', name, msg, proto);
        } catch (e) {
            console.log(e)
            console.log('%c receive unkown message : proto ===' + proto, 'background: #ff0000;color:#fff');
        }

        if (name != 'SnailChat.TokenGroup') {
            delete webSend[msg.msgid];
        }
        messageCallBack[name] && messageCallBack[name].call(that, name, msg, buffer);
    }
    var periodicTimer, disConnentTimer;
    var messageCallBack = {
        'SnailChat.Server': function (name, msg, buffer) {
            var that = this;
            if (msg.user) {
                var userId = msg.user.username;
                var password = msg.user.usrpwd;
                var client = that.buildClass('SnailChat.Client');
                client.setTimestamp(getNow());
                client.setMsgid(msg.user.username + getNow(1));
                client.setIp(msg.ip);
                client.setPort(msg.port);
                client.setUser(msg.user);
                client.setOpt(1);
                that.send('SnailChat.Client', client);
            } else {
                $rootScope.$broadcast('afterLogout');
                clearTimeout(periodicTimer);
                clearTimeout(disConnentTimer);
            }
        },
        'SnailChat.Client': function (name, msg, buffer) {
            var that = this;
            var userId = msg.user.username;
            var password = msg.user.usrpwd;
            if (msg.ret == 1) {
                if (msg.opt == 1) {
                    info.userId = userId;
                    info.SUserId = userId;
                    util.setLs(webConfig.LOGIN_KEY, webConfig.getToken());
                    util.setLs(webConfig.LOGIN_USER, webConfig.getUser().SUserId);
                    var status = 3;
                    afterInited();
                    $rootScope.$broadcast('afterLogin', userId, status, info.phone);
                    info.connectStatus = status;
                    util.log(langPack.getKey('loginSuccess'));
                    empService.initLoginEmp(webConfig.getUser());
                }
            } else {
                if (msg.opt == 10) {
                    // delete info.userId;
                    if (util.browser.mozilla) {
                        socketOnClose = function () { }
                    }
                    util.removeLs(webConfig.LOGIN_KEY);
                    alert(langPack.getKey('loginInOther'));
                    clearTimeout(periodicTimer);
                    clearTimeout(disConnentTimer);
                    if (util.browser.mozilla) {
                        $rootScope.$broadcast('loginInOther');
                    }
                    return;
                }
            }
            function afterInited() {
                var perio = socketConnect.chatSocket.buildClass('SnailChat.Periodic');
                var time = getNow();
                perio.setTimestamp(time);
                perio.setKey(userId);
                perio.setMsgid(userId + getNow(1));
                socketConnect.chatSocket.send('SnailChat.Periodic', perio);
                disConnentTimer = setTimeout(function () {
                    clearTimeout(periodicTimer);
                    clearTimeout(disConnentTimer);
                    periodicTimer = undefined;
                    disConnentTimer = undefined;
                    socketConnect.chatSocket.close();
                    $rootScope.$broadcast('connectTimeout');
                }, 20 * 1000);
                // var _userMsg = that.buildClass('SnailChat.User');
                // _userMsg.setStatus(7);
                // _userMsg.setUsername(userId);
                // _userMsg.setUserkey(userId);
                // _userMsg.setMsgid(userId + getNow(1));
                // _userMsg.setSource(domain.recourse);
                // socketConnect.chatSocket.send('SnailChat.User',_userMsg);
                // for(var i=0;i<10;i++){
                // (function(idx){
                // $.ajax({
                // type : 'post',
                // url : '/qixin/WebChat/getDepts.wn',
                // beforeSend : function(req){
                // req.setRequestHeader('token',info.token);
                // },
                // data : {
                // entId : 'ff808081581b3e2801581b47dd4e0000'
                // },
                // success : function(){
                // console.log(idx);
                // }
                // })
                // })(i);
                // }
                window.sendMessage = function (to, content) {
                    var msg = {
                        to: to || 'f5b8d13e4dec4ec1a6839c34e7655777',
                        content: content || '1',
                        messageid: info.userId + getNow(),
                        type: 'text'
                    }
                    socketConnect.sendMessage(msg)
                }
            }
        },
        'SnailChat.User': function (name, msg, buffer) {
            var that = this;
            var userId = msg.userkey;
            var resource = msg.source;
            console.log('snailchat.user message in coming')
            if (msg.status == 7) {
                var len = msg.userlist.length;
                for (var i = 0; i < len; i++) {
                    var _userId = msg.userlist[i].userkey;
                    var _resource = msg.userlist[i].source;
                    var status = msg.userlist[i].status == 0 ? 'offline' : 'online';
                    empService.setEmpStatus(_userId, _resource, status);
                    $rootScope.$broadcast('empStatusChange', [_userId], status, [_resource]);
                }
            } else if (msg.status == 5) {
                empService.setEmpStatus(userId, resource, 'offline');
                $rootScope.$broadcast('empStatusChange', [userId], 'offline', [resource]);
            } else if (msg.status == 1) {
                empService.setEmpStatus(userId, resource, 'online');
                $rootScope.$broadcast('empStatusChange', [userId], 'online', [resource]);
            }
        },
        'SnailChat.Message': function (name, msg, buffer) {
            var that = this;
            console.log('snailchat.message message in coming')
            if (msg.readtime && msg.action == 3) {
                // $rootScope.$broadcast('signMsgReaded',msg.touser);
                return;
            }
            if (msg.msgtype == 6) { // 过滤语音消息发过来的Message
                return;
            }
            if (mainControllerIsReady) {
                // console.log('----------------------main  ready and broadcast event----------------------')
                if (!msg.broadcasttype) {
                    $rootScope.$broadcast('receiveMsg', [msg]);
                    $rootScope.$broadcast('empStatusChange', [msg.fromuser], 'online', [msg.source]);
                } else {
                    $rootScope.$broadcast('receiveBroadcastMsg', msg);
                }
            } else {
                // console.log('----------------------main  unready and save msg----------------------')
                beforeReadyMsgList.push(msg);
            }
            // 回发消息，告诉服务器此消息已收到
            var message = that.buildClass('SnailChat.Message');
            message.setTimestamp(getNow());
            message.setMsgid(msg.msgid);
            message.setTouser(info.userId);
            message.setFromuser(info.userId);
            message.setReadtime = getNow();
            message.msgtype = msg.msgtype;
            message.retcode = 1;
            that.send('SnailChat.Message', message);
        },
        'SnailChat.OffMessage': (function () {
            var queue = [], maxLen = 10, timer, _time = 2000;
            return function (name, msg, buffer) {
                if (msg.readed) return;
                var that = this;
                console.log('snailchat.offmessage message in coming');
                $rootScope.$broadcast('receiveOffMsg', msg.offmsglist);
                console.log('snailchat.offmessage messeage : readed : ' + msg.readed);
                msg.setReaded(true);
                socketConnect.chatSocket.send(name, msg);
                // if(queue.length >= maxLen){
                // queue.sort(function(v1,v2){
                // return v1.timestamp > v2.timestamp ? -1 : 1
                // })
                // var _msg = queue[0];
                // _msg.setReaded(true);
                // _msg.setForward(false);
                // _msg.offmsg.setTouser(info.account);
                // console.log('满10条，发送');
                // queue.length = 0;
                // socketConnect.chatSocket.send(name,_msg);
                // }else{
                // if(timer){
                // clearTimeout(timer);
                // timer = undefined;
                // }
                // if(!queue.length) return;
                // timer = setTimeout(function(){
                // console.log('2秒内没收到，queue长度%d',queue.length)
                // queue.sort(function(v1,v2){
                // return v1.timestamp > v2.timestamp ? -1 : 1
                // })
                // var _msg = queue[0];
                // if(_msg){
                // _msg.setReaded(true);
                // _msg.setForward(false);
                // _msg.offmsg.setTouser(info.account);
                // socketConnect.chatSocket.send(name,_msg);
                // timer = undefined;
                // queue.length = 0;
                // }
                // },_time);
                // }
            }
        })(),
        'SnailChat.Periodic': (function () {
            return function (name, msg, buffer) {
                var userId = info.userId;
                var that = this;
                if (!userId) return;
                console.log('snailchat.Periodic message in coming');
                clearTimeout(disConnentTimer);
                periodicTimer = setTimeout(function () {
                    if (disConnentTimer) {
                        clearTimeout(disConnentTimer);
                        disConnentTimer = undefined;
                    }
                    var perio = socketConnect.chatSocket.buildClass('SnailChat.Periodic');
                    var time = getNow();
                    perio.setTimestamp(time);
                    perio.setKey(userId);
                    perio.setMsgid(userId + getNow(1));
                    socketConnect.chatSocket.send('SnailChat.Periodic', perio);
                    disConnentTimer = setTimeout(function () {
                        clearTimeout(periodicTimer);
                        clearTimeout(disConnentTimer);
                        periodicTimer = undefined;
                        disConnentTimer = undefined;
                        socketConnect.chatSocket.close();
                        $rootScope.$broadcast('connectTimeout');
                    }, (msg.timeout + 20) * 1000);
                }, msg.timeout * 1000);
            }
        })(),
        'SnailChat.TokenGroup': function (name, msg, buffer) {
            var that = this;
            console.log('snailchat.TokenGroup message in coming');
            var groupid = msg.groupid;
            if (msg.retcode == 1) {
                var emps = msg.users || [];
                var list = [], currentEmpInRoom = false;
                empService.setGroupAdmin(groupid, msg.passowner);
                for (var i = 0; i < emps.length; i++) {
                    var emp = empService.getEmpInfo(emps[i], 'SUserId', function (_emp) {
                        $rootScope.$broadcast('resetRoomTempName', groupid);
                    });
                    if (emp.SUserId) {
                        // emp.isAdmin = 0;
                        // if(msg.passowner == emps[i]){

                        // }
                        if (info.userId == emp.SUserId) {
                            currentEmpInRoom = true;
                        }
                        list.push(emp);
                    }
                }
                list.sort(function (v1, v2) {
                    var name1 = v1.SShowName || v1.SEmpName || v1.SName;
                    var pinyin1 = util.getPinyin(name1);
                    var name2 = v2.SShowName || v1.SEmpName || v2.SName;
                    var pinyin2 = util.getPinyin(name2);
                    return pinyin1 > pinyin2;
                })
                if (msg.action == 1) {
                    groupResponsed[groupid] = msg.groupname;
                    pushed[groupid] = true;
                    $rootScope.$broadcast('createRoomSuccess', groupid, msg);
                    // socketConnect.getGroupInfo(msg.groupid);
                    if (!webSend[msg.msgid]) {
                        $rootScope.$broadcast('empJoinRoom', groupid, list, msg);
                    }
                    $rootScope.$broadcast('receiveRoomMembers', groupid, list);
                    $rootScope.$broadcast('receiveRoomSubject', groupid, msg.groupname, msg);
                }
                if (msg.action == 2) {
                    $rootScope.$broadcast('empJoinRoom', groupid, list, msg);
                }
                if (msg.action == 3) {
                    if (list.length == 1) {
                        if (msg.actor == list[0].SUserId) {
                            $rootScope.$broadcast('empLeave', groupid, list, msg);
                        } else {
                            $rootScope.$broadcast('empKicked', groupid, list, msg);
                        }
                    } else {
                        $rootScope.$broadcast('empKicked', groupid, list, msg);
                    }
                }
                if (msg.action == 4) {
                    $rootScope.$broadcast('roomSubjectChange', groupid, msg.groupname, msg.actor, msg);
                }
                if (msg.action == 5) {

                }
                if (msg.action == 6) {
                    groupResponsed[groupid] = msg.groupname;
                    $('#log2').append('<div>群组【' + groupid + '】信息获取成功</div>');
                    $('#log2').append('<div>名称：' + msg.groupname + ' ， 成员：' + emps.join(',') + '</div>');
                    getGroupInfoRequesting[groupid] && clearTimeout(getGroupInfoRequesting[groupid].timer);
                    delete getGroupInfoRequesting[groupid];
                    var currentEmpInRoom = false;
                    for (var i = 0; i < emps.length; i++) {
                        emp = angular.copy(empService.getEmpInfo(emps[i]));
                        if (info.SUserId == emp.SUserId) {
                            currentEmpInRoom = true;
                        }
                    }
                    if (!currentEmpInRoom) {
                        $rootScope.$broadcast('empNotInRoom', groupid);
                        empService.removeRecent(info.SUserId, groupid);
                        // for(var i=0;i<requestArr.length;i++){
                        // if(requestArr[i].roomId == groupid){
                        // requestArr[i].response = true;
                        // }
                        // }
                    } else {
                        $rootScope.$broadcast('receiveRoomMembers', groupid, list, msg);
                        $rootScope.$broadcast('receiveRoomSubject', groupid, msg.groupname, msg);
                    }
                    var allComplete = true;
                    for (var i = 0; i < requestArr.length; i++) {
                        if (requestArr[i].roomId == groupid) {
                            requestArr[i].response = true;
                        }
                        if (!requestArr[i].response) {
                            allComplete = false;
                        }
                    }
                    clearTimeout(getGroupInfoTimer);
                    getGroupInfoTimer = undefined;
                    if (allComplete) {
                        gotoNext();
                    }
                }
                if (msg.action == 7) {
                    console.log('=========================群主转让成功,%s,%s , =======================', groupid, msg.passowner)
                    empService.setGroupAdmin(groupid, msg.passowner);
                    $rootScope.$broadcast('transOwnerSuccess', groupid, msg.passowner);
                }
            } else if (msg.retcode == 9) {
                groupResponsed[groupid] = true;
                notFoundGroup[groupid] = true;
                getGroupInfoRequesting[groupid] && clearTimeout(getGroupInfoRequesting[groupid].timer);
                delete getGroupInfoRequesting[groupid];
                delete groupResponsed[groupid];
                delete pushed[groupid];
                $('#log2').append('<div>群组【' + groupid + '】不存在</div>');
                var allComplete = true;
                for (var i = 0; i < requestArr.length; i++) {
                    if (requestArr[i].roomId == groupid) {
                        requestArr[i].response = true;
                    }
                    if (!requestArr[i].response) {
                        allComplete = false;
                    }
                }
                clearTimeout(getGroupInfoTimer);
                getGroupInfoTimer = undefined;
                if (allComplete) {
                    gotoNext();
                }
                // if(!allComplete){
                // var unComplete = [];
                // for(var i=0;i<requestArr.length;i++){
                // if(!requestArr[i].response){
                // unComplete.push(requestArr[i]);
                // }
                // }
                // getGroupInfoTimer = setTimeout(function(){
                // var ids = [];
                // var num = maxRequestNum - unComplete.length;
                // [].push.apply(unComplete , roomMemberRequestQueue.splice(0,num));
                // for(var y=0;y<unComplete.length;y++){
                // unComplete[y].request();
                // ids.push(unComplete[y].roomId);
                // }
                // $('#log2').append('<div>群组信息获取失败，再次进行获取：' + ids.join('，') +'</div>');
                // },20000);
                // }
                $rootScope.$broadcast('roomNotFound', msg.groupid);
            } else {
                if (msg.retcode == 13) {
                    alert(langPack.getKey('sessionExpired'));
                    $rootScope.$broadcast('afterLogout');
                    clearTimeout(periodicTimer);
                    clearTimeout(disConnentTimer);
                    return;
                }
                // if(!msg.servicetype){
                // alert(msg.reason);
                // }else{
                // util.log('服务号消息接收异常...','error');
                // }
            }
            delete webSend[msg.msgid];
        },
        'SnailChat.TokenRtmp': function (name, msg, buffer) {
            console.log('SnailChat.TokenRtmp in coming');
            if (msg.action == 2) {
                $rootScope.$broadcast('receiveVoiceMetting', msg);
            }
        },
        'SnailChat.MsgTickList': function (name, msg, buffer) {
            console.log('SnailChat.MsgTickList in coming');
            var items = msg.tickItem;
            $rootScope.$broadcast('getChatListFromServer', items);
            for (var i = 0; i < items.length; i++) {
                if (items[i].recver != '0') {
                    $rootScope.$broadcast('signMsgReaded', items[i].recver);
                }
            }
        },
        'SnailChat.GroupShutupUsers': function (name, msg, buffer) {
            console.log('SnailChat.GroupShutupUsers in coming');
            var groupId = msg.groupid;
            if (!shutUpData[groupId]) shutUpData[groupId] = {};
            var now = util.getTime(0);
            for (var i = 0; i < msg.shutupUsers.length; i++) {
                var isIn = false;
                var userId = msg.shutupUsers[i].userkey;
                var sur = msg.shutupUsers[i].invalidtime - msg.shutupUsers[i].effecttime - msg.shutupUsers[i].quietSpanTime;
                if (shutUpData[groupId][userId]) {
                    shutUpData[groupId][userId].localShutUpEndTime = now + sur + 2;
                } else {
                    shutUpData[groupId][userId] = {
                        localShutUpEndTime: now + sur + 2
                    }
                }
            }
        },
        'SnailChat.ShutUserUp': function (name, msg, buffer) {
            console.log('SnailChat.ShutUserUp in coming');
            var groupId = msg.groupid;
            if (!shutUpData[groupId]) shutUpData[groupId] = {};
            var change = msg.invalidtime - msg.effecttime;
            var invalidtime = change + util.getTime(0);
            if (msg.shutuup == 1) {
                for (var i = 0; i < msg.targetuser.length; i++) {
                    var userId = msg.targetuser[i];
                    if (shutUpData[groupId][userId]) {
                        shutUpData[groupId][userId].localShutUpEndTime = invalidtime + 2;
                    } else {
                        shutUpData[groupId][userId] = {
                            localShutUpEndTime: invalidtime + 2
                        }
                    }
                    $rootScope.$broadcast('shutUpAction', groupId, userId, change, 1);
                }
            } else {
                for (var i = 0; i < msg.targetuser.length; i++) {
                    var userId = msg.targetuser[i];
                    delete shutUpData[groupId][userId];
                    $rootScope.$broadcast('shutUpAction', groupId, userId, change, 0);
                }
            }
        }
    }
    // function computeLocalShutUpTime(shutUpObj){
    // var localTime = getNow();
    // var change = shutUpObj.invalidtime - shutUpObj.effecttime;
    // return {
    // userId : shutUpObj.userkey,
    // localShutUpEndTime : localTime + change
    // }
    // }
    function gotoNext() {
        requestArr.length = 0;
        if (getGroupInfoQueue.length) {
            var _requestArr = getGroupInfoQueue.splice(0, maxRequestNum);
            [].push.apply(requestArr, _requestArr);
            for (var i = 0; i < requestArr.length; i++) {
                requestArr[i].request();
            }
        }
    }
    var getGroupInfoQueue = [], getGroupInfoRequesting = {}, requestArr = [];
    var groupResponsed = {};
    var notFoundGroup = {};
    var getGroupInfoTimer, maxRequestNum = 1, pushed = {};
    var getFailed = {};
    var retryTime = 3;

    var shutUpData = {};
    // groupId : [
    // {userId : 1,localShutUpEndTime:1111}
    // ];
    window.requestQueue = {
        getGroupInfoQueue: getGroupInfoQueue,
        getGroupInfoRequesting: getGroupInfoRequesting,
        requestArr: requestArr,
        pushed: pushed,
        notFoundGroup: notFoundGroup,
        groupResponsed: groupResponsed,
        getFailed: getFailed
    }
    var mainControllerIsReady = false;
    var beforeReadyMsgList = [];
    var socketConnect = {
        info: info,
        // verSocket : '',
        chatSocket: '',
        loginServer: function (userId, token, finalCallback) {
            var that = this;
            // info.phone = 
            info.token = token;
            function _connect() {
                util.log(langPack.getKey('connectServer'));
                that.chatSocket = new imSocket.WebSocketIM(servers.socketUrl, './chatmessage.proto', {
                    beforeSend: beforeSend,
                    onMessage: socketOnMessage,
                    onClose: function () {
                        socketOnClose.call(this);
                    },
                    onOpen: function () {
                        util.log(langPack.getKey('connectSuccess'));
                        socketOnOpen.call(this, userId, token);
                    },
                    onConnectFail: function () {
                        util.log(langPack.getKey('connectFail'), 'error');
                        $rootScope.$broadcast('connecntServerFail');
                    }
                });
                that.chatSocket.connect();
            }
            _connect();
        },
        logout: function () {
            var that = this;
            var client = that.chatSocket.buildClass('SnailChat.Client');
            client.setTimestamp(getNow());
            client.setMsgid(info.userId + getNow(1));
            client.setOpt(2);
            that.chatSocket.send('SnailChat.Client', client);
            $rootScope.$broadcast('afterLogout');
        },
        attach: function (phone, ticket, callback) {
            socketConnect.loginServer(phone, ticket, function () {
                callback && callback();
            });
        },
        getGroupInfo: (function () {
            function createRequest(groupId) {
                var fnObj = {
                    count: 1,
                    roomId: groupId,
                    response: false,
                    request: function () {
                        var that = socketConnect;
                        if (groupResponsed[groupId] || getGroupInfoRequesting[groupId]) {
                            return;
                        }
                        getGroupInfoRequesting[groupId] = fnObj;
                        var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
                        tg.setTimestamp(getNow());
                        tg.setGroupid(groupId);
                        tg.setActor(info.userId);
                        tg.setMsgid(info.userId + getNow(1));
                        tg.setAction(6);
                        that.chatSocket.send('SnailChat.TokenGroup', tg);
                        $('#log2').append('<div>群组信息【' + groupId + '】获取中....</div>');
                        fnObj.timer = setTimeout(function () {
                            if (fnObj.count >= retryTime) {
                                clearTimeout(fnObj.timer);
                                getFailed[groupId] = 1;
                                gotoNext();
                                $('#log2').append('<div>群组<span style="color:red;">名称</span>【' + groupId + '】获取失败，已重试' + retryTime + '次，放弃获取</div>');
                                return;
                            }
                            fnObj.count = fnObj.count + 1;
                            delete getGroupInfoRequesting[groupId];
                            fnObj.request();
                            $('#log2').append('<div>群组信息获取失败，再次进行获取：' + groupId + '</div>');
                        }, 20000);
                    }
                }
                return fnObj;
            }
            return function (groupId, reload) {
                if (reload) {
                    delete groupResponsed[groupId];
                    delete getGroupInfoRequesting[groupId];
                    delete pushed[groupId];
                }
                if (pushed[groupId]) return;
                pushed[groupId] = true;
                if (requestArr.length < maxRequestNum) {
                    var obj = createRequest(groupId);
                    obj.request();
                    // getGroupInfoRequesting[groupId] = 1;
                    requestArr.push(obj);
                } else {
                    getGroupInfoQueue.push(createRequest(groupId));
                }
            }
        })(),
        clearGroupInfo: function (groupId) {
            delete pushed[groupId];
            delete groupResponsed[groupId];
            delete getGroupInfoRequesting[groupId];
        },
        sendMessage: function (msg) {
            var that = this;
            var message = that.frontMsgToSocketMsg(msg);
            that.chatSocket.send('SnailChat.Message', message);
        },
        sendWithDrawMsg: function (chatId, msgId) {
            var that = this;
            var loginUser = webConfig.getUser();
            var message = that.chatSocket.buildClass('SnailChat.Message');
            var userId = loginUser.SUserId;
            var msgObj = {
                chatid: chatId,
                senderName: loginUser.SName,
                sender: loginUser.SUserId,
                n_TYPE: 7,
                messageid: msgId
            }
            message.setTimestamp(getNow());
            message.setMsgid(userId + util.getNow());
            message.setFromuser(info.userId);
            message.setTouser(chatId);
            message.msgtype = 10;
            message.setStatus(util.isGroup(chatId) ? 1 : 0);
            message.setSource(domain.recourse);
            var content = angular.toJson(msgObj);
            var base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(content));
            message.setContent(base64Content);
            message.setAction(0);
            message.setForward(false);
            that.sendNativeMessage(message);
            $rootScope.$broadcast('withDrawMsg', chatId, msgObj);
        },
        sendSetTopMsg: function (chatId, isTop) {
            var that = this;
            var loginUser = webConfig.getUser();
            var message = that.chatSocket.buildClass('SnailChat.Message');
            var userId = loginUser.SUserId;
            var msgObj = {
                chatid: chatId,
                sender: loginUser.SUserId,
                n_TYPE: 6,
                setTopType: isTop ? 'addTop' : 'deleteTop'
            }
            message.setTimestamp(getNow());
            message.setMsgid(userId + util.getNow());
            message.setFromuser(info.userId);
            message.setTouser(userId);
            message.msgtype = 10;
            message.setStatus(0);
            message.setSource(domain.recourse);
            var content = angular.toJson(msgObj);
            var base64Content = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(content));
            message.setContent(base64Content);
            message.setAction(0);
            message.setForward(false);
            that.sendNativeMessage(message);
        },
        sendNativeMessage: function (msg) {
            this.chatSocket.send('SnailChat.Message', msg);
        },

        frontMsgToSocketMsg: function (frontMsg) {
            var that = this;
            var reg = /^group_.*?_[\d.]+$/;
            // var message = that.chatSocket.buildClass('SnailChat.Message');
            // message.setTimestamp(frontMsg.selfDate);
            // message.setMsgid(frontMsg.messageid);
            // message.setFromuser(info.userId);
            // message.setTouser(frontMsg.to);
            // message.msgtype = messageTypeMap[frontMsg.type];
            // message.setStatus(reg.test(frontMsg.to) ? 1 : 0);
            if (frontMsg.type == webConfig.MSG_FILE_TYPE) {
                message.setLength = frontMsg.typeex;
            }
            // message.setSource(domain.recourse);
            // message.setSource(1);
            if (frontMsg.type == webConfig.MSG_TEXT_TYPE) {
                var _content = frontMsg.content;
                var reg = /<br[^>]*\/*>/g, nbsp = /&nbsp;/g;
                _content = _content.replace(reg, '\n');
                _content = _content.replace(nbsp, ' ');
                _content = util.faceToFont(_content);
                _content = util.htmlDecode(_content);
                //@人转换
                _content = util.convertAtToMob(_content, empService.getEmpInfo, empService.getEmpName);
                message.setContent(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(_content)));
            } else {
                message.setContent(frontMsg.thumb);
            }
            if (frontMsg.type == webConfig.MSG_PIC_TYPE) {
                message.setLength(frontMsg.url.length);
            }
            message.setUrl(frontMsg.type == webConfig.MSG_TEXT_TYPE ? '' : frontMsg.url);
            message.setAction(0);
            message.setForward(false);
            return message;
        },
        createRoom: function (roomId, members, name, creator) {
            var that = this;
            var emps = [];
            var currentEmpIsAdded = false, creatorIsAdded = false;
            for (var i = 0; i < members.length; i++) {
                if (typeof members[i] === 'string') {
                    emps.push(members[i]);
                    if (members[i] == info.userId) currentEmpIsAdded = true;
                    // if(members[i] == creator) creatorIsAdded = true;
                } else {
                    emps.push(members[i].SUserId);
                    if (members[i].SUserId == info.userId) currentEmpIsAdded = true;
                    // if(members[i].SEmpAccount == creator) creatorIsAdded = true;
                }
            }
            console.log('createRoom , %s , %s , %s ,%s', roomId, emps.join(','), name, creator);
            var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
            tg.setTimestamp(getNow());
            tg.setGroupid(roomId);
            tg.setMsgid(info.userId + getNow(1));
            tg.setAction(1);
            tg.setActor(info.userId);
            !currentEmpIsAdded && emps.push(info.userId);
            tg.setUsers(emps);
            if (name) {
                tg.setGroupname(name);
            }
            that.chatSocket.send('SnailChat.TokenGroup', tg);
        },
        leaveRoom: function (roomId) {
            var that = this;
            var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
            tg.setTimestamp(getNow());
            tg.setGroupid(roomId);
            tg.setActor(info.userId);
            tg.setMsgid(info.userId + getNow(1));
            tg.setAction(3);
            var users = [info.userId];
            tg.setUsers(users);
            that.chatSocket.send('SnailChat.TokenGroup', tg);
        },
        kickEmps: function (roomId, emps, reason) {
            var that = this;
            var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
            tg.setTimestamp(getNow());
            tg.setGroupid(roomId);
            tg.setActor(info.userId);
            tg.setMsgid(info.userId + getNow(1));
            tg.setAction(3);
            var _emps = [];
            for (var i = 0; i < emps.length; i++) {
                _emps.push(emps[i].SUserId);
            }
            tg.setUsers(_emps);
            that.chatSocket.send('SnailChat.TokenGroup', tg);
        },
        inviteEmps: function (roomId, emps) {
            var that = this;
            var _emps = [];
            for (var i = 0; i < emps.length; i++) {
                _emps.push(emps[i].SUserId);
            }
            var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
            tg.setTimestamp(getNow());
            tg.setGroupid(roomId);
            tg.setActor(info.userId);
            tg.setMsgid(info.userId + getNow(1));
            tg.setAction(2);
            tg.setUsers(_emps);
            that.chatSocket.send('SnailChat.TokenGroup', tg);
        },
        changeRoomSubject: function (roomId, name) {
            var that = this;
            var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
            tg.setTimestamp(getNow());
            tg.setGroupid(roomId);
            tg.setGroupname(name)
            tg.setActor(info.userId);
            tg.setMsgid(info.userId + getNow(1));
            tg.setAction(4);
            that.chatSocket.send('SnailChat.TokenGroup', tg);
        },
        markRead: function (chatId, isGroup, lasMsgTime) {
            var that = this;
            var rmt = that.chatSocket.buildClass('SnailChat.ReportMsgTick');
            var messageId = info.userId + getNow();
            isGroup = isGroup === undefined ? false : isGroup;
            rmt.setMsgid(messageId);
            rmt.setTimestamp(lasMsgTime.toString());
            rmt.setUserkey(info.userId);
            rmt.setRecver(chatId);
            rmt.setIsGroup(isGroup);
            that.chatSocket.send('SnailChat.ReportMsgTick', rmt);
            // message.setTouser(chatId);
            // message.setStatus(isGroup ? 1 : 0);
            // message.setAction(3);
            // that.chatSocket.send('SnailChat.Message',message);
            // console.log('============================mark read===================================')
        },
        transRoom: function (roomId, newOwner) {
            var that = this;
            var tg = that.chatSocket.buildClass('SnailChat.TokenGroup');
            tg.setTimestamp(getNow());
            tg.setGroupid(roomId);
            tg.setActor(info.userId);
            tg.setMsgid(info.userId + getNow(1));
            tg.setAction(7);
            tg.setPassowner(newOwner);
            that.chatSocket.send('SnailChat.TokenGroup', tg);
        },
        checkEmpStatus: (function () {
            var timer, ids = [];
            return function (userId) {
                if (!userId) return;
                var that = this;
                if (timer) {
                    clearTimeout(timer);
                    timer = undefined;
                }
                ids.push(userId);
                timer = setTimeout(function () {
                    var user = that.chatSocket.buildClass('SnailChat.User');
                    // user.action = 7;
                    for (var i = 0; i < ids.length; i++) {
                        user.userstatus.push(ids[i]);
                    }
                    // console.log(Object.prototype.toString.call(user.userstatus))
                    // user.setTimestamp(getNow());
                    user.msgid = info.userId + getNow();
                    user.userkey = info.userId;
                    user.isrepeat = 1;
                    user.source = domain.source;
                    user.username = info.userId;
                    user.status = 7;
                    user.serveraddr = '1.1.1.1:9876';
                    that.chatSocket.send('SnailChat.User', user);
                    ids.length = 0;
                }, 500);
            }
        })(),
        checkMessageSize: function (msg) {
            var that = this;
            var message = that.frontMsgToSocketMsg(msg);
            var socket = that.chatSocket;
            var _class = that.chatSocket.getClass('SnailChat.Message');
            var msgBuffer = message.toArrayBuffer();
            var msgUintBuffer = new Uint8Array(msgBuffer);
            if (msgUintBuffer.byteLength > 100 * 1024) {
                return false;
            }
            return true;
        },
        getShutUpUsers: function (roomId) {
            var that = this;
            var gsu = that.chatSocket.buildClass('SnailChat.GroupShutupUsers');
            gsu.setUserkey(info.userId);
            gsu.setTimestamp(getNow());
            gsu.setGroupid(roomId);
            gsu.setMsgid(info.userId + getNow(1));
            that.chatSocket.send('SnailChat.GroupShutupUsers', gsu);
        },
        checkShutUpStatus: function (groupId, userId) {
            if (shutUpData[groupId] && shutUpData[groupId][userId]) {
                var now = util.getTime(0);
                if (shutUpData[groupId][userId].localShutUpEndTime > now) {
                    return true;
                } else {
                    delete shutUpData[groupId][userId];
                }
            }
            return false;
        },
        markReady: function () {
            // console.log('----------------------main  ready----------------------')
            mainControllerIsReady = true;
            var msg;
            while (beforeReadyMsgList.length) {
                msg = beforeReadyMsgList.pop();
                $rootScope.$broadcast('receiveMsg', [msg]);
                $rootScope.$broadcast('empStatusChange', [msg.fromuser], 'online', [msg.source]);
            }
        }
    }
    return socketConnect;
}])
services.factory('empStatusService', ['$rootScope', 'util', 'webConfig', function ($rootScope, util, webConfig) {
    var empStatus = {};
    var empStatusUpdateTime = {};
    window.empStatus = empStatus;
    window.empStatusUpdateTime = empStatusUpdateTime;
    $rootScope.$on('empStatusChange', function (e, userIds, status, resource) {
        for (var i = 0; i < userIds.length; i++) {
            var userId = userIds[i];
            if (empStatus[userId] === undefined) {
                empStatus[userId] = {};
            }
            empStatusUpdateTime[userId] = util.getNow();
            for (var j = 0; j < resource.length; j++) {
                empStatus[userId][resource[j]] = status;

            }
        }
    });
    return {
        setEmpStatus: function (userId, source, state) {
            if (!empStatus[userId]) {
                empStatus[userId] = {};
            }
            if (Object.prototype.toString.call(source) == '[object Array]') {
                for (var i = 0; i < source.length; i++) {
                    empStatus[userId][source[i]] = state;
                }
            } else {
                empStatus[userId][source] = state;
            }
        },
        getEmpStatus: function (userId) {
            var loginEmp = webConfig.getUser();
            var status = empStatus[userId];
            if (userId == loginEmp.SUserId) {
                return 'online';
            }
            if (status) {
                var state = 'offline';
                for (var p in status) {
                    if (status[p] == 'online') {
                        state = 'online';
                    }
                }
                return state;
            }
        },
        getEmpStatusUpdateTime: function (userId) {
            var t = empStatusUpdateTime[userId] || 0;
            return t;
        }
    }
}]);
services.factory('empService', ['$rootScope', 'servers', 'domain', 'util', '$state', '$http', '$q', 'ajaxService', 'webConfig', 'langPack', 'empStatusService', function (rootScope, servers, domain, util, $state, $http, $q, ajax, webConfig, langPack, empStatusService) {
    var cache = {}, commConcats;
    var empCache = {}, deptCache = {}, deptTree = [];
    var serviceCache = {};
    var requestUrl = {
        getUserOrg: '/orgs/getUserOrg.wn',
        getEmps: '/WebChat/getEmps.wn',
        getDepts: '/WebChat/getDepts.wn',
        getBlockedChat: '/WebChat/getPerFwdnd.wn'
    }
    var blocked = {};
    var loginEmp;
    var ls = window.localStorage;
    var expiresTime = 7 * 24 * 60 * 60 * 1000;

    var empStatusUpdateTime = {};
    var deptTreeMap = {};
    var userDetailInfoMap = {};

    var loginTime = util.getNow();
    var ents = [];
    var entMap = {};
    window.entMap = entMap;
    var groupAdmin = {};
    var empService = {
        // getEmpStatus : function(account){
        // console.log('%s',account,empStatus[account]);
        // return empStatus[account] || {};
        // },
        setGroupAdmin: function (groupId, admin) {
            groupAdmin[groupId] = admin;
        },
        getGroupAdmin: function (groupId) {
            return groupAdmin[groupId];
        },
        getEntInfo: function (entId) {
            var req = ajax.post('/orgs/getEntDesc.wn', {
                entIds: entId
            })
            return req;
        },
        loginSSO: function (mobile, password) {
            var that = this;
            password = util.utf8ToBase64(password);
            var params = {
                mobileNo: mobile,
                password: password
            }
            return $.ajax({
                type: 'post',
                url: webConfig.REQUEST_PIX + '/web/login.wn',
                dataType: 'json',
                contentType: 'application/json',
                data: angular.toJson(params)
            })
        },
        getUserOrgs: function (mobile) {
            var that = this;
            return ajax.post('/orgs/getUserOrg.wn', {
                mobileNo: mobile
            }).then(function (res) {
                var data = res.data;
                ents.length = 0;
                for (var i = 0; i < data.userEnts.length; i++) {
                    ents[i] = data.userEnts[i];
                }
                that.getCompanys();
            })
        },
        getUser: function (userId) {
            return {};
        },
        queryUserData: function (phone) {
            return ajax.postJson('/users/searchUser.wn', {
                mobileNo: phone
            })
        },
        getLoginUserEnts: function () {
            return ents;
        },
        getCompanys: function () {
            var that = this;
            var list = [];
            var localData = angular.fromJson(util.getLs('ents')) || {};
            var _temp = {};
            for (var i = 0; i < ents.length; i++) {
                var _id = ents[i].SEntId;
                _temp[_id] = 1;
                var _emps = localData[_id] ? (localData[_id].emps) || [] : [];
                for (var j = 0; j < _emps.length; j++) {
                    empCache[_emps[j].SUserId] = _emps[j];
                }
                var _services = localData[_id] ? (localData[_id].services) || [] : [];
                for (var j = 0; j < _services.length; j++) {
                    _services[j].isService = true;
                    _services[j].entId = _id;
                    serviceCache[_services[j].SUserId] = _services[j];
                }
                var _depts = localData[_id] ? (localData[_id].depts) || [] : [];
                for (var j = 0; j < _depts.length; j++) {
                    deptCache[_depts[j].SDeptId] = _depts[j];
                }
            }
            for (var p in localData) {
                if (!_temp[p]) {
                    delete localData[p];
                }
                if (!localData[p]) {
                    continue;
                }
                entMap[p] = {
                    deptsMap: {},
                    empsMap: {},
                    empsUserIdMap: {}
                };
                for (var i = 0; i < localData[p].depts.length; i++) {
                    entMap[p].deptsMap[localData[p].depts[i].SDeptId] = localData[p].depts[i];
                }
                for (var i = 0; i < localData[p].emps.length; i++) {
                    var empId = localData[p].emps[i].SEmpId;
                    var userId = localData[p].emps[i].SUserId;
                    if (!entMap[p].empsMap[empId]) {
                        entMap[p].empsMap[empId] = [];
                    }
                    entMap[p].empsMap[empId].push(localData[p].emps[i]);
                    entMap[p].empsUserIdMap[userId] = localData[p].emps[i];
                }
            }
            // that.safeSave(localData);
            for (var i = 0; i < ents.length; i++) {
                if (ents[i].SStatus.toLowerCase() == 'n') continue;
                var _id = ents[i].SEntId;
                var lastUpdateTime = localData[_id] ? localData[_id].lastUpdateTime : '';
                list.push(that.queryCompanyData(_id, lastUpdateTime));
            }
            $q.all(list).then(function () {
                that.createEntMap();
                rootScope.$broadcast('getCompanyDataSuccess');
            })
        },
        isColleague: function (userId, entId) {
            if (entId) {
                if (entMap[entId] && entMap[entId].empsUserIdMap && entMap[entId].empsUserIdMap[userId]) return true;
            } else {
                for (var p in entMap) {
                    if (entMap[p].empsUserIdMap[userId]) return true;
                }
            }
            return false;
        },
        createEntMap: function () {
            var that = this;
            var list = [];
            var localData = angular.fromJson(util.getLs('ents')) || {};
            var _temp = {};
            for (var i = 0; i < ents.length; i++) {
                var _id = ents[i].SEntId;
                _temp[_id] = 1;
                var _emps = localData[_id] ? (localData[_id].emps) || [] : [];
                for (var j = 0; j < _emps.length; j++) {
                    empCache[_emps[j].SUserId] = _emps[j];
                }
                var _services = localData[_id] ? (localData[_id].services) || [] : [];
                for (var j = 0; j < _services.length; j++) {
                    _services[j].isService = true;
                    _services[j].entId = _id;
                    serviceCache[_services[j].SUserId] = _services[j];
                }
                var _depts = localData[_id] ? (localData[_id].depts) || [] : [];
                for (var j = 0; j < _depts.length; j++) {
                    deptCache[_depts[j].SDeptId] = _depts[j];
                }
            }
            for (var p in localData) {
                if (!_temp[p]) {
                    delete localData[p];
                }
                if (!localData[p]) {
                    continue;
                }
                entMap[p] = {
                    deptsMap: {},
                    empsMap: {},
                    empsUserIdMap: {}
                };
                for (var i = 0; i < localData[p].depts.length; i++) {
                    entMap[p].deptsMap[localData[p].depts[i].SDeptId] = localData[p].depts[i];
                }
                for (var i = 0; i < localData[p].emps.length; i++) {
                    var empId = localData[p].emps[i].SEmpId;
                    var userId = localData[p].emps[i].SUserId;
                    if (!entMap[p].empsMap[empId]) {
                        entMap[p].empsMap[empId] = [];
                    }
                    empCache[userId] = localData[p].emps[i];
                    entMap[p].empsMap[empId].push(localData[p].emps[i]);
                    entMap[p].empsUserIdMap[userId] = localData[p].emps[i];
                }
            }
            // that.safeSave(localData);
        },
        getEmpName: function (emp, quotes) {
            var name = emp.SShowName || emp.SEmpName || emp.SName;
            return quotes ? ('"' + name + '"') : name
        },
        mergeEntsData: (function () {
            var mergeing = false, queue = [], localData;
            return function (id, depts, emps, services) {
                var that = this;
                if (mergeing == true) {
                    queue.push({
                        id: id,
                        depts: depts,
                        emps: emps
                    });
                    return;
                }
                mergeing = true;
                if (localData === undefined) {
                    localData = angular.fromJson(util.getLs('ents')) || {};
                    localData[id] = localData[id] || {};
                }
                var localEmps = localData[id].emps || [], localDepts = localData[id].depts || [];
                var localServices = localData[id].services || [];
                var delEmps = {}, delDepts = {}, delSerives = {};
                // 过滤离职人员
                for (var i = 0; i < emps.length; i++) {
                    if (emps[i].SStatus.toLowerCase() == 'n') {
                        delEmps[emps[i].SEmpId + '_' + emps[i].SDeptId] = emps[i];
                    }
                }
                for (var i = localEmps.length - 1; i >= 0; i--) {
                    var empId = localEmps[i].SEmpId;
                    var deptId = localEmps[i].SDeptId;
                    if (delEmps[empId + '_' + deptId]) {
                        localEmps.splice(i, 1);
                    }
                }
                var temp = {};
                for (var i = 0; i < localEmps.length; i++) {
                    temp[localEmps[i].SEmpId + '_' + localEmps[i].SDeptId] = localEmps[i];
                }
                // 过滤停用服务号
                for (var i = 0; i < services.length; i++) {
                    if (services[i].SStatus.toLowerCase() == 'n') {
                        delSerives[services[i].SUserId] = services[i];
                    }
                }
                for (var i = localServices.length - 1; i >= 0; i--) {
                    var userId = localServices[i].userId;
                    if (delSerives[userId]) {
                        localServices.splice(i, 1);
                    }
                }
                var tempService = {};
                for (var i = 0; i < localServices.length; i++) {
                    tempService[localServices[i].SUserId] = localServices[i];
                }
                // 增加新入职人员；如不是新入职，则修改数据
                for (var j = 0; j < emps.length; j++) {
                    var empId = emps[j].SEmpId;
                    var deptId = emps[j].SDeptId;
                    if (delEmps[empId + '_' + deptId]) continue;
                    if (temp[empId + '_' + deptId]) {
                        for (var p in emps[j]) {
                            temp[empId + '_' + deptId][p] = emps[j][p];
                        }
                    } else {
                        localEmps.push(emps[j]);
                        // console.log('new emp add ' + emps[j])
                    }
                }
                // 增加新建服务号；如不是新建，则修改数据
                for (var j = 0; j < services.length; j++) {
                    var userId = services[j].SUserId;
                    if (delSerives[userId]) continue;
                    if (tempService[userId]) {
                        for (var p in services[j]) {
                            tempService[userId][p] = services[j][p];
                        }
                    } else {
                        localServices.push(services[j]);
                    }
                }
                // 过滤已注销部门
                for (var i = 0; i < depts.length; i++) {
                    if (depts[i].SStatus.toLowerCase() == 'n') {
                        delDepts[depts[i].SUserId] = depts[i];
                    }
                }
                for (var i = localDepts.length - 1; i >= 0; i--) {
                    var deptId = localDepts[i].SDeptId;
                    if (delDepts[deptId]) {
                        localDepts.splice(i, 1);
                    }
                }
                var tempDept = {};
                for (var i = 0; i < localDepts.length; i++) {
                    tempDept[localDepts[i].SDeptId] = localDepts[i];
                }
                // 增加新添加部门；如不是新添加，则修改数据
                for (var j = 0; j < depts.length; j++) {
                    var deptId = depts[j].SDeptId;
                    if (delDepts[deptId]) continue;
                    if (tempDept[deptId]) {
                        for (var p in depts[j]) {
                            tempDept[deptId][p] = depts[j][p];
                        }
                    } else {
                        localDepts.push(depts[j]);
                    }
                }
                localData[id].emps = localEmps;
                localData[id].depts = localDepts;
                localData[id].services = localServices;
                for (var i = 0; i < localEmps.length; i++) {
                    empCache[localEmps[i].SEmpId] = localEmps[i];
                }
                for (var i = 0; i < localDepts.length; i++) {
                    deptCache[localDepts[i].SDeptId] = localDepts[i];
                }
                mergeing = false;
                rootScope.$broadcast('entDataReady', id);
                if (queue.length) {
                    var _temp = queue.shift();
                    that.mergeEntsData(_temp.id, _temp.depts, _temp.emps, _temp.services);
                } else {
                    // 存入localStorage
                    that.safeSave(localData);
                    localData = undefined;
                }
            }
        })(),
        getDeptStruct: function (dept) {
            var deptId = dept.SDeptId;
            var structs = [];
            structs.push(dept.SDeptName);
            var parent = dept.SParentId;
            while (parent && deptCache[parent]) {
                structs.push(deptCache[parent].SDeptName);
                parent = deptCache[parent].SParentId;
            }
            return structs.reverse().join('\\');
        },
        safeSave: function (obj) {
            var entMap = {};
            for (var i = 0; i < ents.length; i++) {
                entMap[ents[i].SEntId] = ents[i];
            }
            var arr = [];
            for (var p in obj) {
                if (entMap[p]) {
                    arr.push(obj[p]);
                    obj[p].lastUpdateTime = loginTime;
                    obj[p].name = entMap[p].SEntName;
                }
            }
            arr.sort(function (v1, v2) {
                return v1.emps.length > v2.emps.length ? 1 : -1;
            });
            var res = util.setLs('ents', obj);
            if (!res) {
                arr.pop();
                var _obj = {};
                for (var i = 0; i < arr.length; i++) {
                    _obj[arr[i].id] = arr[i];
                }
                this.safeSave(_obj);
            } else {
                // this.createEntMap();
                // console.log(obj);
            }
        },
        queryCompanyInfo: function (id) {
            ajax.post('/orgs/getEntDesc.wn', {
                entId: id
            })
        },
        queryCompanyData: function (id, startDate) {
            var that = this;
            var params = {};
            params.entId = id;
            // startDate = 1492790400000;
            if (startDate) {
                params.startDate = startDate;
            }
            return $q.all([
                ajax.post('/WebChat/getDepts.wn', params),
                ajax.post('/WebChat/getEmps.wn', params)
            ]).then(function (res) {
                var res1 = res[0].data;
                var res2 = res[1].data;
                if (res1.code == 0 && res2.code == 0) {
                    if (res1.Data.length || res2.Data.length) {
                        that.mergeEntsData(id, res1.Data, res2.Data, res2.ServiceData);
                    }

                }
                return res;
            })
        },
        // init : function(account){
        // var lastTime = ls.getItem('lastUpdateTime');
        // var params = {
        // entId : 'ff808081581b3e2801581b47dd4e0000'
        // };
        // if(lastTime){
        // lastTime = new Date(parseInt(lastTime));
        // params.startDate = lastTime.format('YYYY-MM-DD hh:mm:ss');
        // }
        // var req = $q.defer();
        // var hasError = false;
        // var depts = ajax.post(requestUrl.getDepts,params,function(data){
        // if(data.code == 0){
        // var finalData = mergerDepts(data.Data || []);
        // try{
        // ls.setItem('depts' , angular.toJson(finalData));
        // }catch(e){
        // hasError = true;
        // ls.removeItem('depts');
        // ls.removeItem('emps');
        // ls.removeItem('lastUpdateTime');
        // rootScope.$broadcast('reconnect');
        // }
        // }
        // });
        // function mergerDepts(newData){
        // var localDetps = ls.getItem('depts') || '[]';
        // localDetps = angular.fromJson(localDetps || []) || [];
        // for(var i=0;i<localDetps.length;i++){
        // deptCache[localDetps[i].SDeptId] = localDetps[i];
        // }
        // for(var i=0;i<newData.length;i++){
        // deptCache[newData[i].SDeptId] = newData[i];
        // }
        // var finalData = [];
        // for(var p in deptCache){
        // if(deptCache.hasOwnProperty(p)){
        // if(deptCache[p].SStatus == 'Y' || deptCache[p].SStatus === undefined){
        // deptCache[p].IsEmp = false;
        // finalData.push(deptCache[p]);
        // }else if(deptCache[p].SStatus == 'N'){
        // delete deptCache[p];
        // }
        // }
        // }
        // return finalData;
        // }
        // function mergerEmps(newData){
        // var localEmps = ls.getItem('emps') || '[]';
        // localEmps = angular.fromJson(localEmps) || [];
        // var finalData = [];
        // var _empCache = {};
        // for(var i=0;i<localEmps.length;i++){
        // _empCache[localEmps[i].SEmpId] = localEmps[i];
        // }
        // for(var i=0;i<newData.length;i++){
        // _empCache[newData[i].SEmpId] = newData[i];
        // }
        // for(var p in _empCache){
        // if(_empCache.hasOwnProperty(p)){
        // if(_empCache[p].SStatus == 'y' || _empCache[p].SStatus == 'Y' || _empCache[p].SStatus === undefined){
        // finalData.push(_empCache[p]);
        // empCache[_empCache[p].SEmpId] = _empCache[p];
        // empCache[_empCache[p].SUserId] = _empCache[p];
        // }else if(_empCache[p].SStatus == 'n' || _empCache[p].SStatus == 'N'){
        // delete empCache[_empCache[p].SEmpId];
        // delete empCache[_empCache[p].SUserId];
        // delete _empCache[p];
        // }
        // }
        // }
        // for(var i=0;i<finalData.length;i++){
        // finalData[i].IsEmp = true;
        // _empCache[finalData[i].SUserId] = finalData[i];
        // }
        // return finalData;
        // }
        // depts.then(function(){
        // if(hasError){
        // return;
        // }
        // ajax.post(requestUrl.getEmps,params,function(data){
        // if(data.code == 0){
        // var finalData = mergerEmps(data.Data);
        // try{
        // ls.setItem('emps' , angular.toJson(finalData));
        // ls.setItem('lastUpdateTime',(new Date()).getTime());
        // req.resolve();
        // }catch(e){
        // ls.removeItem('emps');
        // rootScope.$broadcast('reconnect');
        // }
        // }
        // });
        // })
        // return req.promise;
        // },
        initLoginEmp: function (user) {
            loginEmp = user;
        },
        getBlockedChat: function (account) {
            // var emp = empCache[account];
            // var perId = emp.SPerId;
            // var blockChats = ajax.post(requestUrl.getBlockedChat,{
            // perId : perId
            // },function(data){
            // var list = data.Data || [];
            // for(var i=0;i<list.length;i++){
            // if(list[i].isFwdnd){
            // var id = list[i].groupId;
            // id = Strophe.getNodeFromJid(id);
            // blocked[id] = 1;
            // }
            // }
            // });
            // return blockChats;
        },
        setBlockedChat: function (chatId) {
            blocked[chatId] = 1;
        },
        isBlocked: function (chatId) {
            return blocked[chatId];
        },
        cancelBlocked: function (chatId) {
            blocked[chatId] = undefined;
        },
        clearLocalStorage: function () {
            var ls = window.localStorage;
            ls.removeItem('depts');
            ls.removeItem('emps');
            ls.removeItem('ents');
            ls.removeItem('lastUpdateTime');
        },
        getEmpInfo: (function () {
            var callbacks = {};
            var emptyEmp = {};
            var getQueue = [];
            var requesting = [];
            var requestSended = {};
            window.getQueue = getQueue;
            window.requesting = requesting;
            return function (val, key, callback, _res) {
                var isService = util.isService(val);
                var obj = isService ? serviceCache : empCache;
                var res = _res || obj[val] || {};
                if (emptyEmp[val]) {
                    res.responsed = true;
                    res.SUserId = val;
                    res.SShowName = langPack.getKey('stranger');
                    res.SName = langPack.getKey('stranger');
                    return res;
                }
                res.IsEmp = isService ? false : true;
                key = key || 'SUserId';
                if (!callbacks[val]) {
                    callbacks[val] = [];
                }
                callback && callbacks[val].push(callback);
                if (key == 'SUserId') {
                    if (!obj[val]) {
                        res.responsed = false;
                        res.SUserId = val;
                        res.SShowName = langPack.getKey('stranger');
                        res.SName = langPack.getKey('stranger');
                        obj[val] = res;
                    }
                    if (obj[val].responsed === false) {
                        if (requesting.length < 3) {
                            requesting.push({
                                userId: val
                            })
                            obj[val] = res;
                        } else {
                            if (!_res) {
                                getQueue.push({
                                    userId: val,
                                    res: obj[val],
                                    args: [val, key, callback, obj[val]]
                                })
                                return obj[val] || res;
                            }
                        }
                        if (requestSended[val]) {
                            return obj[val];
                        }
                        requestSended[val] = 1;
                        this.getLastestEmpInfo(val).then(function (d) {
                            obj[val].responsed = true;
                            for (var i = requesting.length - 1; i >= 0; i--) {
                                if (requesting[i].userId == val) {
                                    requesting.splice(i, 1);
                                }
                            }
                            if (getQueue.length) {
                                var _obj = getQueue.shift();
                                empService.getEmpInfo.apply(empService, _obj.args);
                            }
                            var emp = d.data.userInfo;

                            if (!emp) {
                                delete obj[val];
                                callbacks[val].length = 0;
                                emptyEmp[val] = 1;
                                rootScope.$broadcast('unkownEmp', val);
                                return;
                            }
                            emp.IsEmp = isService ? false : true;
                            emp.SUserId = val;
                            for (var p in emp) {
                                obj[val][p] = emp[p];
                            }
                            while (callbacks[val].length) {
                                callbacks[val].shift()(emp);
                            }
                            rootScope.$broadcast('getLastestEmpInfo', emp);
                            // callback && callback(emp);
                        });
                        return obj[val];
                    } else {
                        if (getQueue.length) {
                            var _obj = getQueue.shift();
                            empService.getEmpInfo.apply(empService, _obj.args);
                        }
                        if (obj[val].responsed === false) {
                            callback && callbacks[val].push(callback);
                        } else {
                            // callback && callback(res);
                            setTimeout(function () {
                                while (callbacks[val].length) {
                                    callbacks[val].shift()(obj[val]);
                                }
                            }, 10);
                        }
                        return obj[val];
                    }
                }
                // for(var p in empCache){
                // if(empCache.hasOwnProperty(p)){
                // if(empCache[p][key] == val){
                // return angular.copy(empCache[p]);
                // }
                // }
                // }
                // var blank = angular.copy(loginEmp);
                // for(var p in blank){
                // blank[p] = '';
                // }
                // blank[key] = val;
                // blank.IsEmp = true;
                return obj[val];
            }
        })(),
        getEmpInfoFromEnt: function (entId, empId) {
            var ent = entMap[entId];
            if (!ent) {
                var user = webConfig.getUser();
                this.getOrganizeTree(user.SUserId);
                ent = entMap[entId];
            }
            var emp = [];
            if (ent) {
                emp = ent.empsMap[empId] || [];
            }
            return emp;
        },
        getEmpInfoByAccount: function (account) {
            var req = $q.defer();
            req.resolve(empCache[account]);
            return req.promise;
        },
        getOrganizeTree: function (currentUser, deptId) {
            deptTree.length = 0;
            var ents = ls.getItem('ents');
            ents = angular.fromJson(ents) || {};
            for (var p in ents) {
                var depts = ents[p].depts;
                var emps = ents[p].emps;
                var deptsMapTemp = {};
                for (var i = 0; i < depts.length; i++) {
                    var _deptId = depts[i].SDeptId.toLowerCase();
                    var parentId = depts[i].SParentId.toLowerCase();
                    deptsMapTemp[_deptId] = depts[i];
                    depts[i].SDeptId = _deptId;
                    depts[i].SParentId = parentId;
                    depts[i].ChildDepts = [];
                    depts[i].ChildEmps = [];
                    depts[i].showChild = false;
                    depts[i].level = 0;
                    depts[i].IsEmp = false;
                    depts[i].IsDept = true;
                    depts[i].entId = p;
                }
                var empsMapTemp = {};
                for (var i = 0; i < emps.length; i++) {
                    emps[i].IsEmp = true;
                    emps[i].SDeptId = emps[i].SDeptId.toLowerCase();
                    var idx = emps[i].SDeptId + '_' + emps[i].SEmpId;
                    empsMapTemp[idx] = emps[i];
                    emps[i].entId = p;
                }
                for (var i = 0; i < emps.length; i++) {
                    var parentId = emps[i].SDeptId;
                    if (parentId && parentId != '0') {
                        if (deptsMapTemp[parentId]) {
                            deptsMapTemp[parentId].ChildEmps.push(emps[i]);
                        };
                    }
                    if (currentUser == emps[i].SUserId) {
                        var mineDept = deptId ? deptsMapTemp[deptId] : deptsMapTemp[emps[i].SDeptId];
                        while (mineDept) {
                            mineDept.showChild = true;
                            mineDept = deptsMapTemp[mineDept.SParentId];
                        }
                    }
                }
                for (var _p in deptsMapTemp) {
                    var parentId = deptsMapTemp[_p].SParentId;
                    if (parentId && parentId != '0') {
                        if (deptsMapTemp[parentId]) {
                            deptsMapTemp[parentId].ChildDepts.push(deptsMapTemp[_p]);
                        }
                    } else {
                        deptTree.push(deptsMapTemp[_p]);
                        deptTreeMap[p] = depts;
                    }
                }

                for (var i = 0; i < depts.length; i++) {
                    if (depts[i].SParentId != '0') {
                        var parent = deptsMapTemp[depts[i].SParentId];
                        if (parent) {
                            var level = 1;
                            while (parent && parent.SParentId != '0') {
                                level++;
                                parent = deptsMapTemp[parent.SParentId];
                            }
                            depts[i].level = level;
                        }
                    } else {
                        depts[i].level = 0;
                        depts[i].showChild = true;
                    }
                }
                for (var _p in deptsMapTemp) {
                    deptsMapTemp[_p].ChildDepts.sort(function (v1, v2) {
                        if (v1.NOrder == v2.NOrder) {
                            return v1.SDeptName > v2.SDeptName ? 1 : -1;
                        } else {
                            return v1.NOrder > v2.NOrder ? 1 : -1;
                        }
                    })
                    deptsMapTemp[_p].ChildEmps.sort(function (v1, v2) {
                        if (v1.NOrder == v2.NOrder) {
                            return v1.SEmpName > v2.SEmpName ? 1 : -1;
                        } else {
                            return v1.NOrder > v2.NOrder ? 1 : -1;
                        }
                    })
                }
            }
            return deptTree;
        },
        getAllEmps: function () {
            var localEmps = ls.getItem('emps');
            localEmps = angular.fromJson(localEmps) || [];
            return localEmps;
        },
        getRecentEmps: function (onlyEmp) {
            var recent = [];
            var loginUser = webConfig.getUser();
            var current = loginUser.SUserId;
            var allData = ls.getItem('recent');
            allData = angular.fromJson(allData) || {};
            var localData = allData[current] || [];
            var map = {};

            for (var i = 0; i < localData.length; i++) {
                if (map[localData[i]]) continue;
                // if(localData[i] == 'service_chat_converge'){
                // recent.push(localData[i]);
                // continue;
                // }
                var isService = util.isService(localData[i]);
                var dataCache = isService ? serviceCache : empCache;
                map[localData[i]] = 1;
                if (onlyEmp) {
                    if (!dataCache[localData[i]] || util.isGroup(localData[i]) || util.isBroad(localData[i])) continue;
                    dataCache[localData[i]].IsEmp = true;
                    recent.push(dataCache[localData[i]]);
                } else {
                    recent.push(dataCache[localData[i]] ? dataCache[localData[i]] : localData[i]);
                }
            }
            return recent;
        },
        getRecentServices: function () {
            return [];
            var recent = [];
            var loginEmp = webConfig.getUser();
            var current = loginEmp.SUserId;
            var allData = ls.getItem('service');
            allData = angular.fromJson(allData) || {};
            var localData = allData[current] || [];
            for (var i = 0; i < localData.length; i++) {
                recent.push(serviceCache[localData[i]] ? serviceCache[localData[i]] : localData[i]);
            }
            return recent;
        },
        saveRecentEmp: function (key, isService, serviceid) {
            // var localKey = isService ? 'service' : 'recent';
            var localKey = 'recent';
            var allData = ls.getItem(localKey);
            allData = angular.fromJson(allData) || {};
            var loginEmp = webConfig.getUser();
            var current = loginEmp.SUserId;
            var localData = allData[current] || [];
            var len = localData.length, temp;
            for (var i = len - 1; i >= 0; i--) {
                temp = localData[i];
                if (typeof key == 'string') {
                    if (key == temp) localData.splice(i, 1);
                }
                if (Object.prototype.toString.call(key) === '[object Object]') {
                    if (temp == key.SUserId || temp == key.SUserId) {
                        localData.splice(i, 1);
                    }
                }
            }
            if (typeof key == 'string') {
                localData.unshift(key);
            }
            if (Object.prototype.toString.call(key) === '[object Object]') {
                key.SUserId && localData.unshift(key.SUserId);
            }
            allData[current] = localData;
            ls.setItem(localKey, angular.toJson(allData));
            if (isService) {
                // empService.saveRecentEmp('service_chat_converge',false);
            }
        },
        clearRecent: function () {
            var version = webConfig.version;
            var isVersion = ls.getItem('version') ? parseFloat(ls.getItem('version')) : 0;
            if (isVersion < version) {
                ls.removeItem('recent');
            }
            empService.saveVersion();
        },
        getLoginEmp: function () {
            return loginEmp;
        },
        searchEmp: function (keyword) {
            var localEmps = [];
            for (var p in empCache) {
                localEmps.push(empCache[p]);
            }
            var result = [], temp = [];
            var isZhcn = /^[a-z]/;
            var pushed = {};
            var pyKey = util.getPinyin(keyword);
            keyword = keyword.toLowerCase();
            if (!isZhcn.test(keyword)) {
                var idx;
                for (var i = 0; i < localEmps.length; i++) {
                    localEmps[i].IsEmp = true;
                    var name = localEmps[i].SName || localEmps[i].SShowName || '';
                    idx = name.indexOf(keyword);
                    if (idx != -1 && !pushed[localEmps[i].SUserId]) {
                        temp.push([idx, localEmps[i]]);
                        pushed[localEmps[i].SUserId] = 1;
                    }
                }
            } else {
                for (var i = 0; i < localEmps.length; i++) {
                    var namePinyin = util.getPinyin(localEmps[i].SName || localEmps[i].SShowName || ''), idx;
                    if (!pushed[localEmps[i].SUserId] && (namePinyin.indexOf(pyKey) != -1)) {
                        idx = namePinyin.indexOf(pyKey);
                        temp.push([idx, localEmps[i]]);
                        pushed[localEmps[i].SUserId] = 1;
                    }
                }
            }
            temp.sort(function (v1, v2) {
                return v1[0] < v2[0] ? -1 : 1;
            })
            for (var i = 0; i < temp.length; i++) {
                result.push(temp[i][1]);
            }
            return result;
        },
        isDeptMatch: function (dept, keyword) {
            var py = util.getPinyin(dept.SDeptName);
            keyword = util.getPinyin(keyword || '');
            var isZhcn = /^[a-z]/;
            var pyKey = util.getPinyin(keyword);
            if (!isZhcn.test(keyword)) {
                if (dept.SDeptName.indexOf(keyword) != -1) {
                    return true;
                }
            }
            if (py.indexOf(pyKey) != -1) {
                return true;
            }
            return false;
        },
        searchDepts: function (keyword) {
            keyword = keyword.toLowerCase();
            var localDetps = [];
            for (var p in deptCache) {
                localDetps.push(deptCache[p]);
            }
            var result = [], temp = [];
            var isZhcn = /^[a-z]/;
            var pushed = {};
            var pyKey = util.getPinyin(keyword), dept;
            if (!isZhcn.test(keyword)) {
                var idx;
                for (var i = 0; i < localDetps.length; i++) {
                    idx = localDetps[i].SDeptName.indexOf(keyword);
                    localDetps[i].IsEmp = false;
                    if (idx != -1) {
                        temp.push([idx, localDetps[i]]);
                        pushed[localDetps[i].SDeptId] = 1;
                    }
                }
            } else {
                for (var i = 0; i < localDetps.length; i++) {
                    localDetps[i].IsEmp = false;
                    var py = util.getPinyin(localDetps[i].SDeptName), idx;
                    if (!pushed[localDetps[i].SDeptId] && py.indexOf(pyKey) != -1) {
                        idx = py.indexOf(pyKey);
                        temp.push([idx, localDetps[i]]);
                    }
                }
            }
            temp.sort(function (v1, v2) {
                return v1[0] < v2[0] ? -1 : 1;
            })
            for (var i = 0; i < temp.length; i++) {
                result.push(temp[i][1]);
            }
            return result;
        },
        getDept: function (deptId) {
            return deptCache[deptId];
        },
        getEmpDept: function (userId) {
            var emp = empService.getEmpInfo(userId);
            return deptCache[emp.SDeptId];
        },
        getAllEmpsMail: (function () {
            return function (dept) {
                var temp = [];
                temp.concat(getEmails(dept, temp));
                //console.log(temp)
                return temp;
            };
            function getEmails(dept, temp) {
                if (!dept.IsEmp) {
                    for (var i = 0; i < dept.ChildDepts.length; i++) {
                        // for(var j=0;j<dept.ChildDepts[i].ChildEmps;j++){
                        // temp.push(dept.ChildDepts[i].ChildEmps[j].SMailAccount);
                        // }
                        getEmails(dept.ChildDepts[i], temp);
                    }
                    for (var k = 0; k < dept.ChildEmps.length; k++) {
                        temp.push(dept.ChildEmps[k].SMailAccount);
                    }
                    return temp;
                }
            }
        })(),
        getEmpNumberOfDept: (function () {
            var computed = {};
            window.computed = computed;
            return function (entId, deptId) {
                var that = this;
                if (computed[entId] && computed[entId][deptId]) {
                    return computed[entId][deptId].num;
                }
                if (!computed[entId]) {
                    computed[entId] = {};
                }
                if (!computed[entId][deptId]) {
                    computed[entId][deptId] = {};
                }
                var num = 0;
                var emps = that.getEmpsOfDept(entId, deptId);
                for (var p in emps) {
                    num++;
                }
                computed[entId][deptId].num = num;
                computed[entId][deptId].emps = emps;
                return computed[entId][deptId].num;
            }
        })(),
        getEmpsOfDept: (function () {
            var computed = {};
            return function (entId, deptId, emps) {
                if (computed[entId] && computed[entId][deptId]) {
                    return computed[entId][deptId];
                }
                var isTarget = emps === undefined ? true : false;
                if (!computed[entId]) {
                    computed[entId] = {};
                }
                emps = emps || {};
                var that = this;
                var depts = deptTreeMap[entId];
                var dept;
                for (var i = 0; i < depts.length; i++) {
                    if (depts[i].SDeptId == deptId) {
                        dept = depts[i];
                    }
                }
                if (dept) {
                    for (var i = 0; i < dept.ChildEmps.length; i++) {
                        var empId = dept.ChildEmps[i].SEmpId;
                        emps[empId] = dept.ChildEmps[i];
                    }
                    for (var i = 0; i < dept.ChildDepts.length; i++) {
                        var _emps = that.getEmpsOfDept(entId, dept.ChildDepts[i].SDeptId, {});
                        for (var p in _emps) {
                            emps[p] = _emps[p];
                        }
                    }
                }
                isTarget && (computed[entId][deptId] = emps);
                return emps;
            }
        })(),
        removeRecent: function (emp, roomId) {
            var recent = [];
            var allData = ls.getItem('recent');
            allData = angular.fromJson(allData) || {};
            var localData = allData[emp] || [];
            for (var i = 0; i < localData.length; i++) {
                if (roomId == localData[i]) {
                    localData.splice(i, 1);
                    break;
                }
            }
            var allDataStr = angular.toJson(allData);
            ls.setItem('recent', allDataStr);
            this.removeService(emp, roomId);
        },
        removeService: function (emp, roomId) {
            return;
            var recent = [];
            var allData = ls.getItem('service');
            allData = angular.fromJson(allData) || {};
            var localData = allData[emp] || [];
            for (var i = 0; i < localData.length; i++) {
                if (roomId == localData[i]) {
                    localData.splice(i, 1);
                    break;
                }
            }
            var allDataStr = angular.toJson(allData);
            ls.setItem('service', allDataStr);
        },
        saveVersion: function () {
            ls.setItem('version', webConfig.version);
        },
        getLastestEmpInfo: (function () {
            return function (userId) {
                if (!userId) return $q.defer().promise;
                var req = $q.defer();
                // if(userId && userDetailInfoMap[userId]){
                // req.resolve({
                // data : {
                // userInfo : userDetailInfoMap[userId]
                // }
                // });
                // return req.promise;
                // }
                var reg = /^group_.*?_[\d.]+$/;
                if (reg.test(userId)) {
                    return req.promise;
                }
                var that = this;
                req = ajax.post('/users/queryUserInfo.wn', {
                    userId: userId
                }, function (data) {
                    if (data.userInfo) {
                        var emps = [data.userInfo];
                        userDetailInfoMap[userId] = emps[0];
                        for (var i = 0; i < emps.length; i++) {
                            emps[i].IsEmp = true;
                            emps[i].SShowName = emps[i].SName;
                            if (empCache[emps[i].SUserId]) {
                                empCache[emps[i].SUserId].SAvatarMd5 = emps[i].SAvatarMd5;
                                empCache[emps[i].SUserId].SAvatar = emps[i].SAvatar;
                            } else {
                                empCache[emps[i].SUserId] = emps[i];
                            }
                        }
                        rootScope.$broadcast('getLastestEmpInfo', data.userInfo);
                    } else {

                    }
                    // that.updateEmpInfo(emps);
                });
                return req;
            }
        })(),
        updateEmpInfo: function (emps) {
            var localEmps = ls.getItem('emps');
            localEmps = angular.fromJson(localEmps) || [];
            for (var i = 0; i < emps.length; i++) {
                var isNew = true;
                for (var j = 0; j < localEmps.length; j++) {
                    if (localEmps[j].SEmpId == emps[i].SEmpId) {
                        localEmps[j] = emps[i];
                        isNew = false;
                    }
                }
                if (isNew) {
                    localEmps.push(emps[i]);
                }
            }
            localEmps = angular.toJson(localEmps);
            // ls.setItem('emps',localEmps);
        },
        getRememberedPhone: function () {
            return localStorage.getItem(webConfig.IM_ACCOUNT) || util.cookie.get(webConfig.IM_ACCOUNT);
        },
        getUserBaseInfo: function (entId, userId) {
            var ent = entMap[entId];
            var res = {};
            if (ent) {
                var user = ent.empsUserIdMap[userId];
                for (p in user) {
                    res[p] = user[p];
                }
            }
            return res;
        },
        getUserEntDepts: function (entId, userId) {
            var ent = entMap[entId];
            if (ent) {
                var user = ent.empsUserIdMap[userId];
                var res = [];
                if (user) {
                    var empId = user.SEmpId;
                    var emps = ent.empsMap[empId];
                    for (var i = 0; i < emps.length; i++) {
                        if (emps[i].SUserId == userId) {
                            res.push(emps[i].SStruct);
                        }
                    }
                }
            }
            return res;
        },
        setRememberedPhone: function (v) {
            return localStorage.setItem(webConfig.IM_ACCOUNT, v);
        },
        setEmpStatus: function (userId, source, state) {
            empStatusService.setEmpStatus(userId, source, state);
        },
        getEmpStatus: function (userId) {
            var t = empStatusService.getEmpStatusUpdateTime(userId);
            var now = util.getNow();
            if (now - t > 10 * 60 * 1000) return;
            return empStatusService.getEmpStatus(userId);
        }
    }
    window.getOrganizeTree = empService.getOrganizeTree;
    return empService;
}]);

services.factory('ajaxService', ['$http', '$q', 'util', 'webConfig', function ($http, $q, util, webConfig) {
    var ajax = {};

    // $http.defaults.headers.post = {
    // 'Content-type' : 'application/x-www-form-urlencoded; charset=utf-8'
    // }
    function transformRequest(data, getHeaders) {
        var headers = getHeaders();
        headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        var token = webConfig.getToken();
        if (token) {
            headers['token'] = token;
        }
        return (serializeData(data));
    }
    function transformRequestJson(data, getHeaders) {
        var headers = getHeaders();
        var token = webConfig.getToken();
        if (token) {
            headers['token'] = token;
        }
        // headers['Content-type'] = 'application/json';
        return (serializeData(data));
    }
    function serializeData(data) {
        // If this is not an object, defer to native stringification.
        if (!angular.isObject(data)) {
            return ((data == null) ? "" : data.toString());
        }
        var buffer = [];
        // Serialize each key in the object.
        for (var name in data) {
            if (!data.hasOwnProperty(name)) {
                continue;
            }
            var value = data[name];
            buffer.push(
                encodeURIComponent(name) +
                "=" +
                encodeURIComponent((value == null) ? "" : value)
            );
        }
        // Serialize the buffer and clean it up for transportation.
        var source = buffer
            .join("&")
            .replace(/%20/g, "+")
            ;
        return (source);
    }

    angular.forEach(['post', 'get', 'jsonp'], function (name, idx) {
        ajax[name] = function (url, params, success, error) {
            if (typeof params == 'function') {
                error = success;
                success = params;
                params = {};
            }
            var _url = url;
            if (name == 'jsonp') {
                _url = params ? url + '?' + util.urlify(params) + '&jsonCallBack=JSON_CALLBACK' : '?jsonCallBack=JSON_CALLBACK';
            }
            _url = webConfig.REQUEST_PIX + _url;
            return $http[name](_url, params, {
                transformRequest: transformRequest
            }).success(function () {
                success && success.apply(undefined, arguments);
            }).error(function () {
                error && error.apply(undefined, arguments);
            })
        }
    })
    angular.forEach(['post', 'get', 'jsonp'], function (name, idx) {
        ajax[name + 'Json'] = function (url, params, success, error) {
            if (typeof params == 'function') {
                error = success;
                success = params;
                params = {};
            }
            var _url = url;
            if (name == 'jsonp') {
                _url = params ? url + '?' + util.urlify(params) + '&jsonCallBack=JSON_CALLBACK' : '?jsonCallBack=JSON_CALLBACK';
            }
            _url = webConfig.REQUEST_PIX + _url;
            return $http[name](_url, angular.toJson(params), {
                transformRequest: transformRequestJson
            }).success(function () {
                success && success.apply(undefined, arguments);
            }).error(function () {
                error && error.apply(undefined, arguments);
            })
        }
    })
    return ajax;
}])

services.provider('pops', [function () {
    this.$get = ['$document', '$templateCache', '$compile', '$animate', '$rootScope', '$controller', '$timeout', 'langPack', function ($doc, $templateCache, $compile, $animate, $rootScope, $controller, $timeout, langPack) {
        var body = $doc.find('body');
        var ele = angular.element
        var def = {};
        var pops = {
            length: 0
        };
        var cache = {};
        var mask;
        var widget = {
            /**
                option  :{
                    template:,
                    templateUrl,
                    data : {},
                    className : '',
                    controller : [] | fn | string,
                    scope : scope | object 
                }
            */
            append: function (option) {
                var opt = angular.copy(def);
                angular.extend(opt, option);
                var scope = $rootScope.$new();
                if (opt.data) {
                    scope.data = opt.data;
                }
                if (opt.scope) {
                    angular.extend(scope, opt.scope);
                }
                var tpl = $templateCache.get(opt.templateUrl);
                var id = 'pops_' + new Date().getTime();
                var elem = ele(tpl);
                elem.attr('id', id);
                $compile(elem)(scope);
                elem.css('opacity', 0);
                $animate.enter(elem, body, undefined, function () {
                    if (option.auto) {
                        $timeout(function () {
                            elem.css('opacity', 1);
                            elem.css({
                                top: '50%',
                                left: '50%',
                                marginLeft: - elem.width() / 2,
                                marginTop: - elem.height() / 2
                            })
                        })
                    }
                });
                $timeout(function () { });
                if (opt.controller) {
                    $controller(opt.controller, { $scope: scope, $element: elem });
                }
                if (opt.className) {
                    elem.addClass(opt.className);
                }
                scope.closeThisPop = function (closeMask) {
                    widget.close(id, closeMask);
                }
                elem.bind('click', function (e) {
                    e.stopPropagation && (e.preventDefault(),
                        e.stopPropagation())
                })
                cache[id] = scope;
            },
            open: function (option) {
                pops.length += 1;
                var opt = angular.copy(def);
                angular.extend(opt, option);
                var scope = $rootScope.$new();
                if (opt.data) {
                    scope.data = opt.data;
                }
                if (opt.scope) {
                    angular.extend(scope, opt.scope);
                }
                var tpl = $templateCache.get(opt.templateUrl);
                var id = 'pops_' + pops.length;
                var elem = ele('<div class="im_pop" id="' + id + '"></div>');
                elem.html(tpl);
                scope.langPack = langPack;
                $compile(elem)(scope);
                elem.css({
                    left: -1000,
                    top: -1000
                });
                $animate.enter(elem, body, undefined, function () {
                    elem.css({
                        top: '50%',
                        left: '50%',
                        marginLeft: - elem.width() / 2,
                        marginTop: - elem.height() / 2
                    })
                });
                if (opt.controller) {
                    $controller(opt.controller, { $scope: scope, $element: elem });
                }
                if (opt.className) {
                    elem.addClass(opt.className);
                }
                $timeout(function () {
                    elem.css({
                        top: '50%',
                        left: '50%',
                        marginLeft: - elem.width() / 2,
                        marginTop: - elem.height() / 2
                    })
                })
                scope.closeThisPop = function (closeMask) {
                    widget.close(id, closeMask);
                }
                cache[id] = scope;
                if (!mask) {
                    mask = ele('<div class="im_mask"></div>');
                    body.append(mask);
                }
                if (opt.hideMask) {
                    mask.css('opacity', 0);
                }
                if (opt.maskClose) {
                    mask.click(function () {
                        widget.close(id);
                    })
                }
            },
            close: function (id, closeMask) {
                if (!cache[id]) return;
                pops.length -= 1;
                pops.length = Math.max(0, pops.length);
                if ((pops.length <= 0 || closeMask) && mask) {
                    mask.remove();
                    mask = undefined;
                }
                delete cache[id];
                var elem = ele(document.getElementById(id));
                if (elem) {
                    var scope = elem.scope();
                    // elem.remove();
                    $animate.leave(elem, function () {
                        $timeout(function () {
                            try {
                                scope && scope.$destroy();
                            } catch (e) { }
                        }, 200)
                    });
                }
            },
            closeAllPop: function () {
                for (var p in cache) {
                    this.close(p);
                }
            },
            openDialog: function (option) {
                pops.length += 1;
                var container = option.container;
                var opt = angular.copy(def);
                angular.extend(opt, option);
                var scope;
                if (option.scope) {
                    if (option.scope.$new) {
                        scope = option.scope.$new();
                    } else {
                        scope = $rootScope.$new();
                        angular.extend(scope, option.scope);
                    }
                } else {
                    scope = $rootScope.$new();
                }
                if (opt.data) {
                    scope.data = opt.data;
                }

                var tpl = $templateCache.get(opt.templateUrl);
                var id = 'dialog_' + pops.length;
                var elem = ele('<div class="im_dialog" id="' + id + '" ng-style="style"></div>');
                elem.html(tpl);
                $compile(elem)(scope);
                $animate.enter(elem, container);
                if (opt.controller) {
                    $controller(opt.controller, { $scope: scope, $element: elem });
                }
                if (!option.auto) {
                    scope.style.top = option.top || 'auto';
                    scope.style.left = option.left || 'auto';
                }

                if (opt.className) {
                    elem.addClass(opt.className);
                }
                scope.closeThisPop = function (closeMask) {
                    // elem.scope().$destroy();
                    widget.close(id, closeMask);
                }
                cache[id] = scope;
                elem.bind('click', function (e) {
                    e.stopPropagation && (e.preventDefault(),
                        e.stopPropagation())
                })
                scope.$dialogId = id;
                return id;
            }
        }
        return widget;
    }]
}])

services.factory('chatService', ['$rootScope', 'empService', 'util', 'webConfig', 'faces', 'userConfig', 'socketConnect', 'domain', 'langPack','getChatIdObj', function ($rootScope, empService, util, webConfig, faces, userConfig, socketConnect, domain, langPack, getChatIdObj) {
    var xmppMsgProps = {
        type: 1,
        content: 1,
        date: 1,
        messageid: 1,
        readedmsgid: 1,
        typeex: 1,
        url: 1,
        thumb: 1
    }
    var frontMsgProps = {
        readStatus: 1,
        uploadStatus: 1,
        sendStatus: 1,
        to: 1,
        sender: 1,
        showTime: 1,
        isPlaying: 1
    }
    var msgReplaceBody = {};
    msgReplaceBody[webConfig.MSG_FILE_TYPE] = langPack.getKey('file');
    msgReplaceBody[webConfig.MSG_PIC_TYPE] = langPack.getKey('img');
    msgReplaceBody[webConfig.MSG_VIDEO_TYPE] = langPack.getKey('video');
    msgReplaceBody[webConfig.MSG_VOICE_TYPE] = langPack.getKey('audio');

    var chatList = window.chatList = [];
    var msgList = window.msgList = {};
    var norChatList = [], serviceChatList = [];
    var atMsg = {}, deletedChat = {};
    var msgCache = {};
    // window.norChatList = norChatList;
    // window.serviceChatList = serviceChatList
    var groupCache = {};
    var converge = {
        id: 'service_chat_converge',
        isGroup: false,
        lastMsg: '',
        lastChatTime: 0,
        name: langPack.getKey('serviceNumber'),
        members: [],
        msgTemp: '',
        face: '',
        msg: converge,
        lastSender: '',
        unread: 0,
        isTop: 0,
        blockedUnRead: 0,
        unBlockedUnRead: 0,
    }
    $rootScope.$on('receiveRoomSubject', function (ev, groupId, subject) {
        // roomId,roomInfo['muc#roominfo_subject'],roomInfo
        groupCache[groupId] = groupCache[groupId] || {
            isGroup: true,
            groupId: groupId
        };
        groupCache[groupId].groupName = subject;
        groupInfoCallBack[groupId] && groupInfoCallBack[groupId](groupCache[groupId]);
    });
    $rootScope.$on('receiveRoomMembers', function (ev, groupId, emps) {
        groupCache[groupId] = groupCache[groupId] || {
            isGroup: true,
            groupId: groupId
        };
        groupCache[groupId].members = emps;
        var tempName = [];
        for (var i = 0; i < emps.length; i++) {
            emps[i].SEmpName && tempName.push(emps[i].SEmpName);
        }
        groupCache[groupId].tempName = tempName.join(',');
        groupInfoCallBack[groupId] && groupInfoCallBack[groupId](groupCache[groupId]);
    });
    $rootScope.$on('getLastestEmpInfo', function (ev, emp) {
        for (var i = 0; i < chatList.length; i++) {
            var lastSenderId = chatList[i].lastSenderId;
            if (chatList[i].lastSenderId == emp.SUserId) {
                chatList[i].lastSender = emp.SName;
            }
        }
    });
    $rootScope.$on('getLastestEmpInfo', function (ev, emp) {
        var _acc = emp.SUserId;
        // var isService = chatService.isNotifyChat(_acc);
        if (chatService.isExist(_acc)) {
            var chat = chatService.getChat(_acc);
            chat.face = emp.SAvatar;
            chat.name = empService.getEmpName(emp);
        }
        for (var i = 0; i < norChatList.length; i++) {
            var accounts = norChatList[i].members;
            var tempName = [];
            for (var k = 0; k < accounts.length; k++) {
                if (_acc == accounts[k].SUserId) {
                    accounts[k] = empService.getEmpInfo(accounts[k].SUserId);
                }
            }
            accounts.sort(function (v1, v2) {
                var name1 = v1.SShowName || v1.SName;
                var pinyin1 = util.getPinyin(name1);
                var name2 = v2.SShowName || v2.SName;
                var pinyin2 = util.getPinyin(name2);
                return pinyin1 > pinyin2;
            })
            for (var k = 0; k < accounts.length; k++) {
                tempName.push(accounts[k].SShowName || accounts[k].SName);
            }
            if (!norChatList[i].name) {
                norChatList[i].tempName = tempName.join(',');
            }
        }
        $rootScope.$broadcast('refreshLastestEmpInfo');
    });
    function handlerChatList(list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].index === undefined) {
                list[i].index = i;
            }
        }
        list.sort(function (v1, v2) {
            if (v1.Sticky != v2.Sticky) {
                return v1.Sticky > v2.Sticky ? -1 : 1;
            } else {
                if (v1.ActiveTimestamp == v2.ActiveTimestamp) {
                    if (v1.MsgTimestamp == v2.MsgTimestamp) {
                        return v1.index > v2.index ? 1 : -1;
                    }
                    return v1.MsgTimestamp > v2.MsgTimestamp ? -1 : 1;
                } else {
                    return v1.ActiveTimestamp > v2.ActiveTimestamp ? -1 : 1;
                }
            }
        })
        return list;
    }
    $rootScope.$on('roomSubjectChange', function (ev, groupId, subject) {
        groupCache[groupId] = groupCache[groupId] || {
            isGroup: true,
            groupId: groupId
        };
        groupCache[groupId].groupName = subject;
        groupInfoCallBack[groupId] && groupInfoCallBack[groupId](groupCache[groupId]);
    });
    var groupInfoCallBack = {};
    // strophe.getMsgList = chat.getMsgList;
    var createRoomCallBack = {};
    var unReadyOffMsgList = [];
    // $rootScope.$on('getEnpInfoSuccess',function(e,val,name){
    // if(chat.isExist(val)){
    // var _chat = chat.getChat(val);
    // console.log(arguments)
    // _chat.name = name;
    // }
    // })
    var chatMap = {};
    var lastGetMsgListTime = {};
    var avatarCacheMap = {};
    var sendingMsg = {};
    window.sendingMsg = sendingMsg;
    var reSendingMsg = {};
    var retry = 0;
    var chat = chatService = {
        getChats: function (page, pageSize, callback) {
            /*
                CachedEarliestMsgTimeStamp 这个你不会用到
                Sticky 置顶
                Type  //1000：单聊 1002：群聊
                ChatCfgType     //0：默认 1：置顶 2：免打扰 3：置顶并免打扰，此处可以优化，将设置信息存在独立的表中
                MsgStatus : 0 失败  1正常 2发送中（2为前端自己添加）
            */
            var args = arguments;
            callCefMethod('chat/list', {
                page: page,
                count: pageSize
            }, function (res) {
                console.log("getChatList————————————————————————", res);
                // function isJSON(str) {
                //     if (typeof str == 'string') {
                //         try {
                //             var obj = JSON.parse(str);
                //             if (typeof obj == 'object' && obj) {
                //                 return true;
                //             } else {
                //                 return false;
                //             }

                //         } catch (e) { 
                //             return false;
                //         }
                //     } 
                // }
                // for(let i in res.Data){
                //     if(res.Data[i].MsgType == 10 && isJSON(res.Data[i].MsgContent) && JSON.parse(res.Data[i].MsgContent).n_TYPE == 10 && JSON.parse(res.Data[i].MsgContent).chatRoomId.indexOf('group_')>=0 && res.Data[i].Id != JSON.parse(res.Data[i].MsgContent).chatRoomId ){
                //         chatService.getMsgList( res.Data[i].Id , function (data, source) {
                //             for(let k in data){
                //                 if( res.Data[i].ActiveTimestamp - data[k].timeStamp>0  && (data[k].type == "service" &&  data[k].msgObj.chatRoomId.indexOf('group_')<0 ) ){
                //                     let newK= Number(k) + 1;
                //                     // let obj={
                //                     //     ActiveTimestamp: 1639039550475,
                //                     //     AtMeTimestamp: 0,
                //                     //     Avatar: "D:/JJ/JJ/img/HeadImg/man.png",
                //                     //     Favorite: 1,
                //                     //     IMStatus: 1,
                //                     //     Id: "5bfcdc99aa55498aa1c5da6be672c136",
                //                     //     IsEncryption: 0,
                //                     //     MemberCount: 1,
                //                     //     MsgContent: ,
                //                     //     MsgSenderId: "f43245bd9824430b973fbf57320bb38b",
                //                     //     MsgSenderName: "邢鑫",
                //                     //     MsgStatus: 1,
                //                     //     MsgTimestamp: 1639039550475,
                //                     //     MsgType: 10,
                //                     //     Name: "123",
                //                     //     ReadTimestamp: 1639039550475,
                //                     //     Sticky: 0,
                //                     //     Type: 1000,
                //                     //     Undisturbed: 0,
                //                     //     UnreadMsgCount: 0,
                //                     //     id: "5bfcdc99aa55498aa1c5da6be672c136",
                //                     //     index: 1,
                //                     //     isGroup: false,
                //                     // }
                //                    console.log(k, newK,'data===>',data[newK])
                //                 }
                //             }
                //             console.log(' getMsgList===>',data);
                //         },true, 20);
                //     }
                // }
                var _res = {};
                _res.Flag = res.Flag;
                _res.chatList = chatList;
                if (res.Flag == 0) {
                    var list = res.Data;
                    for (var i = 0; i < list.length; i++) {
                        if (!chatMap[list[i].Id]) {
                            chatList.push(list[i]);
                            chatMap[list[i].Id] = list[i];
                            list[i].isGroup = list[i].Type == 1002 ? true : false;
                            list[i].ActiveTimestamp = list[i].MsgTimestamp;
                        }
                    }
                    for (var i = 0; i < chatList.length; i++) {
                        chatList[i].id = chatList[i].Id;
                        if (avatarCacheMap[chatList[i].Id]) {
                            chatList[i].Avatar = avatarCacheMap[chatList[i].Id];
                        }
                    }
                } else {
                    setTimeout(function () {
                        if (retry >= 3) {
                            retry = 0;
                            return;
                        }
                        retry++;
                        chatService.getChats.apply(undefined, args);
                    }, 10);
                    return;
                }
                handlerChatList(chatList);
                callback && callback(_res);
            });
        },
        chatList: chatList,
        getNewChat: function (chatId, callback) {
            callCefMethod('chat/getById', {
                chatId: chatId
            }, function (res) {
                callback && callback(res);
            })
        },
        addChat: function (cefChat) {
            cefChat.ActiveTimestamp = util.getNow();
            cefChat.id = cefChat.Id;
            if (!chatMap[cefChat.Id]) {
                chatList.push(cefChat);
                chatMap[cefChat.Id] = cefChat;
                cefChat.isGroup = cefChat.Type == 1002 ? true : false;
            }
        },
        //新增-查询是否允许进入视频会议
        CanJoinRoom: function (roomId, callback) {
            callCefMethod('chat/canJoinRoom', {
                roomId: roomId
            }, function (res) {
                callback && callback(res);
            })
        },
        //新增-上报视频会议状态  isExit 退出-true 加入-false
        ReportRoom: function (roomId,isExit, callback) {
            callCefMethod('chat/reportRoom', {
                roomId: roomId,
                isExit: isExit
            }, function (res) {
                callback && callback(res);
            })
        },
        handlerChatList: handlerChatList,
        getGroupInfo: function (groupId) {
            // var groupInfo = callCefMethod('group/getById',groupId);
            // if(groupInfo.Flag == 0){
            // var info = groupInfo.Data;
            // var members = info.Members;
            // var tempName = [];
            // for(var i=0;i<members.length;i++){
            // var emp = callCefMethod('user/getById',members[i]);
            // members[i] = emp.Data;
            // tempName.push(members[i].Name);
            // }
            // info.TempName = tempName.join(',');
            // return info;
            // }else{
            // return {
            // Members : []
            // };
            // }
        },
        convertMsg: function (content) {
            var _content = content;
            var reg = /<br[^>]*\/*>/g, nbsp = /&nbsp;/g;
            _content = _content.replace(reg, '\n');
            _content = _content.replace(nbsp, ' ');
            _content = _content.replace(/(<\/?a.*?>)|(<\/?span.*?>)/g, '');//去除 a 标签
            _content = util.emojiImgToUnicode(_content);
            _content = util.faceToFont(_content);
            _content = util.htmlEncode(_content);
            _content = util.htmlDecode(_content);
            //@人转换
            _content = util.convertAtToMob(_content, empService.getEmpInfo, empService.getEmpName);
            // message.setContent(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(_content)));
            return _content;
        },
        hasUnreadChat: function () {
            for (var p in chatMap) {
                if (!chatMap[p].Undisturbed && chatMap[p].UnreadMsgCount != 0) {
                    return true;
                }
            }
            return false;
        },
        isBlockedChat: function (chatId) {
            if (chatMap[chatId]) {
                return chatMap[chatId].Undisturbed;
            }
        },
        createMessage: (function () {
            var sending = {};
            return  function (chatId, msgType, content, file, onlineFiles) {
                var user = webConfig.getUser();
                var chat = chatService.getChat(chatId);
                // 视频会议 - 新增逻辑 删除左侧栏和联系人的对话框 调用getChat函数获取不到联系人的个人信息返回 undefined 重新调用接口 获取联系人的个人信息
                if (chat == undefined) {
                    // 获取 - 视频会议 内存入的 联系人的个人信息
                    chat= getChatIdObj.getData();
                    chat.isGroup = chat.Type == 1002 ? true : false;
                    // 调用接口 如使用 async/await 等待异步 返回的对象为 Promise 需要多处修改的老代码取值方式
                    //  await new Promise((resolve) => {
                    //     callCefMethod('user/getAllInfoById', {
                    //         userId: chatId,
                    //     }, function (res) {
                    //         if (res.Code == 0) {
                    //             res.Data.isGroup = res.Data.Type == 1002 ? true : false;
                    //             chat = res.Data;
                    //             resolve();
                    //         }
                    //     })
                       
                    // })

                }
                     // 视频会议 特殊处理
                // if(msgType == 10 && JSON.parse(content) && JSON.parse(content).chatRoomId.indexOf('group_') >= 0){
                //     chat = chatService.getChat(JSON.parse(content).chatRoomId) ;
                console.log(chat);
                var now = new Date().getTime();
                var messageId = [user.Id, now].join('_');
                while (sending[messageId]) {
                    now = new Date().getTime();
                    messageId = [user.Id, now].join('_');
                }
                var msg = {
                    id: messageId,
                    chatId: chatId,
                    chatType: !chat.isGroup ? 1000 : 1002,
                    type: msgType,
                    content: content,
                    senderId: user.Id,
                    filePath: file ? file.Path : '',
                    timeStamp: now,
                    fileLength: file ? file.Size : 0,
                    fileUrl: file ? (file.FileUrl || '') : ''
                };
                var fileStart = /file:\/\/\//;
                msg.SendMode = 0;
                if (onlineFiles) {
                    var arr = [];
                    var msgContent = {};
                    msgContent.totalLength = 0;
                    msgContent.n_TYPE = 9;
                    msgContent.type = 0;
                    for (var i = 0; i < onlineFiles.length; i++) {
                        var temp = {};
                        onlineFiles[i].Path = onlineFiles[i].Path.replace(fileStart, '');
                        temp.Path = onlineFiles[i].Path;
                        temp.Size = onlineFiles[i].Size;
                        temp.IsDirectory = onlineFiles[i].IsDirectory;
                        msgContent.totalLength += onlineFiles[i].Size;
                        arr.push(temp);
                    }
                    msgContent.fileList = arr;
                    msg.onlineFiles = arr;
                    msg.content = angular.toJson(msgContent);
                    msg.SendMode = 1;
                }
                msg.filePath = msg.filePath.replace(fileStart, '');
                sending[messageId] = 1;
                setTimeout(function () {
                    delete sending[messageId];
                }, 20000);
                return {
                    msg: msg,
                    now: now
                };
                
                
            }
        })(),
        createForwardMsg: function (chatId, msg) {
            var content = '';
            var file = {};
            content = msg.Content;
            content = util.emojiFaceToImg(content);
            content = util.emojiImgToUnicode(content);
            file = {
                Path: msg.FilePath,
                FileUrl: msg.FileUrl,
                Size: msg.FileLength
            }
            switch (webConfig.MSG_TYPE_ARR[msg.Type]) {
                case webConfig.MSG_TEXT_TYPE:
                    file = undefined;
                    break;
                case webConfig.MSG_PIC_TYPE:
                    break;
                case webConfig.MSG_FILE_TYPE:
                    break;
                case webConfig.MSG_VOICE_TYPE:
                    break;
                case webConfig.MSG_VIDEO_TYPE:
                    break;
                case webConfig.MSG_SERVICE_TYPE:
                    break;
                default:
                    break;
            }
            var message = chatService.createMessage(chatId, msg.Type, content, file);
            return message;
        },
        sendMsg: (function () {
            return function (message, callback) {
                // 如果是视频会议 chatRoomId是群id 发送到群聊中
                // if(message.msg.type == 10){
                //     if(JSON.parse(message.msg.content).chatRoomId.indexOf('group_')>=0){
                //         message.msg.chatId = JSON.parse(message.msg.content).chatRoomId;
                //     }
                // }
                var msg = message.msg;
                if (lastGetMsgListTime[msg.chatId] == 0 || lastGetMsgListTime[msg.chatId] == undefined) {
                    lastGetMsgListTime[msg.chatId] = message.now + 1;
                }
                $rootScope.$broadcast('sendingMsg', message.msg, message.now);
                sendingMsg[msg.id] = msg;
                callCefMethod('chat/sendMsg', msg, function (res) {
                    if (res.Data != 1) {
                        $rootScope.$broadcast('messageSendFail', msg.id, msg.chatId, msg)
                    } else {
                        setTimeout(function () {
                            if (chatService.isSending(msg.id)) {
                                $rootScope.$broadcast('messageSendFail', msg.id, msg.chatId, msg);
                            }
                        }, webConfig.MSG_SEND_TIMEOUT);
                    }
                    callback && callback(res);
                });
            }
        })(),
        sendOnlineFileMsg: function (message, callback) {
            var msg = message.msg;
            if (lastGetMsgListTime[msg.chatId] == 0 || lastGetMsgListTime[msg.chatId] == undefined) {
                lastGetMsgListTime[msg.chatId] = message.now + 1;
            }
            $rootScope.$broadcast('sendingMsg', message.msg, message.now);
            sendingMsg[msg.id] = msg;
            callCefMethod('chat/SendOnlineFiles', msg, function (res) {
                if (res.Data != 1) {
                    $rootScope.$broadcast('messageSendFail', msg.id, msg.chatId, msg)
                }
                setTimeout(function () {
                    console.log(window)
                    if (chatService.isSending(msg.id)) {

                        $rootScope.$broadcast('messageSendFail', msg.id, msg.chatId, msg);
                    }
                }, webConfig.MSG_SEND_TIMEOUT);
                callback && callback(res);
            });
        },
        isSending: function (msgId) {
            return sendingMsg[msgId];
        },
        deleteSending: function (msgId) {
            delete sendingMsg[msgId];
            delete reSendingMsg[msgId];
        },
        isReSending: function (msgId) {
            return reSendingMsg[msgId];
        },
        resendMsg: function (msgId, chatId, callback) {
            reSendingMsg[msgId] = 1;
            callCefMethod('chat/resendMsg', {
                id: msgId
            }, function (res) {
                if (res.Data != 1) {
                    $rootScope.$broadcast('messageSendFail', msgId, chatId)
                }
                callback && callback(res);
            });
            setTimeout(function () {
                if (chatService.isSending(msgId)) {
                    $rootScope.$broadcast('messageSendFail', msgId, chatId);
                }
            }, webConfig.MSG_SEND_TIMEOUT);
        },
        withDrawMsg: function (msgId, callback) {
            console.log('with drwa msg')
            callCefMethod('chat/withdrawMsg', {
                id: msgId
            }, function (res) {
                $rootScope.$broadcast('withDrawMsg', msgId)
                callback && callback(res);
            })
        },
        // 用于CEF传过来的消息体转换成在前端显示消息时对应的消息结构
        cefMsgToFrontMsg: function (cefMsg) {
            var res = {};
            var msg = cefMsg.msg;

            res.sender = cefMsg.sender; // 发送者
            res.sender.Id = msg.SenderId;
            res.chatId = msg.ChatId; // 所属聊天
            res.chatType = msg.ChatType; // 所属聊天类型
            res.type = webConfig.MSG_TYPE_ARR[msg.Type]; // 消息类别名称
            res.msgType = msg.Type; //消息类别编号
            res.content = msg.Content; // 消息内容
            res.fileLength = msg.FileLength; // 文件大小|视频大小
            res.filePath = msg.FilePath; // 本地文件路径
            res.fileStatus = msg.FileStatus; // 默认0(尚未请求文件服务器)，传输中 1，已取消 2，错误 3，成功 4，对方已下载 5，已过期 6
            res.fileUrl = msg.FileUrl; // 文件上传成功后路径
            res.messageid = msg.Id; // 消息Id            
            res.senderId = msg.SenderId; // 发送者ID
            // res.status = msg.Status; // 消息发送状态
            // console.log('isSending : ' ,chatService.isSending(msg.Id))
            res.status = msg.Status == 1 ? 1 : (chatService.isSending(msg.Id) ? webConfig.MSG_SENDING : webConfig.MSG_SENDFAIL); // 消息发送状态
            res.timeStamp = msg.Timestamp; // 发送时间
            res.name = msg.Name; // 
            res.refId = msg.RefId; // 
            res.subType = msg.Subtype; // 
            res.sendDate = new Date(res.timeStamp).format('YYYY-MM-DD');
            res.inGroup = msg.ChatType == 1002;

            /* 以下为前端自增 */
            res.showTime = false; // 是否显示时间，默认为false
            res.speed = 0; // 文件传输速度
            res.transProgess = 0; // 文件传输进度
            if (res.type == webConfig.MSG_SERVICE_TYPE) {
                res.msgObj = msg.Content ? angular.fromJson(msg.Content) : {};
                // res.msgObj.s_COVERIMAGEURL = 
                if (res.msgObj.n_TYPE == 2) {
                    if (res.msgObj.s_COVERIMAGEURL.indexOf('http://') == -1) {
                        res.msgObj.s_COVERIMAGEURL = webConfig.SERVICE_MSG_PIFX + res.msgObj.s_COVERIMAGEURL;
                    }
                }
            }
            return res;
        },
        removeChat: function (chatId) {
            for (var i = 0; i < chatList.length; i++) {
                if (chatId == chatList[i].Id) {
                    chatList.splice(i, 1);
                    deletedChat[chatId] = 1;
                    delete chatMap[chatId];
                }
            }
        },
        // type : 0 指定 1 免打扰 2 常用联系人
        changeChatStatus: function (type, params, callback) {
            params.type = type;
            var that = this;
            callCefMethod('chat/changeFlag', params, function (res) {
                if (res.Flag == 0) {
                    if (params.value == 1) {
                        for (var i = 0; i < res.Data.idList.length; i++) {
                            that.setChatStatus(res.Data.idList[i], res.Data.type);
                        }
                        $rootScope.$broadcast('setChatStatus', res.Data.type, res.Data.idList);
                    } else {
                        for (var i = 0; i < res.Data.idList.length; i++) {
                            that.cancelChatStatus(res.Data.idList[i], res.Data.type);
                        }
                        $rootScope.$broadcast('cancelChatStatus', res.Data.type, res.Data.idList);
                    }
                    callback && callback(res);
                }
            });
        },
        setChatStatus: function (chatId, type) {
            var chat = this.getChat(chatId);
            var keys = ['Sticky', 'Undisturbed', 'Favorite'];
            var key = keys[type];
            if (chat) {
                chat[key] = 1;
            }
        },
        cancelChatStatus: function (chatId, type) {
            var chat = this.getChat(chatId);
            var keys = ['Sticky', 'Undisturbed', 'Favorite'];
            var key = keys[type];
            if (chat) {
                chat[key] = 0;
            }
        },
        changeGroupName: function (groupId, name, callback) {
            callCefMethod('group/rename', {
                groupId: groupId,
                name: name
            }, function (res) {
                callback && callback(res);
            })
        },
        setChatAvatar: function (chatId, avatar) {
            var chat = this.getChat(chatId);
            if (chat) {
                chat.Avatar = avatar;
            } else {
                avatarCacheMap[chatId] = avatar;
            }
        },
        createGroupByDeptId: function (deptId, groupId, callback) {
            callCefMethod('group/createByDept', {
                groupId: groupId,
                deptId: deptId
            }, function (res) {
                if (res.Code == 100) {
                    alert(langPack.getKey('noStaffs'));
                }
                callback && callback(res, groupId);
            })
        },
        createGroup: function (groupId, memberIds, callback) {
            callCefMethod('group/create', {
                groupId: groupId,
                memberIds: memberIds
            }, function (res) {
                callback && callback(res);
            })
        },
        addUsers: function (groupId, memberIds, callback) {
            callCefMethod('group/addMembers', {
                groupId: groupId,
                memberIds: memberIds
            }, function (res) {
                callback && callback(res);
            })
        },
        kickUser: function (chatId, userId, callback) {
            if (!userId.push) {
                userId = [userId];
            }
            callCefMethod('group/removeMembers', {
                groupId: chatId,
                memberIds: userId
            }, function (res) {
                callback && callback(res);
            })
        },
        leaveGroup: function (groupId, callback) {
            var current = webConfig.getUser();
            var userId = [current.Id];
            callCefMethod('group/removeMembers', {
                groupId: groupId,
                memberIds: userId
            }, function (res) {
                callback && callback(res);
            })
        },
        searchData: function (keyword, callback) {
            callCefMethod('user/search', {
                key: keyword,
            }, function (res) {
                callback && callback(res);
            })
        },
        //搜索,type:0人员，1部门，2群组，不传代表搜全部
        searchUser: function (keyword, pageSize, callback) {
            callCefMethod('user/search', {
                type: 0,
                key: keyword,
                page: 1,
                count: pageSize || 5
            }, function (res) {
                callback && callback(res);
            })
        },
        getMsgDetail: function (msgId, callabck) {
            callCefMethod('chat/getmsgbyId', {
                id: msgId
            }, function (res) {
                callabck && callabck(res);
            })
        },
        setIsRead: (function () {
            var sendLater = {};
            return function (chatId, callback) {
                if (sendLater[chatId]) {
                    clearTimeout(sendLater[chatId]);
                }
                sendLater[chatId] = setTimeout(function () {
                    callCefMethod('chat/setIsRead', {
                        chatId: chatId
                    }, function (res) {
                        sendLater[chatId] = undefined;
                        if (res.Flag == 0) {
                            callback && callback(res);
                        }
                    })
                }, 200);
            }
        })(),
        deleteChat: function (idList, type, callback) {
            callCefMethod('chat/delete', {
                idList: idList,
                type: type
            }, function (res) {
                callback && callback(res);
            });
        },
        // clearUnReadyOffMessage : function(){
        // return unReadyOffMsgList.length = 0;
        // },
        // getUnReadyOffMessage : function(){
        // return unReadyOffMsgList;
        // },
        // saveUnReadyOffMessage : function(list){
        // this.clearUnReadyOffMessage();
        // [].push.apply(unReadyOffMsgList,list);
        // },
        getChat: function (id, notCreate) {
            // if(!id || notCreate) return;
            for (var i = 0; i < chatList.length; i++) {
                if (id == chatList[i].Id) {
                    return chatList[i];
                }
            }
            // var reg = /^group_.*?_[\d.]+$/;
            // return this.initBlankChat(id,reg.test(id),util.isService(id));
        },
        count: 20,
        getMsgList: function (id, callback, isFirstTime, count) {
            var that = this;
            var args = arguments;
            callCefMethod('chat/msgList', {
                chatId: id,
                timestamp: isFirstTime ? 0 : lastGetMsgListTime[id],
                count: count
            }, function (res) {
                if (res.Flag == 1) {
                    setTimeout(function () {
                        if (retry >= 3) {
                            retry = 0;
                            return;
                        }
                        chatService.getMsgList.apply(that, args);
                    }, 10);
                    return;
                }
                var list = res.Data;
                var _res = [];
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var converted = that.cefMsgToFrontMsg(list[i]);
                        // console.log('msgList==>', converted);
                        if (converted.msgType == 10 && converted.msgObj.n_TYPE == 6) {
                            continue;
                        }
                        // list[i].msg.type = webConfig.MSG_TYPE_ARR[list[i].msg.MsgType];
                        // list[i].sender = list[i].sender;
                        _res.push(converted);
                    }
                    console.log('msgList==>', _res);
                    if (list.length) {
                        lastGetMsgListTime[id] = list[list.length - 1].msg.Timestamp;
                    }
                }
                // deWeight(_res);
                callback && callback(_res, res);
            })
            return undefined;
        },
        clearLastMsgTime: function (chatId) {
            lastGetMsgListTime[chatId] = 0;
        },
        setLastMsgTime: function (chatId, time) {
            lastGetMsgListTime[chatId] = time + 1;
        },
        getChatList: function () {
            return chatList;
        },
        isExist: function (chatId) {
            var list = this.getChatList();
            for (var i = 0; i < list.length; i++) {
                if (chatId == list[i].id) {
                    return true;
                }
            }
            return false;
        },
        searchMsg: function (params, callback) {
            var that = this;
            callCefMethod('history/search', params, function (res) {
                if (res.Code == 0) {
                    var dataList = res.Data.dataList;
                    for (var i = 0; i < dataList.length; i++) {
                        for (var j = 0; j < dataList[i].dataList.length; j++) {
                            dataList[i].dataList[j] = that.cefMsgToFrontMsg(dataList[i].dataList[j]);
                            if (j == 0) {
                                dataList[i].dataList[j].showDate = true;
                            } else {
                                if (dataList[i].dataList[j - 1].sendDate != dataList[i].dataList[j].sendDate) {
                                    dataList[i].dataList[j].showDate = true;
                                }
                            }
                        }
                    }
                }
                callback && callback(res);
            });
        },
        locationMsg: function (params, callback) {
            var that = this;
            callCefMethod('history/SearchContext', params, function (res) {
                if (res.Code == 0) {
                    var list = res.Data.Data;
                    for (var i = 0; i < list.length; i++) {
                        list[i] = that.cefMsgToFrontMsg(list[i]);
                        if (i == 0) {
                            list[i].showDate = true;
                        } else {
                            if (list[i - 1].sendDate != list[i].sendDate) {
                                list[i].showDate = true;
                            }
                        }
                    }
                }
                callback && callback(res);
            });
        },
        searchChatMsg: function (params, callback) {
            var that = this;
            callCefMethod('history/searchChat', params, function (res) {
                if (res.Code == 0) {
                    var list = res.Data.Data || [];
                    for (var i = 0; i < list.length; i++) {
                        list[i] = that.cefMsgToFrontMsg(list[i]);
                        if (i == 0) {
                            list[i].showDate = true;
                        } else {
                            if (list[i - 1].sendDate != list[i].sendDate) {
                                list[i].showDate = true;
                            }
                        }
                    }
                }
                callback && callback(res);
            });
        },
        searchImgContext: function (params, callback) {
            var that = this;
            callCefMethod('history/searchImgContext', params, function (res) {
                if (res.Code == 0) {
                    var list = res.Data.Data || [];
                    for (var i = 0; i < list.length; i++) {
                        list[i] = that.cefMsgToFrontMsg(list[i]);
                        if (i == 0) {
                            list[i].showDate = true;
                        } else {
                            if (list[i - 1].sendDate != list[i].sendDate) {
                                list[i].showDate = true;
                            }
                        }
                    }
                }
                callback && callback(res);
            });
        },
        getHasMsgDays: function (params, callback) {
            callCefMethod('history/getMsgDates', params, function (res) {
                callback && callback(res);
            })
        },
        searchByNames: function (names, callback) {
            callCefMethod('user/searchByNames', {
                nameList: names
            }, function (res) {
                callback && callback(res);
            });
        },
        rejectOnlineFile: function (msgId, callback) {
            callCefMethod('chat/rejectOnlineFile', {
                id: msgId
            }, function (res) {
                callback && callback(res);
            })
        },
        onlineFileStatus: function (msgId, callback) {
            callCefMethod('chat/onlineFileReceiverStatus', {
                id: msgId
            }, function (res) {
                callback && callback(res);
            })
        },
        checkUnFinishedFileMsg: function (callback) {
            callCefMethod('chat/UnfinishedOnlineFileMsgIds', function (res) {
                callback && callback(res);
            })
        },
        setAtMsgTime: function (chatId, time, callback) {
            callCefMethod('chat/setAtMeTimestamp', {
                chatId: chatId,
                timestamp: time
            }, function (res) {
                callback && callback(res);
            })
        },
        clearCacheData: function (chatId, callback) {
            callCefMethod('chat/delete', {
                idList: [chatId],
                type: 0
            }, function (res) {
                callback && callback(res);
            })
        }
    }
    // strophe.getMsgList = chat.getMsgList;
    socketConnect.isCompleteReq = function (groupId) {
        return chat.isCompleteReq(groupId);
    }
    return chat;
}]);

services.factory('previewService', ['$rootScope', '$document', '$compile', '$templateCache', 'langPack', function ($rootScope, $document, $compile, $templateCache, langPack) {
    var preview = {
        open: function (scope) {
            // if (!scope.imageList || scope.imageList.length <= 0) return false;
            preview.instance && (preview.instance.close(), preview.instance = null);
            preview.isOpen = true;
            // data = data || {};
            // var $scope = $rootScope.$new();
            // angular.extend($scope, data);
            var ele = angular.element($templateCache.get('imagePreview.html'));
            scope.langPack = langPack;
            ele = $compile(ele)(scope);
            if (scope.wrap) {
                scope.wrap.append(ele);
            } else {
                var body = $document.find("body").eq(0);
                body.append(ele);
            }
            var instance = {
                close: function () {
                    var scope = ele.scope();
                    scope && scope.$destroy();
                    ele.remove();
                }
            };
            preview.instance = instance;
            return instance;
        }
    }
    return preview;
}]);


/**
    services_2.js
*/

services.factory('concatService', ['$rootScope', '$http', 'empService', 'ajaxService', '$q', 'util', '$timeout', 'domain', 'chatService', 'socketConnect', 'webConfig', function ($rootScope, $http, empService, ajaxService, $q, util, $timeout, domain, chatService, socketConnect, webConfig) {
    var cache;
    var globalReq;
    var firstLogin = localStorage.getItem('firstLogin');
    var firstLoginCreate = {};
    var needCreate = {};
    var firendsMap = {};
    var concatService = {
        getEnts: function (callback) {
            callCefMethod('dept/getRoot', function (res) {
                callback && callback(res);
            })
        },
        refreshEnts: function (callback) {
            callCefMethod('dept/UpdateOrgData', function (res) {
                callback && callback(res);
            })
        },
        getDept: function (id, callback) {
            callCefMethod('dept/getById', {
                deptId: id
            }, function (res) {
                callback && callback(res);
            })
        },
        getUserDetail: function (id, callback) {
            callCefMethod('user/getAllInfoById', {
                userId: id
            }, function (res) {
                callback && callback(res);
            })
        },
        getGroup: function (id, callback) {
            callCefMethod('group/getbyid', {
                groupId: id
            }, function (res) {
                callback && callback(res);
            })
        },
        getUser: function (id, callback) {
            callCefMethod('user/getbyid', {
                userId: id
            }, function (res) {
                callback && callback(res);
            })
        },
        // 保存常用联系 0个人，1部门，2群组
        setFavorite: function (type, ids, callback) {
            var that = this;
            callCefMethod('favorite/add', {
                type: type,
                idList: ids
            }, function (res) {
                callback && callback(res);
                if (type == 0 || type == 2) {
                    for (var i = 0; i < ids.length; i++) {
                        chatService.setChatStatus(ids[i], 2);
                    }
                }
                $rootScope.$broadcast('setFavorite', res.Data.type, res.Data.idList);
            })
        },
        cancelFavorite: function (type, ids, callback) {
            var that = this;
            callCefMethod('favorite/delete', {
                type: type,
                idList: ids
            }, function (res) {
                callback && callback(res);
                if (type == 0 || type == 2) {
                    for (var i = 0; i < ids.length; i++) {
                        chatService.cancelChatStatus(ids[i], 2);
                    }
                }
                $rootScope.$broadcast('cancelFavorite', res.Data.type, res.Data.idList);
            })
        },
        getFavorite: function (type, callback) {
            callCefMethod('favorite/getByType', {
                type: type
            }, function (res) {
                callback && callback(res);
            })
        },
        getFriends: function (callback) {
            callCefMethod('friend/list', function (res) {
                callback && callback(res);
            })
        },
        getServices: function (callback) {
            callCefMethod('dept/getServices', function (res) {
                callback && callback(res);
            })
        },
        getDeptTree: function (deptId, callback) {
            callCefMethod('dept/getTreeById', {
                deptId: deptId,
                value: 1
            }, function (res) {
                callback && callback(res);
            })
        },
        getTreeById: function (deptId, callback) {
            callCefMethod('dept/getTreeById', {
                deptId: deptId
            }, function (res) {
                callback && callback(res);
            })
        },
        modifyUserInfo: function (params, callback) {
            var user = webConfig.getUser();
            params.Id = user.Id;
            callCefMethod('user/changeInfo', params, function (res) {
                callback && callback(res);
            })
        }
    };
    Date.prototype.format2 = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    chatService.isTop = concatService.isTop;
    return concatService;
}]);
services.factory('frameService', ['$rootScope', '$http', 'empService', 'ajaxService', '$q', 'util', '$timeout', 'domain', 'chatService', 'socketConnect', 'webConfig', 'settingService', 'langPack', 'envConfig', function ($scope, $http, empService, ajaxService, $q, util, $timeout, domain, chatService, socketConnect, webConfig, settingService, langPack, envConfig) {
    var frameService = {
        setGlobalCallbak: function (fns, callback) {
            callCefMethod('global/setCallback', fns, function (res) {
                callback && callback(res);
            });
        },
        connectIm: function (callback) {
            callCefMethod('im/connect', function (res) {
                callback && callback(res);
            });
        },
        disconnectIm: function (callback) {
            callCefMethod('im/disconnect', function (res) {
                callback && callback(res);
            });
        },
        accountLogout: function (callback) {
            callCefMethod('account/logout', function (res) {
                callback && callback(res);
            });
        },
        getCurrentUser: function (callback) {
            callCefMethod('account/currentUser', function (res) {
                webConfig.setUser(res.Data.user);
                envConfig.setEnvData(res.Data.global);
                $timeout(function () {
                    callback && callback(res);
                })
            });
        },
        onLine: function () {
            callCefMethod("frame/online");
        },
        offLine: function () {
            callCefMethod('frame/offline');
        },
        twinkle: function () {
            callCefMethod('frame/twinkle');
        },
        stopTwinkle: function () {
            callCefMethod('frame/stopTwinkle');
        },
        capture: function (callback) {
            callCefMethod('frame/capture', function (res) {
                callback && callback(res);
            });
        },
        flash: function () {
            callCefMethod('frame/flashwindow', function () { });
        },
        open: function (id, path, params, width, height, isModal, name, dragable, resizable,callback) {
            if (!params) {
                params = {};
            }
            dragable = dragable || false;
            resizable = resizable || false;
            params.time = new Date().getTime();
            var str = params ? util.urlify(params) : '';
            var opt = arguments[arguments.length - 1];
            var frameOption = {
                id: id,
                name: name || '',
                contentPath: str ? path + '?' + str : path,
                width: width,
                height: height,
                isModal: isModal,
                draggable: dragable,
                resizable: resizable
            }
            if (Object.prototype.toString.call(opt) == '[object Object]') {
                for (var p in opt) {
                    frameOption[p] = opt[p];
                }
            }
            callCefMethod('frame/open', frameOption, function (res) {
                callback && callback(res);
            });
        },
        notice: function (params, callback) {
            callCefMethod('global/cascadeCallback', params, function (res) {
                callback && callback(res);
            })
        },
        moveFrame: function () {
            callCefMethod('frame/move');
        },
        closeFrame: function (id, callback) {
            callCefMethod('frame/close', {
                id: id
            })
        },
        hideMainFrame: function () {
            callCefMethod('frame/close', {
                hideToTray: true
            });
        },
        closeMainFrame: function () {
            callCefMethod('frame/close', {
                hideToTray: false
            });
        },
        minFrame: function (callback) {
            callCefMethod('frame/minimum', function (res) {
                callback && callback(res);
            });
        },
        maxFrame: function (callback) {
            callCefMethod('frame/maximum', function (res) {
                callback && callback(res);
            });
        },
        reset: function (name, path, params, width, height) {
            var str = params ? util.urlify(params) : '';
            callCefMethod('frame/reset', {
                id: 'main',
                name: name,
                width: width,
                height: height,
                contentPath: str ? path + '?' + str : path,
                resizable: true,
                isMain: true
            });
        },
        resizeFrame: function (name, path, params, width, height, isModal, name, dragable, resizable, callback) {
            var str = params ? util.urlify(params) : '';
            callCefMethod('frame/reset', {
                id: 'main',
                name: name,
                width: width,
                height: height,
                contentPath: path ? (str ? path + '?' + str : path) : '',
                resizable: true,
                isMain: false,
                position: 2
            }, function (res) {
                callback && callback(res);
            });
        },
        startRecord: function (callback) {
            callCefMethod('frame/startrecord', function (res) {
                if (res.Code == 106) {
                    alert(langPack.getKey('noMicroPhone'));
                    return;
                }
                callback && callback(res);
            })
        },
        stopRecord: function (saveRecord, callback) {
            callCefMethod('frame/stopRecord', {
                type: saveRecord ? 1 : 0
            }, function (res) {
                callback && callback(res);
            })
        },
        play: function (msgId, callback) {
            callCefMethod('chat/openmsg', {
                id: msgId
            }, function (res) {
                if (res.Code == 106) {
                    alert(langPack.getKey('noBroadcaster'));
                    return;
                }
                callback && callback(res);
            })
        },
        stop: function (callback) {
            callCefMethod('frame/stopAudio', function (res) {
                callback && callback(res);
            })
        },
        copy: function (content, callback) {
            // jj.fetch("frame/copy", JSON.stringify({ data: { html: "<label>大大大！@#123</label>" ,text:"大大大"}, callback: "callback" }));
            // var params = {};
            // params.format = type || 'Text';
            // params.content = content;
            callCefMethod('frame/copy', content, function (res) {
                callback && callback(res);
            })
        },
        getDragFiles: function (callback) {
            callCefMethod('frame/getdragfiles', function (res) {
                callback && callback(res);
            })
        },
        fileDialog: function (params, callback) {
            callCefMethod('frame/fileDialog', params, function (res) {
                callback && callback(res);
            })
        },
        openMsg: function (params, callback) {
            callCefMethod('chat/openMsg', params, function (res) {
                callback && callback(res);
            })
        },
        cancelTransfer: function (params, callback) {
            callCefMethod('chat/cancelTransfer', params, function (res) {
                callback && callback(res);
            })
        },
        downLoad: function (params, callback) {
            callCefMethod('chat/download', params, function (res) {
                callback && callback(res);
            })
        },
        saveDialog: function (params, callback) {
            callCefMethod('frame/saveDialog', params, function (res) {
                if (res.Data) {
                    callback && callback(res);
                }
            })
        },
        resetMouse: function (left, top, callback) {
            callCefMethod('frame/resetMouse', {
                left: left,
                top: top
            }, function (res) {
                callback && callback(res);
            })
        },
        showFrame: function (callback) {
            callCefMethod('frame/show', function (res) {
                callback && callback(res);
            })
        },
        newMsgDing: function (callback) {
            if (!settingService.userSetting.PlaySound) {
                callCefMethod('frame/newMsgDing', function (res) {
                    callback && callback(res);
                })
            }
        },
        logout: function (callback) {
            callCefMethod('account/logout', function (res) {
                frameService.disconnectIm();
                callback && callback(res);
            })
        }
    }
    return frameService;
}]);

services.factory('loginService', ['$rootScope', '$http', 'empService', 'ajaxService', '$q', 'util', '$timeout', 'domain', 'chatService', 'webConfig', function ($scope, $http, empService, ajaxService, $q, util, $timeout, domain, chatService, webConfig) {
    var loginService = {
        checkPhone: function (phone, callback) {
            callCefMethod('account/isExist', {
                mobile: phone
            }, function (res) {
                callback && callback(res);
            })
        },
        sendSmsCode: function (type, phone, callback) {
            //发送验证码,type:0Register,1ChangePassword,2ChangeMobileNo,3Login
            callCefMethod('account/sendVerifyCode', {
                type: type,
                mobile: phone
            }, function (res) {
                callback && callback(res);
            })
        },
        checkSmsCode: function (type, phone, code, callback) {
            //验证码匹配检查,type:0Register,1ChangePassword,2ChangeMobileNo,3Login
            callCefMethod('account/checkVerifyCode', {
                type: type,
                code: code,
                mobile: phone
            }, function (res) {
                callback && callback(res);
            })
        },
        changePassword: function (phone, password, confirm, callback) {
            callCefMethod('account/changePassword', {
                password: password,
                confirm: confirm,
                mobile: phone
            }, function (res) {
                callback && callback(res);
            })
        },
        checkInvitationCode: function (phone, callback) {
            //  是否有邀请码
            callCefMethod('user/checkIsEmployee', {
                mobile: phone
            }, function (res) {
                callback && callback(res);
            })
        },
    }
    return loginService;
}]);
services.factory('settingService', ['$rootScope', '$http', 'empService', 'ajaxService', '$q', 'util', '$timeout', 'domain', 'chatService', 'webConfig', function ($scope, $http, empService, ajaxService, $q, util, $timeout, domain, chatService, webConfig) {
    var settingService = {
        getSetting: function (callback) {
            callCefMethod('usersetting/GetCurUserSetting', function (res) {
                settingService.userSetting = res.Data;
                $timeout(function () {
                    callback && callback(res);
                })
            })
        },
        saveSetting: function (data, callback) {
            callCefMethod('usersetting/Save', data, function (res) {
                callback && callback(res);
            })
        },
        reset: function (callback) {
            callCefMethod('usersetting/Reset', function (res) {
                $timeout(function () {
                    callback && callback(res);
                })
            })
        },
    }
    return settingService;
}]);