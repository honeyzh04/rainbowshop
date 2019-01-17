var t = require("../../api.js"), a = getApp();

Page({
    data: {
        total_price: 0,
        cart_check_all: !1,
        cart_list: []
    },
    onLoad: function(t) {
        a.pageOnLoad(this);
    },
    onReady: function() {},
    onShow: function() {
        a.pageOnShow(this);
        var t = this;
        t.setData({
            cart_check_all: !1,
            show_cart_edit: !1
        }), t.getCartList();
    },
    getCartList: function() {
        var c = this;
        c.setData({
            show_no_data_tip: !1
        }), a.request({
            url: t.cart.list,
            success: function(t) {
                0 == t.code && c.setData({
                    cart_list: t.data.list,
                    total_price: 0,
                    cart_check_all: !1,
                    show_cart_edit: !1
                }), c.setData({
                    show_no_data_tip: 0 == c.data.cart_list.length
                });
            }
        });
    },
    cartCheck: function(t) {
        var a = this, c = t.currentTarget.dataset.index, e = a.data.cart_list;
        e[c].checked ? e[c].checked = !1 : e[c].checked = !0, a.setData({
            cart_list: e
        }), a.updateTotalPrice();
    },
    cartCheckAll: function() {
        var t = this, a = t.data.cart_list, c = !1;
        c = !t.data.cart_check_all;
        for (var e in a) a[e].disabled && !t.data.show_cart_edit || (a[e].checked = c);
        t.setData({
            cart_check_all: c,
            cart_list: a
        }), t.updateTotalPrice();
    },
    updateTotalPrice: function() {
        var t = this, a = 0, c = t.data.cart_list;
        for (var e in c) c[e].checked && (a += c[e].price);
        t.setData({
            total_price: a.toFixed(2)
        });
    },
    cartSubmit: function() {
        var t = this.data.cart_list, a = [];
        for (var c in t) t[c].checked && a.push(t[c].cart_id);
        if (0 == a.length) return !0;
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?cart_id_list=" + JSON.stringify(a)
        });
    },
    cartEdit: function() {
        var t = this, a = t.data.cart_list;
        for (var c in a) a[c].checked = !1;
        t.setData({
            cart_list: a,
            show_cart_edit: !0,
            cart_check_all: !1
        }), t.updateTotalPrice();
    },
    cartDone: function() {
        var t = this, a = t.data.cart_list;
        for (var c in a) a[c].checked = !1;
        t.setData({
            cart_list: a,
            show_cart_edit: !1,
            cart_check_all: !1
        }), t.updateTotalPrice();
    },
    cartDelete: function() {
        var c = this, e = c.data.cart_list, i = [];
        for (var r in e) e[r].checked && i.push(e[r].cart_id);
        if (0 == i.length) return !0;
        wx.showModal({
            title: "提示",
            content: "确认删除" + i.length + "项内容？",
            success: function(e) {
                if (e.cancel) return !0;
                wx.showLoading({
                    title: "正在删除",
                    mask: !0
                }), a.request({
                    url: t.cart.delete,
                    data: {
                        cart_id_list: JSON.stringify(i)
                    },
                    success: function(t) {
                        wx.hideLoading(), wx.showToast({
                            title: t.msg
                        }), 0 == t.code && c.getCartList(), t.code;
                    }
                });
            }
        });
    }
});