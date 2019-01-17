var t = require("../../api.js"), a = getApp();

Page({
    data: {
        cat_list: [],
        sub_cat_list_scroll_top: 0
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            store: wx.getStorageSync("store")
        });
    },
    onShow: function() {
        a.pageOnShow(this), this.loadData();
    },
    loadData: function(s) {
        var e = this, c = wx.getStorageSync("cat_list");
        c && e.setData({
            cat_list: c,
            current_cat: null
        }), a.request({
            url: t.default.cat_list,
            success: function(t) {
                0 == t.code && (e.setData({
                    cat_list: t.data.list,
                    current_cat: null
                }), wx.setStorageSync("cat_list", t.data.list));
            },
            complete: function() {
                wx.stopPullDownRefresh();
            }
        });
    },
    catItemClick: function(t) {
        var a = this, s = t.currentTarget.dataset.index, e = a.data.cat_list, c = null;
        for (var i in e) i == s ? (e[i].active = !0, !1, c = e[i]) : e[i].active = !1;
        console.log(c), a.setData({
            cat_list: e,
            sub_cat_list_scroll_top: 0,
            current_cat: c
        });
    }
});