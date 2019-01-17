var o = require("../../../api.js"), t = getApp();

Page({
    data: {},
    onLoad: function(o) {
        t.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        t.pageOnShow(this), this.loadOrderDetails();
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var o = this, t = "/pages/pt/group/details?oid=" + o.data.order_info.order_id;
        return {
            title: o.data.order_info.goods_list[0].name,
            path: t,
            imageUrl: o.data.order_info.goods_list[0].goods_pic,
            success: function(o) {
                console.log(t), console.log(o);
            }
        };
    },
    loadOrderDetails: function() {
        var e = this, n = e.options.scene;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), t.request({
            url: o.group.order.clerk_order_details,
            data: {
                id: n
            },
            success: function(o) {
                0 == o.code ? (3 != o.data.status && e.countDownRun(o.data.limit_time_ms), e.setData({
                    order_info: o.data,
                    limit_time: o.data.limit_time
                })) : wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    copyText: function(o) {
        var t = o.currentTarget.dataset.text;
        wx.setClipboardData({
            data: t,
            success: function() {
                wx.showToast({
                    title: "已复制"
                });
            }
        });
    },
    clerkOrder: function(e) {
        var n = this;
        console.log(n.data.order), wx.showModal({
            title: "提示",
            content: "是否确认核销？",
            success: function(e) {
                e.confirm ? (wx.showLoading({
                    title: "正在加载"
                }), t.request({
                    url: o.group.order.clerk,
                    data: {
                        order_id: n.data.order_info.order_id
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
                })) : e.cancel;
            }
        });
    },
    location: function() {
        var o = this.data.order_info.shop;
        wx.openLocation({
            latitude: parseFloat(o.latitude),
            longitude: parseFloat(o.longitude),
            address: o.address,
            name: o.name
        });
    }
});