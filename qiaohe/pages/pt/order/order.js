var t = require("../../../api.js"), e = getApp(), o = !1, a = !1, s = 2;

Page({
    data: {
        hide: 1,
        qrcode: "",
        scrollLeft: 0,
        scrollTop: 0
    },
    onLoad: function(t) {
        this.systemInfo = wx.getSystemInfoSync();
        var n = wx.getStorageSync("store");
        this.setData({
            store: n
        }), e.pageOnLoad(this);
        var i = this;
        o = !1, a = !1, s = 2, i.loadOrderList(t.status || -1);
        var r = 0;
        r = t.status >= 2 ? 600 : 0, i.setData({
            scrollLeft: r
        });
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onShareAppMessage: function(t) {
        var e = this;
        console.log(t);
        var o = t.target.dataset.index;
        console.log(e.data.order_list[o]);
        var a = "/pages/pt/group/details?oid=" + t.target.dataset.id;
        return {
            title: e.data.order_list[o].goods_list[0].goods_name,
            path: a,
            imageUrl: e.data.order_list[o].goods_list[0].goods_pic,
            success: function(t) {
                console.log(a), console.log(t);
            }
        };
    },
    loadOrderList: function(o) {
        void 0 == o && (o = -1);
        var a = this;
        a.setData({
            status: o
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.group.order.list,
            data: {
                status: a.data.status
            },
            success: function(t) {
                0 == t.code && a.setData({
                    order_list: t.data.list
                }), a.setData({
                    show_no_data_tip: 0 == t.data.list.length
                }), 4 != o && a.countDown();
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    countDown: function() {
        var t = this;
        setInterval(function() {
            var e = t.data.order_list;
            for (var o in e) {
                var a = new Date(e[o].limit_time_ms[0], e[o].limit_time_ms[1] - 1, e[o].limit_time_ms[2], e[o].limit_time_ms[3], e[o].limit_time_ms[4], e[o].limit_time_ms[5]) - new Date(), s = parseInt(a / 1e3 / 60 / 60 / 24, 10), n = parseInt(a / 1e3 / 60 / 60 % 24, 10), i = parseInt(a / 1e3 / 60 % 60, 10), r = parseInt(a / 1e3 % 60, 10);
                s = t.checkTime(s), n = t.checkTime(n), i = t.checkTime(i), r = t.checkTime(r), 
                e[o].limit_time = {
                    days: s,
                    hours: n > 0 ? n : "00",
                    mins: i > 0 ? i : "00",
                    secs: r > 0 ? r : "00"
                }, t.setData({
                    order_list: e
                });
            }
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = t > 0 ? t : 0) < 10 && (t = "0" + t), t;
    },
    onReachBottom: function() {
        var n = this;
        a || o || (a = !0, e.request({
            url: t.group.order.list,
            data: {
                status: n.data.status,
                page: s
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = n.data.order_list.concat(t.data.list);
                    n.setData({
                        order_list: e
                    }), 0 == t.data.list.length && (o = !0);
                }
                s++;
            },
            complete: function() {
                a = !1;
            }
        }));
    },
    goHome: function(t) {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    orderPay: function(o) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), e.request({
            url: t.group.pay_data,
            data: {
                order_id: o.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(t) {
                console.log(t), 0 == t.code && wx.requestPayment({
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {
                        console.log("success"), console.log(t);
                    },
                    fail: function(t) {
                        console.log("fail"), console.log(t);
                    },
                    complete: function(t) {
                        console.log("complete"), console.log(t), "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? wx.redirectTo({
                            url: "/pages/pt/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && wx.redirectTo({
                                    url: "/pages/pt/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && wx.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToGroup: function(t) {
        wx.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    getOfflineQrcode: function(o) {
        var a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: t.group.order.get_qrcode,
            data: {
                order_no: o.currentTarget.dataset.id
            },
            success: function(t) {
                0 == t.code ? a.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    },
    goToCancel: function(o) {
        var a = this;
        wx.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(s) {
                if (s.cancel) return !0;
                s.confirm && (wx.showLoading({
                    title: "操作中"
                }), e.request({
                    url: t.group.order.revoke,
                    data: {
                        order_id: o.currentTarget.dataset.id
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && a.loadOrderList(a.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    switchNav: function(t) {
        var e = t.currentTarget.dataset.status;
        wx.redirectTo({
            url: "/pages/pt/order/order?status=" + e
        });
    },
    goToRefundDetail: function(t) {
        var e = t.currentTarget.dataset.refund_id;
        wx.navigateTo({
            url: "/pages/pt/order-refund-detail/order-refund-detail?id=" + e
        });
    }
});