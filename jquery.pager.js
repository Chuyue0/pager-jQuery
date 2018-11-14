/*
* Version 2.0
* 2018-01-12 by Van
* 2018-11-06 modify
* Contact 1084224413@qq.com
*/
;
(function (window, $) {

    var sjPager = window.sjPager = {
        opts: {
            topic_num: $('#perPage').val() || 10,
            preText: "<",
            nextText: ">",
            firstText: "首页",
            lastText: "尾页",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: false,
            showLast: false,
            url: "",
            type: "",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            error: function() {
                window.confirm("抱歉,请求出错,请重新请求！");
            },

            page: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0}'>{1}</span>",
            pageIndexHtml: "<a href='javascript:void(0)' onclick='sjPager.doPage({0},{1},{2},{3})'>{4}</a>",
            rightHtml: "<span class='text'> 共 {2} 条， 到第</span> <input type='text' id='txtToPager' value={1} /><span class='text'>页</span> <button id='btnJump' onclick='sjPager.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both;'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;

            _self.opts = $.extend({}, _self.opts, op);
            _self.pagerElement = obj;
            _self.doPage(_self.opts.page, _self.opts.topic_num, _self.opts.searchParam ,_self.opts.type);

            return _self.opts;
        },
        stringFormat: function () {
            if (arguments.length == 0)
                return null;

            var str = arguments[0];

            for (var i = 1; i < arguments.length; i++) {
                var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm');

                str = str.replace(reg, arguments[i]);
            }

            return str;
        },
        doPage: function (index, topic_num, searchParam, type) {
            var _self = this;

            _self.opts.page = index;
            _self.opts.topic_num = topic_num;
            _self.opts.searchParam = searchParam;
            _self.opts.type = type || 'POST';

            $.ajax({
                type: _self.opts.type,
                data: $.extend(_self.opts.searchParam || {}, {
                    topic_num: _self.opts.topic_num || 10,
                    page: _self.opts.page
                }),
                dataType: _self.opts.dataType,
                url: _self.opts.url,
                beforeSend: function () {
                    _self.opts.beforeSend();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (data) {
                    _self.opts.success(data);
                    if(data && data.data){
                    data=data.data;
                    _self.opts.totalCount = data.totalCount;
                    _self.getTotalPage();
                    if (_self.opts.totalCount > 0 && _self.opts.page > 0) {
                        var pageTextArr = new Array;

                        _self.createPreAndFirstBtn(pageTextArr);
                        _self.createIndexBtn(pageTextArr);
                        _self.createNextAndLastBtn(pageTextArr);
                        _self.renderHtml(pageTextArr);
                    }
                    }
                },
                complete: function () {
                    _self.opts.complete();
                }
            });
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.topic_num);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.page == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.page - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.page == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.page + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            if (_self.opts.page > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.page - _self.opts.shiftingLeft; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.page; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.page, 'current'));

            if (_self.opts.page <= shiftingRightStart) {

                for (i = _self.opts.page + 1; i < _self.opts.page + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.page + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }

            _self.pagerElement.html(pageText).append(_self.stringFormat(_self.commonHtmlText.rightHtml, _self.opts.totalPage, _self.opts.page, _self.opts.totalCount)).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return _self.stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return _self.stringFormat(_self.commonHtmlText.pageIndexHtml, index, _self.opts.topic_num, JSON.stringify(_self.opts.searchParam), JSON.stringify(_self.opts.type), text);
        },
        jumpToPage: function() {
            var _self = this;

            var $txtToPager = $("#txtToPager", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.topic_num, _self.opts.searchParam, _self.opts.type);
            } else {
                $txtToPager.focus();
            }
        },
        parseURL: function (url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) { continue; }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }
    }

    $.fn.sjAjaxPager = function (option) {
        return sjPager.init($(this),option);
    };

})(window, jQuery);
