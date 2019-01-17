var t = require("../../api.js"), a = getApp();

Page({
    data: {
        load_more_count: 0,
        last_load_more_time: 0,
        is_loading: !1,
        loading_class: "",
        cat_id: !1,
        keyword: !1,
        page: 1,
        limit: 20,
        goods_list: [],
        show_history: !0,
        show_result: !1,
        history_list: []
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var t = this;
        t.setData({
            history_list: t.getHistoryList(!0)
        });
    },
    inputFocus: function() {
        this.setData({
            show_history: !0,
            show_result: !1
        });
    },
    inputBlur: function() {
        var t = this;
        t.data.goods_list.length > 0 && setTimeout(function() {
            t.setData({
                show_history: !1,
                show_result: !0
            });
        }, 300);
    },
    inputConfirm: function(t) {
        var a = this, o = t.detail.value;
        0 != o.length && (a.setData({
            page: 1,
            keyword: o
        }), a.setHistory(o), a.getGoodsList());
    },
    searchCancel: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    historyClick: function(t) {
        var a = this, o = t.currentTarget.dataset.value;
        0 != o.length && (a.setData({
            page: 1,
            keyword: o
        }), a.getGoodsList());
    },
    getGoodsList: function() {
        var o = this;
        o.setData({
            show_history: !1,
            show_result: !0
        }), o.setData({
            page: 1,
            scroll_top: 0
        }), o.setData({
            goods_list: []
        });
        var s = {};
        o.data.cat_id && (s.cat_id = o.data.cat_id, o.setActiveCat(s.cat_id)), o.data.keyword && (s.keyword = o.data.keyword), 
        o.showLoadingBar(), o.is_loading = !0, a.request({
            url: t.default.goods_list,
            data: s,
            success: function(t) {
                0 == t.code && o.setData({
                    goods_list: t.data.list
                }), t.code;
            },
            complete: function() {
                o.hideLoadingBar(), o.is_loading = !1;
            }
        });
    },
    onListScrollBottom: function(t) {
        this.getMoreGoodsList();
    },
    getHistoryList: function(t) {
        t = t || !1;
        var a = wx.getStorageSync("search_history_list");
        if (!a) return [];
        if (!t) return a;
        for (var o = [], s = a.length - 1; s >= 0; s--) o.push(a[s]);
        return o;
    },
    setHistory: function(t) {
        var a = this.getHistoryList();
        a.push({
            keyword: t
        });
        for (var o in a) {
            if (a.length <= 20) break;
            a.splice(o, 1);
        }
        wx.setStorageSync("search_history_list", a);
    },
    getMoreGoodsList: function() {
        var o = this, s = {};
        o.data.cat_id && (s.cat_id = o.data.cat_id, o.setActiveCat(s.cat_id)), o.data.keyword && (s.keyword = o.data.keyword), 
        s.page = o.data.page || 1, o.showLoadingMoreBar(), o.setData({
            is_loading: !0
        }), o.setData({
            load_more_count: o.data.load_more_count + 1
        }), s.page = o.data.page + 1, o.setData({
            page: s.page
        }), a.request({
            url: t.default.goods_list,
            data: s,
            success: function(t) {
                if (0 == t.code) {
                    var a = o.data.goods_list;
                    if (t.data.list.length > 0) {
                        for (var i in t.data.list) a.push(t.data.list[i]);
                        o.setData({
                            goods_list: a
                        });
                    } else o.setData({
                        page: s.page - 1
                    });
                }
                t.code;
            },
            complete: function() {
                o.setData({
                    is_loading: !1
                }), o.hideLoadingMoreBar();
            }
        });
    },
    showLoadingBar: function() {
        this.setData({
            loading_class: "active"
        });
    },
    hideLoadingBar: function() {
        this.setData({
            loading_class: ""
        });
    },
    showLoadingMoreBar: function() {
        this.setData({
            loading_more_active: "active"
        });
    },
    hideLoadingMoreBar: function() {
        this.setData({
            loading_more_active: ""
        });
    },
    deleteSearchHistory: function() {
        this.setData({
            history_list: null
        }), wx.removeStorageSync("search_history_list");
    }
});