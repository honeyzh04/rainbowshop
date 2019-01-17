function t(t, o, a) {
    return o in t ? Object.defineProperty(t, o, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[o] = a, t;
}

var o, a = require("../../../api.js"), e = require("../../../utils.js"), i = getApp();

Page((o = {
    data: {
        groupFail: 0,
        show_attr_picker: !1,
        form: {
            number: 1
        }
    },
    onLoad: function(t) {
        i.pageOnLoad(this);
        var o = 0, a = t.user_id;
        console.log("options=>" + JSON.stringify(t));
        var r = decodeURIComponent(t.scene);
        if (void 0 != a) o = a; else if (void 0 != r) {
            console.log("scene string=>" + r);
            var s = e.scene_decode(r);
            console.log("scene obj=>" + JSON.stringify(s)), s.uid && s.oid ? (o = s.uid, t.oid = s.oid) : o = r;
        }
        i.loginBindParent({
            parent_id: o
        }), this.setData({
            oid: t.oid
        }), this.getInfo(t);
    },
    onReady: function() {},
    onShow: function() {
        i.pageOnShow(this);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        var o = this, a = wx.getStorageSync("user_info"), e = "/pages/pt/group/details?oid=" + o.data.oid + "&user_id=" + a.id;
        return {
            title: "快来" + o.data.goods.price + "元拼  " + o.data.goods.name,
            path: e,
            success: function(t) {
                console.log(e), console.log(t);
            }
        };
    },
    getInfo: function(t) {
        var o = t.oid, e = this;
        wx.showLoading({
            title: "正在加载",
            mask: !0
        }), i.request({
            url: a.group.group_info,
            method: "get",
            data: {
                oid: o
            },
            success: function(t) {
                if (0 == t.code) {
                    0 == t.data.groupFail && e.countDownRun(t.data.limit_time_ms);
                    var o = (t.data.goods.original_price - t.data.goods.price).toFixed(2);
                    e.setData({
                        goods: t.data.goods,
                        groupList: t.data.groupList,
                        surplus: t.data.surplus,
                        limit_time_ms: t.data.limit_time_ms,
                        goods_list: t.data.goodsList,
                        group_fail: t.data.groupFail,
                        oid: t.data.oid,
                        in_group: t.data.inGroup,
                        attr_group_list: t.data.attr_group_list,
                        group_rule_id: t.data.groupRuleId,
                        reduce_price: o < 0 ? 0 : o
                    });
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
    countDownRun: function(t) {
        var o = this;
        setInterval(function() {
            var a = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]) - new Date(), e = parseInt(a / 1e3 / 60 / 60 / 24, 10), i = parseInt(a / 1e3 / 60 / 60 % 24, 10), r = parseInt(a / 1e3 / 60 % 60, 10), s = parseInt(a / 1e3 % 60, 10);
            e = o.checkTime(e), i = o.checkTime(i), r = o.checkTime(r), s = o.checkTime(s), 
            o.setData({
                limit_time: {
                    days: e,
                    hours: i,
                    mins: r,
                    secs: s
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = t > 0 ? t : 0) < 10 && (t = "0" + t), t;
    },
    goToHome: function() {
        wx.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGoodsDetails: function(t) {
        var o = this;
        wx.redirectTo({
            url: "/pages/pt/details/details?gid=" + o.data.goods.id
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
        var o = this, e = t.target.dataset.groupId, r = t.target.dataset.id, s = o.data.attr_group_list;
        for (var n in s) if (s[n].attr_group_id == e) for (var d in s[n].attr_list) s[n].attr_list[d].attr_id == r ? s[n].attr_list[d].checked = !0 : s[n].attr_list[d].checked = !1;
        o.setData({
            attr_group_list: s
        });
        var c = [], u = !0;
        for (var n in s) {
            var l = !1;
            for (var d in s[n].attr_list) if (s[n].attr_list[d].checked) {
                c.push(s[n].attr_list[d].attr_id), l = !0;
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
            url: a.group.goods_attr_info,
            data: {
                goods_id: o.data.goods.id,
                attr_list: JSON.stringify(c)
            },
            success: function(t) {
                if (wx.hideLoading(), 0 == t.code) {
                    var a = o.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, o.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY_C");
    },
    submit: function(t) {
        var o = this;
        if (console.log(o.data.show_attr_picker), !o.data.show_attr_picker) return o.setData({
            show_attr_picker: !0
        }), !0;
        if (o.data.form.number > o.data.goods.num) return wx.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var a = o.data.attr_group_list, e = [];
        for (var i in a) {
            var r = !1;
            for (var s in a[i].attr_list) if (a[i].attr_list[s].checked) {
                r = {
                    attr_id: a[i].attr_list[s].attr_id,
                    attr_name: a[i].attr_list[s].attr_name
                };
                break;
            }
            if (!r) return wx.showToast({
                title: "请选择" + a[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            e.push({
                attr_group_id: a[i].attr_group_id,
                attr_group_name: a[i].attr_group_name,
                attr_id: r.attr_id,
                attr_name: r.attr_name
            });
        }
        o.setData({
            show_attr_picker: !1
        }), wx.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: o.data.goods.id,
                attr: e,
                num: o.data.form.number,
                type: t,
                parent_id: o.data.oid,
                deliver_type: o.data.goods.type
            })
        });
    },
    numberSub: function() {
        var t = this, o = t.data.form.number;
        if (o <= 1) return !0;
        o--, t.setData({
            form: {
                number: o
            }
        });
    },
    numberAdd: function() {
        var t = this, o = t.data.form.number;
        o++, t.setData({
            form: {
                number: o
            }
        });
    },
    numberBlur: function(t) {
        var o = this, a = t.detail.value;
        a = parseInt(a), isNaN(a) && (a = 1), a <= 0 && (a = 1), o.setData({
            form: {
                number: a
            }
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && wx.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    showShareModal: function(t) {
        console.log(t), this.setData({
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
        var t = this;
        if (t.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        i.request({
            url: a.group.order.goods_qrcode,
            data: {
                order_id: t.data.oid
            },
            success: function(o) {
                0 == o.code && t.setData({
                    goods_qrcode: o.data.pic_url
                }), 1 == o.code && (t.goodsQrcodeClose(), wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
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
}, t(o, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), t(o, "saveGoodsQrcode", function() {
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
        fail: function(o) {
            wx.showModal({
                title: "图片下载失败",
                content: o.errMsg + ";" + t.data.goods_qrcode,
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
}), t(o, "goodsQrcodeClick", function(t) {
    var o = t.currentTarget.dataset.src;
    wx.previewImage({
        urls: [ o ]
    });
}), o));