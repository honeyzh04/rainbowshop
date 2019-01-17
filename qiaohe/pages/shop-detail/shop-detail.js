var t = require("../../api.js"), o = (require("../../utils.js"), getApp()), e = require("../../wxParse/wxParse.js");

Page({
    data: {
        score: [ 1, 2, 3, 4, 5 ]
    },
    onLoad: function(n) {
        o.pageOnLoad(this);
        var a = this, s = n.user_id;
        o.loginBindParent({
            parent_id: s
        }), a.setData({
            shop_id: n.shop_id
        }), console.log(s), wx.showLoading({
            title: "加载中"
        }), o.request({
            url: t.default.shop_detail,
            method: "GET",
            data: {
                shop_id: n.shop_id
            },
            success: function(t) {
                if (0 == t.code) {
                    a.setData(t.data);
                    var o = t.data.shop.content ? t.data.shop.content : "<span>暂无信息</span>";
                    e.wxParse("detail", "html", o, a);
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/shop/shop"
                        });
                    }
                });
            },
            complete: function() {
                wx.hideLoading();
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        o.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    mobile: function() {
        var t = this;
        wx.makePhoneCall({
            phoneNumber: t.data.shop.mobile
        });
    },
    goto: function() {
        var t = this;
        wx.getSetting({
            success: function(e) {
                e.authSetting["scope.userLocation"] ? t.location() : o.getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(o) {
                        o.authSetting["scope.userLocation"] && t.location();
                    }
                });
            }
        });
    },
    location: function() {
        var t = this.data.shop;
        wx.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            name: t.name,
            address: t.address
        });
    },
    onShareAppMessage: function(t) {
        var o = this, e = wx.getStorageSync("user_info");
        return {
            path: "/pages/shop-detail/shop-detail?shop_id=" + o.data.shop_id + "&user_id=" + e.id
        };
    }
});