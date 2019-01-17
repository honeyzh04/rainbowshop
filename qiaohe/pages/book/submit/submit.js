var t = require("../../../api.js"), e = require("../../../utils/utils.js"), a = getApp();

Page({
    data: {},
    onLoad: function(t) {
        a.pageOnLoad(this), this.getPreview(t);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkboxChange: function(t) {
        console.log(t.target.dataset.id);
        var e = this, a = t.target.dataset.pid, o = t.target.dataset.id, i = e.data.form_list, s = i[a].default[o].selected;
        i[a].default[o].selected = 1 != s, e.setData({
            form_list: i
        });
    },
    radioChange: function(t) {
        var e = this, a = t.target.dataset.pid, o = e.data.form_list;
        for (var i in o[a].default) t.target.dataset.id == i ? o[a].default[i].selected = !0 : o[a].default[i].selected = !1;
        e.setData({
            form_list: o
        });
    },
    inputChenge: function(t) {
        console.log(t);
        var e = this, a = t.target.dataset.id, o = e.data.form_list;
        o[a].default = t.detail.value, e.setData({
            form_list: o
        });
    },
    getPreview: function(o) {
        var i = this, s = o.id;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), a.request({
            url: t.book.submit_preview,
            method: "get",
            data: {
                gid: s
            },
            success: function(t) {
                if (0 == t.code) {
                    for (var a in t.data.form_list) "date" == t.data.form_list[a].type && (t.data.form_list[a].default = t.data.form_list[a].default ? t.data.form_list[a].default : e.formatData(new Date())), 
                    "time" == t.data.form_list[a].type && (t.data.form_list[a].default = t.data.form_list[a].default ? t.data.form_list[a].default : "00:00");
                    i.setData({
                        goods: t.data.goods,
                        form_list: t.data.form_list
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    submit: function(e) {
        var o = e.detail.formId, i = this, s = i.data.goods.id, n = JSON.stringify(i.data.form_list);
        console.log(n), wx.showLoading({
            title: "正在提交",
            mask: !0
        }), a.request({
            url: t.book.submit,
            method: "post",
            data: {
                gid: s,
                form_list: n,
                form_id: o
            },
            success: function(t) {
                if (0 == t.code) {
                    if (1 != t.type) return wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), void wx.requestPayment({
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        success: function(t) {
                            wx.redirectTo({
                                url: "/pages/book/order/order?status=1"
                            });
                        },
                        fail: function(t) {},
                        complete: function(t) {
                            setTimeout(function() {
                                wx.hideLoading();
                            }, 1e3), "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg && wx.redirectTo({
                                url: "/pages/book/order/order?status=-1"
                            }) : wx.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(t) {
                                    t.confirm && wx.redirectTo({
                                        url: "/pages/book/order/order?status=0"
                                    });
                                }
                            });
                        }
                    });
                    wx.redirectTo({
                        url: "/pages/book/order/order?status=1"
                    });
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {}
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    }
});