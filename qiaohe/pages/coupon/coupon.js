var t = require("../../api.js"), a = getApp();

Page({
    data: {
        list: []
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            status: t.status || 0
        }), this.loadData(t);
    },
    loadData: function(s) {
        var i = this;
        wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.coupon.index,
            data: {
                status: i.data.status
            },
            success: function(t) {
                0 == t.code && i.setData({
                    list: t.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onShow: function() {}
});