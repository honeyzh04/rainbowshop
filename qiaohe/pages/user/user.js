var e = require("../../api.js"), t = getApp();

Page({
    data: {
        contact_tel: "",
        show_customer_service: 0
    },
    onLoad: function(e) {
        t.pageOnLoad(this);
    },
    loadData: function(a) {
        var o = this;
        o.setData({
            store: wx.getStorageSync("store")
        });
        var n = wx.getStorageSync("pages_user_user");
        n && o.setData(n), t.request({
            url: e.user.index,
            success: function(e) {
                0 == e.code && (o.setData(e.data), wx.setStorageSync("pages_user_user", e.data), 
                wx.setStorageSync("share_setting", e.data.share_setting), wx.setStorageSync("user_info", e.data.user_info));
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        t.pageOnShow(this), this.loadData();
    },
    callTel: function(e) {
        var t = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: t
        });
    },
    apply: function(a) {
        var o = wx.getStorageSync("share_setting"), n = wx.getStorageSync("user_info");
        console.log(a), 1 == o.share_condition ? wx.navigateTo({
            url: "/pages/add-share/index"
        }) : 0 != o.share_condition && 2 != o.share_condition || (0 == n.is_distributor ? wx.showModal({
            title: "申请成为分销商",
            content: "是否申请？",
            success: function(s) {
                s.confirm && (wx.showLoading({
                    title: "正在加载",
                    mask: !0
                }), t.request({
                    url: e.share.join,
                    method: "POST",
                    data: {
                        form_id: a.detail.formId
                    },
                    success: function(e) {
                        0 == e.code && (0 == o.share_condition ? (n.is_distributor = 2, wx.navigateTo({
                            url: "/pages/add-share/index"
                        })) : (n.is_distributor = 1, wx.navigateTo({
                            url: "/pages/share/index"
                        })), wx.setStorageSync("user_info", n));
                    },
                    complete: function() {
                        wx.hideLoading();
                    }
                }));
            }
        }) : wx.navigateTo({
            url: "/pages/add-share/index"
        }));
    },
    verify: function(e) {
        wx.scanCode({
            onlyFromCamera: !1,
            success: function(e) {
                console.log(e), wx.navigateTo({
                    url: "/" + e.path
                });
            },
            fail: function(e) {
                wx.showToast({
                    title: "失败"
                });
            }
        });
    },
    member: function() {
        wx.navigateTo({
            url: "/pages/member/member"
        });
    }
});