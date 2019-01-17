var t = require("../../../api.js"), a = getApp();

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        a.pageOnLoad(this), this.setData({
            store: wx.getStorageSync("store")
        });
    },
    onShow: function() {
        a.pageOnShow(this), this.loadData();
    },
    loadData: function(o) {
        var r = this;
        a.request({
            url: t.quick.quick,
            success: function(t) {
                if (0 == t.code) if (0 == r.data.quick_list.length) {
                    for (var a = [], o = t.data.list, i = o.length, e = 0; e < i; e++) 0 != o[e].goods.length && a.push(o[e]);
                    for (var s = a.length, d = [], n = 0; n < s; n++) d.push(a[n].goods);
                    for (var c = [].concat.apply([], d), _ = c.length, g = [], l = 0; l < _; l++) 1 == c[l].hot_cakes && g.push(c[l]);
                    for (n = 0; n < g.length; n++) for (var u = n + 1; u < g.length; ) g[n].id == g[u].id ? g.splice(u, 1) : u++;
                    r.setData({
                        quick_list: a,
                        quick_hot_goods_lists: g
                    });
                } else {
                    var a = wx.getStorageSync("quick_lists"), p = wx.getStorageSync("carGoods"), h = wx.getStorageSync("total"), f = wx.getStorageSync("check_num"), g = wx.getStorageSync("quick_hot_goods_lists");
                    a && (r.setData({
                        quick_list: a
                    }), wx.removeStorageSync("quick_lists")), p && (r.setData({
                        carGoods: p
                    }), wx.removeStorageSync("carGoods")), h && (r.setData({
                        total: h
                    }), wx.removeStorageSync("total")), f && (r.setData({
                        check_num: f
                    }), wx.removeStorageSync("check_num")), g && (r.setData({
                        quick_hot_goods_lists: g
                    }), wx.removeStorageSync("quick_hot_goods_lists"));
                }
            }
        });
    },
    selectMenu: function(t) {
        var a = t.currentTarget.dataset, o = this.data.quick_list;
        if ("hot_cakes" == a.tag) for (var r = !0, i = o.length, e = 0; e < i; e++) o[e].cat_checked = !1; else {
            for (var s = a.index, i = o.length, e = 0; e < i; e++) o[e].cat_checked = !1, o[e].id == o[s].id && (o[e].cat_checked = !0);
            r = !1;
        }
        this.setData({
            toView: a.tag,
            selectedMenuId: a.id,
            quick_list: o,
            cat_checked: r
        });
    },
    onShareAppMessage: function(t) {
        var o = this;
        return {
            path: "/pages/index/index?user_id=" + wx.getStorageSync("user_info").id,
            success: function(t) {
                1 == ++share_count && a.shareSendCoupon(o);
            }
        };
    },
    jia: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.quick_list, i = r.length, e = [], s = 0; s < i; s++) for (var d = r[s].goods, n = d.length, c = 0; c < n; c++) e.push(d[c]);
        for (var _ = e.length, g = [], l = 0; l < _; l++) e[l].id == o.id && g.push(e[l]);
        for (var n = g.length, u = 0; u < n; u++) g[u].num += 1;
        var p = parseFloat(g[0].price * g[0].num), h = a.data.carGoods, f = {
            goods_id: g[0].id,
            num: 1,
            goods_name: g[0].name,
            attr: "",
            goods_price: p.toFixed(2),
            price: g[0].price
        }, m = !0;
        if ((i = h.length) <= 0) h.push(f); else {
            for (c = 0; c < i; c++) h[c].goods_id == g[0].id && (h[c].num += 1, h[c].goods_price = p.toFixed(2), 
            m = !1);
            m && h.push(f);
        }
        var v = h.find(function(t) {
            return t.goods_id == o.id;
        }), k = JSON.parse(g[0].attr);
        if (v.num > k[0].num) {
            wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), v.num = k[0].num;
            for (var S = 0; S < n; S++) g[S].num -= 1;
        } else {
            var q = a.data.total;
            q.total_num += 1, g[0].price = parseFloat(g[0].price), q.total_price = parseFloat(q.total_price), 
            q.total_price += g[0].price, q.total_price = q.total_price.toFixed(2);
            var w = a.data.quick_hot_goods_lists;
            w.find(function(t) {
                return t.id == o.id;
            }).num += 1, a.setData({
                quick_list: r,
                total: q,
                carGoods: h,
                quick_hot_goods_lists: w
            });
        }
    },
    jian: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.quick_list, i = r.length, e = [], s = 0; s < i; s++) for (var d = r[s].goods, n = d.length, c = 0; c < n; c++) e.push(d[c]);
        for (var _ = e.length, g = [], l = 0; l < _; l++) e[l].id == o.id && g.push(e[l]);
        for (var n = g.length, u = 0; u < n; u++) g[u].num -= 1;
        var p = a.data.total;
        p.total_num -= 1, g[0].price = parseFloat(g[0].price), p.total_price = parseFloat(p.total_price), 
        p.total_price -= g[0].price, p.total_price = p.total_price.toFixed(2);
        var h = a.data.quick_hot_goods_lists;
        h.find(function(t) {
            return t.id == o.id;
        }).num -= 1, a.setData({
            quick_list: r,
            total: p,
            quick_hot_goods_lists: h
        });
        var f = a.data.carGoods, m = f.find(function(t) {
            return t.goods_id == o.id;
        });
        m.num -= 1, m.goods_price = parseFloat(m.goods_price), m.goods_price -= g[0].price, 
        m.goods_price = m.goods_price.toFixed(2), a.setData({
            carGoods: f
        });
    },
    showDialogBtn: function(o) {
        var r = this, i = o.currentTarget.dataset.id, e = o.currentTarget.dataset;
        if (a.request({
            url: t.default.goods,
            data: {
                id: i
            },
            success: function(t) {
                0 == t.code && r.setData({
                    data: e,
                    attr_group_list: t.data.attr_group_list,
                    showModal: !0
                });
            }
        }), e.cid) s = r.data.quick_list.find(function(t) {
            return t.id == e.cid;
        }).goods.find(function(t) {
            return t.id == e.id;
        }); else var s = r.data.quick_hot_goods_lists.find(function(t) {
            return t.id == e.id;
        });
        for (var d = JSON.parse(s.attr), n = d.length, c = 0; c < n; c++) d[c].check_num = 0;
        r.setData({
            goods: s,
            goods_name: s.name,
            attr: d
        });
        var _ = r.data.carGoods, g = _.length;
        if (g >= 1) for (c = 0; c < g; c++) JSON.stringify(s.name) != JSON.stringify(_[c].goods_name) && r.setData({
            check_num: !1,
            check_goods_price: !1
        });
    },
    close: function(t) {
        this.setData({
            showModal: !1
        });
    },
    attrClick: function(t) {
        var a = this, o = t.target.dataset.groupId, r = t.target.dataset.id, i = a.data.attr_group_list;
        for (var e in i) if (i[e].attr_group_id == o) for (var s in i[e].attr_list) i[e].attr_list[s].attr_id == r ? i[e].attr_list[s].checked = !0 : i[e].attr_list[s].checked = !1;
        for (var d = i.length, n = [], c = [], _ = 0; _ < d; _++) for (var g = i[_].attr_list, l = g.length, e = 0; e < l; e++) if (1 == g[e].checked) {
            var u = {
                attr_group_id: i[_].attr_group_id,
                attr_group_name: i[_].attr_group_name,
                attr_id: g[e].attr_id,
                attr_name: g[e].attr_name
            };
            c.push(u);
            var p = {
                attr_id: g[e].attr_id,
                attr_name: g[e].attr_name
            };
            n.push(p);
        }
        for (var h = a.data.attr, f = h.length, m = 0; m < f; m++) if (JSON.stringify(h[m].attr_list) == JSON.stringify(n)) var v = h[m].price;
        a.setData({
            attr_group_list: i,
            check_goods_price: v,
            check_attr_list: n
        });
        for (var k = a.data.carGoods, S = a.data.carGoods.length, q = a.data.goods, w = 0, _ = 0; _ < S; _++) if (k[_].goods_id == q.id && JSON.stringify(k[_].attr) == JSON.stringify(c)) {
            w = k[_].num;
            break;
        }
        a.setData({
            check_num: w
        });
    },
    onConfirm: function(t) {
        var a = this, o = (a.data.attr_group, a.data.attr_group_list), r = [];
        for (var i in o) {
            s = !1;
            for (var e in o[i].attr_list) if (o[i].attr_list[e].checked) {
                s = {
                    attr_id: o[i].attr_list[e].attr_id,
                    attr_name: o[i].attr_list[e].attr_name
                };
                break;
            }
            if (!s) return wx.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        a.setData({
            attr_group_list: o
        });
        for (var s = a.data.attr, d = a.data.check_attr_list, n = s.length, c = 0; c < n; c++) if (JSON.stringify(s[c].attr_list) == JSON.stringify(d)) var _ = s[c].num;
        for (var g = a.data.data, l = a.data.quick_list, u = l.length, p = [], i = 0; i < u; i++) for (var h = l[i].goods, f = h.length, m = 0; m < f; m++) p.push(h[m]);
        for (var v = p.length, k = [], c = 0; c < v; c++) p[c].id == g.id && k.push(p[c]);
        a.setData({
            checked_attr_list: r
        });
        for (var n = r.length, S = [], m = 0; m < n; m++) S.push(r[m].attr_id);
        var q = a.data.carGoods, w = a.data.check_goods_price;
        if (0 == w) x = parseFloat(k[0].price); else var x = parseFloat(w);
        var D = {
            goods_id: k[0].id,
            num: 1,
            goods_name: k[0].name,
            attr: r,
            goods_price: x,
            price: x
        }, y = !0, F = 0;
        if ((u = q.length) <= 0) F = 1, q.push(D); else {
            for (m = 0; m < u; m++) q[m].goods_id == k[0].id && JSON.stringify(q[m].attr) == JSON.stringify(r) && (q[m].num += 1, 
            F = q[m].num, y = !1);
            y && (q.push(D), F = 1);
        }
        if (F > _) {
            wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), F = _;
            for (m = 0; m < u; m++) q[m].goods_id == k[0].id && JSON.stringify(q[m].attr) == JSON.stringify(r) && (q[m].num = _);
        } else {
            for (m = 0; m < u; m++) q[m].goods_id == k[0].id && JSON.stringify(q[m].attr) == JSON.stringify(r) && (q[m].goods_price = parseFloat(q[m].goods_price), 
            q[m].goods_price += x, q[m].goods_price = q[m].goods_price.toFixed(2));
            for (var f = k.length, G = 0; G < f; G++) k[G].num += 1;
            var O = a.data.total;
            O.total_num += 1, O.total_price = parseFloat(O.total_price), O.total_price += x, 
            O.total_price = O.total_price.toFixed(2);
            var J = a.data.quick_hot_goods_lists;
            J.find(function(t) {
                return t.id == g.id;
            }).num += 1, a.setData({
                quick_hot_goods_lists: J,
                quick_list: l,
                carGoods: q,
                total: O,
                check_num: F
            });
        }
    },
    preventTouchMove: function() {},
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    guigejian: function(t) {
        for (var a = this, o = a.data.data, r = a.data.goods, i = r.id, e = a.data.quick_list, s = e.length, d = [], n = 0; n < s; n++) for (var c = e[n].goods, _ = c.length, g = 0; g < _; g++) d.push(c[g]);
        for (var l = d.length, u = [], p = 0; p < l; p++) r.id == d[p].id && u.push(d[p]);
        for (var h = u.length, f = 0; f < h; f++) u[f].num -= 1;
        var m = a.data.quick_hot_goods_lists;
        m.find(function(t) {
            return t.id == o.id;
        }).num -= 1, a.setData({
            quick_hot_goods_lists: m,
            quick_list: e
        });
        var v = a.data.attr_group_list, k = [];
        for (var n in v) {
            var S = !1;
            for (var q in v[n].attr_list) if (v[n].attr_list[q].checked) {
                S = {
                    attr_id: v[n].attr_list[q].attr_id,
                    attr_name: v[n].attr_list[q].attr_name
                };
                break;
            }
            if (!S) return wx.showToast({
                title: "请选择" + v[n].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            k.push({
                attr_group_id: v[n].attr_group_id,
                attr_group_name: v[n].attr_group_name,
                attr_id: S.attr_id,
                attr_name: S.attr_name
            });
        }
        for (var w = a.data.check_num, x = a.data.carGoods, s = x.length, g = 0; g < s; g++) x[g].goods_id == i && JSON.stringify(x[g].attr) == JSON.stringify(k) && (x[g].num -= 1, 
        w = x[g].num);
        a.setData({
            check_num: w
        });
        var D = a.data.total;
        D.total_num -= 1;
        var y = a.data.check_goods_price;
        y = parseFloat(y), D.total_price = parseFloat(D.total_price), D.total_price -= y, 
        D.total_price = D.total_price.toFixed(2), a.setData({
            total: D
        }), 0 == D.total_num && a.setData({
            goodsModel: !1
        });
    },
    goodsModel: function(t) {
        var a = this, o = (a.data.carGoods, a.data.goodsModel);
        o ? a.setData({
            goodsModel: !1
        }) : a.setData({
            goodsModel: !0
        });
    },
    hideGoodsModel: function() {
        this.setData({
            goodsModel: !1
        });
    },
    tianjia: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.quick_list, i = r.length, e = [], s = 0; s < i; s++) for (var d = r[s].goods, n = d.length, c = 0; c < n; c++) e.push(d[c]);
        for (var _ = e.length, g = [], l = 0; l < _; l++) e[l].id == o.id && g.push(e[l]);
        var u = JSON.parse(g[0].attr);
        if (1 == u.length) {
            var p = (m = a.data.carGoods).find(function(t) {
                return t.goods_id == o.id;
            });
            if (p.num += 1, p.num > u[0].num) return wx.showToast({
                title: "商品库存不足",
                image: "/images/icon-warning.png"
            }), void (p.num -= 1);
            p.goods_price = parseFloat(p.goods_price), o.price = parseFloat(o.price), p.goods_price += o.price, 
            p.goods_price = p.goods_price.toFixed(2);
            for (var h = g.length, f = 0; f < h; f++) g[f].num += 1;
        } else {
            for (var h = g.length, f = 0; f < h; f++) g[f].num += 1;
            for (var m = a.data.carGoods, v = m.length, k = [], c = 0; c < v; c++) if (o.index == c) for (var S = m[c].attr, q = S.length, s = 0; s < q; s++) {
                var w = {
                    attr_id: S[s].attr_id,
                    attr_name: S[s].attr_name
                };
                k.push(w);
            }
            for (var x = u.length, s = 0; s < x; s++) if (JSON.stringify(u[s].attr_list) == JSON.stringify(k)) var D = u[s].num;
            for (c = 0; c < v; c++) if (o.index == c && (m[c].num += 1, m[c].goods_price = parseFloat(m[c].goods_price), 
            o.price = parseFloat(o.price), m[c].goods_price += o.price, m[c].goods_price = m[c].goods_price.toFixed(2), 
            m[c].num > D)) {
                wx.showToast({
                    title: "商品库存不足",
                    image: "/images/icon-warning.png"
                }), m[c].num -= 1;
                for (var h = g.length, f = 0; f < h; f++) g[f].num -= 1;
                return m[c].goods_price -= o.price, void (m[c].goods_price = m[c].goods_price.toFixed(2));
            }
        }
        var y = a.data.total;
        y.total_num += 1, y.total_price = parseFloat(y.total_price), o.price = parseFloat(o.price), 
        y.total_price += o.price, y.total_price = y.total_price.toFixed(2);
        var F = a.data.quick_hot_goods_lists;
        F.find(function(t) {
            return t.id == o.id;
        }).num += 1, a.setData({
            quick_list: r,
            carGoods: m,
            total: y,
            quick_hot_goods_lists: F
        });
    },
    jianshao: function(t) {
        for (var a = this, o = t.currentTarget.dataset, r = a.data.carGoods, i = r.length, e = 0; e < i; e++) if (o.index == e) {
            if (r[e].num <= 0) return;
            r[e].num -= 1, o.price = parseFloat(o.price), r[e].goods_price = parseFloat(r[e].goods_price), 
            r[e].goods_price -= o.price, r[e].goods_price = r[e].goods_price.toFixed(2);
        }
        a.setData({
            carGoods: r
        });
        for (var s = a.data.quick_list, i = s.length, d = [], n = 0; n < i; n++) for (var c = s[n].goods, _ = c.length, e = 0; e < _; e++) d.push(c[e]);
        for (var g = [], l = d.length, e = 0; e < l; e++) o.id == d[e].id && g.push(d[e]);
        for (var u = g.length, p = 0; p < u; p++) g[p].id == o.id && (g[p].num -= 1);
        a.setData({
            quick_list: s
        });
        var h = a.data.total;
        h.total_num -= 1, h.total_price = parseFloat(h.total_price), h.total_price -= o.price, 
        h.total_price = h.total_price.toFixed(2);
        var f = a.data.quick_hot_goods_lists;
        f.find(function(t) {
            return t.id == o.id;
        }).num -= 1, a.setData({
            total: h,
            quick_hot_goods_lists: f
        }), 0 == h.total_num && a.setData({
            goodsModel: !1
        });
    },
    clearCar: function(t) {
        for (var a = this, o = (t.currentTarget.dataset, a.data.quick_list), r = o.length, i = 0; i < r; i++) for (var e = o[i].goods, s = e.length, d = 0; d < s; d++) e[d].num = 0;
        a.setData({
            quick_list: o
        });
        for (var n = a.data.carGoods, r = n.length, i = 0; i < r; i++) n[i].num = 0, n[i].goods_price = 0, 
        a.setData({
            carGoods: n
        });
        var c = a.data.total;
        c.total_num = 0, c.total_price = 0, a.setData({
            total: c
        });
        for (var _ = a.data.quick_hot_goods_lists, g = _.length, l = 0; l < g; l++) _[l].num = 0, 
        a.setData({
            quick_hot_goods_lists: _
        });
        a.data.check_num;
        a.setData({
            check_num: 0,
            goodsModel: !1
        });
    },
    buynow: function(t) {
        var a = this, o = a.data.carGoods, r = a.data.quick_list;
        wx.setStorageSync("quick_list", r);
        o = a.data.carGoods;
        wx.setStorageSync("carGoods", o);
        var i = a.data.total;
        wx.setStorageSync("total", i);
        var e = a.data.check_num;
        wx.setStorageSync("check_num", e);
        var s = a.data.quick_hot_goods_lists;
        wx.setStorageSync("quick_hot_goods_lists", s);
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var d = o.length, n = [], c = [], _ = 0; _ < d; _++) 0 != o[_].num && (c = {
            id: o[_].goods_id,
            num: o[_].num,
            attr: o[_].attr
        }, n.push(c));
        wx.navigateTo({
            url: "/pages/order-submit/order-submit?cart_list=" + JSON.stringify(n)
        });
    }
});