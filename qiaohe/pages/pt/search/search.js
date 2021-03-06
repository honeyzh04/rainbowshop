var t = require("../../../api.js"), a = getApp(), o = 1;

Page({
    data: {
        history_show: !1,
        search_val: "",
        list: [],
        history_info: [],
        show_loading_bar: !1,
        emptyGoods: !1,
        newSearch: !0
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var t = this;
        wx.getStorage({
            key: "history_info",
            success: function(a) {
                console.log(a.data.length), a.data.length > 0 && t.setData({
                    history_info: a.data,
                    history_show: !0
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        t.data.emptyGoods || (t.data.page_count <= o && t.setData({
            emptyGoods: !0
        }), o++, t.getSearchGoods());
    },
    onShareAppMessage: function() {},
    toSearch: function(t) {
        var a = t.detail.value, o = this;
        if (a) {
            var e = o.data.history_info;
            e.unshift(a);
            for (var s in e) {
                if (e.length <= 20) break;
                e.splice(s, 1);
            }
            wx.setStorageSync("history_info", e), o.setData({
                history_info: e,
                history_show: !1,
                keyword: a,
                list: []
            }), o.getSearchGoods();
        }
    },
    cancelSearchValue: function(t) {
        wx.navigateBack({
            delta: 1
        });
    },
    newSearch: function(t) {
        var a = this, e = !1;
        a.data.history_info.length > 0 && (e = !0), o = 1, a.setData({
            history_show: e,
            list: [],
            newSearch: [],
            emptyGoods: !1
        });
    },
    clearHistoryInfo: function(t) {
        var a = this, o = [];
        wx.setStorageSync("history_info", o), a.setData({
            history_info: o,
            history_show: !1
        });
    },
    getSearchGoods: function() {
        var e = this, s = e.data.keyword;
        s && (e.setData({
            show_loading_bar: !0
        }), a.request({
            url: t.group.search,
            data: {
                keyword: s,
                page: o
            },
            success: function(t) {
                if (0 == t.code) {
                    if (e.data.newSearch) a = t.data.list; else var a = e.data.list.concat(t.data.list);
                    e.setData({
                        list: a,
                        page_count: t.data.page_count,
                        emptyGoods: !0,
                        show_loading_bar: !1
                    }), t.data.page_count > o && e.setData({
                        newSearch: !1,
                        emptyGoods: !1
                    });
                }
            },
            complete: function() {}
        }));
    },
    historyItem: function(t) {
        var a = t.currentTarget.dataset.keyword, o = this;
        o.setData({
            keyword: a,
            history_show: !1
        }), o.getSearchGoods();
    }
});