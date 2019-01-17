var t = require("../../../api.js"), a = (require("../../../utils.js"), getApp()), o = !1;

Page({
    data: {
        page: 1,
        page_count: 1,
        longitude: "",
        latitude: "",
        score: [ 1, 2, 3, 4, 5 ],
        keyword: ""
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var o = this;
        o.setData({
            ids: t.ids
        }), wx.getLocation({
            success: function(t) {
                o.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                console.log(11), o.loadData();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    loadData: function() {
        var o = this;
        wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.book.shop_list,
            method: "GET",
            data: {
                longitude: o.data.longitude,
                latitude: o.data.latitude,
                ids: o.data.ids
            },
            success: function(t) {
                0 == t.code && (console.log(22), o.setData(t.data));
            },
            fail: function(t) {
                console.log(t);
            },
            complete: function() {
                console.log(33), wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        var t = this;
        t.setData({
            keyword: "",
            page: 1
        }), wx.getLocation({
            success: function(a) {
                t.setData({
                    longitude: a.longitude,
                    latitude: a.latitude
                });
            },
            complete: function() {
                t.loadData(), wx.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function() {
        var t = this;
        t.data.page >= t.data.page_count || t.loadMoreData();
    },
    loadMoreData: function() {
        var e = this, n = e.data.page;
        o || (o = !0, wx.showLoading({
            title: "加载中"
        }), a.request({
            url: t.book.shop_list,
            method: "GET",
            data: {
                page: n,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                ids: e.data.ids
            },
            success: function(t) {
                if (0 == t.code) {
                    var a = e.data.list.concat(t.data.list);
                    e.setData({
                        list: a,
                        page_count: t.data.page_count,
                        row_count: t.data.row_count,
                        page: n + 1
                    });
                }
            },
            complete: function() {
                wx.hideLoading(), o = !1;
            }
        }));
    },
    goto: function(t) {
        var o = this;
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userLocation"] ? o.location(t) : a.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(a) {
                        a.authSetting["scope.userLocation"] && o.location(t);
                    }
                });
            }
        });
    },
    location: function(t) {
        var a = this, o = t.currentTarget.dataset.index, e = a.data.list;
        console.log(1), wx.openLocation({
            latitude: parseFloat(e[o].latitude),
            longitude: parseFloat(e[o].longitude),
            name: e[o].name,
            address: e[o].address
        });
    },
    inputFocus: function(t) {
        this.setData({
            show: !0
        });
    },
    inputBlur: function(t) {
        this.setData({
            show: !1
        });
    },
    inputConfirm: function(t) {
        this.search();
    },
    input: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    search: function(o) {
        var e = this;
        wx.showLoading({
            title: "搜索中"
        }), a.request({
            url: t.book.shop_list,
            method: "GET",
            data: {
                keyword: e.data.keyword,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                ids: e.data.ids
            },
            success: function(t) {
                0 == t.code && e.setData(t.data);
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    go: function(t) {
        var a = this, o = t.currentTarget.dataset.index, e = a.data.list;
        wx.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + e[o].id
        });
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, o = t.currentTarget.dataset.url;
        return "wxapp" != a || (o = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, o = /^[^\?]+\?([\w\W]+)$/.exec(t), e = {};
            if (o && o[1]) for (var n, i = o[1]; null != (n = a.exec(i)); ) e[n[1]] = n[2];
            return e;
        }(o), o.path = o.path ? decodeURIComponent(o.path) : "", console.log("Open New App"), 
        wx.navigateToMiniProgram({
            appId: o.appId,
            path: o.path,
            complete: function(t) {
                console.log(t);
            }
        }), !1);
    },
    onShareAppMessage: function(t) {}
});