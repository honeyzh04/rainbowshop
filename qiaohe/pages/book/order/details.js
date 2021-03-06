var o = require("../../../api.js"), e = (require("../../../utils.js"), getApp());

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(o) {
        e.pageOnLoad(this), this.getOrderDetails(o);
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderDetails: function(t) {
        var n = t.oid, a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: o.book.order_details,
            method: "get",
            data: {
                id: n
            },
            success: function(o) {
                0 == o.code ? a.setData({
                    goods: o.data
                }) : wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        });
                    }
                });
            },
            complete: function(o) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    goToGoodsDetails: function(o) {
        wx.redirectTo({
            url: "/pages/book/details/details?id=" + this.data.goods.goods_id
        });
    },
    orderCancel: function(t) {
        wx.showLoading({
            title: "正在加载",
            mask: !0
        });
        var n = t.currentTarget.dataset.id;
        e.request({
            url: o.book.order_cancel,
            data: {
                id: n
            },
            success: function(o) {
                0 == o.code && wx.redirectTo({
                    url: "/pages/book/order/order?status=0"
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    GoToPay: function(t) {
        wx.showLoading({
            title: "正在提交",
            mask: !0
        }), e.request({
            url: o.book.order_pay,
            data: {
                id: t.currentTarget.dataset.id
            },
            complete: function() {
                wx.hideLoading();
            },
            success: function(o) {
                console.log(o), 0 == o.code && wx.requestPayment({
                    timeStamp: o.data.timeStamp,
                    nonceStr: o.data.nonceStr,
                    package: o.data.package,
                    signType: o.data.signType,
                    paySign: o.data.paySign,
                    success: function(o) {
                        console.log("success"), console.log(o);
                    },
                    fail: function(o) {
                        console.log("fail"), console.log(o);
                    },
                    complete: function(o) {
                        console.log("complete"), console.log(o), "requestPayment:fail" != o.errMsg && "requestPayment:fail cancel" != o.errMsg ? wx.redirectTo({
                            url: "/pages/book/order/order?status=1"
                        }) : wx.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(o) {
                                o.confirm && wx.redirectTo({
                                    url: "/pages/book/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == o.code && wx.showToast({
                    title: o.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    goToShopList: function(o) {
        wx.redirectTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id
        });
    },
    orderQrcode: function(t) {
        var n = this;
        t.target.dataset.index;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), n.data.goods.offline_qrcode ? (n.setData({
            hide: 0,
            qrcode: n.data.goods.offline_qrcode
        }), wx.hideLoading()) : e.request({
            url: o.book.get_qrcode,
            data: {
                order_no: n.data.goods.order_no
            },
            success: function(o) {
                0 == o.code ? n.setData({
                    hide: 0,
                    qrcode: o.data.url
                }) : wx.showModal({
                    title: "提示",
                    content: o.msg
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    hide: function(o) {
        this.setData({
            hide: 1
        });
    },
    comment: function(o) {
        wx.navigateTo({
            url: "/pages/book/order-comment/order-comment?id=" + o.target.dataset.id,
            success: function(o) {},
            fail: function(o) {},
            complete: function(o) {}
        });
    }
});