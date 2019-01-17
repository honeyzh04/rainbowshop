function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a, e = require("../../../api.js"), o = require("../../../utils.js"), i = getApp(), r = require("../../../wxParse/wxParse.js");

Page((a = {
    data: {
        show_attr_picker: !1,
        form: {
            number: 1
        }
    },
    onLoad: function(t) {
        i.pageOnLoad(this);
        var a = 0, e = t.user_id;
        console.log("options=>" + JSON.stringify(t));
        var r = decodeURIComponent(t.scene);
        if (void 0 != e) a = e; else if (void 0 != r) {
            console.log("scene string=>" + r);
            var n = o.scene_decode(r);
            console.log("scene obj=>" + JSON.stringify(n)), n.uid && n.gid ? (a = n.uid, t.gid = n.gid) : a = r;
        }
        i.loginBindParent({
            parent_id: a
        }), this.setData({
            id: t.gid
        }), this.getGoodsInfo(t);
        var s = wx.getStorageSync("store");
        this.setData({
            store: s
        });
    },
    onReady: function() {},
    onShow: function() {
        i.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = this, a = wx.getStorageSync("user_info"), e = "/pages/pt/details/details?gid=" + t.data.goods.id + "&user_id=" + a.id;
        return {
            title: t.data.goods.name,
            path: e,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {
                console.log(e);
            }
        };
    },
    getGoodsInfo: function(t) {
        var a = t.gid, o = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), wx.showNavigationBarLoading(), i.request({
            url: e.group.details,
            method: "get",
            data: {
                gid: a
            },
            success: function(t) {
                if (0 == t.code) {
                    o.countDownRun(t.data.info.limit_time_ms);
                    var a = t.data.info.detail;
                    r.wxParse("detail", "html", a, o), wx.setNavigationBarTitle({
                        title: t.data.info.name
                    }), wx.hideNavigationBarLoading();
                    var e = (t.data.info.original_price - t.data.info.price).toFixed(2);
                    o.setData({
                        goods: t.data.info,
                        attr_group_list: t.data.attr_group_list,
                        limit_time: t.data.limit_time_res,
                        group_list: t.data.groupList,
                        group_num: t.data.groupList.length,
                        group_rule_id: t.data.groupRuleId,
                        comment: t.data.comment,
                        comment_num: t.data.commentNum,
                        reduce_price: e < 0 ? 0 : e
                    }), o.countDown(), o.selectDefaultAttr();
                } else wx.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && wx.redirectTo({
                            url: "/pages/pt/index/index"
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
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && "0" === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    countDown: function(t) {},
    countDownRun: function(t) {
        var a = this;
        setInterval(function() {
            var e = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]) - new Date(), o = parseInt(e / 1e3 / 60 / 60 / 24, 10), i = parseInt(e / 1e3 / 60 / 60 % 24, 10), r = parseInt(e / 1e3 / 60 % 60, 10), n = parseInt(e / 1e3 % 60, 10);
            o = a.checkTime(o), i = a.checkTime(i), r = a.checkTime(r), n = a.checkTime(n), 
            a.setData({
                limit_time: {
                    days: o < 0 ? "00" : o,
                    hours: i < 0 ? "00" : i,
                    mins: r < 0 ? "00" : r,
                    secs: n < 0 ? "00" : n
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return t < 0 ? "00" : (t < 10 && (t = "0" + t), t);
    },
    goHome: function(t) {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGroup: function(t) {
        wx.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    goToComment: function(t) {
        wx.navigateTo({
            url: "/pages/pt/comment/comment?id=" + this.data.goods.id
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && wx.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, r = t.target.dataset.id, n = a.data.attr_group_list;
        for (var s in n) if (n[s].attr_group_id == o) for (var d in n[s].attr_list) n[s].attr_list[d].attr_id == r ? n[s].attr_list[d].checked = !0 : n[s].attr_list[d].checked = !1;
        a.setData({
            attr_group_list: n
        });
        var c = [], u = !0;
        for (var s in n) {
            var l = !1;
            for (var d in n[s].attr_list) if (n[s].attr_list[d].checked) {
                c.push(n[s].attr_list[d].attr_id), l = !0;
                break;
            }
            if (!l) {
                u = !1;
                break;
            }
        }
        u && (wx.showLoading({
            title: "正在加载",
            mask: !0
        }), i.request({
            url: e.group.goods_attr_info,
            data: {
                goods_id: a.data.goods.id,
                attr_list: JSON.stringify(c)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var e = a.data.goods;
                    e.price = t.data.price, e.num = t.data.num, e.attr_pic = t.data.pic, e.original_price = t.data.single, 
                    a.setData({
                        goods: e
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY");
    },
    onlyBuy: function() {
        this.submit("ONLY_BUY");
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.form.number > a.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var e = a.data.attr_group_list, o = [];
        for (var i in e) {
            var r = !1;
            for (var n in e[i].attr_list) if (e[i].attr_list[n].checked) {
                r = {
                    attr_id: e[i].attr_list[n].attr_id,
                    attr_name: e[i].attr_list[n].attr_name
                };
                break;
            }
            if (!r) return wx.showToast({
                title: "请选择" + e[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[i].attr_group_id,
                attr_group_name: e[i].attr_group_name,
                attr_id: r.attr_id,
                attr_name: r.attr_name
            });
        }
        a.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.goods.id,
                attr: o,
                num: a.data.form.number,
                type: t,
                deliver_type: a.data.goods.type
            })
        });
    },
    numberSub: function() {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        ++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit ? wx.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }) : t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, e = t.detail.value;
        e = parseInt(e), isNaN(e) && (e = 1), e <= 0 && (e = 1), e > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit && (wx.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), e = a.data.goods.one_buy_limit), a.setData({
            form: {
                number: e
            }
        });
    }
}, t(a, "countDown", function() {
    var t = this;
    setInterval(function() {
        var a = t.data.group_list;
        for (var e in a) {
            var o = new Date(a[e].limit_time_ms[0], a[e].limit_time_ms[1] - 1, a[e].limit_time_ms[2], a[e].limit_time_ms[3], a[e].limit_time_ms[4], a[e].limit_time_ms[5]) - new Date(), i = parseInt(o / 1e3 / 60 / 60 / 24, 10), r = parseInt(o / 1e3 / 60 / 60 % 24, 10), n = parseInt(o / 1e3 / 60 % 60, 10), s = parseInt(o / 1e3 % 60, 10);
            i = t.checkTime(i), r = t.checkTime(r), n = t.checkTime(n), s = t.checkTime(s), 
            a[e].limit_time = {
                days: i,
                hours: r > 0 ? r : "00",
                mins: n > 0 ? n : "00",
                secs: s > 0 ? s : "00"
            }, t.setData({
                group_list: a
            });
        }
    }, 1e3);
}), t(a, "bigToImage", function(t) {
    var a = this.data.comment[t.target.dataset.index].pic_list;
    wx.previewImage({
        current: t.target.dataset.url,
        urls: a
    });
}), t(a, "showShareModal", function() {
    this.setData({
        share_modal_active: "active",
        no_scroll: !0
    });
}), t(a, "shareModalClose", function() {
    this.setData({
        share_modal_active: "",
        no_scroll: !1
    });
}), t(a, "getGoodsQrcode", function() {
    var t = this;
    if (t.setData({
        goods_qrcode_active: "active",
        share_modal_active: ""
    }), t.data.goods_qrcode) return !0;
    i.request({
        url: e.group.goods_qrcode,
        data: {
            goods_id: t.data.id
        },
        success: function(a) {
            0 == a.code && t.setData({
                goods_qrcode: a.data.pic_url
            }), 1 == a.code && (t.goodsQrcodeClose(), wx.showModal({
                title: "提示",
                content: a.msg,
                showCancel: !1,
                success: function(t) {
                    t.confirm;
                }
            }));
        }
    });
}), t(a, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), t(a, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), t(a, "saveGoodsQrcode", function() {
    var t = this;
    wx.saveImageToPhotosAlbum ? (wx.showLoading({
        title: "正在保存图片",
        mask: !1
    }), wx.downloadFile({
        url: t.data.goods_qrcode,
        success: function(t) {
            wx.showLoading({
                title: "正在保存图片",
                mask: !1
            }), wx.saveImageToPhotosAlbum({
                filePath: t.tempFilePath,
                success: function() {
                    wx.showModal({
                        title: "提示",
                        content: "商品海报保存成功",
                        showCancel: !1
                    });
                },
                fail: function(t) {
                    wx.showModal({
                        title: "图片保存失败",
                        content: t.errMsg,
                        showCancel: !1
                    });
                },
                complete: function(t) {
                    console.log(t), wx.hideLoading();
                }
            });
        },
        fail: function(a) {
            wx.showModal({
                title: "图片下载失败",
                content: a.errMsg + ";" + t.data.goods_qrcode,
                showCancel: !1
            });
        },
        complete: function(t) {
            console.log(t), wx.hideLoading();
        }
    })) : wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
        showCancel: !1
    });
}), t(a, "goodsQrcodeClick", function(t) {
    var a = t.currentTarget.dataset.src;
    wx.previewImage({
        urls: [ a ]
    });
}), t(a, "to_dial", function() {
    var t = this.data.store.contact_tel;
    wx.makePhoneCall({
        phoneNumber: t
    });
}), a));