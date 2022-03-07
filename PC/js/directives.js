var directives = angular.module('Directives');

directives.directive('ngTitle', ['$parse', 'empService', 'util', function ($parse, empService, util) {
    return {
        restrict: "EA",
        link: function ($scope, elem, attrs) {
            var loginEmp = empService.getLoginEmp();
            var parsed = $parse(attrs.ngTitle);
            var members = $scope.getTotalMailTo();
            $scope.$watch('concatId', function () {
                elem.attr('title', parsed($scope));
                members = $scope.getTotalMailTo();
            })
            elem.bind('click', function () {
                var body = document.getElementsByTagName('body')[0];
                var iframe = document.createElement('iframe');
                iframe.name = 'mailto';
                iframe.id = 'mailto';
                iframe.style.display = 'none';
                body.appendChild(iframe);
                var mails = [];
                for (var i = 0; i < members.length; i++) {
                    if (loginEmp.SUserId != members[i].SUserId) {
                        mails.push(members[i].SMailAccount);
                    }
                }
                window.open('mailto:' + mails.join(';'), 'mailto');
                setTimeout(function () {
                    body.removeChild(iframe);
                }, 1000)
            })
        }
    }
}]);
directives.directive('ngTitle1', ['$parse', 'empService', 'util', function ($parse, empService, util) {
    return {
        restrict: "EA",
        priority: -402,
        template: '<span ng-bind-html="name"></span>',
        link: function ($scope, elem, attrs) {
            $scope.name = 'aaa';
            console.log($scope.name);
        }
    }
}]);
directives.directive('ngTitle1', ['$parse', 'empService', 'util', function ($parse, empService, util) {
    return {
        restrict: "EA",
        priority: -401,
        // template : '<span ng-bind-html="name"></span>',
        link: function ($scope, elem, attrs) {
            console.log(2)
            console.log($scope.name);
            $scope.name = 'bbb'
        }
    }
}]);
directives.directive('ngAreaSelect', ['$parse', 'util', 'webConfig', '$rootScope', '$timeout', function ($parse, util, webConfig, $rootScope, $timeout) {
    return {
        replace: true,
        templateUrl: 'areaSelect.html',
        scope: {
            selectArea: '='
        },
        link: function ($scope) {
            $scope.areas = [
                { langkey: 'china', pix: '+86' },
                { langkey: 'taiwan', pix: '+886' },
                { langkey: 'usa', pix: '+1' },
                { langkey: 'korea', pix: '+82' },
                { langkey: 'russia', pix: '+7' },
                { langkey: 'japan', pix: '+81' }
            ];

            $scope.isOpen = false;
            $scope.openAreas = function () {
                $scope.isOpen = true;
            }
            // $scope.selectArea = util.getLs(webConfig.PHONE_PIX) || '+86';
            function getAreaName(pix) {
                for (var i = 0; i < $scope.areas.length; i++) {
                    if ($scope.areas[i].pix == pix) {
                        return util.getKey($scope.areas[i].langkey);
                    }
                }
            }
            $scope.selectAreaName = getAreaName($scope.selectArea);
            $scope.onSelectArea = function (tar) {
                $scope.selectArea = tar.pix;
                $scope.selectAreaName = getAreaName(tar.pix);
                $scope.isOpen = false;
            }
            $rootScope.$on('changeLang', function () {
                $scope.selectAreaName = getAreaName($scope.selectArea);
            });
            $scope.$on('document.click', function () {
                $timeout(function () {
                    $scope.isOpen = false;
                })
            });
        }
    }
}]);

directives.directive('ngInput', ['$parse', function ($parse) {
    return function ($scope, elem, attrs) {
        var parsed = $parse(attrs.ngInput);
        elem.bind("input propertychange", function (e) {
            var dom = this;
            $scope.$apply(function () {
                parsed($scope, { $event: e, $dom: dom })
            })
        })
    }
}]);
directives.directive('numberOnly', ['$parse', function ($parse) {
    return function ($scope, elem, attrs) {
        function numberFilter(e) {
            var keyCode = e.keyCode;
            if ((keyCode >= 48 && keyCode <= 57)) {
            } else {
                e.preventDefault();
            }
        }
        var parsed = $parse(attrs.ngInput);
        elem.bind("keypress", numberFilter)
    }
}]);
directives.directive('copyMsg', ['$parse', 'util', 'langPack', function ($parse, util, langPack) {
    var setCopyData = (function () {

        // 修改复制的时候修改图片的地址
        function changeImageSrc(div) {
            var img = $(div).find('img');
            for (var i = 0; i < img.length; i++) {
                if (img.eq(i).attr('msgImg') && img.eq(i).attr('pid')) {
                    var id = img.eq(i).attr('pid');
                    var obj = msgMap[id];
                    if (obj.oriImageUrl) {
                        if (img[i].src != obj.oriImageUrl) {
                            img[i].src = obj.oriImageUrl;
                        }
                    }
                }
            }
        };

        // 判断消息里面记录是否为空
        function judgeMsgIsEmpty(div) {
            var inner = div.innerHTML;
            inner = inner.replace(/<br>/g, '');
            inner = inner.replace(/\n/g, '');
            if (inner == '') {
                return true;
            }
            return false;
        };

        function setData(div) {
            var pre = $(div).find('.msg_txt');
            pre = pre.filter(function () {
                var res = $(this).find('.load_img').size() == 0 ? (!$(this).find('.msg_content').text() ? false : true) : true;
                // if($(this).find('.file_detail').size()){
                // res = true;
                // }
                return res;
            })
            if (pre.length == 0) {
                return;
            }
            if (pre.length == 1) {
                var cDiv = document.createElement("div");
                $(cDiv).append($(div).find('.msg_txt').children().clone());
                $(div).empty();
                $(div).append(cDiv);
                return;
            }
            var cDiv = document.createElement("div");
            var tDiv;
            for (var i = 0; i < pre.length; i++) {
                if (judgeMsgIsEmpty(pre[i])) {
                    continue;
                }
                if (pre.length == 1 && !pre.find('.msg_content').size()) {
                    continue;
                }
                tDiv = document.createElement("div");
                var id = pre.eq(i).attr('pid');
                // var obj = msgMap[id];
                // pre.eq(i).prepend(obj.sender.SEmpName + ':  ');
                var msgDom = document.getElementById(id);
                msgDom = $(msgDom);
                var t = $(pre[i]);
                if (!t.find('.hide_name').size()) {
                    var nameDom = msgDom.find('.hide_name');
                    t.prepend(nameDom.clone());
                }
                $(tDiv).append($(pre[i]).clone());
                $(cDiv).append('<br>');
                $(cDiv).append(tDiv);
            }
            $(div).empty();
            $(div).append(cDiv);
        };


        var __setCopyData = function (e, target) {
            var selection = window.getSelection();
            var range = selection.getRangeAt(0);
            var cloneContents = range.cloneContents();
            var clipboardData = e.clipboardData;
            var _range = document.createRange();
            _range.selectNode(target);
            if (_range.compareBoundaryPoints(Range.END_TO_END, range) == -1) {
                if (_range.compareBoundaryPoints(Range.START_TO_START, range) == -1) {
                    var childs = target.childNodes;
                    if (childs.length) {
                        range.setEndAfter(childs[childs.length - 1]);
                    }
                    selection.removeAllRanges();
                    selection.addRange(range);
                    cloneContents = range.cloneContents();
                } else {
                    e.preventDefault();
                    return;
                }
            }
            var div = document.createElement('div');
            div.className = 'temporary_div';
            div.appendChild(cloneContents);
            // document.body.appendChild(div);
            changeImageSrc(div);
            setData(div);
            //$('body').append(div);
            var img = $(div).find("img[msgImg=true]");
            if (img.length == 1 && div.innerText.replace(/\s/g, '') == '') {
                var src = img[0].src;
                setTimeout(function () {
                    // snailIM.copyImage(src);
                }, 0);

            } else {
                // var html = div.innerHTML;
                // var text = div.innerHTML; // 复制的时候将br换成\n，确保在输入框粘贴时显示正常
                // var htmlTag = /<([^>]+)\s*[^>]*>/g;
                // html = util.faceToFont(html); // 表情图片直接转文字
                // html = html.replace(/<br\s*\/*>/g,'\n');
                // html = html.replace(htmlTag,function(v,tag){ // 去除img标签以外html
                // if(v.indexOf('<img ') == 0){
                // v = decodeURIComponent(v);
                // return v;
                // }
                // return '';
                // });
                // html = html.replace(/\s/g,function(v){ // 把空格换成&nbsp;
                // if(/\n/.test(v)){
                // return v;
                // }
                // return '&nbsp;';
                // });
                // html = html.replace(/<.*(&nbsp;).*>/g,function(v){ // 把img标签中的&nbsp;再换回html代码空格
                // return v.replace(/&nbsp;/g,' ');
                // })
                // html = html.replace(/\n/g,'<br>');

                // text = text.replace(/<br\s*\/*>/g,'\r\n');
                // text = util.faceToFont(text);
                // text = text.replace(htmlTag,function(v,tag){
                // if(v.indexOf('<img ') == 0){
                // return langPack.getKey('img');
                // }
                // return '';
                // });
                // text = util.htmlDecode(text);
                var res = util.copyDom(div.innerHTML);
                clipboardData.setData("text/html", res.html);
                clipboardData.setData("text/plain", res.text);
            }
            //$(div).remove()

            e.preventDefault();
        }
        return __setCopyData;
    })();
    return {
        link: function ($scope, elem, attrs) {
            elem.bind('copy', function (e) {
                setCopyData(e.originalEvent, this);
                return false;
            })
        }
    }
}]);
directives.directive('contenteditableDirective', ['$timeout', 'util', 'webConfig', 'frameService', 'langPack', function ($timeout, util, webConfig, frameService, langPack) {
    return {
        restrict: "A",
        require: "?ngModel",
        link: function ($scope, $ele, $attrs, $ngModel) {
            function readBlobAsDataURL(blob, callback) {
                var a = new FileReader();
                a.onload = function (e) { callback(e.target.result); };
                a.readAsDataURL(blob);
            }
            function setScopeValue(e) {
                $scope.$apply(function () {
                    var val = $ele.html();
                    $ngModel.$setViewValue(val);
                })
            }
            if (!$ele[0].attachEvent) {
                $ele.bind('input', setScopeValue);
            } else {
                $ele.bind('keyup', setScopeValue);
            }
            var timer;
            function fn(e) {
                // console.log(this.innerHTML);
                // var spanReg = /<span[^>]*>/g;
                // var spanReg1 = /<\/span>/g;
                // this.innerHTML = this.innerHTML.replace(spanReg,'');
                // this.innerHTML = this.innerHTML.replace(spanReg1,'');
                // $ngModel.$setViewValue(this.innerHTML);
                // var oe = e.originalEvent;
                // var oecd = oe.clipboardData;
                if (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
                var dom = this;
                if (timer) {
                    $timeout.cancel(timer);
                }
                // 0 文本，包含 图片
                // 3 文件
                // 4 图片
                var chatId = $scope.chatData.currentChat;
                frameService.getCurrentUser(function (res) {
                    var isOfflineFileForbidden = res.Data.global.IsOfflineFileForbidden;
                    // var isOfflineFileForbidden = true;
                    var fileDomain = res.Data.global.LocalDomain;
                    // fileDomain = fileDomain ? fileDomain + '/' : '';
                    var _fileDomain = util.replaceMetaStr(fileDomain);
                    var fileDomainReg = new RegExp('^' + fileDomain);
                    var hasDir = false, isFile = false;
                    callCefMethod('frame/paste', function (res) {
                        if (res.Flag == 0) {
                            var datas = res.Data.clipboard;
                            var list = [];
                            if (!isOfflineFileForbidden) {
                                var hasTooLargeFile = false;
                                for (var i = 0; i < datas.length; i++) {
                                    if (datas[i].Type == 4 || datas[i].Type == 3) {
                                        if (datas[i].FileLength > webConfig.MAX_FILE_SIZE) {
                                            hasTooLargeFile = true;
                                            break;
                                        }
                                    }
                                }
                                if (hasTooLargeFile) {
                                    alert(langPack.getKey(datas.length == 1 ? 'fileTooLarge' : 'tooLargeFile'));
                                    return;
                                }
                            }
                            for (var i = 0; i < datas.length; i++) {
                                if (datas[i].Type == 0) {
                                    var html = contentReplace(datas[i].Content, fileDomain);
                                    $scope.insertHtmlByCommand(html);
                                    // document.execCommand('insertHTML',false,html);
                                } else if (datas[i].Type == 4) {
                                    var img = new Image();
                                    var src = datas[i].FilePath;
                                    if (fileDomain) {
                                        if (!fileDomainReg.test(src)) {
                                            src = fileDomain + src;
                                        }
                                    }
                                    img.src = src;
                                    $scope.insertHtmlByCommand(img.outerHTML);
                                    // document.execCommand('insertHTML',false,img.outerHTML);
                                } else if (datas[i].Type == 3) {
                                    isFile = true;
                                    if (isOfflineFileForbidden) {
                                        list.push({
                                            Path: datas[i].FilePath,
                                            Size: datas[i].FileLength,
                                            IsDirectory: datas[i].IsDirectory
                                        })
                                    } else {
                                        var nameArr = datas[i].FilePath.split('/');
                                        var name = nameArr[nameArr.length - 1];
                                        name = decodeURIComponent(name);
                                        if (datas[i].IsDirectory) {
                                            hasDir = true;
                                            continue;
                                        }
                                        var message;
                                        if (util.isImg(datas[i].FilePath)) {
                                            message = $scope.createMessage(chatId, webConfig.MSG_TYPE_MAP[webConfig.MSG_PIC_TYPE], name, {
                                                Path: datas[i].FilePath,
                                                Size: datas[i].FileLength
                                            });
                                        } else {
                                            message = $scope.createMessage(chatId, webConfig.MSG_TYPE_MAP[webConfig.MSG_FILE_TYPE], name, {
                                                Path: datas[i].FilePath,
                                                Size: datas[i].FileLength
                                            });
                                        }
                                        $scope.sendMsg(message);
                                    }
                                }
                            }
                            if (isOfflineFileForbidden && isFile) {
                                if (datas.length == 1) {
                                    var isImg = util.isImg(list[0].Path);
                                    if (isImg) {
                                        var message = $scope.createMessage(chatId, webConfig.MSG_TYPE_MAP[webConfig.MSG_PIC_TYPE], '', list[0]);
                                        $scope.sendMsg(message);
                                        return;
                                    }
                                }
                                var message = $scope.createMessage(chatId, 10, '', '', list);
                                $scope.sendOnlinFileMsg(message);
                            } else {
                                if (hasDir) {
                                    alert(langPack.getKey('notSupportSendFileDir'));
                                }
                            }
                        }
                    })
                });
                var old = this.innerHTML;
                function contentReplace(pasteIn, fileDomain) {
                    // var pasteIn = _new.substring(_new.length - last.length,from);
                    // console.log('原内容：%s,新内容：%s',old,_new)
                    // console.log('位置：%s,前面内容：%s,后面内容：%s，本次粘贴进来的内容：%s',from,prev,last,pasteIn);
                    var a = document.createElement('pre');
                    pasteIn = pasteIn.replace(/&nbsp;/g, " ");
                    // pasteIn = pasteIn.replace(/&amp;/g,'&');
                    // pasteIn = pasteIn.replace(/&/g,'&amp;');
                    a.innerHTML = pasteIn;
                    $(a).find('._at_emp').each(function () {
                        var val = this.value;
                        var width = util.getStringWidth(val);
                        $(this).css({
                            lineHeight: '16px',
                            width: width
                        })
                    })
                    $(a).find('.msg_sender_name').remove();
                    $(a).find('._msg_time').remove();
                    $(a).find('textarea').remove();
                    $(a).find('.selected_img').removeClass('selected_img');
                    $(a).find('img').each(function () {
                        if (!this.src) $(this).remove();
                    });
                    $(a).find('img').each(function () {
                        var src = this.src.replace('file:///', '');
                        var arr = src.split('/');
                        for (var i = 0; i < arr.length - 2; i++) {
                            arr[i] = arr[i].replace(/#/g, '%23');
                        }
                        src = arr.join('/');
                        if (fileDomain) {
                            var _fileDomain = util.replaceMetaStr(fileDomain);
                            var reg = new RegExp('^' + _fileDomain);
                            if (!reg.test(src)) {
                                src = fileDomain + src;
                            }
                        }
                        this.src = src;
                    })
                    pasteIn = a.innerHTML;
                    // var 
                    var vmlReg = /<\!--\[if\s\!vml\]-->.*<\!--\[endif\]-->/g;
                    pasteIn = pasteIn.replace(vmlReg, '');
                    pasteIn = pasteIn.replace(/<br\s*\/*>\n/g, '\n');
                    pasteIn = pasteIn.replace(/<br\s*\/*>/g, '\n');
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
                    // str = str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
                    // str = str.replace(htmlInner,'');
                    str = str.replace(blockEnd, '<br />');
                    str = str.replace(blockEndInner, '<br />');

                    str = str.replace(innerBegin, function (h, tag) {
                        if (tag === 'img') {
                            return h;
                        }

                        if (tag === 'input') {
                            return h;
                        }
                        return '';
                    });
                    // var imgReg = /<img src="(^)">/g;
                    // str = str.replace(imgReg,function(img,v){
                    // return '<'+encodeURIComponent(v)+'/>';
                    // });
                    str = str.replace(innerEnd, '');
                    // str = str.replace(trimBlank,'');
                    str = str.replace(blanks, function () {
                        return '<br';
                    });

                    var prev = '';
                    // prev = prev.replace(htmlBegin,'');
                    // prev = prev.replace(htmlInner,'');
                    // prev = prev.replace(blockEnd,'<br />');
                    // prev = prev.replace(blockEndInner,'<br />');
                    // var atReg = /<input(?:[^>]*)?(?:class="_at_emp"(?:[^>]*)?at="([\w]+)"|at="([\w]+)"(?:[^>]*)?class="_at_emp")(?:[^>]*)\/*>/gi;
                    // prev = prev.replace(innerBegin,function(h,tag){
                    // if(tag === 'img'){
                    // return h;
                    // }
                    // if(tag === 'input'){
                    // if(h.match(atReg)){
                    // return h;
                    // }
                    // return '';
                    // }
                    // return '';
                    // });
                    // prev = prev.replace(innerEnd,'');
                    // prev = prev.replace(trimBlank,'');
                    // prev = prev.replace(blanks,function(){
                    // return '<br';
                    // });
                    // 删除除表情外其他img标签
                    // var imgReg = /<img(?:.*?)src="?([^">]*)"?(?:.*?)\/*>/gi;
                    // var spacer = /images\/spacer.gif/;
                    // str = str.replace(imgReg,function(v1,v2){
                    // return spacer.test(v2)? v1 : '';
                    // });
                    str = util.faceToFont(str);
                    str = util.faceToImg(str);
                    str = util.emojiFaceToImg(str);
                    str = str.replace(/<(?!br|img|input)[\s\S]*?>/g, '');
                    var finalHtml = str;
                    finalHtml = finalHtml.replace(/&nbsp;/g, " ");
                    var anybr = /(\s*<br\s*\/*>\s*\n*)+/gi;
                    finalHtml = finalHtml.replace(anybr, '<br />');
                    finalHtml = util.convertAtFromMob(finalHtml);

                    finalHtml = finalHtml.replace(/draggable="false"/g, function (v) {
                        return '';
                    });
                    finalHtml = finalHtml.replace(/\n/g, '<br />');
                    // dom.innerHTML = finalHtml;
                    var startBr = /^<br\s*\/*>|<br\s*\/*>$/gi;
                    finalHtml = finalHtml.replace(startBr, function (v) {
                        return '';
                    });
                    return finalHtml;
                    // var helper = $ele.find('#pos_hepler')[0] , range , selection;
                    // console.log(helper);
                    // if(helper){
                    // if(document.createRange){
                    // range = document.createRange();
                    // range.setStartAfter(helper);
                    // range.collapse(false);
                    // selection = window.getSelection();
                    // selection.removeAllRanges();
                    // selection.addRange(range);
                    // }else{
                    // if(document.selection){
                    // range = document.body.createTextRange();
                    // range.moveToElementText(helper);
                    // range.collapse(false);
                    // range.select();
                    // }
                    // }
                    // helper.parentNode.removeChild(helper);
                    // $ngModel.$setViewValue(prev + str  + last);
                    // }
                }
            }
            $ele.bind('paste', fn);
            $ele.bind('copy', function (e, isCut) {
                // var oe = e.originalEvent;
                // var clipboardData = oe.clipboardData
                var selection = document.getSelection();
                if (selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);
                    var dom = range.cloneContents();
                    var div = document.createElement('div');
                    div.appendChild(dom);
                    var splitedContent = [];
                    $scope.splitContent(div, splitedContent, true);
                    for (var i = splitedContent.length - 1; i >= 0; i--) {
                        if (!splitedContent[i]) {
                            splitedContent.splice(i, 1);
                        }
                    }
                    if (!div.innerHTML) return;
                    var res = util.copyDom(div.innerHTML);
                    // clipboardData.setData("text/html", res.html);
                    // clipboardData.setData("text/plain", res.text);
                    if (splitedContent.length == 1) {
                        if (typeof splitedContent[0] == 'string') {
                            frameService.copy({
                                html: res.html,
                                text: res.text
                            });
                        } else {
                            div.innerHTML = res.html;
                            var src = '';
                            $(div).find('img').each(function () {
                                src = this.src;
                                $(this).removeClass('select_img');
                            })
                            src = src.replace(/^file:\/\/\//, '');
                            frameService.copy({
                                html: res.html,
                                text: langPack.getKey('img'),
                                imagePath: decodeURIComponent(src)
                            });
                        }
                    } else {
                        frameService.copy({
                            html: res.html,
                            text: res.text
                        });
                    }
                    div = null;
                    if (isCut) {
                        range.deleteContents();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
                return false;
            });
            var _oldRender = $ngModel.$render;
            $ngModel.$render = function () {
                _oldRender && _oldRender();
                $ele.html() != $ngModel.$viewValue && $ele.html($ngModel.$viewValue || "");
            }
        }
    }
}]);

directives.directive('onFinishRender', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var val = element.attr('on-finish-render');
            var renderData = element.attr('render-data');
            if (scope.$first === true) {
                // console.time('begin')
            }
            if (scope.$last === true) {
                // console.timeEnd('begin')
                $timeout(function () {
                    scope.$emit('ngRepeatFinished', val, renderData);
                });
            }
        }
    }
}]);
directives.directive('hotKey', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ngModel) {
            element.bind('keydown', function (e) {
                scope.hotKeyEdit(e);
                ngModel.$setViewValue(this.value);
                $timeout(function () {
                    scope.checkSameWithOther();
                })
            });
            element.bind('focus', function (e) {
                var val = this.value;
                if (val != '') {
                    this.setAttribute('setable', '0');
                }
            });
            element.bind('keyup', function (e) {
                scope.keyup(e);
                ngModel.$setViewValue(this.value);
                $timeout(function () {
                    scope.checkSameWithOther();
                })
            });
        }
    }
}]);
directives.directive("jqueryScrollbar", function () {
    return {
        restring: 'AC',
        link: function ($scope, $ele) {
            setTimeout(function () {
                $ele.scrollbar({
                    test: "test",
                    type: "simpble",
                    onScroll: function (t, o) {
                        $scope.$broadcast("onScroll", { y: t, x: o, target: $ele });
                    }, onUpdate: function () {
                        $scope.$broadcast("onUpdate", [].slice.call(arguments));
                        if ($scope.border) {
                            $ele.parent().addClass($scope.border);
                        }
                    }, onInit: function () {
                        $scope.$broadcast("onInit", [].slice.call(arguments));
                    }
                }).on("$destroy", function () {
                    $ele.scrollbar("destroy");
                });
            }, 0);
        }
    }
});
directives.directive('messageDirective', ["$document", "$compile", "$rootScope", '$timeout', 'webConfig', function ($doc, $compile, $rootScope, $timeout, webConfig) {
    return {
        restrict: "A",
        templateUrl: "message.html",
        link: function ($scope) {
        }
    }
}]);
directives.directive('concatDirective', ["$document", "$compile", "$rootScope", '$timeout', 'chatService', function ($doc, $compile, $rootScope, $timeout, chatService) {
    return {
        restrict: "A",
        templateUrl: "chatConcat.html",
        link: function ($scope) {
            var chat = $scope.chat;
            $scope.hasName = function (chat) {
                if (chat.Name || chat.TempName) {
                    return true;
                }
                return false;
            }
        }
    }
}]);
directives.directive('serviceConcatDirective', ["$document", "$compile", "$rootScope", '$timeout', function ($doc, $compile, $rootScope, $timeout) {
    return {
        restrict: "A",
        templateUrl: "serviceConcat.html",
        link: function ($scope) {
            $scope.hasName = function (chat) {
                if (chat.name || chat.tempName) {
                    return true;
                }
                return false;
            }
        }
    }
}]);
directives.directive('cusRepeat', ["$document", "$compile", "$rootScope", '$timeout', 'empService', 'webConfig', function ($doc, $compile, $rootScope, $timeout, empService, webConfig) {
    var bufferHeight = 300;
    function resetBuffer(scope, scroll, list, allList, callback) {
        var idx = 0;
        var len = allList.length;
        for (var i = 0; i < len; i++) {
            if (allList[i]._h) {
                idx++;
                if (idx == len) {
                    setTimeout(function () {
                        callback && callback();
                    }, 0)
                }
            } else {
                scope.heightCalc(allList[i], (function (i) {
                    return function (h) {
                        idx++;
                        if (allList[i]) {
                            allList[i]._h = h;
                            allList[i].index = i;
                            if (idx == len) {
                                setTimeout(function () {
                                    callback && callback();
                                }, 0)
                            }
                        }
                    }
                })(i));
            }
        }
    }
    function compute(list, idx, fm, to) {
        if (!list.length) {
            return {
                index: 0,
                total: 0
            }
        }
        var total = 0, _temp;
        for (var i = idx; i < list.length; i++) {
            _temp = total;
            total += list[i]._h;
            if (total + fm > to) {
                return {
                    index: i,
                    total: _temp
                };
            }
        }
        return {
            index: list.length - 1,
            total: total
        }
    }

    function render(scope, allList, list, scroll) {
        var topHeight = 0, bottomHeight = 0;
        var topHolder = scroll.scroll - scope.bufferHeight;
        var bottomHolder = scroll.scroll + scroll.visible + scope.bufferHeight;
        var temp = [];
        var start = 0, end = 0;
        if (topHolder > 0) {
            var res = compute(allList, 0, 0, topHolder);
            start = res.index;
            topHolder = res.total;
        } else {
            start = 0;
            topHolder = 0;
        }
        end = compute(allList, start, topHolder, bottomHolder).index;
        end = end >= allList.length ? allList.length - 1 : end;
        temp = allList.slice(start, end + 1);
        if (temp.length) {
            for (var i = 0; i < allList.length; i++) {
                if (i > end) {
                    bottomHeight += allList[i]._h;
                }
                if (i < start) {
                    topHeight += allList[i]._h;
                }
            }
        } else {
            for (var i = 0; i < allList.length; i++) {
                bottomHeight += allList[i]._h;
            }
        }

        var obj = {
            scroll: scroll,
            topHolder: topHolder,
            bottomHolder: bottomHolder,
            topHeight: topHeight,
            bottomHeight: bottomHeight,
            start: start,
            end: end,
            tempLength: temp.length,
            allListLength: allList.length
        }
        scope.bottomHeight = bottomHeight;
        scope.topHeight = topHeight;
        list.length = 0;
        for (var i = 0; i < temp.length; i++) {
            if (scope.whenShowDom) {
                scope.whenShowDom(temp[i], temp);
            }
        }
        [].push.apply(list, temp);
    }
    function setOffsetTop(arr) {
        var total = 0;
        for (var i = 0; i < arr.length; i++) {
            arr[i]._offsetTop = total;
            total += arr[i]._h;
        }
    }
    function isAllCompute(list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i]._h === undefined) {
                return false;
            }
        }
        return true;
    }
    function setHeight(scope, list) {
        for (var i = 0; i < list.length; i++) {
            list[i]._h = scope.heightCalc(list[i]);
        }
    }
    return {
        restrict: "EA",
        scope: true,
        priority: 1e3,
        terminal: true,
        link: function (scope, ele, attr) {
            var allList = [];
            scope[attr.list] = [];
            var str = '<div ng-style="{height:topHeight}" class="top-placeholder"></div><div ng-repeat="' + attr.cusRepeat + '">' + ele.html() + '</div><div ng-style="{height:bottomHeight}" class="bottom-placeholder"></div>';
            str = $compile(str)(scope);
            ele.html('');
            ele.html(str);
            scope.bufferHeight = parseInt(attr.bufferHeight) || bufferHeight;
            var scrollInfo = {
                maxScroll: 0,
                scroll: 0,
                size: 0,
                visible: 601
            };
            var tar = [];
            scope.$on('onScroll', function (t, o) {
                if (o.y.maxScroll < 0) {
                    return;
                }
                var oldY = scrollInfo.scroll;
                scrollInfo = o.y;
                if (oldY < o.y.scroll && o.y.scroll >= o.y.maxScroll - 10) {
                    attr.onScrollEnd && scope.$parent[attr.onScrollEnd]();
                } else {
                    tar = o.target;
                    if (ele.parent()[0] != tar[0]) return;
                    if (isAllCompute(allList)) {
                        render(scope, allList, scope[attr.list], scrollInfo);
                        try {
                            scope.$digest();
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        resetBuffer(scope, scrollInfo, scope[attr.list], allList, function () {
                            render(scope, allList, scope[attr.list], scrollInfo);
                            try {
                                scope.$digest();
                            } catch (e) {
                                console.log(e);
                            }
                        });
                    }
                }
            });
            scope.$parent.$watch(attr.heightCalc, function (t) {
                'function' == typeof t && (scope.heightCalc = t);
            });
            if (attr.height) {
                scope.heightCalc = function (obj) {
                    return parseInt(attr.height);
                }
            }
            if (attr.whenShowDom) {
                scope.whenShowDom = scope.$parent[attr.whenShowDom];
            }
            scope.$parent.$watchCollection(attr.list, function (list) {
                allList = list;
                if (!list.length) {
                    scope[attr.list].length = 0;
                    scope.$emit('ngRepeatFinished', ele);
                } else {
                    for (var i = 0; i < list.length; i++) {
                        list[i].index = i;
                    }
                    if (!attr.preCalc) {
                        setHeight(scope, allList);
                        setOffsetTop(allList);
                        render(scope, allList, scope[attr.list], scrollInfo);
                    } else {
                        resetBuffer(scope, scrollInfo, scope[attr.list], allList, function () {
                            setOffsetTop(allList);
                            render(scope, allList, scope[attr.list], scrollInfo);
                            try {
                                scope.$digest();
                            } catch (e) {
                                console.log(e);
                            }
                            scope.$emit('ngRepeatFinished', ele);
                        });
                    }
                }
            })
        }
    }
}])
directives.directive('serviceChatName', ['pops', 'empService', '$timeout', '$rootScope', 'chatService', function (pops, empService, $timeout, $rootScope, chatService) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            chat: '='
        },
        template: '<p class="emp_name">{{chatName}}</p>',
        link: function ($scope, $ele) {
            $scope.chatName = '';
            if ($scope.chat.id && chatService.isNotifyChat($scope.chat.id)) {
                $scope.status = 'online';
                var chat = chatService.getChat($scope.chat.id);
                $scope.chat = chat;
                $scope.$watch('chat.members.length', function () {
                    for (var i = 0; i < chat.members.length; i++) {
                        if (chat.members[i].isAdmin) {
                            $scope.chatName = chat.members[i].SEmpName;
                            chat.name = chat.members[i].SEmpName;
                        }
                    }
                })
                return;
            }
        }
    }
}]);
directives.directive('errSrc', ['webConfig', 'empService', function (webConfig, empService) {
    return {
        link: function ($scope, ele, attr) {
            var time = 0;
            var reg = /\?_=\w+/g;
            ele.bind('error', function () {
                time++;
                if (attr.src != attr.errSrc) {
                    setTimeout(function () {
                        if (time >= 3) {
                            ele.unbind('error');
                            return;
                        }
                        attr.$set('src', attr.src.replace(reg, '') + '?_=' + new Date().getTime());
                    }, 200);
                }
            });
        }
    }
}]);
// directives.directive('errImgMsg',['webConfig','empService',function(webConfig,empService){
// return {
// link : function($scope,ele,attr){
// ele.bind('error', function() {
// attr.$set('src','img/emptyShow.png');
// ele.unbind('error');
// });
// }
// }
// }]);
directives.directive('empAvatar', ['pops', 'empService', 'socketConnect', '$timeout', '$rootScope', 'chatService', 'webConfig', 'concatService', 'frameService', function (pops, empService, socketConnect, $timeout, $rootScope, chatService, webConfig, concatService, frameService) {
    function createAvatarUrl(emp) {
        var _url = '';
        if (!emp) {
            return webConfig.MAN;
        }
        var userId = emp.SUserId;
        var serviceReg = /^s_.*/;
        var isService = serviceReg.test(userId);
        var pix = isService ? webConfig.SERVICE_AVATAR_PIFX : webConfig.USER_AVATAR_PIFX;
        if (emp.SAvatar) {
            _url = emp.SAvatar.indexOf('http://') == -1 ? pix + emp.SAvatar : emp.SAvatar;
        } else {
            _url = emp.SSex == '男' || !emp.SSex ? webConfig.MAN : webConfig.WOMEN;
        }
        return _url + '?_=' + emp.SAvatarMd5;
    }
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            avatar: '=',
            emp: '=',
            ischat: '=',
            action: '@',
            cache: '@',
            isGroup: '@'
        },
        template: '<img draggable="false" ng-src="{{emp.Avatar}}"  ng-class="status"  err-src=""/>',
        link: function ($scope, $ele) {
            var currentUser = webConfig.getUser();
            // 父级scope销毁时，给img增加样式，以便在chatupdate时修改图片路径
            $scope.$on('$destroy', function () {
                $ele.addClass($scope.emp.UserId || $scope.emp.Id);
            })

            $scope.$watch('emp', function (v, o) {
                if (v && o && v != o) {
                    var vid = v.UserId || v.Id;
                    var oid = o.UserId || o.Id;
                    if (vid != oid) {
                        refreshAvatar();
                    }
                } else if (v && !o) {
                    refreshAvatar();
                }
            })

            function refreshAvatar() {
                $timeout(function () {
                    var currentUser = webConfig.getUser();
                    var userId = $scope.emp.UserId || $scope.emp.Id;
                    if ($scope.emp.Avatar) {
                        var reg = /\?_=\w+/g;
                        $scope.emp.Avatar = $scope.emp.Avatar.replace(/\\/g, '/').replace(reg, '') + '?_=' + ($scope.emp.AvatarMD5 || new Date().getTime());
                        // $scope.emp.Avatar = $scope.emp.Avatar.replace(/\\/g,'/');
                    } else {
                        $scope.emp.Avatar = 'img/defaultHeadImage.jpg';
                    }
                    if (currentUser.Id == userId) {
                        $scope.status = 'online';
                        return;
                    }
                    if ($scope.emp.IMStatus == 5) {
                        if (!$scope.isGroup) {
                            $scope.status = 'offline';
                        }
                    } else {
                        $scope.status = 'online';
                    }
                });
            }
            $scope.$on('chatUpdated', function (e, res) {
                var userId = $scope.emp.UserId || $scope.emp.Id;
                if (userId) {
                    if (userId == res.Data.Id) {
                        $scope.emp.IMStatus = res.Data.IMStatus;
                        $scope.emp.Avatar = res.Data.Avatar;
                        refreshAvatar();
                    }
                }
            });
            $scope.status = 'online';
            if ($scope.emp) {
                if ($scope.emp.AvatarMD5) {
                    var reg = /\?_=\w+/g;
                    $scope.emp.Avatar = $scope.emp.Avatar.replace(/\\/g, '/').replace(reg, '') + '?_=' + ($scope.emp.AvatarMD5);
                }
                var userId = $scope.emp.UserId || $scope.emp.Id;
                if (currentUser.Id == userId) {
                    $scope.status = 'online';
                } else {
                    if ($scope.emp.IMStatus == 5) {
                        if (!$scope.isGroup) {
                            $scope.status = 'offline';
                        }
                    } else {
                        $scope.status = 'online';
                    }
                }
            }


            if ($scope.action !== 'none') {
                $ele.bind('click', function () {
                    if ($scope.emp) {
                        frameService.open($scope.emp.Id,'profile.html',{
                            userId: $scope.emp.Id
                        }, 410, currentUser.Id == $scope.emp.Id ? 540 : 580, false, $scope.emp.Name, undefined, undefined, {
                            NewFormPerRequest: true
                        });
                    }
                    return false;
                })
            }
        }
    }
}]);
/**
directives.directive('groupAvatar',['pops','empService','$timeout','$rootScope','chatService','concatService','webConfig',function(pops,empService,$timeout,$rootScope,chatService,concatService,webConfig){
    function createAvatarUrl(emp){
        var _url = '';
        if(!emp){
            return webConfig.MAN;
        }
        if(emp.SAvatar){
            _url = emp.SAvatar.indexOf('http://') == -1 ? webConfig.USER_AVATAR_PIFX + emp.SAvatar : emp.SAvatar;
        }else{
            _url = emp.SSex == '男' || !emp.SSex ? webConfig.MAN : webConfig.WOMEN;
        }
        return _url;
    }
    return {
        restrict: 'EA',
        replace : true,
        scope : {
            gid : '=',
            size : '=',
            cache : '='
        },
        // template : '<div class="group_avatar cls{{members.length}}"></div>',
        templateUrl : 'groupAvatar.html',
        link : function($scope,$ele){
            $scope.members = [];
            $scope.members1 = [];
            $scope.members2 = [];
            $scope.createAvatarUrl = createAvatarUrl;
            var id = $scope.gid;
            $scope.$on('getLastestEmpInfo',function(ev,emp){
                for(var i=0;i<$scope.members.length;i++){
                    if($scope.members[i].SUserId == emp.SUserId){
                        // refresh(id);
                    }
                }
            })
            function refresh(id){
                if(chatService.isExist(id)){
                    var chat = chatService.getChat(id);
                    if(chat.Members && chat.Members.length){
                        splitMembers(chat);
                        return;
                    }
                }
                var loginUser = webConfig.getUser();
                concatService.getConcatList().then(function(v){
                    var groups = v.groupList || [];
                    var chat = {};
                    chat.members = [];
                    var group;
                    for(var i=0;i<groups.length;i++){
                        if(groups[i].groupId == id){
                            group = groups[i];
                        }
                    }
                    if(group){
                        var members = group.members;
                        $scope.members.length = 0;
                        var isIn = false;
                        for(var i=0;i<members.length;i++){
                            if(members[i] == loginUser.SUserId){
                                isIn = true;
                            }
                            var emp = empService.getEmpInfo(members[i]);
                            chat.members.push(emp);
                            $scope.members.push(emp)
                        }
                        var owner = group.groupCreator;
                        owner = empService.getEmpInfo(owner);
                        // if(!isIn){
                            // chat.members.unshift(owner);
                            // $scope.members.unshift(owner);
                        // }
                        splitMembers(chat);
                    }
                });
            }
            function splitMembers(chat){
                $scope.members = angular.copy(chat.Members);
                console.log($scope.members)
                $scope.members.sort(function(v1,v2){
                    var name1 = v1.SShowName || v1.SEmpName || v1.SName;
                    var pinyin1 = util.getPinyin(name1);
                    var name2 = v2.SShowName || v1.SEmpName || v2.SName;
                    var pinyin2 = util.getPinyin(name2);
                    return pinyin1 > pinyin2;
                })
                var len = $scope.members.length;
                if(len == 2){
                    $scope.cls = 0;
                }
                if(len == 3 || len == 4){
                    $scope.cls = 1;
                }
                if(len == 5 || len == 6){
                    $scope.cls = 2;
                }
                if(len >= 7){
                    $scope.cls = 3;
                }
                $timeout(function(){
                    $scope.members1 = [];
                    $scope.members2 = [];
                    for(var i=0;i<len;i++){
                        if(i >= 9) break;
                        if((len == 3 || len == 7) && i == 0 || (len == 5 || len == 8) && i < 2){
                            $scope.members1.push($scope.members[i]);
                        }else{
                            $scope.members2.push($scope.members[i]);
                        }
                    }
                })
            }
            if($scope.cache == 0){
                $scope.$watch('gid',function(n){
                    refresh(n);
                })
            }
            refresh(id);
            // $scope.avatarUrl = getGroupImg(chat.members);
            $scope.$on('updateGroupAvatar' + id,function(ev,chatId){
                refresh(id);
            });
        }
    }
}]);
*/
directives.directive('copyHelper', ['$timeout', 'chatService', function ($timeout, chatService) {
    return {
        scope: {
            copyData: "&"
        },
        restrict: 'A',
        link: function (scope, element, attr) {
            var a = new ZeroClipboard(element);
            a.on('ready', function () {
                a.on('copy', function (t) {
                    var o = t.clipboardData;
                    o.setData("text", scope.copyData());
                })
            })
        }
    }
}]);
/*
directives.directive('deptTreeCreate',['$templateCache','$compile','$rootScope','empService','webConfig','$timeout',function($templateCache,$compile,$rootScope,empService,webConfig,$timeout){
    var jel = angular.element;
    return {
        restrict : 'EA',
        // scope : {
            // dept : '='
        // },
        templateUrl : 'dept.html',
        // controller : 'deptTreeController',
        link : function($scope,$elem,$attrs){
            $scope.paddingLeft = 20 * $scope.dept.level + 'px';
            if($scope.dept.showChild){
                if(!$scope.dept.childCreate){
                    var branch = jel($templateCache.get('childDept.html'));
                    branch.find('.branch').attr('dept-tree-create','dept-tree-create')
                    $compile(branch)($scope);
                    $elem.find('.dept_name').after(branch);
                    $scope.dept.childCreate = true;
                    $elem.find('.dept_name').remove();
                }
            }
            $scope.toggle = function(dept){
                if(dept.SParentId == '0'){
                    var entId = dept.SEntId;
                    empService.getEntInfo(entId).then(function(data){
                        var res = data.data.entInfo[0];
                        if(res){
                            var url = res.SLogo.indexOf('http://') == -1 ? webConfig.ENT_AVATAR_PIFX + res.SLogo : res.SLogo;
                            var entLogoUrl = res.SLogo ? url : 'images/group_img_large.png';
                            $scope.$emit('updateSelectEntLogo',entLogoUrl);
                        }
                    });
                }
                dept.showChild = !dept.showChild;
                if(!dept.childCreate){
                    var branch = jel($templateCache.get('childDept.html'));
                    branch.find('.branch').attr('dept-tree-create','dept-tree-create')
                    $compile(branch)($scope);
                    $elem.find('.dept_name').after(branch);
                    dept.childCreate = true;
                    $elem.find('.dept_name')
                }
                var emails = empService.getAllEmpsMail(dept);
                dept.empsEmails = emails.join(';');
                $scope.$emit('selectDept',dept);
                jel(".list_item").removeClass('item_active').addClass('block_active').find(".member_bg_active").removeClass('member_bg_active');
            }
            $scope.showDetail = function(dept,event){
                empService.getLastestEmpInfo(dept.SUserId).then(function(data){
                    var emp = data.data.userInfo;
                    for(var p in emp){
                        dept[p] = emp[p];
                    }
                    var emps = empService.getEmpInfoFromEnt(dept.entId,dept.SLeader);
                    dept.leader = emps.length ? emps[0] : {};
                    $scope.$emit('selectDept',dept);
                    jel(".list_item").removeClass('item_active').addClass('block_active');
                    jel(event.currentTarget).addClass('item_active').removeClass('block_active');
                })
            }
        }
    }
}]);


directives.directive('deptPicker',['$templateCache','$compile','$rootScope',function($templateCache,$compile,$rootScope){
    var jel = angular.element;
    return {
        restrict : 'EA',
        require : '?ngModel',
        // scope : {
            // dept : '='
        // },
        templateUrl : 'dept_picker.html',
        // controller : 'empChooserController',
        link : function($scope,$elem,$attrs){
            $scope.paddingLeft = $scope.dept.level * 20;
            if($scope.dept.showChild){
                if(!$scope.dept.childCreate){
                    var branch = jel($templateCache.get('childDept_picker.html'));
                    branch.find('.branch').attr('dept-picker','dept-picker')
                    $compile(branch)($scope);
                    $elem.find('.dept_name').parent().after(branch);
                    $scope.dept.childCreate = true;
                }
            }
            $scope.toggle = function(dept){
                dept.showChild = !dept.showChild;
                if(!dept.childCreate){
                    var branch = jel($templateCache.get('childDept_picker.html'));
                    branch.find('.branch').attr('dept-picker','dept-picker')
                    $compile(branch)($scope);
                    $elem.find('.dept_name').parent().after(branch);
                    dept.childCreate = true;
                }
            }

        }
    }
}]);
*/
directives.directive('stopBubble', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            })
        }
    }
}]);
/*
directives.directive('checkAdded',['concatService','empService','domain','webConfig','pops','langPack','$rootScope',function(concatService,empService,domain,webConfig,pops,langPack,$rootScope){
    var directive = {
        link : function($scope,$ele,$attrs){
            var reg = /^group_.*?_[\d.]+$/;
            $scope.userId = webConfig.getUser().userId;
            function resultCallback(res){
                !res && $ele.removeClass('added');
                if(res){
                    $ele.addClass('added');
                    $ele.attr('title',langPack.getKey('removeFrequents'));
                }else{
                    $ele.removeClass('added');
                    $ele.attr('title',langPack.getKey('addToFrequents'));
                }
            }
            
            $scope.$watch('concatId',function(newVal,oldVal){
                if(!newVal) return;
                concatService.isAdded(newVal,reg.test(newVal)).then(resultCallback);
            })
            $ele.bind('click',function(){
                if($ele.hasClass('added')){
                    if($scope.isGroup){
                        concatService.delGroup($scope.concatId).then(function(res){
                            $ele.removeClass('added');
                        });
                    }else{
                        // var emp = empService.getEmpInfo($scope.concatId);
                        concatService.delFrequents($scope.concatId).then(function(res){
                            $ele.removeClass('added');
                            // pops.closeAllPop();
                            $rootScope.$broadcast('delFrequenter',$scope.concatId);
                        });
                    }
                }else{
                    if($scope.isGroup){
                        concatService.addGroup($scope.concatId).then(function(res){
                            $ele.addClass('added');
                        });
                    }else{
                        concatService.addFrequents($scope.concatId).then(function(res){
                            $ele.addClass('added');
                            $rootScope.$broadcast('addFrequenter',$scope.concatId);
                        });
                    }
                }
            })
        }
    }
    return directive;
}]);
*/

directives.directive('previewImages', ['$document', '$timeout', 'langPack', 'frameService', 'util', '$document', function ($document, $timeout, langPack, frameService, util, $doc) {
    return {
        restrict: 'EA',
        templateUrl: 'imagePreviewContent.html',
        scope: {
            imageList: '=',
            current: '=',
            next: '&next',
            prev: '&prev'
        },
        link: function ($scope, $element) {
            $scope.langPack = langPack;
            var resizeTimer;
            var headerAndBottomHeight = 29;
            var shadowWidth = 20;
            var resetingFrame = false;
            window.onresize = function () {
                if (resetingFrame) return;
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    webWidth = document.documentElement.clientWidth, webHeight = document.documentElement.clientHeight;
                    totalWidth = document.documentElement.clientWidth;
                    totalHeight = document.documentElement.clientHeight - headerAndBottomHeight;
                    maxWidth = 1 * totalWidth - shadowWidth;
                    maxHeight = 1 * totalHeight - shadowWidth;
                    canvas.width = totalWidth;
                    canvas.height = totalHeight;
                    loadImage(true);
                }, 1);
            }
            $scope.rotateDeg = 0;
            $scope.loaded = 0;
            $scope.sourceSize = false;
            $scope.flag = false;
            $scope.isGif = false;
            var conCss = {}, zoom = .5;
            var imgSize = {};
            // var imgList = $scope.imageList;
            var webWidth = document.documentElement.clientWidth, webHeight = document.documentElement.clientHeight;
            var screenSize = util.getNewSize(1, 1);
            var totalWidth = webWidth, totalHeight = webHeight - headerAndBottomHeight;
            var maxWidth = 1 * totalWidth - shadowWidth, maxHeight = 1 * totalHeight - shadowWidth;
            var maxZoom = 10, zoomDelta = .1;
            var container = $('#img_parent'), rootDom = $('#image_preview_root'), canvas = $('#img_preview_dom')[0];
            var thumbImg = $('#thumb_img');
            var ctx = canvas.getContext('2d');
            var thumbCanvas = $('#thumb_canvas')[0];
            var tctx = thumbCanvas.getContext('2d');
            // window.canvas = canvas;
            canvas.width = totalWidth;
            canvas.height = totalHeight;
            var wrap = container.parent();
            var isMoz = document.mozHidden !== undefined, scrollEvent = navigator.userAgent.indexOf('Firefox') != -1 ? 'DOMMouseScroll' : 'mousewheel';
            var mask = $('<div></div>').appendTo(container), lastMousePos;
            var lastCanvasPoint = {};
            mask.css({
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // background:'rgba(255,0,0,.5)'
            });
            $doc.keyup(function (e) {
                if (e.keyCode == util.KEYMAP.LEFT) {
                    $scope.prevImg();
                }
                if (e.keyCode == util.KEYMAP.RIGHT) {
                    $scope.nextImg();
                }
            })
            var lastZoom = {};
            wrap.bind(scrollEvent, function (e) {
                if ($('.thumb_wrap').find(e.target).size()) return;
                var oe = e.originalEvent;
                var change = oe.wheelDelta ? oe.wheelDelta / 120 : -(oe.detail || 0) / 3;
                if (change != 0) {
                    var zoomData = {
                        delta: change,
                        zoomLeft: oe.target == mask[0] ? (oe.offsetX / conCss.width) : .5,
                        // zoomLeft : oe.target == mask[0] ? (oe.offsetX / conCss.width) : .1(lastZoom.change != change ? lastZoom.zoomLeft : .1),
                        // zoomTop : oe.target == mask[0] ? ((oe.offsetY) / conCss.height) : .1(lastZoom.change != change ? lastZoom.zoomTop : .1)
                        zoomTop: oe.target == mask[0] ? (oe.offsetY / conCss.height) : .5
                    }
                    zoomData.zoomLeft = zoomData.zoomLeft || .5;
                    zoomData.zoomTop = zoomData.zoomTop || .5;
                    $scope.sourceSize = true;
                    resetSize(zoomData, function () {
                        lastZoom = zoomData;
                        if (change > 0) {
                            resetFrameFn();
                        } else {
                            drawImage();
                            container.css(conCss);
                        }
                    }, 1);
                }
                e.preventDefault();
                e.stopPropagation();
            })
            wrap.bind('mousemove', function (e) {
                if (e.clientX < totalWidth * .2) {
                    $('.quick_prev').show();
                } else {
                    $('.quick_prev').hide();
                }
                if (e.clientX > totalWidth * .8) {
                    $('.quick_next').show();
                } else {
                    $('.quick_next').hide();
                }
                if (e.clientY > totalHeight - 20) {
                    $('.img_oper').show();
                } else {
                    $('.img_oper').hide();
                }
            })

            var draging = false;
            mask.bind('mousedown', function (e) {
                lastMousePos = {
                    left: e.clientX,
                    top: e.clientY
                }
                draging = true;
            })
            document.addEventListener('mousemove', repos, false);
            $('body').bind('mouseup', function (e) {
                lastMousePos = undefined;
                draging = false;
                // document.removeEventListener('mousemove',repos);
            })
            $('body').bind('mouseleave', function (e) {
                lastMousePos = undefined;
                draging = false;
                $('.quick_prev').hide();
                $('.quick_next').hide();
                $('.img_oper').hide();
                // document.removeEventListener('mousemove',repos);
                return false;
            });
            function isInteger(obj) {
                return obj % 1 === 0;
            }
            function fixed(num) {
                num = parseFloat(num);
                if (isInteger(num)) {
                    return num;
                } else {
                    return Math.floor(num * 100) / 100;
                }
            }
            var timer;
            $scope.$watch('scale', function (v) {
                if (v == 0) return;
                $scope.showScale = true;
                if (timer) {
                    $timeout.cancel(timer);
                }
                timer = $timeout(function () {
                    $scope.showScale = false;
                }, 500)
            })
            function repos(e, change) {
                if (!draging) return;
                if (!lastMousePos && !change) return;
                if (!change) {
                    change = {
                        left: e.clientX - lastMousePos.left,
                        top: e.clientY - lastMousePos.top
                    }
                }
                var _left = conCss.left + change.left;
                var _top = conCss.top + change.top;
                if (totalWidth - _left <= 20 || totalHeight - _top <= 20 || conCss.width + _left <= 20 || conCss.height + _top <= 20) {
                    return;
                }
                conCss.left = _left;
                conCss.top = _top;

                container.css(conCss);
                drawImage();
                if (e) {
                    lastMousePos.left = e.clientX;
                    lastMousePos.top = e.clientY;
                }
            }
            function resetSize(s, callback, resetContainerCss) {
                var temp, tempx = 1, tempy = 1;
                if (s.scale) {
                    temp = s.scale;
                } else {
                    var delta = s.delta;
                    temp = conCss.scale;
                    temp = delta > 0 ? temp + zoomDelta : temp - zoomDelta;
                    tempx = s.zoomLeft;
                    tempy = s.zoomTop;
                }
                temp = temp > maxZoom ? maxZoom : 1 / maxZoom > temp ? 1 / maxZoom : temp;
                var newSize = {
                    width: Math.round(imgSize.width * temp),
                    height: Math.round(imgSize.height * temp),
                    scale: temp
                }
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    newSize.width = Math.round(imgSize.height * temp)
                    newSize.height = Math.round(imgSize.width * temp)
                }
                if (s.scale) {
                    newSize.left = (totalWidth - newSize.width) / 2;
                    newSize.top = (totalHeight - newSize.height) / 2;
                } else {
                    newSize.left = conCss.left + (conCss.width - newSize.width) * tempx;
                    newSize.top = conCss.top + (conCss.height - newSize.height) * tempy;
                }
                if (totalWidth - newSize.left <= 20 || totalHeight - newSize.top <= 20 || newSize.width + newSize.left <= 20 || newSize.height + newSize.top <= 20) {
                    return;
                }
                conCss = newSize;
                if (resetContainerCss === undefined) {
                    container.css(conCss);
                }
                callback && callback();
                $timeout(function () {
                    $scope.scale = fixed(conCss.scale);
                })
            }
            var image;
            function loadImage(notRefresh) {
                $scope.boundaryTip = '';
                var idx = $scope.$parent.current;
                image = new Image();
                !notRefresh && ($scope.loaded = 0);
                image.onload = function () {
                    if (notRefresh) {
                        resetSize({ scale: conCss.scale });
                        drawImage();
                        return;
                    }
                    conCss = {
                        width: this.width,
                        height: this.height,
                        scale: 1,
                        top: (totalHeight - this.height) / 2,
                        left: (totalWidth - this.width) / 2
                    }
                    imgSize.width = this.width;
                    imgSize.height = this.height;
                    var hp = maxHeight / this.height, wp = maxWidth / this.width;
                    var _scale = fixed(conCss.scale);
                    if (1 > hp && 1 > wp) {
                        resetSize({ scale: Math.min(hp, wp) });
                    } else {
                        if (1 > hp) {
                            resetSize({ scale: hp });
                        } else {
                            if (1 > wp) {
                                resetSize({ scale: wp });
                            } else {
                                container.css(conCss);
                            }
                        }
                    }
                    drawImage();
                    $timeout(function () {
                        $scope.scale = fixed(conCss.scale);
                        $scope.loaded = 1;
                    })
                    this.onload = null;
                    $scope.thumbBg = null;
                }
                image.onerror = function () {
                    // alert(langPack.getKey('imageError'));
                    $timeout(function () {
                        $scope.loaded = 2;
                        $scope.boundaryTip = '';
                    })
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    this.error = null;
                }
                // document.body.appendChild
                // if(idx !== undefined){
                // image.src = $scope.$parent.imageList[idx].filePath;
                // }else{
                // image.src = $scope.$parent.currentImg;
                // }
                image.src = $scope.$parent.currentImg;
                $timeout(function () {
                    $scope.isGif = util.isGif(image.src);
                })
                // console.log(image.src);
                $('#source_img,#thumb_img').attr('src', image.src);
                thumbImg.attr('src', image.src);
                if ($scope.$parent.current != undefined) {
                    $scope.thisImagePos = ($scope.$parent.currentPage) + '/' + ($scope.$parent.totalCount);
                }
            }
            loadImage();
            $scope.$on('parentReady', function () {
                $timeout(function () {
                    if ($scope.$parent.current != undefined) {
                        $scope.thisImagePos = ($scope.$parent.currentPage) + '/' + ($scope.$parent.totalCount);
                    }
                })
            });
            $scope.$on('clearCanvas', function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                image = new Image();
                $timeout(function () {
                    $scope.loaded = 4;
                    $scope.boundaryTip = langPack.getKey('imageWasWithDrawBySender');
                })
            })
            $scope.roate = function (s) {
                $scope.rotateDeg = ($scope.rotateDeg + s) % 360;
                if ($scope.rotateDeg < 0) {
                    $scope.rotateDeg = $scope.rotateDeg + 360;
                }
                $scope.needCovert = $scope.rotateDeg == 90 || $scope.rotateDeg == 270;
                $scope.flag = !$scope.flag;
                conCss = {
                    width: imgSize.width,
                    height: imgSize.height,
                    scale: 1,
                    top: (totalHeight - imgSize.height) / 2,
                    left: (totalWidth - imgSize.width) / 2
                }
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    var hp = maxHeight / imgSize.width, wp = maxWidth / imgSize.height;
                    conCss.width = imgSize.height;
                    conCss.height = imgSize.width;
                    conCss.top = (totalHeight - conCss.height) / 2;
                    conCss.left = (totalWidth - conCss.width) / 2;
                } else {
                    var hp = maxHeight / imgSize.height, wp = maxWidth / imgSize.width;
                }
                if (1 > hp && 1 > wp) {
                    resetSize({ scale: Math.min(hp, wp) });
                } else {
                    if (1 > hp) {
                        resetSize({ scale: hp });
                    } else {
                        if (1 > wp) {
                            resetSize({ scale: wp });
                        } else {
                            container.css(conCss);
                            $timeout(function () {
                                $scope.scale = fixed(conCss.scale);
                            })
                        }
                    }
                }
                lastTrans = '';
                container.css(conCss);
                drawImage();
            }
            function drawImage() {
                var x = canvas.width / 2; //画布宽度的一半
                var y = canvas.height / 2;//画布高度的一半
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate($scope.rotateDeg * (Math.PI / 180));//旋转角度
                ctx.translate(-x, -y);
                var point = convertPoint(totalWidth, totalHeight, conCss.width, conCss.height, conCss.left, conCss.top);
                // console.log(point,totalWidth,totalHeight,conCss.width,conCss.height,conCss.left, conCss.top);
                // ctx.strokeStyle = '#ff0000';
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    ctx.drawImage(image, point.x, point.y, conCss.height, conCss.width);
                    // ctx.strokeRect(point.x,point.y,conCss.height,conCss.width);
                } else {
                    ctx.drawImage(image, point.x, point.y, conCss.width, conCss.height);
                    // ctx.strokeRect(point.x,point.y,conCss.width,conCss.height);
                }
                resetThumbStyle(point);
                ctx.restore();
            }
            function getAutoFixSize(maxw, maxh, imgw, imgh) {
                var res = {
                    width: imgw,
                    height: imgh,
                    scale: 1,
                    top: Math.floor((maxh - imgh) / 2),
                    left: Math.floor((maxw - imgw) / 2)
                }
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    var hp = maxh / imgw, wp = maxw / imgh;
                    res.width = imgh;
                    res.height = imgw;
                    res.top = Math.floor((maxh - imgh) / 2);
                    res.left = Math.floor((maxw - imgw) / 2);
                } else {
                    var hp = maxh / imgh, wp = maxw / imgw;
                }
                if (1 > hp && 1 > wp) {
                    return resetSizeThumb({ scale: Math.min(hp, wp) }, maxw, maxh, imgw, imgh);
                } else {
                    if (1 > hp) {
                        return resetSizeThumb({ scale: hp }, maxw, maxh, imgw, imgh);
                    } else {
                        if (1 > wp) {
                            return resetSizeThumb({ scale: wp }, maxw, maxh, imgw, imgh);
                        }
                    }
                }
                return res;
            }
            function resetSizeThumb(s, maxw, maxh, imgw, imgh) {
                var temp, tempx = 1, tempy = 1;
                temp = s.scale;
                // temp = temp > maxZoom ? maxZoom : 1 / maxZoom >temp ? 1 / maxZoom : temp;
                var newSize = {
                    width: Math.round(imgw * temp),
                    height: Math.round(imgh * temp),
                    scale: temp
                }
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    newSize.width = Math.round(imgh * temp)
                    newSize.height = Math.round(imgw * temp)
                }
                if (s.scale) {
                    newSize.left = Math.floor((maxw - newSize.width) / 2);
                    newSize.top = Math.floor((maxh - newSize.height) / 2);
                }
                return newSize;
            }
            function resetThumbStyle(pp) {
                var res = getAutoFixSize(100, 100, imgSize.width, imgSize.height);
                $('.toper').css(res);
                thumbImg.css(res)
                var x = thumbCanvas.width / 2; //画布宽度的一半
                var y = thumbCanvas.height / 2;//画布高度的一半
                tctx.clearRect(0, 0, thumbCanvas.width, thumbCanvas.height);
                tctx.save();
                tctx.translate(x, y);
                tctx.rotate($scope.rotateDeg * (Math.PI / 180));//旋转角度
                tctx.translate(-x, -y);
                var point = convertPoint(100, 100, res.width, res.height, res.left, res.top, true);
                // console.log(point,pp);
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    tctx.drawImage(image, point.x, point.y, res.height, res.width);
                    thumbImg.css({
                        width: res.height,
                        height: res.width
                    })
                } else {
                    tctx.drawImage(image, point.x, point.y, res.width, res.height);
                }
                tctx.restore();
                var left, right;
                var top, bottom;
                if (conCss.left < 0) {
                    var showWidth = conCss.width + conCss.left;
                    if (showWidth > totalWidth) {
                        var hiddenWidth = conCss.width + conCss.left - totalWidth;
                        var per = hiddenWidth / conCss.width;
                        right = per * res.width;
                        left = Math.abs(conCss.left) / conCss.width * res.width;
                    } else {
                        var per = showWidth / conCss.width;
                        right = 0;
                        left = Math.abs(conCss.left) / conCss.width * res.width;
                    }
                } else {
                    if (conCss.width + conCss.left > totalWidth) {
                        left = 0;
                        var hiddenWidth = conCss.width + conCss.left - totalWidth;
                        right = hiddenWidth / conCss.width * res.width;
                    } else {
                        left = right = 0;
                    }
                }
                $('#thumb_div').css({
                    left: left,
                    right: right,
                    width: 'auto'
                })
                if (conCss.top < 0) {
                    var showHeight = conCss.height + conCss.top;
                    if (showHeight > totalHeight) {
                        var hiddenHeight = conCss.height + conCss.top - totalHeight;
                        var per = hiddenHeight / conCss.height;
                        bottom = per * res.height;
                        top = Math.abs(conCss.top) / conCss.height * res.height;
                    } else {
                        var per = showHeight / conCss.height;
                        bottom = 0;
                        top = Math.abs(conCss.top) / conCss.height * res.height;
                    }
                } else {
                    if (conCss.height + conCss.top > totalHeight) {
                        top = 0;
                        var hiddenWidth = conCss.height + conCss.top - totalHeight;
                        bottom = hiddenWidth / conCss.height * res.height;
                    } else {
                        top = bottom = 0;
                    }
                }
                // console.log(mousePos)
                if (mousePos !== undefined || (conCss.left < -1 || conCss.top < -1 || conCss.width > totalWidth || conCss.height > totalHeight || conCss.left + conCss.width > totalWidth || conCss.top + conCss.height > totalHeight)) {
                    $('.thumb_wrap').css({
                        right: 0,
                        bottom: 40
                    });
                } else {
                    $('.thumb_wrap').css({
                        right: -10000,
                        bottom: -10000
                    });
                }
                $('#thumb_div').css({
                    top: top,
                    bottom: bottom,
                    height: 'auto'
                })
                createThumbImg(left, top, res.width, res.height, $('#thumb_div').width(), $('#thumb_div').height());
            }
            // var lastTrans;
            var coverCanvas = $('#cover_canvas')[0], coverCtx = coverCanvas.getContext('2d');
            function createThumbImg(x, y, w, h, width, height) {
                coverCanvas.width = w;
                coverCanvas.height = h;
                coverCanvas.style.opacity = '.5';
                coverCtx.fillStyle = "#000";
                coverCtx.fillRect(0, 0, w, h);
                // console.log(x,y,width+x,height+y)
                coverCtx.clearRect(x, y, width + 1, height + 1);
                return;
                /*
                x = x || 0 , y = y || 0;
                if(!lastTrans){
                    thumbImg.css({
                        transform : 'rotate(-'+$scope.rotateDeg+'deg)',
                    })
                    var offset = $('.toper').offset();
                    var offsetImg = thumbImg.offset();
                    lastTrans = {
                        x : offset.left - offsetImg.left + x,
                        y : offset.top - offsetImg.top + y
                    }
                    thumbImg.css({
                        transform : 'translateX('+(offset.left - offsetImg.left - x)+'px) translateY('+(offset.top - offsetImg.top - y)+'px) rotate('+$scope.rotateDeg+'deg)',
                    });
                }else{
                    thumbImg.css({
                        transform : 'translateX('+(lastTrans.x - x)+'px) translateY('+(lastTrans.y - y)+'px) rotate('+$scope.rotateDeg+'deg)',
                    });
                }
                */
            }
            var mousePos;
            $('#thumb_div').bind('mousedown', function (e) {
                mousePos = {
                    left: e.clientX,
                    top: e.clientY
                }
                document.addEventListener('mousemove', moveImgByThumb, false);
                return false;
            })
            $('body').bind('mouseup', function (e) {
                mousePos = undefined;
                document.removeEventListener('mousemove', moveImgByThumb);
                return false;
            })
            $('body').bind('mouseleave', function (e) {
                // console.log('--------')
                mousePos = undefined;
                document.removeEventListener('mousemove', moveImgByThumb);
                return false;
            });
            function moveImgByThumb(e) {
                // console.log(mousePos)
                if (!mousePos) return;
                var change = {
                    left: e.clientX - mousePos.left,
                    top: e.clientY - mousePos.top
                }
                var res = getAutoFixSize(100, 100, imgSize.width, imgSize.height);
                var x = conCss.width / res.width * -change.left;
                var y = conCss.height / res.height * -change.top;
                draging = true;
                repos(undefined, {
                    left: x,
                    top: y
                });
                if (e) {
                    mousePos.left = e.clientX;
                    mousePos.top = e.clientY;
                }
            }
            function convertPoint(mw, mh, w, h, left, top, isThumb) {
                var res = {};
                if ($scope.rotateDeg == 0) {
                    res = {
                        x: left,
                        y: top
                    }
                }
                if ($scope.rotateDeg == 90) {
                    var x = top;
                    var y = mw - w - left;
                    res = {
                        x: x,
                        y: y
                    }
                    res.x += (mw - mh) / 2;
                    res.y -= (mw - mh) / 2;
                }
                if ($scope.rotateDeg == 180) {
                    var x = mw - w - left;
                    var y = mh - h - top;
                    res = {
                        x: x,
                        y: y
                    }
                }
                if ($scope.rotateDeg == 270) {
                    var x = mh - top - h;
                    var y = left;
                    res = {
                        x: x,
                        y: y
                    }
                    res.x += (mw - mh) / 2;
                    res.y -= (mw - mh) / 2;
                }
                if (!isThumb) {
                    lastCanvasPoint = res;
                }
                res.x = parseInt(res.x);
                res.y = parseInt(res.y);
                return res;
            }

            $scope.goSourceSize = function () {
                if ($scope.loaded == 2) return;
                $scope.sourceSize = true;
                if ($scope.rotateDeg == 90 || $scope.rotateDeg == 270) {
                    conCss = {
                        width: imgSize.height,
                        height: imgSize.width,
                        scale: 1,
                        top: (totalHeight - imgSize.width) / 2,
                        left: (totalWidth - imgSize.height) / 2
                    }
                } else {
                    conCss = {
                        width: imgSize.width,
                        height: imgSize.height,
                        scale: 1,
                        top: (totalHeight - imgSize.height) / 2,
                        left: (totalWidth - imgSize.width) / 2
                    }
                }
                container.css(conCss);
                drawImage();
            }
            $scope.goScale = function () {
                if ($scope.loaded == 2) return;
                $scope.sourceSize = false;
                $scope.roate(0);
            }
            $scope.zoomOut = function (e) {
                if ($scope.loaded == 2) return;
                if (e) {
                    clickedDom = e.target;
                    _eventOffset.left = e.offsetX;
                    _eventOffset.top = e.offsetY;
                } else {
                    clickedDom = undefined;
                }
                $scope.sourceSize = true;
                var zoomData = {
                    delta: .1,
                    zoomLeft: .5,
                    zoomTop: .5
                }
                resetSize(zoomData, function () {
                    // lastZoom = zoomData;
                    resetFrameFn();
                });
            }
            $scope.zoomIn = function (e) {
                if ($scope.loaded == 2) return;
                if (e) {
                    clickedDom = e.target;
                    _eventOffset.left = e.offsetX;
                    _eventOffset.top = e.offsetY;
                } else {
                    clickedDom = undefined;
                }
                $scope.sourceSize = true;
                var zoomData = {
                    delta: -0.1,
                    zoomLeft: .5,
                    zoomTop: .5
                }
                resetSize(zoomData, function () {
                    // lastZoom = zoomData;
                    drawImage();
                });
            }
            // $scope.next = function(){
            // if($scope.current == imgList.length - 1) return;
            // $scope.sourceSize = false;
            // $scope.rotateDeg = 0;
            // $scope.current += 1;
            // loadImage();
            // }
            // $scope.prev = function(){
            // if($scope.current == 0) return;
            // $scope.sourceSize = false;
            // $scope.rotateDeg = 0;
            // $scope.current -= 1;
            // loadImage();
            // }
            var boundaryTimer;
            $scope.boundaryTip = '';
            // $scope.nextImg = function(){
            // $scope.$parent.next(function(tip){
            // if(tip){
            // if(boundaryTimer){
            // $timeout.cancel(boundaryTimer);
            // }
            // $scope.boundaryTip = tip;
            // boundaryTimer = $timeout(function(){
            // $scope.boundaryTip = '';
            // },1000);
            // return;
            // }
            // $timeout(function(){
            // $scope.boundaryTip = '';
            // $scope.sourceSize = false;
            // $scope.scale = 0;
            // })
            // loadImage();
            // })
            // }
            // $scope.prevImg = function(){
            // $scope.$parent.prev(function(tip){
            // if(tip){
            // if(boundaryTimer){
            // $timeout.cancel(boundaryTimer);
            // }
            // $scope.boundaryTip = tip;
            // boundaryTimer = $timeout(function(){
            // $scope.boundaryTip = '';
            // },1000);
            // return;
            // }
            // $timeout(function(){
            // $scope.boundaryTip = '';
            // $scope.sourceSize = false;
            // $scope.scale = 0;
            // })
            // console.log($scope.$parent.imageList,$scope.$parent.current)
            // loadImage();
            // })
            // }
            var clickedDom, _eventOffset = {};
            $scope.nextImg = function (e) {
                $('.thumb_wrap').css({
                    right: -10000,
                    bottom: -10000
                });
                if (e) {
                    clickedDom = e.target;
                    _eventOffset.left = e.offsetX;
                    _eventOffset.top = e.offsetY;
                } else {
                    clickedDom = undefined;
                }
                $timeout(function () {
                    $scope.loaded = 0;
                    $scope.rotateDeg = 0;
                })
                $scope.$parent.next(function (tip) {
                    if (tip) {
                        if (boundaryTimer) {
                            $timeout.cancel(boundaryTimer);
                        }
                        $timeout(function () {
                            $scope.loaded = 1;
                            $scope.boundaryTip = tip;
                        });
                        boundaryTimer = $timeout(function () {
                            $scope.boundaryTip = '';
                        }, 1000);
                        return;
                    } else {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    if ($scope.$parent.windowStatus.status == 2) {
                        loadImage();
                    } else {
                        resetFrame();
                    }
                })
            }
            $scope.prevImg = function (e) {
                $('.thumb_wrap').css({
                    right: -10000,
                    bottom: -10000
                });
                if (e) {
                    clickedDom = e.target;
                    _eventOffset.left = e.offsetX;
                    _eventOffset.top = e.offsetY;
                } else {
                    clickedDom = undefined;
                }
                $timeout(function () {
                    $scope.loaded = 0;
                    $scope.rotateDeg = 0;
                })
                $scope.$parent.prev(function (tip) {
                    if (tip) {
                        if (boundaryTimer) {
                            $timeout.cancel(boundaryTimer);
                        }
                        $timeout(function () {
                            $scope.loaded = 1;
                            $scope.boundaryTip = tip;
                        });
                        $scope.boundaryTip = tip;
                        boundaryTimer = $timeout(function () {
                            $scope.boundaryTip = '';
                        }, 1000);
                        return;
                    } else {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                    if ($scope.$parent.windowStatus.status == 2) {
                        loadImage();
                    } else {
                        resetFrame();
                    }
                })
            }
            var scrollTimer;
            function resetFrameFn() {
                if (resetingFrame) return;
                var msg = $scope.$parent.currentMsg;
                var params = {};
                var newSize = util.getNewSize(conCss.width, conCss.height);
                var toReset = true;
                if (newSize.width < newSize.minWidth && newSize.height < newSize.minHeight) {
                    toReset = false;
                }
                if (webWidth >= newSize.maxWidth || webHeight >= newSize.maxHeight) {
                    toReset = false;
                }
                if (newSize.width + shadowWidth <= webWidth && newSize.height + shadowWidth <= webHeight) {
                    toReset = false;
                }
                if (!toReset) {
                    drawImage();
                    container.css(conCss);
                    return;
                }
                if (scrollTimer) {
                    clearTimeout(scrollTimer);
                }
                scrollTimer = setTimeout(function () {
                    resetingFrame = true;
                    params.width = newSize.width;
                    params.img = $scope.$parent.currentImg;
                    params.msgId = msg.messageid;
                    params.chatId = msg.chatId;
                    params.msgTime = msg.timeStamp;
                    params.height = newSize.height;
                    frameService.resizeFrame('previewImg', '', params, newSize.width + shadowWidth, newSize.height + headerAndBottomHeight + shadowWidth, false, langPack.getKey('imgView'), false, true, function () {
                        webWidth = document.documentElement.clientWidth;
                        webHeight = document.documentElement.clientHeight;
                        totalWidth = webWidth, totalHeight = webHeight - headerAndBottomHeight;
                        maxWidth = 1 * totalWidth - shadowWidth, maxHeight = 1 * totalHeight - shadowWidth;
                        canvas.width = totalWidth;
                        canvas.height = totalHeight;
                        resetingFrame = false;
                        if (clickedDom) {
                            if ($('.img_oper').find(clickedDom).size()) {
                                $('.img_oper').show();
                            } else {
                                $(clickedDom).show();
                            }
                            var offset = $(clickedDom).offset();
                            offset.left += _eventOffset.left;
                            offset.top += _eventOffset.top;
                            frameService.resetMouse(offset.left, offset.top);
                            clickedDom = undefined;
                            _eventOffset = {};
                        }
                        loadImage(true);
                        container.css(conCss);
                    })
                }, 100);
            }
            function resetFrame() {
                var msg = $scope.$parent.currentMsg;
                var _img = new Image();
                _img.onload = function () {
                    resetingFrame = true;
                    var params = {};
                    var newSize = util.getNewSize(this.width, this.height);
                    params.width = newSize.width;
                    params.img = this.src;
                    params.msgId = msg.messageid;
                    params.chatId = msg.chatId;
                    params.msgTime = msg.timeStamp;
                    params.height = newSize.height;
                    frameService.resizeFrame('previewImg', '', params, newSize.width + shadowWidth, newSize.height + headerAndBottomHeight + shadowWidth, false, langPack.getKey('imgView'), false, true, function () {
                        setTimeout(function () {
                            webWidth = document.documentElement.clientWidth;
                            webHeight = document.documentElement.clientHeight;
                            totalWidth = webWidth, totalHeight = webHeight - headerAndBottomHeight;
                            maxWidth = 1 * totalWidth - shadowWidth, maxHeight = 1 * totalHeight - shadowWidth;
                            canvas.width = totalWidth;
                            canvas.height = totalHeight;
                            if (clickedDom) {
                                if ($('.img_oper').find(clickedDom).size()) {
                                    $('.img_oper').show();
                                } else {
                                    $(clickedDom).show();
                                }
                                var offset = $(clickedDom).offset();
                                offset.left += _eventOffset.left;
                                offset.top += _eventOffset.top;
                                frameService.resetMouse(offset.left, offset.top);
                                clickedDom = undefined;
                                _eventOffset = {};
                            }
                            resetingFrame = false;
                            if ($('.img_oper').find(clickedDom).size()) {
                                $('.img_oper').removeAttr('style');
                            }
                            loadImage();
                        }, 10)
                    });
                }
                _img.onerror = function () {
                    loadImage();
                    this.onerror = null;
                }
                _img.src = $scope.$parent.currentImg;
                // _img.src = $scope.$parent.imageList[$scope.$parent.current].filePath;
            }
            $scope.saveImg = function () {
                frameService.saveDialog({
                    extFilter: langPack.getKey('imageFiles'),
                    fileName: ''
                }, function (_res) {
                    var idx = $scope.$parent.current;
                    var msgId = $scope.$parent.msgId;
                    // if(idx !== undefined){
                    // msgId = $scope.$parent.imageList[idx].messageid;
                    // }else{
                    // msgId = $scope.$parent.msgId;
                    // }
                    frameService.downLoad({
                        id: msgId,
                        filePath: _res.Data,
                        fromLocal: true
                    }, function (res) {
                        $timeout(function () {
                            $scope.boundaryTip = langPack.getKey('saveSuccess');
                        });
                        boundaryTimer = $timeout(function () {
                            $scope.boundaryTip = '';
                        }, 1000);
                    })
                })
            }
            $scope.close = function () {
                rootDom.remove();
                $scope.$destroy();
            }
        }
    }
}]);

directives.directive('contextMenuHepler', ['$document', '$rootScope', function ($document, $rootScope) {
    return {
        restrict: 'EA',
        scope: {
            type: '@menuType',
            data: '@menuData',
            msg: '=menuMsg',
            forwardable: '@menuForwardable',
            favType: '@menuFav'
        },
        link: function ($scope, $ele) {
            $ele.bind('contextmenu', function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $rootScope.$broadcast('contextMenu', {
                    type: $scope.type,
                    data: $scope.data,
                    forwardable: $scope.forwardable,
                    msg: $scope.msg,
                    favType: $scope.favType
                }, {
                    top: $event.pageY,
                    left: $event.pageX
                })
            })
        }
    }
}]);
directives.directive('contextMenu', ['$document', function ($document) {
    return {
        controller: 'contextMenuController',
        templateUrl: 'context_menu.html'
    }
}]);


/**
    driectives_2.js
*/

directives.directive('qcode', [function () {
    return {
        restrict: 'EA',
        //replace : true,
        scope: {
            content: '@'
        },
        link: function ($scope, $ele) {
            var qrcode = new QRCode($ele[0], {
                width: 150,
                height: 150
            });
            qrcode.makeCode($scope.content)
        }
    }
}]);
directives.directive('setFocus', [function () {
    return {
        restrict: 'EA',
        //replace : true,
        template: '<input  type="text"  ng-blur="nameChanged($event)" ng-model="room.inputName" id="group_name"/>',
        link: function ($scope, $ele) {
            angular.element($ele[0]).find('input').focus();
        }
    }
}]);
directives.directive('ngMailTo', ['$parse', 'empService', 'util', function ($parse, empService, util) {
    return {
        restrict: "EA",
        scope: {
            emails: '='
        },
        link: function ($scope, elem, attrs) {
            elem.bind('click', function () {
                var body = document.getElementsByTagName('body')[0];
                var iframe = document.createElement('iframe');
                iframe.name = 'mailto';
                iframe.id = 'mailto';
                iframe.style.display = 'none';
                body.appendChild(iframe);

                window.open('mailto:' + $scope.emails, 'mailto');
                setTimeout(function () {
                    body.removeChild(iframe);
                }, 1000)
            })
        }
    }
}]);
directives.directive('ngLang', ['langPack', 'webConfig', '$rootScope', function (langPack, webConfig, $rootScope) {
    return {
        restrict: "EA",
        link: function ($scope, elem, attrs) {
            var tag = elem[0].tagName;
            if (tag) {
                tag = tag.toLowerCase();
                var key = attrs.langkey;
                var lang = langPack.getLang();
                setLangContent(key);
                $scope.$on('changeLang', function (ol, nl) {
                    setLangContent(key);
                })
                // $scope.$watch('lang',function(ol,nl){
                // setLangContent(key);
                // })
            }
            function setLangContent(key) {
                var nv = langPack.getKey(key);
                if (tag == 'input') {
                    elem.attr('placeholder', nv);
                } else {
                    elem.html(nv);
                    if (tag == 'a') {
                        elem.attr('title', nv);
                    }
                }
                var isLast = elem.attr('isLast')
                if (isLast) {
                    $rootScope.$broadcast('langPackRendered');
                }
            }
        }
    }
}]);

directives.directive('closeWin', ['$state', '$timeout', function ($state, $timeout) {
    return {
        restrict: "EA",
        replace: true,
        template: '<a draggable="false" href="javascript:;" class="win_btn close_win"><i></i></a>',
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                callCefMethod('frame/close', {
                    hideToTray: false
                });
            })
        }
    }
}]);
directives.directive('minWin', ['$state', '$timeout', function ($state, $timeout) {
    return {
        restrict: "EA",
        replace: true,
        template: '<a draggable="false" href="javascript:;" class="win_btn min_win" style="margin-right:5px;"><i></i></a>',
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                callCefMethod('frame/minimum');
            })
        }
    }
}]);
directives.directive('maxWin', ['$state', '$timeout', function ($state, $timeout) {
    return {
        restrict: "EA",
        replace: true,
        template: '<a href="javascript:;" class="win_btn max_win"><i></i></a>',
        link: function ($scope, elem, attrs) {
            elem.click(function () {
                callCefMethod('frame/maximum');
            })
        }
    }
}]);

directives.directive('devTool', ['$state', '$timeout', function ($state, $timeout) {
    return {
        restrict: "EA",
        replace: true,
        template: (window.print && print === true) ? '<div style="position:fixed;top:0;left:0;z-index:99999"><a href="javascript:;" ng-click="openConsole()" title="打开控制台">控制台</a><a href="javascript:;" ng-click="reload()">刷新</a></div>' : '',
        // template : '',
        link: function ($scope, elem, attrs) {
            $scope.openConsole = function () {
                callCefMethod('frame/showDevTools');
            }
            $scope.reload = function () {
                callCefMethod('frame/refresh');
            }
        }
    }
}]);


directives.directive('chatAvatar', ['$state', '$timeout', function ($state, $timeout) {
    var cache = {};
    var geted = {};
    return {
        restrict: "EA",
        replace: true,
        template: '<img ng-src="{{chat.avatarUrl}}" ng-class="status"  err-src=""/>',
        scope: {
            chat: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.refresh = function (chatId) {
                if (!cache[chatId] && geted[chatId]) return;
                if (cache[chatId]) {
                    $scope.chat.avatarUrl = cache[chatId];
                    $scope.$apply();
                }
                geted[chatId] = 1;
                if (chatId && !cache[chatId]) {
                    callCefMethod('chat/avatar', {
                        chatId: chatId
                    }, function (res) {
                        if (res.Flag == 0 && res.Data) {
                            if (chatId == $scope.chat.id) {
                                cache[chatId] = res.Data.replace(/\\/g, '/');
                                $scope.chat.avatarUrl = res.Data.replace(/\\/g, '/');
                                $scope.$apply();
                            }
                        }
                    })
                }
            }
        }],
        link: function ($scope, elem, attrs) {
            if ($scope.chat.isGroup) {
                $scope.chat.avatarUrl = 'img/group_img.png';
            } else {
                $scope.chat.avatarUrl = 'img/defaultHeadImage.jpg';
            }
            $scope.$watch('chat', function (v, o) {
                if (v != o) {
                    if (v.id) {
                        if (!cache[v.id]) {
                            $scope.refresh(v.id);
                        } else {
                            $scope.chat.avatarUrl = cache[v.id];
                        }
                    }
                }
            });
            $scope.refresh($scope.chat.id);
        }
    }
}]);

directives.directive('ecllipseDirective', ['$state', '$timeout', function ($state, $timeout) {
    return {
        restrict: "EA",
        scope: {
            content: '=',
            width: '=',
            type: '@'
        },
        link: function ($scope, elem, attrs) {
            var ele = elem[0];
            var fontSize = getComputedStyle(ele, '').fontSize;
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.fontSize = fontSize;
            document.body.appendChild(div);
            $scope.width = parseInt($scope.width);
            var content = util.htmlEncode($scope.content);
            div.innerHTML = content;
            ele.setAttribute('title', content);
            ele.innerHTML = content;
            $scope.type = $scope.type || 'center';
            if (div.clientWidth < $scope.width) {
                ele.innerHTML = content;
            } else {
                var type = 0, start = 1, end = 1;
                div.innerHTML = '';
                while (div.clientWidth < $scope.width) {
                    div.innerHTML = content.substr(0, start) + '...' + content.substr(-end);
                    if (type == 0) {
                        end++;
                        type = $scope.type == 'center' ? 1 : 0;
                    } else {
                        start++;
                        type = $scope.type == 'center' ? 0 : 1;
                    }
                }
                start--;
                end--;
                if ($scope.type == 'center') {
                    ele.innerHTML = content.substr(0, start) + '...' + content.substr(-(end));
                } else {
                    ele.innerHTML = '...' + content.substr(-(end));
                }
            }
            ele.oncopy = function (e) {
                var selection = document.getSelection();
                if (selection.rangeCount > 0) {
                    var range = selection.getRangeAt(0);
                    var content = range.cloneContents();
                    var div = document.createElement('div');
                    div.appendChild(content);
                    if (div.innerText == ele.innerText) {
                        var clipboardData = e.clipboardData;
                        var res = util.copyDom($scope.content);
                        clipboardData.setData("text/html", res.html);
                        clipboardData.setData("text/plain", res.text);
                        e.preventDefault();
                    }
                }
            }
            document.body.removeChild(div);
        }
    }
}]);


directives.directive('filterContentSplit', ['$state', '$timeout', '$filter', function ($state, $timeout, $filter) {
    return {
        restrict: "EA",
        scope: {
            content: '=',
            width: '=',
            keyword: '='
        },
        link: function ($scope, elem, attrs) {
            var ele = elem[0];
            var fontSize = getComputedStyle(ele, '').fontSize;
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.fontSize = fontSize;
            document.body.appendChild(div);
            $scope.width = parseInt($scope.width);
            var content = util.htmlEncode($scope.content);
            div.innerHTML = content;
            ele.setAttribute('title', content);
            ele.innerHTML = content;
            var keyword = $scope.keyword;
            $scope.type = $scope.type || 'center';
            if (div.clientWidth < $scope.width) {
                ele.innerHTML = $filter('stringLightFilter')(content, keyword);
            } else {
                var type = 0, start = 1, end = 1;
                var idx = content.indexOf(keyword);
                if (idx == -1) {
                    div.innerHTML = '';
                    while (div.clientWidth < $scope.width) {
                        div.innerHTML = content.substr(0, start) + '...' + content.substr(-end);
                        end++;
                        start++;
                    }
                    start = start - 2;
                    end = end - 2;
                    ele.innerHTML = content.substr(0, start) + '...' + content.substr(-(end));
                    document.body.removeChild(div);
                    return;
                }
                start = idx;
                end = start + keyword.length - 1;
                if (start == 0) {
                    type = 0;
                }
                if (end == content.length - 1) {
                    type = 1;
                }
                // console.log(start,end);
                div.innerHTML = '';
                var flag = '';
                while (div.clientWidth < $scope.width) {
                    if (type == 0) {
                        if (end < content.length - 1) {
                            end++;
                            flag = 0;
                        }
                        if (start > 0) {
                            type = 1;
                        }
                    } else {
                        if (start > 0) {
                            start--;
                            flag = 1;
                        }
                        if (end < content.length - 1) {
                            type = 0;
                        }
                    }
                    div.innerHTML = (start == 0 ? '' : '...') + content.substring(start, end + 1) + (end == content.length - 1 ? '' : '...');
                }
                if (flag == 1) {
                    start++;
                } else if (flag == 0) {
                    end--;
                }
                // console.log(flag,start,end,content,content.length);
                var res = (start == 0 ? '' : '...') + content.substring(start, end + 1) + (end == content.length - 1 ? '' : '...');
                ele.innerHTML = $filter('stringLightFilter')(res, keyword);
            }
            document.body.removeChild(div);
        }
    }
}]);

directives.directive('chatNameSplit', ['$state', '$timeout', 'util', function ($state, $timeout, util) {
    return {
        restrict: "EA",
        scope: {
            chat: '=',
            width: '='
        },
        link: function ($scope, elem, attrs) {
            var ele = elem[0];
            var chat = $scope.chat;
            var fontSize = getComputedStyle(ele, '').fontSize;
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.fontSize = fontSize;
            document.body.appendChild(div);
            $scope.width = parseInt($scope.width);
            var content = chat.Name + '(' + chat.Count + ')';
            var _content = util.htmlEncode(content);
            div.innerHTML = _content;
            ele.setAttribute('title', content);
            ele.innerHTML = _content;
            if (div.clientWidth < $scope.width) {
                ele.innerHTML = _content;
            } else {
                var type = 0, start = 1, end = 1;
                div.innerHTML = '';
                while (div.clientWidth < $scope.width) {
                    div.innerHTML = util.htmlEncode(chat.Name.substr(0, end)) + '...' + '(' + chat.Count + ')';
                    end++;
                }
                end = end - 2;
                ele.innerHTML = util.htmlEncode(chat.Name.substr(0, end)) + '...' + '(' + chat.Count + ')';
            }
            document.body.removeChild(div);
        }
    }
}]);