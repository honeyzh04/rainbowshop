var t = require("../../../api.js"), o = getApp();

Page({
    data: {
        goods_list: []
    },
    onLoad: function(e) {
        o.pageOnLoad(this);
        var a = this;
        a.setData({
            order_id: e.id
        }), wx.showLoading({
            title: "正在加载",
            mask: !0
        }), o.request({
            url: t.group.order.comment_preview,
            data: {
                order_id: e.id
            },
            success: function(t) {
                if (wx.hideLoading(), 1 == t.code && wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.navigateBack();
                    }
                }), 0 == t.code) {
                    for (var o in t.data.goods_list) t.data.goods_list[o].score = 3, t.data.goods_list[o].content = "", 
                    t.data.goods_list[o].pic_list = [], t.data.goods_list[o].uploaded_pic_list = [];
                    a.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var o = this, e = t.currentTarget.dataset.index, a = t.currentTarget.dataset.score, i = o.data.goods_list;
        i[e].score = a, o.setData({
            goods_list: i
        });
    },
    contentInput: function(t) {
        var o = this, e = t.currentTarget.dataset.index;
        o.data.goods_list[e].content = t.detail.value, o.setData({
            goods_list: o.data.goods_list
        });
    },
    chooseImage: function(t) {
        var o = this, e = t.currentTarget.dataset.index, a = o.data.goods_list, i = a[e].pic_list.length;
        wx.chooseImage({
            count: 6 - i,
            success: function(t) {
                a[e].pic_list = a[e].pic_list.concat(t.tempFilePaths), o.setData({
                    goods_list: a
                });
            }
        });
    },
    deleteImage: function(t) {
        var o = this, e = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex, i = o.data.goods_list;
        i[e].pic_list.splice(a, 1), o.setData({
            goods_list: i
        });
    },
    commentSubmit: function(e) {
        function a(o) {
            if (o == n.length) return i();
            var e = 0;
            if (!n[o].pic_list.length || 0 == n[o].pic_list.length) return a(o + 1);
            for (var s in n[o].pic_list) !function(i) {
                wx.uploadFile({
                    url: t.default.upload_image,
                    name: "image",
                    filePath: n[o].pic_list[i],
                    complete: function(t) {
                        if (t.data) {
                            var s = JSON.parse(t.data);
                            0 == s.code && (n[o].uploaded_pic_list[i] = s.data.url);
                        }
                        if (++e == n[o].pic_list.length) return a(o + 1);
                    }
                });
            }(s);
        }
        function i() {
            o.request({
                url: t.group.order.comment,
                method: "post",
                data: {
                    order_id: s.data.order_id,
                    goods_list: JSON.stringify(n)
                },
                success: function(t) {
                    wx.hideLoading(), 0 == t.code && wx.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && wx.redirectTo({
                                url: "/pages/pt/order/order?status=2"
                            });
                        }
                    }), 1 == t.code && wx.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
        var s = this;
        wx.showLoading({
            title: "正在提交",
            mask: !0
        });
        var n = s.data.goods_list;
        a(0);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});