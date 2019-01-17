var a = require("../../../api.js"), e = getApp(), t = "", o = "";

Page({
    data: {
        address: null,
        offline: 1
    },
    onLoad: function(a) {
        e.pageOnLoad(this);
        var t, o = this, s = a.goods_info, i = JSON.parse(s);
        t = 3 == i.deliver_type || 1 == i.deliver_type ? 1 : 2, o.setData({
            options: a,
            type: i.type,
            offline: t,
            parent_id: i.parent_id ? i.parent_id : 0
        });
    },
    onReady: function() {},
    onShow: function() {
        e.pageOnShow(this);
        var a = this, t = wx.getStorageSync("picker_address");
        t && (a.setData({
            address: t,
            name: t.name,
            mobile: t.mobile
        }), wx.removeStorageSync("picker_address")), a.getOrderData(a.data.options);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    getOrderData: function(s) {
        var i = this, d = "";
        i.data.address && i.data.address.id && (d = i.data.address.id), s.goods_info && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), e.request({
            url: a.group.submit_preview,
            data: {
                goods_info: s.goods_info,
                address_id: d,
                type: i.data.type,
                longitude: t,
                latitude: o
            },
            success: function(a) {
                if (wx.hideLoading(), 0 == a.code) {
                    if (2 == i.data.offline) var e = parseFloat(a.data.total_price - a.data.colonel > 0 ? a.data.total_price - a.data.colonel : .01), t = 0; else var e = parseFloat(a.data.total_price - a.data.colonel > 0 ? a.data.total_price - a.data.colonel : .01) + a.data.express_price, t = parseFloat(a.data.express_price);
                    i.setData({
                        total_price: a.data.total_price,
                        goods_list: a.data.list,
                        goods_info: a.data.goods_info,
                        address: a.data.address,
                        express_price: t,
                        coupon_list: a.data.coupon_list,
                        name: a.data.address ? a.data.address.name : "",
                        mobile: a.data.address ? a.data.address.mobile : "",
                        send_type: a.data.send_type,
                        level: a.data.level,
                        total_price_1: e.toFixed(2),
                        colonel: a.data.colonel,
                        shop_list: a.data.shop_list,
                        shop: {},
                        res: a.data
                    });
                }
                1 == a.code && wx.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(a) {
                        a.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        }));
    },
    bindkeyinput: function(a) {
        this.setData({
            content: a.detail.value
        });
    },
    orderSubmit: function() {
        var t = this, o = {}, s = t.data.offline;
        if (o.offline = s, 1 == s) {
            if (!t.data.address || !t.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            o.address_id = t.data.address.id;
        } else {
            if (o.address_name = t.data.name, o.address_mobile = t.data.mobile, !t.data.shop.id) return void wx.showToast({
                title: "请选择核销门店",
                image: "/images/icon-warning.png"
            });
            if (o.shop_id = t.data.shop.id, console.log(o.address_name), !o.address_name || void 0 == o.address_name) return void wx.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!o.address_mobile || void 0 == o.address_mobile) return void wx.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^1\d{10}$/.test(o.address_mobile)) return void wx.showModal({
                title: "提示",
                content: "手机号格式不正确"
            });
        }
        t.data.goods_info && (o.goods_info = JSON.stringify(t.data.goods_info)), t.data.picker_coupon && (o.user_coupon_id = t.data.picker_coupon.user_coupon_id), 
        t.data.content && (o.content = t.data.content), t.data.type && (o.type = t.data.type), 
        t.data.parent_id && (o.parent_id = t.data.parent_id), wx.showLoading({
            title: "正在提交",
            mask: !0
        }), e.request({
            url: a.group.submit,
            method: "post",
            data: o,
            success: function(o) {
                if (0 == o.code) {
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3), setTimeout(function() {
                        t.setData({
                            options: {}
                        });
                    }, 1);
                    var s = o.data.order_id;
                    e.request({
                        url: a.group.pay_data,
                        data: {
                            order_id: s,
                            pay_type: "WECHAT_PAY"
                        },
                        success: function(a) {
                            0 != a.code ? 1 != a.code || wx.showToast({
                                title: a.msg,
                                image: "/images/icon-warning.png"
                            }) : wx.requestPayment({
                                timeStamp: a.data.timeStamp,
                                nonceStr: a.data.nonceStr,
                                package: a.data.package,
                                signType: a.data.signType,
                                paySign: a.data.paySign,
                                success: function(a) {
                                    "ONLY_BUY" == t.data.type ? wx.redirectTo({
                                        url: "/pages/pt/order/order?status=2"
                                    }) : wx.redirectTo({
                                        url: "/pages/pt/group/details?oid=" + s
                                    });
                                },
                                fail: function(a) {},
                                complete: function(a) {
                                    "requestPayment:fail" != a.errMsg && "requestPayment:fail cancel" != a.errMsg ? "requestPayment:ok" != a.errMsg && wx.redirectTo({
                                        url: "/pages/pt/order/order?status=-1"
                                    }) : wx.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认",
                                        success: function(a) {
                                            a.confirm && wx.redirectTo({
                                                url: "/pages/pt/order/order?status=0"
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                if (1 == o.code) return wx.hideLoading(), void wx.showToast({
                    title: o.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    KeyName: function(a) {
        this.setData({
            name: a.detail.value
        });
    },
    KeyMobile: function(a) {
        this.setData({
            mobile: a.detail.value
        });
    },
    getOffline: function(a) {
        var e = this, t = a.target.dataset.index, o = parseFloat(e.data.res.total_price - e.data.res.colonel > 0 ? e.data.res.total_price - e.data.res.colonel : .01) + e.data.res.express_price;
        if (1 == t) this.setData({
            offline: 1,
            express_price: e.data.res.express_price,
            total_price_1: o.toFixed(2)
        }); else {
            var s = (e.data.total_price_1 - e.data.express_price).toFixed(2);
            this.setData({
                offline: 2,
                express_price: 0,
                total_price_1: s
            });
        }
    },
    showShop: function(a) {
        var e = this;
        e.dingwei(), e.data.shop_list && e.data.shop_list.length >= 1 && e.setData({
            show_shop: !0
        });
    },
    dingwei: function() {
        var a = this;
        wx.chooseLocation({
            success: function(e) {
                t = e.longitude, o = e.latitude, a.setData({
                    location: e.address
                });
            },
            fail: function(t) {
                e.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(e) {
                        e && (e.authSetting["scope.userLocation"] ? a.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    pickShop: function(a) {
        var e = this, t = a.currentTarget.dataset.index;
        "-1" == t || -1 == t ? e.setData({
            shop: !1,
            show_shop: !1
        }) : e.setData({
            shop: e.data.shop_list[t],
            show_shop: !1
        });
    }
});