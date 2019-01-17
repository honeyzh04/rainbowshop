var t = require("../../api.js"), a = getApp();

Page({
    data: {
        status: 1,
        first_count: 0,
        second_count: 0,
        third_count: 0,
        list: Array
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var n = this, s = wx.getStorageSync("share_setting");
        n.setData({
            share_setting: s
        }), n.GetList(t.status || 1);
    },
    GetList: function(n) {
        var s = this;
        s.setData({
            status: parseInt(n || 1)
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.share.get_team,
            data: {
                status: s.data.status
            },
            success: function(t) {
                s.setData({
                    first_count: t.data.first,
                    second_count: t.data.second,
                    third_count: t.data.third,
                    list: t.data.list
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});