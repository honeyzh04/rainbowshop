var t = require("../../api.js"), a = getApp(), o = !1, i = !1;

Page({
    data: {
        page: 1,
        video_list: [],
        url: "",
        hide: "hide",
        show: !1,
        animationData: {}
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.loadMoreGoodsList();
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    loadMoreGoodsList: function() {
        var e = this;
        if (!o) {
            e.setData({
                show_loading_bar: !0
            }), o = !0;
            var n = e.data.page;
            a.request({
                url: t.default.video_list,
                data: {
                    page: n
                },
                success: function(t) {
                    0 == t.data.list.length && (i = !0);
                    var a = e.data.video_list.concat(t.data.list);
                    e.setData({
                        video_list: a,
                        page: n + 1
                    });
                },
                complete: function() {
                    o = !1, e.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    play: function(t) {
        var a = t.currentTarget.dataset.index;
        return wx.createVideoContext("video_" + this.data.show_video).pause(), void this.setData({
            show_video: a,
            show: !0
        });
    },
    onReachBottom: function() {
        var t = this;
        i || t.loadMoreGoodsList();
    },
    more: function(t) {
        var a = this, o = t.target.dataset.index, i = a.data.video_list, e = wx.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = e, -1 != i[o].show ? (e.rotate(0).step(), i[o].show = -1, a.setData({
            video_list: i,
            animationData: this.animation.export()
        })) : (e.rotate(0).step(), i[o].show = 0, a.setData({
            video_list: i,
            animationData: this.animation.export()
        }));
    }
});