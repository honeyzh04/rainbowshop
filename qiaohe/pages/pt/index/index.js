var a = require("../../../api.js"), t = getApp();

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page_count: 0
    },
    onLoad: function(a) {
        this.systemInfo = wx.getSystemInfoSync(), t.pageOnLoad(this), this.loadIndexInfo(this);
        var o = wx.getStorageSync("store");
        this.setData({
            store: o
        });
    },
    onReady: function() {},
    onShow: function() {
        t.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    loadIndexInfo: function(o) {
        var e = o;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: a.group.index,
            method: "get",
            success: function(a) {
                0 == a.code && (setTimeout(function() {
                    wx.hideLoading();
                }, 1e3), e.setData({
                    cat: a.data.cat,
                    banner: a.data.banner,
                    ad: a.data.ad,
                    goods: a.data.goods.list,
                    page: a.data.goods.page,
                    page_count: a.data.goods.page_count
                }), a.data.goods.row_count <= 0 && e.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    switchNav: function(o) {
        var e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var n = 0;
        if (n != o.currentTarget.dataset.id || 0 == o.currentTarget.dataset.id) {
            n = o.currentTarget.dataset.id, console.log(this.systemInfo);
            var s = this.systemInfo.windowWidth, d = o.currentTarget.offsetLeft, r = this.data.scrollLeft;
            r = d > s / 2 ? d : 0, e.setData({
                cid: n,
                page: 1,
                scrollLeft: r,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1
            }), t.request({
                url: a.group.list,
                method: "get",
                data: {
                    cid: n
                },
                success: function(a) {
                    if (0 == a.code) {
                        setTimeout(function() {
                            wx.hideLoading();
                        }, 1e3);
                        var t = a.data.list;
                        a.data.page_count >= a.data.page ? e.setData({
                            goods: t,
                            page: a.data.page,
                            page_count: a.data.page_count,
                            row_count: a.data.row_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    pullDownLoading: function(o) {
        var e = this;
        if (1 != e.data.emptyGoods && 1 != e.data.show_loading_bar) {
            e.setData({
                show_loading_bar: 1
            });
            var n = parseInt(e.data.page + 1), s = e.data.cid;
            t.request({
                url: a.group.list,
                method: "get",
                data: {
                    page: n,
                    cid: s
                },
                success: function(a) {
                    if (0 == a.code) {
                        var t = e.data.goods;
                        a.data.page > e.data.page && Array.prototype.push.apply(t, a.data.list), console.log(a.data.page), 
                        console.log(a.data.page_count), a.data.page_count >= a.data.page ? e.setData({
                            goods: t,
                            page: a.data.page,
                            page_count: a.data.page_count,
                            row_count: a.data.row_count,
                            show_loading_bar: 0
                        }) : e.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    navigatorClick: function(a) {
        var t = a.currentTarget.dataset.open_type, o = a.currentTarget.dataset.url;
        return "wxapp" != t || (o = function(a) {
            var t = /([^&=]+)=([\w\W]*?)(&|$|#)/g, o = /^[^\?]+\?([\w\W]+)$/.exec(a), e = {};
            if (o && o[1]) for (var n, s = o[1]; null != (n = t.exec(s)); ) e[n[1]] = n[2];
            return e;
        }(o), o.path = o.path ? decodeURIComponent(o.path) : "", console.log("Open New App"), 
        wx.navigateToMiniProgram({
            appId: o.appId,
            path: o.path,
            complete: function(a) {
                console.log(a);
            }
        }), !1);
    },
    to_dial: function() {
        var a = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    }
});