var t = require("../../api.js"), a = getApp(), e = 0, o = 1, n = !0;

Page({
    data: {
        x: wx.getSystemInfoSync().windowWidth,
        y: wx.getSystemInfoSync().windowHeight,
        left: 0,
        show_notice: !1,
        animationData: {}
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.loadData(t);
        var e = 0, o = t.user_id, n = decodeURIComponent(t.scene);
        void 0 != o ? e = o : void 0 != n && (e = n), a.loginBindParent({
            parent_id: e
        });
    },
    loadData: function(e) {
        var o = this, i = wx.getStorageSync("pages_index_index");
        i && (i.act_modal_list = [], o.setData(i)), a.request({
            url: t.default.index,
            success: function(t) {
                if (0 == t.code && 0 == t.code) {
                    n ? n = !1 : t.data.act_modal_list = [], o.setData(t.data), wx.setStorageSync("pages_index_index", t.data);
                    var a = wx.getStorageSync("user_info");
                    a && o.setData({
                        _user_info: a
                    }), o.miaoshaTimer();
                }
            },
            complete: function() {
                wx.stopPullDownRefresh();
            }
        });
    },
    onShow: function() {
        a.pageOnShow(this), e = 0;
        var t = wx.getStorageSync("store");
        t && t.name && wx.setNavigationBarTitle({
            title: t.name
        }), clearInterval(o), this.notice();
    },
    onPullDownRefresh: function() {
        this.loadData();
    },
    onShareAppMessage: function(t) {
        var o = this;
        return {
            path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++e && a.shareSendCoupon(o);
            }
        };
    },
    receive: function(e) {
        var o = this, n = e.currentTarget.dataset.index;
        wx.showLoading({
            title: "领取中",
            mask: !0
        }), o.hideGetCoupon || (o.hideGetCoupon = function(t) {
            var a = t.currentTarget.dataset.url || !1;
            o.setData({
                get_coupon_list: null
            }), a && wx.navigateTo({
                url: a
            });
        }), a.request({
            url: t.coupon.receive,
            data: {
                id: n
            },
            success: function(t) {
                wx.hideLoading(), 0 == t.code ? o.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                }) : (wx.showToast({
                    title: t.msg,
                    duration: 2e3
                }), o.setData({
                    coupon_list: t.data.coupon_list
                }));
            }
        });
    },
    navigatorClick: function(t) {
        var a = t.currentTarget.dataset.open_type, e = t.currentTarget.dataset.url;
        return "wxapp" != a || (e = function(t) {
            var a = /([^&=]+)=([\w\W]*?)(&|$|#)/g, e = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (e && e[1]) for (var n, i = e[1]; null != (n = a.exec(i)); ) o[n[1]] = n[2];
            return o;
        }(e), e.path = e.path ? decodeURIComponent(e.path) : "", console.log("Open New App"), 
        wx.navigateToMiniProgram({
            appId: e.appId,
            path: e.path,
            complete: function(t) {
                console.log(t);
            }
        }), !1);
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    notice: function() {
        var t = this, a = t.data.notice;
        if (void 0 != a) {
            a.length;
            return;
        }
    },
    miaoshaTimer: function() {
        var t = this;
        if (t.data.miaosha && t.data.miaosha.rest_time) var a = setInterval(function() {
            t.data.miaosha.rest_time > 0 ? (t.data.miaosha.rest_time = t.data.miaosha.rest_time - 1, 
            t.data.miaosha.times = t.getTimesBySecond(t.data.miaosha.rest_time), t.setData({
                miaosha: t.data.miaosha
            })) : clearInterval(a);
        }, 1e3);
    },
    onHide: function() {
        a.pageOnHide(this), clearInterval(o);
    },
    onUnload: function() {
        a.pageOnUnload(this), clearInterval(o);
    },
    showNotice: function() {
        this.setData({
            show_notice: !0
        });
    },
    closeNotice: function() {
        this.setData({
            show_notice: !1
        });
    },
    getTimesBySecond: function(t) {
        if (t = parseInt(t), isNaN(t)) return {
            h: "00",
            m: "00",
            s: "00"
        };
        var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60;
        return {
            h: a < 10 ? "0" + a : "" + a,
            m: e < 10 ? "0" + e : "" + e,
            s: o < 10 ? "0" + o : "" + o
        };
    },
    to_dial: function() {
        var t = this.data.store.contact_tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    closeActModal: function() {
        var t, a = this, e = a.data.act_modal_list, o = !0;
        for (var n in e) {
            var i = parseInt(n);
            e[i].show && (e[i].show = !1, void 0 !== e[t = i + 1] && o && (o = !1, setTimeout(function() {
                a.data.act_modal_list[t].show = !0, a.setData({
                    act_modal_list: a.data.act_modal_list
                });
            }, 500)));
        }
        a.setData({
            act_modal_list: e
        });
    }
});