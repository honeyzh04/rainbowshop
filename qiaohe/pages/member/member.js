var n = require("../../api.js"), o = getApp();

Page({
    data: {},
    onLoad: function(n) {
        o.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), o.request({
            url: n.user.member,
            method: "POST",
            success: function(n) {
                wx.hideLoading(), 0 == n.code && t.setData(n.data);
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});