var filters = angular.module('Filters');
filters.filter('broadcastTimeFormat', ['util', 'langPack', function (util, langPack) {
    return function (date) {
        if (!date) return '';
        date = parseInt(date);
        var _date = new Date(date);
        return _date.format('YYYY-MM-DD hh:mm');
    }
}]);
filters.filter('datePickerFormat', ['util', 'langPack', function (util, langPack) {
    return function (date) {
        return date.format('YYYY.MM.DD');
    }
}]);
filters.filter('dateFormat', ['util', 'langPack', function (util, langPack) {
    return function (date, format) {
        if (!date) return '';
        date = parseInt(date);
        var _date = new Date(date);
        return _date.format(format || 'YYYY.MM.DD');
    }
}]);
filters.filter('timeFormat', ['util', 'langPack', function (util, langPack) {
    return function (date) {
        if (!date) return '';
        date = parseInt(date);
        var _date = new Date(date);
        var hour = _date.getHours();
        var time = langPack.getKey('am');
        if (hour > 12) {
            time = langPack.getKey('pm');
        }
        time = '';
        var today = new Date();
        today = today.format('MM-DD');
        var _date1 = _date.format('MM-DD');
        return today == _date1 ? time + _date.format('hh:mm') : _date1;
    }
}]);
filters.filter('mobileNoFilter', ['util', 'langPack', function (util, langPack) {
    return function (mobile) {
        var country = [
            { pixNum: '86', name: '中国' },
            { pixNum: '1', name: '美国' },
            { pixNum: '886', name: '台湾' },
            { pixNum: '82', name: '韩国' },
            { pixNum: '7', name: '俄罗斯' },
            { pixNum: '81', name: '日本' }
        ];
        var map = {};
        var countryArr = [];
        for (var i = 0; i < country.length; i++) {
            countryArr.push(country[i].pixNum);
            map[country[i].pixNum] = country[i];
        }
        countryArr.sort(function (v1, v2) {
            return v1.length > v2.length ? -1 : 1;
        })
        var countryStr = countryArr.join('|');
        var countryReg = new RegExp('^\\+(' + countryStr + ')');
        return mobile ? mobile.replace(countryReg, '') : '';
    }
}])
/*
    时:分
    昨天
    前天
    星期几
    年月日
*/
filters.filter('msgDetailTimeFormat', ['util', 'langPack', function (util, langPack) {
    return function (date) {
        if (!date) return '';
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        var todayBegin = today.getTime(); // 今天开始
        var yesterdatBegin = today.setDate(today.getDate() - 1); // 昨天开始
        var tdbyBegin = today.setDate(today.getDate() - 1); // 前天开始
        date = parseInt(date);
        var _date = new Date(date);
        // 今天
        if (_date.format('YYYY-MM-DD') == new Date().format('YYYY-MM-DD')) {
            return _date.format('hh:mm');
        }
        // 昨天
        if (date <= todayBegin && date > yesterdatBegin) {
            return langPack.getKey('yesterday') + ' ' + _date.format('hh:mm');
        }
        // 前天
        if (date <= yesterdatBegin && date > tdbyBegin) {
            return langPack.getKey('thedaybeforeyesterday') + ' ' + _date.format('hh:mm');
        }
        // 星期几
        today = new Date();
        var day = today.getDay();
        var thisWeekBegin = todayBegin - day * 24 * 60 * 60 * 1000; // 本周开始
        var nextWeekbegin = thisWeekBegin + 7 * 24 * 60 * 60 * 1000; // 下周开始
        if (date >= thisWeekBegin && date < nextWeekbegin) {
            var dayArr = langPack.getKey('weekDays');
            return dayArr[_date.getDay()] + ' ' + _date.format('hh:mm');
        }
        // 年月日
        return _date.format('YYYY-MM-DD') + ' ' + _date.format('hh:mm');
        // var hour = _date.getHours();
        // var time = langPack.getKey('am');
        // if(hour > 12){
        // time = langPack.getKey('pm');
        // }
        // var today = new Date();
        // today = today.format('MM-DD');
        // var _date1 = _date.format('MM-DD');
        // return (today == _date1 ? time : _date1) + ' ' + _date.format('hh:mm');
    }
}])

filters.filter('htmlOverviewMsgTemp', ['util', 'langPack', '$filter', 'webConfig', function (util, langPack, $filter, webConfig) {
    return function format(str) {
        var atReg = /<input(?:[^>]*)?(?:class="_at_emp"(?:[^>]*)?value="([^"]+)"|value="([.*]+)"(?:[^"]*)?class="_at_emp")(?:[^>]*)\/*>/gi;
        var brReg = /<br\s*\/*>/g;
        var atReg1 = /<a class="msg_at_emp">(.*?)<\/a>/gi;
        str = str.replace(brReg, '');
        str = str.replace(atReg, function (v1, v2) {
            return v2;
        })
        str = str.replace(atReg1, function (v1, v2) {
            return v2;
        })
        str = util.emojiFaceReplace(str);
        str = util.faceToFont(str);
        str = util.filterHtmlTag(str);
        str = util.htmlDecode(str);
        str = util.htmlEncode(str);
        // str = util.filterHtmlTag(str);
        str = util.faceToImg(str);
        str = util.emojiFaceToImg(str);
        return str;
    }
}]);
filters.filter('unreadCountFilter', ['util', 'langPack', '$filter', 'webConfig', function (util, langPack, $filter, webConfig) {
    return function (num) {
        num = parseInt(num);
        if (num > 99) {
            return '99+';
        }
        return num;
    }
}]);
filters.filter('htmlOverview', ['util', 'langPack', '$filter', 'webConfig','rtcRoomObj', function (util, langPack, $filter, webConfig,rtcRoomObj) {
    // 0：系统分享，1 ： 广播   2：服务号   3：语音会议 4：添加好友 5:公司邀请 6:置顶/免打扰/添加常用联系人同步消息 7:消息撤回 8:离线文件接收回执)
    function format(str) {
        var atReg = /<input(?:[^>]*)?(?:class="_at_emp"(?:[^>]*)?value="([^"]+)"|value="([.*]+)"(?:[^"]*)?class="_at_emp")(?:[^>]*)\/*>/gi;
        var brReg = /<br\s*\/*>/g;
        var atReg1 = /<a class="msg_at_emp">(.*?)<\/a>/gi;
        str = str.replace(brReg, '');
        str = str.replace(atReg, function (v1, v2) {
            return v2;
        })
        str = str.replace(atReg1, function (v1, v2) {
            return v2;
        })
        str = util.emojiFaceReplace(str);
        str = util.faceToFont(str);
        // str = util.filterHtmlTag(str);
        str = util.htmlEncode(str);
        // str = util.htmlDecode(str);

        // str = util.filterHtmlTag(str);
        str = util.faceToImg(str);
        str = util.emojiFaceToImg(str);
        return str;
    }
    return function (str) {
        var currentUser = webConfig.getUser();
        var currentUserId = currentUser.Id;
        if (!str) return '';
        if (typeof str === 'string') {
            return format(str);
        }
        if (typeof str === 'object') {
            var chat = str;
            var res = chat.MsgContent || '';
            if (chat.MsgType == 10) {
                try {
                    var strObj = JSON.parse(chat.MsgContent);
                    if (strObj) {
                        switch (strObj.n_TYPE) {
                            
                            case '0':
                                res = langPack.getKey('link') + strObj.title;
                                break;
                            case 1:
                            case 2:
                                if (strObj.s_CONTENTTYPE == 'image') {
                                    res = util.htmlDecode(strObj.s_TITLE);
                                } else {
                                    if (strObj.s_TITLE) {
                                        res = util.htmlDecode(strObj.s_TITLE);
                                    } else {
                                        res = util.htmlDecode(strObj.s_CONTENTS);
                                    }
                                }
                                break;
                            case 3: // 语音会议
                                if (strObj.voiceMeetingType == 'invite') {
                                    if (chat.MsgSenderId != currentUserId) {
                                        res = (chat._senderName || chat.MsgSenderName) + ' ' + langPack.getKey('invitedIntoMetting');
                                    } else {
                                        res = langPack.getKey('you') + ' ' + langPack.getKey('invitedIntoMettingInSender');
                                    }
                                } else {
                                    res = '';
                                }
                                break;
                            case 5: // 加入公司
                                if (strObj.addCompanyType == 'agree') {
                                    res = strObj.szMobileTel + ' ' + langPack.getKey('joinEnt') + ' ' + strObj.entName;
                                }
                                if (strObj.addCompanyType == 'invite') {
                                    res = strObj.szMobileTel + ' ' + langPack.getKey('inviteEnt') + ' ' + strObj.entName + ',' + langPack.getKey('seeInMobile');
                                }
                                break;
                            case 4: //
                                res = '';
                                break;
                            case 7:
                                chat.MsgSenderName = '';
                                res = (strObj.sender == currentUserId ? langPack.getKey('you') : strObj.senderName) + ' ' + langPack.getKey('withDrawMsg');
                                break;
                            case 9:
                                var files = strObj.receiversProgress;
                                if (strObj.type == 0) {
                                    res = langPack.getKey('largeFileMsg');
                                } else {
                                    res = chat.MsgSenderId == currentUserId ? langPack.getKey('cancelLargeFileMsgInSender') : (chat.MsgSenderName + langPack.getKey('cancelLargeFileMsgInReceiver'));
                                }
                                break;
                            case 10: // 视频会议 左侧栏 提示
                                // if (chat.MsgSenderId != currentUserId) {
                                //     // res = (chat._senderName? chat._senderName:chat.MsgSenderName)  +  ' : ' + JSON.parse(chat.MsgContent).message;
                                //     res = (chat._senderName? chat._senderName:chat.MsgSenderName)  +  ' : [视频会议]' ;
                                // }else{
                                    // res = langPack.getKey('you') + ' : ' +  JSON.parse(chat.MsgContent).message;
                                    res = '[视频会议]';
                                // }
                                break;
                                case 12:
                                    // 视频会议 左侧栏 提示
                                    res = '[预约视频会议]';
                                break;
                            case 100:
                                var temp = {
                                    senderId: chat.MsgSenderId,
                                    sender: {
                                        Id: chat.MsgSenderId,
                                        Name: chat.MsgSenderName || chat._senderName
                                    },
                                    msgObj: strObj
                                }
                                chat.MsgSenderName = '';
                                res = $filter('groupOperateMsgFilter')(temp);
                                break;
                            default:
                                if (strObj.s_CONTENTS) {
                                    res = util.htmlDecode(strObj.s_CONTENTS);
                                }
                                break;
                        }
                    }
                } catch (e) {
                    res = chat.MsgContet || '';
                }
            } else {
                res = format(res);
            }
            return res;
        }
    }
}]);


filters.filter('fileSizeFormat', [function () {
    return function (size, def) {
        if (!size || isNaN(size)) return '0K';
        var i = def || 0, sizeArr = ['B', 'KB', 'MB', 'GB'];
        while (size > 1024) {
            i++;
            size = parseFloat(size / 1024);
        }
        size = size.toFixed(2);
        return size + sizeArr[i];
    }
}]);

filters.filter('fileExtFilter', ['util', function (util) {
    var extClassMap = {
        word: ['doc', 'docx'],
        excel: ['xls', 'xlsx'],
        video: ['avi', 'rmvb', 'rm', 'asf', 'divx', 'mpg', 'mpeg', 'mpe', 'wmv', 'mp4', 'mkv', 'vob'],
        audio: ['cd', 'ogg', 'mp3', 'asf', 'wma', 'wav', 'mp3'],
        image: ['bmp', 'gif', 'jpeg', 'png', 'pcx', 'tiff', 'gif', 'jpg', 'tga', 'exif', 'fpx', 'svg', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'hdri', 'raw'],
        ai: ['ai'],
        apk: ['apk'],
        pdf: ['pdf'],
        psd: ['psd'],
        exe: ['exe'],
        rar: ['rar', 'zip', '7z', 'gz', 'bz', 'ace', 'uha', 'uda', 'zpaq'],
        ppt: ['ppt', 'pptx', 'pps', 'ppsx']
    };
    return function (name, intranet) {
        var val, ext;
        if (intranet) {
            var content = angular.fromJson(name);
            var fileList = content.fileList;
            if (fileList.length > 1) {
                ext = 'list';
            } else {
                ext = util.getFileExt(fileList[0].Path);
            }
        } else {
            ext = util.getFileExt(name);
        }
        for (var id in extClassMap) {
            var list = extClassMap[id];
            if (ext && list.indexOf(ext) != -1) {
                val = id;
                break;
            }
        }
        if (!val) {
            val = 'file';
        }
        return val;
    }
}])

filters.filter('splitFilter', ['util', function (util) {
    return function (str) {
        if (!str) return '';
        var arr = str.split(',');
        if (arr.length) {
            return arr.join('<br />');
        }
    }
}])
filters.filter('msgFilter', ['util', 'empService', 'webConfig', function (util, empService, webConfig) {
    return function (msg, keyword) {
        var res = '';
        if (msg.type == webConfig.MSG_TEXT_TYPE) {
            res = util.htmlEncode(msg.content);
            if (keyword) {
                var _keyword = util.replaceMetaStr(keyword);
                _keyword = util.htmlEncode(_keyword);
                var reg = new RegExp('(' + _keyword + ')', 'ig');
                res = res.replace(reg, function (v1, v2) {
                    return '<span class="keyword2">' + v2 + '</span>';
                })
            }
            res = util.convertAtFromMob(res, empService.getEmpInfo);
            res = util.faceToFont(res);
            res = util.hrefEncode(res);
            res = util.faceToImg(res);
            res = util.emojiFaceReplace(res);
            res = res.replace(/\n/g, '<br />');
            res = util.emojiFaceToImg(res);
            // res = res + '   ' +new Date(msg.Timestamp).format('YYYY-MM-DD hh:mm:ss')
        }
        return res;
    }
}])
filters.filter('deptNameFilter', ['util', 'empService', 'webConfig', function (util, empService, webConfig) {
    return function (str) {
        if (!str) return '';
        var arr = str.split('\\');
        return arr[0];
    }
}]);
filters.filter('serviceContentFilter', ['util', 'empService', 'webConfig', function (util, empService, webConfig) {
    return function (content) {
        if (content.length > 51) {
            content = content.substr(0, 50);
        }
        return content;
    }
}]);
filters.filter('broadContentFilter', ['util', 'empService', 'webConfig', function (util, empService, webConfig) {
    return function (content) {
        content = content.replace(/\n/g, '<br />');
        return content;
    }
}])
filters.filter('broadDetailFilter', ['util', 'empService', 'webConfig', function (util, empService, webConfig) {
    return function (content) {
        content = util.htmlEncode(content);
        content = util.faceToFont(content);
        content = util.hrefEncode(content);
        content = util.faceToImg(content);
        content = util.emojiFaceReplace(content);
        content = content.replace(/\n/g, '<br />');
        return content;
    }
}]);
filters.filter('countDownFilter', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    return function (count) {
        var key = langPack.getKey('countDown');
        key = key.replace(/\{d\}/, count);
        return key;
    }
}]);
filters.filter('stringLightFilter', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    return function (str, keyword) {
        var _keyword = util.replaceMetaStr(keyword);
        var reg = new RegExp('(' + _keyword + ')', 'i');
        return str.replace(reg, function (v1, v2) {
            return '<span class="keyword">' + v2 + '</span>';
        })
    }
}]);

filters.filter('groupOperateMsgFilter', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    function wrapName(name) {
        // return '"' + name + '"';
        return name;
    }
    // _content = empService.getEmpName(actor,1) + langPack.getKey('invitedIntoGroup') + names.join('、') + langPack.getKey('invitedIntoGroupEnd');
    // if(strangers.length){
    // _content += ' , ' + strangerNames.join('、') + langPack.getKey('privacyAttention');
    // }
    return function (msg) {
        var currentUser = webConfig.getUser();
        var currentUserId = currentUser.Id;
        var msgObj = msg.msgObj;
        var nType = msgObj.n_Type;
        var operateName = currentUserId == msg.senderId ? langPack.getKey('you') : wrapName(msg.sender.Name);
        var targetUsers = msgObj.targetUsers;
        var res = '';
        var names = [], strangers = [];
        for (var i = 0; i < targetUsers.length; i++) {
            if (msg.senderId == targetUsers[i].Id) continue;
            names.push(targetUsers[i].Id == currentUserId ? langPack.getKey('you') : wrapName(targetUsers[i].Name));
            if (targetUsers[i].Status == 1) {
                strangers.push(wrapName(targetUsers[i].Name));
            }
        }
        switch (msgObj.action) {
            case 0x11: // 建群 17
            case 0x12: // 加人 18
                res = operateName + langPack.getKey('invitedIntoGroup') + names.join('、') + langPack.getKey('invitedIntoGroupEnd');
                if (strangers.length) {
                    res += ' , ' + strangers.join('、') + langPack.getKey('privacyAttention');
                }
                break;
            case 0x13: //删除群组中的成员 19
                var target = targetUsers[0];
                if (msg.senderId == target.Id) { // 如果是自己退出
                    if (currentUserId == msg.senderId) {
                        res = langPack.getKey('you') + langPack.getKey('quitGroup');
                    } else {
                        res = wrapName(target.Name) + langPack.getKey('quitGroup');
                    }
                } else {
                    if (currentUserId == msg.senderId) {
                        res = langPack.getKey('removedMemberAdminStart') + names.join('、') + langPack.getKey('removedMemberAdminEnd')
                    } else {
                        res = names.join('、') + langPack.getKey('removedMember');
                    }
                }
                break
            case 0x14: //修改群组名称 20
                res = operateName + langPack.getKey('changeGroupName') + '"' + util.htmlEncode(msgObj.content) + '"';
                break;
            case 0x15: //删除群组(非管理员没权限操作) 21

                break
            case 0x17: //传递群主(非管理员没权限操作) 22

                break;
            case 0x36:  // 设置禁言
                var time = parseInt(msgObj.content);
                var timeMinute = parseInt(time / 60);
                if (time > 24 * 60 * 60) {
                    res = names.join('、') + langPack.getKey('shutUpForever');
                } else {
                    res = names.join('、') + langPack.getKey('shutUpAction') + ' ' + timeMinute + ' ' + langPack.getKey('minutes');
                }
                if (msg.senderId == currentUserId) {
                    res = res.replace(/\{name\}/, langPack.getKey('you'));
                } else {
                    res = res.replace(/\{name\}/, langPack.getKey('groupOwner'));
                }
                break;
            case 0x37:  // 取消禁言
                res = names.join('、') + langPack.getKey('cancelShutUp');
                break;
            case 0x100: // 本地保存的发消息时被禁言收到的提示消息
                var time = parseInt(msgObj.content);
                var timeMinute = Math.ceil(time / 60);
                res = langPack.getKey('you') + langPack.getKey('hasBeenShutup') + timeMinute + ' ' + langPack.getKey('minutes');
                break;
        }
        return res;
    }
}]);

filters.filter('fileNameFilter', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    return function (str) {
        return decodeURIComponent(str);
    }
}]);

filters.filter('imageScaleFilter', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    return function (str) {
        return parseFloat(str * 100).toFixed(0) + '%';
    }
}]);


filters.filter('largeFileMsgContentFilterTitle', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    return function (str) {
        var obj = angular.fromJson(str);
        var files = obj.fileList || [];
        var name = [];
        for (var i = 0; i < files.length; i++) {
            var path = files[i].ShowPath || files[i].Path;
            name.push(decodeURIComponent(path));
        }
        return name.join(' ');
    }
}]);
filters.filter('largeFileMsgContentFilter', ['util', 'empService', 'webConfig', 'langPack', function (util, empService, webConfig, langPack) {
    return function (str) {
        var obj = angular.fromJson(str);
        var files = obj.fileList || [];
        var name = [];
        for (var i = 0; i < files.length; i++) {
            var path = files[i].ShowPath || files[i].Path;
            path = path.split('/');
            name.push(decodeURIComponent(path[path.length - 1]));
        }
        return name.join(' ');
    }
}]);