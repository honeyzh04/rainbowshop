var o = require("../../../api.js"), e = (require("../../../utils.js"), getApp());

Page({
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(o) {
        console.log(o), this.getOrderDetails(o);
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
        var n = t.scene, i = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: o.book.clerk_order_details,
            method: "get",
            data: {
                id: n
            },
            success: function(o) {
                0 == o.code ? i.setData({
                    goods: o.data
                }) : wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/user/user"
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
    nowWriteOff: function(t) {
        var n = this;
        console.log(n.data.order), wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(t) {
                t.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), e.request({
                    url: o.book.clerk,
                    data: {
                        order_id: n.data.goods.id
                    },
                    success: function(o) {
                        0 == o.code ? wx.redirectTo({
                            url: "/pages/user/user"
                        }) : wx.showModal({
                            title: "警告！",
                            showCancel: !1,
                            content: o.msg,
                            confirmText: "确认",
                            success: function(o) {
                                o.confirm && wx.redirectTo({
                                    url: "/pages/index/index"
                                });
                            }
                        });
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                })) : t.cancel;
            }
        });
    }
});