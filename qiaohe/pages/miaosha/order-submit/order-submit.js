var t = require("../../../api.js"), a = getApp(), e = "", s = "", i = require("../../../utils/utils.js");

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        content: "",
        offline: 0,
        express_price_1: 0,
        name: "",
        mobile: "",
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: 0,
        show_payment: !1
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
        var e = this, s = i.formatData(new Date());
        e.setData({
            options: t,
            store: wx.getStorageSync("store"),
            time: s
        });
    },
    bindkeyinput: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function(t) {
        var a = this, e = this.data.express_price, s = this.data.express_price_1;
        1 == t.target.dataset.index ? this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: e
        }) : this.setData({
            offline: 0,
            express_price: s
        }), a.getPrice();
    },
    dingwei: function() {
        var t = this;
        wx.chooseLocation({
            success: function(a) {
                e = a.longitude, s = a.latitude, t.setData({
                    location: a.address
                });
            },
            fail: function(e) {
                a.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(a) {
                        a && (a.authSetting["scope.userLocation"] ? t.dingwei() : wx.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(e) {
        var s = this, i = s.data.offline, o = {};
        if (0 == i) {
            if (!s.data.address || !s.data.address.id) return void wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            o.address_id = s.data.address.id;
        } else {
            if (o.address_name = s.data.name, o.address_mobile = s.data.mobile, !s.data.shop.id) return void wx.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (o.shop_id = s.data.shop.id, !o.address_name || void 0 == o.address_name) return void s.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!o.address_mobile || void 0 == o.address_mobile) return void s.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^1\d{10}$/.test(o.address_mobile)) return void wx.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
        }
        o.offline = i, s.data.cart_id_list && (o.cart_id_list = JSON.stringify(s.data.cart_id_list)), 
        s.data.goods_info && (o.goods_info = JSON.stringify(s.data.goods_info)), s.data.picker_coupon && (o.user_coupon_id = s.data.picker_coupon.user_coupon_id), 
        s.data.content && (o.content = s.data.content), wx.showLoading({
            title: "正在提交",
            mask: !0
        }), 1 == s.data.integral_radio ? o.use_integral = 1 : o.use_integral = 2, o.payment = s.data.payment, 
        a.request({
            url: t.miaosha.submit,
            method: "post",
            data: o,
            success: function(i) {
                if (0 == i.code) {
                    setTimeout(function() {
                        wx.hideLoading();
                    }, 1e3), setTimeout(function() {
                        s.setData({
                            options: {}
                        });
                    }, 1);
                    var d = i.data.order_id;
                    0 == o.payment && a.request({
                        url: t.miaosha.pay_data,
                        data: {
                            order_id: d,
                            pay_type: "WECHAT_PAY"
                        },
                        success: function(t) {
                            0 != t.code ? 1 != t.code || s.showToast({
                                title: t.msg,
                                image: "/images/icon-warning.png"
                            }) : wx.requestPayment({
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                success: function(t) {
                                    wx.redirectTo({
                                        url: "/pages/miaosha/order/order?status=1"
                                    });
                                },
                                fail: function(t) {},
                                complete: function(t) {
                                    "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg ? wx.redirectTo({
                                        url: "/pages/miaosha/order/order?status=-1"
                                    }) : s.data.goods_card_list.length > 0 ? s.setData({
                                        show_card: !0
                                    }) : wx.redirectTo({
                                        url: "/pages/miaosha/order/order?status=-1"
                                    }) : wx.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认",
                                        success: function(t) {
                                            t.confirm && wx.redirectTo({
                                                url: "/pages/miaosha/order/order?status=0"
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }), 2 == o.payment && a.request({
                        url: t.order.pay_data,
                        data: {
                            order_id: d,
                            pay_type: "HUODAO_PAY",
                            form_id: e.detail.formId
                        },
                        success: function(t) {
                            0 == t.code ? wx.redirectTo({
                                url: "/pages/miaosha/order/order?status=-1"
                            }) : s.showToast({
                                title: t.msg,
                                image: "/images/icon-warning.png"
                            });
                        }
                    });
                }
                if (1 == i.code) return wx.hideLoading(), void s.showToast({
                    title: i.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this, a = wx.getStorageSync("picker_address");
        a && (t.setData({
            address: a,
            name: a.name,
            mobile: a.mobile
        }), wx.removeStorageSync("picker_address")), t.getOrderData(t.data.options);
    },
    getOrderData: function(i) {
        var o = this, d = "";
        if (o.data.address && o.data.address.id && (d = o.data.address.id), i.cart_id_list) {
            JSON.parse(i.cart_id_list);
            wx.showLoading({
                title: "正在加载",
                mask: !0
            }), a.request({
                url: t.order.submit_preview,
                data: {
                    cart_id_list: i.cart_id_list,
                    address_id: d,
                    longitude: e,
                    latitude: s
                },
                success: function(t) {
                    if (wx.hideLoading(), 0 == t.code) {
                        var a = t.data.shop_list, e = {};
                        1 == a.length && (e = a[0]), o.setData({
                            total_price: parseFloat(t.data.total_price),
                            goods_list: t.data.list,
                            cart_id_list: t.data.cart_id_list,
                            address: t.data.address,
                            express_price: parseFloat(t.data.express_price),
                            coupon_list: t.data.coupon_list,
                            shop_list: a,
                            shop: e,
                            name: t.data.address ? t.data.address.name : "",
                            mobile: t.data.address ? t.data.address.mobile : "",
                            send_type: t.data.send_type,
                            level: t.data.level,
                            new_total_price: parseFloat(t.data.total_price),
                            integral: t.data.integral,
                            goods_card_list: t.data.goods_card_list,
                            form: t.data.form,
                            is_payment: t.data.is_payment,
                            is_coupon: t.data.list[0].coupon,
                            is_discount: t.data.list[0].is_discount
                        }), 1 == t.data.send_type && o.setData({
                            offline: 0
                        }), 2 == t.data.send_type && o.setData({
                            offline: 1
                        }), o.getPrice();
                    }
                    1 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        confirmText: "返回",
                        success: function(t) {
                            t.confirm && wx.navigateBack({
                                delta: 1
                            });
                        }
                    });
                }
            });
        }
        i.goods_info && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.miaosha.submit_preview,
            data: {
                goods_info: i.goods_info,
                address_id: d,
                longitude: e,
                latitude: s
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = t.data.shop_list, e = {};
                    1 == a.length && (e = a[0]), o.setData({
                        total_price: t.data.total_price,
                        goods_list: t.data.list,
                        goods_info: t.data.goods_info,
                        address: t.data.address,
                        express_price: parseFloat(t.data.express_price),
                        coupon_list: t.data.coupon_list,
                        shop_list: a,
                        shop: e,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        send_type: t.data.send_type,
                        level: t.data.level,
                        new_total_price: t.data.total_price,
                        integral: t.data.integral,
                        goods_card_list: t.data.goods_card_list,
                        form: t.data.form,
                        is_payment: t.data.is_payment,
                        is_coupon: t.data.list[0].coupon,
                        is_discount: t.data.list[0].is_discount
                    }), 1 == t.data.send_type && o.setData({
                        offline: 0
                    }), 2 == t.data.send_type && o.setData({
                        offline: 1
                    }), o.getPrice();
                }
                1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && wx.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        }));
    },
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        a && wx.setClipboardData({
            data: a,
            success: function() {
                page.showToast({
                    title: "已复制内容"
                });
            },
            fail: function() {
                page.showToast({
                    title: "复制失败",
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    showCouponPicker: function() {
        var t = this;
        t.data.coupon_list && t.data.coupon_list.length > 0 && t.setData({
            show_coupon_picker: !0
        });
    },
    pickCoupon: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        "-1" == e || -1 == e ? a.setData({
            picker_coupon: !1,
            show_coupon_picker: !1
        }) : a.setData({
            picker_coupon: a.data.coupon_list[e],
            show_coupon_picker: !1
        }), a.getPrice();
    },
    numSub: function(t, a, e) {
        return 100;
    },
    showShop: function(t) {
        var a = this;
        a.dingwei(), a.data.shop_list && a.data.shop_list.length >= 1 && a.setData({
            show_shop: !0
        });
    },
    pickShop: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        "-1" == e || -1 == e ? a.setData({
            shop: !1,
            show_shop: !1
        }) : a.setData({
            shop: a.data.shop_list[e],
            show_shop: !1
        }), a.getPrice();
    },
    integralSwitchChange: function(t) {
        var a = this;
        0 != t.detail.value ? a.setData({
            integral_radio: 1
        }) : a.setData({
            integral_radio: 2
        }), a.getPrice();
    },
    integration: function(t) {
        var a = this.data.integral.integration;
        wx.showModal({
            title: "积分使用规则",
            content: a,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm && console.log("用户点击确定");
            }
        });
    },
    getPrice: function() {
        var t = this, a = t.data.total_price, e = t.data.express_price, s = t.data.picker_coupon, i = t.data.integral, o = t.data.integral_radio, d = t.data.level, n = t.data.offline;
        s && (a -= s.sub_price), i && 1 == o && (a -= parseFloat(i.forehead)), d && (a = a * d.discount / 10), 
        a <= .01 && (a = .01), 0 == n && (a += e), t.setData({
            new_total_price: parseFloat(a.toFixed(2))
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), wx.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.form, i = s.list;
        i[e].default = t.detail.value, s.list = i, a.setData({
            form: s
        });
    },
    selectForm: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = t.currentTarget.dataset.k, i = a.data.form, o = i.list;
        if ("radio" == o[e].type) {
            var d = o[e].default_list;
            for (var n in d) n == s ? d[s].is_selected = 1 : d[n].is_selected = 0;
            o[e].default_list = d;
        }
        "checkbox" == o[e].type && (1 == (d = o[e].default_list)[s].is_selected ? d[s].is_selected = 0 : d[s].is_selected = 1, 
        o[e].default_list = d), i.list = o, a.setData({
            form: i
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            payment: a
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    }
});