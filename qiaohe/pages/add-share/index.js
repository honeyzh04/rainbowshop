var e = require("../../api.js"), a = getApp();

Page({
    data: {
        form: {
            name: "",
            mobile: ""
        },
        img: "/images/img-share-un.png",
        agree: 0
    },
    onLoad: function(e) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        var t = this, o = wx.getStorageSync("user_info"), n = wx.getStorageSync("store"), i = wx.getStorageSync("share_setting");
        wx.showLoading({
            title: "加载中"
        }), a.pageOnShow(t), t.setData({
            user_info: o,
            store: n,
            share_setting: i
        }), a.request({
            url: e.share.check,
            method: "POST",
            success: function(e) {
                0 == e.code && (o.is_distributor = e.data, wx.setStorageSync("user_info", o), 1 == e.data && wx.redirectTo({
                    url: "/pages/share/index"
                })), t.setData({
                    user_info: o
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    formSubmit: function(t) {
        var o = this, n = wx.getStorageSync("user_info");
        if (o.data.form = t.detail.value, void 0 != o.data.form.name && "" != o.data.form.name) if (void 0 != o.data.form.mobile && "" != o.data.form.mobile) {
            var i = t.detail.value;
            i.form_id = t.detail.formId, 0 != o.data.agree ? (console.log(o.data.agree), wx.showLoading({
                title: "正在提交",
                mask: !0
            }), a.request({
                url: e.share.join,
                method: "POST",
                data: i,
                success: function(e) {
                    0 == e.code ? (n.is_distributor = 2, wx.setStorageSync("user_info", n), wx.redirectTo({
                        url: "/pages/add-share/index"
                    })) : wx.showToast({
                        title: e.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            })) : wx.showToast({
                title: "请先阅读并确认分销申请协议！！",
                image: "/images/icon-warning.png"
            });
        } else wx.showToast({
            title: "请填写联系方式！",
            image: "/images/icon-warning.png"
        }); else wx.showToast({
            title: "请填写姓名！",
            image: "/images/icon-warning.png"
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    agreement: function() {
        var e = wx.getStorageSync("share_setting");
        wx.showModal({
            title: "分销协议",
            content: e.agree,
            showCancel: !1,
            confirmText: "我已阅读",
            confirmColor: "#ff4544",
            success: function(e) {
                e.confirm && console.log("用户点击确定");
            }
        });
    },
    agree: function() {
        var e = this, a = e.data.agree;
        0 == a ? (a = 1, e.setData({
            img: "/images/img-share-agree.png",
            agree: a
        })) : 1 == a && (a = 0, e.setData({
            img: "/images/img-share-un.png",
            agree: a
        }));
    }
});