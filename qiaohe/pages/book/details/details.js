function o(o, t, e) {
    return t in o ? Object.defineProperty(o, t, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : o[t] = e, o;
}

var t, e = require("../../../api.js"), a = require("../../../utils.js"), s = getApp(), i = require("../../../wxParse/wxParse.js"), n = 1, c = !1, d = !0;

Page((t = {
    data: {
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        }
    },
    onLoad: function(o) {
        s.pageOnLoad(this);
        var t = 0, e = o.user_id;
        console.log("options=>" + JSON.stringify(o));
        var i = decodeURIComponent(o.scene);
        if (void 0 != e) t = e; else if (void 0 != i) {
            console.log("scene string=>" + i);
            var c = a.scene_decode(i);
            console.log("scene obj=>" + JSON.stringify(c)), c.uid && c.gid ? (t = c.uid, o.id = c.gid) : t = i;
        }
        s.loginBindParent({
            parent_id: t
        }), this.setData({
            id: o.id
        }), n = 1, this.getGoodsInfo(o), this.getCommentList(!1);
    },
    onReady: function() {},
    onShow: function() {
        s.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getCommentList(!0);
    },
    onShareAppMessage: function() {
        var o = this, t = wx.getStorageSync("user_info");
        return {
            title: o.data.goods.name,
            path: "/pages/book/details/details?id=" + o.data.goods.id + "&user_id=" + t.id,
            imageUrl: o.data.goods.cover_pic,
            success: function(o) {}
        };
    },
    getGoodsInfo: function(o) {
        var t = o.id, a = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), s.request({
            url: e.book.details,
            method: "get",
            data: {
                gid: t
            },
            success: function(o) {
                if (0 == o.code) {
                    var t = o.data.info.detail;
                    i.wxParse("detail", "html", t, a);
                    var e = parseInt(o.data.info.virtual_sales) + parseInt(o.data.info.sales);
                    a.setData({
                        goods: o.data.info,
                        shop: o.data.shopList,
                        sales: e
                    });
                } else wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm && wx.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(o) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }
        });
    },
    tabSwitch: function(o) {
        var t = this;
        "detail" == o.currentTarget.dataset.tab ? t.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : t.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(o) {
        console.log(o);
        var t = this, e = o.currentTarget.dataset.index, a = o.currentTarget.dataset.picIndex;
        wx.previewImage({
            current: t.data.comment_list[e].pic_list[a],
            urls: t.data.comment_list[e].pic_list
        });
    },
    bespeakNow: function(o) {
        wx.redirectTo({
            url: "/pages/book/submit/submit?id=" + this.data.goods.id
        });
    },
    goToShopList: function(o) {
        wx.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(o) {},
            fail: function(o) {},
            complete: function(o) {}
        });
    },
    getCommentList: function(o) {
        console.log(o);
        var t = this;
        o && "active" != t.data.tab_comment || c || d && (c = !0, s.request({
            url: e.book.goods_comment,
            data: {
                goods_id: t.data.id,
                page: n
            },
            success: function(e) {
                0 == e.code && (c = !1, n++, console.log(e.data.list), t.setData({
                    comment_count: e.data.comment_count,
                    comment_list: o ? t.data.comment_list.concat(e.data.list) : e.data.list
                }), 0 == e.data.list.length && (d = !1));
            }
        }));
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var o = this;
        if (o.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), o.data.goods_qrcode) return !0;
        s.request({
            url: e.book.goods_qrcode,
            data: {
                goods_id: o.data.id
            },
            success: function(t) {
                0 == t.code && o.setData({
                    goods_qrcode: t.data.pic_url
                }), 1 == t.code && (o.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
}, o(t, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), o(t, "saveGoodsQrcode", function() {
    var o = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
        title: "正在保存图片",
        mask: !1
    }), wx.downloadFile({
        url: o.data.goods_qrcode,
        success: function(o) {
            wx.showLoading({
                title: "正在保存图片",
                mask: !1
            }), wx.saveImageToPhotosAlbum({
                filePath: o.tempFilePath,
                success: function() {
                    wx.showModal({
                        title: "提示",
                        content: "商品海报保存成功",
                        showCancel: !1
                    });
                },
                fail: function(o) {
                    wx.showModal({
                        title: "图片保存失败",
                        content: o.errMsg,
                        showCancel: !1
                    });
                },
                complete: function(o) {
                    console.log(o), wx.hideLoading();
                }
            });
        },
        fail: function(t) {
            wx.showModal({
                title: "图片下载失败",
                content: t.errMsg + ";" + o.data.goods_qrcode,
                showCancel: !1
            });
        },
        complete: function(o) {
            console.log(o), wx.hideLoading();
        }
    })) : wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        showCancel: !1
    });
}), o(t, "goodsQrcodeClick", function(o) {
    var t = o.currentTarget.dataset.src;
    wx.previewImage({
        urls: [ t ]
    });
}), o(t, "goHome", function(o) {
    wx.redirectTo({
        url: "/pages/book/index/index",
        success: function(o) {},
        fail: function(o) {},
        complete: function(o) {}
    });
}), t));