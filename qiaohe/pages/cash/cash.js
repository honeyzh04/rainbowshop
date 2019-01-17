function a(a, e) {
    return a = parseFloat(a), e = parseFloat(e), a > e ? e : a;
}

var e = require("../../api.js"), t = getApp();

Page({
    data: {
        price: 0,
        cash_max_day: -1,
        selected: -1
    },
    onLoad: function(a) {
        t.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        var a = this, i = wx.getStorageSync("share_setting");
        a.setData({
            share_setting: i
        }), t.request({
            url: e.share.get_price,
            success: function(e) {
                if (0 == e.code) {
                    console.log(e.data);
                    var t = 0, i = "", s = "", n = e.data.cash_last, o = "";
                    1 == e.data.pay_type && (t = 1), 1 == e.data.bank && 3 == e.data.pay_type && (t = 3), 
                    !n || 2 != e.data.pay_type && e.data.pay_type != n.type || (t = n.type, i = n.name, 
                    s = n.mobile, n.mobile, o = n.bank_name);
                    e.data;
                    a.setData({
                        price: e.data.price.price,
                        cash_max_day: e.data.cash_max_day,
                        pay_type: e.data.pay_type,
                        selected: t,
                        name: i,
                        mobile: s,
                        bank: e.data.bank,
                        bank_name: o
                    });
                }
            }
        });
    },
    onPullDownRefresh: function() {},
    formSubmit: function(i) {
        var s = this, n = parseFloat(parseFloat(i.detail.value.cash).toFixed(2)), o = s.data.price;
        if (-1 != s.data.cash_max_day && (o = a(o, s.data.cash_max_day)), n > o) wx.showToast({
            title: "提现金额不能超过" + o + "元",
            image: "/images/icon-warning.png"
        }); else if (n < parseFloat(s.data.share_setting.min_money)) wx.showToast({
            title: "提现金额不能低于" + s.data.share_setting.min_money + "元",
            image: "/images/icon-warning.png"
        }); else {
            var c = i.detail.value.name, d = i.detail.value.mobile;
            if (c && void 0 != c) if (d && void 0 != d) {
                var l = s.data.selected;
                if (0 == l || 1 == l || 3 == l) {
                    if (void 0 === (r = i.detail.value.bank_name)) r = ""; else var r = r;
                    3 != l || r && "" != r ? (wx.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), t.request({
                        url: e.share.apply,
                        method: "POST",
                        data: {
                            cash: n,
                            name: c,
                            mobile: d,
                            bank: r,
                            pay_type: l,
                            scene: "CASH",
                            form_id: i.detail.formId
                        },
                        success: function(a) {
                            wx.hideLoading(), wx.showModal({
                                title: "提示",
                                content: a.msg,
                                showCancel: !1,
                                success: function(e) {
                                    e.confirm && 0 == a.code && wx.redirectTo({
                                        url: "/pages/cash-detail/cash-detail"
                                    });
                                }
                            });
                        }
                    })) : wx.showToast({
                        title: "开户行不能为空",
                        image: "/images/icon-warning.png"
                    });
                } else wx.showToast({
                    title: "请选择提现方式",
                    image: "/images/icon-warning.png"
                });
            } else wx.showToast({
                title: "账号不能为空",
                image: "/images/icon-warning.png"
            }); else wx.showToast({
                title: "姓名不能为空",
                image: "/images/icon-warning.png"
            });
        }
    },
    showCashMaxDetail: function() {
        wx.showModal({
            title: "提示",
            content: "今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额"
        });
    },
    select: function(a) {
        var e = a.currentTarget.dataset.index;
        this.setData({
            selected: e
        });
    }
});